import React, { useState } from "react";
import { X, Building, CreditCard, Calendar, Lock } from "lucide-react";

const TransferModal = ({ isOpen, onClose, onSubmit, isDark, disbursementData }) => {
  const [formData, setFormData] = useState({
    disbursementAmount: disbursementData?.disbursedAmount || "",
    bankName: disbursementData?.beneficiaryBankIFSC?.includes("FDRL") ? "THE FEDERAL BANK LTD" : "",
    accountNo: disbursementData?.beneficiaryAcNo || "",
    ifscNo: disbursementData?.beneficiaryBankIFSC || "",
    branchName: "",
    accountType: disbursementData?.beneficiaryAcType || "SAVING",
    authCode1: "",
    authCode2: "",
    transactionDate: new Date().toISOString().split('T')[0],
    dueDate: disbursementData?.dueDate || "",
    atdBankName: "ICICI Bank-A/c-5399",
    atdBranchName: "Sector-61, Noida"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...disbursementData,
      ...formData
    });
    onClose();
  };

  if (!isOpen) return null;

  // Compact static display component
  const StaticField = ({ label, value, icon: Icon }) => (
    <div className="space-y-1">
      <label className={`block text-xs font-medium ${
        isDark ? "text-gray-300" : "text-gray-600"
      }`}>
        {label}
      </label>
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
        isDark 
          ? "bg-gray-700/50 border-gray-600 text-gray-100" 
          : "bg-gray-50 border-gray-200 text-gray-800"
      }`}>
        {Icon && <Icon className={`w-3 h-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />}
        <span className="text-sm font-medium">{value || "Not specified"}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto border ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        {/* Compact Header */}
        <div className={`px-4 py-3 border-b ${
          isDark 
            ? "bg-gray-900 border-gray-700" 
            : "bg-gradient-to-r from-emerald-50 to-teal-50 border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg ${
                isDark ? "bg-emerald-600/20" : "bg-emerald-100"
              }`}>
                <Building className={`w-4 h-4 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  Disbursement Details
                </h2>
                <p className={`text-xs ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  {disbursementData?.beneficiaryAcName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-all duration-200 ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
            </button>
          </div>
        </div>

        {/* Compact Form Content */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Disbursement Amount */}
              <div className="space-y-1">
                <label className={`block text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Disbursement Amount
                </label>
                <div className={`relative overflow-hidden rounded-lg border ${
                  isDark 
                    ? "bg-gray-700 border-gray-600" 
                    : "bg-emerald-50 border-emerald-200"
                }`}>
                  <div className="flex items-center px-3 py-2">
                    <CreditCard className={`w-4 h-4 mr-2 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-lg font-bold ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}>
                      ₹{formData.disbursementAmount || "0"}
                    </span>
                    <Lock className={`w-3 h-3 ml-auto ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`} />
                  </div>
                </div>
              </div>

              {/* Customer's Bank Details */}
              <div className={`p-3 rounded-lg border ${
                isDark 
                  ? "bg-gray-700/30 border-gray-600" 
                  : "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex items-center space-x-1 mb-2">
                  <Building className={`w-4 h-4 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`} />
                  <h3 className={`text-sm font-semibold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}>
                    Customer's Bank Details
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <StaticField 
                    label="Bank Name" 
                    value={formData.bankName}
                    icon={Building}
                  />
                  <StaticField 
                    label="Account Number" 
                    value={formData.accountNo}
                    icon={CreditCard}
                  />
                  <StaticField 
                    label="IFSC Code" 
                    value={formData.ifscNo}
                  />
                  <StaticField 
                    label="Branch Name" 
                    value={formData.branchName}
                  />
                </div>
              </div>

              {/* Account Type */}
              <div className="space-y-1">
                <label className={`block text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Account Type
                </label>
                <input
                  type="text"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500" 
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                  } focus:outline-none focus:ring-1 focus:ring-emerald-500/20`}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Auth Codes */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={`block text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Authorization Code 1
                  </label>
                  <input
                    type="text"
                    name="authCode1"
                    value={formData.authCode1}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                    } focus:outline-none focus:ring-1 focus:ring-emerald-500/20`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`block text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Authorization Code 2
                  </label>
                  <input
                    type="text"
                    name="authCode2"
                    value={formData.authCode2}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                    } focus:outline-none focus:ring-1 focus:ring-emerald-500/20`}
                  />
                </div>
              </div>

              {/* Date Fields */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={`block text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Transaction Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="transactionDate"
                      value={formData.transactionDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                      } focus:outline-none focus:ring-1 focus:ring-emerald-500/20`}
                    />
                    <Calendar className={`absolute right-2 top-2 w-4 h-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`block text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Due Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                      } focus:outline-none focus:ring-1 focus:ring-emerald-500/20`}
                    />
                    <Calendar className={`absolute right-2 top-2 w-4 h-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`} />
                  </div>
                </div>
              </div>

              {/* ATD Bank Details */}
              <div className={`p-3 rounded-lg border ${
                isDark 
                  ? "bg-gray-700/30 border-gray-600" 
                  : "bg-purple-50 border-purple-200"
              }`}>
                <div className="flex items-center space-x-1 mb-2">
                  <Building className={`w-4 h-4 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`} />
                  <h3 className={`text-sm font-semibold ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}>
                    ATD Bank Details
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className={`block text-xs font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Bank Name
                    </label>
                    <select
                      name="atdBankName"
                      value={formData.atdBankName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                      } focus:outline-none focus:ring-1 focus:ring-emerald-500/20`}
                    >
                      <option value="ICICI Bank-A/c-5399">ICICI Bank-A/c-5399</option>
                      <option value="HDFC Bank-A/c-1234">HDFC Bank-A/c-1234</option>
                      <option value="SBI Bank-A/c-5678">SBI Bank-A/c-5678</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={`block text-xs font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Branch Name
                    </label>
                    <input
                      type="text"
                      name="atdBranchName"
                      value={formData.atdBranchName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                      } focus:outline-none focus:ring-1 focus:ring-emerald-500/20`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105 ${
                isDark
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/25"
              }`}
            >
              <span>Submit Transfer</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;