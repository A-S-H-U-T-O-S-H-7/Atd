'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader, CheckCircle, XCircle, AlertCircle, Home, RefreshCw } from 'lucide-react';

const PaymentCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Extract order_id from URL
    const orderIdFromUrl = searchParams.get('order_id');
    setOrderId(orderIdFromUrl || '');

    // Try to get payment status from URL parameters (Cashfree returns these)
    const paymentStatus = searchParams.get('payment_status') || 
                         searchParams.get('txStatus') || 
                         searchParams.get('status');

    const paymentMessage = searchParams.get('payment_message') || 
                          searchParams.get('txMsg') || 
                          searchParams.get('message');

    // Check URL for success indicators
    const currentUrl = window.location.href;
    
    // Method 1: Check URL patterns for success
    if (currentUrl.includes('payment_status=SUCCESS') || 
        currentUrl.includes('txStatus=SUCCESS') ||
        currentUrl.includes('status=SUCCESS') ||
        currentUrl.toLowerCase().includes('success')) {
      
      handlePaymentSuccess(orderIdFromUrl);
      
    } 
    // Method 2: Check URL patterns for failure
    else if (currentUrl.includes('payment_status=FAILED') || 
             currentUrl.includes('txStatus=FAILED') ||
             currentUrl.includes('status=FAILED') ||
             currentUrl.toLowerCase().includes('failed') ||
             currentUrl.includes('error=')) {
      
      handlePaymentFailure(orderIdFromUrl, paymentMessage);
      
    } 
    // Method 3: Use embedded payment status
    else if (paymentStatus) {
      if (paymentStatus === 'SUCCESS') {
        handlePaymentSuccess(orderIdFromUrl);
      } else {
        handlePaymentFailure(orderIdFromUrl, paymentMessage);
      }
    }
    // Method 4: Fallback - assume pending/unknown
    else {
      checkPaymentStatusFromLocalStorage(orderIdFromUrl);
    }
  }, [searchParams]);

  const handlePaymentSuccess = (orderId) => {
    setStatus('success');
    setMessage('Payment completed successfully!');
    
    // Store in localStorage so parent page can detect it
    if (orderId) {
      localStorage.setItem(`payment_${orderId}`, 'success');
      localStorage.setItem(`payment_time_${orderId}`, Date.now());
    }
    
    // Store recent payment for profile page
    const recentPayments = JSON.parse(localStorage.getItem('recent_payments') || '[]');
    recentPayments.unshift({
      orderId,
      status: 'success',
      timestamp: Date.now(),
      amount: localStorage.getItem(`amount_${orderId}`)
    });
    
    // Keep only last 10 payments
    localStorage.setItem('recent_payments', JSON.stringify(recentPayments.slice(0, 10)));
    
    // Redirect after delay
    setTimeout(() => {
      router.push('/userProfile?payment=success&order_id=' + orderId);
    }, 5000);
  };

  const handlePaymentFailure = (orderId, errorMessage) => {
    setStatus('failed');
    setMessage(errorMessage || 'Payment was not successful');
    
    if (orderId) {
      localStorage.setItem(`payment_${orderId}`, 'failed');
    }
    
    setTimeout(() => {
      router.push('/userProfile?payment=failed');
    }, 5000);
  };

  const checkPaymentStatusFromLocalStorage = (orderId) => {
    // Check if we have any indication from localStorage
    if (orderId) {
      const storedStatus = localStorage.getItem(`payment_${orderId}`);
      
      if (storedStatus === 'success') {
        handlePaymentSuccess(orderId);
        return;
      } else if (storedStatus === 'failed') {
        handlePaymentFailure(orderId, 'Payment failed');
        return;
      }
    }
    
    // If we can't determine, show manual check screen
    setStatus('pending');
    setMessage('Please check your profile for payment status');
    
    setTimeout(() => {
      router.push('/userProfile');
    }, 10000);
  };

  const checkPaymentManually = async () => {
    if (!orderId) return;
    
    try {
      setStatus('loading');
      
      // Try to check payment status with existing API (if available)
      const token = localStorage.getItem('user_auth_token');
      
      const response = await fetch(
        `https://live.atdmoney.com/api/user/payment/status/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          handlePaymentSuccess(orderId);
        } else {
          handlePaymentFailure(orderId, data.message);
        }
      } else {
        throw new Error('Unable to verify');
      }
    } catch (error) {
      setStatus('manual');
      setMessage('Please check your bank statement or profile page');
    }
  };

  const handleGoToProfile = () => {
    router.push('/userProfile');
  };

  const handleTryAgain = () => {
    router.back();
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
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 max-w-md mx-auto">
              <p className="text-lg font-semibold text-green-800 mb-2">
                Thank you for your payment
              </p>
              {orderId && (
                <p className="text-gray-700 text-sm">
                  Reference: <span className="font-mono">{orderId}</span>
                </p>
              )}
              <p className="text-gray-600 text-sm mt-2">{message}</p>
            </div>
            <p className="text-gray-500 animate-pulse mb-4">Redirecting to profile...</p>
            <button 
              onClick={handleGoToProfile}
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
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 max-w-md mx-auto">
              <p className="text-lg font-semibold text-red-800 mb-2">{message}</p>
              <div className="flex items-start gap-2 text-sm text-gray-700 mt-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>No amount was deducted. Please try again.</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={handleTryAgain}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button 
                onClick={handleGoToProfile}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go to Profile
              </button>
            </div>
          </div>
        );

      case 'pending':
      case 'manual':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Payment Status Pending</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 max-w-md mx-auto">
              <p className="text-lg font-semibold text-yellow-800 mb-2">{message}</p>
              {orderId && (
                <p className="text-gray-700 text-sm mt-2">
                  Order ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span>
                </p>
              )}
              <p className="text-gray-600 text-sm mt-3">
                Please keep this reference number for your records.
              </p>
            </div>
            <div className="space-y-3">
              <button onClick={checkPaymentManually} className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Check Status Again
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleGoToProfile}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Check Profile
                </button>
                <a href="mailto:support@atdmoney.com" className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Contact Support
                </a>
              </div>
            </div>
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
      
      {/* Help text */}
      <div className="mt-8 text-center text-sm text-gray-600 max-w-md">
        <p>Having issues? Contact support: support@atdmoney.com</p>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;