import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { alternateNumbersService, personalInfoService } from '@/lib/services/appraisal';

const AlternativeNumberRemark = ({ formik, isDark }) => {
  const [saving, setSaving] = useState(false);
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [localRemarkValue, setLocalRemarkValue] = useState(formik.values.remark || '');
  const timeoutRef = useRef(null);
  const formikUpdateTimeoutRef = useRef(null);

  // Yup validation schema
  const phoneValidationSchema = Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number starting with 6-9')
    .required('Phone number is required');

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

  // Debounced save function for numbers
  const debouncedSaveNumber = useCallback(async (fieldName, value) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        // Validate the number
        await phoneValidationSchema.validate(value);
        
        if (!formik.values.applicationId) {
          return;
        }
        
        setSaving(true);
        const data = {
          application_id: parseInt(formik.values.applicationId),
          [fieldName === 'alternateMobileNo1' ? 'alternate_no1' : 'alternate_no2']: value
        };

        const response = fieldName === 'alternateMobileNo1' 
          ? await alternateNumbersService.saveAlternateNumber1(data)
          : await alternateNumbersService.saveAlternateNumber2(data);
        
        toast.success(`${fieldName === 'alternateMobileNo1' ? 'Primary' : 'Secondary'} number saved successfully!`);
        
        // Clear any existing errors
        formik.setFieldError(fieldName, undefined);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formik.setFieldError(fieldName, error.message);
        } else {
          
          // More specific error messages
          if (error.response?.status === 422) {
            const errorMessage = error.response?.data?.message || 'Invalid phone number format or missing required fields';
            toast.error(errorMessage);
          } else if (error.response?.status === 400) {
            toast.error('Bad request - please check the phone number');
          } else {
            toast.error('Failed to save number');
          }
        }
      } finally {
        setSaving(false);
      }
    }, 500);
  }, []);

  // Debounced save function for remarks
  const debouncedSaveRemark = useCallback((value) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout for API call
    timeoutRef.current = setTimeout(async () => {
      try {
        // Only save if there's actually a remark to save
        if (!value || value.trim().length === 0) {
          return;
        }

        if (!formik.values.applicationId) {
          return;
        }

        setRemarkSaving(true);
        
        const remarkData = {
          application_id: parseInt(formik.values.applicationId),
          remarks: value.trim()
        };
        
        const response = await personalInfoService.savePersonalRemarks(remarkData);
        toast.success('Remark saved successfully!');
      } catch (error) {
        
        // More specific error messages
        if (error.response?.status === 422) {
          const errorMessage = error.response?.data?.message || 'Invalid remark data or missing required fields';
          toast.error(errorMessage);
        } else if (error.response?.status === 400) {
          toast.error('Bad request - please check the remark data');
        } else {
          toast.error('Failed to save remark');
        }
      } finally {
        setRemarkSaving(false);
      }
    }, 3000);
  }, []);

  // Handle phone number input change
  const handlePhoneChange = (fieldName, value) => {
    // Only allow numbers and limit to 10 digits
    const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
    
    
    // Update formik value immediately
    formik.setFieldValue(fieldName, numbersOnly);
    
    // Clear existing error when user starts typing
    if (formik.errors[fieldName] && numbersOnly.length > 0) {
      formik.setFieldError(fieldName, undefined);
    }

    // Only trigger save if we have exactly 10 digits
    if (numbersOnly.length === 10) {
      debouncedSaveNumber(fieldName, numbersOnly);
    }
  };

  // Optimized remark change handler to prevent typing lag
  const handleRemarkChange = (value) => {
    // 1. Update local state immediately (no re-render lag)
    setLocalRemarkValue(value);
    
    // 2. Debounce formik update to prevent excessive re-renders
    if (formikUpdateTimeoutRef.current) {
      clearTimeout(formikUpdateTimeoutRef.current);
    }
    formikUpdateTimeoutRef.current = setTimeout(() => {
      formik.setFieldValue('remark', value);
    }, 500);
    
    // 3. Debounce the API call (longer delay)
    debouncedSaveRemark(value);
  };

  // Check if number is valid
  const isNumberValid = (number) => {
    return number && number.length === 10 && /^[6-9]\d{9}$/.test(number);
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