import React from "react";

const EligibilityButton = ({ 
  enquiry, 
  isDark, 
  onLoanEligibilityClick,
  loading = false,
  disabled = false,
  className = ""
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onLoanEligibilityClick && enquiry) {
      onLoanEligibilityClick(enquiry);
    }
  };

  if (!enquiry) {
    return (
      <span className={`px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs ${className}`}>
        N/A
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 border ${
        disabled || loading
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:scale-105"
      } ${
        isDark
          ? "bg-teal-900/50 border-teal-700 text-teal-300 hover:bg-teal-800"
          : "bg-teal-100 border-teal-300 text-teal-700 hover:bg-teal-200"
      } ${className}`}
    >
      {loading ? "Processing..." : "Eligibility"}
    </button>
  );
};

export default EligibilityButton;