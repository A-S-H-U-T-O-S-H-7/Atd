import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const AlternativeNumberRemark = ({ formik, onSectionSave, isDark }) => {
  const staticDisplayClassName = `w-full px-3 py-2 rounded-lg border-2 text-sm ${
    isDark
      ? "bg-gray-800 border-gray-600 text-gray-300"
      : "bg-gray-100 border-gray-300 text-gray-700"
  }`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  // Auto-save function for remark
  const handleRemarkChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('remark', value);
    
    // Auto-save after a short delay to avoid too many API calls
    setTimeout(() => {
      onSectionSave();
    }, 500);
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Phone className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Additional Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Alternative Mobile Number (Static Display) */}
          <div>
            <label className={labelClassName}>Alternative Mobile No</label>
            <div className={staticDisplayClassName}>
              {formik.values.alternateMobileNo1 || 'Not provided'}
            </div>
            <div className='mt-3'>
            <div className={staticDisplayClassName}>
              {formik.values.alternateMobileNo2 || 'Not provided'}
            </div>
            </div>
          </div>

          {/* Right Column - Remark */}
          <div>
            <label className={labelClassName}>Remark</label>
            <textarea
              rows="3"
              value={formik.values.remark}
              onChange={handleRemarkChange}
              className={textareaClassName}
              placeholder="Enter any remarks or notes"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeNumberRemark;