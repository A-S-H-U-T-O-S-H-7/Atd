"use client";
import React from 'react'
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
        loader,
        setLoader,
        errorMessage,
        setErrorMessage
    } = useUser();

    const handleKycDetails = async (values) => {
        // try {
        //     setKycData({ ...values });
        //     setLoader(true);
        //     setErrorMessage("");
            
        //     const response = await fetch(`${ENV.API_URL}/finance-kyc-details`, {
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
        setStep(step + 1);
    }

    const formatPanInput = (value) => {
        // Remove any non-alphanumeric characters and convert to uppercase
        return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    };

    const formatCrnInput = (value) => {
        // Remove any special characters and convert to uppercase
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

                                    {/* CRN Number */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            CRN Number<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field name="crnNumber">
                                            {({ field, form }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    maxLength="20"
                                                    placeholder="Enter CRN number"
                                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 uppercase"
                                                    onChange={(e) => {
                                                        const formattedValue = formatCrnInput(e.target.value);
                                                        form.setFieldValue(field.name, formattedValue);
                                                    }}
                                                    value={field.value}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="crnNumber" component="p" className="text-red-500 text-sm" />
                                        <p className="text-xs text-gray-500">
                                            Customer Reference Number (5-20 characters)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex flex-col  sm:flex-row justify-between gap-4 pt-4">
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