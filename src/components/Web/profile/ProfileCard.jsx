import { useState, useEffect } from 'react';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';
import { User, AlertTriangle, Info, Hash } from 'lucide-react';
import { MdVerified } from 'react-icons/md';

export default function ProfileCard({ user, loanStatus = 'applied' }) {
  const [imageError, setImageError] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const userStep = user?.step || 1;

  // Firebase image loading
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user.selfie && !imageError) {
        setLoadingImage(true);
        try {
          const fileRef = ref(storage, `photo/${user.selfie}`); 
          const url = await getDownloadURL(fileRef);
          setProfileImageUrl(url);
        } catch (error) {
          console.error("Failed to get profile image URL:", error);
          setImageError(true);
        } finally {
          setLoadingImage(false);
        }
      }
    };

    fetchProfileImage();
  }, [user.selfie, imageError]);

  const calculateProgress = () => {
    return Math.round((userStep / 6) * 100);
  };

  const isPayNowEnabled = loanStatus === 'disbursed';
  const isNewLoanEnabled = loanStatus === 'closed';
  const isAccountActivated = user?.accountActivation === 1

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Card */}
<div className={`relative overflow-hidden bg-gradient-to-br from-blue-100 via-white/90 to-blue-200 backdrop-blur-sm rounded-2xl border shadow-xl shadow-slate-200/20 ${
  isAccountActivated ? 'border-emerald-400' : 'border-rose-400'
}`}>        
        {/* Profile Section */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            
            {/* Left: Profile Image and Info */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg ring-2 ring-white/80">
                  {loadingImage ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  ) : profileImageUrl && !imageError ? (
                    <img 
                      src={profileImageUrl} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  )}
                </div>
                
                {/* Status Pulse Dot */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-lg ${
                  isAccountActivated ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                    isAccountActivated ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}></div>
                </div>
              </div>

              {/* Name and CRN */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 truncate">
                  {user?.fname} {user?.lname}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">CRN:</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md truncate">
                    {user?.crnno || 'Not assigned'}
                  </span>
                </div>
                
                {/* Account Status */}
                <div className="mt-2">
                  {isAccountActivated ? (
                    <div className="flex items-center gap-1.5">
                      <MdVerified className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                      <span className="text-xs sm:text-sm font-semibold text-emerald-700">Account Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                      <span className="text-xs sm:text-sm font-semibold text-rose-700">Not Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activation Message for Non-Activated Accounts */}
        {!isAccountActivated && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mb-4 sm:mb-6 lg:mb-8 p-3 sm:p-4 bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-200/60 rounded-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1.5 mt-0.5">
                <Info className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-amber-800">Activation Required</p>
                <p className="text-xs sm:text-sm text-amber-700 mt-1 leading-relaxed">
                  Please verify the link sent to your official email to activate your account
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-300/40 rounded-full"></div>
        <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-indigo-300/40 rounded-full"></div>
        <div className="absolute bottom-6 left-4 w-2 h-2 bg-purple-300/40 rounded-full"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}