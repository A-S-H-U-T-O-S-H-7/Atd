import React from 'react';
import { DollarSign, Save, Calendar, TrendingUp, Clock, AlertCircle } from 'lucide-react';

const SalaryVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
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

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  const VerificationField = ({ label, value, status, onValueChange, onStatusChange, options, icon: Icon }) => (
    <div className={`p-3 rounded-lg border transition-all duration-200 ${
      isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex items-center space-x-2 mb-2">
        {Icon && <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />}
        <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {label}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <select
          value={value}
          onChange={onValueChange}
          className={selectClassName}
        >
          <option value="">Select</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={onStatusChange}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Salary Verification
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
        {/* Auto Verification Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <VerificationField
            label="Auto Verification"
            value={formik.values.salaryAutoVerification}
            status={formik.values.salaryAutoVerificationStatus}
            onValueChange={(e) => formik.setFieldValue('salaryAutoVerification', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('salaryAutoVerificationStatus', e.target.value)}
            options={['Yes', 'No']}
            icon={TrendingUp}
          />

          <VerificationField
            label="Salary Account"
            value={formik.values.isSalaryAccount}
            status={formik.values.isSalaryAccountStatus}
            onValueChange={(e) => formik.setFieldValue('isSalaryAccount', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('isSalaryAccountStatus', e.target.value)}
            options={['Yes', 'No']}
            icon={DollarSign}
          />
        </div>

        {/* Regular Salary Credits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <VerificationField
            label="Regular Salary Credits"
            value={formik.values.salaryCreditedRegular}
            status={formik.values.salaryCreditedRegularStatus}
            onValueChange={(e) => formik.setFieldValue('salaryCreditedRegular', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('salaryCreditedRegularStatus', e.target.value)}
            options={['Yes', 'No']}
            icon={Clock}
          />

          {/* Salary Interval */}
          {formik.values.salaryCreditedRegular === 'Yes' && (
            <div className={`p-3 rounded-lg border transition-all duration-200 ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Salary Credit Date
                </span>
              </div>
              <select
                value={formik.values.salaryInterval}
                onChange={(e) => formik.setFieldValue('salaryInterval', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Credit Date</option>
                <option value="1st">1st of Month</option>
                <option value="5th">5th of Month</option>
                <option value="10th">10th of Month</option>
                <option value="15th">15th of Month</option>
                <option value="20th">20th of Month</option>
                <option value="25th">25th of Month</option>
                <option value="30th">30th of Month</option>
                <option value="Last day">Last Working Day</option>
              </select>
            </div>
          )}
        </div>

        {/* EMI Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-3 rounded-lg border transition-all duration-200 ${
            isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                EMI Debited
              </span>
            </div>
            <select
              value={formik.values.anyEmiDebited}
              onChange={(e) => formik.setFieldValue('anyEmiDebited', e.target.value)}
              className={selectClassName}
            >
              <option value="">Any EMI Debited?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* EMI Details */}
          {formik.values.anyEmiDebited === 'Yes' && (
            <>
              <div>
                <label className={labelClassName}>EMI Amount (₹)</label>
                <input
                  type="number"
                  value={formik.values.salaryAmount}
                  onChange={(e) => formik.setFieldValue('salaryAmount', e.target.value)}
                  className={inputClassName}
                  placeholder="Enter EMI amount"
                />
              </div>

              <div className={`p-3 rounded-lg border transition-all duration-200 ${
                isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    EMI in Statement
                  </span>
                </div>
                <select
                  value={formik.values.isEmiWithBankStatement}
                  onChange={(e) => formik.setFieldValue('isEmiWithBankStatement', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">EMI Visible in Statement?</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Account Details */}
        <div className={`mb-6 p-4 rounded-lg border ${
          isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
        }`}>
          <h4 className={`font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            Salary Account Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Account Number</label>
              <div className={`p-2 rounded border text-sm font-mono ${
                isDark ? "bg-gray-600 border-gray-500 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-600"
              }`}>
                04081180018333
              </div>
            </div>
            
            <div>
              <label className={labelClassName}>If No Salary Account (Remarks)</label>
              <textarea
                rows="2"
                value={formik.values.salaryAccountRemark}
                onChange={(e) => formik.setFieldValue('salaryAccountRemark', e.target.value)}
                className={textareaClassName}
                placeholder="Explain why this is not a salary account..."
              />
            </div>
          </div>
        </div>

        {/* Final Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>Verification Remarks</label>
            <textarea
              rows="3"
              value={formik.values.salaryVerificationRemark}
              onChange={(e) => formik.setFieldValue('salaryVerificationRemark', e.target.value)}
              className={textareaClassName}
              placeholder="Enter detailed salary verification remarks, observations, and any discrepancies found..."
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClassName}>Final Report</label>
              <select
                value={formik.values.salaryVerificationFinalReport}
                onChange={(e) => formik.setFieldValue('salaryVerificationFinalReport', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Final Report</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>

            {/* Summary */}
            <div className={`p-3 rounded-lg border ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <h5 className={`font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Verification Summary
              </h5>
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
                    formik.values.salaryVerificationFinalReport === 'Positive' ? 'text-emerald-600' : 
                    formik.values.salaryVerificationFinalReport === 'Negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {formik.values.salaryVerificationFinalReport || 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className={`mt-4 p-3 rounded-lg border ${
          isDark ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"
        }`}>
          <h5 className={`font-medium mb-2 flex items-center space-x-1 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>Salary Verification Guidelines</span>
          </h5>
          <div className="text-xs space-y-1">
            <div className={isDark ? "text-blue-300" : "text-blue-700"}>
              • <strong>Regular Credits:</strong> Check for consistent monthly salary deposits
            </div>
            <div className={isDark ? "text-blue-300" : "text-blue-700"}>
              • <strong>Salary Account:</strong> Verify if account shows salary transaction pattern
            </div>
            <div className={isDark ? "text-blue-300" : "text-blue-700"}>
              • <strong>EMI Analysis:</strong> Ensure EMI payments don't exceed 50% of salary
            </div>
            <div className={isDark ? "text-blue-300" : "text-blue-700"}>
              • <strong>Consistency:</strong> Look for stable salary amounts without major fluctuations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryVerification;