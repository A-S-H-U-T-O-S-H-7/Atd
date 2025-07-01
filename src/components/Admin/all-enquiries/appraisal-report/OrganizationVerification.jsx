import React, { useEffect } from 'react';
import { Building } from 'lucide-react';

const OrganizationVerification = ({ formik, onSectionSave, isDark }) => {
  const getInputClass = (type = 'input') => {
    const base = 'w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm';
    const darkMode = isDark
      ? 'bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400'
      : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500';
    const ring = 'focus:ring-2 focus:ring-emerald-500/20 focus:outline-none';
    const resize = type === 'textarea' ? 'resize-none' : '';
    return `${base} ${darkMode} ${ring} ${resize}`;
  };

  const getDataDisplayClass = () =>
    `w-full px-3 py-2 rounded-lg border-2  font-semibold ${
      isDark 
        ? 'bg-gray-600/40 border-gray-600 text-emerald-500' 
        : 'bg-blue-50 border-blue-200 text-blue-800'
    }`;

  const labelClass = `block text-xs font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`;

  const handleRemarkChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('organizationRemark', value);
    setTimeout(() => onSectionSave(), 500);
  };

  useEffect(() => {
    const statuses = [
      'organizationVerificationStatus',
      'companyPhoneVerificationStatus',
      'hrPhoneVerificationStatus',
      'companyWebsiteStatus',
      'hrContactStatus',
      'hrEmailVerificationStatus'
    ];
    const values = statuses.map(field => formik.values[field]);
    const allFilled = values.every(v => v);
    const allPositive = values.every(v => ['yes', 'verified', 'positive'].includes(v));
    if (allFilled) {
      const result = allPositive ? 'positive' : 'negative';
      if (formik.values.organizationFinalReport !== result) {
        formik.setFieldValue('organizationFinalReport', result);
      }
    }
  }, [
    formik.values.organizationVerificationStatus,
    formik.values.companyPhoneVerificationStatus,
    formik.values.hrPhoneVerificationStatus,
    formik.values.companyWebsiteStatus,
    formik.values.hrContactStatus,
    formik.values.hrEmailVerificationStatus
  ]);

  return (
    <div
      className={`rounded-xl mt-8 shadow-lg border-2 overflow-hidden ${
        isDark
          ? 'bg-gray-800 border-emerald-600/50 shadow-emerald-900/20'
          : 'bg-white border-emerald-300 shadow-emerald-500/10'
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-6">
          <Building className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            Organization Verification
          </h3>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            {/* Organization Name & Verify Button */}
            <div className={`border rounded-md p-6 ${isDark ? 'border-teal-400' : 'border-blue-300'}`}>
              <label className={labelClass}>Organization Name:</label>
              <div className="flex gap-2">
                <div className={`${getDataDisplayClass()} flex-1`}>
                  {formik.values.organizationContactName || 'NTTDATA'}
                </div>
                <button 
                  type="button" 
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Company Phone Verification */}
            <div className={`border rounded-md p-6 ${isDark ? 'border-teal-400' : 'border-blue-300'}`}>
              <label className={labelClass}>Company Phone No.:</label>
              <div className={getDataDisplayClass()}>
                {formik.values.companyPhoneNo || '08042100400'}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className={`${labelClass} text-xs`}>Verification Status:</label>
                  <select
                    value={formik.values.companyPhoneVerificationStatus || ''}
                    onChange={(e) => formik.setFieldValue('companyPhoneVerificationStatus', e.target.value)}
                    className={getInputClass()}
                  >
                    <option value="">--Select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className={`${labelClass} text-xs`}>Method:</label>
                  <select
                    value={formik.values.companyPhoneVerificationMethod || ''}
                    onChange={(e) => formik.setFieldValue('companyPhoneVerificationMethod', e.target.value)}
                    className={getInputClass()}
                  >
                    <option value="">--Select--</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Company Website */}
            <div className={`border rounded-md p-6  ${isDark ? 'border-teal-400' : 'border-blue-300'}`}>
              <label className={labelClass}>Company Website:</label>
              <div className={getDataDisplayClass()}>
                {formik.values.companyWebsite || 'https://www.nttdataservices.com'}
              </div>
              <div className="mt-2">
                <label className={`${labelClass} text-xs`}>Website Status:</label>
                <select
                  value={formik.values.companyWebsiteStatus || ''}
                  onChange={(e) => formik.setFieldValue('companyWebsiteStatus', e.target.value)}
                  className={getInputClass()}
                >
                  <option value="">--Select--</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Verification Online & Method */}
            <div className={`grid grid-cols-2 gap-2 border rounded-md p-6 ${isDark ? 'border-teal-400' : 'border-blue-300'}`}>
              <div>
                <label className={labelClass}>Verification Online:</label>
                <select
                  value={formik.values.organizationVerificationStatus || ''}
                  onChange={(e) => formik.setFieldValue('organizationVerificationStatus', e.target.value)}
                  className={getInputClass()}
                >
                  <option value="">--Select--</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Verification Method:</label>
                <select
                  value={formik.values.organizationVerificationMethod || ''}
                  onChange={(e) => formik.setFieldValue('organizationVerificationMethod', e.target.value)}
                  className={getInputClass()}
                >
                  <option value="">--Select--</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>

            {/* HR Phone Verification */}
            <div className={`border rounded-md p-6 ${isDark ? 'border-teal-400' : 'border-blue-300'}`}>
              <label className={labelClass}>HR Phone No.:</label>
              <div className={getDataDisplayClass()}>
                {formik.values.hrPhoneNo || '7298431297'}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className={`${labelClass} text-xs`}>Verification Status:</label>
                  <select
                    value={formik.values.hrPhoneVerificationStatus || ''}
                    onChange={(e) => formik.setFieldValue('hrPhoneVerificationStatus', e.target.value)}
                    className={getInputClass()}
                  >
                    <option value="">--Select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className={`${labelClass} text-xs`}>Method:</label>
                  <select
                    value={formik.values.hrPhoneVerificationMethod || ''}
                    onChange={(e) => formik.setFieldValue('hrPhoneVerificationMethod', e.target.value)}
                    className={getInputClass()}
                  >
                    <option value="">--Select--</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
              </div>
            </div>

            {/* HR Contact & Email */}
            <div className={`border rounded-md p-6 ${isDark ? 'border-teal-400' : 'border-blue-300'} `}>
              <label className={labelClass}>HR Contact Name:</label>
              <div className={getDataDisplayClass()}>
                {formik.values.hrContactName || 'Asha'}
              </div>
              <div className="mt-2">
                <label className={`${labelClass} text-xs`}>Contact Status:</label>
                <select
                  value={formik.values.hrContactStatus || ''}
                  onChange={(e) => formik.setFieldValue('hrContactStatus', e.target.value)}
                  className={getInputClass()}
                >
                  <option value="">--Select--</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* HR Email Section - Full Width */}
        <div className={`mt-6 border rounded-md p-6 ${isDark ? 'border-teal-400' : 'border-blue-300'}`}>
          <label className={labelClass}>HR Email:</label>
          <div className={getDataDisplayClass()}>
            {formik.values.hrEmail || 'asha.k12@nttdata.com'}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-2">
            <button
              type="button"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              ✓ Send Mail to HR
            </button>
            <select
              value={formik.values.hrEmailVerificationStatus || ''}
              onChange={(e) => formik.setFieldValue('hrEmailVerificationStatus', e.target.value)}
              className={getInputClass()}
            >
              <option value="">Verification Status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <select
              value={formik.values.hrEmailVerificationMethod || ''}
              onChange={(e) => formik.setFieldValue('hrEmailVerificationMethod', e.target.value)}
              className={getInputClass()}
            >
              <option value="">Method</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        {/* Remark Section */}
        <div className="mt-6">
          <label className={labelClass}>Remark:</label>
          <textarea
            rows={3}
            value={formik.values.organizationRemark || ''}
            onChange={handleRemarkChange}
            className={getInputClass('textarea')}
            placeholder="1 - Name of organization: NTTDATA
2 - Company Website: https://www.nttdataservices.com"
          />
        </div>

        {/* Final Report */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Final Report:</label>
            <select
              value={formik.values.organizationFinalReport || ''}
              className={`${getInputClass()} ${
                formik.values.organizationFinalReport === 'positive' 
                  ? 'bg-green-50 border-green-300 text-green-800' 
                  : formik.values.organizationFinalReport === 'negative'
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : ''
              }`}
              disabled
            >
              <option value="">--Select--</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 pt-4 flex justify-end border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={onSectionSave}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationVerification;