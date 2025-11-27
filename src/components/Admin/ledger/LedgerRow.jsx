"use client";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  CreditCard,
  Eye,
} from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
import { RefreshCw } from "lucide-react";
import CallButton from "../call/CallButton";
import Swal from 'sweetalert2';
import { exportService } from "@/lib/services/LedgerServices";

const LedgerRow = ({ item, index, isDark, onViewTransaction, onAdjustment }) => {
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleView = (item) => {
    onViewTransaction(item);
  };

  const handleAdjustment = (item) => {
    onAdjustment(item);  
  };

  // PDF Action Handler
  const handlePDFAction = async (item) => {
    const result = await Swal.fire({
      title: 'PDF Statement',
      text: `Choose action for ${item.name}'s ledger statement`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Download PDF',
      cancelButtonText: 'Cancel',
      showDenyButton: true,
      denyButtonText: 'Print',
      confirmButtonColor: '#10b981',
      denyButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });

    if (result.isConfirmed) {
      // Download PDF
      setPdfLoading(true);
      try {
        await exportService.downloadIndividualLedgerPDF(
          item.application_id, 
          item.name, 
          item.loanNo
        );
        
        await Swal.fire({
          title: 'PDF Downloaded!',
          text: `PDF statement for ${item.name} has been downloaded.`,
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        await Swal.fire({
          title: 'Download Failed!',
          text: error.message || 'Failed to download PDF. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });
      } finally {
        setPdfLoading(false);
      }
    } else if (result.isDenied) {
      // Print PDF
      try {
        await exportService.printIndividualLedger(item.application_id);
      } catch (error) {
        await Swal.fire({
          title: 'Print Failed!',
          text: error.message || 'Failed to open print view. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });
      }
    }
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return { status: 'normal', days: 0, color: 'green' };
    
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
      <td className={`text-md border-r px-1 ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <CallButton
          applicant={item}
          isDark={isDark}
          size="small"
          variant="default"
          className="px-2 py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105"
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
      </td>

      {/* Due Date */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <span className={`text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}>
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

      {/* Name */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-3">
          <div>
            <p className={`text-sm font-semibold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
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

      {/* Address */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-start space-x-2">
          <MapPin className={`w-4 h-4 mt-1 flex-shrink-0 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
          } leading-relaxed`}>
            {item.address}
          </span>
        </div>
      </td>

      {/* Phone No */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <p className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.phoneNo}
          </p>
        </div>
      </td>

      {/* Email */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <p className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.email}
          </p>    
        </div>
      </td>

      {/* Adjustment */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <button
          onClick={() => handleAdjustment(item)}
          className={`px-3 py-2 cursor-pointer rounded-md text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-pink-900/50 text-pink-300 border-pink-700 hover:bg-pink-800"
              : "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200"
          }`}
        >
          Adjustment
        </button>
      </td>

      {/* Balance */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${
            parseFloat(item.balance || 0) < 0 
              ? isDark ? "text-green-400" : "text-green-600"
              : isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            {formatBalance(item.balance)}
          </span>
        </div>
      </td>

      {/* Overdue Amount */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${
            isDark ? "text-red-400" : "text-red-600"
          }`}>
            {formatOverdue(item.over_due)}
          </span>
        </div>
      </td>

      {/* Settled */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${
            item.settled 
              ? isDark ? "text-green-400" : "text-green-600"
              : isDark ? "text-yellow-400" : "text-yellow-600"
          }`}>
            {item.settled ? 'Yes' : 'No'}
          </span>
        </div>
      </td>

      {/* Action */}
      <td className="px-2 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(item)}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-blue-900/50 text-blue-300 border border-blue-700 hover:bg-blue-800"
                : "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200"
            }`}
            title="View Transaction Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => handlePDFAction(item)}
            disabled={pdfLoading}
            className={`p-2 cursor-pointer rounded-md transition-all duration-200 hover:scale-105 flex items-center justify-center ${
              pdfLoading 
                ? "opacity-50 cursor-not-allowed"
                : isDark
                  ? "bg-red-800/80 text-white hover:bg-red-700 border border-red-700"
                  : "bg-red-500/10 text-red-700 hover:bg-red-100 border border-red-300"
            }`}
            title={pdfLoading ? "Processing..." : "PDF Statement Options"}
          >
            {pdfLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FaFilePdf className="w-4 h-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LedgerRow;