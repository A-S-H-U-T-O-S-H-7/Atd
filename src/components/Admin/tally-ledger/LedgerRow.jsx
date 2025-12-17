// /app/tally-ledger/LedgerRow.js

"use client";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  CreditCard,
  Eye,
} from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
import CallButton from "../call/CallButton";
import Swal from "sweetalert2";

const LedgerRow = ({ item, index, isDark, onViewTransaction, onDownloadPDF }) => {
  
  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return { status: 'normal', days: 0 };
    
    try {
      const today = new Date();
      const [day, month, year] = dueDate.split('-');
      const due = new Date(`${year}-${month}-${day}`);
      
      if (isNaN(due.getTime())) return { status: 'normal', days: 0 };
      
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return { status: 'overdue', days: Math.abs(diffDays) };
      if (diffDays <= 7) return { status: 'warning', days: diffDays };
      return { status: 'normal', days: diffDays };
    } catch {
      return { status: 'normal', days: 0 };
    }
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

  const handlePDFClick = () => {
    Swal.fire({
      title: 'Tally Ledger Statement',
      text: 'What would you like to do with the ledger statement?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Download PDF',
      denyButtonText: 'Print',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10b981',
      denyButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    }).then((result) => {
      if (result.isConfirmed) {
        onDownloadPDF(item.application_id, 'download', item);
      } else if (result.isDenied) {
        onDownloadPDF(item.application_id, 'print', item);
      }
    });
  };

  const formatBalance = (balance) => {
    const amount = parseFloat(balance || 0);
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  

  const truncateAddress = (address, maxLength = 80) => {
    if (!address) return 'N/A';
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
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
      {/* SN */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          isDark
            ? "bg-emerald-900/50 text-emerald-300"
            : "bg-emerald-100 text-emerald-700"
        }`}>
          {item.sn}
        </div>
      </td>

      {/* Call */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <CallButton
          applicant={item}
          isDark={isDark}
          size="small"
          variant="default"
          className="px-4 py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105"
        />
      </td>

      {/* Loan No */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <CreditCard className={`w-4 h-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            {item.loanNo}
          </span>
        </div>
        {item.crnno && item.crnno !== "N/A" && (
          <div className="mt-1">
            <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              CRN: {item.crnno}
            </span>
          </div>
        )}
      </td>

      {/* Disburse Date */}
      <td className={`px-2  py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center justify-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.disburseDate || 'N/A'}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className={`w-4 h-4 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <span className={`text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}>
              {item.dueDate || 'N/A'}
            </span>
          </div>
          {item.dueDate && item.dueDate !== 'N/A' && (
            <span className={`px-2 flex justify-center py-1 rounded-full text-xs font-semibold border ${getDueDateColor(dueDateStatus.status)}`}>
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

      {/* Name */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center justify-center space-x-3">
          
          <div>
            <p className={`text-sm font-semibold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              {item.name}
            </p>
          </div>
        </div>
      </td>

      {/* Address */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-start space-x-2">
          <MapPin className={`w-4 h-4 mt-1 flex-shrink-0 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
          } leading-relaxed`}>
            {truncateAddress(item.address)}
          </span>
        </div>
      </td>

      {/* Phone No */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.phoneNo}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.email}
          </span>    
        </div>
      </td>

      {/* Balance */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${
            parseFloat(item.balance) < 0 
              ? isDark ? "text-green-400" : "text-green-600"
              : isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            {formatBalance(item.balance)}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
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
          
          <button
            onClick={handlePDFClick}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-red-900/50 text-red-300 border border-red-700 hover:bg-red-800"
                : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
            }`}
            title="Download/Print Ledger Statement"
          >
            <FaFilePdf className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LedgerRow;