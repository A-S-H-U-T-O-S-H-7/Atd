"use client";
import React, { useState } from 'react';
import { Formik, Form } from "formik";
import { BeatLoader } from 'react-spinners';
import { ChevronRight } from 'lucide-react';
import { PersonalDetailsSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';

// Import custom components
import PersonalDetailsHeader from '../personalDetailsChunk/PersonalDetailsHeader';
import ErrorDisplay from '../personalDetailsChunk/ErrorDisplay';
import BasicInformationSection from '../personalDetailsChunk/BasicInformation';
import AddressSection from '../personalDetailsChunk/AddressSection';
import FamilyReferenceSection from '../personalDetailsChunk/FamilyReference';

function PersonalDetails() {
  const {
    personalData,
    setPersonalData,
    step,
    setStep,
    phoneData,
    aadharData,
    emailData,
    loader,
    setLoader,
    errorMessage,
    setErrorMessage,
  } = useUser();

  const [sameAddress, setSameAddress] = useState(personalData.permanentAddress.isSameAsCurrent || false);

  // Utility functions
  const isCurrentAddressComplete = (values) => {
    return values.currentAddress.street && 
           values.currentAddress.city && 
           values.currentAddress.state && 
           values.currentAddress.pincode;
  };

  const getFullAddressFromAadhar = () => {
    if (!aadharData?.address) return '';
    const addr = aadharData.address;
    const addressParts = [
      addr.house, addr.street, addr.loc, addr.landmark, addr.po, addr.vtc
    ].filter(part => part && part.trim() !== ''); 
    return addressParts.join(', ');
  };

  const mapGenderFromAadhar = (aadharGender) => {
    if (!aadharGender) return '';
    switch(aadharGender.toUpperCase()) {
      case 'M': return 'Male';
      case 'F': return 'Female';
      default: return 'Other';
    }
  };

  const handleSameAddressChange = (e, setFieldValue, values) => {
    const isChecked = e.target.checked;
    
    if (isChecked && !isCurrentAddressComplete(values)) {
      setErrorMessage("Please fill in all current address fields first");
      return;
    }
    
    setSameAddress(isChecked);
    
    if (isChecked) {
      setFieldValue('permanentAddress.street', values.currentAddress.street);
      setFieldValue('permanentAddress.city', values.currentAddress.city);
      setFieldValue('permanentAddress.state', values.currentAddress.state);
      setFieldValue('permanentAddress.pincode', values.currentAddress.pincode);
      setFieldValue('permanentAddress.isSameAsCurrent', true);
    } else {
      setFieldValue('permanentAddress.isSameAsCurrent', false);
    }
  };

  const handlePersonalDetails = async (values) => {
    try {
      setPersonalData({ ...values });
      setLoader(true);
      setErrorMessage("");
      
      const apiData = {
        step: 5,
        userid: phoneData.userid, 
        provider: 1, 
        fname: values.firstName,
        lname: values.lastName,
        gender: values.gender,
        dob: values.dob,
        alt_email: values.alternativeEmail,  
        fathername: values.fatherName,
        curr_houseno: "555", 
        curr_address: values.currentAddress.street,
        curr_state: values.currentAddress.state,
        curr_city: values.currentAddress.city,
        curr_pincode: parseInt(values.currentAddress.pincode),
        per_houseno: "555",
        per_address: values.permanentAddress.isSameAsCurrent ? values.currentAddress.street : values.permanentAddress.street,
        per_state: values.permanentAddress.isSameAsCurrent ? values.currentAddress.state : values.permanentAddress.state,
        per_city: values.permanentAddress.isSameAsCurrent ? values.currentAddress.city : values.permanentAddress.city,
        per_pincode: values.permanentAddress.isSameAsCurrent ? parseInt(values.currentAddress.pincode) : parseInt(values.permanentAddress.pincode),
        ref_name: values.familyReference.name,
        ref_address: values.familyReference.address,
        ref_mobile: parseInt(values.familyReference.mobileNumber),
        ref_email: values.familyReference.email,
        ref_relation: values.familyReference.relation,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();
      console.log(result)

      if (response.ok && result.success) {
        setLoader(false);
        setStep(step + 1);
      } else {
        setErrorMessage(result?.message || "Something went wrong");
        setLoader(false);
      }
    } catch (error) {
      setErrorMessage("Error submitting data: " + error.message);
      setLoader(false);
    }
  };

  const getInitialValues = () => ({
    ...personalData,
    firstName: personalData.firstName || aadharData?.fullName?.split(' ')[0] || '',
    lastName: personalData.lastName || aadharData?.fullName?.split(' ').slice(1).join(' ') || '',
    gender: personalData.gender || mapGenderFromAadhar(aadharData?.gender) || '',
    dob: personalData.dob || aadharData?.dob || '',
    fatherName: personalData.fatherName || aadharData?.careOf || '',
    currentAddress: {
      ...personalData.currentAddress,
      street: personalData.currentAddress?.street || getFullAddressFromAadhar() || '',
      city: personalData.currentAddress?.city || aadharData?.address?.subdist || '',
      state: personalData.currentAddress?.state || aadharData?.address?.state || '',
      pincode: personalData.currentAddress?.pincode || aadharData?.zip || ''
    }
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
      <div className="max-w-6xl mx-auto">
        <PersonalDetailsHeader />
        
        <Formik
          initialValues={getInitialValues()}
          validationSchema={PersonalDetailsSchema}
          context={{
            phoneNumber: phoneData?.phoneNumber || phoneData?.phone || '', 
            userEmail: emailData?.email || ''
          }}
          onSubmit={handlePersonalDetails}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-8">
              <ErrorDisplay errorMessage={errorMessage} />
              
              <BasicInformationSection />
              
              <AddressSection
                title="Current Address"
                addressPrefix="currentAddress"
              />
              
              <AddressSection
                title="Permanent Address"
                addressPrefix="permanentAddress"
                showSameAddressOption={true}
                sameAddress={sameAddress}
                onSameAddressChange={handleSameAddressChange}
                isCurrentAddressComplete={isCurrentAddressComplete(values)}
                values={values}
                setFieldValue={setFieldValue}
              />
              
              <FamilyReferenceSection />
              
              {/* Navigation Button */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                <button 
                  disabled={loader} 
                  type='submit' 
                  className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                >
                  {loader ? (
                    <BeatLoader color="#fff" size={8} />
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default PersonalDetails;