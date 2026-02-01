import React from "react";
import { Calendar, Mail, Edit, CheckCircle, X, Edit2, FileText } from "lucide-react";
import { useAdminAuthStore } from '@/lib/store/authAdminStore';

import CallButton from "../call/CallButton";
import CRNLink from "../CRNLink";
import toast from "react-hot-toast";

const DisburseRow = ({
  application,
  index,
  isDark,
   onBankVerification,
  onDisburseApproval,
  onStatusClick,
  
}) => {
  
  const { hasPermission } = useAdminAuthStore();

  const formatCurrency = amount => {
  if (!amount && amount !== 0) return "0";
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return "0";
  return `${numAmount.toLocaleString("en-IN", {
  })}`;
};  

  // Bank verification handler
  const handleBankVerificationClick = () => {
    if (application.bankVerification === "not_verified" && onBankVerification) {
      onBankVerification(application);
    }
  };

  // Disburse approval handler
  const handleDisburseApprovalClick = () => {
    if (application.disburseApproval === "not_approved" && onDisburseApproval) {
      onDisburseApproval(application);
    }
  };

  // Common cell styles
  const cellBase = "px-2 py-3 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-emerald-50/50"
      } ${
        index % 2 === 0
          ? isDark ? "bg-gray-700/30" : "bg-gray-50"
          : ""
      }`}
    >
      {/* SR No */}
      <td className={cellStyle}>
        <span className={`font-medium ${textPrimary}`}>
          {application.srNo}
        </span>
      </td>

      {/* Call */}
      <td className={cellStyle}>
  <CallButton
    applicant={application}
    isDark={isDark}
    size="small"
    variant="default"
    className="px-6 py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105"
  />
</td>

      {/* Loan No. */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.loanNo}
        </span>
      </td>

      {/* CRN No */}
      <td className={cellStyle}>
      <CRNLink 
        crnNo={application.crnNo} 
        userId={application.userId}
        onSuccess={(data) => {
          toast.success('Profile loaded');
        }}
        onError={(error) => {
          toast.error(error);
        }}
      />
      </td>

      {/* Approved Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {application.approvedDate}
          </span>
        </div>
      </td>

      {/* Disburse Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {application.disburseDate}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {application.dueDate}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className={cellStyle}>
        <span className={`font-medium text-sm ${textPrimary}`}>
          {application.name}
        </span>
      </td>

      
      {/* Applied Amount */}
      <td className={cellStyle}>
        <div className="bg-gradient-to-r px-2 rounded-md from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
          <span className={`text-sm font-semibold`}>
            {formatCurrency(application.appliedAmount)}
          </span>
        </div>
      </td>

      {/* Approved Amount */}
      <td className={cellStyle}>
        <div className="bg-gradient-to-r px-2 rounded-md from-orange-100 to-orange-200 text-orange-800 border border-orange-300">
          <span className={`text-sm font-semibold`}>
            {formatCurrency(application.approvedAmount)}
          </span>
        </div>
      </td>

      {/* Admin Fee */}
      <td className={cellStyle}>
  <div className="flex flex-col">
    <span className={`text-sm font-semibold ${textSecondary}`}>
      {formatCurrency(application.adminFee)}
    </span>
    <span className={`text-xs ${isDark ? "text-emerald-300" : "text-emerald-600 font-semibold "}`}>
      ({application.processPercent || 0}%)
    </span>
  </div>
</td>

      {/* ROI */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.roi}%
        </span>
      </td>

      {/* Tenure */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.tenure} days
        </span>
      </td>

      

      {/* Customer A/c Verified */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          {application.customerAcVerified === "Yes" ? (
            <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Yes</span>
            </span>
          ) : (
            <button className="px-3 py-1 rounded-2xl text-xs font-medium transition-all duration-200 bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg transform flex items-center space-x-1">
              <X className="w-3 h-3" />
              <span>No</span>
            </button>
          )}
        </div>
      </td>   

      {/* Bank A/c Verification */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          <button
            onClick={handleBankVerificationClick}
            disabled={application.bankVerification === "verified"}
            className={`px-3 py-1 border rounded-md text-xs font-medium flex items-center justify-center space-x-1 transition-colors duration-200 ${
              application.bankVerification === "not_verified"
                ? "bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                : "bg-green-100 text-green-600 cursor-default"
            }`}
          >
            {application.bankVerification === "not_verified" ? (
              <span>Not Verified</span>
            ) : (
              <>
                <CheckCircle size={14} />
                <span>Verified</span>
              </>
            )}
          </button>
        </div>
      </td>

      {/* Disburse Approval */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          <button
            onClick={handleDisburseApprovalClick}
            disabled={application.disburseApproval === "approved"}
            className={`px-3 py-1 border rounded-md text-xs font-medium flex items-center justify-center space-x-1 transition-colors duration-200 ${
              application.disburseApproval === "not_approved"
                ? "bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                : "bg-green-100 text-green-600 cursor-default"
            }`}
          >
            {application.disburseApproval === "not_approved" ? (
              <span>Not Approved</span>
            ) : (
              <>
                <CheckCircle size={14} />
                <span>Approved</span>
              </>
            )}
          </button>
        </div>
      </td>

      {/* Loan Status */}
<td className={cellStyle}>
  <div className="relative group">
    {!hasPermission('disburse_status') ? (
      <div className="opacity-50 cursor-not-allowed pointer-events-none">
        <button
          className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${
            isDark 
              ? "bg-gray-900/50 text-gray-300 border border-gray-700" 
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          Disburse
        </button>
      </div>
    ) : (
      <button
        onClick={() => onStatusClick(application)}
        className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
          isDark 
            ? "bg-gradient-to-r from-cyan-100 to-cyan-300 text-cyan-800 border border-cyan-700 hover:bg-cyan-800" 
            : "bg-gradient-to-r from-cyan-200 to-cyan-300 text-cyan-800 border border-cyan-400 hover:bg-cyan-200"
        }`}
        title="Click to update loan status"
      >
        Disburse
      </button>
    )}
    
    {!hasPermission('disburse_status') && (
      <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          No permission to disburse
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    )}
  </div>
</td>

      
    </tr>
  );
};

export default DisburseRow;