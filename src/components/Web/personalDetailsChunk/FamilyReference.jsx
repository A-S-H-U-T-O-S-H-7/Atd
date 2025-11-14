import React from 'react';
import SectionHeader from './SectionHeader';
import FormField from './FormField';
import { Users, Gift } from 'lucide-react';

const FamilyReferenceSection = () => {
  const relationOptions = [
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Brother", label: "Brother" },
    { value: "Sister", label: "Sister" },
    { value: "Husband", label: "Husband" },
    { value: "Spouse", label: "Spouse" },
    { value: "Son", label: "Son" },
    { value: "Daughter", label: "Daughter" }
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
          normalize={value => value ? value.toLowerCase() : value}
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

      {/* Referral Code Section - Special Styling */}
<div className="mt-8 p-6 overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl shadow-lg">
  <div className="flex items-center gap-2 mb-3">
    <Gift className="w-5 h-5 text-amber-600" />
    <h3 className="text-lg font-semibold text-amber-800">Referral Code (Optional)</h3>
  </div>
  <FormField
    name="referralCode"
    label=""
    placeholder="Enter referral code to get special benefits"
    className="bg-white border-amber-300 focus:border-amber-500 focus:ring-amber-200"
  />
</div>
    </div>
  );
};

export default FamilyReferenceSection;