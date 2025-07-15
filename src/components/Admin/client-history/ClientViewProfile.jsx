import React, { useState, useEffect } from "react";
import { User, MapPin, Phone, Mail, Calendar, Users } from "lucide-react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

const ClientProfile = ({ clientData, isDark }) => {
  const [imageError, setImageError] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (clientData.selfie && !imageError) {
        setLoadingImage(true);
        try {
          const fileRef = ref(storage, `photo/${clientData.selfie}`); 
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
  }, [clientData.selfie, imageError]);

  const formatPhone = (phone) => {
    if (!phone) return "Not Available";
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  return (
    <div className={`rounded-xl border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/30"
        : "bg-white border-emerald-200"
    }`}>
      <div className={`px-6  py-4 border-b ${
        isDark
          ? "bg-cyan-700 border-emerald-600/30"
          : "bg-emerald-50 border-emerald-200"
      }`}>
        <div className="flex  items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Profile
            </h3>
          </div>
          
          {/* Profile Picture */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {loadingImage ? (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isDark ? "bg-gray-600" : "bg-gray-200"
                }`}>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                </div>
              ) : profileImageUrl && !imageError ? (
                <img
                  src={profileImageUrl}
                  alt={`${clientData.name}'s profile`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isDark ? "bg-gray-600" : "bg-gray-200"
                }`}>
                  <User className={`w-8 h-8 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`} />
                </div>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {clientData.name}
              </p>
              <p className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Client ID: {clientData.id || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-blue-600/20" : "bg-blue-100"
              }`}>
                <User className={`w-4 h-4 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Name
                </p>
                <p className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {clientData.name}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-green-600/20" : "bg-green-100"
              }`}>
                <MapPin className={`w-4 h-4 ${
                  isDark ? "text-green-400" : "text-green-600"
                }`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Location
                </p>
                <p className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {clientData.location || "Sector 71 Mohali, VTC: S.A.S.Nagar (Mohali), PO: Sector 71, Sub District: S.A.S.Nagar (mohali)"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-purple-600/20" : "bg-purple-100"
              }`}>
                <Calendar className={`w-4 h-4 ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Date of Birth
                </p>
                <p className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {clientData.dob || "25-2-1993"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-orange-600/20" : "bg-orange-100"
              }`}>
                <Phone className={`w-4 h-4 ${
                  isDark ? "text-orange-400" : "text-orange-600"
                }`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Phone
                </p>
                <p className={`text-sm font-mono ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {formatPhone(clientData.phone)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-red-600/20" : "bg-red-100"
              }`}>
                <Mail className={`w-4 h-4 ${
                  isDark ? "text-red-400" : "text-red-600"
                }`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Email
                </p>
                <p className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {clientData.email}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-teal-600/20" : "bg-teal-100"
              }`}>
                <Users className={`w-4 h-4 ${
                  isDark ? "text-teal-400" : "text-teal-600"
                }`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Gender
                </p>
                <p className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {clientData.gender || "Male"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;