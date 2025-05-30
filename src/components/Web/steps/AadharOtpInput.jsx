"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { Shield, Clock, RefreshCw, CreditCard } from 'lucide-react';
import { AadharOtpSchema } from '../validations/UserRegistrationValidations';
import { RiEdit2Fill } from 'react-icons/ri';

function AadharOTPInput({ 
    aadharNumber, 
    onVerifyOTP, 
    onResendOTP, 
    onChangeAadhar,
    loader, 
    errorMessage,
    countdown,
    canResend 
}) {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const inputRefs = useRef([]);

    // Initialize refs for OTP inputs
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    // Reset OTP when component mounts or aadhar number changes
    useEffect(() => {
        setOtp(Array(6).fill(''));
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [aadharNumber]);

    // Handle OTP input change for individual boxes
    const handleOtpChange = (index, value, form) => {
        if (!/^\d?$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Update formik field
        form.setFieldValue('aadharOtp', newOtp.join(''));

        // Auto-focus to next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle backspace for OTP
    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Handle pasting OTP
    const handleOtpPaste = (e, index, form) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        if (!/^\d+$/.test(pastedData)) return;
        
        const otpDigits = pastedData.slice(0, 6 - index).split('');
        const newOtp = [...otp];
        
        otpDigits.forEach((digit, i) => {
            if (index + i < 6) {
                newOtp[index + i] = digit;
            }
        });
        
        setOtp(newOtp);
        form.setFieldValue('aadharOtp', newOtp.join(''));
        
        // Focus on appropriate field after paste
        const focusIndex = Math.min(index + otpDigits.length, 5);
        inputRefs.current[focusIndex].focus();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResendClick = () => {
        setOtp(Array(6).fill(''));
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
        onResendOTP();
    };

    // Format Aadhar number for display (XXXX XXXX XXXX)
    const formatAadharDisplay = (number) => {
        if (!number) return '';
        return number.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    };

    return (
        <>
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500  rounded-full mb-4">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Verify Your Aadhar
                </h1>
                <p className="text-gray-600 mb-2">
                    We've sent a 6-digit code to your registered mobile number
                </p>
                <p className="font-medium text-teal-600 break-all">
                    Aadhar: {aadharNumber ? formatAadharDisplay(aadharNumber) : 'Not provided'}
                </p>
                <div onClick={onChangeAadhar} className='flex cursor-pointer justify-center gap-3 items-center'>
                <button 
                    type="button"
                    
                    className="text-teal-600 hover:text-teal-800 cursor-pointer text-sm mt-2"
                >
                    Change Aadhar Number
                </button>
                <RiEdit2Fill className='text-teal-700' />
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
                {errorMessage && (
                    <p className='text-red-600 font-thin text-center mb-4'>
                        {errorMessage}
                    </p>
                )}
                
                <Formik
                    initialValues={{ aadharOtp: '' }}
                    validationSchema={AadharOtpSchema}
                    onSubmit={onVerifyOTP}
                >
                    {({ isValid, touched, values }) => (
                        <Form className="space-y-6">
                            {/* OTP Input Fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                    Enter Verification Code
                                </label>
                                <div className="flex gap-3 justify-center mb-2">
                                    <Field name="aadharOtp">
                                        {({ form }) => (
                                            <>
                                                {otp.map((digit, index) => (
                                                    <input
                                                        key={index}
                                                        ref={(el) => (inputRefs.current[index] = el)}
                                                        type="text"
                                                        maxLength={1}
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(index, e.target.value, form)}
                                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                        onPaste={(e) => handleOtpPaste(e, index, form)}
                                                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </Field>
                                </div>
                                <ErrorMessage name="aadharOtp" component="p" className="text-red-500 text-sm text-center" />
                            </div>

                            {/* Timer and Resend */}
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-600 mb-2">
                                    Didn't receive the code?
                                </p>
                                {countdown > 0 ? (
                                    <div className="flex items-center py-2 justify-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>Resend code in <span className='font-semibold text-teal-600'> {formatTime(countdown)}</span></span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendClick}
                                        disabled={loader}
                                        className="inline-flex cursor-pointer items-center py-2 gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200 disabled:opacity-50"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Resend Code
                                    </button>
                                )}
                            </div>

                            <div className="flex justify-between">
                                
                                <button 
                                    disabled={loader || !isValid || values.aadharOtp.length !== 6} 
                                    type='submit' 
                                    className="px-6 w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500
                                    cursor-pointer text-white font-semibold rounded-xl shadow-lg hover:shadow-xl 
                                    transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-700  
                                    disabled:from-gray-300 disabled:to-gray-300"
                                                                    >
                                    {loader ? (<BeatLoader color="#fff" size={8} />) : ("Verify Aadhar")}
                                </button>
                            </div>

                            {/* Help Text */}
                            <p className="text-center text-sm text-gray-500 mt-4">
                                Didn't receive the code? Check your registered mobile number or try resending.
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
}

export default AadharOTPInput;