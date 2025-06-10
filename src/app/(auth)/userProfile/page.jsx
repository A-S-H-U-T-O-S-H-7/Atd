"use client"
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

// Component imports
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

  // Add redirect logic for incomplete registration
useEffect(() => {
  if (user && user.step < 11) {
    router.push('/user_signup');
  }
}, [user, router]);


  useEffect(() => {
    if (user && !isInitialized && !congratulationsTriggered) {
      setIsInitialized(true);
      
      try {
        const showCongratulations = localStorage.getItem('showCongratulations');
        
        if (showCongratulations === 'true') {
          localStorage.removeItem('showCongratulations');
          setCongratulationsTriggered(true);
          setShowProfileLoading(true);
          
          // setTimeout(() => {
          //   setShowCongratulationsModal(true);
            
          //   confetti({
          //     particleCount: 100,
          //     spread: 70,
          //     origin: { y: 0.6 },
          //     zIndex: 10001
          //   });
            
          //   // Multiple bursts for better effect
          //   setTimeout(() => {
          //     confetti({
          //       particleCount: 50,
          //       angle: 60,
          //       spread: 55,
          //       origin: { x: 0, y: 0.6 },
          //       zIndex: 10001
          //     });
          //   }, 250);
            
          //   setTimeout(() => {
          //     confetti({
          //       particleCount: 50,
          //       angle: 120,
          //       spread: 55,
          //       origin: { x: 1, y: 0.6 },
          //       zIndex: 10001
          //     });
          //   }, 400);
          // }, 500);
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
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 10001
      });
      
      // Multiple bursts for better effect
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
  // Handle client history navigation
  const handleClientHistory = () => {
    router.push('/client-history');
  };

  // Handle retry when there's an error
  const handleRetryLoading = () => {
    fetchUserData();
  };

  // Handle logout
  const handleLogout = async () => {
    await logout(); 
    router.push('/userlogin');
  };

  if (loading || !user) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
            <LoadingSpinner />
        </div>
    );
}
// if (!user && !loading) {
//   return (
//     <ErrorState onRetry={handleRetryLoading} />
//   );

// }

  return (
    <ProtectedRoute>
      {showProfileLoading && (
      <ProfileLoadingOverlay onComplete={handleProfileLoadingComplete} />
    )}
      <div className="min-h-screen bg-gradient-to-br from-slate-50  via-blue-50 to-indigo-50 relative overflow-hidden">
        <BackgroundElements />
        
        <Header 
          user={user}
          onLogout={handleLogout}
          onClientHistory={handleClientHistory}
        />

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