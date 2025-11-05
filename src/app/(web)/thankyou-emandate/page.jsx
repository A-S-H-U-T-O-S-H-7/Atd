"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function EMandateThankYou() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-6 py-2 relative overflow-hidden">
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Decorative Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-30 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full opacity-35 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Container */}
      <div className={`relative max-w-2xl w-full transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200/50 backdrop-blur-sm">
          {/* Top Accent with Gradient */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
          
          {/* Content */}
          <div className="px-8 py-8 sm:px-16 sm:py-8 text-center relative">
            {/* Sparkle Icons */}
            <Sparkles className="absolute top-8 right-8 w-6 h-6 text-blue-300 opacity-60 animate-pulse" />
            <Sparkles className="absolute bottom-8 left-8 w-5 h-5 text-indigo-300 opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Success Icon */}
            <div className="flex justify-center mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-full p-6 shadow-2xl ring-4 ring-green-100">
                  <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 tracking-tight">
              Thank You!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Your E-Mandate has been submitted successfully
            </p>

            {/* Message Box with Soft Gradient */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 mb-10 max-w-lg mx-auto border-2 border-blue-200/60 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-full blur-2xl"></div>
              <p className="text-gray-700 text-base leading-relaxed relative z-10">
                We have received your e-mandate submission. A confirmation has been sent to your registered email address.
              </p>
            </div>

            {/* Action Button */}
            <button className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">Back to Profile</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-600 mt-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
          Need help? Contact our support team
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
        </p>
      </div>
    </div>
  );
}