import React from 'react';
import { Phone, MessageSquare, Save } from 'lucide-react';

const AlternativeNumberRemark = ({ formik, onSectionSave, isDark, saving }) => {
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

  const labelClassName = `block text-xs font-semibold mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const valueClassName = `w-full px-3 py-2 rounded-lg border text-sm ${
    isDark
      ? "bg-gray-600/50 border-gray-500 text-gray-300"
      : "bg-gray-100 border-gray-300 text-gray-600"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

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
            <Phone className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Additional Information
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Alternative Numbers */}
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>
                <Phone className="w-4 h-4 inline mr-1" />
                Primary Alternative Mobile No
              </label>
              <input
                type="tel"
                value={formik.values.alternateMobileNo1}
                onChange={(e) => formik.setFieldValue('alternateMobileNo1', e.target.value)}
                className={inputClassName}
                placeholder="Enter primary alternative number"
              />
              {formik.values.alternateMobileNo1 && (
                <div className="mt-1 text-xs text-emerald-600">
                  ✓ Number added
                </div>
              )}
            </div>

            <div>
              <label className={labelClassName}>
                <Phone className="w-4 h-4 inline mr-1" />
                Secondary Alternative Mobile No
              </label>
              <input
                type="tel"
                value={formik.values.alternateMobileNo2}
                onChange={(e) => formik.setFieldValue('alternateMobileNo2', e.target.value)}
                className={inputClassName}
                placeholder="Enter secondary alternative number"
              />
              {formik.values.alternateMobileNo2 && (
                <div className="mt-1 text-xs text-emerald-600">
                  ✓ Number added
                </div>
              )}
            </div>

            {/* Display current numbers */}
            {(formik.values.alternateMobileNo1 || formik.values.alternateMobileNo2) && (
              <div className={`p-3 rounded-lg border ${
                isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}>
                <h4 className={`text-xs font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Current Alternative Numbers
                </h4>
                <div className="space-y-1 text-sm">
                  {formik.values.alternateMobileNo1 && (
                    <div className={valueClassName}>{formik.values.alternateMobileNo1}</div>
                  )}
                  {formik.values.alternateMobileNo2 && (
                    <div className={valueClassName}>{formik.values.alternateMobileNo2}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Remark */}
          <div>
            <label className={labelClassName}>
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Remarks & Notes
            </label>
            <textarea
              rows="6"
              value={formik.values.remark}
              onChange={(e) => formik.setFieldValue('remark', e.target.value)}
              className={textareaClassName}
              placeholder="Enter any additional remarks, notes, or observations about the customer..."
            />
            <div className={`text-xs mt-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              Character count: {formik.values.remark?.length || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeNumberRemark;