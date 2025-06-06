import React from 'react';
import { Building2 } from 'lucide-react';
import SectionCard from './SectionCard';
import FormField from './FormField';

const OrganizationSection = () => {
  return (
    <SectionCard icon={Building2} className="text-sm" title="Organization Information">
      <div className="space-y-6">
        <FormField
          name="organizationName"
          label="Organization Name"
          placeholder="Enter organization name"
          required
        />

        <FormField
          name="organizationAddress"
          label="Organization Address"
          as="textarea"
          rows="3"
          placeholder="Enter complete organization address"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="officePhone"
            label="Office Phone"
            placeholder="Enter office phone number"
            maxLength="11"
            helpText="10-11 digits"
            required
          />

          <FormField
            name="website"
            label="Website"
            placeholder="Enter organization website (optional)"
            helpText="e.g.: https://www.example.com"
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default OrganizationSection;