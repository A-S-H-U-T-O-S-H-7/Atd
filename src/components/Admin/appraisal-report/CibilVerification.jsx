import React from 'react';
import { CreditCard, Save, AlertCircle, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

const CibilVerification = ({ formik, onSectionSave, isDark, saving }) => {
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

  const statusBadge = (status, value) => {
    const isPositive = status === 'Positive';
    const hasValue = value && value > 0;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
        isDark
          ? isPositive ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
          : isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {isPositive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        <span>{status || (hasValue ? 'Review' : 'No Data')}</span>
      </div>
    );
  };

  const ScoreInput = ({ label, value, onChange, placeholder, status, onStatusChange }) => (
    <div>
      <label className={labelClassName}>{label}</label>
      <div className="space-y-2">
        <input
          type="number"
          value={value}
          onChange={onChange}
          className={inputClassName}
          placeholder={placeholder}
        />
        <select
          value={status}
          onChange={onStatusChange}
          className={selectClassName}
        >
          <option value="">Select Status</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
      </div>
    </div>
  );

  const CibilField = ({ label, value, status, onValueChange, onStatusChange, placeholder, icon: Icon }) => (
    <div className={`p-3 rounded-lg border transition-all duration-200 ${
      isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />}
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {label}
          </span>
        </div>
        {statusBadge(status, value)}
      </div>
      
      <div className="space-y-2">
        <input
          type="number"
          value={value}
          onChange={onValueChange}
          className={inputClassName}
          placeholder={placeholder}
        />
        <select
          value={status}
          onChange={onStatusChange}
          className={selectClassName}
        >
          <option value="">Select Status</option>
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
            <CreditCard className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              CIBIL Verification
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
        {/* Customer Information */}
        <div className={`mb-6 p-4 rounded-lg border ${
          isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
        }`}>
          <h4 className={`font-medium mb-3 flex items-center space-x-2 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}>
            <BarChart3 className="w-4 h-4" />
            <span>Customer CIBIL Information</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>Name</div>
              <div className={isDark ? "text-white" : "text-gray-900"}>Harikiran B M</div>
            </div>
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>Mobile</div>
              <div className={isDark ? "text-white" : "text-gray-900"}>7259298095</div>
            </div>
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>PAN</div>
              <div className={isDark ? "text-white" : "text-gray-900"}>ANJPH8452R</div>
            </div>
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>DoB</div>
              <div className={isDark ? "text-white" : "text-gray-900"}>9-1-1993</div>
            </div>
          </div>
        </div>

        {/* CIBIL Score Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ScoreInput
            label="CIBIL Score (>500)"
            value={formik.values.cibilScore}
            onChange={(e) => formik.setFieldValue('cibilScore', e.target.value)}
            placeholder="746"
            status={formik.values.cibilScoreStatus}
            onStatusChange={(e) => formik.setFieldValue('cibilScoreStatus', e.target.value)}
          />

          {/* Score Visualization */}
          {formik.values.cibilScore && (
            <div className="md:col-span-2">
              <label className={labelClassName}>Score Analysis</label>
              <div className={`p-3 rounded-lg border ${
                isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex justify-between text-xs mb-2">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>300</span>
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>900</span>
                </div>
                <div className={`w-full h-3 rounded-full ${
                  isDark ? "bg-gray-600" : "bg-gray-200"
                }`}>
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${((parseInt(formik.values.cibilScore) - 300) / 600) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className={parseInt(formik.values.cibilScore) < 550 ? (isDark ? "text-red-400" : "text-red-600") : (isDark ? "text-gray-400" : "text-gray-600")}>Poor</span>
                  <span className={parseInt(formik.values.cibilScore) >= 550 && parseInt(formik.values.cibilScore) < 700 ? (isDark ? "text-yellow-400" : "text-yellow-600") : (isDark ? "text-gray-400" : "text-gray-600")}>Fair</span>
                  <span className={parseInt(formik.values.cibilScore) >= 700 && parseInt(formik.values.cibilScore) < 750 ? (isDark ? "text-green-400" : "text-green-600") : (isDark ? "text-gray-400" : "text-gray-600")}>Good</span>
                  <span className={parseInt(formik.values.cibilScore) >= 750 ? (isDark ? "text-emerald-400" : "text-emerald-600") : (isDark ? "text-gray-400" : "text-gray-600")}>Excellent</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loan Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CibilField
            label="Active Loans"
            value={formik.values.totalActiveLoans}
            status={formik.values.activeLoanStatus}
            onValueChange={(e) => formik.setFieldValue('totalActiveLoans', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('activeLoanStatus', e.target.value)}
            placeholder="2"
            icon={CreditCard}
          />

          <CibilField
            label="Closed Loans"
            value={formik.values.totalClosedLoans}
            status={formik.values.closedLoanStatus}
            onValueChange={(e) => formik.setFieldValue('totalClosedLoans', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('closedLoanStatus', e.target.value)}
            placeholder="1"
            icon={CheckCircle}
          />

          <CibilField
            label="Write-offs"
            value={formik.values.writeOffSettled}
            status={formik.values.writeOffStatus}
            onValueChange={(e) => formik.setFieldValue('writeOffSettled', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('writeOffStatus', e.target.value)}
            placeholder="00"
            icon={XCircle}
          />

          <CibilField
            label="Overdue"
            value={formik.values.noOfOverdue}
            status={formik.values.overdueStatus}
            onValueChange={(e) => formik.setFieldValue('noOfOverdue', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('overdueStatus', e.target.value)}
            placeholder="1"
            icon={AlertCircle}
          />
        </div>

        {/* EMI and DPD Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className={labelClassName}>Total EMI (₹)</label>
            <input
              type="number"
              value={formik.values.totalEmiAsCibil}
              onChange={(e) => formik.setFieldValue('totalEmiAsCibil', e.target.value)}
              className={inputClassName}
              placeholder="60000"
            />
          </div>

          <div>
            <label className={labelClassName}>DPD Status</label>
            <select
              value={formik.values.dpd}
              onChange={(e) => formik.setFieldValue('dpd', e.target.value)}
              className={selectClassName}
            >
              <option value="">Select DPD</option>
              <option value="Regular">Regular (0-30 days)</option>
              <option value="Irregular">Irregular (31-90 days)</option>
              <option value="Default">Default (90+ days)</option>
            </select>
          </div>

          <div>
            <label className={labelClassName}>DPD Status</label>
            <select
              value={formik.values.dpdStatus}
              onChange={(e) => formik.setFieldValue('dpdStatus', e.target.value)}
              className={selectClassName}
            >
              <option value="">Select Status</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
        </div>

        {/* Comments and Remarks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div>
            <label className={labelClassName}>Comments</label>
            <textarea
              rows="3"
              value={formik.values.cibilComment}
              onChange={(e) => formik.setFieldValue('cibilComment', e.target.value)}
              className={textareaClassName}
              placeholder="Enter detailed comments about CIBIL analysis..."
            />
          </div>

          <div>
            <label className={labelClassName}>Remarks</label>
            <textarea
              rows="3"
              value={formik.values.cibilRemark}
              onChange={(e) => formik.setFieldValue('cibilRemark', e.target.value)}
              className={textareaClassName}
              placeholder="Enter final remarks and recommendations..."
            />
          </div>
        </div>

        {/* Final Report and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>Final Report</label>
            <select
              value={formik.values.cibilFinalReport}
              onChange={(e) => formik.setFieldValue('cibilFinalReport', e.target.value)}
              className={selectClassName}
            >
              <option value="">Select Final Report</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          {/* Summary */}
          <div className={`p-4 rounded-lg border ${
            isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h4 className={`font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              CIBIL Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>Score</div>
                <div className={`font-bold text-lg ${
                  formik.values.cibilScore >= 750 ? 'text-emerald-600' :
                  formik.values.cibilScore >= 650 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {formik.values.cibilScore || 'N/A'}
                </div>
              </div>
              <div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>Risk Level</div>
                <div className={`font-semibold ${
                  formik.values.cibilScore >= 750 ? 'text-emerald-600' :
                  formik.values.cibilScore >= 650 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {formik.values.cibilScore >= 750 ? 'Low' :
                   formik.values.cibilScore >= 650 ? 'Medium' : 'High'}
                </div>
              </div>
              <div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>Active Loans</div>
                <div className="font-semibold">{formik.values.totalActiveLoans || '0'}</div>
              </div>
              <div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>Final Status</div>
                <div className={`font-semibold ${
                  formik.values.cibilFinalReport === 'Positive' ? 'text-emerald-600' : 
                  formik.values.cibilFinalReport === 'Negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formik.values.cibilFinalReport || 'Pending'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CIBIL Guidelines */}
        <div className={`mt-4 p-3 rounded-lg border ${
          isDark ? "bg-purple-900/20 border-purple-800" : "bg-purple-50 border-purple-200"
        }`}>
          <h5 className={`font-medium mb-2 flex items-center space-x-1 ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`}>
            <AlertCircle className="w-4 h-4" />
            <span>CIBIL Score Guidelines</span>
          </h5>
          <div className="text-xs space-y-1">
            <div className={isDark ? "text-purple-300" : "text-purple-700"}>
              • <strong>750-900:</strong> Excellent - High approval probability
            </div>
            <div className={isDark ? "text-purple-300" : "text-purple-700"}>
              • <strong>650-749:</strong> Good - Standard approval
            </div>
            <div className={isDark ? "text-purple-300" : "text-purple-700"}>
              • <strong>550-649:</strong> Fair - Additional verification needed
            </div>
            <div className={isDark ? "text-purple-300" : "text-purple-700"}>
              • <strong>300-549:</strong> Poor - High risk, review required
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CibilVerification;