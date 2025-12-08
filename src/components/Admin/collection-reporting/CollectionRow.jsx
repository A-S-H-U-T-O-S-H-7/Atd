import React from "react";
import { Calendar, CreditCard, User, Building2 } from "lucide-react";

const CollectionRow = ({ item, index, isDark }) => {
  // Common cell styling classes
  const cellClasses = {
    base: `px-4 py-3 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`,
    text: {
      normal: `text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`,
      semibold: `text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`,
      bold: `text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`,
      muted: `text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`,
    },
    colors: {
      emerald: `text-sm font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`,
      blue: `text-sm font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`,
      green: `text-sm font-semibold ${isDark ? "text-green-400" : "text-green-600"}`,
      red: `text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"}`,
      orange: `text-sm font-medium ${isDark ? "text-orange-400" : "text-orange-600"}`,
    },
    badges: {
      emerald: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isDark ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
      }`,
      blue: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isDark ? "bg-blue-900/50 text-blue-300 border border-blue-700" : "bg-blue-100 text-blue-800 border border-blue-200"
      }`,
      orange: `px-3 py-2 rounded-md text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
        isDark ? "bg-orange-900/50 text-orange-300 border-orange-700" : "bg-orange-100 text-orange-800 border-orange-200"
      }`,
    }
  };

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
      <td className={cellClasses.base}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.sn}
        </div>
      </td>

      {/* Collection Date */}
      <td className={cellClasses.base}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={cellClasses.text.normal}>
            {item.collectionDate}
          </span>
        </div>
      </td>

      {/* CRN No */}
      <td className={cellClasses.base}>
        <div className="flex items-center space-x-2">
          <span className={cellClasses.colors.blue}>
            {item.crnNo}
          </span>
        </div>
      </td>

      {/* Loan No */}
      <td className={cellClasses.base}>
        <div className="flex items-center space-x-2">
          <span className={cellClasses.colors.emerald}>
            {item.loanNo}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className={cellClasses.base}>
        <div className="flex items-center space-x-2">
          <span className={cellClasses.text.normal}>
            {item.name}
          </span>
        </div>
      </td>

      {/* Admin Fee */}
      <td className={cellClasses.base}>
        <span className={cellClasses.text.normal}>
          ₹{item.adminFee.toFixed(2)}
        </span>
      </td>

      {/* GST */}
      <td className={cellClasses.base}>
        <span className={cellClasses.text.normal}>
          ₹{item.gst.toFixed(2)}
        </span>
      </td>

      {/* Sanction Amount */}
      <td className={cellClasses.base}>
        <span className={cellClasses.badges.orange}>
          ₹{item.sanctionAmount.toFixed(2)}
        </span>
      </td>

      {/* Disburse Date */}
      <td className={cellClasses.base}>
        <span className={cellClasses.text.normal}>
          {item.disburseDate}
        </span>
      </td>

      {/* Transaction Date */}
      <td className={cellClasses.base}>
        <span className={cellClasses.text.normal}>
          {item.transactionDate}
        </span>
      </td>

      {/* Due Date */}
      <td className={cellClasses.base}>
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
      <td className={cellClasses.base}>
        <span className={cellClasses.text.normal}>
          ₹{item.interest.toFixed(2)}
        </span>
      </td>

      {/* Penalty */}
      <td className={cellClasses.base}>
        <span className={item.penalty > 0 ? cellClasses.colors.red : cellClasses.text.normal}>
          {item.penalty > 0 ? `₹${item.penalty.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* GST Penalty */}
      <td className={cellClasses.base}>
        <span className={item.gstPenalty > 0 ? cellClasses.colors.red : cellClasses.text.normal}>
          {item.gstPenalty > 0 ? `₹${item.gstPenalty.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* Penal Interest */}
      <td className={cellClasses.base}>
        <span className={item.penalInterest > 0 ? cellClasses.colors.red : cellClasses.text.normal}>
          {item.penalInterest > 0 ? `₹${item.penalInterest.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* Renewal Charge */}
      <td className={cellClasses.base}>
        <span className={item.renewalCharge > 0 ? cellClasses.colors.orange : cellClasses.text.normal}>
          {item.renewalCharge > 0 ? `₹${item.renewalCharge.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* Bounce Charge */}
      <td className={cellClasses.base}>
        <span className={item.bounceCharge > 0 ? cellClasses.colors.red : cellClasses.text.normal}>
          {item.bounceCharge > 0 ? `₹${item.bounceCharge.toFixed(2)}` : '-'}
        </span>
      </td>

      {/* Collection Amount */}
      <td className={cellClasses.base}>
        <span className={cellClasses.colors.green}>
          ₹{item.collectionAmount.toFixed(2)}
        </span>
      </td>

      {/* Total Amount */}
      <td className={cellClasses.base}>
        <span className={cellClasses.colors.emerald}>
          ₹{item.totalAmount.toFixed(2)}
        </span>
      </td>

      

      {/* User By */}
      <td className={`px-4 py-3 ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={cellClasses.text.muted}>
          {item.userBy}
        </span>
      </td>
    </tr>
  );
};

export default CollectionRow;