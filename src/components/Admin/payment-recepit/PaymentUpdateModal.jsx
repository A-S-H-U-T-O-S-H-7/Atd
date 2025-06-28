import React, { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";

const PaymentUpdateModal = ({
  isOpen,
  onClose,
  payment,
  onUpdate,
  isDark
}) => {
  const [formData, setFormData] = useState({
    transferredAmount: "",
    referenceId: ""
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        transferredAmount: payment.receivedAmount || "",
        referenceId: ""
      });
    }
  }, [payment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (payment && formData.transferredAmount) {
      onUpdate(payment.id, {
        receivedAmount: formData.transferredAmount,
        referenceId: formData.referenceId,
        commission: calculateCommission(formData.transferredAmount)
      });
      onClose();
      setFormData({ transferredAmount: "", referenceId: "" });
    }
  };

  const calculateCommission = (amount) => {
    // Simple commission calculation - you can modify this logic
    const commission = parseFloat(amount) * 0.02; // 2% commission
    return commission.toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex  items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full overflow-hidden max-w-md mx-4 rounded-2xl shadow-2xl border-2 ${
        isDark 
          ? "bg-gray-800 border-emerald-600/50" 
          : "bg-white border-emerald-300"
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b-2 ${
          isDark 
            ? "border-emerald-600/50 bg-gradient-to-r from-gray-900 to-gray-800" 
            : "border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50"
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${
              isDark ? "text-gray-100" : "text-gray-700"
            }`}>
              Update Payment in Collection
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transferred Amount */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
              Transferred Amount :
            </label>
            <input
              type="number"
              name="transferredAmount"
              value={formData.transferredAmount}
              onChange={handleInputChange}
              step="0.01"
              placeholder="Enter transferred amount"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20" 
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
              required
            />
          </div>

          {/* Reference ID */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
              Reference Id :
            </label>
            <input
              type="text"
              name="referenceId"
              value={formData.referenceId}
              onChange={handleInputChange}
              placeholder="Enter reference ID"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20" 
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              <span>Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentUpdateModal;