import React, { useState } from "react";
import { AppraisalPDF } from "@/lib/services/AllEnquiriesServices";

const AppraisalReportButton = ({ 
  enquiry, 
  isDark, 
  onFileView,
  onCheckClick,
  loading = false,
  disabled = false,
  className = ""
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Safe property access with fallbacks
  const finalReportStatus = enquiry?.finalReportStatus || "";
  const isFinalStage = enquiry?.isFinalStage || false;
  const finalReportFile = enquiry?.finalReportFile || "";
  const applicationId = enquiry?.id;

  const handlePdfView = async () => {
    if (!applicationId) {
      alert("No application ID found");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await AppraisalPDF.getAppraisalPDF(applicationId);
      
      // Handle different response formats
      let pdfBlob;
      
      if (response instanceof Blob) {
        pdfBlob = response;
      } else if (response?.data instanceof Blob) {
        pdfBlob = response.data;
      } else if (response?.data) {
        pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      } else if (response) {
        pdfBlob = new Blob([response], { type: 'application/pdf' });
      } else {
        throw new Error("No PDF data received from server");
      }
      
      if (pdfBlob.size === 0) {
        throw new Error("Received empty PDF file");
      }
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Appraisal_Report_${enquiry.crnNo || applicationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Failed to generate appraisal report: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClick = () => {
    if (!disabled && !loading && !isDownloading && enquiry) {
      if (finalReportStatus === "Recommended") {
        // Always generate and download PDF using API
        handlePdfView();
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

  // If recommended, show download PDF button
  if (finalReportStatus === "Recommended") {
    return (
      <button
        onClick={handleClick}
        disabled={disabled || loading || isDownloading}
        className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
          disabled || loading || isDownloading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-green-200"
        } bg-gradient-to-r from-orange-100  to-orange-300 text-orange-800 border border-orange-400 ${className}`}
      >
        {isDownloading ? "Downloading..." : loading ? "Loading..." : "Recommended"}
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