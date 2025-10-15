import React from "react";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { IndianRupee } from "lucide-react";

const SoaRow = ({ item, index, isDark }) => {
  const formatCurrency = (amount) => {
    if (!amount || amount === "0.00") return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  const getAmountColor = (amount, type = "default") => {
    const value = parseFloat(amount);
    if (value === 0) return isDark ? "text-gray-400" : "text-gray-500";
    
    switch (type) {
      case "credit":
        return value > 0 ? (isDark ? "text-green-400" : "text-green-600") : (isDark ? "text-gray-400" : "text-gray-500");
      case "debit":
        return value > 0 ? (isDark ? "text-red-400" : "text-red-600") : (isDark ? "text-gray-400" : "text-gray-500");
      case "balance":
        return value > 0 ? (isDark ? "text-blue-400" : "text-blue-600") : (isDark ? "text-gray-400" : "text-gray-500");
      default:
        return isDark ? "text-gray-200" : "text-gray-800";
    }
  };

  const getParticularStyle = (particular) => {
    if (particular.toLowerCase().includes("disbursement")) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (particular.toLowerCase().includes("payment")) {
      return isDark ? "text-blue-400" : "text-blue-600";
    } else if (particular.toLowerCase().includes("charge") || particular.toLowerCase().includes("interest")) {
      return isDark ? "text-orange-400" : "text-orange-600";
    }
    return isDark ? "text-gray-200" : "text-gray-800";
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-md ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-200 hover:bg-blue-50/50"
      } ${
        index % 2 === 0
          ? isDark 
            ? "bg-gray-700/20" 
            : "bg-gray-50/50"
          : ""
      }`}
    >
      {/* SN */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          isDark
            ? "bg-blue-900/50 text-blue-300"
            : "bg-blue-100 text-blue-700"
        }`}>
          {item.sn}
        </div>
      </td>

      {/* Particular */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          {item.particular.toLowerCase().includes("disbursement") }
          {item.particular.toLowerCase().includes("payment") }
          <span className={`text-sm font-medium ${getParticularStyle(item.particular)}`}>
            {item.particular}
          </span>
        </div>
      </td>

      {/* Date */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.date}
          </span>
        </div>
      </td>

      {/* Principal Amount */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <IndianRupee className={`w-4 h-4 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`text-sm font-semibold ${getAmountColor(item.principalAmount)}`}>
            {formatCurrency(item.principalAmount)}
          </span>
        </div>
      </td>

      {/* Interest */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <IndianRupee className={`w-4 h-4 ${
            isDark ? "text-red-400" : "text-red-600"
          }`} />
          <span className={`text-sm font-semibold ${getAmountColor(item.interest, "debit")}`}>
            {formatCurrency(item.interest)}
          </span>
        </div>
      </td>

      {/* Due Amount */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <IndianRupee className={`w-4 h-4 ${
            isDark ? "text-red-400" : "text-red-600"
          }`} />
          <span className={`text-sm font-semibold ${getAmountColor(item.dueAmount, "debit")}`}>
            {formatCurrency(item.dueAmount)}
          </span>
        </div>
      </td>

      {/* Receipt Amount */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <IndianRupee className={`w-4 h-4 ${
            isDark ? "text-green-400" : "text-green-600"
          }`} />
          <span className={`text-sm font-semibold ${getAmountColor(item.receiptAmount, "credit")}`}>
            {formatCurrency(item.receiptAmount)}
          </span>
        </div>
      </td>

      {/* Penalty */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <IndianRupee className={`w-4 h-4 ${
            isDark ? "text-orange-400" : "text-orange-600"
          }`} />
          <span className={`text-sm font-semibold ${getAmountColor(item.penalty, "debit")}`}>
            {formatCurrency(item.penalty)}
          </span>
        </div>
      </td>

      {/* Penal Interest */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <IndianRupee className={`w-4 h-4 ${
            isDark ? "text-orange-400" : "text-orange-600"
          }`} />
          <span className={`text-sm font-semibold ${getAmountColor(item.penalInterest, "debit")}`}>
            {formatCurrency(item.penalInterest)}
          </span>
        </div>
      </td>

      {/* Penal GST */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <IndianRupee className={`w-4 h-4 ${
            isDark ? "text-orange-400" : "text-orange-600"
          }`} />
          <span className={`text-sm font-semibold ${getAmountColor(item.penalGst, "debit")}`}>
            {formatCurrency(item.penalGst)}
          </span>
        </div>
      </td>

      {/* Bounce Charge */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <IndianRupee className={`w-4 h-4 ${
            isDark ? "text-red-400" : "text-red-600"
          }`} />
          <span className={`text-sm font-semibold ${getAmountColor(item.bounceCharge, "debit")}`}>
            {formatCurrency(item.bounceCharge)}
          </span>
        </div>
      </td>

      {/* Balance */}
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          <IndianRupee className={`w-4 h-4 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`text-sm font-bold ${getAmountColor(item.balance, "balance")}`}>
            {formatCurrency(item.balance)}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default SoaRow;