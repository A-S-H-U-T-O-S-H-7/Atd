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
import LoanButtons from './LoanButtons';

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


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Verification */}
            <div className="lg:col-span-1">
              <ProfileCard user={user} loanStatus={currentStatus} />
              <InformationCards user={user} />
              <LoanButtons loanStatus={currentStatus} />

            </div>
            
            {/* Right Column - Information & Features */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                        <LoanStatusTracker loanStatus={currentStatus} />

              <VerificationComponent loanStatus={currentStatus} />
              
              </div>
            </div>

          </div>

          {/* Credit Score & Information Section */}
         <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CreditScoreSection creditScore={user?.creditScore || 750} />
            <UserInfoSection user={user} />

          </section>

          {/* Review & App Download Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReviewSection />
            <AppDownloadSection />
          </section>
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




// // components/Web/profile/steps/StepCompleteProfile.jsx
// 'use client';

// import { useEffect, useState } from 'react';
// import confetti from 'canvas-confetti';

// // Components
// import Header from './Header';
// import ProfileCard from './ProfileCard';
// import InformationCards from './InformationCard';
// import CongratulationsModal from './CongratulationsModal';
// import BackgroundElements from './BackgroundElements';
// import ReviewSection from './ReviewSection';
// import AppDownloadSection from './AppDownloadSection';
// import ProtectedRoute from './ProtectRoute';
// import UserFooter from './UserFooter';
// import VerificationComponent from './VerificationComponent';
// import ProfileLoadingOverlay from './LoadingProfile';
// import LoanStatusTracker from './LoanProgressTracker';
// import UserInfoSection from './UserInfo';
// import CreditScoreSection from './CreditScore';

// export default function StepCompleteProfile({ 
//   user, 
//   router, 
//   logout, 
//   showCongratulationsModal, 
//   setShowCongratulationsModal,
//   showProfileLoading,
//   setShowProfileLoading 
// }) {
//   // State for loan status testing
//   const [currentStatus, setCurrentStatus] = useState('applied');

//   // Loan status configuration
//   const LOAN_STATUSES = [
//     { value: 'applied', label: 'Applied Successfully', color: 'blue' },
//     { value: 'inprogress', label: 'In Progress', color: 'yellow' },
//     { value: 'sanctioned_approved', label: 'Sanctioned - Approved', color: 'green' },
//     { value: 'sanctioned_rejected', label: 'Sanctioned - Rejected', color: 'red' },
//     { value: 'disbursed', label: 'Disbursed', color: 'emerald' },
//     { value: 'closed', label: 'Closed', color: 'gray' }
//   ];

//   // Event handlers
//   const handleClientHistory = () => router.push('/client-history');
  
//   const handleLogout = async () => {
//     await logout();
//     router.push('/userlogin');
//   };

//   const handleStatusChange = (status) => {
//     setCurrentStatus(status);
//   };

//   // Confetti animation sequence
//   const triggerCelebration = () => {
//     const confettiOptions = { particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 10001 };
    
//     confetti(confettiOptions);
    
//     setTimeout(() => {
//       confetti({ 
//         ...confettiOptions, 
//         particleCount: 50, 
//         angle: 60, 
//         spread: 55, 
//         origin: { x: 0, y: 0.6 } 
//       });
//     }, 250);
    
//     setTimeout(() => {
//       confetti({ 
//         ...confettiOptions, 
//         particleCount: 50, 
//         angle: 120, 
//         spread: 55, 
//         origin: { x: 1, y: 0.6 } 
//       });
//     }, 400);
//   };

//   const handleProfileLoadingComplete = () => {
//     setShowProfileLoading(false);
    
//     setTimeout(() => {
//       setShowCongratulationsModal(true);
//       triggerCelebration();
//     }, 500);
//   };

//   // Status button styling
//   const getStatusButtonStyles = (status) => {
//     const baseStyles = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105";
//     const isActive = currentStatus === status.value;
    
//     if (isActive) {
//       const colorMap = {
//         blue: 'bg-blue-500 text-white shadow-lg',
//         yellow: 'bg-yellow-500 text-white shadow-lg',
//         green: 'bg-green-500 text-white shadow-lg',
//         red: 'bg-red-500 text-white shadow-lg',
//         emerald: 'bg-emerald-500 text-white shadow-lg',
//         gray: 'bg-gray-500 text-white shadow-lg'
//       };
//       return `${baseStyles} ${colorMap[status.color]}`;
//     }
    
//     return `${baseStyles} bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300`;
//   };

//   return (
//     <ProtectedRoute>
//       {/* Loading Overlay */}
//       {showProfileLoading && (
//         <ProfileLoadingOverlay onComplete={handleProfileLoadingComplete} />
//       )}
      
//       {/* Main Container */}
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
//         <BackgroundElements />

//         {/* Header */}
//         <Header 
//           user={user} 
//           onLogout={handleLogout} 
//           onClientHistory={handleClientHistory} 
//         />
        
//         {/* Main Content */}
//         <main className="pt-28 px-4 md:px-8 lg:px-12 pb-8 relative z-10">
//           {/* Status Testing Section */}
//           <section className="mb-8">
//             <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
//               <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
//                 <span className="bg-blue-100 p-2 rounded-lg mr-3">
//                   <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
//                   </svg>
//                 </span>
//                 Loan Status Testing Panel
//               </h2>
              
//               <p className="text-slate-600 mb-4">Select different loan statuses to preview the interface behavior:</p>
              
//               <div className="flex flex-wrap gap-3">
//                 {LOAN_STATUSES.map(status => (
//                   <button
//                     key={status.value}
//                     onClick={() => handleStatusChange(status.value)}
//                     className={getStatusButtonStyles(status)}
//                     aria-pressed={currentStatus === status.value}
//                   >
//                     {status.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* Profile & Status Section */}
//           <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <ProfileCard user={user} loanStatus={currentStatus} />
//             <LoanStatusTracker loanStatus={currentStatus} />
//           </section>

//           {/* User Info & Verification Section */}
//           <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                         <InformationCards user={user} />

//             <VerificationComponent loanStatus={currentStatus} />
//           </section>

//           

          
//         </main>

//         {/* Footer */}
//         <UserFooter />

//         {/* Congratulations Modal */}
//         <CongratulationsModal
//           show={showCongratulationsModal}
//           onClose={() => setShowCongratulationsModal(false)}
//           userName={user?.fname || 'User'}
//         />
//       </div>
//     </ProtectedRoute>
//   );
// }