'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

// Components
import Header from './Header';
import ProfileCard from './ProfileCard';
import CongratulationsModal from './CongratulationsModal';
import BackgroundElements from './BackgroundElements';
import ReviewSection from './ReviewSection';
import AppDownloadSection from './AppDownloadSection';
import ProtectedRoute from './ProtectRoute';
import UserFooter from './UserFooter';
import VerificationComponent from './verificationComponents/VerificationComponent';
import ProfileLoadingOverlay from './LoadingProfile';
import LoanStatusTracker from './LoanProgressTracker';

import CreditScoreSection from './CreditScore';
import LoanButtons from './LoanButtons';
import ReferBlock from './ReferBlock';
import LoanInformation from './LoanHistoryInformation';
import LoanApplicationModal from './LoanApplicationModal';
import PaymentModal from './PaymentModal';
import { TokenManager } from '@/utils/tokenManager';
import toast from 'react-hot-toast';


export default function StepCompleteProfile({ 
  user, 
  router, 
  logout, 
  showCongratulationsModal, 
  setShowCongratulationsModal,
  showProfileLoading,
  setShowProfileLoading 
}) {

    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  // Loan status mapping
  const LOAN_STATUS = {
    APPLIED: 2,
    REJECTED: 3,
    SANCTIONED: 6,
    SANCTIONED: 7, 
    DISBURSED: 9,
    DISBURSED: 11,
    DISBURSED: 12,
    CLOSED: 13,
    IN_PROCESS: 5
  };

  const getLoanStatusLabel = (statusCode) => {
    switch (parseInt(statusCode)) {
      case LOAN_STATUS.APPLIED:
        return 'applied';
      case LOAN_STATUS.REJECTED:
        return 'rejected';
      case LOAN_STATUS.SANCTIONED:
        return 'sanctioned';
      case LOAN_STATUS.DISBURSED:
        return 'disbursed';
      case LOAN_STATUS.CLOSED:
        return 'closed';
      case LOAN_STATUS.IN_PROCESS:
        return 'inprogress';
      default:
        return 'applied';
    }
  };

  // Get loan status from user object
  const userLoanStatus = user?.loan_status || LOAN_STATUS.APPLIED;
  const [currentStatus, setCurrentStatus] = useState(userLoanStatus);

  // Status options for testing
  const statusOptions = [
    { value: LOAN_STATUS.APPLIED, label: 'Applied Successfully' },
    { value: LOAN_STATUS.IN_PROCESS, label: 'In Progress' },
    { value: LOAN_STATUS.SANCTIONED, label: 'Sanctioned' },
    { value: LOAN_STATUS.REJECTED, label: 'Rejected' },
    { value: LOAN_STATUS.DISBURSED, label: 'Disbursed' },
    { value: LOAN_STATUS.CLOSED, label: 'Closed' }
  ];

  // Get current status label
  const currentStatusLabel = getLoanStatusLabel(currentStatus);
  
  const handleClientHistory = () => router.push('/client-history');
  const handleLoanApplicationSuccess = () => {
    toast.success('Loan application submitted successfully!');
  };
   const handleApplyNewLoan = () => {
    setIsLoanModalOpen(true);
  };

  const handlePayNow = () => {
    setIsPaymentModalOpen(true);
  };
  
  const handleLogout = async () => {
    TokenManager.clearAllTokens();
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
          {/* Testing Section - Remove in production */}
          {/* <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Loan Status For Testing</h1>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
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
          </div> */}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProfileCard user={user} loanStatus={currentStatusLabel} />
             <LoanButtons 
                loanStatus={currentStatus} 
                onApplyNewLoan={handleApplyNewLoan}
                onPayNow={handlePayNow} 
              /> 
              {/* ReviewSection - Only visible on lg screens and above */}
              <div className="hidden lg:block">
                <ReviewSection />
              </div>
            </div>
            
            {/* Right Column - Information & Features */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <LoanStatusTracker loanStatus={currentStatus} />

                {currentStatusLabel !== 'disbursed' && currentStatusLabel !== 'closed' && currentStatusLabel !== 'rejected' && (
                  <VerificationComponent loanStatus={currentStatus} user={user} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-pink-200 rounded-xl bg-gradient-to-br from-rose-100 via-teal-50 to-cyan-200 px-4 py-4">
                  <LoanInformation user={user}/>
                  <div className='border rounded-full overflow-hidden mt-2 border-rose-300'>
                    <CreditScoreSection 
                      className="rounded-full" 
                      creditScore={user?.cibil_score} 
                      imageWidth={150} 
                      imageHeight={250} 
                      cibilScoreReport={user?.cibil_score_report}
                    />
                  </div>
                </div>


                {currentStatusLabel !== 'applied' && currentStatusLabel !== 'inprogress' && currentStatusLabel !== 'sanctioned' && (
                  <ReferBlock user={user} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ReviewSection - Only visible on screens smaller than lg */}
        <div className='px-4 md:px-8 pb-5'>
          <div className="block pb-5 lg:hidden">
            <ReviewSection />
          </div>

          <AppDownloadSection />
        </div>

        <UserFooter />

        {/* Congratulations Modal */}
        <CongratulationsModal
          show={showCongratulationsModal}
          onClose={() => setShowCongratulationsModal(false)}
          userName={user?.fname || 'User'}
        />
        <LoanApplicationModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        onSuccess={handleLoanApplicationSuccess}
        userId={user?.user_id}
      />

      <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          applicationId={user?.application_id}
          router={router}
        />
      </div>

    </ProtectedRoute> 
  );
}