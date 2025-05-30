// Helper function to extract YouTube ID from URL
const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  
  src={`https://www.youtube.com/embed/${currentVideo.youtubeId || extractYoutubeId(currentVideo.videoUrl)}`}


  // try {
          //     setLoanData({ ...values });
          //     setLoader(true);
          //     setErrorMessage("");
              
          //     const response = await fetch(`${ENV.API_URL}/finance-loan-details`, {
          //         method: "POST",
          //         headers: {
          //             "Content-Type": "application/json",
          //             "Accept": "application/json"
          //         },
          //         body: JSON.stringify(values),
          //     });
  
          //     const result = await response.json();
  
          //     if (response.ok) {
          //         setLoader(false);
          //         setStep(step + 1);
          //     } else {
          //         setErrorMessage(result?.message);
          //         setLoader(false);
          //     }
          // } catch (error) {
          //     setErrorMessage("Error submitting data: " + error.message);
          //     setLoader(false);
          // }

"use client";
import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { KycDetailsSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

function KYCDetails() {
    const {
        kycData,
        setKycData,
        step,
        setStep,
        phoneData,
        personalData, 
        loader,
        setLoader,
        errorMessage,
        setErrorMessage
    } = useUser();

    // Function to generate CRN number
    const generateCrnNumber = (firstName, dob, panNumber, phoneNumber) => {
        if (!firstName || !dob || !panNumber || !phoneNumber) return '';
        
        const firstLetter = firstName.charAt(0).toUpperCase();
        const dobDate = new Date(dob);
        const day = dobDate.getDate().toString().padStart(2, '0');
        const panFirst2 = panNumber.substring(0, 2).toUpperCase();
        const phoneLast3 = phoneNumber.slice(-3);
        
        return `${firstLetter}${day}${panFirst2}${phoneLast3}`;
    };

    // Function to generate Account ID
    const generateAccountId = (crnNumber) => {
        if (!crnNumber) return '';
        
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const currentYear = currentDate.getFullYear();
        
        return `ATDFSL${crnNumber}${currentMonth}${currentYear}`;
    };

    const handleKycDetails = async (values) => {
        try {
            setLoader(true);
            setErrorMessage("");
            
            const generatedCrn = generateCrnNumber(
                personalData?.firstName,
                personalData?.dob,
                values.panNumber,
                phoneData?.phoneNumber
            );

            const generatedAccountId = generateAccountId(generatedCrn);

            setKycData({ ...values,
                crnNumber: generatedCrn,      
                accountId: generatedAccountId });
              
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    step: 6,
                    userid: phoneData.userid, 
                    provider: 1,
                    panno: values.panNumber,
                    crnno: generatedCrn,
                    accountId: generatedAccountId
                }),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok) {
                setLoader(false);
                setStep(step + 1);
            } else {
                setErrorMessage(result?.message);
                setLoader(false);
            }
        } catch (error) {
            setErrorMessage("Error submitting data: " + error.message);
            setLoader(false);
        }
    }

    const formatPanInput = (value) => {
        // Remove any non-alphanumeric characters and convert to uppercase
        return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        KYC Details
                    </h1>
                    <p className="text-gray-600">
                        Please provide your KYC information to verify your identity
                    </p>
                </div>

                <Formik
                    initialValues={kycData}
                    validationSchema={KycDetailsSchema}
                    onSubmit={(values) => { handleKycDetails(values); }}
                    enableReinitialize
                >
                    {({ isValid, touched, setFieldValue, values }) => {
                        // Auto-generate CRN and Account ID when PAN is entered
                        const generatedCrn = generateCrnNumber(
                            personalData?.firstName,
                            personalData?.dob,
                            values.panNumber,
                            phoneData?.phoneNumber
                        );
                        
                        const generatedAccountId = generateAccountId(generatedCrn);

                        return (
                            <Form className="space-y-8">
                                {errorMessage && (
                                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                                        <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
                                    </div>
                                )}
                                
                                {/* KYC Information Section */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Identity Verification</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* PAN Number */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                PAN Number<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field name="panNumber">
                                                {({ field, form }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        maxLength="10"
                                                        placeholder="Enter PAN number (e.g., ABCDE1234F)"
                                                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 uppercase"
                                                        onChange={(e) => {
                                                            const formattedValue = formatPanInput(e.target.value);
                                                            form.setFieldValue(field.name, formattedValue);
                                                        }}
                                                        value={field.value}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="panNumber" component="p" className="text-red-500 text-sm" />
                                            <p className="text-xs text-gray-500">
                                                Format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
                                            </p>
                                        </div>

                                        {/* CRN Number (Auto-generated) */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                CRN Number (Auto-generated)
                                            </label>
                                            <input
                                                type="text"
                                                value={generatedCrn}
                                                disabled
                                                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600  cursor-not-allowed"
                                                placeholder="Will be generated automatically"
                                            />
                                           
                                        </div>

                                        {/* Account ID (Auto-generated) */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Account ID (Auto-generated)
                                            </label>
                                            <input
                                                type="text"
                                                value={generatedAccountId}
                                                disabled
                                                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600  cursor-not-allowed"
                                                placeholder="Will be generated automatically"
                                            />
                                           
                                        </div>
                                    </div>

                                    
                                </div>

                                {/* Navigation Buttons */}
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
                                        disabled={loader || !values.panNumber || !generatedCrn} 
                                        type='submit' 
                                        className="inline-flex items-center cursor-pointer justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
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
                        );
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default KYCDetails;

// service details
"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from "react-spinners";
import { ServiceDetailsSchema } from "../validations/UserRegistrationValidations";
import { useUser } from "@/lib/UserRegistrationContext";
import { Building2, Users, Briefcase, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

function ServiceDetails() {
  const {
    serviceData,
    setServiceData,
    step,
    setStep,
    phoneData,
    loader,
    setLoader,
    errorMessage,
    setErrorMessage
  } = useUser();

  const [availableIncome, setAvailableIncome] = useState(0);

  const handleServiceDetails = async values => {
    try {
        setServiceData({ ...values });
        setLoader(true);
        setErrorMessage("");

        const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
              step: 8,
              userid: phoneData.userid,
              provider: 1,
              organizationname: values.organizationName,
              organisationaddress: values.organizationAddress,
              officephone: values.officePhone,
              hrname: values.hrName,
              hrphone: parseInt(values.hrPhone, 10), 
              website: values.website,
              hremail: values.hrEmail,
              designation: values.designation,
              worksince_mm: values.workingSince.month,
              worksince_yy: values.workingSince.year,
              grossalary: parseInt(values.monthlySalary, 10), 
              netsalary: parseInt(values.netMonthlySalary, 10),
              nethouseholdincome: parseInt(values.familyIncome, 10),
              officialemail: values.officialEmail,
              existingemi: parseInt(values.existingEmi, 10)
          }),
        });

        const result = await response.json();
        console.log(result)

        if (response.ok) {
            setLoader(false);
            setStep(step + 1);
        } else {
            setErrorMessage(result?.message);
            setLoader(false);
        }
    } catch (error) {
        setErrorMessage("Error submitting data: " + error.message);
        setLoader(false);
    }
// setStep(step + 1);
   
  };

  const formatAmount = value => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Format with commas for thousands
    if (numericValue) {
      const parts = numericValue.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    return numericValue;
  };

  const calculateWorkingYears = (startMonth, startYear) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    
    const startDate = new Date(startYear, startMonth - 1); 
    const diffInMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth);
    
    return diffInMonths / 12;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Organization Details
          </h1>
          <p className="text-gray-600">
            Please provide your employment and financial information
          </p>
        </div>

        <Formik
          initialValues={serviceData}
          validationSchema={ServiceDetailsSchema}
          onSubmit={values => {
            handleServiceDetails(values);
          }}
          enableReinitialize
        >
          {({ isValid, touched, setFieldValue, values }) => {
            // Calculate available income for loan eligibility
            React.useEffect(
              () => {
                const netSalary = parseFloat(values.netMonthlySalary) || 0;
                const existingEmi = parseFloat(values.existingEmi) || 0;
                const available = netSalary - existingEmi;
                setAvailableIncome(Math.max(0, available));
              },
              [values.netMonthlySalary, values.existingEmi]
            );

            return (
              <Form className="space-y-8">
                {errorMessage && (
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                    <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
                  </div>
                )}

                {/* Organization Information Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Organization Information</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Organization Name<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field
                        name="organizationName"
                        type="text"
                        placeholder="Enter organization name"
                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                      />
                      <ErrorMessage
                        name="organizationName"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Organization Address<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field
                        name="organizationAddress"
                        as="textarea"
                        rows="3"
                        placeholder="Enter complete organization address"
                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
                      />
                      <ErrorMessage
                        name="organizationAddress"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Office Phone<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="officePhone"
                          type="text"
                          maxLength="11"
                          placeholder="Enter office phone number"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <p className="text-xs text-gray-500">10-11 digits</p>
                        <ErrorMessage
                          name="officePhone"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <Field
                          name="website"
                          type="text"
                          placeholder="Enter organization website (optional)"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <p className="text-sm text-gray-500">e.g.: https://www.example.com</p>
                        <ErrorMessage
                          name="website"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* HR Contact Details Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">HR Contact Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        HR Name<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field
                        name="hrName"
                        type="text"
                        placeholder="Enter HR name"
                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                      />
                      <ErrorMessage
                        name="hrName"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          HR Phone<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="hrPhone"
                          type="text"
                          maxLength="10"
                          placeholder="Enter HR phone number"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <p className="text-xs text-gray-500">10 digits</p>
                        <ErrorMessage
                          name="hrPhone"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          HR Email<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="hrEmail"
                          type="email"
                          placeholder="Enter HR email"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <ErrorMessage
                          name="hrEmail"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Details Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Employment Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Designation<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="designation"
                          type="text"
                          placeholder="Enter your designation"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <ErrorMessage
                          name="designation"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Official Email<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="officialEmail"
                          type="email"
                          placeholder="Enter your official email"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <ErrorMessage
                          name="officialEmail"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
  {/* Section Title */}
  <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
  
  {/* Working Period */}
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">Month</label>
      <Field
        name="workingSince.month"
        as="select"
        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
      >
        <option value="">Select Month</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </Field>
      <ErrorMessage
        name="workingSince.month"
        component="p"
        className="text-red-500 text-sm"
      />
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
      <ErrorMessage
        name="workingSince.year"
        component="p"
        className="text-red-500 text-sm"
      />
    </div>
  </div>

  {/* Experience Indicator */}
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
                </div>

                {/* Salary Details Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Salary Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Monthly Salary (₹)<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field name="monthlySalary">
                          {({ field, form }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="Enter gross monthly salary"
                              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                              onChange={e => {
                                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                                const formattedValue = formatAmount(rawValue);
                                form.setFieldValue(field.name, rawValue);
                                e.target.value = formattedValue;
                              }}
                              value={formatAmount(field.value)}
                            />
                          )}
                        </Field>
                        <p className="text-xs text-gray-500">
                          Gross salary before deductions
                        </p>
                        <ErrorMessage
                          name="monthlySalary"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Net Monthly Salary (₹)<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field name="netMonthlySalary">
                          {({ field, form }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="Enter net monthly salary"
                              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                              onChange={e => {
                                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                                const formattedValue = formatAmount(rawValue);
                                form.setFieldValue(field.name, rawValue);
                                e.target.value = formattedValue;
                              }}
                              value={formatAmount(field.value)}
                            />
                          )}
                        </Field>
                        <p className="text-xs text-gray-500">
                          Salary after all deductions
                        </p>
                        <ErrorMessage
                          name="netMonthlySalary"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Existing EMI (₹)<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field name="existingEmi">
                        {({ field, form }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter existing EMI amount (0 if none)"
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                            onChange={e => {
                              const rawValue = e.target.value.replace(/[^0-9]/g, "");
                              const formattedValue = formatAmount(rawValue);
                              form.setFieldValue(field.name, rawValue);
                              e.target.value = formattedValue;
                            }}
                            value={formatAmount(field.value)}
                          />
                        )}
                      </Field>
                      <p className="text-xs text-gray-500">
                        Total monthly EMI for all existing loans
                      </p>
                      <ErrorMessage
                        name="existingEmi"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Family Income (₹)<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field name="familyIncome">
                        {({ field, form }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter total family income"
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                            onChange={e => {
                              const rawValue = e.target.value.replace(/[^0-9]/g, "");
                              const formattedValue = formatAmount(rawValue);
                              form.setFieldValue(field.name, rawValue);
                              e.target.value = formattedValue;
                            }}
                            value={formatAmount(field.value)}
                          />
                        )}
                      </Field>
                      <p className="text-xs text-gray-500">
                        Total monthly income of all family members
                      </p>
                      <ErrorMessage
                        name="familyIncome"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Financial Summary */}
                    {values.netMonthlySalary && (
                      <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 backdrop-blur-sm border border-teal-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Financial Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Net Salary</p>
                            <p className="text-xl font-bold text-teal-600">
                              ₹{formatAmount(values.netMonthlySalary)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Existing EMI</p>
                            <p className="text-xl font-bold text-red-600">
                              ₹{formatAmount(values.existingEmi || "0")}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Available Income</p>
                            <p className="text-xl font-bold text-emerald-600">
                              ₹{formatAmount(availableIncome.toString())}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-600">
                            Recommended EMI Limit:{" "}
                            <span className="font-semibold text-teal-600">
                              ₹{formatAmount((availableIncome * 0.6).toFixed(0))}
                            </span>
                            <span className="text-xs ml-1">
                              (60% of available income)
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
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
                    type="submit"
                    className="inline-flex items-center cursor-pointer justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
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
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default ServiceDetails;

"use client";
import React, { useState, useEffect } from 'react'
import { Formik, Form, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { DocumentUploadSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import { Upload, FileText, ChevronLeft, ChevronRight, CheckCircle, X, AlertCircle } from 'lucide-react';

function DocumentUpload() {
    const {
        documentData,
        setDocumentData,
        step,
        setStep,
        phoneData,
        loader,
        setLoader,
        errorMessage,
        setErrorMessage
    } = useUser();

    const [uploadStatus, setUploadStatus] = useState({});
    const [uploadingFiles, setUploadingFiles] = useState(new Set());
    // NEW: Track uploaded files with their hash/name and field mapping
    const [uploadedFiles, setUploadedFiles] = useState(new Map());

    // Document configuration mapping
    const documentConfig = {
        photo: { label: 'Passport Photo', accept: 'image/*', maxSize: 1, apiValue: 'selfie' },
        aadharFront: { label: 'Aadhar Card (Front)', accept: 'image/*,.pdf', maxSize: 2, apiValue: 'idproof' },
        aadharBack: { label: 'Aadhar Card (Back)', accept: 'image/*,.pdf', maxSize: 2, apiValue: 'addressproof' },
        panCard: { label: 'PAN Card', accept: 'image/*,.pdf', maxSize: 2, apiValue: 'pancard' },
        salarySlip1: { label: 'Latest Salary Slip', accept: '.pdf', maxSize: 2, apiValue: 'firstsalaryslip' },
        salarySlip2: { label: '2nd Month Salary Slip', accept: '.pdf', maxSize: 2, apiValue: 'secondsalaryslip' },
        salarySlip3: { label: '3rd Month Salary Slip', accept: '.pdf', maxSize: 2, apiValue: 'thirdsalaryslip' },
        bankStatement: { label: '6 Month Bank Statement', accept: '.pdf', maxSize: 5, apiValue: 'statement' }
    };

    // NEW: Generate file hash for duplicate detection
    const generateFileHash = async (file) => {
        // Simple approach: use file name, size, and lastModified as identifier
        const identifier = `${file.name}_${file.size}_${file.lastModified}`;
        return identifier;
    };

    // NEW: Check if file is already uploaded in another field
    const checkForDuplicateFile = async (file, currentFieldName) => {
        const fileHash = await generateFileHash(file);
        
        // Check if this file hash exists in uploaded files
        if (uploadedFiles.has(fileHash)) {
            const existingField = uploadedFiles.get(fileHash);
            if (existingField !== currentFieldName) {
                return {
                    isDuplicate: true,
                    existingField: existingField,
                    existingFieldLabel: documentConfig[existingField]?.label
                };
            }
        }
        
        return { isDuplicate: false };
    };

    // NEW: Add file to uploaded files tracking
    const addToUploadedFiles = async (file, fieldName) => {
        const fileHash = await generateFileHash(file);
        setUploadedFiles(prev => new Map(prev.set(fileHash, fieldName)));
    };

    // NEW: Remove file from uploaded files tracking
    const removeFromUploadedFiles = async (file) => {
        if (file) {
            const fileHash = await generateFileHash(file);
            setUploadedFiles(prev => {
                const newMap = new Map(prev);
                newMap.delete(fileHash);
                return newMap;
            });
        }
    };

    // Generate unique filename
    const generateUniqueFilename = (originalName, fieldName) => {
        const timestamp = Date.now();
        const extension = originalName.split('.').pop();
        return `${fieldName}_${phoneData?.userid || 'user'}_${timestamp}.${extension}`;
    };

    // Upload file to API
    const uploadFileToAPI = async (file, fieldName) => {
        const config = documentConfig[fieldName];
        const uniqueFilename = generateUniqueFilename(file.name, fieldName);
        
        setUploadingFiles(prev => new Set([...prev, fieldName]));
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    step: 10,
                    provider: 1,
                    userid: phoneData?.userid,
                    upload: config.apiValue,
                    filename: uniqueFilename
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setUploadStatus(prev => ({
                    ...prev,
                    [fieldName]: { status: 'success', filename: uniqueFilename }
                }));
                // NEW: Add to uploaded files tracking
                await addToUploadedFiles(file, fieldName);
                return { success: true, filename: uniqueFilename };
            } else {
                setUploadStatus(prev => ({
                    ...prev,
                    [fieldName]: { status: 'error', error: result.message || 'Upload failed' }
                }));
                return { success: false, error: result.message || 'Upload failed' };
            }
        } catch (error) {
            setUploadStatus(prev => ({
                ...prev,
                [fieldName]: { status: 'error', error: error.message }
            }));
            return { success: false, error: error.message };
        } finally {
            setUploadingFiles(prev => {
                const newSet = new Set(prev);
                newSet.delete(fieldName);
                return newSet;
            });
        }
    };

    // MODIFIED: Handle file selection with duplicate check
    const handleFileChange = async (file, fieldName, setFieldValue, currentFile = null) => {
        if (!file) return;

        const config = documentConfig[fieldName];
        
        // NEW: Check for duplicate file
        const duplicateCheck = await checkForDuplicateFile(file, fieldName);
        if (duplicateCheck.isDuplicate) {
            setErrorMessage(
                `This file "${file.name}" is already uploaded for ${duplicateCheck.existingFieldLabel}. Please select a different file for ${config.label}.`
            );
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        // Validate file type
        const allowedTypes = config.accept === 'image/*' 
            ? ['image/jpeg', 'image/jpg', 'image/png']
            : config.accept === '.pdf'
            ? ['application/pdf']
            : ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        if (!allowedTypes.includes(file.type)) {
            setErrorMessage(`Invalid file type for ${config.label}. Please select a valid file.`);
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Validate file size
        const maxSizeBytes = config.maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setErrorMessage(`File size exceeds ${config.maxSize}MB for ${config.label}`);
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // NEW: If replacing a file, remove the old one from tracking
        if (currentFile) {
            await removeFromUploadedFiles(currentFile);
        }

        // Set file in form and upload
        setFieldValue(fieldName, file);
        const uploadResult = await uploadFileToAPI(file, fieldName);
        
        if (!uploadResult.success) {
            setErrorMessage(`Failed to upload ${config.label}: ${uploadResult.error}`);
            setTimeout(() => setErrorMessage(''), 5000);
            // NEW: If upload failed, don't keep it in tracking
            await removeFromUploadedFiles(file);
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoader(true);
        setErrorMessage("");
        
        // Check if all files are uploaded successfully
        const requiredFields = Object.keys(documentConfig);
        const allUploaded = requiredFields.every(field => 
            values[field] && uploadStatus[field]?.status === 'success'
        );
        
        if (!allUploaded) {
            setErrorMessage("Please ensure all documents are uploaded successfully before proceeding.");
            setLoader(false);
            return;
        }
        
        setDocumentData({ ...values });
        setLoader(false);
        setStep(step + 1);
    };

    // File upload component
    const FileUploadField = ({ fieldName, setFieldValue, values }) => {
        const config = documentConfig[fieldName];
        const file = values[fieldName];
        const status = uploadStatus[fieldName];
        const isUploading = uploadingFiles.has(fieldName);

        return (
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    {config.label}
                    <span className="text-red-500 ml-1">*</span>
                </label>
                
                {!file ? (
                    <div className="relative">
                        <input
                            type="file"
                            id={fieldName}
                            accept={config.accept}
                            onChange={(e) => {
                                const selectedFile = e.target.files[0];
                                if (selectedFile) {
                                    handleFileChange(selectedFile, fieldName, setFieldValue);
                                }
                            }}
                            className="hidden"
                        />
                        <label
                            htmlFor={fieldName}
                            className="flex flex-col items-center justify-center w-full h-32 bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/30 cursor-pointer group"
                        >
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mb-2" />
                            <span className="text-sm text-gray-600 group-hover:text-teal-600 font-medium">
                                Choose {config.label}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                                Max {config.maxSize}MB
                            </span>
                        </label>
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {isUploading ? (
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <BeatLoader color="#14b8a6" size={4} />
                                </div>
                            ) : status?.status === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : status?.status === 'error' ? (
                                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                            ) : (
                                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                    {status?.status === 'success' && (
                                        <span className="text-green-600 ml-2">✓ Uploaded</span>
                                    )}
                                    {status?.status === 'error' && (
                                        <span className="text-red-600 ml-2">✗ Failed</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <input
                                type="file"
                                id={`${fieldName}_replace`}
                                accept={config.accept}
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    if (selectedFile) {
                                        // MODIFIED: Pass current file for replacement tracking
                                        handleFileChange(selectedFile, fieldName, setFieldValue, file);
                                    }
                                }}
                                className="hidden"
                            />
                            <label
                                htmlFor={`${fieldName}_replace`}
                                className="px-3 py-1 text-xs bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 cursor-pointer transition-colors"
                            >
                                Replace
                            </label>
                        </div>
                    </div>
                )}
                
                <ErrorMessage name={fieldName} component="p" className="text-red-500 text-sm" />
                
                {status?.status === 'error' && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {status.error}
                    </p>
                )}
            </div>
        );
    };

    // Document sections
    const documentSections = [
        {
            title: "Identity Documents",
            fields: ['photo', 'aadharFront', 'aadharBack', 'panCard']
        },
        {
            title: "Financial Documents",
            fields: ['salarySlip1', 'salarySlip2', 'salarySlip3', 'bankStatement']
        }
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                        <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Document Upload
                    </h1>
                    <p className="text-gray-600">
                        Upload your documents to complete the verification process
                    </p>
                </div>

                <Formik
                    initialValues={documentData}
                    validationSchema={DocumentUploadSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isValid, setFieldValue, values }) => (
                        <Form className="space-y-6">
                            {errorMessage && (
                                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <p className='text-red-600 font-medium'>{errorMessage}</p>
                                    </div>
                                </div>
                            )}
                            
                            {documentSections.map((section, index) => (
                                <div key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            {index === 0 ? (
                                                <FileText className="w-4 h-4 text-white" />
                                            ) : (
                                                <Upload className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.fields.map((fieldName) => (
                                            <FileUploadField
                                                key={fieldName}
                                                fieldName={fieldName}
                                                setFieldValue={setFieldValue}
                                                values={values}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Guidelines */}
                            <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-blue-600 text-sm font-bold">i</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-blue-800 mb-2">
                                            Important Guidelines
                                        </h3>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>• Documents should be clear and readable</li>
                                            <li>• Salary slips must be from the last 3 consecutive months</li>
                                            <li>• Bank statement should cover the last 6 months</li>
                                            <li>• Files are uploaded automatically when selected</li>
                                            <li>• Each document must be unique - same file cannot be used for multiple fields</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                
                                <button 
                                    disabled={loader || !isValid} 
                                    type='submit' 
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loader ? (
                                        <BeatLoader color="#fff" size={6} />
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

export default DocumentUpload;


"use client";
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { PersonalDetailsSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import { User, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import References from './References';

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
        updateAddress,
        copyCurrentToPermanent
    } = useUser();

    const [sameAddress, setSameAddress] = useState(personalData.permanentAddress.isSameAsCurrent || false);

    const formatDateForAPI = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const isCurrentAddressComplete = (values) => {
        return values.currentAddress.street && 
               values.currentAddress.city && 
               values.currentAddress.state && 
               values.currentAddress.pincode;
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
            console.log('API Data being sent:', JSON.stringify(apiData, null, 2));
            
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
            const errorText = await response.text();
console.log('Error response:', errorText);
            setErrorMessage("Error submitting data: " + error.message);
            setLoader(false);
        }
// setStep(step + 1);
    }

    const handleSameAddressChange = (e, setFieldValue, values) => {
        const isChecked = e.target.checked;
        
        // Check if current address is complete before allowing checkbox to be checked
        if (isChecked && !isCurrentAddressComplete(values)) {
            // Optionally show an error message
            setErrorMessage("Please fill in all current address fields first");
            return; // Don't proceed with checking the checkbox
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

    const getFullAddressFromAadhar = () => {
        if (!aadharData?.address) return '';
        const addr = aadharData.address;
        const addressParts = [
            addr.house,
            addr.street, 
            addr.loc,
            addr.landmark,
            addr.po,
            addr.vtc
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
    

    return (
        <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Personal Details
                    </h1>
                    <p className="text-gray-600">
                        Please fill in your personal information to continue
                    </p>
                </div>

                <Formik
                    initialValues={{
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
                    }}
                    validationSchema={PersonalDetailsSchema}
                    context={{
                        phoneNumber: phoneData?.phoneNumber || phoneData?.phone || '', 
                        userEmail: emailData?.email || ''
                    }}
                    onSubmit={(values) => { handlePersonalDetails(values); }}
                    enableReinitialize
                >
                    {({ isValid, touched, setFieldValue, values }) => (
                        <Form className="space-y-8">
                            {errorMessage && (
                                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                                    <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
                                </div>
                            )}
                            
                            {/* Personal Information Section */}
                            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            First Name<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="firstName"
                                            type="text"
                                            placeholder="Enter your first name"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        />
                                        <ErrorMessage name="firstName" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Last Name<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="lastName"
                                            type="text"
                                            placeholder="Enter your last name"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        />
                                        <ErrorMessage name="lastName" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Gender<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            as="select"
                                            name="gender"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </Field>
                                        <ErrorMessage name="gender" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Birth<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="dob"
                                            type="date"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        />
                                        <ErrorMessage name="dob" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Alternative Email
                                        </label>
                                        <Field
                                            name="alternativeEmail"
                                            type="email"
                                            placeholder="Enter alternative email"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        />
                                        <ErrorMessage name="alternativeEmail" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Father's Name<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="fatherName"
                                            type="text"
                                            placeholder="Enter father's name"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        />
                                        <ErrorMessage name="fatherName" component="p" className="text-red-500 text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Current Address Section */}
                            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Current Address</h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Complete Address<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="currentAddress.street"
                                            as="textarea"
                                            rows="3"
                                            placeholder="Enter complete current address"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
                                        />
                                        <ErrorMessage name="currentAddress.street" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                City<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="currentAddress.city"
                                                type="text"
                                                placeholder="Enter city"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="currentAddress.city" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                State<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="currentAddress.state"
                                                type="text"
                                                placeholder="Enter state"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="currentAddress.state" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Pincode<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="currentAddress.pincode"
                                                type="text"
                                                maxLength="6"
                                                placeholder="Enter pincode"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="currentAddress.pincode" component="p" className="text-red-500 text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Permanent Address Section */}
                            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Permanent Address</h2>
                                </div>

                                <div className="mb-6">
                                <label className={`flex items-center gap-3 cursor-pointer group ${!isCurrentAddressComplete(values) ? 'opacity-50 cursor-not-allowed' : ''}`}>
<div className="relative">
    <input
        type="checkbox"
        checked={sameAddress}
        disabled={!isCurrentAddressComplete(values)}
        onChange={(e) => handleSameAddressChange(e, setFieldValue, values)}
        className="sr-only"
    />
    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
        sameAddress ? 'bg-gradient-to-r from-teal-500 to-emerald-500 border-teal-500' : 
        !isCurrentAddressComplete(values) ? 'border-gray-200 bg-gray-100' : 
        'border-gray-300 group-hover:border-teal-300'
    }`}>
        {sameAddress && (
            <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        )}
    </div>
</div>
<span className={`text-sm font-medium transition-colors duration-200 ${
    !isCurrentAddressComplete(values) ? 'text-gray-400' : 
    'text-gray-700 group-hover:text-teal-600'
}`}>
    Permanent address is same as current address
</span>
</label>
                                </div>

                                {(
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Complete Address<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="permanentAddress.street"
                                                as="textarea"
                                                rows="3"
                                                placeholder="Enter complete permanent address"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
                                            />
                                            <ErrorMessage name="permanentAddress.street" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    City<span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Field
                                                    name="permanentAddress.city"
                                                    type="text"
                                                    placeholder="Enter city"
                                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                />
                                                <ErrorMessage name="permanentAddress.city" component="p" className="text-red-500 text-sm" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    State<span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Field
                                                    name="permanentAddress.state"
                                                    type="text"
                                                    placeholder="Enter state"
                                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                />
                                                <ErrorMessage name="permanentAddress.state" component="p" className="text-red-500 text-sm" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Pincode<span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Field
                                                    name="permanentAddress.pincode"
                                                    type="text"
                                                    maxLength="6"
                                                    placeholder="Enter pincode"
                                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                />
                                                <ErrorMessage name="permanentAddress.pincode" component="p" className="text-red-500 text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Family Reference Section */}
                            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <Users className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Family Reference</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Reference Name<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="familyReference.name"
                                            type="text"
                                            placeholder="Enter reference name"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        />
                                        <ErrorMessage name="familyReference.name" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mobile Number<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="familyReference.mobileNumber"
                                            type="text"
                                            maxLength="10"
                                            placeholder="Enter mobile number"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        />
                                        <ErrorMessage name="familyReference.mobileNumber" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="familyReference.email"
                                            type="email"
                                            placeholder="Enter email"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        />
                                        <ErrorMessage name="familyReference.email" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
        Reference Relation<span className="text-red-500 ml-1">*</span>
    </label>
    <Field
        as="select"
        name="familyReference.relation"
        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
    >
        <option value="">Select relationship</option>
        <option value="Father">Father</option>
        <option value="Mother">Mother</option>
        <option value="Brother">Brother</option>
        <option value="Sister">Sister</option>
        <option value="Husband">Husband</option>
        <option value="Spouse">Spouse</option>
    </Field>
    <ErrorMessage name="familyReference.relation" component="p" className="text-red-500 text-sm" />
</div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Address<span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <Field
                                        name="familyReference.address"
                                        as="textarea"
                                        rows="3"
                                        placeholder="Enter complete address"
                                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
                                    />
                                    <ErrorMessage name="familyReference.address" component="p" className="text-red-500 text-sm" />
                                </div>
                            </div>

                            {/* Navigation Buttons */}
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
    )
}

export default PersonalDetails;