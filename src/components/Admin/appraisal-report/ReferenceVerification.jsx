import React, { useState } from 'react';
import { Users, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { referenceService } from '@/lib/services/appraisal';

const ReferenceVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [submittingReferences, setSubmittingReferences] = useState(false);
  // Consistent styling with other components
  const fieldClassName = `p-3 rounded-lg border transition-all duration-200 ${
    isDark
      ? "bg-gray-800/60 border-gray-600 hover:border-emerald-500/40 shadow-lg"
      : "bg-emerald-50/80 border-emerald-200 hover:border-emerald-300 shadow-sm"
  }`;

  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm text-center ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
  } outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm text-center ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
  } outline-none`;

  const checkboxClassName = `w-4 h-4 rounded border transition-all duration-200 mx-auto ${
    isDark
      ? "bg-gray-700 border-gray-600 text-emerald-400 focus:ring-emerald-400"
      : "bg-white border-gray-300 text-emerald-600 focus:ring-emerald-500"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700 shadow-lg shadow-emerald-900/20"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300 shadow-lg shadow-emerald-500/20"
  } disabled:cursor-not-allowed`;

  const headerClassName = `text-xs font-bold text-center py-3 ${
    isDark ? "text-gray-200 bg-gray-700/50" : "text-emerald-700 bg-emerald-100/50"
  }`;

  const srNoClassName = `text-xs font-semibold text-center py-3 flex items-center justify-center ${
    isDark ? "text-gray-300 bg-gray-700/30" : "text-gray-600 bg-emerald-50"
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

  // Check if a reference is complete (has name, phone, and email)
  const isReferenceComplete = (ref) => {
    return ref.name && ref.name.trim().length > 0 && 
           ref.phone && ref.phone.trim().length > 0 &&
           ref.email && ref.email.trim().length > 0;
  };

  // Check if a reference has any data at all
  const hasAnyData = (ref) => {
    return (ref.name && ref.name.trim()) || 
           (ref.email && ref.email.trim()) || 
           (ref.phone && ref.phone.trim()) || 
           ref.relation || 
           ref.verified;
  };

  // Handle save references with flexible validation
  const handleSaveReferences = async () => {
    try {
      setSubmittingReferences(true);
      
      // Get complete references (no minimum required - can be 0, 1, 2, 3, 4, or 5)
      const completeRefs = formik.values.additionalRefs.filter(isReferenceComplete);
      
      // Validate that all filled references are either complete or empty
      const incompleteRefs = formik.values.additionalRefs.filter((ref) => {
        return hasAnyData(ref) && !isReferenceComplete(ref);
      });

      if (incompleteRefs.length > 0) {
        toast.error('Please complete all fields (name, phone, email) for partially filled references, or clear them');
        return;
      }
      
      const referencesData = {
        application_id: parseInt(formik.values.applicationId),
        crnno: formik.values.crnNo || '',
      };

      // Add all 5 references (API expects all 5 slots, empty or filled)
      for (let i = 0; i < 5; i++) {
        const ref = formik.values.additionalRefs[i] || {};
        const num = i + 1;
        
        // Send data only if reference is complete, otherwise send empty
        if (isReferenceComplete(ref)) {
          referencesData[`add_ref_name_${num}`] = ref.name.trim();
          referencesData[`add_ref_email_${num}`] = ref.email.trim();
          referencesData[`add_ref_phone_${num}`] = parseInt(ref.phone.trim()) || 0;
          referencesData[`add_ref_relation_${num}`] = ref.relation || '';
          referencesData[`add_ref_verify_${num}`] = ref.verified || false;
        } else {
          // Send empty data for unused/incomplete slots
          referencesData[`add_ref_name_${num}`] = '';
          referencesData[`add_ref_email_${num}`] = '';
          referencesData[`add_ref_phone_${num}`] = 0;
          referencesData[`add_ref_relation_${num}`] = '';
          referencesData[`add_ref_verify_${num}`] = false;
        }
      }

      await referenceService.saveAdditionalReferences(referencesData);
      
      const savedCount = completeRefs.length;
      if (savedCount === 0) {
        toast.success('Reference data cleared successfully!');
      } else {
        toast.success(`${savedCount} reference${savedCount > 1 ? 's' : ''} saved successfully!`);
      }
      
      // Also call the section save callback if provided
      if (onSectionSave) {
        onSectionSave();
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || 'Invalid reference data. Please check all fields.';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to save references. Please try again.');
      }
    } finally {
      setSubmittingReferences(false);
    }
  };

  const updateAdditionalRef = (index, field, value) => {
    const updatedRefs = [...formik.values.additionalRefs];
    updatedRefs[index] = {
      ...updatedRefs[index],
      [field]: value
    };
    formik.setFieldValue('additionalRefs', updatedRefs);
  };

  return (
    <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-emerald-500/20 shadow-2xl shadow-emerald-900/10"
        : "bg-gradient-to-br from-gray-100 border-emerald-200 shadow-lg shadow-emerald-500/10"
    }`}>
      {/* Enhanced Header */}
      <div className={`p-4 border-b ${
        isDark 
          ? "border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900" 
          : "border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"
            }`}>
              <Users className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${
                isDark ? "text-emerald-400" : "text-emerald-700"
              }`}>
                Reference Verification
              </h3>
              <p className={`text-xs ${
                isDark ? "text-gray-400" : "text-emerald-600"
              }`}>
                Up to 5 reference contacts (flexible - can submit with any number)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table-like Layout */}
      <div className="p-4">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-3 mb-4 rounded-lg overflow-hidden">
          <div className={`${headerClassName} col-span-1 rounded-l-lg`}>
            Sr No
          </div>
          <div className={`${headerClassName} col-span-3`}>
            Ref Name
          </div>
          <div className={`${headerClassName} col-span-3`}>
            Ref Email
          </div>
          <div className={`${headerClassName} col-span-2`}>
            Ref Phone
          </div>
          <div className={`${headerClassName} col-span-2`}>
            Relation
          </div>
          <div className={`${headerClassName} col-span-1 rounded-r-lg`}>
            Verified
          </div>
        </div>

        {/* Reference Rows */}
        <div className="space-y-3">
        {formik.values.additionalRefs.slice(0, 5).map((ref, index) => {
            const hasData = hasAnyData(ref);
            const isComplete = isReferenceComplete(ref);
            const isIncomplete = hasData && !isComplete;
            
            return (
              <div 
                key={index} 
                className={`grid grid-cols-12 gap-3 items-center p-3 rounded-lg border transition-all duration-200 ${
                  isDark 
                    ? "bg-gray-800/40 border-gray-700 hover:border-gray-600" 
                    : "bg-white border-gray-200 hover:border-gray-300"
                } ${
                  ref.verified ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 
                  isIncomplete ? 'border-red-500 ring-1 ring-red-500/20' :
                  isComplete ? 'border-blue-500 ring-1 ring-blue-500/20' : ''
                }`}
              >
                {/* Serial Number */}
                <div className={srNoClassName}>
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                    {index + 1}
                  </span>
                </div>

                {/* Name */}
                <div className="col-span-3">
                  <input
                    type="text"
                    value={ref.name || ''}
                    onChange={(e) => updateAdditionalRef(index, 'name', e.target.value)}
                    className={inputClassName}
                    placeholder="Enter name"
                  />
                </div>

                {/* Email */}
                <div className="col-span-3">
                  <input
                    type="email"
                    value={ref.email || ''}
                    onChange={(e) => updateAdditionalRef(index, 'email', e.target.value)}
                    className={inputClassName}
                    placeholder="email@example.com"
                  />
                </div>

                {/* Phone */}
                <div className="col-span-2">
                  <input
                    type="tel"
                    value={ref.phone || ''}
                    onChange={(e) => updateAdditionalRef(index, 'phone', e.target.value)}
                    className={inputClassName}
                    placeholder="Phone number"
                  />
                </div>

                {/* Relation */}
                <div className="col-span-2">
                  <select
                    value={ref.relation || ''}
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

                {/* Verified Checkbox */}
                <div className="col-span-1 flex justify-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ref.verified || false}
                      onChange={(e) => updateAdditionalRef(index, 'verified', e.target.checked)}
                      className={checkboxClassName}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

       

        {/* Save Button at Bottom Right */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSaveReferences}
            disabled={submittingReferences || saving}
            className={buttonClassName}
          >
            {(submittingReferences || saving) ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {submittingReferences 
                ? 'Saving References...' 
                : saving 
                ? 'Saving...' 
                : 'Save References'
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceVerification;