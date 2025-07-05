import React from 'react';
import { Building2 } from 'lucide-react';

const BankDetails = ({ formik, isDark }) => {
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

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

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
          <div>
            <label className={labelClassName}>Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={formik.values.bankName}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter bank name"
            />
          </div>

          <div>
            <label className={labelClassName}>Branch Name</label>
            <input
              type="text"
              name="branchName"
              value={formik.values.branchName}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter branch name"
            />
          </div>

          <div>
            <label className={labelClassName}>Account Type</label>
            <select
              name="accountType"
              value={formik.values.accountType}
              onChange={formik.handleChange}
              className={selectClassName}
            >
              <option value="">Select Account Type</option>
              <option value="SAVING">Savings Account</option>
              <option value="Current">Current Account</option>
              <option value="Salary">Salary Account</option>
              <option value="Fixed Deposit">Fixed Deposit</option>
            </select>
          </div>

          <div>
            <label className={labelClassName}>Account Number</label>
            <input
              type="text"
              name="accountNo"
              value={formik.values.accountNo}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className={labelClassName}>IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={formik.values.ifscCode}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter IFSC code"
            />
          </div>

          <div>
            <label className={labelClassName}>PAN Number</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="panNo"
                value={formik.values.panNo}
                onChange={formik.handleChange}
                className={`${inputClassName} flex-1`}
                placeholder="Enter PAN number"
              />
              <button
                type="button"
                onClick={() => handleVerifyClick('pan')}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-all duration-200"
              >
                Verify PAN
              </button>
            </div>
          </div>

          <div>
            <label className={labelClassName}>Aadhar Number</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="aadharNo"
                value={formik.values.aadharNo}
                onChange={formik.handleChange}
                className={`${inputClassName} flex-1`}
                placeholder="Enter Aadhar number"
              />
              <button
                type="button"
                onClick={() => handleVerifyClick('aadhar')}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-all duration-200"
              >
                Verify Aadhar
              </button>
            </div>
          </div>

          <div>
            <label className={labelClassName}>CRN Number</label>
            <input
              type="text"
              name="crnNo"
              value={formik.values.crnNo}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter CRN number"
            />
          </div>

          <div>
            <label className={labelClassName}>Account ID</label>
            <input
              type="text"
              name="accountId"
              value={formik.values.accountId}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter account ID"
            />
          </div>

          <div>
            <label className={labelClassName}>Approval Note</label>
            <select
              name="approvalNote"
              value={formik.values.approvalNote}
              onChange={formik.handleChange}
              className={selectClassName}
            >
              <option value="">Select Status</option>
              <option value="NEW CUSTOMER">New Customer</option>
              <option value="EXISTING CUSTOMER">Existing Customer</option>
              <option value="PENDING VERIFICATION">Pending Verification</option>
              
            </select>
          </div>

          <div>
            <label className={labelClassName}>E-Nach Bank</label>
            <select
              name="enachBank"
              value={formik.values.enachBank}
              onChange={formik.handleChange}
              className={selectClassName}
            >
              <option value="">Select Bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="AXIS">Axis Bank</option>
              <option value="KOTAK">Kotak Mahindra Bank</option>
              <option value="PNB">Punjab National Bank</option>
              <option value="BOB">Bank of Baroda</option>
            </select>
          </div>

          <div>
            <label className={labelClassName}>E-Nach Mode</label>
            <select
              name="enachMode"
              value={formik.values.enachMode}
              onChange={formik.handleChange}
              className={selectClassName}
            >
              <option value="">Select Mode</option>
              <option value="Physical">Physical</option>
              <option value="Digital">Digital</option>
              <option value="API">API</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          <div>
            <label className={labelClassName}>E-Nach Bank Code</label>
            <input
              type="text"
              name="enachBankCode"
              value={formik.values.enachBankCode}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter bank code"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;