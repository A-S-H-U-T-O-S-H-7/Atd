import React from "react";
import { 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  Briefcase, 
  CreditCard, 
  Shield, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  Check
} from "lucide-react";

const UsersMigrationRow = ({
  user,
  index,
  isDark,
  onMigration,
  onFileView
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

  // Handle migration click
  const handleMigrationClick = () => {
    if (user.migration_status === "migrated") {
      return; // Already migrated, do nothing
    }
    onMigration(user.id);
  };

  // Handle photo view
  const handlePhotoView = () => {
    if (user.selfie) {
      onFileView(user.selfie, 'selfie');
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
          ? isDark ? "bg-gray-700/30" : "bg-gray-50"
          : ""
      } ${user.migration_status === "migrated" ? "opacity-90" : ""}`}
    >
      {/* ID */}
      <td className={cellStyle}>
        <span className={`font-mono font-medium ${textPrimary}`}>
          {user.id}
        </span>
      </td>

      {/* CRN No */}
      <td className={cellStyle}>
        <span className={`font-mono font-medium ${textAccent}`}>
          {user.crnno}
        </span>
      </td>

      {/* Account ID */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>
          {user.accountId}
        </span>
      </td>

      
      {/* Full Name */}
      <td className={cellStyle}>
        <div className="flex flex-col">
          <span className={`font-medium ${textPrimary}`}>
            {user.fname} {user.lname}
          </span>
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            User
          </span>
        </div>
      </td>

      {/* DOB */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {formatDate(user.dob)}
        </span>
      </td>

     

      {/* Gender */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {user.gender}
        </span>
      </td>

      {/* Father's Name */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {user.fathername}
        </span>
      </td>

      {/* Phone */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-1">
          <Phone className={`w-3 h-3 ${textAccent}`} />
          <span className={`text-sm font-mono ${textSecondary}`}>
            {user.phone}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-1">
          <Mail className={`w-3 h-3 ${textAccent}`} />
          <span className={`text-xs ${textSecondary}`}>
            {user.email}
          </span>
        </div>
      </td>

      {/* Alt Email */}
      <td className={cellStyle}>
        {user.alt_email ? (
          <div className="flex items-center justify-center space-x-1">
            <Mail className={`w-3 h-3 ${textAccent}`} />
            <span className={`text-xs ${textSecondary}`}>
              {user.alt_email}
            </span>
          </div>
        ) : (
          <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            N/A
          </span>
        )}
      </td>

      {/* PAN No */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>
          {user.pan_no}
        </span>
      </td>

      {/* Aadhar No */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>
          {user.aadhar_no}
        </span>
      </td>

      

      {/* Organization */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-1">
          <Briefcase className={`w-3 h-3 ${textAccent}`} />
          <span className={`text-xs ${textSecondary}`}>
            {user.organisation_name}
          </span>
        </div>
      </td>

      

      

      {/* Migration Status */}
      <td className={cellStyle}>
        {user.migration_status === "migrated" ? (
          <div className={`flex flex-col items-center space-y-1`}>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
            }`}>
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs font-medium">Migrated</span>
            </div>
            {user.migration_date && (
              <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {formatDate(user.migration_date)}
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
          disabled={user.migration_status === "migrated"}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 flex items-center space-x-1 mx-auto ${
            user.migration_status === "migrated"
              ? isDark
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
              : isDark
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          }`}
        >
          {user.migration_status === "migrated" ? (
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

export default UsersMigrationRow;