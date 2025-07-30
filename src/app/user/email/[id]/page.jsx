"use client"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EmailVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Get the 'id' parameter from URL
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      verifyEmailToken(id);
    }
  }, [id]);

  const verifyEmailToken = async (token) => {
    try {
      setStatus('verifying');
      setMessage('Verifying your email...');

      // Call verification API - this updates backend status
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ATD_API}/api/user/official/email/verification/${token}`,
        { method: 'GET' }
      );

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully!');
        
        setTimeout(() => {
          router.push('/userprofile');
        }, 3000);
      } else {
        setStatus('error');
        setMessage('Verification failed or link expired.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Email Verification</h1>
        
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        )}
        
        {status === 'verifying' && (
          <div>
            <div className="text-4xl mb-4">🔄</div>
            <p className="text-blue-600">{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-600 font-semibold">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Your email is now verified! Redirecting to profile...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-600">{message}</p>
            <button 
              onClick={() => router.push('/userprofile')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}