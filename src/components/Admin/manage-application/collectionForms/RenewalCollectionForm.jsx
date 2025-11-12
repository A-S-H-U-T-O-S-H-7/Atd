"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CollectionRenewalForm = ({
  isOpen,
  onClose,
  application,
  onRenewalSubmit,
  isDark
}) => {
  const [formData, setFormData] = useState({
    collectionDate: "",
    interest: "",
    penaltyChecked: false,
    penaltyAmount: "",
    renewalCharge: "",
    totalDueAmount: "",
    collectionBy: "",
    bankName: "",
    amtDisbursedFrom: "",
    transactionId: "",
    collectionAmount: ""
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
        collectionDate: "",
        interest: "",
        penaltyChecked: false,
        penaltyAmount: "",
        renewalCharge: "",
        totalDueAmount: "",
        collectionBy: "",
        bankName: "",
        amtDisbursedFrom: "",
        transactionId: "",
        collectionAmount: ""
      });
    }
  }, [isOpen, application]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "penaltyChecked") {
      setFormData(prev => ({
        ...prev,
        penaltyChecked: checked,
        penaltyAmount: checked ? "500" : ""
      }));
    } else if (name === "collectionBy") {
      setFormData(prev => ({
        ...prev,
        collectionBy: value,
        bankName: value === "by cash" ? "" : prev.bankName
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.collectionDate || !formData.interest || !formData.renewalCharge || 
        !formData.totalDueAmount || !formData.collectionBy || !formData.collectionAmount) {
      alert('Please fill all required fields.');
      return;
    }

    if (formData.collectionBy === "by bank" && !formData.bankName) {
      alert('Please select a bank.');
      return;
    }

    try {
      setLoading(true);
      
      await onRenewalSubmit(application.id, formData);
      
      alert('Renewal processed successfully!');
      onClose();
    } catch (error) {
      console.error("Renewal error:", error);
      alert('Failed to process renewal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const sanctionAmount = application?.sanctionAmount || "14000";
  const processFee = application?.processFee || "1982";
  const processFeeDetail = "(Principal: 1680 + GST: 302)";
  const disburseDate = application?.disburseDate || "";
  const transactionDate = application?.transactionDate || "";
  const dueDate = application?.dueDate || "";
  const interest = application?.interest || "";
  const amtDisbursedFrom = application?.amtDisbursedFrom || "";

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all ${
          isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
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
            Renewal of {application?.name || "Faizan Adeeb"}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Non-editable Application Details */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Sanction Amount
                </label>
                <input
                  type="text"
                  value={sanctionAmount}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-300 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Process Fee
                </label>
                <div className="space-y-1">
                  <input
                    type="text"
                    value={processFee}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-300 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                  <p className={`text-xs px-1 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {processFeeDetail}
                  </p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Disburse Date
                </label>
                <input
                  type="date"
                  value={disburseDate}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-300 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={transactionDate}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-300 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-300 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Renew Details */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Renew Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Collection date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="collectionDate"
                    value={formData.collectionDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Interest
                  </label>
                  <input
                    type="text"
                    value={interest}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-300 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Penality
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      name="penaltyAmount"
                      value={formData.penaltyAmount}
                      readOnly
                      placeholder="Penalty amount"
                      className={`flex-1 px-3 py-2.5 rounded-lg border text-sm ${
                        isDark 
                          ? "bg-gray-600/50 border-gray-600 text-gray-300 cursor-not-allowed" 
                          : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="penaltyChecked"
                        checked={formData.penaltyChecked}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Apply Penalty
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs px-1 mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    (Principal: + GST: )
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Penal Interest
                  </label>
                  <input
                    type="text"
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-300 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                  <p className={`text-xs px-1 mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    (Penal Int: + GST: )
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Renewal Charge <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="renewalCharge"
                    value={formData.renewalCharge}
                    onChange={handleChange}
                    placeholder="Enter renewal charge"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Total Due Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalDueAmount"
                    value={formData.totalDueAmount}
                    onChange={handleChange}
                    placeholder="Enter total due amount"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Collection By <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="collectionBy"
                    value={formData.collectionBy}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
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
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Bank Name
                  </label>
                  <select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    disabled={formData.collectionBy === "by cash"}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Amt Disbursed From
                  </label>
                  <input
                    type="text"
                    value={amtDisbursedFrom}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-300 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Transaction Id
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    placeholder="Enter transaction ID"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Collection Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="collectionAmount"
                  value={formData.collectionAmount}
                  onChange={handleChange}
                  placeholder="Enter collection amount"
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 font-medium ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Submit Renewal
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CollectionRenewalForm;