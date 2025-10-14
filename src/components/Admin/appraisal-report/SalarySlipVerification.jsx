import React from 'react';
import { FileText, Save, Upload, Download, CheckCircle } from 'lucide-react';

const SalarySlipVerification = ({ formik, onSectionSave, isDark, saving }) => {
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

  const slipIconClassName = `w-8 h-10 flex items-center justify-center rounded text-xs border ${
    isDark 
      ? "bg-gray-700 border-gray-600 text-gray-300" 
      : "bg-gray-100 border-gray-300 text-gray-600"
  }`;

  const salarySlipItems = [
    { month: 'Sep 2023', amount: '73,997.00', verified: true },
    { month: 'Oct 2023', amount: '73,997.00', verified: true },
    { month: 'Nov 2023', amount: '1,72,998.00', verified: true },
    { month: 'Dec 2023', amount: '', verified: false },
    { month: 'Jan 2024', amount: '', verified: false },
    { month: 'Feb 2024', amount: '', verified: false },
    { month: 'Mar 2024', amount: '', verified: false },
    { month: 'Apr 2024', amount: '', verified: false },
    { month: 'May 2024', amount: '', verified: false },
    { month: 'Jun 2024', amount: '', verified: false },
    { month: 'Jul 2024', amount: '', verified: false },
    { month: 'Aug 2024', amount: '', verified: false }
  ];

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
            <FileText className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Salary Slip Verification
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
        {/* Salary Slips Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Salary Slips (Last 12 Months)
            </h4>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${
                isDark ? "bg-gray-700 text-white" : "bg-gray-800 text-white"
              }`}>
                3 Verified Slips
              </span>
            </div>
          </div>

          {/* Salary Slips Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">
            {salarySlipItems.map((slip, index) => (
              <div key={index} className="text-center">
                <div className={`${slipIconClassName} ${
                  slip.verified ? (isDark ? "border-emerald-500 bg-emerald-900/30" : "border-emerald-400 bg-emerald-100") : ""
                }`}>
                  {slip.verified ? (
                    <CheckCircle className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {slip.month.split(' ')[0]}
                </div>
                <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  {slip.month.split(' ')[1]}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Section */}
          <div className={`p-4 rounded-lg border ${
            isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div>
                <h5 className={`font-medium mb-1 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Upload Additional Salary Slips
                </h5>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Support: PDF, JPG, PNG (Max: 5MB each)
                </p>
              </div>
              <div className="flex space-x-2">
                <label className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm cursor-pointer flex items-center space-x-2 ${
                  isDark
                    ? "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500 hover:border-emerald-500"
                    : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 hover:border-emerald-400"
                }`}>
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                </label>
                <button className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm flex items-center space-x-2 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-600"
                    : "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                }`}>
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Verified Slips Summary */}
          <div className={`p-4 rounded-lg border ${
            isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h5 className={`font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Verified Salary Details
            </h5>
            <div className="space-y-2">
              {salarySlipItems.filter(slip => slip.verified).map((slip, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-0">
                  <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {slip.month}
                  </span>
                  <span className={`font-mono text-sm ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    ₹{slip.amount}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Average
                </span>
                <span className={`font-mono font-semibold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  ₹1,07,330.67
                </span>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className={`p-4 rounded-lg border ${
            isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h5 className={`font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Verification Status
            </h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>Total Slips</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>Verified</span>
                <span className="font-semibold text-emerald-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>Pending</span>
                <span className="font-semibold text-yellow-600">9</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>Consistency</span>
                <span className="font-semibold">25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Section */}
        <div>
          <label className={labelClassName}>
            Remarks & Observations
          </label>
          <textarea
            rows="4"
            value={formik.values.salarySlipRemark}
            onChange={(e) => formik.setFieldValue('salarySlipRemark', e.target.value)}
            className={textareaClassName}
            placeholder={`29 Sep 2023 - 73,997.00 ----------
31 Oct 2023 - 73,997.00 ------------
30 Nov 2023 - 1,72,998.00 ----------

Enter additional observations about salary consistency, deductions, bonuses, etc.`}
            defaultValue={`29 Sep 2023 - 73,997.00 ----------
31 Oct 2023 - 73,997.00 ------------
30 Nov 2023 - 1,72,998.00 ----------`}
          />
          <div className={`text-xs mt-1 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            Note: Higher amount in November indicates possible bonus or arrears payment
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={`px-3 py-1 rounded text-xs border transition-colors ${
            isDark 
              ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600" 
              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
          }`}>
            Mark All Verified
          </button>
          <button className={`px-3 py-1 rounded text-xs border transition-colors ${
            isDark 
              ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600" 
              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
          }`}>
            Request Missing Slips
          </button>
          <button className={`px-3 py-1 rounded text-xs border transition-colors ${
            isDark 
              ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-500" 
              : "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
          }`}>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalarySlipVerification;