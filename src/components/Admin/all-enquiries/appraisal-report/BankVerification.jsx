import React from 'react';
import { Building2, Download, Save } from 'lucide-react';

const BankVerification = ({ formik, onSectionSave, isDark }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

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

  const handleDownloadStatement = (bankNumber) => {
    // Handle download logic here
    console.log(`Downloading statement for bank ${bankNumber}`);
    alert(`Downloading statement for bank ${bankNumber}`);
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue(fieldName, file);
      console.log(`File uploaded for ${fieldName}:`, file.name);
    }
  };

  return (
    <div className={`rounded-xl mt-8 shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Bank Verification
          </h3>
        </div>

        {/* Two Bank Blocks in Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1st Bank Block */}
          <div className={`p-4 rounded-lg border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
              1st Bank Statement
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className={labelClassName}>Select Bank</label>
                <select
                  value={formik.values.firstBankName || ''}
                  onChange={(e) => formik.setFieldValue('firstBankName', e.target.value)}
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
                <label className={labelClassName}>Upload Bank Statement</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'firstBankStatement')}
                  className={inputClassName}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDownloadStatement(1)}
                className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
              >
                <Download size={16} />
                <span>Download Bank Statement</span>
              </button>
            </div>
          </div>

          {/* 2nd Bank Block */}
          <div className={`p-4 rounded-lg border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
              2nd Bank Statement
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className={labelClassName}>Select Bank</label>
                <select
                  value={formik.values.secondBankName || ''}
                  onChange={(e) => formik.setFieldValue('secondBankName', e.target.value)}
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
                <label className={labelClassName}>Upload Bank Statement</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'secondBankStatement')}
                  className={inputClassName}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDownloadStatement(2)}
                className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
              >
                <Download size={16} />
                <span>Download Bank Statement</span>
              </button>
            </div>
          </div>
        </div>

        {/* Remark Section */}
        <div className="mt-6">
          <label className={labelClassName}>Remark</label>
          <textarea
            rows="4"
            value={formik.values.bankVerificationRemark || ''}
            onChange={(e) => formik.setFieldValue('bankVerificationRemark', e.target.value)}
            className={textareaClassName}
            placeholder="Enter your remarks here..."
          />
        </div>

        {/* Final Report */}
        <div className="mt-4">
          <label className={labelClassName}>Final Report</label>
          <select
            value={formik.values.bankVerificationFinalReport || ''}
            onChange={(e) => formik.setFieldValue('bankVerificationFinalReport', e.target.value)}
            className={selectClassName}
          >
            <option value="">--Select--</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="m-4 pt-4 flex justify-end border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onSectionSave}
          className="px-6 py-2 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white rounded-md font-medium transition-all duration-200 flex space-x-2 text-sm"
        >
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default BankVerification;