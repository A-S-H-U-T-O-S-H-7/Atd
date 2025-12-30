"use client";
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const RenewalModal = ({ isOpen, onClose, applicant, isDark, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    renewal_date: "",
    renewal_amount: ""
  });
  
  const modalRef = useRef(null);

  // Reset form when modal opens with new applicant
  useEffect(() => {
    if (isOpen && applicant) {
      setFormData({
        renewal_date: new Date().toISOString().split('T')[0],
        renewal_amount: ""
      });
    }
  }, [isOpen, applicant]);

  // Prevent body scroll and handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && 
          !modalRef.current.contains(event.target) && 
          !loading) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && !loading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.renewal_date || !formData.renewal_amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formData.renewal_amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid renewal amount");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        renewal_amount: amount,
        applicant
      });
      
      // Show success toast
      toast.success("Renewal submitted successfully!");
      
      // Close modal after successful submission
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error("Renewal submission error:", error);
      toast.error(error.message || "Failed to submit renewal");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          handleClose();
        }
      }}
    >
      <div 
        ref={modalRef}
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border-2 ${
          isDark 
            ? "bg-gray-800 border-emerald-600/50" 
            : "bg-white border-emerald-300"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? "border-emerald-600/30" : "border-emerald-200"
        }`}>
          <div>
            <h2 className={`text-xl font-bold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Renew Loan Account
            </h2>
            <p className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Loan No: {applicant?.loanNo || "N/A"}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDark 
                ? "hover:bg-gray-700 text-gray-400 hover:text-white" 
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Renewal Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Renewal Date *
              </label>
              <input
                type="date"
                required
                value={formData.renewal_date}
                onChange={(e) => !loading && setFormData({...formData, renewal_date: e.target.value})}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                    : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Renewal Amount */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Renewal Amount (₹) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.renewal_amount}
                onChange={(e) => !loading && setFormData({...formData, renewal_amount: e.target.value})}
                disabled={loading}
                placeholder="Enter renewal amount"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                    : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
              />
            </div>

            {/* Applicant Info */}
            <div className={`p-4 rounded-lg ${
              isDark ? "bg-gray-700/50 border border-gray-600" : "bg-gray-50 border border-gray-200"
            }`}>
              <p className={`text-sm mb-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                <span className="font-medium">Customer:</span> {applicant?.name || "N/A"}
              </p>
              <p className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                <span className="font-medium">Current Balance:</span> ₹{parseFloat(applicant?.balance || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className={`flex space-x-3 p-6 pt-4 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.renewal_date || !formData.renewal_amount}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading || !formData.renewal_date || !formData.renewal_amount
                  ? 'opacity-50 cursor-not-allowed'
                  : 'shadow-lg hover:shadow-xl transform hover:scale-105'
              } ${
                isDark
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Submit Renewal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewalModal;