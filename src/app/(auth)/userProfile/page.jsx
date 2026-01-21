'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import StepOneProfile from '@/components/Web/profile/StepOneProfile';
import StepInProgressProfile from '@/components/Web/profile/StepInprogressProfile';
import StepCompleteProfile from '@/components/Web/profile/StepCompleteProfile';
import LoadingSpinner from '@/components/Web/profile/LoadingSpinner';

export default function Profile() {
  const router = useRouter(); 
  const { user: authUser, loading: authLoading, fetchUserData, logout } = useAuth();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isViewingApplicant, setIsViewingApplicant] = useState(false);

  useEffect(() => {
    const viewUserToken = sessionStorage.getItem('view_user_token');
    const viewUserData = sessionStorage.getItem('view_user_data');

    if (viewUserToken && viewUserData) {
      setIsViewingApplicant(true);
      setUser(JSON.parse(viewUserData));
      setLoading(false);
    } else {
      setIsViewingApplicant(false);
      setUser(authUser);
      setLoading(authLoading);
    }
  }, [authUser, authLoading]);

  const userStep = user?.step || 1;


  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [congratulationsTriggered, setCongratulationsTriggered] = useState(false);
  const [showProfileLoading, setShowProfileLoading] = useState(false);

  useEffect(() => {
    if (user && !isInitialized && !congratulationsTriggered && !isViewingApplicant) {
      setIsInitialized(true);
      try {
        const showCongratulations = localStorage.getItem('showCongratulations');
        if (showCongratulations === 'true') {
          localStorage.removeItem('showCongratulations');
          setCongratulationsTriggered(true);
          setShowProfileLoading(true);
        }
      } catch (error) {
        console.warn('Could not access localStorage:', error);
      }
    }
  }, [user, isInitialized, congratulationsTriggered, isViewingApplicant]);

  const handleBackToAdmin = () => {
    sessionStorage.removeItem('view_user_token');
    sessionStorage.removeItem('view_user_data');
    router.push('/crm/dashboard');
  };

  const commonProps = {
    user,
    router,
    userStep,
    logout,
    fetchUserData,
    showCongratulationsModal,
    setShowCongratulationsModal,
    showProfileLoading,
    setShowProfileLoading,
    congratulationsTriggered
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    router.push('/userlogin');
    return null;
  }

  return (
    <>
      <div className={isViewingApplicant ? 'pt-1' : ''}>
        {(!userStep || userStep === 1) && <StepOneProfile {...commonProps} />}
        {userStep > 1 && userStep < 6 && <StepInProgressProfile {...commonProps} />}
        {userStep >= 6 && <StepCompleteProfile {...commonProps} />}
      </div>
    </>
  );
}