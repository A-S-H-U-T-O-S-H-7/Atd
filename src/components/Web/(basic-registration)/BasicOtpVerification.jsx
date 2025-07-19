"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { Shield, Clock, RefreshCw, Mail, Phone, CheckCircle, ArrowRight, ChevronLeft } from 'lucide-react';
import { RiEdit2Fill } from "react-icons/ri";
import * as Yup from "yup";

// Validation Schema
const DualOtpSchema = Yup.object().shape({
  emailOtp: Yup.string()
    .matches(/^\d{6}$/, 'Email OTP must be 6 digits')
    .required('Email OTP is required'),
  phoneOtp: Yup.string()
    .matches(/^\d{6}$/, 'Phone OTP must be 6 digits')
    .required('Phone OTP is required')
});

function DualOtpVerification({ 
  email, 
  phoneNumber, 
  onVerifyBothOTP, 
  onResendEmailOTP, 
  onResendPhoneOTP,
  onChangeEmail,
  onChangePhone,
  onBack,
  loader, 
  errorMessage,
  emailCountdown = 0,
  phoneCountdown = 0,
  canResendEmail = true,
  canResendPhone = true
}) {
  const [emailOtp, setEmailOtp] = useState(Array(6).fill(''));
  const [phoneOtp, setPhoneOtp] = useState(Array(6).fill(''));
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [activeInput, setActiveInput] = useState('email'); // 'email' or 'phone'
  
  const emailInputRefs = useRef([]);
  const phoneInputRefs = useRef([]);

  // Initialize refs
  useEffect(() => {
    emailInputRefs.current = emailInputRefs.current.slice(0, 6);
    phoneInputRefs.current = phoneInputRefs.current.slice(0, 6);
  }, []);

  // Focus first email input on mount
  useEffect(() => {
    if (emailInputRefs.current[0]) {
      emailInputRefs.current[0].focus();
    }
  }, []);

  // Reset OTP states
  const resetEmailOtp = () => {
    setEmailOtp(Array(6).fill(''));
    setEmailVerified(false);
  };

  const resetPhoneOtp = () => {
    setPhoneOtp(Array(6).fill(''));
    setPhoneVerified(false);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value, type, setFieldValue) => {
    if (!/^\d?$/.test(value)) return;
    
    const isEmail = type === 'email';
    const currentOtp = isEmail ? emailOtp : phoneOtp;
    const setOtp = isEmail ? setEmailOtp : setPhoneOtp;
    const inputRefs = isEmail ? emailInputRefs : phoneInputRefs;
    const fieldName = isEmail ? 'emailOtp' : 'phoneOtp';
    
    const newOtp = [...currentOtp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Update formik field
    setFieldValue(fieldName, newOtp.join(''));

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index, type, setFieldValue) => {
    const isEmail = type === 'email';
    const currentOtp = isEmail ? emailOtp : phoneOtp;
    const setOtp = isEmail ? setEmailOtp : setPhoneOtp;
    const inputRefs = isEmail ? emailInputRefs : phoneInputRefs;
    const fieldName = isEmail ? 'emailOtp' : 'phoneOtp';
    
    if (e.key === 'Backspace' && !currentOtp[index] && index > 0) {
      const newOtp = [...currentOtp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      setFieldValue(fieldName, newOtp.join(''));
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle pasting OTP
  const handlePaste = (e, index, type, setFieldValue) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return;
    
    const isEmail = type === 'email';
    const currentOtp = isEmail ? emailOtp : phoneOtp;
    const setOtp = isEmail ? setEmailOtp : setPhoneOtp;
    const inputRefs = isEmail ? emailInputRefs : phoneInputRefs;
    const fieldName = isEmail ? 'emailOtp' : 'phoneOtp';
    
    const otpDigits = pastedData.slice(0, 6 - index).split('');
    const newOtp = [...currentOtp];
    
    otpDigits.forEach((digit, i) => {
      if (index + i < 6) {
        newOtp[index + i] = digit;
      }
    });
    
    setOtp(newOtp);
    setFieldValue(fieldName, newOtp.join(''));
    
    // Focus on appropriate field after paste
    if (index + otpDigits.length < 6) {
      inputRefs.current[index + otpDigits.length].focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendEmail = () => {
    resetEmailOtp();
    if (emailInputRefs.current[0]) {
      emailInputRefs.current[0].focus();
    }
    onResendEmailOTP();
  };

  const handleResendPhone = () => {
    resetPhoneOtp();
    if (phoneInputRefs.current[0]) {
      phoneInputRefs.current[0].focus();
    }
    onResendPhoneOTP();
  };

  const renderOtpInputs = (type, otp, refs, form) => {
    const isEmail = type === 'email';
    const isVerified = isEmail ? emailVerified : phoneVerified;
    
    return (
      <div className="flex gap-2 justify-center mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (refs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            disabled={isVerified}
            onChange={(e) => handleOtpChange(index, e.target.value, type, form.setFieldValue)}
            onKeyDown={(e) => handleKeyDown(e, index, type, form.setFieldValue)}
            onPaste={(e) => handlePaste(e, index, type, form.setFieldValue)}
            onFocus={() => setActiveInput(type)}
            className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              isVerified
                ? 'bg-green-50 border-green-300 text-green-700'
                : activeInput === type
                  ? 'bg-white border-teal-400 focus:ring-teal-500'
                  : 'bg-white/70 border-gray-300 focus:ring-teal-400'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderCountdownOrResend = (countdown, canResend, onResend, type) => {
    if (countdown > 0) {
      return (
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <Clock className="w-4 h-4" />
          <span>Resend in <span className="font-semibold text-teal-600">{formatTime(countdown)}</span></span>
        </div>
      );
    }
    
    return (
      <button
        type="button"
        onClick={onResend}
        disabled={!canResend || loader}
        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Resend {type} OTP
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-emerald-100 relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-5%] left-[-10%] w-[250px] h-[250px] bg-blue-200 rounded-full animate-pulse" />
        <div className="absolute top-[40%] left-[60%] w-[350px] h-[350px] bg-pink-100 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-indigo-100 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-emerald-100 rounded-full rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Verify Your Account
            </h1>
            <p className="text-gray-600 mb-4">
              We've sent verification codes to both your email and phone number
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700 text-center font-medium">{errorMessage}</p>
              </div>
            )}

            <Formik
              initialValues={{ emailOtp: '', phoneOtp: '' }}
              validationSchema={DualOtpSchema}
              onSubmit={onVerifyBothOTP}
            >
              {({ isValid, values, form }) => (
                <div className="space-y-8">
                  {/* Email OTP Section */}
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    emailVerified 
                      ? 'bg-green-50 border-green-300' 
                      : activeInput === 'email' 
                        ? 'bg-teal-50 border-teal-300' 
                        : 'bg-white/70 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          emailVerified ? 'bg-green-500' : 'bg-teal-500'
                        }`}>
                          {emailVerified ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Mail className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Email Verification</h3>
                          <p className="text-sm text-gray-600 break-all">{email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onChangeEmail}
                        className="text-teal-600 hover:text-teal-700 p-1"
                      >
                        <RiEdit2Fill className="w-4 h-4" />
                      </button>
                    </div>

                    {!emailVerified && (
                      <>
                        <Field name="emailOtp">
                          {({ form }) => renderOtpInputs('email', emailOtp, emailInputRefs, form)}
                        </Field>
                        <ErrorMessage name="emailOtp" component="p" className="text-red-500 text-sm text-center mb-4" />
                        
                        <div className="text-center">
                          {renderCountdownOrResend(emailCountdown, canResendEmail, handleResendEmail, 'Email')}
                        </div>
                      </>
                    )}
                    
                    {emailVerified && (
                      <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                        <CheckCircle className="w-5 h-5" />
                        <span>Email verified successfully!</span>
                      </div>
                    )}
                  </div>

                  {/* Phone OTP Section */}
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    phoneVerified 
                      ? 'bg-green-50 border-green-300' 
                      : activeInput === 'phone' 
                        ? 'bg-teal-50 border-teal-300' 
                        : 'bg-white/70 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          phoneVerified ? 'bg-green-500' : 'bg-teal-500'
                        }`}>
                          {phoneVerified ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Phone className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Phone Verification</h3>
                          <p className="text-sm text-gray-600">+91 {phoneNumber}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onChangePhone}
                        className="text-teal-600 hover:text-teal-700 p-1"
                      >
                        <RiEdit2Fill className="w-4 h-4" />
                      </button>
                    </div>

                    {!phoneVerified && (
                      <>
                        <Field name="phoneOtp">
                          {({ form }) => renderOtpInputs('phone', phoneOtp, phoneInputRefs, form)}
                        </Field>
                        <ErrorMessage name="phoneOtp" component="p" className="text-red-500 text-sm text-center mb-4" />
                        
                        <div className="text-center">
                          {renderCountdownOrResend(phoneCountdown, canResendPhone, handleResendPhone, 'Phone')}
                        </div>
                      </>
                    )}
                    
                    {phoneVerified && (
                      <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                        <CheckCircle className="w-5 h-5" />
                        <span>Phone verified successfully!</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="button"
                      onClick={onBack}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        if (isValid && values.emailOtp.length === 6 && values.phoneOtp.length === 6) {
                          onVerifyBothOTP(values);
                        }
                      }}
                      disabled={loader || !isValid || values.emailOtp.length !== 6 || values.phoneOtp.length !== 6}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        loader || !isValid || values.emailOtp.length !== 6 || values.phoneOtp.length !== 6
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
                      }`}
                    >
                      {loader ? (
                        <BeatLoader color="#fff" size={8} />
                      ) : (
                        <>
                          Verify Both OTPs
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex justify-center gap-2 pt-4">
                    <div className={`w-3 h-3 rounded-full transition-colors ${
                      emailVerified ? 'bg-green-500' : values.emailOtp.length === 6 ? 'bg-teal-500' : 'bg-gray-300'
                    }`} />
                    <div className={`w-3 h-3 rounded-full transition-colors ${
                      phoneVerified ? 'bg-green-500' : values.phoneOtp.length === 6 ? 'bg-teal-500' : 'bg-gray-300'
                    }`} />
                  </div>

                  {/* Help Text */}
                  <p className="text-center text-sm text-gray-500 mt-6">
                    Both OTPs must be entered correctly to proceed. Check your spam folder if you don't receive the codes.
                  </p>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DualOtpVerification;