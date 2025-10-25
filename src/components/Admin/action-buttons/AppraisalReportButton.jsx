import React from "react";

const AppraisalReportButton = ({ 
  enquiry, 
  isDark, 
  onFileView,
  onCheckClick,
  loading = false,
  disabled = false,
  className = ""
}) => {
  // Safe property access with fallbacks
  const finalReportStatus = enquiry?.finalReportStatus || "";
  const isFinalStage = enquiry?.isFinalStage || false;
  const finalReportFile = enquiry?.finalReportFile || "";

  const handleClick = () => {
    if (!disabled && !loading && enquiry) {
      if (finalReportStatus === "Recommended") {
        onFileView?.(enquiry, finalReportFile);
      } else if (!isFinalStage) {
        onCheckClick?.(enquiry);
      }
    }
  };

  // If no enquiry data, show disabled state
  if (!enquiry) {
    return (
      <span className={`px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs ${className}`}>
        N/A
      </span>
    );
  }

  // If final stage and not recommended, show locked state
  if (isFinalStage && finalReportStatus !== "Recommended") {
    return (
      <span className={`px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs ${className}`}>
        Locked
      </span>
    );
  }

  // If recommended, show view PDF button
  if (finalReportStatus === "Recommended") {
    return (
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
          disabled || loading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-green-200"
        } bg-green-100 text-green-800 ${className}`}
      >
        {loading ? "Loading..." : "View PDF"}
      </button>
    );
  }

  // Default check button
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
          ? "bg-pink-900/50 border-pink-700 text-pink-300 hover:bg-pink-800"
          : "bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200"
      } ${className}`}
    >
      {loading ? "Processing..." : "Check"}
    </button>
  );
};

export default AppraisalReportButton;