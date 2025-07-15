import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Eye, Download, X } from 'lucide-react';
import { useAdminAuth } from '@/lib/AdminAuthContext';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const { isDark } = useAdminAuth();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border-2 flex items-center space-x-3 max-w-md transform transition-all duration-300 ${
      type === 'success' 
        ? isDark 
          ? 'bg-green-800 border-green-600 text-green-100'
          : 'bg-green-50 border-green-200 text-green-800'
        : isDark
          ? 'bg-red-800 border-red-600 text-red-100'
          : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className={`text-sm font-medium hover:opacity-70 ${
          type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}
      >
        ×
      </button>
    </div>
  );
};

// File Upload Component
const FileUploadField = ({ label, name, document, onFileChange, onFileView, onFileDelete, isDark, isRequired = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(name, e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(name, e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {label}{isRequired && <span className="text-red-500 ml-1">*</span>}:
      </label>
      
      <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
        dragActive 
          ? isDark 
            ? "border-emerald-400 bg-emerald-900/20" 
            : "border-emerald-400 bg-emerald-50"
          : isDark
            ? "border-gray-600 bg-gray-700/30 hover:border-emerald-500"
            : "border-gray-300 bg-gray-50 hover:border-emerald-400"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.mp4,.avi,.mov"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {document?.available || document?.newFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className={`w-8 h-8 ${
                document?.available ? "text-blue-500" : "text-emerald-500"
              }`} />
              <div>
                <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {document?.newFile?.name || document?.fileName || "Unknown file"}
                </p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {document?.available ? "Existing file" : "New file selected"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {document?.available && (
                <button
                  onClick={() => onFileView(name, document)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? "hover:bg-gray-600 text-gray-300" 
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  title="View file"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={openFileDialog}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? "hover:bg-emerald-700 text-emerald-400" 
                    : "hover:bg-emerald-100 text-emerald-600"
                }`}
                title="Replace file"
              >
                <Upload className="w-4 h-4" />
              </button>
              
              {document?.newFile && (
                <button
                  onClick={() => onFileDelete(name)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? "hover:bg-red-700 text-red-400" 
                      : "hover:bg-red-100 text-red-600"
                  }`}
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div 
            className="text-center cursor-pointer py-8"
            onClick={openFileDialog}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              isDark ? "text-gray-400" : "text-gray-400"
            }`} />
            <p className={`text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Click to upload or drag and drop
            </p>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              PDF, JPG, PNG, MP4 files supported
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ReplaceKYC = ({ enquiry, onBack }) => {
  const { isDark } = useAdminAuth();
  const [documents, setDocuments] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Initialize documents from enquiry data
  useEffect(() => {
    if (enquiry?.kycDocuments) {
      setDocuments(enquiry.kycDocuments);
    }
  }, [enquiry]);

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Close toast function
  const closeToast = () => {
    setToast(null);
  };

  // Handle file change
  const handleFileChange = (documentName, file) => {
    setDocuments(prev => ({
      ...prev,
      [documentName]: {
        ...prev[documentName],
        newFile: file
      }
    }));
    showToast(`${file.name} selected for upload`, 'success');
  };

  // Handle file view
  const handleFileView = (documentName, document) => {
    // In a real application, this would open the file in a new tab or modal
    showToast(`Viewing ${document.fileName}`, 'success');
  };

  // Handle file delete
  const handleFileDelete = (documentName) => {
    setDocuments(prev => ({
      ...prev,
      [documentName]: {
        ...prev[documentName],
        newFile: null
      }
    }));
    showToast('File removed', 'success');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically upload the files to your server
      const filesToUpload = Object.entries(documents).filter(([_, doc]) => doc.newFile);
      
      if (filesToUpload.length === 0) {
        showToast('No new files to upload', 'error');
        setSubmitting(false);
        return;
      }

      showToast(`Successfully uploaded ${filesToUpload.length} file(s)`, 'success');
      
      // Reset new files after successful upload
      setDocuments(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].newFile) {
            updated[key] = {
              available: true,
              fileName: updated[key].newFile.name,
              newFile: null
            };
          }
        });
        return updated;
      });

      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      showToast('Failed to upload files', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Document fields configuration
  const documentFields = [
    { name: 'photo', label: 'Photo', required: true },
    { name: 'panCard', label: 'PAN Proof', required: true },
    { name: 'addressProof', label: 'Address Proof', required: true },
    { name: 'idProof', label: 'ID Proof', required: true },
    { name: 'salarySlip1', label: '1st Month Salary Slip', required: false },
    { name: 'salarySlip2', label: '2nd Month Salary Slip', required: false },
    { name: 'salarySlip3', label: '3rd Month Salary Slip', required: false },
    { name: 'bankStatement', label: 'Bank Statement', required: false },
    { name: 'bankVerificationReport', label: 'Banking Verification Report', required: false },
    { name: 'camSheet', label: 'CAM Sheet', required: false },
    { name: 'nachForm', label: 'NACH Form', required: false },
    { name: 'socialScoreReport', label: 'Social Score Report', required: false },
    { name: 'cibilScoreReport', label: 'CIBIL Score Report', required: false },
    { name: 'pdc', label: 'PDC', required: false },
    { name: 'agreement', label: 'Agreement', required: false },
    { name: 'video', label: 'Video', required: false }
  ];

  // Check if any files are ready for upload
  const hasFilesToUpload = Object.values(documents).some(doc => doc?.newFile);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-4 md:p-8">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  type="button"
                  onClick={onBack}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                    isDark
                      ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                      : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                  }`}
                >
                  <ArrowLeft className={`w-5 h-5 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </button>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                  } bg-clip-text text-transparent`}>
                    Replace KYC Documents
                  </h1>
                  <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Update documents for {enquiry.name} (CRN: {enquiry.crnNo})
                  </p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!hasFilesToUpload || submitting}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl ${
                  hasFilesToUpload && !submitting
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>{submitting ? 'Uploading...' : 'Upload Files'}</span>
              </button>
            </div>
          </div>

          {/* KYC Documents Form */}
          <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
              : "bg-white border-emerald-300 shadow-emerald-500/10"
          }`}>
            <div className="p-8">
              <div className="mb-6">
                <h2 className={`text-xl font-semibold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  KYC Documents
                </h2>
                <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Upload or replace existing KYC documents. Files marked with a blue icon are already available.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {documentFields.map((field) => (
                  <FileUploadField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    document={documents[field.name]}
                    onFileChange={handleFileChange}
                    onFileView={handleFileView}
                    onFileDelete={handleFileDelete}
                    isDark={isDark}
                    isRequired={field.required}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}
      </div>
    </div>
  );
};

export default ReplaceKYC;