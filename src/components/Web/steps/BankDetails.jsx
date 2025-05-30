"use client";
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { BankDetailsSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import { Building2, ChevronLeft, ChevronRight, Eye, EyeOff, Shield } from 'lucide-react';

function BankDetails() {
    const {
        bankData,
        setBankData,
        step,
        setStep,
        phoneData,
        loader,
        setLoader,
        errorMessage,
        setErrorMessage
    } = useUser();

    const [ifscLoading, setIfscLoading] = useState(false);
    const [showAccountNumber, setShowAccountNumber] = useState(false);

    // Handle IFSC code validation and auto-populate bank details
    const handleIFSC = async (ifsc, setFieldValue) => {
        try {
            const upperIFSC = ifsc.toUpperCase();
            setFieldValue("ifscCode", upperIFSC);
            
            // Validate IFSC format before API call
            if (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(upperIFSC)) {
                setIfscLoading(true);
                const response = await fetch(`https://ifsc.razorpay.com/${upperIFSC}`, {
                    method: "GET",
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setFieldValue("bankName", data.BANK || "");
                    setFieldValue("bankBranch", data.BRANCH || "");
                } else {
                    // Clear fields if IFSC is invalid
                    setFieldValue("bankName", "");
                    setFieldValue("bankBranch", "");
                }
                setIfscLoading(false);
            } else {
                // Clear fields if format is invalid
                setFieldValue("bankName", "");
                setFieldValue("bankBranch", "");
            }
        } catch (error) {
            console.error("IFSC lookup error:", error);
            setIfscLoading(false);
            setFieldValue("bankName", "");
            setFieldValue("bankBranch", "");
        }
    };

    const handleBankDetails = async (values) => {
        console.log("Form values received:", values);
    console.log("Account Type value:", values.accountType);
        try {
            setBankData({ ...values });
            setLoader(true);
            setErrorMessage("");
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    step: 9,
                    provider: 1,
                    userid: phoneData?.userid, 
                    ifsccode: values.ifscCode,
                    bankname: values.bankName,
                    bankbranch: values.bankBranch,
                    accountno: parseInt(values.accountNumber), 
                    accounttype: values.accountType,
                }),
            });
    
            const result = await response.json();
            console.log(result)
    
            if (response.ok) {
                setLoader(false);
                setStep(step + 1);
            } else {
                setErrorMessage(result?.message || "Something went wrong.");
                setLoader(false);
            }
        } catch (error) {
            setErrorMessage("Error submitting data: " + error.message);
            setLoader(false);
        }
    };

    // Format account number display
    const formatAccountNumber = (value) => {
        return value.replace(/\d(?=\d{4})/g, "*");
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Bank Details
                    </h1>
                    <p className="text-gray-600">
                        Please provide your banking information for secure transactions
                    </p>
                </div>

                <Formik
                    initialValues={bankData}
                    validationSchema={BankDetailsSchema}
                    onSubmit={(values) => { handleBankDetails(values); }}
                    enableReinitialize
                >
                    {({ isValid, touched, setFieldValue, values, errors }) => (
                        <Form className="space-y-8">
                            {errorMessage && (
                                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                                    <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
                                </div>
                            )}
                            
                            {/* Bank Information Section */}
                            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Banking Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* IFSC Code */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            IFSC Code<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <Field
                                                name="ifscCode"
                                                type="text"
                                                placeholder="e.g., SBIN0001234"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 uppercase"
                                                onChange={(e) => { handleIFSC(e.target.value, setFieldValue); }}
                                                maxLength="11"
                                            />
                                            {ifscLoading && (
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <BeatLoader size={8} color="#14B8A6" />
                                                </div>
                                            )}
                                        </div>
                                        <ErrorMessage name="ifscCode" component="p" className="text-red-500 text-sm" />
                                        <p className="text-xs text-gray-500">
                                            11-character bank identifier code
                                        </p>
                                    </div>

                                    {/* Bank Name */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Bank Name<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="bankName"
                                            type="text"
                                            placeholder="Bank name will auto-populate"
                                            className="w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent"
                                            readOnly
                                        />
                                        <ErrorMessage name="bankName" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    {/* Bank Branch */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Bank Branch<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="bankBranch"
                                            type="text"
                                            placeholder="Branch will auto-populate"
                                            className="w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent"
                                            readOnly
                                        />
                                        <ErrorMessage name="bankBranch" component="p" className="text-red-500 text-sm" />
                                    </div>

                                    {/* Account Type */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Account Type<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            as="select"
                                            name="accountType"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                        >
                                            <option value="" disabled>Select Account Type</option>
                                            <option value="SAVING">Savings Account</option>
                                            <option value="CURRENT">Current Account</option>
                                            
                                        </Field>
                                        <ErrorMessage name="accountType" component="p" className="text-red-500 text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Account Details Section */}
                            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Account Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Account Number */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Account Number<span className="text-red-600 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <Field
                                                name="accountNumber"
                                                type={showAccountNumber ? "text" : "password"}
                                                placeholder="Enter your bank account number"
                                                className="w-full px-4 py-3 pr-12 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                }}
                                                maxLength="18"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600 transition-colors duration-200"
                                                onClick={() => setShowAccountNumber(!showAccountNumber)}
                                            >
                                                {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <ErrorMessage name="accountNumber" component="p" className="text-red-500 text-sm" />
                                        <p className="text-xs text-gray-500">
                                            9-18 digit account number
                                        </p>
                                    </div>

                                    {/* Confirm Account Number */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirm Account Number<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="confirmAccountNumber"
                                            type="text"
                                            placeholder="Re-enter your account number"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }}
                                            maxLength="18"
                                        />
                                        <ErrorMessage name="confirmAccountNumber" component="p" className="text-red-500 text-sm" />
                                    </div>
                                </div>

                                {/* Account Number Match Indicator */}
                                {values.accountNumber && values.confirmAccountNumber && (
                                    <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
                                        values.accountNumber === values.confirmAccountNumber 
                                            ? 'bg-green-50/80 text-green-700 border border-green-200' 
                                            : 'bg-red-50/80 text-red-700 border border-red-200'
                                    }`}>
                                        {values.accountNumber === values.confirmAccountNumber 
                                            ? '✅ Account numbers match' 
                                            : '❌ Account numbers do not match'
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Bank Details Summary */}
                            {values.bankName && values.accountNumber && (
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Bank Details Summary
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                        <div className="p-3 bg-teal-50/50 rounded-lg">
                                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Bank Name</p>
                                            <p className="font-semibold text-gray-800 mt-1">{values.bankName}</p>
                                        </div>
                                        <div className="p-3 bg-emerald-50/50 rounded-lg">
                                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Branch</p>
                                            <p className="font-semibold text-gray-800 mt-1">{values.bankBranch}</p>
                                        </div>
                                        <div className="p-3 bg-cyan-50/50 rounded-lg">
                                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">IFSC Code</p>
                                            <p className="font-semibold text-gray-800 mt-1">{values.ifscCode}</p>
                                        </div>
                                        <div className="p-3 bg-teal-50/50 rounded-lg">
                                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Account Type</p>
                                            <p className="font-semibold text-gray-800 mt-1">{values.accountType}</p>
                                        </div>
                                        <div className="p-3 bg-emerald-50/50 rounded-lg sm:col-span-2 lg:col-span-2">
                                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Account Number</p>
                                            <p className="font-semibold text-gray-800 mt-1">
                                                {values.accountNumber ? formatAccountNumber(values.accountNumber) : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Notice */}
                            <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                                            Security Notice
                                        </h3>
                                        <p className="text-sm text-yellow-700">
                                            Your bank details are encrypted and securely stored. We use industry-standard security measures to protect your financial information.
                                        </p>
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
                                    disabled={loader || !isValid} 
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

export default BankDetails;