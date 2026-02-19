// Updated OverdueAmountModal with applicant name color change
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const OverdueAmountModal = ({ isOpen, onClose, applicant, isDark }) => {
  const modalRef = useRef(null);

  // Outside click, escape key, and scroll lock functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !applicant) return null;

  const overdueDetails = applicant.overdue_details?.overdue;
  const renewalDetails = applicant.overdue_details?.renewal;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-md mx-4 rounded-lg shadow-xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Overdue Amount of <span className="text-blue-600">{applicant.name}</span>
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-gray-100 transition-colors ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X size={20} className={isDark ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Days Badge */}
<div className="flex justify-center">
  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
    (() => {
      const daysString = applicant.ovedays;
      let numericDays = 0;
      
      if (typeof daysString === 'string') {
        const match = daysString.match(/(\d+)\s*=\s*(\d+)/);
        if (match && match[2]) {
          numericDays = parseInt(match[2]);
        }
      } else {
        numericDays = parseInt(applicant.overdue_display) || 0;
      }
      
      return numericDays > 30 
        ? "bg-red-100 text-red-700 border border-red-300"
        : numericDays > 15 
        ? "bg-orange-100 text-orange-700 border border-orange-300"
        : "bg-green-100 text-green-700 border border-green-300";
    })()
  }`}>
    {applicant.overdue_display} 
  </div>
</div>

          {/* Overdue Details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sanction Amount :</span>
              <span className="text-sm font-semibold">{formatCurrency(overdueDetails?.sanction_amount)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Interest :</span>
              <span className="text-sm font-semibold">{formatCurrency(overdueDetails?.interest)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Penalty :</span>
              <span className="text-sm font-semibold">{formatCurrency(overdueDetails?.penality)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Penal Interest :</span>
              <span className="text-sm font-semibold">{formatCurrency(overdueDetails?.penal_interest)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Collection :</span>
              <span className="text-sm font-semibold text-green-600">{formatCurrency(applicant?.total_collection)}</span>
            </div>
            
            <hr className={`my-2 ${isDark ? "border-gray-600" : "border-gray-300"}`} />
            
            {/* Total Due Highlight */}
            <div className={`flex justify-between items-center font-bold p-2 rounded ${
  isDark ? "bg-red-900/30 border border-red-700" : "bg-red-50 border border-red-200"
}`}>
  <span className="text-sm">Total Due Amount :</span>
  <span className={`text-sm ${isDark ? "text-red-300" : "text-red-600"}`}>
    {formatCurrency(
      (overdueDetails?.total_due || 0) - (applicant?.total_collection || 0)
    )}
  </span>
</div>
          </div>

          {/* Renewal Case Section */}
          <div className="mt-4">
            <h3 className="text-base font-semibold mb-2">Renewal of {applicant.name}</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Processing Fee :</span>
                <span className="text-sm font-semibold">{formatCurrency(renewalDetails?.process_fee)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Interest :</span>
                <span className="text-sm font-semibold">{formatCurrency(renewalDetails?.interest)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Penalty :</span>
                <span className="text-sm font-semibold">{formatCurrency(renewalDetails?.penality)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Penal Interest :</span>
                <span className="text-sm font-semibold">{formatCurrency(renewalDetails?.penal_interest)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Renewal Fee :</span>
                <span className="text-sm font-semibold">{formatCurrency(renewalDetails?.renewal_fee)}</span>
              </div>
              
              <hr className={`my-2 ${isDark ? "border-gray-600" : "border-gray-300"}`} />
              
              {/* Total Payable Highlight */}
              <div className={`flex justify-between items-center font-bold p-2 rounded ${
                isDark ? "bg-green-900/30 border border-green-700" : "bg-green-50 border border-green-200"
              }`}>
                <span className="text-sm">Total Payable Amount :</span>
                <span className={`text-sm ${isDark ? "text-green-300" : "text-green-600"}`}>
                  {formatCurrency(renewalDetails?.total_renewal_charges)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverdueAmountModal;