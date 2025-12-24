'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';

const ProtectedRoute = ({ 
  children, 
  requiredPermission = null 
}) => {
  const router = useRouter();
  const { 
    isAuthenticated, 
    loading, 
    hasPermission,
    logout 
  } = useAdminAuthStore();
  
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait for auth store to load
    if (loading) return;

    const checkAccess = async () => {
      setChecking(true);
      
      // 1. Check if user is authenticated
      if (!isAuthenticated) {
        router.push('/crm');
        return;
      }

      // 2. If permission is required, check if user has it
      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push('/crm/403');
        return;
      }

      setChecking(false);
    };

    checkAccess();
  }, [isAuthenticated, loading, requiredPermission, hasPermission, router]);

  // Show loading spinner while checking
  if (loading || checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">
          Checking permissions...
        </p>
      </div>
    );
  }

  // If authenticated and has permission (or no permission required), show children
  if (isAuthenticated && (!requiredPermission || hasPermission(requiredPermission))) {
    return children;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;