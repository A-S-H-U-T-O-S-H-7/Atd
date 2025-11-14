"use client";
import React, { useState } from "react";
import { Phone } from "lucide-react";
import CallDetailsModal from "./CallDetailsModal";
import { callAPI,callService } from "@/lib/services/CallServices";
import Swal from 'sweetalert2';

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

  const handleCallSubmit = async (callData) => {
    try {
      setSubmitting(true);
      
      const formattedData = callService.prepareCallData(
        callData.remarks, 
        callData.nextCallDate
      );
      
      // Use userId if available, otherwise fall back to id
      const applicantId = applicant?.userId || applicant?.id;
      
      if (!applicantId) {
        throw new Error('Customer ID not found. Please ensure the applicant has a valid user ID.');
      }
      
      console.log('Submitting call for customer ID:', applicantId);
      const response = await callAPI.addCallRemark(applicantId, formattedData);
      
      if (response.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Call remark recorded successfully',
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });
        
        // Call the callback if provided
        if (onCallSubmitted) {
          onCallSubmitted(response);
        }
        
        return true; // Success
      }
    } catch (error) {
      console.error("Error submitting call:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to submit call details. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      throw error;
    } finally {
      setSubmitting(false);
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