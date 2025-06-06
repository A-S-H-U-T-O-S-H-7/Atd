"use client";
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { PhoneValidationSchema } from '../validations/UserRegistrationValidations';
import { Check, X } from "lucide-react";
import Link from 'next/link';

function MobileInputForm({ phoneData, onSendOTP, loader, errorMessage }) {
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
                        <div className="bg-gradient-to-r from-green-400 to-teal-500 pt-14 pb-6 px-6 rounded-t-2xl relative flex flex-col justify-center items-center">
                            <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                                <div>
                                    <img
                                        src="/atdlogo.png"
                                        alt="ATD Money logo"
                                        className="w-15 h-15 object-contain bg-white p-1 rounded-full shadow-lg"
                                    />
                                </div>
                            </div>

                            <h1 className="text-gray-800 font-bold text-xl md:text-2xl mt-4">
                                Welcome to ATD Money
                            </h1>
                            <p className="text-gray-700 font-medium mt-2 text-sm md:text-base">
                                Get Instant Loan <br />
                                <span className=" font-semibold md:font-bold">From ₹3,000 to ₹50,000</span>
                            </p>
                        </div>

                        <div className="p-6 text-gray-700">
                            <h2 className="font-bold text-lg mb-2">
                                SignUp with Mobile Number
                            </h2>

                            <p className="text-gray-400 text-sm mb-4">
                                An OTP will be sent for verification
                            </p>

                            {errorMessage && <p className='text-red-500 font-medium text-center mb-4'>{errorMessage}</p>}

                            <div className="relative mb-5 h-20">
                                <Field name="phoneNumber">
                                    {({ field, form }) => (
                                        <div
                                            className={`flex rounded-xl overflow-hidden border ${
                                                isValid && values.phoneNumber.length === 10
                                                    ? "border-teal-400"
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
                                                        ? <Check className="w-5 h-5 text-teal-400" />
                                                        : <X className="w-5 h-5 text-red-400" />
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Field>

                                <ErrorMessage name="phoneNumber" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* check Box */}
                            <div className="mb-4">
    <Field name="agreeToTerms">
        {({ field, form }) => (
            <label className="flex items-start space-x-3 ">
                <input
                    type="checkbox"
                    checked={field.value || false}
                    onChange={(e) => form.setFieldValue('agreeToTerms', e.target.checked)}
                    className="mt-1 w-10 h-10 cursor-pointer text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 "
                />
                <span className="text-sm text-gray-600 text-left leading-relaxed">
                    By continuing, you agree to our{' '}
                    <Link href="/privacypolicy" >
                    <span className="text-teal-600 cursor-pointer hover:underline font-medium">privacy policies</span></Link> and{' '}
                   <Link href="/terms&condition"> <span className="text-teal-600 hover:underline cursor-pointer font-medium">T&C</span></Link>. You authorize us to communicate with you via phone, e-mails, WhatsApp, etc.
                 </span>
            </label>
        )}
    </Field>
    <ErrorMessage name="agreeToTerms" component="p" className="text-red-500 text-xs mt-1" />
</div>

                            <button
                                disabled={loader || !isValid || values.phoneNumber.length !== 10 || !values.agreeToTerms} 
                                type='submit' 
                                className={`w-full px-4 py-4 cursor-pointer rounded-xl font-bold text-base transition-all duration-300 ${
                                    !loader && isValid && values.phoneNumber.length === 10 && values.agreeToTerms
                                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                                        : "bg-gray-300 text-gray-700"
                                }`}
                            >
                                {loader ? (<BeatLoader color="#fff" size={8} />) : ("Get Started")}
                            </button>

                           <div className='py-4'>Already have an account ? <Link className='text-indigo-600 cursor-pointer font-medium hover:text-indigo-700 transition-colors hover:underline' href="/userlogin">Login here</Link> </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default MobileInputForm;