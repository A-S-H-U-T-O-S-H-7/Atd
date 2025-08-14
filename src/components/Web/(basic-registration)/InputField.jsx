import React, { useCallback } from "react";
import { Field, ErrorMessage } from "formik";
import { Check, X, Info } from "lucide-react";

const InputField = ({ 
  name, 
  label, 
  placeholder, 
  type = "text", 
  formatFunction, 
  maxLength, 
  showMobileWarning = false,
  mobileCheckStatus,
  panCheckStatus,
  setMobileCheckStatus,
  setPanCheckStatus,
  setError,
  debouncedMobileCheck,
  debouncedPanCheck
}) => {
  const handleChange = useCallback((e, form) => {
    let value = e.target.value;
    
    if (formatFunction) {
      value = formatFunction(value);
      e.target.value = value; // Update the input value directly
    }
    
    form.handleChange(e);
    
    if (name === 'phoneNumber' && mobileCheckStatus.exists && value !== form.values[name]) {
      setMobileCheckStatus({ checking: false, exists: false, checked: false });
      setError('');
    }
    if (name === 'panNumber' && panCheckStatus.exists && value !== form.values[name]) {
      setPanCheckStatus({ checking: false, exists: false, checked: false });
      setError('');
    }
    
    if (name === 'phoneNumber') {
      if (value.length === 10) {
        debouncedMobileCheck(value);
      } else if (value.length !== 10) {
        setMobileCheckStatus({ checking: false, exists: false, checked: false });
      }
    }
    
    if (name === 'panNumber') {
      if (value.length === 10) {
        debouncedPanCheck(value);
      } else if (value.length !== 10) {
        setPanCheckStatus({ checking: false, exists: false, checked: false });
      }
    }
  }, [name, formatFunction, mobileCheckStatus, panCheckStatus, debouncedMobileCheck, debouncedPanCheck]);

  return (
    <Field name={name}>
      {({ field, form, meta }) => {
        const fieldStatus = name === 'phoneNumber' ? mobileCheckStatus : 
                          name === 'panNumber' ? panCheckStatus : 
                          { checking: false, exists: false, checked: false };
        const hasError = meta.touched && (meta.error || fieldStatus.exists);
        const hasSuccess = meta.touched && field.value && !meta.error && !fieldStatus.exists && fieldStatus.checked;
        
        return (
          <div className="mb-3 relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {label} <span className="text-red-500">*</span>
            </label>
            <div className={`flex items-center px-4 rounded-xl bg-white/70 backdrop-blur-sm border shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-1 ${
              hasError ? 
                "border-red-400 ring-red-200 focus-within:ring-red-200" : 
                hasSuccess ? 
                  "border-emerald-400 ring-emerald-200 focus-within:ring-emerald-200" : 
                  "border-gray-300 ring-transparent focus-within:ring-blue-200 focus-within:border-blue-400"
            }`}>
              <input
                {...field}
                type={type}
                maxLength={maxLength}
                placeholder={placeholder}
                className="flex-1 bg-transparent h-12 outline-none text-gray-700 placeholder-gray-400 text-sm"
                onChange={(e) => handleChange(e, form)}
              />
              {fieldStatus.checking ? (
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                meta.touched && field.value && (
                  (meta.error || fieldStatus.exists)
                    ? <X className="w-5 h-5 text-red-400" />
                    : <Check className="w-5 h-5 text-emerald-500" />
                )
              )}
            </div>
            
            <ErrorMessage name={name} component="p" className="text-red-500 text-xs mt-1 ml-1" />
            
            {fieldStatus.exists && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                This {name === 'phoneNumber' ? 'mobile number' : 'PAN number'} is already registered.
              </p>
            )}
            
            {showMobileWarning && (
              <div className="flex items-center gap-2 mt-3">
                <Info className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <p className="text-xs text-orange-700 font-medium">
                  Only provide Aadhar registered mobile number
                </p>
              </div>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default React.memo(InputField);