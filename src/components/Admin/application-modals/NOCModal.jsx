"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, FileText, Calendar, Download } from "lucide-react";
import { manageApplicationService } from "@/lib/services/ManageApplicationServices";
import toast from "react-hot-toast";

const NOCModal = ({ 
  isOpen, 
  onClose, 
  isDark, 
  customerName, 
  loanNo,
  applicationId 
}) => {
  const [nocDate, setNocDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);
  
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !isSubmitting) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
      const today = new Date().toISOString().split('T')[0];
      setNocDate(today);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  const handleSubmit = async () => {
    if (!nocDate) {
      toast.error("Please select NOC date");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await manageApplicationService.createNOC(applicationId, {
        noc_issued: "issued",
        noc_date: nocDate
      });

      if (response.success) {
        setGeneratedFile(response.data);
        
        toast.success('NOC generated successfully!');
        
        // Auto-download the file
        handleDownload(response.data);
      } else {
        throw new Error(response.message || "Failed to generate NOC");
      }
    } catch (error) {
      console.error("Error generating NOC:", error);
      toast.error('Failed to generate NOC. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (fileData) => {
    if (!fileData || !fileData.base64) {
      toast.error('No file available for download');
      return;
    }

    try {
      // Decode base64 to binary
      const binaryString = atob(fileData.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create blob and download
      const blob = new Blob([bytes], { type: fileData.mime_type || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.file_name || `NOC_${loanNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('NOC downloaded successfully!');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download NOC file');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNocDate("");
      setGeneratedFile(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <div 
        ref={modalRef}
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border-2 ${
          isDark 
            ? "bg-gray-800 border-emerald-600/50" 
            : "bg-white border-emerald-300"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? "border-emerald-600/30" : "border-emerald-200"
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? "bg-emerald-900/30" : "bg-emerald-100"
            }`}>
              <FileText className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Generate NOC
              </h2>
              <p className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Create NOC for {customerName} (Loan: {loanNo})
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className={`p-2 rounded-lg transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDark 
                ? "hover:bg-gray-700 text-gray-400 hover:text-white" 
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                NOC Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
                <input
                  type="date"
                  value={nocDate}
                  onChange={(e) => !isSubmitting && setNocDate(e.target.value)}
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>
            </div>

            {/* Generated File Info */}
            {generatedFile && (
              <div className={`p-4 rounded-lg ${
                isDark ? "bg-emerald-900/20 border border-emerald-700/30" : "bg-emerald-50 border border-emerald-200"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className={`w-5 h-5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDark ? "text-emerald-300" : "text-emerald-700"
                    }`}>
                      {generatedFile.file_name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownload(generatedFile)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "hover:bg-emerald-800 text-emerald-400 hover:text-emerald-300"
                        : "hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700"
                    }`}
                    title="Download NOC"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !nocDate}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isSubmitting || !nocDate
                    ? 'opacity-50 cursor-not-allowed'
                    : 'shadow-lg hover:shadow-xl transform hover:scale-105'
                } ${
                  isDark
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Generate NOC</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NOCModal;