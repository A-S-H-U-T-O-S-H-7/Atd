import React from 'react';
import { Users } from 'lucide-react';
import SectionCard from './SectionCard';
import FormField from './FormField';
import { Field, ErrorMessage } from 'formik';

const HRContactSection = () => {
  return (
    <SectionCard icon={Users} title="HR Contact Details">
      <div className="space-y-6">
        <FormField
          name="hrName"
          label="HR Name"
          placeholder="Enter HR name"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="hrPhone"
            label="HR Phone"
            placeholder="Enter HR phone number"
            maxLength="10"
            helpText="10 digits"
            required
          />

          <FormField
            name="hrEmail"
            label="HR Email"
            type="email"
            placeholder="Enter HR email"
            required
            normalize={value => value ? value.toLowerCase().trim() : value}
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start space-x-3">
            <Field
  name="employerContactConsent"
  type="checkbox"
  className="mt-1 w-4 h-4 text-teal-600 bg-white border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 focus:ring-offset-1 focus:border-transparent hover:border-teal-400 transition-colors duration-200"
/>
            <label htmlFor="employerContactConsent" className="text-sm text-gray-700">
              I hereby confirm that the NBFC is permitted to contact my employer in the event of a default or if I am not reachable/responding
              <span className="text-red-500 ml-1">*</span>
            </label>
          </div>
          <ErrorMessage name="employerContactConsent" component="p" className="text-red-500 text-sm mt-2" />
        </div>
      </div>
    </SectionCard>
  );
};

export default HRContactSection;