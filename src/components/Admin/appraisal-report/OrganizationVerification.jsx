import React from 'react';
import { Building, Save, Phone, Mail, Globe, CheckCircle, XCircle } from 'lucide-react';

const OrganizationVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-semibold mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const valueClassName = `text-sm p-2 rounded border ${
    isDark ? "bg-gray-600/50 border-gray-500 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

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

  const VerificationField = ({ label, value, status, method, onStatusChange, onMethodChange, icon: Icon }) => (
    <div className={`p-3 rounded-lg border transition-all duration-200 ${
      isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {label}
          </span>
        </div>
        {statusIndicator(status)}
      </div>
      
      {value && (
        <div className="mb-2">
          <div className={valueClassName}>{value}</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={selectClassName}
          >
            <option value="">Status</option>
            <option value="Yes">Verified</option>
            <option value="No">Not Verified</option>
          </select>
        </div>
        <div>
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
            <Building className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Organization Verification
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Online Verification */}
            <VerificationField
              label="Online Verification"
              value="NTTDATA"
              status={formik.values.organizationVerificationStatus}
              method={formik.values.organizationVerificationMethod}
              onStatusChange={(value) => formik.setFieldValue('organizationVerificationStatus', value)}
              onMethodChange={(value) => formik.setFieldValue('organizationVerificationMethod', value)}
              icon={Globe}
            />

            {/* Company Phone */}
            <VerificationField
              label="Company Phone"
              value="08042100400"
              status={formik.values.companyPhoneVerificationStatus}
              method={formik.values.companyPhoneVerificationMethod}
              onStatusChange={(value) => formik.setFieldValue('companyPhoneVerificationStatus', value)}
              onMethodChange={(value) => formik.setFieldValue('companyPhoneVerificationMethod', value)}
              icon={Phone}
            />

            {/* Company Website */}
            <div className={`p-3 rounded-lg border ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Globe className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Company Website
                  </span>
                </div>
                {statusIndicator(formik.values.companyWebsiteStatus)}
              </div>
              
              <div className="mb-2">
                <div className={valueClassName}>https://www.nttdataservices.com</div>
              </div>

              <select
                value={formik.values.companyWebsiteStatus}
                onChange={(e) => formik.setFieldValue('companyWebsiteStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* HR Phone */}
            <VerificationField
              label="HR Phone"
              value="7298431297"
              status={formik.values.hrPhoneVerificationStatus}
              method={formik.values.hrPhoneVerificationMethod}
              onStatusChange={(value) => formik.setFieldValue('hrPhoneVerificationStatus', value)}
              onMethodChange={(value) => formik.setFieldValue('hrPhoneVerificationMethod', value)}
              icon={Phone}
            />

            {/* HR Contact */}
            <div className={`p-3 rounded-lg border ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Mail className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    HR Contact
                  </span>
                </div>
                {statusIndicator(formik.values.hrContactStatus)}
              </div>
              
              <div className="mb-2">
                <div className={valueClassName}>Asha</div>
              </div>

              <select
                value={formik.values.hrContactStatus}
                onChange={(e) => formik.setFieldValue('hrContactStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Yes">Verified</option>
                <option value="No">Not Verified</option>
              </select>
            </div>

            {/* HR Email */}
            <VerificationField
              label="HR Email"
              value="asha.k12@nttdata.com"
              status={formik.values.hrEmailVerificationStatus}
              method={formik.values.hrEmailVerificationMethod}
              onStatusChange={(value) => formik.setFieldValue('hrEmailVerificationStatus', value)}
              onMethodChange={(value) => formik.setFieldValue('hrEmailVerificationMethod', value)}
              icon={Mail}
            />
          </div>
        </div>

        {/* Remarks and Final Report */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Remarks */}
          <div>
            <label className={labelClassName}>Remarks</label>
            <textarea
              rows="3"
              value={formik.values.organizationRemark}
              onChange={(e) => formik.setFieldValue('organizationRemark', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm resize-none ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
              placeholder="Enter organization verification remarks..."
            />
          </div>

          {/* Final Report */}
          <div>
            <label className={labelClassName}>Final Report</label>
            <select
              value={formik.values.organizationFinalReport}
              onChange={(e) => formik.setFieldValue('organizationFinalReport', e.target.value)}
              className={selectClassName}
            >
              <option value="">Select Final Report</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
            
            {/* Auto-calculated status */}
            <div className={`mt-2 p-2 rounded text-xs ${
              isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
            }`}>
              Based on verification status above
            </div>
          </div>
        </div>

        {/* Verification Summary */}
        <div className={`mt-4 p-3 rounded-lg border ${
          isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
        }`}>
          <h4 className={`font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            Verification Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>Total Checks</div>
              <div className="font-semibold">6</div>
            </div>
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>Verified</div>
              <div className="font-semibold text-emerald-600">
                {[
                  formik.values.organizationVerificationStatus,
                  formik.values.companyPhoneVerificationStatus,
                  formik.values.companyWebsiteStatus,
                  formik.values.hrPhoneVerificationStatus,
                  formik.values.hrContactStatus,
                  formik.values.hrEmailVerificationStatus
                ].filter(status => status === 'Yes' || status === 'Positive').length}
              </div>
            </div>
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>Pending</div>
              <div className="font-semibold text-yellow-600">
                {[
                  formik.values.organizationVerificationStatus,
                  formik.values.companyPhoneVerificationStatus,
                  formik.values.companyWebsiteStatus,
                  formik.values.hrPhoneVerificationStatus,
                  formik.values.hrContactStatus,
                  formik.values.hrEmailVerificationStatus
                ].filter(status => !status).length}
              </div>
            </div>
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>Final Status</div>
              <div className={`font-semibold ${
                formik.values.organizationFinalReport === 'Positive' ? 'text-emerald-600' : 
                formik.values.organizationFinalReport === 'Negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {formik.values.organizationFinalReport || 'Pending'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationVerification;