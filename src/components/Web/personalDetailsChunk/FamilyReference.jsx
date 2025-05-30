import React from 'react';
import { Users } from 'lucide-react';
import SectionHeader from './SectionHeader';
import FormField from './FormField';

const FamilyReferenceSection = () => {
  const relationOptions = [
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Brother", label: "Brother" },
    { value: "Sister", label: "Sister" },
    { value: "Husband", label: "Husband" },
    { value: "Spouse", label: "Spouse" }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
      <SectionHeader icon={Users} title="Family Reference" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          name="familyReference.name"
          label="Reference Name"
          placeholder="Enter reference name"
          required
        />
        
        <FormField
          name="familyReference.mobileNumber"
          label="Mobile Number"
          placeholder="Enter mobile number"
          maxLength="10"
          required
        />
        
        <FormField
          name="familyReference.email"
          label="Email"
          type="email"
          placeholder="Enter email"
          required
        />
        
        <FormField
          name="familyReference.relation"
          label="Reference Relation"
          as="select"
          placeholder="Select relationship"
          options={relationOptions}
          required
        />
      </div>
      
      <FormField
        name="familyReference.address"
        label="Address"
        as="textarea"
        rows={3}
        placeholder="Enter complete address"
        required
      />
    </div>
  );
};

export default FamilyReferenceSection;