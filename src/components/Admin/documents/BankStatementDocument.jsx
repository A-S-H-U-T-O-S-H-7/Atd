import React, { useState } from "react";
import { FileText, Loader } from "lucide-react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

const BankStatementDocument = ({ fileName, hasDoc, onFileView }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!fileName || !hasDoc) return;

    try {
      setIsLoading(true);
      
      // Define folder mapping
      const folderMappings = { 
        'bank_statement': 'bank-statement',
        'aadhar_proof': 'idproof', 
        'address_proof': 'address',
        'pan_proof': 'pan',
        'selfie': 'photo',
        'salary_slip': 'first_salaryslip',
        'second_salary_slip': 'second_salaryslip', 
        'third_salary_slip': 'third_salaryslip',
        'bank_verif_report': 'reports',
        'social_score_report': 'reports',
        'cibil_score_report': 'reports',
      };

      const documentCategory = 'bank_statement';
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
      
      
      
      if (typeof onFileView === 'function') {
        onFileView(fileName, documentCategory);
      }

    } catch (error) {
      console.error("Failed to load bank statement:", error);
      alert(`Failed to load bank statement: ${fileName}. Please check if file exists in bank-statement folder.`);
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
            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
        }`}
        title={isLoading ? "Loading..." : "View Bank Statement"}
      >
        {isLoading ? (
          <Loader size={18} className="flex-shrink-0 animate-spin" />
        ) : (
          <FileText size={18} className="flex-shrink-0" />
        )}
      </button>
    );
  }

  return (
    <div className="p-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center cursor-not-allowed" title="Bank Statement Missing">
      <FileText size={18} className="flex-shrink-0" />
      <span className="text-xs ml-1">✗</span>
    </div>
  );
};

export default BankStatementDocument;