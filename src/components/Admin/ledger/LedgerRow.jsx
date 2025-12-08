"use client";
import { Calendar, CreditCard, Eye } from "lucide-react";
import CallButton from "../call/CallButton";

const LedgerRow = ({ item, index, isDark, onViewTransaction, onAdjustment }) => {
  
  const handleAdjustment = () => onAdjustment(item);
  
  // Common cell styles
  const cellBase = "px-2 py-4 text-center border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return { status: 'normal', days: 0 };
    const today = new Date();
    const due = new Date(dueDate.split('-').reverse().join('-'));
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', days: Math.abs(diffDays) };
    if (diffDays <= 7) return { status: 'warning', days: diffDays };
    return { status: 'normal', days: diffDays };
  };

  const dueDateStatus = getDueDateStatus(item.dueDate);

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

  const formatBalance = (balance) => {
    const amount = parseFloat(balance || 0);
    return `₹${amount.toLocaleString()}`;
  };

  const formatOverdue = (overdue) => {
    const amount = parseFloat(overdue || 0);
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-emerald-50/50"
      } ${
        index % 2 === 0
          ? isDark 
            ? "bg-gray-700/30" 
            : "bg-gray-50"
          : ""
      }`}
    >
      <td className={cellStyle}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          isDark
            ? "bg-emerald-900/50 text-emerald-300"
            : "bg-emerald-100 text-emerald-700"
        }`}>
          {item.sn}
        </div>
      </td>

      <td className={cellStyle}>
        <CallButton
          applicant={item}
          isDark={isDark}
          size="small"
          variant="default"
          className="px-2 py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105"
        />
      </td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <CreditCard className={iconAccent} />
          <span className={`text-sm font-semibold ${textAccent}`}>
            {item.loanNo}
          </span>
        </div>
      </td>

      <td className={cellStyle}>
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className={iconAccent} />
            <span className={`text-sm font-medium ${textSecondary}`}>
              {item.dueDate || 'N/A'}
            </span>
          </div>
          {item.dueDate && (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getDueDateColor(dueDateStatus.status)}`}>
              {dueDateStatus.status === 'overdue' 
                ? `${dueDateStatus.days} days overdue`
                : dueDateStatus.status === 'warning'
                ? `${dueDateStatus.days} days left`
                : 'On track'
              }
            </span>
          )}
        </div>
      </td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-3">
          <div>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {item.name}
            </p>
            {item.crnno && (
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                CRN: {item.crnno}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className={cellStyle}>
        <button
          onClick={() => onAdjustment(item)}
          className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-pink-900/50 text-pink-300 border-pink-700 hover:bg-pink-800"
              : "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200"
          }`}
        >
          Adjustment
        </button>
      </td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-sm font-bold ${
            parseFloat(item.balance || 0) < 0 
              ? isDark ? "text-green-400" : "text-green-600"
              : isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            {formatBalance(item.balance)}
          </span>
        </div>
      </td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-sm font-bold ${
            isDark ? "text-red-400" : "text-red-600"
          }`}>
            {formatOverdue(item.over_due)}
          </span>
        </div>
      </td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-sm font-bold ${
            item.settled 
              ? isDark ? "text-green-400" : "text-green-600"
              : isDark ? "text-yellow-400" : "text-yellow-600"
          }`}>
            {item.settled ? 'Yes' : 'No'}
          </span>
        </div>
      </td>

      <td className="px-2 py-4">
        <button
          onClick={() => onViewTransaction(item)}  
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-blue-900/50 text-blue-300 border border-blue-700 hover:bg-blue-800"
              : "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200"
          }`}
          title="View Transaction Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default LedgerRow;