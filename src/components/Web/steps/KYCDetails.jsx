"use client";
import React, { useMemo, useEffect } from 'react'
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

    // Memoized CRN and Account ID generation to prevent constant recalculation
    const generatedCrn = useMemo(() => 
        generateCrnNumber(
            personalData?.firstName,
            personalData?.dob,
            kycData.panNumber, // Use kycData instead of form values
            phoneData?.phoneNumber
        ), 
        [personalData?.firstName, personalData?.dob, kycData.panNumber, phoneData?.phoneNumber]
    );

    const generatedAccountId = useMemo(() => 
        generateAccountId(generatedCrn), 
        [generatedCrn]
    );

    // Auto-update context when CRN or Account ID changes
    useEffect(() => {
        if (generatedCrn && generatedAccountId) {
            setKycData(prev => ({
                ...prev,
                crnNumber: generatedCrn,
                accountId: generatedAccountId
            }));
        }
    }, [generatedCrn, generatedAccountId, setKycData]);

    const handleKycDetails = async (values) => {
        try {
            setLoader(true);
            setErrorMessage("");
            
            // Generate fresh CRN and Account ID for submission
            const submissionCrn = generateCrnNumber(
                personalData?.firstName,
                personalData?.dob,
                values.panNumber,
                phoneData?.phoneNumber
            );

            const submissionAccountId = generateAccountId(submissionCrn);

            // Update context with final values
            setKycData({ 
                ...values,
                crnNumber: submissionCrn,      
                accountId: submissionAccountId 
            });
            
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
                    crnno: submissionCrn,
                    accountId: submissionAccountId
                }),
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (response.ok) {
                setLoader(false);
                setStep(step + 1);
            } else {
                setErrorMessage(result?.message || 'An error occurred during submission');
                setLoader(false);
            }
        } catch (error) {
            console.error('Submission Error:', error);
            setErrorMessage("Error submitting data: " + error.message);
            setLoader(false);
        }
    }

    const formatPanInput = (value) => {
        // Remove any non-alphanumeric characters and convert to uppercase
        return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    };

    // Handle form value changes to update context
    const handleFormChange = (fieldName, value, setFieldValue) => {
        setFieldValue(fieldName, value);
        setKycData(prev => ({
            ...prev,
            [fieldName]: value
        }));
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
                    onSubmit={handleKycDetails}
                    enableReinitialize={true}
                >
                    {({ isValid, touched, setFieldValue, values }) => (
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
                                                        handleFormChange(field.name, formattedValue, form.setFieldValue);
                                                    }}
                                                    value={field.value || ''}
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
                                            value={generatedCrn || ''}
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
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
                                            value={generatedAccountId || ''}
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
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
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default KYCDetails;