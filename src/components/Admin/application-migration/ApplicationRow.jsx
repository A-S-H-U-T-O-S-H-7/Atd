import React from "react";
import { 
  Calendar, 
  DollarSign, 
  Percent, 
  Clock, 
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Check,
  User
} from "lucide-react";

const ApplicationMigrationRow = ({
  application,
  index,
  srNo,
  isDark,
  onMigration
}) => {
  // Common cell styles
  const cellBase = "px-3 py-3 text-center border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;

  // Format currency
  const formatCurrency = amount => {
    if (!amount && amount !== 0) return "₹0";
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "₹0";
    return `₹${numAmount.toLocaleString("en-IN")}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "Sanctioned":
      case "Disbursed":
      case "Approved":
        return isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700";
      case "Rejected":
        return isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700";
      default:
        return isDark ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-700";
    }
  };

  // Handle migration click
  const handleMigrationClick = () => {
    if (application.migration_status === "migrated") {
      return; // Already migrated, do nothing
    }
    onMigration(application.id);
  };

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
      } ${application.migration_status === "migrated" ? "opacity-90" : ""}`}
    >
      {/* Sr. No */}
      <td className={cellStyle}>
        <span className={`font-medium ${textPrimary}`}>
          {srNo}
        </span>
      </td>

      {/* Loan No */}
      <td className={cellStyle}>
        <span className={`font-mono font-medium ${textAccent}`}>
          {application.loan_no}
        </span>
      </td>

      {/* CRN No */}
      <td className={cellStyle}>
        <span className={`font-mono font-medium ${textSecondary}`}>
          {application.crnno}
        </span>
      </td>

      {/* Account ID */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>
          {application.accountId}
        </span>
      </td>

      {/* Name */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-1">
          <User className={`w-3 h-3 ${textAccent}`} />
          <span className={`text-sm font-medium ${textPrimary}`}>
            {application.name}
          </span>
        </div>
      </td>

      {/* Applied Amount */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-1">
          <span className={`text-sm font-semibold ${textPrimary}`}>
            {formatCurrency(application.applied_amount)}
          </span>
        </div>
      </td>

      {/* Approved Amount */}
      <td className={cellStyle}>
        <div className={`px-2 py-1 rounded ${isDark ? "bg-emerald-900/20" : "bg-emerald-50"}`}>
          <span className={`text-sm font-bold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
            {formatCurrency(application.approved_amount)}
          </span>
        </div>
      </td>

      

      

      {/* Loan Status */}
      <td className={cellStyle}>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.loan_status)}`}>
          {application.loan_status}
        </div>
      </td>

     

      

      

      {/* Approved Date */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-1">
          <Calendar className={`w-3 h-3 ${textAccent}`} />
          <span className={`text-xs ${textSecondary}`}>
            {formatDate(application.approved_date)}
          </span>
        </div>
      </td>

      {/* Created Date */}
      <td className={cellStyle}>
        <span className={`text-xs ${textSecondary}`}>
          {formatDate(application.created_at)}
        </span>
      </td>

      
      {/* Migration Status */}
      <td className={cellStyle}>
        {application.migration_status === "migrated" ? (
          <div className={`flex flex-col items-center space-y-1`}>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
            }`}>
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs font-medium">Migrated</span>
            </div>
            {application.migration_date && (
              <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {formatDate(application.migration_date)}
              </span>
            )}
          </div>
        ) : (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full mx-auto ${
            isDark ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-700"
          }`}>
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs font-medium">Pending</span>
          </div>
        )}
      </td>

      {/* Action - Migration Button */}
      <td className={cellStyle}>
        <button
          onClick={handleMigrationClick}
          disabled={application.migration_status === "migrated"}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 flex items-center space-x-1 mx-auto ${
            application.migration_status === "migrated"
              ? isDark
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
              : isDark
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          }`}
        >
          {application.migration_status === "migrated" ? (
            <>
              <Check className="w-3 h-3" />
              <span>Migrated</span>
            </>
          ) : (
            <>
              <Upload className="w-3 h-3" />
              <span>Migrate</span>
            </>
          )}
        </button>
      </td>
    </tr>
  );
};

export default ApplicationMigrationRow;