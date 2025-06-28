import React, { useState } from "react";
import {
  Calendar,
  Phone,
  Mail,
  User,
  CreditCard,
  DollarSign
} from "lucide-react";
import CallDetailsModal from "../CallDetailsModal";
import AdjustmentModal from "../AdjustmentModal";
import OverdueAmountModal from "../OverdueAmountModal";

const OverdueApplicantRow = ({
  applicant,
  index,
  isDark,
  onCall,
  onAdjustment,
  onRenew,
  onSendNotice
}) => {

const [showCallModal, setShowCallModal] = useState(false);
const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
const [showOverdueModal, setShowOverdueModal] = useState(false);



const handleCall = (item) => {
    setShowCallModal(true);
  }
  const handleAdjustment = (applicant) => {
    setShowAdjustmentModal(true);
  };

  const handleCallSubmit = (callData) => {
    // Handle call submission logic
    console.log('Call submitted:', callData);
  };
  const handleAdjustmentSubmit = (adjustmentData) => {
    console.log('Adjustment submitted:', adjustmentData);
    setShowAdjustmentModal(false);
  };
    
  const handleOverdueAmountClick = () => {
    setShowOverdueModal(true);
  };

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case "adjustment":
        return isDark
          ? "bg-pink-900/50 text-pink-300 border-pink-700"
          : "bg-pink-100 text-pink-800 border-pink-200";
      case "overdue":
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${isDark
        ? "border-emerald-700 hover:bg-gray-700/50"
        : "border-emerald-100 hover:bg-emerald-50/50"} ${index % 2 === 0
        ? isDark ? "bg-gray-700/30" : "bg-gray-50"
        : ""}`}
    >
      {/* SN */}
      <td className="px-6 py-4">
        <span
          className={`font-medium ${isDark
            ? "text-gray-100"
            : "text-gray-900"}`}
        >
          {applicant.srNo}
        </span>
      </td>

      {/* Call */}
      <td className="px-6 py-4">
        <button
        onClick={handleCall}
          className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
            isDark
              ? "bg-blue-900/50 hover:bg-blue-800 text-blue-300 border border-blue-700"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200"
          }`}
        >
          <Phone size={14} />
          <span>Call</span>
        </button>
      </td>

      {/* Loan No */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
        
          <span
            className={`text-sm font-semibold ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          >
            {applicant.loanNo}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-800"}`}
          >
            {applicant.dueDate}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
         
          <p
            className={`font-medium text-sm ${isDark
              ? "text-gray-100"
              : "text-gray-900"}`}
          >
            {applicant.name}
          </p>
        </div>
      </td>

      {/* Phone No */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-700"}`}
          >
            {applicant.phoneNo}
          </span>
        </div>
      </td>

      {/* E-mail */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Mail
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-sm ${isDark
              ? "text-gray-300"
              : "text-gray-600"}`}
          >
            {applicant.email}
          </span>
        </div>
      </td>

      {/* Adjustment */}
      <td className="px-6 py-4">
        <button
          onClick={() => handleAdjustment(applicant)}
          className={`px-3 py-1 cursor-pointer rounded-lg font-medium transition-all duration-200 text-sm ${
            isDark
              ? "bg-pink-900/50 hover:bg-pink-800 text-pink-300 border border-pink-700"
              : "bg-pink-100 hover:bg-pink-200 text-pink-700 border border-pink-200"
          }`}
        >
          Adjustment
        </button>
      </td>

      {/* Balance */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          
          <span
            className={`text-sm font-bold ${isDark
              ? "text-gray-100"
              : "text-gray-900"}`}
          >
            {formatCurrency(applicant.balance)}
          </span>
        </div>
      </td>

    {/* Overdue Amt */}
<td className="px-6 py-4">
  {(() => {
    const today = new Date();
    
    const dateParts = applicant.dueDate.split('-');
    const formattedDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
    const dueDate = new Date(formattedDate);
    
    const daysDiff = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 0 && daysDiff <= 3) {
      return (
        <button
          onClick={() => onRenew(applicant)}
          className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 text-sm ${
            isDark
              ? "bg-green-900/50 hover:bg-green-800 text-green-300 border border-green-700"
              : "bg-green-100 hover:bg-green-200 text-green-700 border border-green-200"
          }`}
        >
          Renew
        </button>
      );
    }
    else {
      return (
        <button
          onClick={handleOverdueAmountClick}
          className={`px-2 py-1 rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 hover:opacity-80 ${
            applicant.overdueAmt > applicant.balance
              ? isDark
                ? "bg-red-900/50 text-red-300 hover:bg-red-800"
                : "bg-red-100 text-red-800 hover:bg-red-200"
              : isDark
              ? "bg-orange-900/50 text-orange-300 hover:bg-orange-800"
              : "bg-orange-100 text-orange-800 hover:bg-orange-200"
          }`}
        >
          {formatCurrency(applicant.overdueAmt)}
        </button>
      );
    }
  })()}
</td>

      {/* UPI Payments */}
      <td className="px-6 py-4">
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-green-400"
            : "text-green-600"}`}
        >
          {formatCurrency(applicant.upiPayments)}
        </span>
      </td>

      {/* Demand Notice */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSendNotice(applicant)}
            className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 text-sm ${
              isDark
                ? "bg-red-900/50 hover:bg-red-800 text-red-300 border border-red-700"
                : "bg-red-100 hover:bg-red-200 text-red-700 border border-red-200"
            }`}
          >
            Send Notice
          </button>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-100"
              : "text-gray-900"}`}
          >
            N/A
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-100"
              : "text-gray-900"}`}
          >
            Not Allowed
          </span>
        </div>
      </td>

      <CallDetailsModal
  isOpen={showCallModal}
  onClose={() => setShowCallModal(false)}
  data={applicant}
  isDark={isDark}
  onSubmit={handleCallSubmit}
/>

<AdjustmentModal
  isOpen={showAdjustmentModal}
  onClose={() => setShowAdjustmentModal(false)}
  applicant={applicant}
  isDark={isDark}
  onSubmit={handleAdjustmentSubmit}
/>

<OverdueAmountModal
  isOpen={showOverdueModal}
  onClose={() => setShowOverdueModal(false)}
  applicant={applicant}
  isDark={isDark}
/>

    </tr>
  );
};

export default OverdueApplicantRow;