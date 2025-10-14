import React, { useState } from "react";
import { FileText, Loader } from "lucide-react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

const SalaryProofDocument = ({ 
  fileName, 
  hasDoc, 
  secondFileName, 
  hasSecondDoc,
  thirdFileName,
  hasThirdDoc,
  onFileView
}) => {
  const [loadingFile, setLoadingFile] = useState(null);

  const handleFileClick = async (file, slipType) => {
    if (!file) return;

    try {
      setLoadingFile(file);
      
      const folderMappings = {
        'salary_slip': 'first_salaryslip',
        'second_salary_slip': 'second_salaryslip', 
        'third_salary_slip': 'third_salaryslip',
      };

      const folder = folderMappings[slipType];
      
      if (!folder) {
        console.error('No folder mapping found for:', slipType);
        alert('Document type not configured');
        return;
      }
      
      const filePath = `${folder}/${file}`;
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      
      // const newWindow = window.open(url, '_blank');
      // if (!newWindow) {
      //   alert('Popup blocked! Please allow popups for this site.');
      // }

      if (typeof onFileView === 'function') {
        onFileView(file, slipType);
      }

    } catch (error) {
      console.error("Failed to load salary slip:", error);
      alert(`Failed to load salary slip: ${file}. Please check if file exists.`);
    } finally {
      setLoadingFile(null);
    }
  };

  const documents = [
    { 
      file: fileName, 
      hasDoc, 
      title: "First Salary Slip", 
      index: 1,
      slipType: 'salary_slip'
    },
    { 
      file: secondFileName, 
      hasDoc: hasSecondDoc, 
      title: "Second Salary Slip", 
      index: 2,
      slipType: 'second_salary_slip'
    },
    { 
      file: thirdFileName, 
      hasDoc: hasThirdDoc, 
      title: "Third Salary Slip", 
      index: 3,
      slipType: 'third_salary_slip'
    }
  ].filter(doc => doc.hasDoc && doc.file);

  if (documents.length === 0) {
    return (
      <div className="p-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center cursor-not-allowed" title="Salary Proof Missing">
        <FileText size={18} className="flex-shrink-0" />
        <span className="text-xs ml-1">✗</span>
      </div>
    );
  }

  return (
    <div className="flex space-x-1 justify-center">
      {documents.map((doc, index) => {
        const isLoading = loadingFile === doc.file;
        return (
          <button
            key={index}
            onClick={() => handleFileClick(doc.file, doc.slipType)}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-wait' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
            title={isLoading ? "Loading..." : `View ${doc.title}`}
          >
            {isLoading ? (
              <Loader size={18} className="flex-shrink-0 animate-spin" />
            ) : (
              <>
                <FileText size={18} className="flex-shrink-0" />
                <span className="text-xs ml-1 font-medium">{doc.index}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SalaryProofDocument;