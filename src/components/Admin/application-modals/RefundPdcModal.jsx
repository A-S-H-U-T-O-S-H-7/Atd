import React, { useState } from "react";
import { X, FileText, AlertCircle } from "lucide-react";

const RefundPDCModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isDark, 
  customerName, 
  loanNo 
}) => {
  const [refundStatus, setRefundStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!refundStatus) {
      alert("Please select a refund status");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(refundStatus);
      handleClose();
    } catch (error) {
      console.error("Error submitting refund PDC:", error);
      alert("Failed to update refund PDC status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRefundStatus("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm bg-opacity-50">
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border-2 ${
        isDark 
          ? "bg-gray-800 border-emerald-600/50" 
          : "bg-white border-emerald-300"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? "border-emerald-600/30" : "border-emerald-200"
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? "bg-emerald-900/30" : "bg-emerald-100"
            }`}>
              <FileText className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Refund PDC
              </h2>
              <p className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Update refund status for {customerName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? "hover:bg-gray-700 text-gray-400 hover:text-white" 
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Refund Status <span className="text-red-500">*</span>
              </label>
              <select
                value={refundStatus}
                onChange={(e) => setRefundStatus(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                    : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
              >
                <option value="">Select refund status</option>
                <option value="Yes">Yes</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !refundStatus}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPDCModal;