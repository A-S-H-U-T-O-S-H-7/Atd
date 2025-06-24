import React, { useState } from "react";
import { X, Calendar, FileText, User } from "lucide-react";

const CreateNoticeModal = ({ isOpen, onClose, legal, isDark }) => {
  const [formData, setFormData] = useState({
    loanAgreementDate: legal?.loanAgreement || '',
    date: new Date().toISOString().split('T')[0],
    // Add other fields as needed
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    onClose();
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
              Create Notice Of {legal?.customerName}
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
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Loan Agreement Date:
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
              Date:
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

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isDark
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <span>Submit</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoticeModal;