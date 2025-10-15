import React from "react";
import { IndianRupee, SquarePen } from "lucide-react";

const ExpenseRow = ({
  expense,
  index,
  isDark,
  onEditClick
}) => {
  const formatAmount = (amount) => {
    if (amount === 0) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const AmountCell = ({ amount, isTotal = false }) => (
    <span
      className={`text-sm font-medium ${
        isTotal 
          ? isDark ? "text-emerald-400 font-bold" : "text-emerald-600 font-bold"
          : isDark ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {formatAmount(amount)}
    </span>
  );

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${isDark
        ? "border-emerald-700 hover:bg-gray-700/50"
        : "border-emerald-300 hover:bg-emerald-50/50"} ${index % 2 === 0
        ? isDark ? "bg-gray-700/30" : "bg-gray-50"
        : ""}`}
    >
      {/* SR No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-medium ${isDark
            ? "text-gray-100"
            : "text-gray-900"}`}
        >
          {index + 1}
        </span>
      </td>

      {/* Month */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-semibold text-sm ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {expense.month}
        </span>
      </td>

      {/* Year */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-medium text-sm ${isDark
            ? "text-gray-200"
            : "text-gray-800"}`}
        >
          {expense.year}
        </span>
      </td>

      {/* Salary */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.salary} />
      </td>

      {/* Mobile Expenses */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.mobileExpenses} />
      </td>

      {/* Convence */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.convence} />
      </td>

      {/* Interest */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.interest} />
      </td>

      {/* Electricity */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.electricity} />
      </td>

      {/* Rent */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.rent} />
      </td>

      {/* Promotion/Advertisement */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.promotionAdvertisement} />
      </td>

      {/* Cibil */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.cibil} />
      </td>

      {/* Others */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.others} />
      </td>

      {/* Total */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <AmountCell amount={expense.total} isTotal={true} />
      </td>

      {/* Action */}
      <td className="px-4 py-4">
        <button
          onClick={() => onEditClick(expense)}
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
            ? "bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300"
            : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"}`}
          title="Edit Expense"
        >
          <SquarePen size={16} />
        </button>
      </td>
    </tr>
  );
};

export default ExpenseRow;