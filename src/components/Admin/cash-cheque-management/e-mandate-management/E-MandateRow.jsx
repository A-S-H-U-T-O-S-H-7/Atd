import React from "react";
import { Calendar, User, Building2, IndianRupee, SquarePen, UserCircle } from "lucide-react";

const EmandateRow = ({
  deposit,
  index,
  isDark,
  onEditClick
}) => {
  const getStatusColor = status => {
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case "delivered":
      case "received/cleared":
      case "completed":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case "bounced":
      case "returned":
      case "failed":
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      case "pending":
      case "not delivered":
      case "processing":
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${isDark
        ? "border-gray-700 hover:bg-gray-700/50"
        : "border-gray-100 hover:bg-emerald-50/50"} ${index % 2 === 0
        ? isDark ? "bg-gray-700/30" : "bg-gray-50"
        : ""}`}
    >
      {/* SR No */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-medium ${isDark
            ? "text-gray-100"
            : "text-gray-900"}`}
        >
          {index + 1}
        </span>
      </td>

      {/* Loan No */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-semibold text-sm ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {deposit.loanNo}
        </span>
      </td>

      {/* Customer Name - NEW COLUMN */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <UserCircle
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium ${isDark
                ? "text-gray-200"
                : "text-gray-800"}`}
            >
              {deposit.name}
            </span>
            
          </div>
        </div>
      </td>

      {/* Cheque No */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-medium text-sm ${isDark
            ? "text-gray-200"
            : "text-gray-800"}`}
        >
          {deposit.chequeNo}
        </span>
      </td>

      {/* Bank Name */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Building2
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-700"}`}
          >
            {deposit.bankName}
          </span>
        </div>
      </td>

      {/* Deposit Date */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Calendar
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-800"}`}
          >
            {deposit.depositDate}
          </span>
        </div>
      </td>

      {/* Amount */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm font-bold ${isDark
              ? "text-green-400"
              : "text-green-600"}`}
          >
            {formatAmount(deposit.amount)}
          </span>
        </div>
      </td>

      {/* User */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <User
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-700"}`}
          >
            {deposit.user}
          </span>
        </div>
      </td>

      {/* Status  */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(
            deposit.status
          )}`}
        >
          {deposit.status}
        </span>
      </td>

      {/* Edit Action */}
      <td className="px-2 py-4">
        <button
          onClick={() => onEditClick(deposit)}
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
            ? "bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300"
            : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"}`}
          title="Edit Deposit"
        >
          <SquarePen size={16} />
        </button>
      </td>
    </tr>
  );
};

export default EmandateRow;