"use client";
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { Mail } from 'lucide-react';
import { EmailValidationSchema } from '../validations/UserRegistrationValidations';
import Image from 'next/image';

function EmailInput({ 
    emailData, 
    onSendOTP, 
    onGoogleVerify, 
    loader, 
    errorMessage 
}) {
    return (
        <>
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Email Verification
                </h1>
                <p className="text-gray-600">
                    Enter your email to get started
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
                {/* Google Button */}
                <button
                    onClick={onGoogleVerify}
                    className="w-full bg-blue-200 flex cursor-pointer items-center justify-center gap-3 px-4 py-3  border border-blue-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2 mb-6"
                >
                    <div className="w-6 h-6  rounded-full flex items-center justify-center">
            <Image src="/google-logo.png" alt='google' width={400} height={400} className='w-6 h-6'/>
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-gray-800">
                        Continue with Google
                    </span>
                </button>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>

                {errorMessage && (
                    <p className='text-red-600 font-thin text-center mb-4'>
                        {errorMessage}
                    </p>
                )}

                {/* Email Form */}
                <Formik
                    initialValues={{ email: emailData?.email || '' }}
                    validationSchema={EmailValidationSchema}
                    onSubmit={onSendOTP}
                    enableReinitialize
                >
                    {({ isValid, touched, values, errors }) => {
                        // Check if button should be enabled
                        const isButtonEnabled = !loader && 
                                              values.email.trim() && 
                                              isValid && 
                                              (!touched.email || !errors.email);

                        return (
                            <Form className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className='h-18'>
                                        <div className="relative">
                                            <Field
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter your email address"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                        
                                        <ErrorMessage name="email" component="p" className="mt-2 text-sm text-red-600" />
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        disabled={!isButtonEnabled}
                                        type='submit'
                                        className={`px-6 py-4 w-full cursor-pointer rounded-xl font-bold text-base transition-all duration-300 ${
                                            isButtonEnabled
                                                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:shadow-xl"
                                                : "bg-gray-300 text-gray-700 cursor-not-allowed"
                                        }`}
                                    >
                                        {loader ? (<BeatLoader color="#fff" size={8} />) : ("Send OTP")}
                                    </button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </>
    );
}

export default EmailInput;