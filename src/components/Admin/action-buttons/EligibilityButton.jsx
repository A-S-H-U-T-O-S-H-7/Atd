'use client';
import React from "react";
import Link from "next/link";
import PermissionWrapper from "../PermissionWrapper";

const EligibilityButton = ({ 
  enquiry,
  isDark,
  loading = false,
  disabled = false,
  className = ""
}) => {

  if (!enquiry) {
    return (
      <span className={`px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs ${className}`}>
        N/A
      </span>
    );
  }

  return (
    <PermissionWrapper
      permissionKey="eligibility"
      tooltipText="No permission for eligibility check"
    >
      <Link
        href={`/crm/loan-eligibility/${enquiry.id}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey && (disabled || loading)) {
            e.preventDefault();
          }
        }}
        className={`inline-block px-3 py-1 rounded text-xs font-medium transition-all duration-200 border
          ${disabled || loading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:scale-105"}
          ${isDark
            ? "bg-teal-900/50 border-teal-700 text-teal-300 hover:bg-teal-800"
            : "bg-teal-100 border-teal-300 text-teal-700 hover:bg-teal-200"}
          ${className}`}
      >
        {loading ? "Processing..." : "Eligibility"}
      </Link>
    </PermissionWrapper>
  );
};

export default EligibilityButton;