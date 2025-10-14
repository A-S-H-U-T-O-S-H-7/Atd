import React from 'react';
import { Building2, Save, Download, Upload, CheckCircle, XCircle } from 'lucide-react';

const BankVerification = ({ formik, onSectionSave, isDark, saving }) => {
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

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

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

  const statusIndicator = (status) => {
    const isPositive = status === 'Positive' || status === 'Yes';
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

  const BankStatementBlock = ({ title, bankName, onBankChange, onFileUpload }) => (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}>
      <h4 className={`font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {title}
      </h4>
      
      <div className="space-y-3">
        <div>
          <label className={labelClassName}>Select Bank</label>
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
          className={`w-full px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm ${
            isDark
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Download Statement</span>
        </button>
      </div>
    </div>
  );

  const VerificationField = ({ label, status, method, onStatusChange, onMethodChange }) => (
    <div className={`p-3 rounded-lg border transition-all duration-200 ${
      isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {label}
        </span>
        {statusIndicator(status)}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={selectClassName}
        >
          <option value="">Status</option>
          <option value="Yes">Verified</option>
          <option value="No">Not Verified</option>
        </select>
        <select
          value={method}
          onChange={(e) => onMethodChange(e.target.value)}
          className={selectClassName}
        >
          <option value="">Method</option>
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
        <div className="flex items-center justify-between">
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
          <button
            type="button"
            onClick={onSectionSave}
            disabled={saving}
            className={buttonClassName}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Bank Statements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <BankStatementBlock
            title="1st Bank Statement"
            bankName={formik.values.firstBankName}
            onBankChange={(e) => formik.setFieldValue('firstBankName', e.target.value)}
            onFileUpload={(e) => {
              const file = e.target.files[0];
              if (file) {
                formik.setFieldValue('firstBankStatement', file);
                // Handle file upload logic here
              }
            }}
          />

          <BankStatementBlock
            title="2nd Bank Statement"
            bankName={formik.values.secondBankName}
            onBankChange={(e) => formik.setFieldValue('secondBankName', e.target.value)}
            onFileUpload={(e) => {
              const file = e.target.files[0];
              if (file) {
                formik.setFieldValue('secondBankStatement', file);
                // Handle file upload logic here
              }
            }}
          />
        </div>

        {/* Bank Verification Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <VerificationField
              label="Auto Verification"
              status={formik.values.salaryAutoVerification}
              method={formik.values.salaryAutoVerificationStatus}
              onStatusChange={(value) => formik.setFieldValue('salaryAutoVerification', value)}
              onMethodChange={(value) => formik.setFieldValue('salaryAutoVerificationStatus', value)}
            />

            <VerificationField
              label="Salary Account"
              status={formik.values.isSalaryAccount}
              method={formik.values.isSalaryAccountStatus}
              onStatusChange={(value) => formik.setFieldValue('isSalaryAccount', value)}
              onMethodChange={(value) => formik.setFieldValue('isSalaryAccountStatus', value)}
            />

            <VerificationField
              label="Regular Salary Credits"
              status={formik.values.salaryCreditedRegular}
              method={formik.values.salaryCreditedRegularStatus}
              onStatusChange={(value) => formik.setFieldValue('salaryCreditedRegular', value)}
              onMethodChange={(value) => formik.setFieldValue('salaryCreditedRegularStatus', value)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClassName}>EMI Debited?</label>
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

            {formik.values.anyEmiDebited === 'Yes' && (
              <>
                <div>
                  <label className={labelClassName}>EMI Amount</label>
                  <input
                    type="number"
                    value={formik.values.salaryAmount}
                    onChange={(e) => formik.setFieldValue('salaryAmount', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="EMI amount"
                  />
                </div>

                <div>
                  <label className={labelClassName}>EMI in Statement?</label>
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

            <div>
              <label className={labelClassName}>Salary Account Remark</label>
              <textarea
                rows="2"
                value={formik.values.salaryAccountRemark}
                onChange={(e) => formik.setFieldValue('salaryAccountRemark', e.target.value)}
                className={textareaClassName}
                placeholder="Additional remarks about salary account..."
              />
            </div>
          </div>
        </div>

        {/* Remarks and Final Report */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>Bank Verification Remarks</label>
            <textarea
              rows="3"
              value={formik.values.bankVerificationRemark}
              onChange={(e) => formik.setFieldValue('bankVerificationRemark', e.target.value)}
              className={textareaClassName}
              placeholder="Enter bank verification remarks and observations..."
            />
          </div>

          <div>
            <label className={labelClassName}>Final Report</label>
            <select
              value={formik.values.bankVerificationFinalReport}
              onChange={(e) => formik.setFieldValue('bankVerificationFinalReport', e.target.value)}
              className={selectClassName}
            >
              <option value="">Select Final Report</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>

            {/* Verification Summary */}
            <div className={`mt-3 p-3 rounded-lg border ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>Checks Completed</div>
                  <div className="font-semibold">
                    {[
                      formik.values.salaryAutoVerification,
                      formik.values.isSalaryAccount,
                      formik.values.salaryCreditedRegular,
                      formik.values.anyEmiDebited
                    ].filter(Boolean).length}/4
                  </div>
                </div>
                <div>
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>Final Status</div>
                  <div className={`font-semibold ${
                    formik.values.bankVerificationFinalReport === 'Positive' ? 'text-emerald-600' : 
                    formik.values.bankVerificationFinalReport === 'Negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {formik.values.bankVerificationFinalReport || 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankVerification;