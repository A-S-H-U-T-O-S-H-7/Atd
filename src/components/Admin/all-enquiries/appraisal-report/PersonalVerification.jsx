import React from 'react';
import { UserCheck, Save } from 'lucide-react';

const PersonalVerification = ({ formik, onSectionSave, isDark }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
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

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <UserCheck className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Personal Verification
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Father Name</label>
            <input
              type="text"
              value={formik.values.fatherName}
              onChange={(e) => formik.setFieldValue('fatherName', e.target.value)}
              className={inputClassName}
              placeholder="Enter father's name"
            />
          </div>

          <div>
            <label className={labelClassName}>Current Address</label>
            <textarea
              rows="3"
              value={formik.values.currentAddress}
              onChange={(e) => formik.setFieldValue('currentAddress', e.target.value)}
              
              className={textareaClassName}
              placeholder="Enter current address"
            />
          </div>

          <div>
            <label className={labelClassName}>Permanent Address</label>
            <textarea
              rows="3"
              value={formik.values.permanentAddress}
              onChange={(e) => formik.setFieldValue('permanentAddress', e.target.value)}
              className={textareaClassName}
              placeholder="Enter permanent address"
            />
          </div>
        </div>
      </div>
      {/* Save Button */}
<div className="m-4 pt-4  flex justify-end  border-t border-gray-200 dark:border-gray-600">
  <button
    type="button"
    onClick={onSectionSave}
    className="px-8 py-3 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white rounded-md font-medium transition-all duration-200 flex  space-x-2 text-sm"
  >
    
    <span>Save</span>
  </button>
</div>
    </div>
  );
};

export default PersonalVerification;