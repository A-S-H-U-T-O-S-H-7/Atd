import React, { useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { Loader } from "lucide-react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

const SanctionLetterDocument = ({
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
      
      let url = fileName;
      
      if (fileName.startsWith('http')) {
        url = fileName.replace(/\\\//g, '/');
      } 
      else {
        const filePath = `sanction-letter/${fileName}`;
        const fileRef = ref(storage, filePath);
        url = await getDownloadURL(fileRef);
      }
      
      // Open in new tab
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        alert('Popup blocked! Please allow popups for this site.');
      }

    } catch (error) {
      console.error("Failed to load sanction letter:", error);
      alert(`Failed to load sanction letter. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // File present - Green theme
  if (hasDoc && fileName) {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isLoading 
            ? 'bg-green-100 border border-green-300 text-green-700 cursor-wait' 
            : 'bg-green-100 hover:bg-green-200 border-2 border-green-300 hover:border-green-400 text-green-800 hover:text-green-900 shadow-sm hover:shadow-md'
        }`}
        title={isLoading ? "Loading..." : "View Sanction Letter PDF"}
      >
        {isLoading ? (
          <Loader size={18} className="flex-shrink-0 animate-spin" />
        ) : (
          <>
            <FaRegFilePdf size={18} className="flex-shrink-0" />
            <span className="text-xs font-bold ml-1 text-green-600">✓</span>
          </>
        )}
      </button>
    );
  }

  // File missing - Red theme
  return (
    <div 
      className="p-2 rounded-lg bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center cursor-not-allowed shadow-sm"
      title="Sanction Letter Missing"
    >
      <FaRegFilePdf size={18} className="flex-shrink-0 opacity-70" />
      <span className="text-xs font-bold ml-1">✗</span>
    </div>
  );
};

export default SanctionLetterDocument;