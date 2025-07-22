 import { Field, ErrorMessage } from "formik";
 
 const FormField = ({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  required = false, 
  as = "input",
  rows,
  maxLength,
  options = [],
  className = "",
  onChange, 
  disabled = false, 
}) => {
  const baseClasses = "w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300";
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {as === "select" ? (
        <Field name={name}>
          {({ field, form }) => (
            <select
              {...field}
              onChange={onChange ? (e) => onChange(e, form.setFieldValue) : field.onChange} // Handle custom onChange
              disabled={disabled}
              className={`${baseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>
      ) : as === "textarea" ? (
        <Field
          name={name}
          as="textarea"
          rows={rows}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <Field
          name={name}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          className={baseClasses}
        />
      )}
      
      <ErrorMessage name={name} component="p" className="text-red-500 text-sm" />
    </div>
  );
};

export default FormField;