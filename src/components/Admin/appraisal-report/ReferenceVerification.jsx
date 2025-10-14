import React from 'react';
import { Users, Save, User, Mail, Phone, Link2, Plus, Trash2 } from 'lucide-react';

const ReferenceVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const checkboxClassName = `w-4 h-4 rounded border transition-all duration-200 ${
    isDark
      ? "bg-gray-700 border-gray-600 text-emerald-400 focus:ring-emerald-400"
      : "bg-white border-gray-300 text-emerald-600 focus:ring-emerald-500"
  }`;

  const labelClassName = `block text-xs font-semibold mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

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

  const addReference = () => {
    const updatedRefs = [...formik.values.additionalRefs];
    // Find first empty slot or add new
    const emptyIndex = updatedRefs.findIndex(ref => !ref.name && !ref.email && !ref.phone);
    if (emptyIndex === -1 && updatedRefs.length < 6) {
      updatedRefs.push({
        name: '',
        email: '',
        phone: '',
        relation: '',
        verified: false
      });
    }
    formik.setFieldValue('additionalRefs', updatedRefs);
  };

  const removeReference = (index) => {
    const updatedRefs = formik.values.additionalRefs.filter((_, i) => i !== index);
    // Ensure we always have at least one empty reference
    if (updatedRefs.length === 0) {
      updatedRefs.push({
        name: '',
        email: '',
        phone: '',
        relation: '',
        verified: false
      });
    }
    formik.setFieldValue('additionalRefs', updatedRefs);
  };

  const getEmptyReferencesCount = () => {
    return formik.values.additionalRefs.filter(ref => 
      !ref.name && !ref.email && !ref.phone
    ).length;
  };

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
            <Users className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Reference Verification
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={addReference}
              disabled={formik.values.additionalRefs.length >= 6}
              className={`px-3 py-1 rounded text-xs ${
                isDark 
                  ? "bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100"
              } transition-all duration-200 flex items-center space-x-1`}
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
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
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-4">
          <div className={`text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            Add up to 6 additional references. Empty references will not be saved.
          </div>
        </div>

        <div className="space-y-4">
          {formik.values.additionalRefs.map((ref, index) => (
            <div key={index} className={`p-4 rounded-lg border transition-all duration-200 ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            } ${(ref.name || ref.email || ref.phone) ? 'border-emerald-400/50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Reference #{index + 1}
                </h4>
                {formik.values.additionalRefs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReference(index)}
                    className={`p-1 rounded ${
                      isDark 
                        ? "hover:bg-gray-600 text-gray-400" 
                        : "hover:bg-gray-200 text-gray-500"
                    } transition-colors`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                {/* Name */}
                <div className="md:col-span-3">
                  <label className={labelClassName}>
                    <User className="w-3 h-3 inline mr-1" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) => updateAdditionalRef(index, 'name', e.target.value)}
                    className={inputClassName}
                    placeholder="Full name"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-3">
                  <label className={labelClassName}>
                    <Mail className="w-3 h-3 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={ref.email}
                    onChange={(e) => updateAdditionalRef(index, 'email', e.target.value)}
                    className={inputClassName}
                    placeholder="email@example.com"
                  />
                </div>

                {/* Phone */}
                <div className="md:col-span-3">
                  <label className={labelClassName}>
                    <Phone className="w-3 h-3 inline mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={ref.phone}
                    onChange={(e) => updateAdditionalRef(index, 'phone', e.target.value)}
                    className={inputClassName}
                    placeholder="Phone number"
                  />
                </div>

                {/* Relation */}
                <div className="md:col-span-2">
                  <label className={labelClassName}>
                    <Link2 className="w-3 h-3 inline mr-1" />
                    Relation
                  </label>
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

                {/* Verified */}
                <div className="md:col-span-1 flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ref.verified}
                      onChange={(e) => updateAdditionalRef(index, 'verified', e.target.checked)}
                      className={checkboxClassName}
                    />
                    <span className={`text-xs ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Verified
                    </span>
                  </label>
                </div>
              </div>

              {/* Verification Status */}
              {ref.verified && (
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isDark 
                      ? "bg-green-900/50 text-green-400 border border-green-800"
                      : "bg-green-100 text-green-800 border border-green-200"
                  }`}>
                    ✓ Verified
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className={`mt-4 p-3 rounded-lg border ${
          isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>Total References</div>
              <div className="font-semibold">{formik.values.additionalRefs.length}</div>
            </div>
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>Verified</div>
              <div className="font-semibold text-emerald-600">
                {formik.values.additionalRefs.filter(ref => ref.verified).length}
              </div>
            </div>
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>With Details</div>
              <div className="font-semibold">
                {formik.values.additionalRefs.filter(ref => ref.name || ref.email || ref.phone).length}
              </div>
            </div>
            <div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>Empty Slots</div>
              <div className="font-semibold">
                {getEmptyReferencesCount()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceVerification;