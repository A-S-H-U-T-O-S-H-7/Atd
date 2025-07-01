import React from 'react';
import { TrendingUp, Save } from 'lucide-react';

const SocialScoreVerification = ({ formik, onSectionSave, isDark }) => {
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

  const textareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  return <div className={`rounded-xl shadow-lg mt-8 border-2 overflow-hidden ${isDark ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20" : "bg-white border-emerald-300 shadow-emerald-500/10"}`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3
            className={`text-lg font-semibold ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          >
            Social Score
          </h3>
        </div>

        <div className="space-y-4">
          {/* Score (>500) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClassName}>Score (&gt;500):</label>
              <input type="number" value={formik.values.socialScore} onChange={e => formik.setFieldValue("socialScore", e.target.value)} className={inputClassName} placeholder="500" />
            </div>
            <div>
              <label className={labelClassName}>Score Status</label>
              <select value={formik.values.socialScoreRange} onChange={e => formik.setFieldValue("socialScoreRange", e.target.value)} className={selectClassName}>
                <option value="">Select</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>Recommendation</label>
              <select value={formik.values.socialScoreRecommendation} onChange={e => formik.setFieldValue("socialScoreRecommendation", e.target.value)} className={selectClassName}>
                <option value="">Select</option>
                <option value="Recommended">Recommended</option>
                <option value="Not Recommended">Not Recommended</option>
              </select>
            </div>
          </div>

          {/* Remark */}
          <div>
            <label className={labelClassName}>Remark:</label>
            <textarea rows="3" value={formik.values.socialScoreRemark} onChange={e => {
                formik.setFieldValue("socialScoreRemark", e.target.value);
                onSectionSave();
              }} className={textareaClassName} placeholder="Enter remarks" />
          </div>

          {/* Final Report */}
          <div>
            <label className={labelClassName}>Final Report:</label>
            <select value={formik.values.socialScoreFinalReport} onChange={e => formik.setFieldValue("socialScoreFinalReport", e.target.value)} className={selectClassName}>
              <option value="">Select Final Report</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="m-4 pt-4 flex justify-end border-t border-gray-200 dark:border-gray-600">
        <button type="button" onClick={onSectionSave} className="px-6 py-2 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white rounded-md font-medium transition-all duration-200 flex space-x-2 text-sm">
          <span>Save</span>
        </button>
      </div>
    </div>;
};

export default SocialScoreVerification;