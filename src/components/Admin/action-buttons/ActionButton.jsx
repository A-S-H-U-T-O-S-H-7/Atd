import React from "react";

const ActionButton = ({ 
  enquiry, 
  isDark, 
  onVerifyClick,  // Changed from onActionClick to onVerifyClick
  loading = false,
  disabled = false,
  className = ""
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onVerifyClick && enquiry) {
      onVerifyClick(enquiry);  // Changed to onVerifyClick
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
          ? "bg-blue-900/50 border-blue-700 text-blue-300 hover:bg-blue-800"
          : "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
      } ${className}`}
    >
      {loading ? "Processing..." : "Verify"}
    </button>
  );
};

export default ActionButton;