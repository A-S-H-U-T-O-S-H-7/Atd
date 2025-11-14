import React from "react";
import { User } from "lucide-react";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";

const BasicInformationSection = () => {
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
      <SectionHeader icon={User} title="Basic Information" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="firstName"
          label="First Name"
          placeholder="Enter your first name" 
          required
        />

        <FormField
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          required
        />

        <FormField
          name="phoneNumber"
          label="Mobile Number"
          placeholder="Mobile number"
          disabled={true}
          required
        />

        <FormField name="dob" label="Date of Birth" type="date" required />
        <FormField
          name="aadharNumber"
          label="Aadhar Number"
          placeholder="Aadhar number"
          disabled={true}
          required
        />

        <FormField
          name="panNumber"
          label="PAN Number"
          placeholder="PAN number"
          disabled={true}
          required
        />

        <FormField
          name="gender"
          label="Gender"
          as="select"
          placeholder="Select Gender"
          options={genderOptions}
          required
        />

        <FormField
          name="fatherName"
          label="Father's Name"
          placeholder="Enter father's name"
          required
        />

        <FormField
          name="alternativeEmail"
          label="Alternative Email"
          type="email"
          placeholder="Enter alternative email"
          normalize={value => value ? value.toLowerCase() : value}
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="Email address"
          disabled={true}
          required
        />
      </div>
    </div>
  );
};

export default BasicInformationSection;
