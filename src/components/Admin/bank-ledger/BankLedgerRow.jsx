import React from "react";
import { Calendar, FileText, TrendingDown, TrendingUp, DollarSign } from "lucide-react";

const BankLedgerRow = ({ entry, index, isDark }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    if (amount === 0) return "-";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (balance < 0) {
      return isDark ? "text-red-400" : "text-red-600";
    }
    return isDark ? "text-gray-300" : "text-gray-600";
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-sm ${
        isDark
          ? "border-emerald-700 hover:bg-emerald-800/20"
          : "border-emerald-200 hover:bg-blue-50/50"
      } ${
        index % 2 === 0
          ? isDark
            ? "bg-gray-700/30"
            : "bg-gray-50"
          : ""
      }`}
    >
      {/* Date */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`font-medium ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}>
            {formatDate(entry.date)}
          </span>
        </div>
      </td>

      {/* Particulars */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <FileText className={`w-4 h-4 ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`} />
          <span className={`font-medium ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}>
            {entry.particulars}
          </span>
        </div>
      </td>

      {/* Debit */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {entry.debit > 0 && (
            <TrendingDown className={`w-4 h-4 ${
              isDark ? "text-red-400" : "text-red-600"
            }`} />
          )}
          <span className={`font-semibold ${
            entry.debit > 0 
              ? isDark ? "text-red-400" : "text-red-600"
              : isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            {formatAmount(entry.debit)}
          </span>
        </div>
      </td>

      {/* Credit */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {entry.credit > 0 && (
            <TrendingUp className={`w-4 h-4 ${
              isDark ? "text-green-400" : "text-green-600"
            }`} />
          )}
          <span className={`font-semibold ${
            entry.credit > 0 
              ? isDark ? "text-green-400" : "text-green-600"
              : isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            {formatAmount(entry.credit)}
          </span>
        </div>
      </td>

      {/* Balance */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <DollarSign className={`w-4 h-4 ${getBalanceColor(entry.balance)}`} />
          <span className={`font-bold text-lg ${getBalanceColor(entry.balance)}`}>
            {formatAmount(entry.balance)}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default BankLedgerRow;