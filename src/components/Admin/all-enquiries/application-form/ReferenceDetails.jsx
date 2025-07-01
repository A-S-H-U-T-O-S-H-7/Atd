import React from 'react';
import { Users } from 'lucide-react';

const ReferenceDetails = ({ formik, isDark }) => {
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

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Users className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Reference Details
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>Name</label>
            <input
              type="text"
              name="referenceName"
              value={formik.values.referenceName}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter reference name"
            />
          </div>

          <div>
            <label className={labelClassName}>Mobile</label>
            <input
              type="tel"
              name="referenceMobile"
              value={formik.values.referenceMobile}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter mobile number"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>Address</label>
            <textarea
              rows="3"
              name="referenceAddress"
              value={formik.values.referenceAddress}
              onChange={formik.handleChange}
              className={textareaClassName}
              placeholder="Enter reference address"
            />
          </div>

          <div>
            <label className={labelClassName}>Email ID</label>
            <input
              type="email"
              name="referenceEmailId"
              value={formik.values.referenceEmailId}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className={labelClassName}>Relation</label>
            <select
              name="referenceRelation"
              value={formik.values.referenceRelation}
              onChange={formik.handleChange}
              className={selectClassName}
            >
              <option value="">--Please Select Relation--</option>
              <option value="friend">Friend</option>
              <option value="colleague">Colleague</option>
              <option value="neighbor">Neighbor</option>
              <option value="relative">Relative</option>
              <option value="business_associate">Business Associate</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceDetails;