'use client';
import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import PermissionWrapper from "../PermissionWrapper";

const ActionButton = ({ 
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

  const isVerified = enquiry.verify === 1;
  const href = `/crm/application-form/${enquiry.id}`;

  return (
    <PermissionWrapper
      permissionKey="application"
      tooltipText="No permission to verify"
    >
      <Link
        href={href}
        onClick={(e) => {
          // ALWAYS save to localStorage for normal clicks
          localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
          
          if (disabled || loading) {
            e.preventDefault(); 
          }
        }}
        className={`inline-flex items-center justify-center px-3 py-1 rounded text-xs font-medium transition-all duration-200 border ${
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
          <span className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-pink-800" />
            <span>Verified</span>
          </span>
        ) : (
          "Verify"
        )}
      </Link>
    </PermissionWrapper>
  );
};

export default ActionButton;