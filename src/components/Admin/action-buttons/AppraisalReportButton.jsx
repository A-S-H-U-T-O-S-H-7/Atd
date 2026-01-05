'use client';
import React, { useState } from "react";
import Link from "next/link";
import { AppraisalPDF } from "@/lib/services/AllEnquiriesServices";
import PermissionWrapper from "../PermissionWrapper";

const AppraisalReportButton = ({ 
  enquiry, 
  isDark, 
  onFileView,
  loading = false,
  disabled = false,
  className = ""
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const finalReportStatus = enquiry?.finalReportStatus || "";
  const isFinalStage = enquiry?.isFinalStage || false;
  const finalReportFile = enquiry?.finalReportFile || "";
  const applicationId = enquiry?.id;
  const href = `/crm/appraisal-report/${applicationId}`;

  const handlePdfView = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    
    if (!applicationId) {
      alert("No application ID found");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await AppraisalPDF.getAppraisalPDF(applicationId);
      
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
        throw new Error("No PDF data received");
      }
      
      if (pdfBlob.size === 0) throw new Error("Empty PDF file");
      
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      const newTab = window.open(pdfUrl, '_blank');
      
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `Appraisal_Report_${enquiry.crnNo || applicationId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setTimeout(() => window.URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
      alert(`Failed to generate appraisal report: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClick = (e) => {
    const isNewTabClick = e.ctrlKey || e.metaKey || e.shiftKey;
    
    localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
    
    if (finalReportStatus === "Recommended") {
      e.preventDefault();
      handlePdfView(e);
      return;
    }
    
    // Only prevent if disabled/loading for normal clicks
    if (!isNewTabClick && (disabled || loading || isDownloading)) {
      e.preventDefault();
    }
  };

  if (!enquiry) {
    return (
      <span className={`px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs ${className}`}>
        N/A
      </span>
    );
  }

  if (isFinalStage && finalReportStatus !== "Recommended") {
    return (
      <span className={`px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs ${className}`}>
        Locked
      </span>
    );
  }

  if (finalReportStatus === "Recommended") {
    const buttonContent = (
      <button
        onClick={handlePdfView}
        disabled={disabled || loading || isDownloading}
        className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
          disabled || loading || isDownloading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-green-200"
        } bg-gradient-to-r from-orange-100 to-orange-300 text-orange-800 border border-orange-400 ${className}`}
      >
        {isDownloading ? "Opening..." : loading ? "Loading..." : "Recommended"}
      </button>
    );

    return (
      <PermissionWrapper permissionKey="appraisal" tooltipText="No permission for appraisal">
        {buttonContent}
      </PermissionWrapper>
    );
  }

  // Normal "Check" button with Link wrapper
  const buttonContent = (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center justify-center px-3 py-1 rounded text-xs font-medium transition-colors duration-200 border ${
        disabled || loading || isDownloading
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:scale-105"
      } ${
        isDark
          ? "bg-pink-900/50 border-pink-700 text-pink-300 hover:bg-pink-800"
          : "bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200"
      } ${className}`}
    >
      {loading ? "Processing..." : isDownloading ? "Opening..." : "Check"}
    </Link>
  );

  return (
    <PermissionWrapper permissionKey="appraisal" tooltipText="No permission for appraisal">
      {buttonContent}
    </PermissionWrapper>
  );
};

export default AppraisalReportButton;