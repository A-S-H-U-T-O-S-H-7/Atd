import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';

const ReferenceDetails = ({ formik, isDark, errors = {}, touched = {}  }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const errorInputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const errorSelectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const errorLabelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const errorTextareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const errorTextClassName = `text-xs mt-1 flex items-center space-x-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;


  // Helper function to check if field has error
  const hasError = (fieldName) => {
  return errors[fieldName] && touched[fieldName];
};

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
          {/* Reference Name */}
          <div>
            <label className={hasError('referenceName') ? errorLabelClassName : labelClassName}>
              Name
            </label>
            <input
              type="text"
              name="referenceName"
              value={formik.values.referenceName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('referenceName') ? errorInputClassName : inputClassName}
              placeholder="Enter reference name"
            />
            {hasError('referenceName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.referenceName}</span>
              </div>
            )}
          </div>

          {/* Reference Mobile */}
          <div>
            <label className={hasError('referenceMobile') ? errorLabelClassName : labelClassName}>
              Mobile
            </label>
            <input
              type="tel"
              name="referenceMobile"
              value={formik.values.referenceMobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('referenceMobile') ? errorInputClassName : inputClassName}
              placeholder="Enter mobile number"
            />
            {hasError('referenceMobile') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.referenceMobile}</span>
              </div>
            )}
          </div>

          {/* Reference Address */}
          <div className="md:col-span-2">
            <label className={hasError('referenceAddress') ? errorLabelClassName : labelClassName}>
              Address
            </label>
            <textarea
              rows="3"
              name="referenceAddress"
              value={formik.values.referenceAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('referenceAddress') ? errorTextareaClassName : textareaClassName}
              placeholder="Enter reference address"
            />
            {hasError('referenceAddress') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.referenceAddress}</span>
              </div>
            )}
          </div>

          {/* Reference Email */}
          <div>
            <label className={hasError('referenceEmailId') ? errorLabelClassName : labelClassName}>
              Email ID
            </label>
            <input
              type="email"
              name="referenceEmailId"
              value={formik.values.referenceEmailId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('referenceEmailId') ? errorInputClassName : inputClassName}
              placeholder="Enter email address"
            />
            {hasError('referenceEmailId') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.referenceEmailId}</span>
              </div>
            )}
          </div>

          {/* Reference Relation */}
          <div>
            <label className={hasError('referenceRelation') ? errorLabelClassName : labelClassName}>
              Relation
            </label>
            <select
              name="referenceRelation"
              value={formik.values.referenceRelation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('referenceRelation') ? errorSelectClassName : selectClassName}
            >
              <option value="">--Please Select Relation--</option>
              <option value="Friend">Friend</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Spouse">Spouse</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>          
              <option value="Colleague">Colleague</option>
              <option value="Neighbor">Neighbor</option>
              <option value="Relative">Relative</option>
              <option value="Business_associate">Business Associate</option>
              <option value="Other">Other</option>
            </select>
            {hasError('referenceRelation') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.referenceRelation}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceDetails;