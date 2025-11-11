"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ReCollectionForm = ({
  isOpen,
  onClose,
  application,
  onReCollectionSubmit,
  isDark
}) => {
  const [formData, setFormData] = useState({
    lastCollectionDate: "",
    collectionDate: "",
    penaltyInput: "",
    penalInterest: "",
    bounceCharge: "",
    collectionBy: "",
    bankName: "",
    transactionId: "",
    collectionAmount: "",
    status: ""
  });
  const [loading, setLoading] = useState(false);

  const bankOptions = [
    "Yes Bank",
    "ICICI Bank-A/c-5399",
    "ICICI Bank-A/C-1738",
    "ICICI Bank-A/c-5395",
    "ICICI Bank-A/c-5403",
    "ICICI Bank-A/c-5402",
    "ICICI Bank-A/c-1661",
    "CASH FEE",
    "ICICI Bank-A/c-5400"
  ];

  useEffect(() => {
    if (isOpen && application) {
      setFormData({
        lastCollectionDate: "",
        collectionDate: "",
        penaltyInput: "",
        penalInterest: "",
        bounceCharge: "",
        collectionBy: "",
        bankName: "",
        transactionId: "",
        collectionAmount: "",
        status: ""
      });
    }
  }, [isOpen, application]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "collectionBy") {
      setFormData(prev => ({
        ...prev,
        collectionBy: value,
        bankName: value === "by cash" ? "" : prev.bankName
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.collectionDate || !formData.collectionBy || !formData.collectionAmount || !formData.status) {
      alert('Please fill all required fields.');
      return;
    }

    if (formData.collectionBy === "by bank" && !formData.bankName) {
      alert('Please select a bank.');
      return;
    }

    try {
      setLoading(true);
      
      await onReCollectionSubmit(application.id, formData);
      
      alert('Re-collection processed successfully!');
      onClose();
    } catch (error) {
      console.error("Re-collection error:", error);
      alert('Failed to process re-collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const sanctionAmount = application?.sanctionAmount || "5000";
  const processFee = application?.processFee || "0.00";
  const disburseDate = application?.disburseDate || "2025-10-04";
  const transactionDate = application?.transactionDate || "2025-10-04";
  const dueDate = application?.dueDate || "2025-10-30";
  const principal = application?.principal || "3823";
  const interest = application?.interest || "90.45";
  const dueAmount = application?.dueAmount || "";
  const penalty = application?.penalty || "";
  const totalDueAmount = application?.totalDueAmount || "";
  const amtDisbursedFrom = application?.amtDisbursedFrom || "ICICI Bank-A/c-5399";

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}>
          <h2 className={`text-xl font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Re-Collection of {application?.name || "Kothapalli Veera Subramanyasarma"}
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

        {/* Form Content */}
        <div className="p-6">
          {/* Non-editable Application Details */}
          <div className={`mb-6 p-4 rounded-lg ${
            isDark ? "bg-gray-700/50" : "bg-gray-50"
          }`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Sanction Amount :
                </label>
                <input
                  type="text"
                  value={sanctionAmount}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Process Fee :
                </label>
                <input
                  type="text"
                  value={processFee}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Disburse Date :
                </label>
                <input
                  type="date"
                  value={disburseDate}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Transaction Date :
                </label>
                <input
                  type="date"
                  value={transactionDate}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Last Collection Date :
                </label>
                <input
                  type="date"
                  name="lastCollectionDate"
                  value={formData.lastCollectionDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Due Date :
                </label>
                <input
                  type="date"
                  value={dueDate}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Due Amount Section */}
          <div className={`mb-6 p-4 rounded-lg ${
            isDark ? "bg-gray-700/50" : "bg-gray-50"
          }`}>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Due Amount
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Principal :
                </label>
                <input
                  type="text"
                  value={principal}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Interest :
                </label>
                <input
                  type="text"
                  value={interest}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="col-span-2">
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Due Amount :
                </label>
                <input
                  type="text"
                  value={dueAmount}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Collection Details */}
          <div className={`mb-6 p-4 rounded-lg ${
            isDark ? "bg-gray-700/50" : "bg-gray-50"
          }`}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Collection date : <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="collectionDate"
                  value={formData.collectionDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Penality :
                </label>
                <input
                  type="number"
                  name="penaltyInput"
                  value={formData.penaltyInput}
                  onChange={handleChange}
                  placeholder="Enter penalty amount"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  min="0"
                />
                <p className={`text-xs px-1 mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}>
                  (Principal: + GST: )
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Penal Interest:
                </label>
                <input
                  type="number"
                  name="penalInterest"
                  value={formData.penalInterest}
                  onChange={handleChange}
                  placeholder="Enter penal interest"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  min="0"
                />
                <p className={`text-xs px-1 mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}>
                  (Penal Int: + GST: )
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Bounce Charge:
                </label>
                <input
                  type="number"
                  name="bounceCharge"
                  value={formData.bounceCharge}
                  onChange={handleChange}
                  placeholder="Enter bounce charge"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  min="0"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Total Due Amount :
                </label>
                <input
                  type="text"
                  value={totalDueAmount}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Collection By : <span className="text-red-500">*</span>
                </label>
                <select
                  name="collectionBy"
                  value={formData.collectionBy}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                >
                  <option value="">--Select--</option>
                  <option value="by bank">By Bank</option>
                  <option value="by cash">By Cash</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Bank Name :
                </label>
                <select
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  disabled={formData.collectionBy === "by cash"}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    formData.collectionBy === "by cash"
                      ? isDark
                        ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                      : isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">--Select Bank--</option>
                  {bankOptions.map((bank, index) => (
                    <option key={index} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Amt Disbursed From :
                </label>
                <input
                  type="text"
                  value={amtDisbursedFrom}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Transaction Id :
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  placeholder="Enter transaction ID"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Collection Amount : <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="collectionAmount"
                  value={formData.collectionAmount}
                  onChange={handleChange}
                  placeholder="Enter collection amount"
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
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                >
                  <option value="">--Select Status--</option>
                  <option value="Returned">Returned</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
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
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? "Processing..." : "Submit"}
              {!loading && <span>→</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReCollectionForm;

