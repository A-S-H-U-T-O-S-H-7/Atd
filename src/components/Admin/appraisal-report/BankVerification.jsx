import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Building2, Save, CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { bankVerificationService, appraisalCoreService } from '@/lib/services/appraisal';
import { bankFormValidationSchema } from '@/lib/schema/bankVerificationSchema';

const BankVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [submittingBank, setSubmittingBank] = useState(false);
  const [localRemarkValue, setLocalRemarkValue] = useState(formik.values.bankVerificationRemark || '');
  const [bankData, setBankData] = useState(null);
  const [loadingBankData, setLoadingBankData] = useState(false);
  const timeoutRef = useRef(null);

  // CSS Classes
  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-semibold mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const buttonClassName = `px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  // Effects
  useEffect(() => {
    setLocalRemarkValue(formik.values.bankVerificationRemark || '');
  }, [formik.values.bankVerificationRemark]);

  useEffect(() => {
    const loadBankData = async () => {
      if (!formik.values.applicationId) return;
      
      try {
        setLoadingBankData(true);
        const response = await appraisalCoreService.getAppraisalReport(formik.values.applicationId);
        const applicationData = response?.data?.application || response?.application || response?.data;
        setBankData(bankVerificationService.extractBankData(applicationData));
      } catch (error) {
        toast.error('Failed to load bank information');
        setBankData(null);
      } finally {
        setLoadingBankData(false);
      }
    };
    
    loadBankData();
  }, [formik.values.applicationId]);

  // Debounced remark save
  const debouncedSaveRemark = useCallback((value) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        if (!value || value.trim().length === 0 || !formik.values.applicationId) return;

        setRemarkSaving(true);
        await bankVerificationService.saveBankRemark({
          application_id: parseInt(formik.values.applicationId),
          remarks: value.trim()
        });
      } catch (error) {
        // Error handled in service
      } finally {
        setRemarkSaving(false);
      }
    }, 3000);
  }, [formik.values.applicationId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handlers
  const handleRemarkChange = (value) => {
    setLocalRemarkValue(value);
    debouncedSaveRemark(value);
    formik.setFieldValue('bankVerificationRemark', value);
  };

  const handleSaveBankVerification = async () => {
    try {
      setSubmittingBank(true);
      
      // Validate form fields
      try {
        await bankFormValidationSchema.validate(formik.values, { abortEarly: false });
      } catch (validationError) {
        const firstError = validationError.errors[0] || validationError.message;
        toast.error(firstError);
        return;
      }
      
      const bankVerificationData = bankVerificationService.formatBankVerificationData(
        formik.values.applicationId,
        formik.values,
        bankData?.existingEmi || 0
      );
      
      await bankVerificationService.saveBankVerificationData(bankVerificationData);
      
      // Don't call onSectionSave - it would trigger duplicate save
      // Component handles save directly
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setSubmittingBank(false);
    }
  };

  const openBankStatement = async () => {
    if (!bankData?.bankStatement) {
      toast.error('No bank statement available');
      return;
    }
    
    try {
      const filePath = `bank-statement/${bankData.bankStatement}`;
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        toast.error('Popup blocked! Please allow popups for this site.');
      }
    } catch (error) {
      toast.error('Failed to open bank statement');
    }
  };

  const statusIndicator = (status) => {
    const isPositive = status === 'Verified' || status === 'Yes' || status === 'Positive';
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
        isDark
          ? isPositive ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
          : isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {isPositive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        <span>{status || 'Pending'}</span>
      </div>
    );
  };

  const VerificationField = ({ label, verified, status, onVerifiedChange, onStatusChange, accountNumber }) => (
    <div className={`p-3 rounded-lg border transition-all duration-200 ${
      isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {label}
        </span>
        {statusIndicator(status)}
      </div>

      {accountNumber && (
        <div className="mb-2">
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Account: <span className="font-medium">{accountNumber}</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <select value={verified} onChange={(e) => onVerifiedChange(e.target.value)} className={selectClassName}>
          <option value="">Verified</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <select value={status} onChange={(e) => onStatusChange(e.target.value)} className={selectClassName}>
          <option value="">Status</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className={`rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/30 shadow-emerald-900/10 hover:shadow-emerald-900/20"
        : "bg-white border-emerald-200 shadow-emerald-500/5 hover:shadow-emerald-500/10"
    }`}>
      
      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? "border-gray-700 bg-gray-800/80" : "border-gray-100 bg-emerald-50/50"
      }`}>
        <div className="flex items-center space-x-2">
          <Building2 className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
            Bank Verification
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        
        {/* Remarks */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className={labelClassName}>Bank Verification Remarks</label>
            {remarkSaving && (
              <div className={`text-xs flex items-center space-x-1 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Saving...</span>
              </div>
            )}
          </div>
          <textarea
            rows="3"
            value={localRemarkValue}
            onChange={(e) => handleRemarkChange(e.target.value)}
            className={textareaClassName}
            placeholder="Enter bank verification remarks..."
          />
          <div className={`flex justify-between items-center mt-2 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <span>{(localRemarkValue?.length || 0)} characters</span>
            <span>💾 Auto-saves after 2 seconds</span>
          </div>
        </div>

        {/* Bank Statement */}
        <div className="mb-6">
          <h4 className={`font-medium mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}>Bank Statements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-2 rounded-md border transition-all duration-200 ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center justify-between">
                <h5 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>1st Bank Statement</h5>
                <button
                  type="button"
                  onClick={openBankStatement}
                  disabled={!bankData?.bankStatement}
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                    !bankData?.bankStatement
                      ? isDark ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : isDark
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>{bankData?.bankStatement ? 'View PDF' : 'No PDF'}</span>
                  {bankData?.bankStatement && <ExternalLink className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <VerificationField
              label="Auto Verification"
              verified={formik.values.bankAutoVerification}
              status={formik.values.bankAutoVerificationStatus}
              onVerifiedChange={(value) => formik.setFieldValue('bankAutoVerification', value)}
              onStatusChange={(value) => formik.setFieldValue('bankAutoVerificationStatus', value)}
            />

            <VerificationField
              label="Is salary account?"
              verified={formik.values.bankIsSalaryAccount}
              status={formik.values.bankIsSalaryAccountStatus}
              onVerifiedChange={(value) => formik.setFieldValue('bankIsSalaryAccount', value)}
              onStatusChange={(value) => formik.setFieldValue('bankIsSalaryAccountStatus', value)}
              accountNumber={bankData?.accountNumber}
            />

            {/* Regular Salary Credits with conditional fields - FIXED */}
            <div className={`p-3 rounded-lg border transition-all duration-200 ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Regular Salary Credits?
                </span>
                {statusIndicator(formik.values.bankSalaryCreditedRegular)}
              </div>

              <div className="space-y-2">
                <select
                  value={formik.values.bankSalaryCreditedRegular}
                  onChange={(e) => formik.setFieldValue('bankSalaryCreditedRegular', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <select
                  value={formik.values.bankSalaryCreditedRegularStatus}
                  onChange={(e) => formik.setFieldValue('bankSalaryCreditedRegularStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select Status</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>

                {/* ✅ Fixed conditional fields with new field names */}
                {formik.values.bankSalaryCreditedRegular === 'Yes' && (
                  <div>
                    <label className={labelClassName}>Salary Credit Date</label>
                    <select
                      value={formik.values.bankSalaryDate}
                      onChange={(e) => formik.setFieldValue('bankSalaryDate', e.target.value)}
                      className={selectClassName}
                    >
                      <option value="">Select Date</option>
                      <option value="1st">1st of Month</option>
                      <option value="7th">7th of Month</option>
                      <option value="15th">15th of Month</option>
                      <option value="30th">30th of Month</option>
                    </select>
                  </div>
                )}

                {formik.values.bankSalaryCreditedRegular === 'No' && (
                  <div>
                    <label className={labelClassName}>Remark</label>
                    <textarea
                      rows="2"
                      value={formik.values.bankSalaryCreditRemark}
                      onChange={(e) => formik.setFieldValue('bankSalaryCreditRemark', e.target.value)}
                      className={textareaClassName}
                      placeholder="Enter reason for irregular salary credits..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* EMI Section - FIXED */}
            <div className={`p-3 rounded-lg border transition-all duration-200 ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Any EMI Debited?
                </span>
                {statusIndicator(formik.values.bankAnyEmiDebited)} 
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isDark ? "text-blue-500" : "text-blue-800"}`}>
                    Existing EMI Amount - ₹{bankData?.existingEmi || 0}
                  </h4>
                </div>

                <div>
                  <label className={labelClassName}>Is EMI Debited in Bank Statement?</label>
                  <select
                    value={formik.values.bankAnyEmiDebited} 
                    onChange={(e) => formik.setFieldValue('bankAnyEmiDebited', e.target.value)} 
                    className={selectClassName}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                
                  <>
                    <div>
                      <label className={labelClassName}>EMI Amount in Statement</label> {/* ✅ Added label */}
                      <input
                        type="number"
                        value={formik.values.bankEmiAmountInStatement}
                        onChange={(e) => formik.setFieldValue('bankEmiAmountInStatement', e.target.value)}
                        className={inputClassName}
                        placeholder="Enter EMI amount"
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>Is this EMI with bank statement?</label>
                      <select
                        value={formik.values.bankIsEmiWithBankStatement}
                        onChange={(e) => formik.setFieldValue('bankIsEmiWithBankStatement', e.target.value)}
                        className={selectClassName}
                      >
                      <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </>
                
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="w-full md:w-auto">
            <label className={labelClassName}>Final Report</label>
            <select
              value={formik.values.bankVerificationFinalReport}
              onChange={(e) => formik.setFieldValue('bankVerificationFinalReport', e.target.value)}
              className={selectClassName}
              style={{ minWidth: '200px' }}
            >
              <option value="">Select Final Report</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
          
          <button
            type="button"
            onClick={handleSaveBankVerification}
            disabled={submittingBank || saving}
            className={buttonClassName}
          >
            {submittingBank ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{submittingBank ? 'Saving...' : 'Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankVerification;