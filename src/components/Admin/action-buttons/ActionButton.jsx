import React from "react";
import { CheckCircle } from "lucide-react";

const ActionButton = ({ 
  enquiry, 
  isDark, 
  onVerifyClick,  
  loading = false,
  disabled = false,
  className = ""
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onVerifyClick && enquiry) {
      onVerifyClick(enquiry);
    }
  };

  if (!enquiry) {
    return (
      <span className={`px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs ${className}`}>
        N/A
      </span>
    );
  }

  // Check if enquiry is verified
  const isVerified = enquiry.verify === 1;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 border ${
        disabled || loading
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:scale-105"
      } ${
        isVerified
          ? "bg-gradient-to-r from-pink-200 to-rose-300 border-pink-600 text-pink-800"
          : isDark
            ? "bg-blue-900/50 border-blue-700 text-blue-300 hover:bg-blue-800"
            : "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
      } ${className}`}
    >
      {loading ? (
        "Processing..."
      ) : isVerified ? (
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4 text-pink-800" />
          <span>Verified</span>
        </div>
      ) : (
        "Verify"
      )}
    </button>
  );
};

export default ActionButton;