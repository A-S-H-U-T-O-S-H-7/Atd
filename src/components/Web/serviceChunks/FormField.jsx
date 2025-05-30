import React from 'react';
import { Field, ErrorMessage } from 'formik';

const FormField = ({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  required = false, 
  helpText, 
  maxLength,
  as,
  rows,
  children,
  className = ""
}) => {
  const baseInputClass = "w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300";
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <Field
        name={name}
        type={type}
        as={as}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${baseInputClass} ${as === 'textarea' ? 'resize-none' : ''}`}
      >
        {children}
      </Field>
      
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default FormField;