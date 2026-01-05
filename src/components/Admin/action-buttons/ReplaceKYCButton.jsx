'use client';
import React from "react";
import Link from "next/link";
import PermissionWrapper from "../PermissionWrapper";

const ReplaceKYCButton = ({ 
  application, 
  isDark, 
  loading = false,
  disabled = false,
  className = ""
}) => {

  if (!application) return null;

  const href = `/crm/replace-kyc/${application.id}`;

  return (
    <PermissionWrapper
      permissionKey="replace_kyc"
      tooltipText="No permission to replace KYC"
    >
      <Link
        href={href}
        onClick={(e) => {
          if (disabled || loading) {
            e.preventDefault(); 
          }
        }}
        className={`inline-block px-3 py-1 rounded text-xs font-medium transition-colors duration-200 border ${
          isDark
            ? "bg-purple-900/50 border-purple-700 text-purple-300 hover:bg-purple-800"
            : "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
        } ${className} ${
          disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {loading ? "Processing..." : "Replace KYC"}
      </Link>
    </PermissionWrapper>
  );
};

export default ReplaceKYCButton;
