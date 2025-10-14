import React from 'react';
import { UserCheck, Save, User, MapPin, Home } from 'lucide-react';

const PersonalVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-semibold mb-2 flex items-center space-x-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  const IconWrapper = ({ icon: Icon, className = "" }) => (
    <Icon className={`w-4 h-4 ${className}`} />
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
            <UserCheck className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Personal Verification
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
        <div className="space-y-4">
          {/* Father Name */}
          <div>
            <label className={labelClassName}>
              <IconWrapper icon={User} />
              <span>Father's Name</span>
            </label>
            <input
              type="text"
              value={formik.values.fatherName}
              onChange={(e) => formik.setFieldValue('fatherName', e.target.value)}
              className={inputClassName}
              placeholder="Enter father's full name"
            />
          </div>

          {/* Current Address */}
          <div>
            <label className={labelClassName}>
              <IconWrapper icon={MapPin} />
              <span>Current Address</span>
            </label>
            <textarea
              rows="3"
              value={formik.values.currentAddress}
              onChange={(e) => formik.setFieldValue('currentAddress', e.target.value)}
              className={textareaClassName}
              placeholder="Enter current residential address"
            />
          </div>

          {/* Permanent Address */}
          <div>
            <label className={labelClassName}>
              <IconWrapper icon={Home} />
              <span>Permanent Address</span>
            </label>
            <textarea
              rows="3"
              value={formik.values.permanentAddress}
              onChange={(e) => formik.setFieldValue('permanentAddress', e.target.value)}
              className={textareaClassName}
              placeholder="Enter permanent address"
            />
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="mt-4 flex justify-end">
          <div className={`text-xs px-2 py-1 rounded ${
            isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}>
            Changes auto-save when you click Save
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalVerification;