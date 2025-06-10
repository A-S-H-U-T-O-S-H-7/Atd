"use client";
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { PhoneValidationSchema } from '../validations/UserRegistrationValidations';
import { Check, X, LogIn } from "lucide-react";
import Link from 'next/link';

function MobileLoginInput({ phoneData, onSendOTP, loader, errorMessage }) {
    const formatMobileNumber = (value) => {
        // Remove all non-digits and limit to 10 digits
        return value.replace(/\D/g, '').slice(0, 10);
    }; 

    return (
        <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end">
            <Formik
                initialValues={{ phoneNumber: phoneData.phoneNumber || '' }}
                validationSchema={PhoneValidationSchema}
                onSubmit={onSendOTP}
                enableReinitialize
            >
                {({ isValid, touched, setFieldValue, values, errors }) => (
                    <Form className="bg-white backdrop-blur-lg w-full max-w-md flex flex-col gap-4 text-center rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 pt-14 pb-6 px-6 rounded-t-2xl relative flex flex-col justify-center items-center">
                            <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                                <div>
                                    <img
                                        src="/atdlogo.png"
                                        alt="ATD Money logo"
                                        className="w-15 h-15 object-contain bg-white p-1 rounded-full shadow-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center mb-2 mt-4">
                                <h1 className="text-white font-bold text-xl md:text-2xl">
                                    Welcome Back
                                </h1>
                            </div>
                            <p className="text-white/90 font-medium mt-2 text-sm md:text-base">
                                Login to access your account <br />
                                <span className="font-semibold md:font-bold">Quick & Secure Access</span>
                            </p>
                        </div>

                        <div className="p-6 text-gray-700">
                            <h2 className="font-bold text-lg mb-2">
                                Login with Mobile Number
                            </h2>

                            <p className="text-gray-400 text-sm mb-4">
                                We'll send you an OTP for verification
                            </p>

                            {errorMessage && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="relative mb-5 h-20">
                                <Field name="phoneNumber">
                                    {({ field, form }) => (
                                        <div
                                            className={`flex rounded-xl overflow-hidden border ${
                                                isValid && values.phoneNumber.length === 10
                                                    ? "border-indigo-400"
                                                    : errors.phoneNumber && touched.phoneNumber
                                                    ? "border-red-400"
                                                    : "border-gray-300"
                                            } transition-all duration-300 bg-white/5 backdrop-blur-sm`}
                                        >
                                            <div className="flex items-center justify-center  bg-indigo-900/50 px-4">
                                                <img
                                                    src="/flag.png"
                                                    alt="Indian flag"
                                                    className="w-10 h-10 object-contain p-1"
                                                />
                                            </div>

                                            <input
                                                {...field}
                                                type="text"
                                                maxLength="10"
                                                placeholder="Enter your 10-digit number"
                                                className="px-4 w-full py-4 focus:outline-none text-base bg-transparent placeholder-gray-400"
                                                onChange={(e) => {
                                                    const formattedValue = formatMobileNumber(e.target.value);
                                                    form.setFieldValue(field.name, formattedValue);
                                                }}
                                                value={field.value}
                                            />

                                            {values.phoneNumber.length > 0 && (
                                                <div className="flex items-center justify-center px-4">
                                                    {isValid && values.phoneNumber.length === 10
                                                        ? <Check className="w-5 h-5 text-indigo-400" />
                                                        : <X className="w-5 h-5 text-red-400" />
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Field>

                                <ErrorMessage name="phoneNumber" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            <button
                                disabled={loader || !isValid || values.phoneNumber.length !== 10} 
                                type='submit' 
                                className={`w-full px-4 py-4 cursor-pointer rounded-xl font-bold text-base transition-all duration-300 ${
                                    !loader && isValid && values.phoneNumber.length === 10
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600"
                                        : "bg-gray-300 text-gray-700"
                                }`}
                            >
                                {loader ? (<BeatLoader color="#fff" size={8} />) : ("Send Login OTP")}
                            </button>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <p className="text-gray-500 text-sm text-center">
                                    Don't have an account?{' '}
                                    <Link href="/user_signup" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors">
                                        Signup here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default MobileLoginInput;