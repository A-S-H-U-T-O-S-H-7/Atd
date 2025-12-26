'use client';
import React from "react";
import PermissionWrapper from "../PermissionWrapper";

const ReplaceKYCButton = ({ 
  application, 
  isDark, 
  onReplaceKYCClick,
  loading = false,
  disabled = false,
  className = ""
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onReplaceKYCClick && application) {
      onReplaceKYCClick(application);
    }
  };

  const buttonContent = (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
        isDark
          ? "bg-purple-900/50 border hover:bg-purple-800 text-purple-300"
          : "bg-purple-100 border hover:bg-purple-200 text-purple-700"
      } ${className} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      Replace KYC
    </button>
  );

  return (
    <PermissionWrapper permissionKey="replace_kyc" tooltipText="No permission to replace KYC">
      {buttonContent}
    </PermissionWrapper>
  );
};

export default ReplaceKYCButton;