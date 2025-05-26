"use client";
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { CreditCard } from 'lucide-react';
import { AadharValidationSchema } from '../validations/UserRegistrationValidations';
import { BsInfoCircle } from "react-icons/bs";


function AadharInput({ 
    aadharData, 
    onSendOTP, 
     loader, 
    errorMessage 
}) {
    // Format Aadhar number display (XXXX XXXX XXXX)
    const formatAadharDisplay = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
        if (match) {
            return [match[1], match[2], match[3]].filter(Boolean).join(' ');
        }
        return cleaned;
    };

    return (
        <>
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500  rounded-full mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Aadhar Verification
                </h1>
                <p className="text-gray-600">
                    Enter your 12-digit Aadhar number
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
                {errorMessage && (
                    <p className='text-red-600 font-thin text-center mb-4'>
                        {errorMessage}
                    </p>
                )}

                {/* Aadhar Form */}
                <Formik
                    initialValues={{ aadharNumber: aadharData?.aadharNumber || '' }}
                    validationSchema={AadharValidationSchema}
                    onSubmit={onSendOTP}
                    enableReinitialize
                >
                    {({ isValid, touched, values, setFieldValue }) => (
                        <Form className="space-y-6">
                            <div>
                                <label htmlFor="aadharNumber" className="block text-sm  font-medium text-gray-700 mb-2">
                                    Aadhar Number
                                </label>
                                <div className='h-18'>
                                 <div className="relative ">
                                    <Field name="aadharNumber">
                                        {({ field }) => (
                                            <input
                                                {...field}
                                                id="aadharNumber"
                                                type="text"
                                                placeholder="Enter your 12-digit Aadhar number"
                                                value={formatAadharDisplay(field.value)}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    if (value.length <= 12) {
                                                        setFieldValue('aadharNumber', value);
                                                    }
                                                }}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                        )}
                                    </Field>
                                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                                <ErrorMessage name="aadharNumber" component="p" className="mt-2 text-sm text-red-600" />
                                </div>
                            </div>

                            <div className="flex justify-between">
                               
                                <button 
                                    disabled={loader || !isValid || values.aadharNumber.length !== 12} 
                                    type='submit' 
                                    className="px-6 w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500
         cursor-pointer text-white font-semibold rounded-xl shadow-lg hover:shadow-xl 
         transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-700  
         disabled:from-gray-300 disabled:to-gray-300"
                                >
                                    {loader ? (<BeatLoader color="#fff" size={8} />) : ("Send OTP")}
                                </button>
                            </div>
                            <div className='px-4 py-3 flex gap-3 items-center rounded-xl border border-dashed border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm'>
    <BsInfoCircle className='text-orange-600 text-lg flex-shrink-0' />
    <p className='text-sm font-medium text-orange-800'>
        Verification code will be sent to your Aadhaar-registered mobile number
    </p>
</div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
}

export default AadharInput;