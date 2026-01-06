import React, { useState } from "react";
import { X, Scale, Building, User, Calendar, FileText } from "lucide-react";

const CreateCriminalCaseModal = ({ isOpen, onClose, legal, isDark }) => {
  const [formData, setFormData] = useState({
    criminalComplaintNo: '',
    policeStation: legal?.policeStation || '',
    boardResolutionDate: legal?.boardResolution || '',
    loanAgreementDate: legal?.loanAgreement || '',
    loanApplicationDate: legal?.loanApplication || '',
    legalNoticeSentDate: '',
    courtName: '',
    courtAdvocate: '',
    authorisedRepresentative: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Criminal Case Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  // Dropdown options
  const courtOptions = [
    "Select Court",
    "District Court Delhi",
    "High Court Delhi",
    "Metropolitan Magistrate Court",
    "Session Court",
    "Supreme Court"
  ];

  const advocateOptions = [
    "Select Advocate",
    "Advocate Sharma",
    "Advocate Verma", 
    "Advocate Singh",
    "Advocate Gupta",
    "Advocate Patel"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative z-10 w-full max-w-2xl mx-4 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scale className={`w-6 h-6 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`} />
              <h3 className={`text-lg font-semibold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                Create Criminal Case Of {legal?.customerName}
              </h3>
            </div>
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

        {/* Form - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Criminal Complaint No and Police Station in same row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Criminal Complaint No */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Criminal Complaint No.:
                </label>
                <input
                  type="text"
                  value={formData.criminalComplaintNo}
                  onChange={(e) => handleInputChange('criminalComplaintNo', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                  placeholder="Enter complaint number"
                />
              </div>

              {/* Police Station */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Police Station:
                </label>
                <input
                  type="text"
                  value={formData.policeStation}
                  onChange={(e) => handleInputChange('policeStation', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                  placeholder="Enter police station"
                />
              </div>
            </div>

            {/* Date Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Board Resolution Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Board Resolution Date:
                </label>
                <input
                  type="date"
                  value={formData.boardResolutionDate}
                  onChange={(e) => handleInputChange('boardResolutionDate', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                />
              </div>

              {/* Loan Agreement Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Loan Agreement Date:
                </label>
                <input
                  type="date"
                  value={formData.loanAgreementDate}
                  onChange={(e) => handleInputChange('loanAgreementDate', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Loan Application Date and Legal Notice Sent Date in same row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Loan Application Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Loan Application Date:
                </label>
                <input
                  type="date"
                  value={formData.loanApplicationDate}
                  onChange={(e) => handleInputChange('loanApplicationDate', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                />
              </div>

              {/* Legal Notice Sent Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Legal Notice Sent Date:
                </label>
                <input
                  type="date"
                  value={formData.legalNoticeSentDate}
                  onChange={(e) => handleInputChange('legalNoticeSentDate', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Dropdown Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Court Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Court Name:
                </label>
                <select
                  value={formData.courtName}
                  onChange={(e) => handleInputChange('courtName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                >
                  {courtOptions.map((option, index) => (
                    <option 
                      key={index} 
                      value={index === 0 ? '' : option}
                      disabled={index === 0}
                      className={isDark ? "bg-gray-700" : "bg-white"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Court Advocate */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Court Advocate:
                </label>
                <select
                  value={formData.courtAdvocate}
                  onChange={(e) => handleInputChange('courtAdvocate', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                >
                  {advocateOptions.map((option, index) => (
                    <option 
                      key={index} 
                      value={index === 0 ? '' : option}
                      disabled={index === 0}
                      className={isDark ? "bg-gray-700" : "bg-white"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Authorised Representative and Petition Date in same row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Authorised Representative */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Authorised Representative:
                </label>
                <input
                  type="text"
                  value={formData.authorisedRepresentative}
                  onChange={(e) => handleInputChange('authorisedRepresentative', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                  placeholder="Authorised Representative"
                />
              </div>

              {/* Petition Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Petition Date:
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } focus:outline-none`}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer with Submit Button */}
        <div className={`px-6 py-4 border-t flex justify-end ${
          isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50/50"
        }`}>
          <button
            onClick={handleSubmit}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
              isDark
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/50"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Submit</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCriminalCaseModal;