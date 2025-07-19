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

    const handleSubmit = async (values) => {
        onError(""); // Clear any previous errors
        
        if (values.isSalaried === 'no') {
            setShowPopup(true);
            return;
        }

        if (values.isSalaried === 'yes') {
            setLoading(true);
            try {
                // Simulate API call for employment verification
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate API response (90% success rate for demo)
                const success = Math.random() > 0.1;
                
                if (success) {
                    // Success - move to next phase
                    onNext("form", { isSalaried: values.isSalaried });
                } else {
                    // API error
                    onError("Failed to verify employment status. Please try again.");
                }
            } catch (error) {
                onError("An error occurred during verification. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <div className="bg-gradient-to-r from-[#cef8f8] to-[#e1fefe] px-4 md:px-5 min-h-screen flex items-center justify-center">
                <div className="py-8 flex flex-col lg:flex-row gap-15 items-center justify-between max-w-6xl mx-auto">
                    {/* Left Section: Text and Image */}
                    <div className="w-full order-2 lg:order-1 px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-10 justify-between">
                            {/* Image */}
                            <div className="w-full flex justify-center lg:justify-end">
                                <div className=" w-full max-w-md flex items-center justify-center">
                                    <img
                                        src="/loginimage2.png"
                                        alt="Hero illustration"
                                        className="  object-contain "
                                    />
                                </div>
                            </div>
                            {/* Text Content */}
                            <div className="w-full mx-auto">
                                <div className="w-80 mx-auto md:w-130 overflow-hidden">
                                    <div className={`transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left text-purple-900 mb-3">
                                            {contentData[currentIndex].title}
                                        </h2>
                                        <p className="text-lg md:text-xl text-center md:text-left text-purple-700">
                                            {contentData[currentIndex].subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Form */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end">
                        <Formik
                            initialValues={{ isSalaried: '' }}
                            validationSchema={SalariedValidationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isValid, values }) => (
                                <Form className="bg-white border-emerald-400 backdrop-blur-lg w-full max-w-xl flex flex-col gap-4 text-center rounded-2xl overflow-hidden border shadow-lg shadow-teal-300 hover:shadow-2xl transition-shadow duration-300">
                                    <div className="p-6 text-gray-700">
                                        <h2 className="font-bold text-lg mb-6">
                                            Employment Verification
                                        </h2>

                                        <div className="mb-6">
                                            <h3 className="text-emerald-700 font-semibold mb-4 text-lg">
                                                Are you salaried?
                                            </h3>
                                            
                                            <div className="space-y-3">
                                                <Field name="isSalaried">
                                                    {({ field, form }) => (
                                                        <>
                                                            <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                                field.value === 'yes' 
                                                                    ? 'border-teal-400 bg-teal-50' 
                                                                    : 'border-gray-300 hover:border-gray-400'
                                                            }`}>
                                                                <input
                                                                    type="radio"
                                                                    value="yes"
                                                                    checked={field.value === 'yes'}
                                                                    onChange={() => form.setFieldValue('isSalaried', 'yes')}
                                                                    className="sr-only"
                                                                />
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="text-gray-700 font-medium">Yes, I am salaried</span>
                                                                    {field.value === 'yes' && <CheckCircle className="w-5 h-5 text-teal-500" />}
                                                                </div>
                                                            </label>

                                                            <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                                field.value === 'no' 
                                                                    ? 'border-red-400 bg-red-50' 
                                                                    : 'border-gray-300 hover:border-gray-400'
                                                            }`}>
                                                                <input
                                                                    type="radio"
                                                                    value="no"
                                                                    checked={field.value === 'no'}
                                                                    onChange={() => form.setFieldValue('isSalaried', 'no')}
                                                                    className="sr-only"
                                                                />
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="text-gray-700 font-medium">No, I am not salaried</span>
                                                                    {field.value === 'no' && <XCircle className="w-5 h-5 text-red-500" />}
                                                                </div>
                                                            </label>
                                                        </>
                                                    )}
                                                </Field>
                                            </div>
                                            
                                            <ErrorMessage name="isSalaried" component="p" className="text-red-500 text-xs mt-2" />
                                        </div>

                                        <button
                                            disabled={loading || !isValid} 
                                            type='submit' 
                                            className={`w-full px-4 py-4 cursor-pointer rounded-xl font-bold text-base transition-all duration-300 ${
                                                !loading && isValid
                                                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:shadow-xl"
                                                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                                            }`}
                                        >
                                            {loading ? (<BeatLoader color="#fff" size={8} />) : ("Continue")}
                                        </button>

                                        <div className='py-4'>
                                            Already have an account? {" "}
                                            <Link className='text-indigo-600 cursor-pointer font-medium hover:text-indigo-700 transition-colors hover:underline' href="/userlogin">
                                                Login here
                                            </Link> 
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
                        <button 
                            onClick={closePopup}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="text-center">
                            <div className="mb-4">
                                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Not Eligible
                            </h3>
                            
                            <p className="text-gray-600 mb-6">
                                Sorry, this service is currently available only for salaried individuals.
                            </p>
                            
                            <button 
                                onClick={closePopup}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300"
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