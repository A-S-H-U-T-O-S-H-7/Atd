import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { CheckCircle2 } from 'lucide-react';

const ReferenceCard = ({ 
  reference, 
  index, 
  duplicatePhones, 
  duplicateEmails, 
  formatPhoneNumber 
}) => {
  const hasPhoneDuplicate = duplicatePhones.length > 0;
  const hasEmailDuplicate = duplicateEmails.length > 0;
  const isComplete = reference.name && reference.phone && reference.email;

  // Enhanced phone number formatting for API compatibility
  const handlePhoneChange = (e, form, fieldName) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    form.setFieldValue(fieldName, numericValue);
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200">
      {/* Reference Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold ${
          isComplete ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-gray-400'
        }`}>
          {index + 1}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Reference {index + 1}
        </h3>
        {isComplete && !hasPhoneDuplicate && !hasEmailDuplicate && (
          <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
        )}
      </div>
      
      {/* Reference Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Full Name<span className="text-red-500 ml-1">*</span>
          </label>
          <Field
            name={`references.${index}.name`}
            type="text"
            placeholder="Enter full name"
            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
          />
          <ErrorMessage 
            name={`references.${index}.name`} 
            component="p" 
            className="text-red-500 text-sm" 
          />
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number<span className="text-red-500 ml-1">*</span>
          </label>
         <Field name={`references.${index}.phone`}>
            {({ field, form }) => (
              <input
                {...field}
                type="tel"
                placeholder="Enter 10-digit number"
                className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 ${
                  hasPhoneDuplicate ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                }`}
                onChange={(e) => handlePhoneChange(e, form, field.name)}
                maxLength="10"
                value={field.value || ''}
                pattern="[0-9]{10}"
                inputMode="numeric"
              />
            )}
          </Field>
          <ErrorMessage 
            name={`references.${index}.phone`} 
            component="p" 
            className="text-red-500 text-sm" 
          />
          {hasPhoneDuplicate && (
            <p className="text-red-500 text-sm">
              This phone number is already used in Reference {duplicatePhones.map(i => i + 1).join(', ')}
            </p>
          )}
          <p className="text-xs text-gray-500">
            10-digit mobile number (must be unique)
          </p>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Address<span className="text-red-500 ml-1">*</span>
          </label>
          <Field
            name={`references.${index}.email`}
            type="email"
            placeholder="Enter email address"
            className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 ${
              hasEmailDuplicate ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}
          />
          <ErrorMessage 
            name={`references.${index}.email`} 
            component="p" 
            className="text-red-500 text-sm" 
          />
          {hasEmailDuplicate && (
            <p className="text-red-500 text-sm">
              This email is already used in Reference {duplicateEmails.map(i => i + 1).join(', ')}
            </p>
          )}
          {!hasEmailDuplicate && (
            <p className="text-xs text-gray-500">
              Email must be unique across all references
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferenceCard;