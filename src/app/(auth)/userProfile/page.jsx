'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Step Components
import StepOneProfile from '@/components/Web/profile/StepOneProfile';
import StepInProgressProfile from '@/components/Web/profile/StepInprogressProfile';
import StepCompleteProfile from '@/components/Web/profile/StepCompleteProfile';

// Shared Components
import LoadingSpinner from '@/components/Web/profile/LoadingSpinner';

export default function Profile() {
  const router = useRouter();
  const { user, loading, fetchUserData, logout } = useAuth();
  const userStep = user?.step || 1;

  console.log("👤 Profile component - loading:", loading);
  console.log("👤 Profile component - user:", user);
  console.log("👤 Profile component - user step:", userStep);

  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [congratulationsTriggered, setCongratulationsTriggered] = useState(false);
  const [showProfileLoading, setShowProfileLoading] = useState(false);

  useEffect(() => {
    if (user && !isInitialized && !congratulationsTriggered) {
      setIsInitialized(true);
      try {
        const showCongratulations = localStorage.getItem('showCongratulations');
        if (showCongratulations === 'true') {
          localStorage.removeItem('showCongratulations');
          setCongratulationsTriggered(true);
          setShowProfileLoading(true);
        }
      } catch (error) {
        console.warn('Could not access localStorage for congratulations:', error);
      }
    }
  }, [user, isInitialized, congratulationsTriggered]);

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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Step-based rendering
  if (!userStep || userStep === 1) {
    return <StepOneProfile {...commonProps} />;
  }

  if (userStep > 1 && userStep < 6) {
    return <StepInProgressProfile {...commonProps} />;
  }

  return <StepCompleteProfile {...commonProps} />;
}