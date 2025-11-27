import React, { useState, useEffect } from 'react';
import { Users, Save, Loader2, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import personalVerificationService from '@/lib/services/appraisal/personalVerificationService';
import ReferenceModal from './ReferenceModal';

const ReferenceVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [submittingReferences, setSubmittingReferences] = useState(false);
  const [showReferencesModal, setShowReferencesModal] = useState(false);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [fetchedReferences, setFetchedReferences] = useState([]);
  
  // Consistent styling with other components
  const secondaryButtonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm border ${
    isDark
      ? "bg-gradient-to-r from-pink-200 to-rose-300 text-pink-800 border-pink-700 hover:from-pink-300 hover:to-rose-400 text-pink-900 shadow-lg shadow-pink-900/20"
      : "bg-gradient-to-r from-pink-400 to-rose-500 text-white border-pink-400 hover:from-pink-300 hover:to-rose-400 text-pink-800 shadow-sm shadow-pink-500/20"
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

  // Fetch references when modal opens
const handleShowReferences = async () => {
  const applicationId = formik.values.applicationId;
  
  if (!applicationId) {
    toast.error('Application ID is required to fetch references');
    return;
  }

  setLoadingReferences(true);
  try {
    // FIX: Since axios returns response.data directly, we get the actual API response
    const response = await personalVerificationService.getReferences(applicationId);
    console.log('API Response:', response); // This will be the actual API response
    
    // Now response is the actual API data, so we check response.success directly
    if (response && response.success) {
      setFetchedReferences(response.reference || []);
      setShowReferencesModal(true);
      
      if (response.reference && response.reference.length > 0) {
        toast.success(`Loaded ${response.reference.length} references`);
      } else {
        toast.info('No references found');
      }
    } else {
      toast.error(response?.message || 'Failed to fetch references');
    }
  } catch (error) {
    console.error('Error fetching references:', error);
    console.error('Error details:', error.response?.data); 
    toast.error('Failed to fetch references');
  } finally {
    setLoadingReferences(false);
  }
};

// Refresh references
const handleRefreshReferences = async () => {
  const applicationId = formik.values.applicationId;
  
  if (!applicationId) {
    toast.error('Application ID is required');
    return;
  }

  setLoadingReferences(true);
  try {
    // FIX: Since axios returns response.data directly
    const response = await personalVerificationService.getReferences(applicationId);
    
    // Now response is the actual API data
    if (response && response.success) {
      setFetchedReferences(response.reference || []);
      
      if (response.reference && response.reference.length > 0) {
        toast.success(`Refreshed ${response.reference.length} references`);
      } else {
        toast.info('No references found');
      }
    } else {
      toast.error(response?.message || 'Failed to refresh references');
    }
  } catch (error) {
    console.error('Error refreshing references:', error);
    console.error('Error details:', error.response?.data);
    toast.error('Failed to refresh references');
  } finally {
    setLoadingReferences(false);
  }
};

  // Existing validation functions
  const hasMinimumData = (ref) => {
    const isValidPhone = ref.phone && ref.phone.trim().length === 10 && /^\d{10}$/.test(ref.phone.trim());
    const isValidEmail = !ref.email || !ref.email.trim() || (ref.email.includes('@') && ref.email.includes('.'));
    
    return ref.name && ref.name.trim().length > 0 && isValidPhone && isValidEmail;
  };

  const hasAnyData = (ref) => {
    return (ref.name && ref.name.trim()) || 
           (ref.email && ref.email.trim()) || 
           (ref.phone && ref.phone.trim()) || 
           ref.relation || 
           ref.verified;
  };

  const isPartiallyFilled = (ref) => {
    return hasAnyData(ref) && !hasMinimumData(ref);
  };

  const getDuplicateErrors = () => {
    const refs = formik.values.additionalRefs || [];
    const errors = {
      emails: {},
      phones: {}
    };

    refs.forEach((ref, index) => {
      if (ref.email && ref.email.trim()) {
        const email = ref.email.trim().toLowerCase();
        if (!errors.emails[email]) {
          errors.emails[email] = [];
        }
        errors.emails[email].push(index);
      }

      if (ref.phone && ref.phone.trim()) {
        const phone = ref.phone.trim();
        if (!errors.phones[phone]) {
          errors.phones[phone] = [];
        }
        errors.phones[phone].push(index);
      }
    });

    return errors;
  };

  const getReferenceErrors = (index) => {
    const errors = getDuplicateErrors();
    const ref = formik.values.additionalRefs[index];
    const refErrors = [];

    if (ref.email && ref.email.trim()) {
      const email = ref.email.trim().toLowerCase();
      if (errors.emails[email] && errors.emails[email].length > 1) {
        refErrors.push('email');
      }
    }

    if (ref.phone && ref.phone.trim()) {
      const phone = ref.phone.trim();
      if (errors.phones[phone] && errors.phones[phone].length > 1) {
        refErrors.push('phone');
      }
    }

    return refErrors;
  };

  const handleSaveReferences = async () => {
    try {
      setSubmittingReferences(true);
      
      // Validate all references before saving
      const refs = formik.values.additionalRefs || [];
      const invalidRefs = [];
      const duplicateErrors = getDuplicateErrors();
      
      refs.forEach((ref, index) => {
        const hasAnyData = (ref.name && ref.name.trim()) || 
                          (ref.email && ref.email.trim()) || 
                          (ref.phone && ref.phone.trim()) || 
                          ref.relation;
        
        if (hasAnyData) {
          if (ref.phone && ref.phone.trim()) {
            if (ref.phone.trim().length !== 10 || !/^\d{10}$/.test(ref.phone.trim())) {
              invalidRefs.push(`Reference ${index + 1}: Phone must be exactly 10 digits`);
            }
          }
          
          if (ref.email && ref.email.trim()) {
            if (!ref.email.includes('@') || !ref.email.includes('.')) {
              invalidRefs.push(`Reference ${index + 1}: Email must contain @ and .`);
            }
          }
          
          if (!ref.name || !ref.name.trim() || !ref.phone || !ref.phone.trim()) {
            invalidRefs.push(`Reference ${index + 1}: Both name and phone are required`);
          }
        }
      });
      
      // Check for duplicates
      Object.entries(duplicateErrors.emails).forEach(([email, indices]) => {
        if (indices.length > 1) {
          invalidRefs.push(`Email ${email} is used in references: ${indices.map(i => i + 1).join(', ')}`);
        }
      });

      Object.entries(duplicateErrors.phones).forEach(([phone, indices]) => {
        if (indices.length > 1) {
          invalidRefs.push(`Phone ${phone} is used in references: ${indices.map(i => i + 1).join(', ')}`);
        }
      });
      
      if (invalidRefs.length > 0) {
        invalidRefs.forEach(error => toast.error(error));
        return;
      }
      
      const applicationId = formik.values.applicationId;
      if (!applicationId) {
        toast.error('Application ID is required. Please refresh the page.');
        return;
      }
      
      const referencesData = {
        application_id: parseInt(applicationId),
        crnno: formik.values.crnNo || '',
        additionalRefs: formik.values.additionalRefs
      };
      
      await personalVerificationService.saveReferences(referencesData);
      toast.success('References saved successfully!');
      
    } catch (error) {
      console.error('Error saving references:', error);
      toast.error('Failed to save references');
    } finally {
      setSubmittingReferences(false);
    }
  };

  const updateAdditionalRef = (index, field, value) => {
    const updatedRefs = [...formik.values.additionalRefs];
    
    if (field === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      const limitedValue = digitsOnly.slice(0, 10);
      updatedRefs[index] = {
        ...updatedRefs[index],
        [field]: limitedValue
      };
    } else if (field === 'email') {
      updatedRefs[index] = {
        ...updatedRefs[index],
        [field]: value
      };
    } else {
      updatedRefs[index] = {
        ...updatedRefs[index],
        [field]: value
      };
    }
    
    formik.setFieldValue('additionalRefs', updatedRefs);
  };

  // Count how many references have minimum data
  const validReferencesCount = formik.values.additionalRefs.filter(hasMinimumData).length;

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
                Up to 5 reference contacts (Email and Phone must be unique)
              </p>
            </div>
          </div>
          <div className={`text-xs px-3 py-1 rounded-full ${
            isDark 
              ? "bg-emerald-500/20 text-emerald-300" 
              : "bg-emerald-500/10 text-emerald-700"
          }`}>
            {validReferencesCount} reference{validReferencesCount !== 1 ? 's' : ''} filled
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
            Ref Name *
          </div>
          <div className={`${headerClassName} col-span-3`}>
            Ref Email
          </div>
          <div className={`${headerClassName} col-span-2`}>
            Ref Phone *
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
            const hasMinData = hasMinimumData(ref);
            const isIncomplete = isPartiallyFilled(ref);
            const duplicateErrors = getReferenceErrors(index);
            const hasDuplicateEmail = duplicateErrors.includes('email');
            const hasDuplicatePhone = duplicateErrors.includes('phone');
            
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
                  hasMinData ? 'border-blue-500 ring-1 ring-blue-500/20' : ''
                } ${
                  (hasDuplicateEmail || hasDuplicatePhone) ? 'border-orange-500 ring-1 ring-orange-500/20' : ''
                }`}
              >
                {/* Serial Number */}
                <div className={srNoClassName}>
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold ${
                    hasDuplicateEmail || hasDuplicatePhone 
                      ? 'bg-orange-500' 
                      : 'bg-emerald-500'
                  }`}>
                    {index + 1}
                  </span>
                </div>

                {/* Name - Required */}
                <div className="col-span-3">
                  <input
                    type="text"
                    value={ref.name || ''}
                    onChange={(e) => updateAdditionalRef(index, 'name', e.target.value)}
                    className={inputClassName}
                    placeholder="Enter name *"
                  />
                </div>

                {/* Email - Optional */}
                <div className="col-span-3">
                  <input
                    type="email"
                    value={ref.email || ''}
                    onChange={(e) => updateAdditionalRef(index, 'email', e.target.value)}
                    className={`${inputClassName} ${
                      ref.email && ref.email.trim() && (!ref.email.includes('@') || !ref.email.includes('.'))
                        ? isDark
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-red-500 focus:border-red-500'
                        : ''
                    } ${
                      hasDuplicateEmail
                        ? isDark
                          ? 'border-orange-500 focus:border-orange-500'
                          : 'border-orange-500 focus:border-orange-500'
                        : ''
                    }`}
                    placeholder="email@example.com (optional)"
                  />
                  {ref.email && ref.email.trim() && (!ref.email.includes('@') || !ref.email.includes('.')) && (
                    <p className="text-xs text-red-500 mt-1 text-center">
                      Must contain @ and .
                    </p>
                  )}
                  {hasDuplicateEmail && (
                    <p className="text-xs text-orange-500 mt-1 text-center">
                      Duplicate email
                    </p>
                  )}
                </div>

                {/* Phone - Required */}
                <div className="col-span-2">
                  <input
                    type="tel"
                    value={ref.phone || ''}
                    onChange={(e) => updateAdditionalRef(index, 'phone', e.target.value)}
                    className={`${inputClassName} ${
                      ref.phone && ref.phone.length > 0 && ref.phone.length !== 10
                        ? isDark
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-red-500 focus:border-red-500'
                        : ''
                    } ${
                      hasDuplicatePhone
                        ? isDark
                          ? 'border-orange-500 focus:border-orange-500'
                          : 'border-orange-500 focus:border-orange-500'
                        : ''
                    }`}
                    placeholder="10 digits *"
                    maxLength={10}
                  />
                  {ref.phone && ref.phone.length > 0 && ref.phone.length !== 10 && (
                    <p className="text-xs text-red-500 mt-1 text-center">
                      {ref.phone.length}/10
                    </p>
                  )}
                  {hasDuplicatePhone && (
                    <p className="text-xs text-orange-500 mt-1 text-center">
                      Duplicate phone
                    </p>
                  )}
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

        {/* Buttons Section */}
        <div className="mt-6 flex justify-between">
          {/* Show References Button - Left Side */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleShowReferences}
              disabled={loadingReferences || submittingReferences || saving}
              className={secondaryButtonClassName}
            >
              {loadingReferences ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>
                {loadingReferences ? 'Loading...' : 'Show References'}
              </span>
            </button>
            
            
          </div>

          {/* Save References Button - Right Side */}
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

      {/* Reference Modal */}
      <ReferenceModal
        isOpen={showReferencesModal}
        onClose={() => setShowReferencesModal(false)}
        references={fetchedReferences}
        isDark={isDark}
        loading={loadingReferences}
        onRefresh={handleRefreshReferences}
      />
    </div>
  );
};

export default ReferenceVerification;