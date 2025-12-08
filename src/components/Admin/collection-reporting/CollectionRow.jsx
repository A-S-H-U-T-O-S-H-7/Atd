"use client";
import { Calendar } from "lucide-react";

const CollectionRow = ({ item, index, isDark }) => {
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
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {item.collectionDate}
          </span>
        </div>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textAccent}`}>
          {item.crnNo}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textAccent}`}>
          {item.loanNo}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm font-medium ${textPrimary}`}>
          {item.name}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          ₹{item.adminFee.toFixed(2)}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          ₹{item.gst.toFixed(2)}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${
          isDark ? "text-orange-400" : "text-orange-600"
        }`}>
          ₹{item.sanctionAmount.toFixed(2)}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {item.disburseDate}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {item.transactionDate}
        </span>
      </td>

      <td className={cellStyle}>
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className={iconAccent} />
            <span className={`text-sm font-medium ${textSecondary}`}>
              {item.dueDate}
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
        <span className={`text-sm ${textSecondary}`}>
          ₹{item.interest.toFixed(2)}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${
          item.penalty > 0 
            ? isDark ? "text-red-400" : "text-red-600" 
            : textSecondary
        }`}>
          {item.penalty > 0 ? `₹${item.penalty.toFixed(2)}` : '-'}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${
          item.gstPenalty > 0 
            ? isDark ? "text-red-400" : "text-red-600" 
            : textSecondary
        }`}>
          {item.gstPenalty > 0 ? `₹${item.gstPenalty.toFixed(2)}` : '-'}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${
          item.penalInterest > 0 
            ? isDark ? "text-red-400" : "text-red-600" 
            : textSecondary
        }`}>
          {item.penalInterest > 0 ? `₹${item.penalInterest.toFixed(2)}` : '-'}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${
          item.renewalCharge > 0 
            ? isDark ? "text-orange-400" : "text-orange-600" 
            : textSecondary
        }`}>
          {item.renewalCharge > 0 ? `₹${item.renewalCharge.toFixed(2)}` : '-'}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${
          item.bounceCharge > 0 
            ? isDark ? "text-red-400" : "text-red-600" 
            : textSecondary
        }`}>
          {item.bounceCharge > 0 ? `₹${item.bounceCharge.toFixed(2)}` : '-'}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${
          isDark ? "text-green-400" : "text-green-600"
        }`}>
          ₹{item.collectionAmount.toFixed(2)}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textAccent}`}>
          ₹{item.totalAmount.toFixed(2)}
        </span>
      </td>

      <td className={`px-2 py-4 ${cellBorder}`}>
        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {item.userBy}
        </span>
      </td>
    </tr>
  );
};

export default CollectionRow;