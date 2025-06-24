import React, { useState, useEffect } from "react";
import { X, Building2, Calendar, CreditCard, User, Save } from "lucide-react";

const CashDepositModal = ({ isOpen, onClose, onSave, editingDeposit, isDark }) => {
  const [formData, setFormData] = useState({
    bankName: "",
    depositDate: "",
    amount: "",
    user: ""
  });

  const [errors, setErrors] = useState({});

  // Bank options
  const bankOptions = [
    "ICICI Bank-A/C-1738",
    "HDFC Bank-A/C-2456", 
    "SBI Bank-A/C-9871",
    "Axis Bank-A/C-3421",
    "PNB Bank-A/C-5678"
  ];

  useEffect(() => {
    if (editingDeposit) {
      setFormData({
        bankName: editingDeposit.bankName || "",
        depositDate: editingDeposit.depositDate || "",
        amount: editingDeposit.amount?.toString() || "",
        user: editingDeposit.user || ""
      });
    } else {
      setFormData({
        bankName: "",
        depositDate: "",
        amount: "",
        user: ""
      });
    }
    setErrors({});
  }, [editingDeposit, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    if (!formData.depositDate) {
      newErrors.depositDate = "Deposit date is required";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.user.trim()) {
      newErrors.user = "User is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const depositData = {
        bankName: formData.bankName,
        depositDate: formData.depositDate,
        amount: parseFloat(formData.amount),
        user: formData.user
      };
      
      onSave(depositData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl border-2 ${
        isDark
          ? "bg-gray-800 border-emerald-600/50"
          : "bg-white border-emerald-300"
      }`}>
        {/* Header */}
        <div className={`p-6 border-b-2 ${
          isDark
            ? "border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800"
            : "border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              {editingDeposit ? "Edit Cash Deposit" : "Add Cash Deposit"}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-200 ${
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
          {/* Bank Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              <Building2 className="w-4 h-4 inline mr-2" />
              Bank Name
            </label>
            <select
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-emerald-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20"
              } ${errors.bankName ? "border-red-500" : ""}`}
            >
              <option value="">--Select Bank--</option>
              {bankOptions.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            {errors.bankName && (
              <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <input
              type="date"
              name="depositDate"
              value={formData.depositDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-emerald-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20"
              } ${errors.depositDate ? "border-red-500" : ""}`}
            />
            {errors.depositDate && (
              <p className="text-red-500 text-sm mt-1">{errors.depositDate}</p>
            )}
          </div>

          {/* Deposit Amount */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              <CreditCard className="w-4 h-4 inline mr-2" />
              Deposit Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-500"
              } ${errors.amount ? "border-red-500" : ""}`}
            />
            
{errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

         

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-gray-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300 hover:border-gray-400"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-500/20"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/20"
              }`}
            >
              <Save className="w-4 h-4" />
              {editingDeposit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashDepositModal;