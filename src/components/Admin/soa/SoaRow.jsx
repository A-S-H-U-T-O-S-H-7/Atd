import React from "react";
import { Calendar } from "lucide-react";

const SoaRow = ({ item, index, isDark }) => {
  const formatCurrency = (amount) => {
    if (!amount || amount === "0.00") return "0.00";
    return parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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

  const getParticularText = (item) => {
    const collection = parseFloat(item.collection_received);
    const interest = parseFloat(item.normal_interest_charged);
    
    if (collection > 0) {
      return "Collection Received";
    } else if (interest > 0) {
      return "Interest Charged";
    } else if (parseFloat(item.penal_interest_charged) > 0) {
      return "Penal Interest Charged";
    } else if (parseFloat(item.penality_charged) > 0) {
      return "Penalty Charged";
    }
    return "Daily Transaction";
  };

  const getParticularStyle = (particular) => {
    if (particular.includes("Collection Received")) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (particular.includes("Interest Charged")) {
      return isDark ? "text-blue-400" : "text-blue-600";
    } else if (particular.includes("Penal") || particular.includes("Penalty")) {
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

      {/* Normal Interest Charged */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.normal_interest_charged, "debit")}`}>
            {formatCurrency(item.normal_interest_charged)}
          </span>
        </div>
      </td>

      {/* Penal Interest Charged */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.penal_interest_charged, "debit")}`}>
            {formatCurrency(item.penal_interest_charged)}
          </span>
        </div>
      </td>

      {/* Penality Charged */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.penality_charged, "debit")}`}>
            {formatCurrency(item.penality_charged)}
          </span>
        </div>
      </td>

      {/* Collection Received */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.collection_received, "credit")}`}>
            {formatCurrency(item.collection_received)}
          </span>
        </div>
      </td>

      {/* Principle Adjusted */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.principle_adjusted)}`}>
            {formatCurrency(item.principle_adjusted)}
          </span>
        </div>
      </td>

      {/* Normal Interest Adjusted */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.normal_interest_adjusted, "debit")}`}>
            {formatCurrency(item.normal_interest_adjusted)}
          </span>
        </div>
      </td>

      {/* Penal Interest Adjusted */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.penal_interest_adjusted, "debit")}`}>
            {formatCurrency(item.penal_interest_adjusted)}
          </span>
        </div>
      </td>

      {/* Penalty Adjusted */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.penalty_adjusted, "debit")}`}>
            {formatCurrency(item.penalty_adjusted)}
          </span>
        </div>
      </td>

      {/* Principle After Adjusted */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.principle_after_adjusted)}`}>
            {formatCurrency(item.principle_after_adjusted)}
          </span>
        </div>
      </td>

      {/* Normal Interest After Adjusted */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.normal_interest_after_adjusted, "debit")}`}>
            {formatCurrency(item.normal_interest_after_adjusted)}
          </span>
        </div>
      </td>

      {/* Penal Interest After Adjusted */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.penal_interest_after_adjusted, "debit")}`}>
            {formatCurrency(item.penal_interest_after_adjusted)}
          </span>
        </div>
      </td>

      {/* Penalty After Adjusted */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getAmountColor(item.penalty_after_adjusted, "debit")}`}>
            {formatCurrency(item.penalty_after_adjusted)}
          </span>
        </div>
      </td>

      {/* Total Outstanding Amount */}
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${getAmountColor(item.total_outstanding_amount, "balance")}`}>
            {formatCurrency(item.total_outstanding_amount)}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default SoaRow;