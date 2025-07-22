'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

// Components
import Header from '@/components/Web/profile/Header';
import ProfileCard from '@/components/Web/profile/ProfileCard';
import InformationCards from '@/components/Web/profile/InformationCard';
import CongratulationsModal from '@/components/Web/profile/CongratulationsModal';
import LoadingSpinner from '@/components/Web/profile/LoadingSpinner';
import ErrorState from '@/components/Web/profile/ErrorState';
import BackgroundElements from '@/components/Web/profile/BackgroundElements';
import ReviewSection from '@/components/Web/profile/ReviewSection';
import AppDownloadSection from '@/components/Web/profile/AppDownloadSection';
import ProtectedRoute from '@/components/Web/profile/ProtectRoute';
import UserFooter from '@/components/Web/profile/UserFooter';
import VerificationComponent from '@/components/Web/profile/VerificationComponent';
import ProfileLoadingOverlay from '@/components/Web/profile/LoadingProfile';

export default function Profile() {
  const router = useRouter();
  const { user, loading, fetchUserData, logout } = useAuth();
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

  const handleProfileLoadingComplete = () => {
    setShowProfileLoading(false);

    setTimeout(() => {
      setShowCongratulationsModal(true);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 10001 });
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, zIndex: 10001 });
      }, 250);
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, zIndex: 10001 });
      }, 400);
    }, 500);
  };

  const handleClientHistory = () => router.push('/client-history');
  const handleRetryLoading = () => fetchUserData();
  const handleLogout = async () => {
    await logout();
    router.push('/userlogin');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner />
      </div>
    );
  }

  // 🟦 STEP 1: Just completed OTP, ready to apply for loan
  if (user.step === 1) {
    return (
      <ProtectedRoute>
        <Header user={user} onLogout={handleLogout} onClientHistory={handleClientHistory} />
        <div className="pt-28 px-4">
          <ProfileCard user={user} />
          <div className="max-w-xl mx-auto mt-6 text-center bg-white p-6 rounded-xl shadow border border-blue-100">
            <p className="text-slate-700 mb-4">You're verified! Start your loan application to continue.</p>
            <button
              onClick={() => router.push('/loan-register')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition"
            >
              Apply for Loan
            </button>
          </div>
        </div>
        <UserFooter />
      </ProtectedRoute>
    );
  }

  // 🔄 STEP 2–10: Incomplete loan registration – show progress + continue button
  if (user.step > 1 && user.step < 11) {
    const progress = Math.round((user.step / 11) * 100);

    return (
      <ProtectedRoute>
        <Header user={user} onLogout={handleLogout} onClientHistory={handleClientHistory} />
        <div className="pt-28 px-4">
          <ProfileCard user={user} />
          <div className="max-w-xl mx-auto mt-6 text-center bg-white p-6 rounded-xl shadow border border-purple-100">
            <p className="text-slate-700 font-medium mb-4">You're almost there!</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-600 font-semibold mb-4">{progress}% Complete</p>
            <button
              onClick={() => router.push('/loan-register')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition"
            >
              Continue Registration
            </button>
          </div>
        </div>
        <UserFooter />
      </ProtectedRoute>
    );
  }

  // 🎉 STEP 11: Fully completed
  return (
    <ProtectedRoute>
      {showProfileLoading && <ProfileLoadingOverlay onComplete={handleProfileLoadingComplete} />}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <BackgroundElements />

        <Header user={user} onLogout={handleLogout} onClientHistory={handleClientHistory} />

        <div className="pt-28 px-3 md:px-8 lg:px-12 py-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProfileCard user={user} />
              <VerificationComponent />
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <InformationCards user={user} />
                <ReviewSection />
                <AppDownloadSection />
              </div>
            </div>
          </div>
        </div>

        <UserFooter />

        <CongratulationsModal
          show={showCongratulationsModal}
          onClose={() => setShowCongratulationsModal(false)}
          userName={user?.fname || 'User'}
        />
      </div>
    </ProtectedRoute>
  );
}
