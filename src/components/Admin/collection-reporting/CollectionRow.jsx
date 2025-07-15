import React from "react";
import { Calendar, CreditCard, User, Building2 } from "lucide-react";

const CollectionRow = ({ item, index, isDark }) => {
  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate.split('-').reverse().join('-'));
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', days: Math.abs(diffDays), color: 'red' };
    } else if (diffDays <= 7) {
      return { status: 'warning', days: diffDays, color: 'yellow' };
    } else {
      return { status: 'normal', days: diffDays, color: 'green' };
    }
  };

  const getDueDateColor = (status) => {
    switch (status) {
      case 'overdue':
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      case 'warning':
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
    }
  };

  const dueDateStatus = getDueDateStatus(item.dueDate);

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-emerald-50/50"
      } ${
        index % 2 === 0
          ? isDark 
            ? "bg-gray-700/50" 
            : "bg-gray-100"
          : ""
      }`}
    >
      {/* SN */}
      <td className="px-4 py-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
          isDark
            ? " text-white"
            : " text-black"
        }`}>
          {item.sn}
        </div>
      </td>

      {/* Collection Date */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.collectionDate}
          </span>
        </div>
      </td>

      {/* CRN No */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-medium ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}>
            {item.crnNo}
          </span>
        </div>
      </td>

      {/* Loan No */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            {item.loanNo}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.name}
          </span>
        </div>
      </td>

      {/* Admin Fee */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          ₹{item.adminFee.toFixed(2)}
        </span>
      </td>

      {/* GST */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          ₹{item.gst.toFixed(2)}
        </span>
      </td>

      {/* Sanction Amount */}
      <td className="px-4 py-3">
        <span className={`px-3 py-2  rounded-md text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
      isDark
        ? "bg-orange-900/50 text-orange-300 border-orange-700 "
        : "bg-orange-100 text-orange-800 border-orange-200 "
    }`}>
          ₹{item.sanctionAmount.toFixed(2)}
        </span>
      </td>

      {/* Disburse Date */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          {item.disburseDate}
        </span>
      </td>

      {/* Transaction Date */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          {item.transactionDate}
        </span>
      </td>

      {/* Due Date */}
      <td className="px-4 py-3">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
          getDueDateColor(dueDateStatus.status)
        }`}>
          {item.dueDate}
          {dueDateStatus.status === 'overdue' && (
            <span className="ml-1">({dueDateStatus.days}d overdue)</span>
          )}
          {dueDateStatus.status === 'warning' && (
            <span className="ml-1">({dueDateStatus.days}d left)</span>
          )}
        </div>
      </td>

      {/* Interest */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          ₹{item.interest.toFixed(2)}
        </span>
      </td>

      {/* Penalty */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          item.penalty > 0 
            ? (isDark ? "text-red-400" : "text-red-600")
            : (isDark ? "text-gray-200" : "text-gray-800")
        }`}>
          {item.penalty > 0 ? `₹${item.penalty.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* GST Penalty */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          item.gstPenalty > 0 
            ? (isDark ? "text-red-400" : "text-red-600")
            : (isDark ? "text-gray-200" : "text-gray-800")
        }`}>
          {item.gstPenalty > 0 ? `₹${item.gstPenalty.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* Penal Interest */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          item.penalInterest > 0 
            ? (isDark ? "text-red-400" : "text-red-600")
            : (isDark ? "text-gray-200" : "text-gray-800")
        }`}>
          {item.penalInterest > 0 ? `₹${item.penalInterest.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* Renewal Charge */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          item.renewalCharge > 0 
            ? (isDark ? "text-orange-400" : "text-orange-600")
            : (isDark ? "text-gray-200" : "text-gray-800")
        }`}>
          {item.renewalCharge > 0 ? `₹${item.renewalCharge.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* Bounce Charge */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          item.bounceCharge > 0 
            ? (isDark ? "text-red-400" : "text-red-600")
            : (isDark ? "text-gray-200" : "text-gray-800")
        }`}>
          {item.bounceCharge > 0 ? `₹${item.bounceCharge.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* Collection Amount */}
      <td className="px-4 py-3">
        <span className={`text-sm font-semibold ${
          isDark ? "text-green-400" : "text-green-600"
        }`}>
          ₹{item.collectionAmount.toFixed(2)}
        </span>
      </td>

      {/* Total Amount */}
      <td className="px-4 py-3">
        <span className={`text-sm font-bold ${
          isDark ? "text-emerald-400" : "text-emerald-600"
        }`}>
          ₹{item.totalAmount.toFixed(2)}
        </span>
      </td>

      {/* Agent */}
      <td className="px-4 py-3">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isDark
            ? "bg-blue-900/50 text-blue-300 border border-blue-700"
            : "bg-blue-100 text-blue-800 border border-blue-200"
        }`}>
          {item.agent}
        </div>
      </td>

      {/* User By */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}>
          {item.userBy}
        </span>
      </td>
    </tr>
  );
};

export default CollectionRow;