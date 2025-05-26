"use client"
import React, { useState, useEffect, useRef } from 'react';
import {  ArrowRight, Shield, Clock, RefreshCw } from 'lucide-react';



export default function OTPVerification({ email, onSubmitOtp, onResend }) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle pasting OTP
  const handlePaste = (e, index) => {
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
    
    // Focus on appropriate field after paste
    const focusIndex = Math.min(index + otpDigits.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  // Resend OTP
  const resendOtp = () => {
    if (timer === 0) {
      setTimer(60);
      setOtp(Array(6).fill(''));
      onResend?.();
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };

  // Submit OTP
  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        onSubmitOtp?.(enteredOtp);
      }, 1500);
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-100 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600 mb-2">
            We've sent a 6-digit code to
          </p>
          <p className="font-medium text-teal-600 break-all">
            {email}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
          {/* OTP Input Fields */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter Verification Code
            </label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                />
              ))}
            </div>
          </div>

          {/* Timer and Resend */}
          <div className="text-center mb-6">
            {timer > 0 ? (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Resend code in {formatTime(timer)}</span>
              </div>
            ) : (
              <button
                onClick={resendOtp}
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Resend Code
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isComplete || isLoading}
            className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify Email
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Didn't receive the code? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  );
}

