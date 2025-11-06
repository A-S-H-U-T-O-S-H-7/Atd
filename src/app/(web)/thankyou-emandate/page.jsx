// app/thankyou-emandate/page.js
"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, Clock } from 'lucide-react';

export default function EMandateThankYou() {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState('processing');
  const [searchParams, setSearchParams] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Parse URL parameters on client side only
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const params = {
        success: urlParams.get('success'),
        status_code: urlParams.get('status_code'),
        transaction_id: urlParams.get('transaction_id')
      };
      
      setSearchParams(params);
      setIsVisible(true);
      
      console.log('Thank You Page Params:', params);

      if (params.status_code === '0300' || params.success === '1') {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    }
  }, []);

  const handleBackToProfile = () => {
    router.push('/profile');
  };

  const getStatusContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle2,
          title: 'Thank You!',
          message: 'Your E-Mandate has been submitted successfully',
          description: 'We have received your e-mandate submission and it has been processed successfully.',
          gradient: 'from-green-400 via-green-500 to-emerald-600',
          bgGradient: 'from-green-200 to-emerald-200',
        };
      case 'failed':
        return {
          icon: XCircle,
          title: 'Processing Failed',
          message: 'E-Mandate submission failed',
          description: 'There was an issue processing your E-Mandate. Please try again or contact support.',
          gradient: 'from-red-400 via-red-500 to-pink-600',
          bgGradient: 'from-red-200 to-pink-200',
        };
      default:
        return {
          icon: Clock,
          title: 'Processing...',
          message: 'Checking your E-Mandate status',
          description: 'Please wait while we verify your E-Mandate submission.',
          gradient: 'from-blue-400 via-blue-500 to-cyan-600',
          bgGradient: 'from-blue-200 to-cyan-200',
        };
    }
  };

  const content = getStatusContent();
  const IconComponent = content.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-6 py-2 relative overflow-hidden">
      {/* Background elements remain the same */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Container */}
      <div className={`relative max-w-2xl w-full transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200/50 backdrop-blur-sm">
          <div className={`h-2 bg-gradient-to-r ${content.gradient} relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
          
          <div className="px-8 py-8 sm:px-16 sm:py-8 text-center relative">
            <Sparkles className="absolute top-8 right-8 w-6 h-6 text-blue-300 opacity-60 animate-pulse" />
            <Sparkles className="absolute bottom-8 left-8 w-5 h-5 text-indigo-300 opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="flex justify-center mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-32 h-32 bg-gradient-to-r ${content.bgGradient} rounded-full animate-ping opacity-20`}></div>
              </div>
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${content.gradient} rounded-full blur-xl opacity-50 animate-pulse`}></div>
                <div className={`relative bg-gradient-to-br ${content.gradient} rounded-full p-6 shadow-2xl ring-4 ring-white`}>
                  <IconComponent className="w-16 h-16 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 tracking-tight">
              {content.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {content.message}
            </p>

            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 mb-10 max-w-lg mx-auto border-2 border-blue-200/60 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-full blur-2xl"></div>
              <p className="text-gray-700 text-base leading-relaxed relative z-10">
                {content.description}
              </p>
              {searchParams.transaction_id && (
                <p className="text-sm text-gray-500 mt-3 relative z-10">
                  Transaction ID: <strong>{searchParams.transaction_id}</strong>
                </p>
              )}
            </div>

            <button 
              onClick={handleBackToProfile}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">Back to Profile</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
          Need help? Contact our support team
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
        </p>
      </div>
    </div>
  );
}