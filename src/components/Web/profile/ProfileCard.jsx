import { useState, useEffect } from 'react';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';
import { User, Phone, Mail, Star, Edit3, Verified, Info } from 'lucide-react';

export default function ProfileCard({ user, loanStatus = 'applied' }) {
  const [imageError, setImageError] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const userStep = user?.step || 1;

  // Restore original Firebase functionality
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

  // Check if Pay Now button should be enabled
  const isPayNowEnabled = loanStatus === 'disbursed';
  
  // Check if Apply for New Loan button should be enabled
  const isNewLoanEnabled = loanStatus === 'closed';

  // Tooltip component
  const Tooltip = ({ children, text, show }) => (
    <div className="relative group">
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-dashed border-purple-300 py-6 px-4 md:p-6 text-center">
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          {loadingImage ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          ) : profileImageUrl && !imageError ? (
            <img 
              src={profileImageUrl} 
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <User className="w-12 h-12 text-blue-400" />
          )}
        </div>

        <button className="absolute bottom-1 -right-1 w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full border-2 border-white flex items-center justify-center transition-colors">
        </button>
      </div>
      
      <h2 className="text-xl font-bold text-slate-800 mb-1">{user?.fname} {user?.lname}</h2>
      <p className="text-slate-500 mb-4">ID: {user?.accountId}</p>
      
      {/* Contact Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-2 py-4 md:p-4 mb-6 border border-blue-200">
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-slate-700">{user?.phone || 'Not provided'}</span>
            {user?.phone_verified === 1 && <Verified className="w-4 h-4 text-green-500" />}
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-purple-500" />
            <span className="font-medium text-slate-700">{user?.email || 'Not provided'}</span>
            {user?.email_verified === 1 && <Verified className="w-4 h-4 text-green-500" />}
          </div>
        </div>
      </div>

      {/* Registration Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Star className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-slate-700">Registration Progress</span>
        </div>
        <div className="text-2xl font-bold text-blue-600 mb-2">{calculateProgress()}%</div>
        <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>

      {calculateProgress() < 100 && (
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl mb-6">
          <Edit3 className="w-4 h-4" />
          <span>Complete Profile</span>
        </button>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center flex-col sm:flex-row gap-4">
        {/* Pay Now Button */}
        <Tooltip 
          text={!isPayNowEnabled ? "Pay Now is available only after loan disbursement" : ""}
          show={!isPayNowEnabled}
        >
          <button 
            className={`flex-1 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 ease-out border ${
              isPayNowEnabled
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl transform hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-700 border-emerald-400/20 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 opacity-60'
            }`}
            disabled={!isPayNowEnabled}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>Pay Now</span>
              {!isPayNowEnabled && <Info className="w-4 h-4" />}
            </div>
          </button>
        </Tooltip>
        
        {/* Apply For New Loan Button */}
        <Tooltip 
          text={!isNewLoanEnabled ? "New loan applications are available only after current loan closure" : ""}
          show={!isNewLoanEnabled}
        >
          <button 
            className={`flex-1 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 ease-out border ${
              isNewLoanEnabled
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl transform hover:-translate-y-0.5 hover:from-blue-600 hover:to-purple-700 border-blue-400/20 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 opacity-60'
            }`}
            disabled={!isNewLoanEnabled}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>Apply For New Loan</span>
              {!isNewLoanEnabled && <Info className="w-4 h-4" />}
            </div>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}