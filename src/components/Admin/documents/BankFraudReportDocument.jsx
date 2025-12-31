import React, { useState } from "react";
import { FileText, Loader, X } from "lucide-react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

const BankFraudReportDocument = ({ 
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
      
      const folderMappings = {
        'second_bank_statement': 'bank-statement',
        'bank_fraud_report': 'reports',
      };

      const documentCategory = 'bank_fraud_report';
      const folder = folderMappings[documentCategory];
      
      if (!folder) {
        console.error('No folder mapping found for:', documentCategory);
        alert('Document type not configured');
        return;
      }
      
      const filePath = `${folder}/${fileName}`;
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      
    //   const newWindow = window.open(url, '_blank');
    //   if (!newWindow) {
    //     alert('Popup blocked! Please allow popups for this site.');
    //   }

      if (typeof onFileView === 'function') {
        onFileView(fileName, documentCategory);
      }

    } catch (error) {
      console.error("Failed to load file:", error);
      alert(`Failed to load file: ${fileName}. Please check if file exists.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasDoc && fileName) {
    const isCurrentlyLoading = fileLoading && loadingFileName === fileName;
    
    return (
      <button
        onClick={handleClick}
        disabled={isLoading || isCurrentlyLoading}
        className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
          isLoading || isCurrentlyLoading
            ? 'bg-gray-300 text-gray-500 cursor-wait' 
            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
        }`}
        title={isLoading || isCurrentlyLoading ? "Loading..." : "View Bank Fraud Report"}
      >
        {isLoading || isCurrentlyLoading ? (
          <Loader size={18} className="flex-shrink-0 animate-spin" />
        ) : (
          <FileText size={18} className="flex-shrink-0" />
        )}
      </button>
    );
  }
 
  return (
    <div className="p-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center cursor-not-allowed" title="Bank Fraud Report Missing">
      <FileText size={18} className="flex-shrink-0" />
      <span className="text-xs ml-1">✗</span>
    </div>
  );
};

export default BankFraudReportDocument;