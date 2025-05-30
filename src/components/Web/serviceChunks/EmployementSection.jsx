import React from 'react';
import { Briefcase } from 'lucide-react';
import { Field, ErrorMessage } from 'formik';
import SectionCard from './SectionCard';
import FormField from './FormField';
import { calculateWorkingYears } from '@/components/utils/dateUtils';
const EmploymentSection = ({ values }) => {
  return (
    <SectionCard icon={Briefcase} title="Employment Details">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="designation"
            label="Designation"
            placeholder="Enter your designation"
            required
          />

          <FormField
            name="officialEmail"
            label="Official Email"
            type="email"
            placeholder="Enter your official email"
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">Month</label>
              <Field
                name="workingSince.month"
                as="select"
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
              >
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ];
                  return (
                    <option key={i + 1} value={i + 1}>
                      {months[i]}
                    </option>
                  );
                })}
              </Field>
              <ErrorMessage name="workingSince.month" component="p" className="text-red-500 text-sm" />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">Year</label>
              <Field
                name="workingSince.year"
                as="select"
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 50 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Field>
              <ErrorMessage name="workingSince.year" component="p" className="text-red-500 text-sm" />
            </div>
          </div>

          {values.workingSince.month && values.workingSince.year && (
            <div className="bg-teal-50/80 backdrop-blur-sm border border-teal-200 rounded-xl p-4">
              <p className="text-teal-700 text-sm">
                <strong>Work Experience:</strong>{" "}
                {calculateWorkingYears(values.workingSince.month, values.workingSince.year).toFixed(1)}{" "}
                years
              </p>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default EmploymentSection;
