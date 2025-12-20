import React, { useEffect, useRef } from 'react'; // Added useEffect and useRef
import { X, MessageSquare, Loader2 } from 'lucide-react';

const RemarksModal = ({ 
  isOpen, 
  onClose, 
  isDark, 
  customerName, 
  loanNo, 
  remarksData, 
  loading = false 
}) => {
  const modalRef = useRef(null); // Added ref for modal

  // Format remarks for display
  const formatRemarks = (remarks) => {
    if (!remarks) return null;
    
    // Split by multiple dots and clean up the string
    return remarks.split('...................').map((item, index) => {
      const trimmedItem = item.trim();
      if (!trimmedItem) return null;
      
      // Add numbering
      return `${index + 1}. ${trimmedItem}`;
    }).filter(Boolean);
  };

  // Prepare remarks data for display
  const remarksDisplay = [
    {
      title: "Personal Remarks",
      content: remarksData?.PerRemark,
      formattedContent: formatRemarks(remarksData?.PerRemark)
    },
    {
      title: "Salary Remarks",
      content: remarksData?.SalaryRemark,
      formattedContent: formatRemarks(remarksData?.SalaryRemark)
    },
    {
      title: "Organization Remarks",
      content: remarksData?.OrganizationRemark,
      formattedContent: formatRemarks(remarksData?.OrganizationRemark)
    },
    {
      title: "Salary Slip Remarks",
      content: remarksData?.salary_remark || remarksData?.SalarySlipRemark, // Fixed key name
      formattedContent: formatRemarks(remarksData?.salary_remark || remarksData?.SalarySlipRemark)
    },
    {
      title: "Bank Remarks",
      content: remarksData?.BankRemark,
      formattedContent: formatRemarks(remarksData?.BankRemark)
    },
    {
      title: "Social Score Remarks",
      content: remarksData?.SocialRemark,
      formattedContent: formatRemarks(remarksData?.SocialRemark)
    },
    {
      title: "Cibil Score Remarks",
      content: remarksData?.CibilRemark,
      formattedContent: formatRemarks(remarksData?.CibilRemark)
    }
  ];

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Handle Escape key press
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto'; // Restore scroll
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef} // Added ref here
        className={`w-full max-w-4xl max-h-[80vh] rounded-lg shadow-2xl ${
          isDark 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        } overflow-hidden animate-in fade-in zoom-in duration-300`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <MessageSquare className={`w-5 h-5 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Appraisal Remarks
              </h2>
              <p className={`text-xs mt-0.5 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {customerName} - Loan No: {loanNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors hover:scale-105 active:scale-95 ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className={`w-10 h-10 animate-spin ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Loading remarks...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {remarksDisplay.map((remark, index) => (
                <div 
                  key={index} 
                  className={`py-3 border-b last:border-b-0 ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-40 flex-shrink-0 font-semibold text-sm pt-1 ${
                      isDark ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>
                      {remark.title}:
                    </div>
                    <div className={`flex-1 text-sm min-h-[24px] ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {remark.content ? (
                        <div className="space-y-2">
                          {remark.formattedContent ? (
                            remark.formattedContent.map((item, idx) => (
                              <div key={idx} className="flex items-start">
                                <span className="inline-block min-w-[20px] mr-2">{idx + 1}.</span>
                                <span className="flex-1 whitespace-pre-wrap break-words">
                                  {item}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className={`whitespace-pre-wrap break-words ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {remark.content}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className={`italic ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          No remarks available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 pb-2 mb-4 border-t flex justify-end ${
          isDark 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5  rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-lg hover:shadow-xl'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemarksModal;