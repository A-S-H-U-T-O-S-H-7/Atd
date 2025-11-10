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
      // Pre-fill with application data if available
      setFormData({
        disburseAmount: application.approvedAmount || "",
        disbursementDate: new Date().toISOString().split('T')[0],
        bankName: "",
        branchName: "",
        accountNo: "",
        ifscCode: ""
      });
    }
  }, [isOpen, application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.disburseAmount || !formData.disbursementDate || !formData.bankName || 
        !formData.branchName || !formData.accountNo || !formData.ifscCode) {
      toast.error('Please fill all required fields.', {
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
      return;
    }

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
                  Disbursement Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="disburseAmount"
                  value={formData.disburseAmount}
                  onChange={handleChange}
                  placeholder="Enter disbursement amount"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Disbursement Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="disbursementDate"
                  value={formData.disbursementDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
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
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Bank Name :
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Branch Name :
                </label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Account No. :
                </label>
                <input
                  type="text"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  IFSC Code :
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="Enter IFSC code"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  required
                />
              </div>
            </div>
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
              {loading ? "Processing..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisbursementModal;