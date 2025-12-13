"use client";
import React, { useState } from "react";
import { Phone } from "lucide-react";
import CallDetailsModal from "./CallDetailsModal";

const CallButton = ({ 
  applicant, 
  isDark = false, 
  onCallSubmitted, 
  size = "default",
  variant = "default",
  className = "" 
}) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCallClick = () => {
    setShowCallModal(true);
  };

  const handleCallSubmit = async (success, response) => {
    if (success) {
      if (onCallSubmitted) {
        onCallSubmitted(response);
      }
    }
  };

  const handleCloseModal = () => {
    setShowCallModal(false);
  };

  // Size variants
  const sizeStyles = {
    small: "px-3 py-1 text-xs",
    default: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };

  // Color variants
  const variantStyles = {
    default: isDark 
      ? "bg-blue-900/50 text-blue-300 border-blue-700 hover:bg-blue-800" 
      : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    primary: isDark 
      ? "bg-blue-600 text-white border-blue-700 hover:bg-blue-700" 
      : "bg-blue-600 text-white border-blue-700 hover:bg-blue-700",
    outline: isDark 
      ? "bg-transparent text-blue-300 border-blue-600 hover:bg-blue-900/30" 
      : "bg-transparent text-blue-600 border-blue-300 hover:bg-blue-50"
  };

  return (
    <>
      <button
        onClick={handleCallClick}
        disabled={!applicant}
        className={`flex items-center space-x-2 rounded-md border font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
          sizeStyles[size]
        } ${variantStyles[variant]} ${className}`}
      >
        <Phone className="w-4 h-4" />
        <span>Call</span>
      </button>

      <CallDetailsModal 
        isOpen={showCallModal} 
        onClose={handleCloseModal} 
        data={applicant} 
        isDark={isDark}
        onSubmit={handleCallSubmit}
        submitting={submitting}
      />
    </>
  );
};

export default CallButton;