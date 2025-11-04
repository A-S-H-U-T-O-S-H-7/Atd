import React from 'react';
import { Building2, AlertTriangle } from 'lucide-react';
import { enachAPI } from '@/lib/services/AllEnquiriesServices';
import { useState, useEffect } from 'react';


const BankDetails = ({ formik, isDark,errors = {}, touched = {}  }) => {
  const [bankList, setBankList] = useState([]);
  const [bankModes, setBankModes] = useState([]);
  const [loadingModes, setLoadingModes] = useState(false);
  const [loadingBankCode, setLoadingBankCode] = useState(false);

  useEffect(() => {
    const fetchBankList = async () => {
      try {
        const response = await enachAPI.getBankList();
        if (response.success) {
          setBankList(response.banks);
        }
      } catch (error) {
        console.error('Error fetching bank list:', error);
      }
    };
    
    fetchBankList();
  }, []);



  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const errorInputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const errorSelectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const errorLabelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const errorTextClassName = `text-xs mt-1 flex items-center space-x-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  

  // Helper function to check if field has error
  const hasError = (fieldName) => {
  return errors[fieldName] && touched[fieldName];
};

  const handleVerifyClick = (type) => {
    // This will be handled by parent component to redirect to verification page
    window.open(`/verify-${type}`, '_blank');
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
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
            Bank Details
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bank Name */}
          <div>
            <label className={hasError('bankName') ? errorLabelClassName : labelClassName}>
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              value={formik.values.bankName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={hasError('bankName') ? errorInputClassName : inputClassName}
              placeholder="Enter bank name"
            />
            {hasError('bankName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.bankName}</span>
              </div>
            )}
          </div>

          {/* Branch Name */}
          <div>
            <label className={hasError('branchName') ? errorLabelClassName : labelClassName}>
              Branch Name
            </label>
            <input
              type="text"
              name="branchName"
              value={formik.values.branchName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={hasError('branchName') ? errorInputClassName : inputClassName}
              placeholder="Enter branch name"
            />
            {hasError('branchName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.branchName}</span>
              </div>
            )}
          </div>

          {/* Account Type */}
          <div>
            <label className={hasError('accountType') ? errorLabelClassName : labelClassName}>
              Account Type
            </label>
            <select
              name="accountType"
              value={formik.values.accountType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('accountType') ? errorSelectClassName : selectClassName}
            >
              <option value="">Select Account Type</option>
              <option value="SAVING">Savings Account</option>
              <option value="Current">Current Account</option>
              <option value="Salary">Salary Account</option>
              <option value="Fixed Deposit">Fixed Deposit</option>
            </select>
            {hasError('accountType') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.accountType}</span>
              </div>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className={hasError('accountNo') ? errorLabelClassName : labelClassName}>
              Account Number
            </label>
            <input
              type="text"
              name="accountNo"
              value={formik.values.accountNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('accountNo') ? errorInputClassName : inputClassName}
              placeholder="Enter account number"
            />
            {hasError('accountNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.accountNo}</span>
              </div>
            )}
          </div>

          {/* IFSC Code */}
          <div>
            <label className={hasError('ifscCode') ? errorLabelClassName : labelClassName}>
              IFSC Code
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formik.values.ifscCode}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={hasError('ifscCode') ? errorInputClassName : inputClassName}
              placeholder="Enter IFSC code"
            />
            {hasError('ifscCode') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.ifscCode}</span>
              </div>
            )}
          </div>

          {/* PAN Number */}
          <div>
            <label className={hasError('panNo') ? errorLabelClassName : labelClassName}>
              PAN Number
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="panNo"
                value={formik.values.panNo}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className={`${hasError('panNo') ? errorInputClassName : inputClassName} flex-1`}
                placeholder="Enter PAN number"
              />
              
            </div>
            {hasError('panNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.panNo}</span>
              </div>
            )}
          </div>

          {/* Aadhar Number */}
          <div>
            <label className={hasError('aadharNo') ? errorLabelClassName : labelClassName}>
              Aadhar Number
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="aadharNo"
                value={formik.values.aadharNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${hasError('aadharNo') ? errorInputClassName : inputClassName} flex-1`}
                placeholder="Enter Aadhar number"
              />
              
            </div>
            {hasError('aadharNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.aadharNo}</span>
              </div>
            )}
          </div>

          {/* CRN Number */}
          <div>
            <label className={hasError('crnNo') ? errorLabelClassName : labelClassName}>
              CRN Number
            </label>
            <input
              type="text"
              name="crnNo"
              value={formik.values.crnNo}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={hasError('crnNo') ? errorInputClassName : inputClassName}
              placeholder="Enter CRN number"
            />
            {hasError('crnNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.crnNo}</span>
              </div>
            )}
          </div>

          {/* Account ID */}
          <div>
            <label className={hasError('accountId') ? errorLabelClassName : labelClassName}>
              Account ID
            </label>
            <input
              type="text"
              name="accountId"
              value={formik.values.accountId}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={hasError('accountId') ? errorInputClassName : inputClassName}
              placeholder="Enter account ID"
            />
            {hasError('accountId') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.accountId}</span>
              </div>
            )}
          </div>

          {/* Approval Note */}
          <div>
            <label className={hasError('approvalNote') ? errorLabelClassName : labelClassName}>
              Approval Note
            </label>
            <select
              name="approvalNote"
              value={formik.values.approvalNote}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={hasError('approvalNote') ? errorSelectClassName : selectClassName}
            >
              <option value="">Select Status</option>
              <option value="NEW CUSTOMER">New Customer</option>
              <option value="EXISTING CUSTOMER">Existing Customer</option>
              <option value="PENDING VERIFICATION">Pending Verification</option>
            </select>
            {hasError('approvalNote') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.approvalNote}</span>
              </div>
            )}
          </div>

          {/* E-Nach Bank */}
          <div>
            <label className={hasError('enachBank') ? errorLabelClassName : labelClassName}>
              E-Nach Bank
            </label>
            <select
  name="enachBank"
  value={formik.values.enachBank}
  onBlur={formik.handleBlur}
  onChange={async (e) => {
    formik.handleChange(e);
    // Fetch modes when bank changes
    if (e.target.value) {
      setLoadingModes(true);
      try {
        const response = await enachAPI.getBankModes(e.target.value);
        if (response.success) {
          setBankModes(response.lists);
        }
      } catch (error) {
        console.error('Error fetching bank modes:', error);
      } finally {
        setLoadingModes(false);
      }
    } else {
      setBankModes([]);
    }
    // Reset dependent fields
    formik.setFieldValue('enachMode', '');
    formik.setFieldValue('enachBankCode', '');
  }}
  className={hasError('enachBank') ? errorSelectClassName : selectClassName}
>
  <option value="">Select Bank</option>
  {bankList.map((bank, index) => (
    <option key={index} value={bank.bankname}>
      {bank.bankname}
    </option>
  ))}
</select>
            {hasError('enachBank') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.enachBank}</span>
              </div>
            )}
          </div>

          {/* E-Nach Mode */}
          <div>
            <label className={hasError('enachMode') ? errorLabelClassName : labelClassName}>
              E-Nach Mode
            </label>
            <select
  name="enachMode"
  value={formik.values.enachMode}
  onBlur={formik.handleBlur}
  onChange={async (e) => {
  formik.handleChange(e);
  
  if (e.target.value) {
    setLoadingBankCode(true);
    try {
      const selectedMode = bankModes.find(mode => mode.mode === e.target.value);
      if (selectedMode) {
        const response = await enachAPI.getBankCode(selectedMode.id);

        if (response.success) {
          formik.setFieldValue('enachBankCode', response.bankcode);
        }
      }
    } catch (error) {
      console.error('Error fetching bank code:', error);
    } finally {
      setLoadingBankCode(false);
    }
  } else {
    formik.setFieldValue('enachBankCode', '');
  }
}}
  className={hasError('enachMode') ? errorSelectClassName : selectClassName}
  disabled={loadingModes || bankModes.length === 0}
>
  <option value="">
    {loadingModes ? 'Loading modes...' : 'Select Mode'}
  </option>
  {bankModes.map((mode) => (
    <option key={mode.id} value={mode.mode}>
      {mode.mode}
    </option>
  ))}
</select>
            {hasError('enachMode') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.enachMode}</span>
              </div>
            )}
          </div>

          {/* E-Nach Bank Code */}
          <div>
            <label className={hasError('enachBankCode') ? errorLabelClassName : labelClassName}>
              E-Nach Bank Code
            </label>
            <input
  type="text"
  name="enachBankCode"
  value={formik.values.enachBankCode}
  onBlur={formik.handleBlur}
  onChange={formik.handleChange}
  
  className={hasError('enachBankCode') ? errorInputClassName : inputClassName}
  placeholder={loadingBankCode ? "Loading..." : "Bank code will be auto-filled"}
  readOnly
/>
            {hasError('enachBankCode') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.enachBankCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;