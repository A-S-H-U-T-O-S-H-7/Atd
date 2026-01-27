import React from 'react';
import { useDocuments } from '@/hooks/useKycDocuments';
import { useFileUpload } from '@/hooks/useKycFileUpload';
import Header from './Header';
import DocumentGrid from './DocumentGrid';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore'; 

const ReplaceKYC = ({ enquiry, onBack }) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const { documents, updateDocument, removeNewFile, resetNewFiles } = useDocuments(enquiry);
  const { handleSubmit, submitting } = useFileUpload(documents, resetNewFiles, onBack, enquiry);

  const hasFilesToUpload = Object.values(documents).some(doc => doc?.newFile);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}> 
      <div className="p-4 md:p-8">
        <form onSubmit={handleSubmit}>
          <Header 
            enquiry={enquiry}
            onBack={onBack}
            hasFilesToUpload={hasFilesToUpload}
            submitting={submitting}
            isDark={isDark}
          />
          
          <DocumentGrid 
            documents={documents}
            onFileChange={updateDocument}
            onFileRemove={removeNewFile}
            isDark={isDark}
          />
        </form>
      </div>
      
      {/* Global Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#f3f4f6' : '#1f2937',
            border: `2px solid ${isDark ? '#059669' : '#10b981'}`,
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
          loading: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
};

export default ReplaceKYC;