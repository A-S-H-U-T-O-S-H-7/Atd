import React, { useState } from "react";
import { Play, X, Loader } from "lucide-react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

const VideoKYCDocument = ({
  fileName,
  hasDoc,
  onFileView,
  fileLoading,
  loadingFileName,
  isDark
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!fileName || !hasDoc) return;

    try {
      setIsLoading(true);
      
      // Define folder mapping locally
      const folderMappings = {
        'address_proof': 'address',
        'bank_statement': 'bank-statement',
        'aadhar_proof': 'idproof', 
        'pan_proof': 'pan',
        'selfie': 'photo',
        'salary_slip': 'first_salaryslip',
        'second_salary_slip': 'second_salaryslip', 
        'third_salary_slip': 'third_salaryslip',
        'bank_verif_report': 'reports',
        'social_score_report': 'reports',
        'cibil_score_report': 'reports',
        'video_kyc': 'video-kyc', // Add video KYC folder mapping
      };

      // Determine document category from component context
      const documentCategory = 'video_kyc';
      const folder = folderMappings[documentCategory];
      
      if (!folder) {
        console.error('No folder mapping found for:', documentCategory);
        alert('Document type not configured');
        return;
      }
      
      // Construct file path and get download URL
      const filePath = `${folder}/${fileName}`;
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      
      // Open in new tab
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        alert('Popup blocked! Please allow popups for this site.');
      }

      
    } catch (error) {
      console.error("Failed to load file:", error);
      alert(`Failed to load file: ${fileName}. Please check if file exists.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasDoc && fileName) {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
          isLoading 
            ? 'bg-gray-300 text-gray-500 cursor-wait' 
            : 'bg-gradient-to-r from-emerald-100  to-emerald-200 text-green-700'
        }`}
        title={isLoading ? "Loading..." : "View Video KYC"}
      >
        {isLoading ? (
          <Loader size={18} className="flex-shrink-0 animate-spin" />
        ) : (
          <Play size={18} className="flex-shrink-0" />
        )}
      </button>
    );
  }

  return (
    <div className="p-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center cursor-not-allowed" title="Video KYC Missing">
      <Play size={18} className="flex-shrink-0" />
      <span className="text-xs ml-1">✗</span>
    </div>
  );
};

export default VideoKYCDocument;