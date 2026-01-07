import React, { useState } from "react";
import { X, Scale, FileText } from "lucide-react";
import toast from "react-hot-toast";

const CreateArbitrationCriminalModal = ({ isOpen, onClose, legal, isDark }) => {
  const [formData, setFormData] = useState({
    arbitrationComplaintNo: '',
    policeStation: legal?.policeStation || '',
    arbitrationVenue: '',
    arbitratorName: '',
    boardResolutionDate: legal?.boardResolution || '',
    loanAgreementDate: legal?.loanAgreement || '',
    loanApplicationDate: legal?.loanApplication || '',
    arbitrationNoticeDate: '',
    authorisedRepresentative: '',
    arbitrationDate: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call since API is not ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Arbitration Criminal Case created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create arbitration criminal case");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Arbitration venue options
  const venueOptions = [
    "Select Arbitration Venue",
    "Delhi International Arbitration Centre",
    "Mumbai Centre for International Arbitration",
    "Indian Council of Arbitration",
    "International Centre for Alternative Dispute Resolution",
    "Local Arbitration Chamber"
  ];

  // Arbitrator options
  const arbitratorOptions = [
    "Select Arbitrator",
    "Justice (Retd.) R.K. Sharma",
    "Advocate A. Verma (Arbitrator)",
    "Dr. S. Kapoor (Legal Expert)",
    "Justice (Retd.) M. Singh",
    "Advocate P. Patel (Arbitrator)"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />
      
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
                isDark ? "text-pink-400" : "text-pink-600"
              }`} />
              <h3 className={`text-lg font-semibold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                Create Arbitration Criminal Case Of {legal?.customerName}
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
            {/* Arbitration Complaint No and Police Station */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Arbitration Complaint No.:
                </label>
                <input
                  type="text"
                  value={formData.arbitrationComplaintNo}
                  onChange={(e) => handleInputChange('arbitrationComplaintNo', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } focus:outline-none`}
                  placeholder="Enter arbitration complaint number"
                />
              </div>

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
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } focus:outline-none`}
                  placeholder="Enter police station"
                />
              </div>
            </div>

            {/* Arbitration Venue and Arbitrator Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Arbitration Venue:
                </label>
                <select
                  value={formData.arbitrationVenue}
                  onChange={(e) => handleInputChange('arbitrationVenue', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } focus:outline-none`}
                >
                  {venueOptions.map((option, index) => (
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

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Arbitrator Name:
                </label>
                <select
                  value={formData.arbitratorName}
                  onChange={(e) => handleInputChange('arbitratorName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } focus:outline-none`}
                >
                  {arbitratorOptions.map((option, index) => (
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

            {/* Date Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } focus:outline-none`}
                />
              </div>

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
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* More Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Arbitration Notice Date:
                </label>
                <input
                  type="date"
                  value={formData.arbitrationNoticeDate}
                  onChange={(e) => handleInputChange('arbitrationNoticeDate', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Authorised Representative and Arbitration Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } focus:outline-none`}
                  placeholder="Authorised Representative"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Arbitration Date:
                </label>
                <input
                  type="date"
                  value={formData.arbitrationDate}
                  onChange={(e) => handleInputChange('arbitrationDate', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
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
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
              isSubmitting
                ? isDark
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isDark
                  ? "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-900/50"
                  : "bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/25"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Create Arbitration Criminal Case</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateArbitrationCriminalModal;