import React from 'react';
import { Users } from 'lucide-react';
import SectionCard from './SectionCard';
import FormField from './FormField';

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
      </div>
    </SectionCard>
  );
};

export default HRContactSection;
