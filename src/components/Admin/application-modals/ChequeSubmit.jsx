import React, { useState, useEffect, useRef } from "react";
import { X, Edit } from "lucide-react";

const ChequeModal = ({
  isOpen,
  onClose,
  onSubmit,
  isDark,
  initialChequeNo = "",
  customerName = "",
  isEdit = false
}) => {
  const [chequeNumber, setChequeNumber] = useState(initialChequeNo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setChequeNumber(initialChequeNo);
      setError("");
    }
  }, [isOpen, initialChequeNo]);

  // Outside click, escape key, and scroll lock functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
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
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!chequeNumber.trim()) {
      setError("Cheque number is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(chequeNumber.trim());
      onClose();
    } catch (err) {
      setError("Failed to save cheque number. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setChequeNumber("");
      setError("");
      onClose();
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-lg mx-4 p-6 rounded-xl shadow-2xl transition-all duration-300 ${isDark
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-xl font-bold ${isDark
              ? "text-white"
              : "text-gray-900"}`}
          >
            {isEdit ? "Update Cheque No. of - " : "Update Cheque No. of - "}
            <span
              className={`${isDark ? "text-emerald-400" : "text-emerald-600"}`}
            >
              {customerName}
            </span>
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className={`p-2 rounded-full transition-colors duration-200 ${isDark
              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"} ${isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : ""}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          {/* Cheque Number Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark
                ? "text-gray-300"
                : "text-gray-700"}`}
            >
              Cheque Number:
            </label>
            <input
              type="text"
              value={chequeNumber}
              onChange={e => setChequeNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
              placeholder="Enter cheque number"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${isDark
                ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""}`}
            />
            {error &&
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>}
          </div>

          {/* Action Buttons */}
          <div className="flex cursor-pointer space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"} ${isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""}`}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !chequeNumber.trim()}
              className={`flex-1 cursor-pointer px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"} ${isSubmitting ||
              !chequeNumber.trim()
                ? "opacity-50 cursor-not-allowed"
                : "shadow-lg hover:shadow-xl"}`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChequeModal;