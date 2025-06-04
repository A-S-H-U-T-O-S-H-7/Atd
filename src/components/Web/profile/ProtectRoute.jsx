"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Wait for auth to complete loading
    if (!loading) {
      let justRegistered = false;
      try {
        justRegistered = localStorage.getItem('justRegistered') === 'true';
      } catch (error) {
        console.warn('Could not access localStorage:', error);
      }

      // Only redirect if not authenticated and not just registered
      if (!isAuthenticated() && !justRegistered) {
        setShouldRedirect(true);
        router.push('/userlogin');
      }
    }
  }, [loading, isAuthenticated, router]);

  // Show loading while auth is loading or redirecting
  if (loading || shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not just registered, return null
  if (!isAuthenticated()) {
    return null;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;