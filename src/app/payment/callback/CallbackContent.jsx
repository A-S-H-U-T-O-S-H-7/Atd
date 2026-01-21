'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader, CheckCircle, XCircle, AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const orderIdFromUrl = searchParams.get('order_id');
    setOrderId(orderIdFromUrl || '');

    const url = window.location.href;
    
    if (url.includes('SUCCESS') || url.toLowerCase().includes('success')) {
      handlePaymentSuccess(orderIdFromUrl);
    } else if (url.includes('FAILED') || url.toLowerCase().includes('failed')) {
      handlePaymentFailure(orderIdFromUrl);
    } else {
      checkLocalStorage(orderIdFromUrl);
    }
  }, [searchParams, router]);

  const handlePaymentSuccess = (orderId) => {
    setStatus('success');
    if (orderId && typeof window !== 'undefined') {
      localStorage.setItem(`payment_${orderId}`, 'success');
    }
    setTimeout(() => {
      router.push('/userProfile?payment=success&order_id=' + orderId);
    }, 3000);
  };

  const handlePaymentFailure = (orderId) => {
    setStatus('failed');
    if (orderId && typeof window !== 'undefined') {
      localStorage.setItem(`payment_${orderId}`, 'failed');
    }
    setTimeout(() => {
      router.push('/userProfile?payment=failed&order_id=' + orderId);
    }, 3000);
  };

  const checkLocalStorage = (orderId) => {
    if (!orderId || typeof window === 'undefined') {
      setStatus('pending');
      setTimeout(() => router.push('/userProfile'), 5000);
      return;
    }
    
    const stored = localStorage.getItem(`payment_${orderId}`);
    if (stored === 'success') {
      handlePaymentSuccess(orderId);
    } else if (stored === 'failed') {
      handlePaymentFailure(orderId);
    } else {
      setStatus('pending');
      setTimeout(() => router.push('/userProfile'), 5000);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Processing Payment</h2>
            <p className="text-gray-600">We're verifying your transaction...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Payment Successful! 🎉</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <p className="text-lg font-semibold text-green-800 mb-2">
                Thank you for your payment!
              </p>
              {orderId && (
                <p className="text-gray-700 text-sm">
                  Reference: <span className="font-mono">{orderId}</span>
                </p>
              )}
            </div>
            <p className="text-gray-500 animate-pulse mb-4">Redirecting to profile...</p>
            <button 
              onClick={() => router.push('/userProfile')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Profile Now
            </button>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Payment Not Completed</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <p className="text-lg font-semibold text-red-800 mb-2">Payment failed</p>
              <div className="flex items-start gap-2 text-sm text-gray-700 mt-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>No amount was deducted. Please try again.</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => router.back()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button 
                onClick={() => router.push('/userProfile')}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go to Profile
              </button>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Payment Status Pending</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <p className="text-lg font-semibold text-yellow-800 mb-2">Please check your profile</p>
              {orderId && (
                <p className="text-gray-700 text-sm mt-2">
                  Reference: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span>
                </p>
              )}
            </div>
            <button 
              onClick={() => router.push('/userProfile')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Check Profile Now
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {renderContent()}
      </div>
      <div className="mt-8 text-center text-sm text-gray-600 max-w-md">
        <p>Having issues? Contact support: support@atdmoney.com</p>
      </div>
    </div>
  );
}