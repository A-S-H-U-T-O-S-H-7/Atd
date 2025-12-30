"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

const RenewalModal = ({ isOpen, onClose, applicant, isDark, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    renewal_date: "",
    renewal_amount: ""
  });

  // Reset form when modal opens with new applicant
  useEffect(() => {
    if (isOpen && applicant) {
      setFormData({
        renewal_date: new Date().toISOString().split('T')[0],
        renewal_amount: ""
      });
    }
  }, [isOpen, applicant]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.renewal_date || !formData.renewal_amount) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      return;
    }

    const amount = parseFloat(formData.renewal_amount);
    if (isNaN(amount) || amount <= 0) {
      Swal.fire({
        title: 'Invalid Amount',
        text: 'Please enter a valid renewal amount',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        renewal_amount: amount,
        applicant
      });
    } catch (error) {
      console.error("Renewal submission error:", error);
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9999] transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              isDark 
                ? "bg-gray-800 border border-emerald-700/50" 
                : "bg-white border border-emerald-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  Renew Loan Account
                </h2>
                <p className={`text-sm mt-1 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Loan No: {applicant?.loanNo || "N/A"}
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300" 
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
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
                    onChange={(e) => setFormData({...formData, renewal_date: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-emerald-500/30"
                        : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/30"
                    }`}
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
                    onChange={(e) => setFormData({...formData, renewal_amount: e.target.value})}
                    placeholder="Enter renewal amount"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-emerald-500/30"
                        : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/30"
                    }`}
                  />
                </div>

                {/* Applicant Info */}
                <div className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700/50" : "bg-gray-50"
                }`}>
                  <p className={`text-sm ${
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
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Submit Renewal</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RenewalModal;