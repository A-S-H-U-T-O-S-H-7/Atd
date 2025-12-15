import React, { useState, useEffect } from "react";
import { X, Calendar, FileText, User, ChevronDown } from "lucide-react";
import { legalService } from "@/lib/services/LegalService"; 

const CreateNoticeModal = ({ isOpen, onClose, legal, isDark }) => {
  const [formData, setFormData] = useState({
    loanAgreementDate: legal?.loanAgreement || '',
    date: new Date().toISOString().split('T')[0],
    advocateId: "", 
  });

  const [advocates, setAdvocates] = useState([]);
  const [isLoadingAdvocates, setIsLoadingAdvocates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch advocates when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAdvocates();
    }
  }, [isOpen]);

  const fetchAdvocates = async () => {
    try {
      setIsLoadingAdvocates(true);
      const response = await legalService.getAdvocates();
      if (response.success && response.data) {
        setAdvocates(response.data);
      }
    } catch (error) {
      console.error('Error fetching advocates:', error);
    } finally {
      setIsLoadingAdvocates(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.advocateId) {
      alert("Please select an advocate");
      return;
    }

    try {
      setIsSubmitting(true);
      const noticeData = {
        advocate_id: formData.advocateId,
        loan_agreement_date: formData.loanAgreementDate,
        notice_date: formData.date,
      };

      const response = await legalService.createLegalNotice(legal.id, noticeData);
      
      if (response.success) {
        console.log('Notice created successfully:', response.data);
        onClose();
      } else {
        console.error('Failed to create notice:', response.message);
        alert(response.message || "Failed to create notice");
      }
    } catch (error) {
      console.error('Error creating notice:', error);
      alert(error.message || "Failed to create notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative z-10 w-full max-w-md mx-4 rounded-xl shadow-2xl ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              Create Notice For {legal?.customerName}
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

        {/* Form */}
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

          {/* Notice Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Notice Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Advocate Dropdown */}
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
                    ? "bg-gray-700 border-gray-600 text-gray-100 disabled:bg-gray-800/60 disabled:text-gray-400"
                    : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                } ${isLoadingAdvocates ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <option value="">Select an advocate...</option>
                {advocates.map((advocate) => (
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
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoticeModal;