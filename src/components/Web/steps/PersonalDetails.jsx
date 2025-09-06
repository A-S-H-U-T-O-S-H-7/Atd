"use client";
import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import { BeatLoader } from 'react-spinners';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PersonalDetailsSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import { useAuth } from '@/lib/AuthContext';


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
    loader,
    setLoader,
    errorMessage,
    setErrorMessage,
    token
  } = useUser();

  const [sameAddress, setSameAddress] = useState(personalData.permanentAddress?.isSameAsCurrent || false);
  const [currentCities, setCurrentCities] = useState([]);
  const [permanentCities, setPermanentCities] = useState([]);
  const { user } = useAuth();

  // Debug user changes specifically  
  useEffect(() => {
    console.log("👤 User Change Detected:");
    console.log("- New user value:", user);
    console.log("- User exists:", !!user);
    console.log("- User ID:", user?.id || user?.user_id || user?.userId || 'Not found');
    console.log("- User email:", user?.email || 'Not found');
    console.log("- User phone:", user?.mobile || user?.phone || 'Not found');
  }, [user]);

   
  // Utility functions
const isCurrentAddressComplete = (values) => {
  return values.currentAddress.houseNo && 
         values.currentAddress.addressLine1 && 
         values.currentAddress.city && 
         values.currentAddress.state && 
         values.currentAddress.pincode &&
         values.currentAddress.addressType
};

// Helper function to combine address lines
const combineAddress = (houseNo, addressLine1, addressLine2) => {
  const parts = [houseNo, addressLine1, addressLine2].filter(part => part && part.trim());
  return parts.join(', ');
};

const handleSameAddressChange = (e, setFieldValue, values) => {
  const isChecked = e.target.checked;
  
  if (isChecked && !isCurrentAddressComplete(values)) {
    setErrorMessage("Please fill in all current address fields first");
    return;
  }
  
  setSameAddress(isChecked);
  
  if (isChecked) {
    // Copy current address to permanent address
    setFieldValue('permanentAddress.houseNo', values.currentAddress.houseNo);
    setFieldValue('permanentAddress.addressLine1', values.currentAddress.addressLine1);
    setFieldValue('permanentAddress.addressLine2', values.currentAddress.addressLine2);
    setFieldValue('permanentAddress.city', values.currentAddress.city);
    setFieldValue('permanentAddress.state', values.currentAddress.state);
    setFieldValue('permanentAddress.pincode', values.currentAddress.pincode);
    setFieldValue('permanentAddress.addressType', values.currentAddress.addressType);
    setFieldValue('permanentAddress.isSameAsCurrent', true);
  } else {
    // Reset permanent address fields to blank
    setFieldValue('permanentAddress.houseNo', '');
    setFieldValue('permanentAddress.addressLine1', '');
    setFieldValue('permanentAddress.addressLine2', '');
    setFieldValue('permanentAddress.city', '');
    setFieldValue('permanentAddress.state', '');
    setFieldValue('permanentAddress.pincode', '');
    setFieldValue('permanentAddress.addressType', '');
    setFieldValue('permanentAddress.isSameAsCurrent', false);
    
    // Reset permanent cities list
    setPermanentCities([]);
  }
};

const handlePersonalDetails = async (values) => {
  console.log("🔍 DEBUG - Before API call:");
  console.log("- Token from useUser():", token);
  console.log("- Token from localStorage:", localStorage.getItem("token"));
  console.log("- User from useAuth():", user);
  console.log("- User ID:", user?.id || user?._id);
  
  if (!token) {
    setErrorMessage("Authentication required. Please log in again.");
    return;
  }

  try {
    setPersonalData({ ...values });
    setLoader(true);
    setErrorMessage("");
    
    // Combine address lines for API
    const currentCompleteAddress = combineAddress(
      values.currentAddress.houseNo,
      values.currentAddress.addressLine1,
      values.currentAddress.addressLine2
    );

    const permanentCompleteAddress = values.permanentAddress.isSameAsCurrent ? 
      currentCompleteAddress :
      combineAddress(
        values.permanentAddress.houseNo,
        values.permanentAddress.addressLine1,
        values.permanentAddress.addressLine2
      );
    
    const apiData = {
      step: 2,
      source: "Desktop",
      fname: values.firstName, 
      lname: values.lastName,
      gender: values.gender,
      dob: values.dob,
      alt_email: values.alternativeEmail,  
      fathername: values.fatherName,
      
      // Current Address
      curr_houseno: values.currentAddress.houseNo, 
      curr_address: currentCompleteAddress,
      curr_state: values.currentAddress.state,
      curr_city: values.currentAddress.city,
      curr_pincode: parseInt(values.currentAddress.pincode),
      curr_address_code: parseInt(values.currentAddress.addressType),
      
      // Permanent Address
      per_houseno: values.permanentAddress.isSameAsCurrent ? 
        values.currentAddress.houseNo : 
        values.permanentAddress.houseNo,
      per_address: permanentCompleteAddress,
      per_state: values.permanentAddress.isSameAsCurrent ? 
        values.currentAddress.state : 
        values.permanentAddress.state,
      per_city: values.permanentAddress.isSameAsCurrent ? 
        values.currentAddress.city : 
        values.permanentAddress.city,
      per_pincode: values.permanentAddress.isSameAsCurrent ? 
        parseInt(values.currentAddress.pincode) : 
        parseInt(values.permanentAddress.pincode),
      per_address_code: values.permanentAddress.isSameAsCurrent ? 
        parseInt(values.currentAddress.addressType) : 
        parseInt(values.permanentAddress.addressType),

      // Family Reference
      ref_name: values.familyReference.name,
      ref_address: values.familyReference.address,
      ref_mobile: parseInt(values.familyReference.mobileNumber),
      ref_email: values.familyReference.email,
      ref_relation: values.familyReference.relation,
    };

    
    const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(apiData),
    });

    const result = await response.json();
    console.log("API Response:", result);

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
  firstName: personalData.firstName || user?.fname || '', 
  lastName: personalData.lastName || user?.lname || '',
  gender: personalData.gender || user?.gender || '',
  dob: personalData.dob || user?.dob || '',
  fatherName: personalData.fatherName || user?.fathername || '',
  email: personalData.email || user?.email || '',
  phoneNumber: personalData.phoneNumber || user?.mobile || user?.phone || '',
  aadharNumber: personalData.aadharNumber || user?.aadhar_no || '',
  panNumber: personalData.panNumber || user?.pan_no || '',
  currentAddress: {
    houseNo: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    addressType: '',
    ...personalData.currentAddress,
  },
  permanentAddress: {
    houseNo: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    addressType: '',
    isSameAsCurrent: false,
    ...personalData.permanentAddress,
  },
  alternativeEmail: personalData.alternativeEmail || user?.alt_email || '', // Added fallback
  familyReference: {
    name: '',
    address: '',
    mobileNumber: '',
    email: '',
    relation: '',
    ...personalData.familyReference,
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
                setFieldValue={setFieldValue}
                values={values}  
                cities={currentCities}
                setCities={setCurrentCities}
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
                cities={permanentCities}
                setCities={setPermanentCities}
              />
              
              <FamilyReferenceSection />
              
              {/* Navigation Button */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 order-2 sm:order-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                 
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