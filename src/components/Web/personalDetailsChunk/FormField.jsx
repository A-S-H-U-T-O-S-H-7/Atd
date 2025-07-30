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
  const baseClasses = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300";
  
  const disabledClasses = disabled 
    ? "bg-gray-100 text-gray-500 cursor-not-allowed opacity-75 border-gray-300" 
    : "bg-white/50 backdrop-blur-sm";

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
              onChange={onChange ? (e) => onChange(e, form.setFieldValue) : field.onChange}
              disabled={disabled}
              className={`${baseClasses} ${disabledClasses}`}
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
          disabled={disabled}
          className={`${baseClasses} ${disabledClasses} resize-none`}
        />
      ) : (
        <Field
          name={name}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`${baseClasses} ${disabledClasses}`}
        />
      )}
      
      <ErrorMessage name={name} component="p" className="text-red-500 text-sm" />
    </div>
  );
};

export default FormField;