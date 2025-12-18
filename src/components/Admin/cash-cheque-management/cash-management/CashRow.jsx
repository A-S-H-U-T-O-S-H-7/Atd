import React from "react";
import { Building2, Calendar, CreditCard, User, Edit } from "lucide-react";

const CashRow = ({ deposit, index, isDark, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric' 
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-blue-50/50"
      } ${
        index % 2 === 0
          ? isDark
            ? "bg-gray-700/30"
            : "bg-gray-50"
          : ""
      }`}
    >
      {/* S.No */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`font-medium ${
          isDark ? "text-gray-100" : "text-gray-900"
        }`}>
          {deposit.sNo || index + 1}
        </span>
      </td>

      {/* Bank Name */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Building2 className={`w-4 h-4 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`font-medium ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}>
            {deposit.bankName || "N/A"}
          </span>
        </div>
      </td>

      {/* Deposit Date */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-green-400" : "text-green-600"
          }`} />
          <span className={`${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            {formatDate(deposit.depositDate)}
          </span>
        </div>
      </td>

      {/* Amount */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          
          <span className={`font-semibold text-lg ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            {formatAmount(deposit.amount)}
          </span>
        </div>
      </td>

      {/* User */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <User className={`w-4 h-4 ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`} />
          <span className={`font-medium ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`}>
            {deposit.user || "admin"}
          </span>  
        </div>
      </td>

      {/* Action */}
      <td className="px-6 py-4">
        <button
          onClick={() => onEdit(deposit)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-blue-900/50 hover:bg-blue-800 text-blue-300 border border-blue-700"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200"
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </td>
    </tr>
  );
};

export default CashRow;