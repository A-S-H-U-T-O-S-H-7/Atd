"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const DisbursementModal = ({
  isOpen,
  onClose,
  application,
  onDisbursementSubmit,
  isDark
}) => {
  const [formData, setFormData] = useState({
    disburseAmount: "",
    disbursementDate: "",
    bankName: "",
    branchName: "",
    accountNo: "",
    ifscCode: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && application) {
      // Get current date in YYYY-MM-DD format
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      // Pre-fill with application data from API
      setFormData({
        disburseAmount: application.disburseAmount || application.approvedAmount || "",
        disbursementDate: formattedDate, // Set to current date automatically
        bankName: application.customerBank || application.customerAcBank || "",
        branchName: application.customerBranch || application.customerAcBranch || "",
        accountNo: application.customerAccount || application.customerAcNo || "",
        ifscCode: application.customerIfsc || application.customerAcIfsc || ""
      });
    }
  }, [isOpen, application]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      await onDisbursementSubmit(application.id, formData);
      
      toast.success('Disbursement processed successfully!', {
        style: {
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
          border: isDark ? "1px solid #374151" : "1px solid #e5e7eb"
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#f9fafb',
        }
      });

      onClose();
    } catch (error) {
      console.error("Disbursement error:", error);
      toast.error('Failed to process disbursement. Please try again.', {
        style: {
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
          border: isDark ? "1px solid #374151" : "1px solid #e5e7eb"
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#f9fafb',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 className={`text-xl font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Disbursement of {application?.name}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark 
                ? "hover:bg-gray-700 text-gray-400" 
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Disburse Application Details */}
          <div className={`mb-6 p-4 rounded-lg ${
            isDark ? "bg-gray-700/50" : "bg-gray-50"
          }`}>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Disburse Application Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Disbursement Amount
                </label>
                <input
                  type="text"
                  name="disburseAmount"
                  value={formData.disburseAmount}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-gray-200" 
                      : "bg-gray-100 border-gray-300 text-gray-800"
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}>
                  Pre-filled from approved amount
                </p>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Disbursement Date
                </label>
                <input
                  type="text"
                  name="disbursementDate"
                  value={formData.disbursementDate}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-gray-200" 
                      : "bg-gray-100 border-gray-300 text-gray-800"
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}>
                  Auto-filled with current date
                </p>
              </div>
            </div>
          </div>

          {/* Customer Bank Details */}
          <div className={`p-4 rounded-lg ${
            isDark ? "bg-gray-700/50" : "bg-gray-50"
          }`}>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Customer Bank Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-gray-200" 
                      : "bg-gray-100 border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Branch Name
                </label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-gray-200" 
                      : "bg-gray-100 border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Account No.
                </label>
                <input
                  type="text"
                  name="accountNo"
                  value={formData.accountNo}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-gray-200" 
                      : "bg-gray-100 border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-gray-200" 
                      : "bg-gray-100 border-gray-300 text-gray-800"
                  }`}
                />
              </div>
            </div>
            <p className={`text-xs mt-3 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}>
              Bank details are pre-filled from customer application and cannot be modified
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-2 rounded-lg border transition-colors ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white transition-colors ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? "Processing..." : "Submit Disbursement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisbursementModal;