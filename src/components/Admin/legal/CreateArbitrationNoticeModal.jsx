import React, { useState, useEffect } from "react";
import { X, ChevronDown, Download } from "lucide-react";
import { legalService } from "@/lib/services/LegalService";
import toast from "react-hot-toast";

const CreateArbitrationNoticeModal = ({ isOpen, onClose, legal, isDark, onSuccess }) => {
  const [formData, setFormData] = useState({
    loanAgreementDate: '',
    arbitrationDate: new Date().toISOString().split('T')[0],
    noticeDate: new Date().toISOString().split('T')[0],
    advocateId: "",
  });

  const [advocates, setAdvocates] = useState([]);
  const [isLoadingAdvocates, setIsLoadingAdvocates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAdvocates();
      
      // Format dates from legal data
      const formatDateForInput = (dateString) => {
        if (!dateString || dateString === 'N/A') return '';
        
        try {
          if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const parts = dateString.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };
      
      setFormData({
        loanAgreementDate: formatDateForInput(legal?.loanAgreementDate),
        arbitrationDate: new Date().toISOString().split('T')[0],
        noticeDate: new Date().toISOString().split('T')[0],
        advocateId: "",
      });
      setDownloadStatus(null);
    }
  }, [isOpen, legal]);

  const fetchAdvocates = async () => {
    try {
      setIsLoadingAdvocates(true);
      const response = await legalService.getAdvocates();
      
      // Handle different response formats
      let advocatesData = [];
      if (Array.isArray(response)) {
        advocatesData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        advocatesData = response.data;
      } else if (response?.data?.advocates && Array.isArray(response.data.advocates)) {
        advocatesData = response.data.advocates;
      } else if (response?.success && Array.isArray(response.data)) {
        advocatesData = response.data;
      }
      
      setAdvocates(advocatesData);
    } catch (error) {
      toast.error("Failed to load advocates");
      setAdvocates([]);
    } finally {
      setIsLoadingAdvocates(false);
    }
  };

  const handleDownloadFile = (blob, fileName) => {
    try {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      return true;
    } catch (error) {
      // Fallback method for stubborn browsers
      try {
        const reader = new FileReader();
        reader.onload = function(e) {
          const link = document.createElement('a');
          link.href = e.target.result;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          
          setTimeout(() => {
            document.body.removeChild(link);
          }, 100);
        };
        reader.readAsDataURL(blob);
        return true;
      } catch {
        return false;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.advocateId) {
      toast.error("Please select an advocate");
      return;
    }

    if (!formData.noticeDate) {
      toast.error("Please select a notice date");
      return;
    }

    if (!formData.arbitrationDate) {
      toast.error("Please select an arbitration date");
      return;
    }

    if (!legal?.id) {
      toast.error("Invalid legal case");
      return;
    }

    setIsSubmitting(true);
    setDownloadStatus(null);
    
    try {
      // Prepare data for API
      const noticeData = {
        advocate_id: parseInt(formData.advocateId),
        loan_agreement_date: formData.loanAgreementDate || null,
        notice_date: formData.noticeDate,
        arbitration_date: formData.arbitrationDate,
      };

      // Call the arbitration notice API
      const response = await legalService.createArbitrationNotice(legal.id, noticeData);

      if (response instanceof Blob) {
        const customerName = legal.customerName || 'arbitration-notice';
        const safeCustomerName = customerName.replace(/[^a-zA-Z0-9-_]/g, '_');
        const fileName = `Arbitration_Notice_${safeCustomerName}_${formData.noticeDate}.doc`;
        
        const downloadSuccess = handleDownloadFile(response, fileName);
        
        if (downloadSuccess) {
          setDownloadStatus('success');
          toast.success(
            <div>
              <div className="font-semibold">Arbitration Notice Downloaded!</div>
              <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                File saved as: {fileName}
              </div>
            </div>,
            { duration: 3000 }
          );
        } else {
          setDownloadStatus('failed');
          toast.error("Failed to download file");
        }
      } else {
        // Response is JSON
        if (response.success) {
          toast.success(response.message || "Arbitration Notice created successfully!");
        } else {
          toast.error(response.message || "Failed to create arbitration notice");
        }
      }
      
      if (onSuccess) onSuccess();
      
      // Close modal after a brief delay to show feedback
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      setDownloadStatus('error');
      
      // Handle blob errors that might actually be successful downloads
      if (error.response && error.response instanceof Blob) {
        try {
          const customerName = legal.customerName || 'arbitration-notice';
          const safeCustomerName = customerName.replace(/[^a-zA-Z0-9-_]/g, '_');
          const fileName = `Arbitration_Notice_${safeCustomerName}_${formData.noticeDate}.doc`;
          
          const downloadSuccess = handleDownloadFile(error.response, fileName);
          
          if (downloadSuccess) {
            toast.success("Arbitration Notice downloaded successfully!");
            if (onSuccess) onSuccess();
            onClose();
            return;
          }
        } catch {
          // Continue to error handling
        }
      }
      
      const errorMsg = error.response?.data?.message || error.message || "Failed to create arbitration notice";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative z-10 w-full max-w-md mx-4 rounded-xl shadow-2xl ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        <div className={`px-6 py-4 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              Create Arbitration Notice For {legal?.customerName}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Loan Agreement Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Loan Agreement Date
            </label>
            <input
              type="date"
              value={formData.loanAgreementDate}
              onChange={(e) => setFormData({...formData, loanAgreementDate: e.target.value})}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Arbitration Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Arbitration Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.arbitrationDate}
              onChange={(e) => setFormData({...formData, arbitrationDate: e.target.value})}
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Notice Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Notice Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.noticeDate}
              onChange={(e) => setFormData({...formData, noticeDate: e.target.value})}
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Advocate Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Select Advocate <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.advocateId}
                onChange={(e) => setFormData({...formData, advocateId: e.target.value})}
                required
                disabled={isLoadingAdvocates}
                className={`w-full px-3 py-2.5 rounded-lg border appearance-none ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-gray-100 disabled:bg-gray-800/60"
                    : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100"
                } ${isLoadingAdvocates ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <option value="">Select an advocate...</option>
                {Array.isArray(advocates) && advocates.map((advocate) => (
                  <option key={advocate.id} value={advocate.id}>
                    {advocate.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className={`w-4 h-4 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`} />
              </div>
            </div>
            {isLoadingAdvocates && (
              <p className={`text-xs mt-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Loading advocates...
              </p>
            )}
          </div>

          {/* Download Status Indicator */}
          {downloadStatus && (
            <div className={`p-3 rounded-lg transition-all duration-300 ${
              downloadStatus === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800'
                : downloadStatus === 'failed'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {downloadStatus === 'success' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Download Complete</span>
                  </>
                ) : downloadStatus === 'failed' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm font-medium">Download Issue</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Error Occurred</span>
                  </>
                )}
              </div>
              <p className="text-xs mt-1">
                {downloadStatus === 'success'
                  ? 'Check your downloads folder for the file'
                  : downloadStatus === 'failed'
                  ? 'File created but may not have downloaded'
                  : 'Please try again or contact support'
                }
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.advocateId}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isSubmitting || !formData.advocateId
                  ? isDark
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isDark
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Create & Download Notice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArbitrationNoticeModal;