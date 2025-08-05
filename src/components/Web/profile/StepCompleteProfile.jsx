// components/Web/profile/steps/StepCompleteProfile.jsx
'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

// Components
import Header from './Header';
import ProfileCard from './ProfileCard';
import InformationCards from './InformationCard';
import CongratulationsModal from './CongratulationsModal';
import BackgroundElements from './BackgroundElements';
import ReviewSection from './ReviewSection';
import AppDownloadSection from './AppDownloadSection';
import ProtectedRoute from './ProtectRoute';
import UserFooter from './UserFooter';
import VerificationComponent from './VerificationComponent';
import ProfileLoadingOverlay from './LoadingProfile';
import LoanStatusTracker from './LoanProgressTracker';
import UserInfoSection from './UserInfo';
import CreditScoreSection from './CreditScore';

export default function StepCompleteProfile({ 
  user, 
  router, 
  logout, 
  showCongratulationsModal, 
  setShowCongratulationsModal,
  showProfileLoading,
  setShowProfileLoading 
}) {
      const [currentStatus, setCurrentStatus] = useState('applied');

      const statuses = [
    { value: 'applied', label: 'Applied Successfully' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'sanctioned_approved', label: 'Sanctioned - Approved' },
    { value: 'sanctioned_rejected', label: 'Sanctioned - Rejected' },
    { value: 'disbursed', label: 'Disbursed' },
    { value: 'closed', label: 'Closed' }
  ];


  
  const handleClientHistory = () => router.push('/client-history');
  
  const handleLogout = async () => {
    await logout();
    router.push('/userlogin');
  };

  const handleProfileLoadingComplete = () => {
    setShowProfileLoading(false);

    setTimeout(() => {
      setShowCongratulationsModal(true);

      // Celebration confetti animation
      confetti({ 
        particleCount: 100, 
        spread: 70, 
        origin: { y: 0.6 }, 
        zIndex: 10001 
      });
      
      setTimeout(() => {
        confetti({ 
          particleCount: 50, 
          angle: 60, 
          spread: 55, 
          origin: { x: 0, y: 0.6 }, 
          zIndex: 10001 
        });
      }, 250);
      
      setTimeout(() => {
        confetti({ 
          particleCount: 50, 
          angle: 120, 
          spread: 55, 
          origin: { x: 1, y: 0.6 }, 
          zIndex: 10001 
        });
      }, 400);
    }, 500);
  };

  return (
    <ProtectedRoute>
      {showProfileLoading && (
        <ProfileLoadingOverlay onComplete={handleProfileLoadingComplete} />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <BackgroundElements />

        <Header 
          user={user} 
          onLogout={handleLogout} 
          onClientHistory={handleClientHistory} 
        />
        
        <div className="pt-28 px-3 md:px-8 lg:px-12 py-6 relative z-10">
          <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Loan Status For Testing</h1>
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <button
                key={status.value}
                onClick={() => setCurrentStatus(status.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  currentStatus === status.value
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
        <LoanStatusTracker loanStatus={currentStatus} />


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Verification */}
            <div className="lg:col-span-1">
              <ProfileCard user={user} loanStatus={currentStatus} />
              <InformationCards user={user} />

            </div>
            
            {/* Right Column - Information & Features */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
              <VerificationComponent loanStatus={currentStatus} />
              <CreditScoreSection creditScore={user?.creditScore || 750} />

                <ReviewSection />
                <UserInfoSection user={user} />
                <AppDownloadSection />
              </div>
            </div>
          </div>
        </div>

        <UserFooter />

        {/* Congratulations Modal */}
        <CongratulationsModal
          show={showCongratulationsModal}
          onClose={() => setShowCongratulationsModal(false)}
          userName={user?.fname || 'User'}
        />
      </div>
    </ProtectedRoute>
  );
}