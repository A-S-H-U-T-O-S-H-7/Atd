import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Building2, Save, Upload, CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { bankVerificationService, appraisalCoreService } from '@/lib/services/appraisal';

const BankVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [submittingBank, setSubmittingBank] = useState(false);
  const [localRemarkValue, setLocalRemarkValue] = useState(formik.values.bankVerificationRemark || '');
  const [bankData, setBankData] = useState(null);
  const [loadingBankData, setLoadingBankData] = useState(false);
  const timeoutRef = useRef(null);
  const formikUpdateTimeoutRef = useRef(null);
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

  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-semibold mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  const submitButtonClassName = `px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  // Sync external changes to local state
  useEffect(() => {
    setLocalRemarkValue(formik.values.bankVerificationRemark || '');
  }, [formik.values.bankVerificationRemark]);

  // Load bank data from API
  useEffect(() => {
    const loadBankData = async () => {
      if (!formik.values.applicationId) return;
      
      try {
        setLoadingBankData(true);
        if (!formik.values.applicationId) {
          toast.error('No application ID found');
          return;
        }
        
        const response = await appraisalCoreService.getAppraisalReport(formik.values.applicationId);
        
        const applicationData = response?.data?.application || response?.application || response?.data;
        
        if (applicationData && applicationData.account_no) {
          const bankInfo = {
            bankName: applicationData.bank_name || '',
            accountNumber: applicationData.account_no || '',
            accountType: applicationData.account_type || '',
            ifscCode: applicationData.ifsc_code || '',
            branchName: applicationData.branch_name || '',
            existingEmi: parseFloat(applicationData.existing_emi) || 0,
            bankStatement: applicationData.bank_statement || ''
          };
          setBankData(bankInfo);
        }
      } catch (error) {
        toast.error('Failed to load bank information');
        setBankData(null);
      } finally {
        setLoadingBankData(false);
      }
    };
    
    loadBankData();
  }, [formik.values.applicationId]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (formikUpdateTimeoutRef.current) {
        clearTimeout(formikUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Debounced save function for bank remarks
  const debouncedSaveRemark = useCallback((value) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        if (!value || value.trim().length === 0) {
          return;
        }

        if (!formik.values.applicationId) {
          return;
        }

        setRemarkSaving(true);
        
        const remarkData = {
          application_id: parseInt(formik.values.applicationId),
          remarks: value.trim()
        };
        
        await bankVerificationService.saveBankRemarks(remarkData);
        toast.success('Bank remark saved successfully!');
      } catch (error) {
        if (error.response?.status === 422) {
          const errorMessage = error.response?.data?.message || 'Invalid remark data';
          toast.error(errorMessage);
        } else {
          toast.error('Failed to save bank remark');
        }
      } finally {
        setRemarkSaving(false);
      }
    }, 3000);
  }, []);

  // Optimized remark change handler
  const handleRemarkChange = (value) => {
    setLocalRemarkValue(value);
    
    if (formikUpdateTimeoutRef.current) {
      clearTimeout(formikUpdateTimeoutRef.current);
    }
    formikUpdateTimeoutRef.current = setTimeout(() => {
      formik.setFieldValue('bankVerificationRemark', value);
    }, 500);
    
    debouncedSaveRemark(value);
  };

  // Save bank verification
  const handleSaveBankVerification = async () => {
    try {
      setSubmittingBank(true);
      
      if (!formik.values.applicationId || isNaN(parseInt(formik.values.applicationId))) {
        toast.error('Invalid application ID. Please refresh the page.');
        return;
      }
      
      const bankVerificationData = {
        application_id: parseInt(formik.values.applicationId),
        auto_verification: formik.values.salaryAutoVerification || '',
        auto_verification_status: formik.values.salaryAutoVerificationStatus || '',
        is_salary_account: formik.values.isSalaryAccount || '',
        is_salary_account_status: formik.values.isSalaryAccountStatus || '',
        regural_interval: formik.values.salaryCreditedRegular || '',
        regural_interval_status: formik.values.salaryCreditedRegularStatus || '',
        salary_date: formik.values.salaryDate || '',
        salary_remark: formik.values.bankVerificationRemark || '',
        emi_debit: formik.values.anyEmiDebited || '',
        emi_amount: parseInt(formik.values.salaryAmount) || 0,
        emi_with_bank_statement: formik.values.isEmiWithBankStatement || '',
        bankstatement_final_report: formik.values.bankVerificationFinalReport || ''
      };
      
      await bankVerificationService.saveBankVerification(bankVerificationData);
      toast.success('Bank verification completed successfully!');
      
      if (onSectionSave) {
        onSectionSave();
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || 'Invalid bank data. Please check all fields.';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to save bank verification');
      }
    } finally {
      setSubmittingBank(false);
    }
  };

  // Function to open bank statement PDF in new tab using Firebase
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
      } else {
        toast.success('Bank statement opened successfully!');
      }
    } catch (error) {
      toast.error(`Failed to open bank statement: ${bankData.bankStatement}`);
    }
  };

  const bankOptions = [
    { value: '', label: '--Select Bank--' },
    { value: 'SBI', label: 'State Bank of India' },
    { value: 'HDFC', label: 'HDFC Bank' },
    { value: 'ICICI', label: 'ICICI Bank' },
    { value: 'AXIS', label: 'Axis Bank' },
    { value: 'KOTAK', label: 'Kotak Mahindra Bank' },
    { value: 'CANARA', label: 'Canara Bank' },
    { value: 'PNB', label: 'Punjab National Bank' },
    { value: 'BOB', label: 'Bank of Baroda' },
    { value: 'UNION', label: 'Union Bank of India' },
    { value: 'INDUSIND', label: 'IndusInd Bank' },
  ];

  const salaryDateOptions = [
    { value: '', label: '--Select Date--' },
    { value: '1st', label: '1st of Month' },
    { value: '7th', label: '7th of Month' },
    { value: '15th', label: '15th of Month' },
    { value: '30th', label: '30th of Month' },
  ];


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

  const BankStatementBlock = ({ title, bankName, onBankChange, onFileUpload, onSubmit }) => (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}>
      <h4 className={`font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {title}
      </h4>
      
      <div className="space-y-3">
        <div>
          <label className={labelClassName}>Choose Bank</label>
          <select
            value={bankName}
            onChange={onBankChange}
            className={selectClassName}
          >
            {bankOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName}>Upload Statement</label>
          <div className="flex space-x-2">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onFileUpload}
              className="hidden"
              id={`file-${title.toLowerCase().replace(' ', '-')}`}
            />
            <label
              htmlFor={`file-${title.toLowerCase().replace(' ', '-')}`}
              className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-200 text-sm cursor-pointer text-center ${
                isDark
                  ? "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500 hover:border-emerald-500"
                  : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 hover:border-emerald-400"
              }`}
            >
              <Upload className="w-4 h-4 inline mr-1" />
              Choose File
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className={`w-full px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm ${
            isDark
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <span>Submit</span>
        </button>
      </div>
    </div>
  );

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
            Account Number: <span className="font-medium">{accountNumber}</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <select
          value={verified}
          onChange={(e) => onVerifiedChange(e.target.value)}
          className={selectClassName}
        >
          <option value="">Verified</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={selectClassName}
        >
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
          <Building2 className={`w-5 h-5 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Bank Verification
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        

        {/* Remarks Input - Auto-save */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className={labelClassName}>Bank Verification Remarks</label>
            {remarkSaving && (
              <div className={`text-xs flex items-center space-x-1 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}>
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
            placeholder="Enter bank verification remarks and observations..."
          />
          <div className={`flex justify-between items-center mt-2 text-xs ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            <span>{(localRemarkValue?.length || 0)} characters</span>
            <span>💾 Auto-saves after 2 seconds</span>
          </div>
        </div>

        {/* Bank Statements Section */}
        <div className="mb-6">
          <h4 className={`font-medium mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            Bank Statements
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1st Bank Statement with PDF Viewer */}
            <div className={`p-2 rounded-md border transition-all duration-200 ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center justify-between ">
                <h5 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  1st Bank Statement
                </h5>
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
                  title={bankData?.bankStatement ? "Open bank statement in new tab" : "No bank statement available"}
                >
                  <FileText className="w-3 h-3" />
                  <span>{bankData?.bankStatement ? 'View PDF' : 'No PDF'}</span>
                  {bankData?.bankStatement && <ExternalLink className="w-3 h-3" />}
                </button>
              </div>
              
              
            </div>

           
          </div>
        </div>

        {/* Bank Statement - Single block */}
        <div className="mb-6">
          <BankStatementBlock
            title="2nd Bank Statement"
            bankName={formik.values.bankName}
            onBankChange={(e) => formik.setFieldValue('bankName', e.target.value)}
            onFileUpload={(e) => {
              const file = e.target.files[0];
              if (file) {
                formik.setFieldValue('bankStatement', file);
                // Handle file upload logic here
              }
            }}
            onSubmit={() => {
              // Handle submit logic here
              console.log('Submitting bank statement...');
            }}
          />
        </div>

        {/* Bank Verification Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <VerificationField
              label="Auto Verification"
              verified={formik.values.salaryAutoVerified}
              status={formik.values.salaryAutoStatus}
              onVerifiedChange={(value) => formik.setFieldValue('salaryAutoVerified', value)}
              onStatusChange={(value) => formik.setFieldValue('salaryAutoStatus', value)}
            />

            <VerificationField
              label="Is salary account?"
              verified={formik.values.isSalaryAccountVerified}
              status={formik.values.isSalaryAccountStatus}
              onVerifiedChange={(value) => formik.setFieldValue('isSalaryAccountVerified', value)}
              onStatusChange={(value) => formik.setFieldValue('isSalaryAccountStatus', value)}
              accountNumber={bankData?.accountNumber}
            />

            {/* Regular Salary Credits with conditional fields */}
            <div className={`p-3 rounded-lg border transition-all duration-200 ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Regular Salary Credits?
                </span>
                {statusIndicator(formik.values.salaryCreditedRegular)}
              </div>

              <div className="space-y-2">
                <select
                  value={formik.values.salaryCreditedRegular}
                  onChange={(e) => formik.setFieldValue('salaryCreditedRegular', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                {formik.values.salaryCreditedRegular === 'Yes' && (
                  <div>
                    <label className={labelClassName}>Salary Credit Date</label>
                    <select
                      value={formik.values.salaryCreditDate}
                      onChange={(e) => formik.setFieldValue('salaryCreditDate', e.target.value)}
                      className={selectClassName}
                    >
                      {salaryDateOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formik.values.salaryCreditedRegular === 'No' && (
                  <div>
                    <label className={labelClassName}>Remark</label>
                    <textarea
                      rows="2"
                      value={formik.values.salaryCreditRemark}
                      onChange={(e) => formik.setFieldValue('salaryCreditRemark', e.target.value)}
                      className={textareaClassName}
                      placeholder="Enter reason for irregular salary credits..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

         <div className="space-y-4">
  {/* EMI Debited section with API data */}
  <div className={`p-3 rounded-lg border transition-all duration-200 ${
    isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
  }`}>
    <div className="flex items-center justify-between mb-2">
      <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        Any EMI Debited?
      </span>
      {statusIndicator(formik.values.anyEmiDebited)}
    </div>

    <div className="space-y-3">
      {/* EMI Amount from API */}
      <div>
        <h4 className={`text-sm font-medium mb-2 ${isDark ? "text-blue-500" : "text-blue-800"}`}>
          <span>Existing EMI Amount - ₹{bankData?.existingEmi || 0}</span>
        </h4>
        {bankData?.existingEmi > 0 && (
          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            As per application data
          </p>
        )}
      </div>

      {/* EMI Debited Dropdown */}
      <div>
        <label className={labelClassName}>Is EMI Debited in Bank Statement?</label>
        <select
          value={formik.values.anyEmiDebited}
          onChange={(e) => formik.setFieldValue('anyEmiDebited', e.target.value)}
          className={selectClassName}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Conditional Fields when EMI Debited is Yes */}
      {formik.values.anyEmiDebited === 'Yes' && (
        <>
          <div>
            <label className={labelClassName}>EMI Amount in Statement</label>
            <input
              type="number"
              value={formik.values.emiAmountInStatement}
              onChange={(e) => formik.setFieldValue('emiAmountInStatement', e.target.value)}
              className={inputClassName}
              placeholder="Enter EMI amount as per bank statement"
            />
          </div>

          <div>
            <label className={labelClassName}>Is this EMI with bank statement?</label>
            <select
              value={formik.values.isEmiWithBankStatement}
              onChange={(e) => formik.setFieldValue('isEmiWithBankStatement', e.target.value)}
              className={selectClassName}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </>
      )}
    </div>
  </div>
</div>
        </div>

        {/* Submit Button and Final Report - Side by side */}
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
            onClick={onSectionSave}
            disabled={saving}
            className={submitButtonClassName}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankVerification;