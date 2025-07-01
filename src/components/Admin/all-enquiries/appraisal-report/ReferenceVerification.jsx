import React from 'react';
import { Users, Save } from 'lucide-react';

const ReferenceVerification = ({ formik, onSectionSave, isDark }) => {
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

  const checkboxClassName = `w-5 h-5 rounded border-2 transition-all duration-200 ${
    isDark
      ? "bg-gray-700 border-gray-600 text-emerald-400 focus:ring-emerald-400"
      : "bg-gray-50 border-gray-300 text-emerald-600 focus:ring-emerald-500"
  }`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const relationOptions = [
    { value: '', label: 'Select Relation' },
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'brother', label: 'Brother' },
    { value: 'sister', label: 'Sister' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'friend', label: 'Friend' },
    { value: 'relative', label: 'Relative' },
    { value: 'neighbor', label: 'Neighbor' },
    { value: 'other', label: 'Other' }
  ];

  const updateAdditionalRef = (index, field, value) => {
    const updatedRefs = [...formik.values.additionalRefs];
    updatedRefs[index] = {
      ...updatedRefs[index],
      [field]: value
    };
    formik.setFieldValue('additionalRefs', updatedRefs);
  };

  return (
    <div className={`rounded-xl mt-8 shadow-lg border-2 overflow-hidden ${
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
            Reference Details Verification
          </h3>
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          <div className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Additional Ref Name:
          </div>
          <div className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Additional Ref Email:
          </div>
          <div className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Additional Ref Phone:
          </div>
          <div className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Ref Relation:
          </div>
          {/* <div className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Verified:
          </div> */}
        </div>

        {/* Reference Rows */}
        <div className="space-y-3">
          {formik.values.additionalRefs.map((ref, index) => (
            <div key={index} className="grid grid-cols-5 gap-3 items-center">
              <div>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => updateAdditionalRef(index, 'name', e.target.value)}
                  className={inputClassName}
                  placeholder=""
                />
              </div>

              <div>
                <input
                  type="email"
                  value={ref.email}
                  onChange={(e) => updateAdditionalRef(index, 'email', e.target.value)}
                  className={inputClassName}
                  placeholder=""
                />
              </div>

              <div>
                <input
                  type="tel"
                  value={ref.phone}
                  onChange={(e) => updateAdditionalRef(index, 'phone', e.target.value)}
                  className={inputClassName}
                  placeholder=""
                />
              </div>

              <div>
                <select
                  value={ref.relation}
                  onChange={(e) => updateAdditionalRef(index, 'relation', e.target.value)}
                  className={selectClassName}
                >
                  {relationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center items-center ">
                <input
                  type="checkbox"
                  id={`additionalRefVerified_${index}`}
                  checked={ref.verified}
                  onChange={(e) => updateAdditionalRef(index, 'verified', e.target.checked)}
                  className={checkboxClassName}
                />
              </div>
            </div>
          ))}
        </div>

       
      </div>

      {/* Save Button */}
      <div className="m-4 pt-4 flex justify-end border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onSectionSave}
          className="px-8 py-3 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white rounded-md font-medium transition-all duration-200 flex items-center space-x-2 text-sm"
        >
         
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default ReferenceVerification;