"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CollectionEMIModal = ({
  isOpen,
  onClose,
  application,
  onEMISubmit,
  isDark
}) => {
  const [formData, setFormData] = useState({
    emiTenure: "",
    tenureDays: "",
    totalApprovedEMI: "",
    emiAmount: ""
  });
  const [loading, setLoading] = useState(false);

  // EMI Tenure options (1-20)
  const emiTenureOptions = Array.from({ length: 20 }, (_, i) => i + 1);
  
  // Tenure Days options
  const tenureDaysOptions = [10, 20, 30];

  useEffect(() => {
    if (isOpen && application) {
      setFormData({
        emiTenure: "",
        tenureDays: "",
        totalApprovedEMI: "",
        emiAmount: ""
      });
    }
  }, [isOpen, application]);

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.emiTenure || !formData.tenureDays || !formData.totalApprovedEMI || !formData.emiAmount) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      
      await onEMISubmit(application.id, formData);
      
      alert('EMI submitted successfully!');
      onClose();
    } catch (error) {
      console.error("EMI submission error:", error);
      alert('Failed to submit EMI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Sample data for non-editable fields
  const sanctionAmount = application?.sanctionAmount || "1,40,000";
  const processFee = application?.processFee || "1,982";
  const processFeeDetail = "(Principal: 1680 + GST: 302)";

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`rounded-xl shadow-2xl w-full max-w-2xl transform transition-all ${
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
            EMI of {application?.name || "Faizan Adeeb"}
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
          {/* Non-editable fields */}
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
            </div>
          </div>

          {/* EMI Details */}
          <div className={`p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              EMI Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    EMI Tenure <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="emiTenure"
                    value={formData.emiTenure}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required
                  >
                    <option value="">--Select EMI Tenure--</option>
                    {emiTenureOptions.map(option => (
                      <option key={option} value={option}>
                        {option} {option === 1 ? 'Month' : 'Months'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Tenure Days <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tenureDays"
                    value={formData.tenureDays}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required
                  >
                    <option value="">--Select Days--</option>
                    {tenureDaysOptions.map(option => (
                      <option key={option} value={option}>
                        {option} Days
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
                    Total Approved EMI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalApprovedEMI"
                    value={formData.totalApprovedEMI}
                    onChange={handleChange}
                    placeholder="Enter total approved EMI"
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
                    EMI Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="emiAmount"
                    value={formData.emiAmount}
                    onChange={handleChange}
                    placeholder="Enter EMI amount"
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
                  Submit EMI
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

export default CollectionEMIModal;