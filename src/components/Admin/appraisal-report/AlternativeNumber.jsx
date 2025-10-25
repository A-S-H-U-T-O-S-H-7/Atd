// components/appraisal/AlternativeNumberRemark.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import personalVerificationService from '@/lib/services/appraisal/personalVerificationService';

const AlternativeNumberRemark = ({ formik, isDark }) => {
  const [saving, setSaving] = useState(false);
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [localRemarkValue, setLocalRemarkValue] = useState(formik.values.remark || '');
  const timeoutRef = useRef(null);
  const formikUpdateTimeoutRef = useRef(null);

  // Consistent styling with other components
  const fieldClassName = `p-3 rounded-lg border transition-all duration-200 ${
    isDark
      ? "bg-gray-800/60 border-gray-600 hover:border-emerald-500/40 shadow-lg"
      : "bg-emerald-50/80 border-emerald-200 hover:border-emerald-300 shadow-sm"
  }`;

  const labelClassName = `text-xs font-semibold mb-1 flex items-center space-x-2 ${
    isDark ? "text-gray-300" : "text-emerald-700"
  }`;

  const inputClassName = `w-full bg-transparent border-none outline-none text-sm font-medium ${
    isDark ? "text-white placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
  }`;

  const textareaClassName = `w-full bg-transparent border-none outline-none text-sm font-medium resize-none ${
    isDark ? "text-white placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
  }`;

  const errorClassName = `text-xs mt-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const successClassName = `text-xs mt-1 ${
    isDark ? "text-emerald-400" : "text-emerald-600"
  }`;

  const IconWrapper = ({ icon: Icon, className = "" }) => (
    <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"} ${className}`} />
  );

  // Sync external changes to local state
  useEffect(() => {
    setLocalRemarkValue(formik.values.remark || '');
  }, [formik.values.remark]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (formikUpdateTimeoutRef.current) {
        clearTimeout(formikUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Debounced save function for numbers and remarks
  const debouncedSaveData = useCallback(async (fieldName, value) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        
        const data = {
          application_id: parseInt(formik.values.applicationId),
        };

        if (fieldName === 'alternateMobileNo1' || fieldName === 'alternateMobileNo2') {
          // Save BOTH numbers together (backend expects both)
          // Ensure we send current values as strings
          data.alternate_no1 = formik.values.alternateMobileNo1 || '';
          data.alternate_no2 = formik.values.alternateMobileNo2 || '';
          await personalVerificationService.saveAlternativeNumbers(data);
        } else if (fieldName === 'remark') {
          // Save remark
          data.remarks = value;
          await personalVerificationService.savePersonalRemark(data);
        }
        
        // Clear any existing errors
        formik.setFieldError(fieldName, undefined);
      } catch (error) {
        // Error handling is done in the service
        console.error('Error saving data:', error);
      } finally {
        setSaving(false);
      }
    }, 500);
  }, [formik.values.applicationId, formik.values.alternateMobileNo1, formik.values.alternateMobileNo2]);

  // Handle phone number input change
  const handlePhoneChange = (fieldName, value) => {
    // Only allow numbers and limit to 10 digits
    const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
    
    // Validate first digit (must be 6, 7, 8, or 9)
    if (numbersOnly.length > 0 && !/^[6-9]/.test(numbersOnly)) {
      formik.setFieldError(fieldName, 'Mobile number must start with 6, 7, 8, or 9');
      return;
    }
    
    // Update formik value immediately
    formik.setFieldValue(fieldName, numbersOnly);
    
    // Clear existing error when user starts typing
    if (formik.errors[fieldName] && numbersOnly.length > 0) {
      formik.setFieldError(fieldName, undefined);
    }

    // Trigger save if we have exactly 10 digits and valid
    if (numbersOnly.length === 10 && /^[6-9]\d{9}$/.test(numbersOnly)) {
      debouncedSaveData(fieldName, numbersOnly);
    }
  };

  // Optimized remark change handler
  const handleRemarkChange = (value) => {
    // Update local state immediately
    setLocalRemarkValue(value);
    
    // Debounce formik update to prevent excessive re-renders
    if (formikUpdateTimeoutRef.current) {
      clearTimeout(formikUpdateTimeoutRef.current);
    }
    formikUpdateTimeoutRef.current = setTimeout(() => {
      formik.setFieldValue('remark', value);
    }, 500);
    
    // Debounce the API call (longer delay)
    debouncedSaveData('remark', value);
  };

  // Check if number is valid (must start with 6, 7, 8, or 9 and be exactly 10 digits)
  const isNumberValid = (number) => {
    return number && number.length === 10 && /^[6-9]\d{9}$/.test(number);
  };
  
  // Validate number starts with 6-9
  const validateIndianMobile = (number) => {
    if (number.length > 0 && !/^[6-9]/.test(number)) {
      return 'Mobile number must start with 6, 7, 8, or 9';
    }
    return null;
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
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"
          }`}>
            <Phone className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${
              isDark ? "text-emerald-400" : "text-emerald-700"
            }`}>
              Additional Information
            </h3>
            <p className={`text-xs ${
              isDark ? "text-gray-400" : "text-emerald-600"
            }`}>
              Alternative contacts and remarks
            </p>
          </div>
        </div>
      </div>

      {/* Compact Content Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-4">
            {/* Primary Alternative Number */}
            <div className={`${fieldClassName} group hover:scale-[1.02] transition-all duration-200 ${
              formik.errors.alternateMobileNo1 ? 'border-red-500' : 
              isNumberValid(formik.values.alternateMobileNo1) ? 'border-emerald-500' : ''
            }`}>
              <div className={labelClassName}>
                <IconWrapper icon={Phone} />
                <span>Primary Alternative No</span>
                {saving && formik.values.alternateMobileNo1?.length === 10 && (
                  <div className="ml-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <input
                type="tel"
                value={formik.values.alternateMobileNo1 || ''}
                onChange={(e) => handlePhoneChange('alternateMobileNo1', e.target.value)}
                className={inputClassName}
                placeholder="Enter 10-digit number"
                maxLength={10}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              {formik.errors.alternateMobileNo1 ? (
                <div className={errorClassName}>
                  ⚠ {formik.errors.alternateMobileNo1}
                </div>
              ) : isNumberValid(formik.values.alternateMobileNo1) ? (
                <div className={successClassName}>
                  ✓ Number Added Successfully
                </div>
              ) : formik.values.alternateMobileNo1 ? (
                <div className={`text-xs mt-1 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                  ⚠ {10 - (formik.values.alternateMobileNo1.length || 0)} digits remaining
                </div>
              ) : null}
            </div>

            {/* Secondary Alternative Number */}
            <div className={`${fieldClassName} group hover:scale-[1.02] transition-all duration-200 ${
              formik.errors.alternateMobileNo2 ? 'border-red-500' : 
              isNumberValid(formik.values.alternateMobileNo2) ? 'border-emerald-500' : ''
            }`}>
              <div className={labelClassName}>
                <IconWrapper icon={Phone} />
                <span>Secondary Alternative No</span>
                {saving && formik.values.alternateMobileNo2?.length === 10 && (
                  <div className="ml-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <input
                type="tel"
                value={formik.values.alternateMobileNo2 || ''}
                onChange={(e) => handlePhoneChange('alternateMobileNo2', e.target.value)}
                className={inputClassName}
                placeholder="Enter 10-digit number"
                maxLength={10}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              {formik.errors.alternateMobileNo2 ? (
                <div className={errorClassName}>
                  ⚠ {formik.errors.alternateMobileNo2}
                </div>
              ) : isNumberValid(formik.values.alternateMobileNo2) ? (
                <div className={successClassName}>
                  ✓ Number Added Successfully
                </div>
              ) : formik.values.alternateMobileNo2 ? (
                <div className={`text-xs mt-1 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                  ⚠ {10 - (formik.values.alternateMobileNo2.length || 0)} digits remaining
                </div>
              ) : null}
            </div>
          </div>

          {/* Remarks */}
          <div className={`${fieldClassName} group hover:scale-[1.02] transition-all duration-200`}>
            <div className={labelClassName}>
              <IconWrapper icon={MessageSquare} />
              <span>Remarks & Notes</span>
              {remarkSaving && (
                <div className="ml-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <textarea
              rows="5"
              value={localRemarkValue}
              onChange={(e) => handleRemarkChange(e.target.value)}
              className={textareaClassName}
              placeholder="Additional remarks or observations..."
            />
            <div className={`text-xs mt-2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              {localRemarkValue?.length || 0} characters
              {remarkSaving && ' • Saving...'}
            </div>
          </div>
        </div>

        {/* Auto-save Status */}
        <div className="mt-4 flex justify-between items-center">
          <div className={`text-xs px-3 py-1 rounded-full ${
            isDark 
              ? "bg-gray-700 text-gray-300 border border-gray-600" 
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}>
            💾 Auto-saves after 1 second
          </div>
          
          <div className="flex space-x-3 text-xs">
            <span className={
              isNumberValid(formik.values.alternateMobileNo1) 
                ? (isDark ? "text-emerald-400" : "text-emerald-600") 
                : (isDark ? "text-gray-400" : "text-gray-500")
            }>
              Primary: {isNumberValid(formik.values.alternateMobileNo1) ? '✓ Valid' : '✗ Invalid'}
            </span>
            <span className={
              isNumberValid(formik.values.alternateMobileNo2) 
                ? (isDark ? "text-emerald-400" : "text-emerald-600") 
                : (isDark ? "text-gray-400" : "text-gray-500")
            }>
              Secondary: {isNumberValid(formik.values.alternateMobileNo2) ? '✓ Valid' : '✗ Invalid'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeNumberRemark;