import React, { useState, useEffect } from "react";
import { X, ChevronDown, Download } from "lucide-react";
import api from "@/utils/axiosInstance";
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

  useEffect(() => {
    if (isOpen) {
      fetchAdvocates();
      
      let formattedLoanDate = '';
      if (legal?.loanAgreementDate && legal.loanAgreementDate !== 'N/A') {
        if (legal.loanAgreementDate.match(/^\d{2}-\d{2}-\d{4}$/)) {
          const parts = legal.loanAgreementDate.split('-');
          formattedLoanDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      
      setFormData({
        loanAgreementDate: formattedLoanDate,
        arbitrationDate: new Date().toISOString().split('T')[0],
        noticeDate: new Date().toISOString().split('T')[0],
        advocateId: "",
      });
    }
  }, [isOpen, legal]);

  const fetchAdvocates = async () => {
    try {
      setIsLoadingAdvocates(true);
      const response = await api.get("/crm/legal/advocate");
      
      if (Array.isArray(response)) {
        setAdvocates(response);
      } else if (response && Array.isArray(response.data)) {
        setAdvocates(response.data);
      } else if (response && response.data && Array.isArray(response.data.advocates)) {
        setAdvocates(response.data.advocates);
      } else if (response && response.success && Array.isArray(response.data)) {
        setAdvocates(response.data);
      } else {
        setAdvocates([]);
      }
    } catch (error) {
      toast.error("Failed to load advocates");
      setAdvocates([]);
    } finally {
      setIsLoadingAdvocates(false);
    }
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const parts = dateString.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    return dateString;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.advocateId) {
      toast.error("Please select an advocate");
      return;
    }

    if (!formData.noticeDate) {
      toast.error("Please select a notice date");
      return;
    }

    // For now, just show a success message since API is not ready
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Arbitration Notice created successfully!");
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to create arbitration notice");
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

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Arbitration Date
            </label>
            <input
              type="date"
              value={formData.arbitrationDate}
              onChange={(e) => setFormData({...formData, arbitrationDate: e.target.value})}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

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
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Arbitration Notice</span>
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