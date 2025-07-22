"use client";
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { X, CheckCircle, XCircle } from "lucide-react";
import * as Yup from 'yup';
import Link from 'next/link';

// Validation schema
const SalariedValidationSchema = Yup.object().shape({
    isSalaried: Yup.string().required('Please select an option')
});

function SalariedCheck({ onNext, onError }) {
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animate, setAnimate] = useState(true);

    // Animated content data for left section
    const contentData = [
        {
            title: "Experience the unity of ease and convenience!",
            subtitle: "Enjoy 100% digital application process."
        },
        {
            title: "Transform your financial journey today!",
            subtitle: "Access seamless solutions at your fingertips."
        },
        {
            title: "Unlock premium benefits instantly!",
            subtitle: "Join thousands of satisfied customers worldwide."
        }
    ];

    // Content animation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimate(false);
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % contentData.length);
                setAnimate(true);
            }, 200);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (values) => {
        onError(""); // Clear any previous errors
        
        if (values.isSalaried === 'no') {
            setShowPopup(true);
            return;
        }

        if (values.isSalaried === 'yes') {
            setLoading(true);
            
            // Simulate loading for UX, then proceed to next step
            setTimeout(() => {
                setLoading(false);
                onNext("form", { isSalaried: values.isSalaried });
            }, 1000);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <div className="bg-gradient-to-r from-[#cef8f8] to-[#e1fefe] min-h-screen flex items-center justify-center px-4 py-8">
                <div className="w-full px-0 md:px-16 lg:px-20  mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
                        
                        {/* Left Section: Image and Text Content */}
<div className="order-2 lg:order-1 md:col-span-2 flex space-y-2">
                            {/* Image Section - Fixed height container */}
                            <div className="flex justify-center lg:justify-start">
                                <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-72 lg:h-72 xl:w-100 xl:h-130 flex-shrink-0">
                                    <img
                                        src="/loginimage2.png"
                                        alt="Hero illustration"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* Text Content - Fixed height container for animation */}
                            <div className="text-center flex justify-center items-center  lg:text-left">
                             <div className="h-40 sm:h-36 md:h-32 lg:h-36 xl:h-32 overflow-hidden">
                                    <div className={`transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold text-purple-900 mb-3 leading-tight">
                                            {contentData[currentIndex].title}
                                        </h2>
                                        <p className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg text-purple-700 leading-relaxed">
                                            {contentData[currentIndex].subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Form - Compact Design */}
<div className="order-1 lg:order-2 lg:col-span-1 flex justify-center">
                            <div className="w-full max-w-md">
                                <Formik
                                    initialValues={{ isSalaried: '' }}
                                    validationSchema={SalariedValidationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isValid, values }) => (
                                        <Form className="bg-white/95 backdrop-blur-sm rounded-2xl border border-emerald-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                            <div className="p-6">
                                                {/* Header */}
                                                <div className="text-center mb-6">
                                                    <h2 className="font-bold text-lg sm:text-xl text-gray-800 mb-1">
                                                        Employment Verification
                                                    </h2>
                                                    <p className="text-sm text-gray-600">Quick eligibility check</p>
                                                </div>

                                                {/* Question Section */}
                                                <div className="mb-6">
                                                    <h3 className="text-emerald-700 font-semibold mb-4 text-base sm:text-lg text-center">
                                                        Are you salaried?
                                                    </h3>
                                                    
                                                    <div className="space-y-3">
                                                        <Field name="isSalaried">
                                                            {({ field, form }) => (
                                                                <>
                                                                    <label className={`flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                                        field.value === 'yes' 
                                                                            ? 'border-teal-400 bg-teal-50 shadow-md' 
                                                                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                                    }`}>
                                                                        <input
                                                                            type="radio"
                                                                            value="yes"
                                                                            checked={field.value === 'yes'}
                                                                            onChange={() => form.setFieldValue('isSalaried', 'yes')}
                                                                            className="sr-only"
                                                                        />
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <span className="text-gray-700 font-medium text-sm sm:text-base">Yes, I am salaried</span>
                                                                            {field.value === 'yes' && <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />}
                                                                        </div>
                                                                    </label>

                                                                    <label className={`flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                                        field.value === 'no' 
                                                                            ? 'border-red-400 bg-red-50 shadow-md' 
                                                                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                                    }`}>
                                                                        <input
                                                                            type="radio"
                                                                            value="no"
                                                                            checked={field.value === 'no'}
                                                                            onChange={() => form.setFieldValue('isSalaried', 'no')}
                                                                            className="sr-only"
                                                                        />
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <span className="text-gray-700 font-medium text-sm sm:text-base">No, I am not salaried</span>
                                                                            {field.value === 'no' && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                                                                        </div>
                                                                    </label>
                                                                </>
                                                            )}
                                                        </Field>
                                                    </div>
                                                    
                                                    <ErrorMessage name="isSalaried" component="p" className="text-red-500 text-sm mt-2 text-center" />
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    disabled={loading || !isValid} 
                                                    type='submit' 
                                                    className={`w-full px-4 py-3 sm:py-4 cursor-pointer rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                                                        !loading && isValid
                                                            ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-emerald-600"
                                                            : "bg-gray-300 text-gray-700 cursor-not-allowed"
                                                    }`}
                                                >
                                                    {loading ? (<BeatLoader color="#fff" size={8} />) : ("Continue")}
                                                </button>

                                                {/* Login Link */}
                                                <div className='pt-4 text-center'>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        Already have an account? {" "}
                                                        <Link className='text-indigo-600 cursor-pointer font-medium hover:text-indigo-700 transition-colors hover:underline' href="/userlogin">
                                                            Login here
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup Modal - Compact Design */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in duration-300">
                        <button 
                            onClick={closePopup}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="text-center">
                            <div className="mb-4">
                                <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto" />
                            </div>
                            
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                                Not Eligible
                            </h3>
                            
                            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                                Sorry, this service is currently available only for salaried individuals.
                            </p>
                            
                            <button 
                                onClick={closePopup}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm sm:text-base"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SalariedCheck;