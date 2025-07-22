"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { Clock, RefreshCw, ChevronLeft,PencilLine , Phone, CheckCircle } from 'lucide-react';
import * as Yup from 'yup';

const OtpValidationSchema = Yup.object().shape({
  phoneOtp: Yup.string()
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
    .required('OTP is required')
});

function BasicOtpVerification({ 
  phoneNumber,
  onVerifyOTP,
  onResendOTP,
  onChangeNumber,
  onBack,
  loader = false,
  errorMessage = "",
  countdown = 0,
  canResend = true,
  userData = {} 
}) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(countdown); 
  const inputRefs = useRef([]);

  // Handle OTP input change
  const handleChange = (index, value, setFieldValue) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Update formik field
    setFieldValue('phoneOtp', newOtp.join(''));

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index, setFieldValue) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      setFieldValue('phoneOtp', newOtp.join(''));
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting OTP
  const handlePaste = (e, index, setFieldValue) => {
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
    setFieldValue('phoneOtp', newOtp.join(''));
    
    // Focus on appropriate field after paste
    if (index + otpDigits.length < 6) {
      inputRefs.current[index + otpDigits.length]?.focus();
    }
  };

  const handleSubmit = (values) => {
    // Pass both OTP and userData for verification
    onVerifyOTP({
      otp: parseInt(values.phoneOtp),
      ...userData // Include all registration data
    });
  };

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Update timeLeft when countdown prop changes
  useEffect(() => {
    setTimeLeft(countdown);
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-emerald-100 relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-5%] left-[-10%] w-[250px] h-[250px] bg-blue-200 rounded-full animate-pulse" />
        <div className="absolute top-[40%] left-[60%] w-[350px] h-[350px] bg-pink-100 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-indigo-100 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-emerald-100 rounded-full rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="relative z-10 flex justify-center items-center min-h-screen px-3 md:px-4 py-6">
        <div className="w-full max-w-md">
          <Formik
            initialValues={{ phoneOtp: '' }}
            validationSchema={OtpValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, setFieldValue, values }) => (
              <Form className="p-6 md:p-8 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-emerald-300/20 rounded-3xl">
                
                {/* Header */}
                <div className="text-center mb-6">
                  <img src="/atdlogo.png" alt="Logo" className="mx-auto w-16 h-16 mb-3 shadow-md rounded-xl bg-white p-2" />
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Number</h1>
                  <p className="text-gray-600 text-sm">
                    We've sent a 6-digit OTP to
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2 mb-3">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-gray-800">+91 {phoneNumber}</span>
                    <button
                      type="button"
                      onClick={onChangeNumber}
                      className="ml-2 cursor-pointer text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <PencilLine className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Enter the code to continue</p>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{errorMessage}</p>
                  </div>
                )}

                {/* OTP Input Fields */}
                <div className="mb-6">
                  <div className="flex justify-center gap-3 mb-4">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value, setFieldValue)}
                        onKeyDown={(e) => handleKeyDown(e, i, setFieldValue)}
                        onPaste={(e) => handlePaste(e, i, setFieldValue)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      />
                    ))}
                  </div>
                  <ErrorMessage name="phoneOtp" component="p" className="text-red-500 text-sm text-center" />
                </div>

                {/* Countdown and Resend */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-3">
                    Didn't receive the code?
                  </p>
                  
                  {timeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 rounded-lg py-3 px-4">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        Resend code in <span className="font-semibold text-emerald-600">
                          {`0:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => {
                        onResendOTP();
                        setTimeLeft(60); 
                      }}
                      disabled={!canResend || loader}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resend Code
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loader || !isValid || values.phoneOtp.length !== 6}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 text-base flex items-center justify-center gap-2 ${
                      !loader && isValid && values.phoneOtp.length === 6
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl cursor-pointer hover:from-emerald-600 hover:to-teal-700 border border-emerald-500"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
                    }`}
                  >
                    {loader ? (
                      <>
                        <BeatLoader color="#fff" size={8} />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Continue</span>
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  
                </div>

                {/* Security Note */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    🔐 Your information is secure and encrypted
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default BasicOtpVerification;