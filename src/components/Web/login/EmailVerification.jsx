"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowRight, Shield, Clock, RefreshCw } from 'lucide-react';
import Image from 'next/image';

// Email Verification Component
 export default function EmailVerification({ onEmailSubmit }) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear previous errors
    if (errors.email) {
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onEmailSubmit?.(email);
    }, 1500);
  };

  const handleGoogleVerify = () => {
    console.log('Google verification clicked');
  };

  return (
    <div className="bg-gradient-to-r from-[#cef8f8] to-[#e1fefe] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            onClick={handleGoogleVerify}
            className=" w-full flex cursor-pointer items-center justify-center gap-3 px-4 py-3 bg-gray-300 border border-gray-300 rounded-xl hover:border-teal-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2 mb-6"
          >
            <Image src="/google-logo.png" alt='google' width={400} height={400} className='w-6 h-6'/>
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

          {/* Email Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600">!</span>
                  {errors.email}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className=" cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Continue
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
