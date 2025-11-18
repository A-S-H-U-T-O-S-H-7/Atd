"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isViewingApplicant, setIsViewingApplicant] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if admin is viewing an applicant
    const viewUserToken = sessionStorage.getItem('view_user_token');
    const viewUserData = sessionStorage.getItem('view_user_data');
    
    if (viewUserToken && viewUserData) {
      setIsViewingApplicant(true);
      setCheckingAuth(false);
    } else {
      setIsViewingApplicant(false);
      setCheckingAuth(false);
      
      // Only redirect if not in admin viewing mode and not authenticated
      if (!loading && !isAuthenticated()) {
        router.push('/userlogin');
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Allow access if viewing as admin or authenticated as user
  if (!isViewingApplicant && !isAuthenticated()) {
    return null;
  }

  return children;
};

export default ProtectedRoute;