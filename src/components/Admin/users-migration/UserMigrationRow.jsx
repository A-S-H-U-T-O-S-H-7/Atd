import React from "react";
import { Calendar, Mail, Phone, User, Briefcase, CreditCard, Shield, AlertCircle, CheckCircle, XCircle, Eye, Upload, Check } from "lucide-react";

const UsersMigrationRow = ({ user, index, isDark, onMigration, onFileView }) => {
  // Common cell styles
  const cellBase = "px-3 py-3 text-center border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;

  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Handle migration click
  const handleMigrationClick = () => {
    if (user.migration_status === "migrated") {
      return;
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
    <tr className={`border-b transition-all duration-200 hover:shadow-lg ${
      isDark
        ? "border-emerald-700 hover:bg-gray-700/50"
        : "border-emerald-300 hover:bg-emerald-50/50"
    } ${
      index % 2 === 0
        ? isDark ? "bg-gray-700/30" : "bg-gray-50"
        : ""
    }`}>
      {/* ID */}
      <td className={cellStyle}>
        <span className={`${textPrimary} font-mono text-sm font-semibold`}>
          {user.id}
        </span>
      </td>

      {/* CRN No */}
      <td className={cellStyle}>
        <span className={`${textPrimary} font-mono text-sm`}>
          {user.crnno}
        </span>
      </td>

      {/* Account ID */}
      <td className={cellStyle}>
        <span className={`${textPrimary} font-mono text-sm`}>
          {user.accountId}
        </span>
      </td>

      {/* Full Name & Gender */}
      <td className={cellStyle}>
        <div className="space-y-2">
          <div className={`${textPrimary} text-sm font-medium flex items-center justify-center gap-2`}>
            <User className="w-4 h-4 flex-shrink-0" />
            <span>{user.fname} {user.lname}</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700'
          }`}>
            <span>{user.gender}</span>
          </div>
        </div>
      </td>

      {/* DOB */}
      <td className={cellStyle}>
        <div className={`${textSecondary} flex items-center justify-center gap-2 text-sm`}>
          <Calendar className="w-4 h-4" />
          <span>{formatDate(user.dob)}</span>
        </div>
      </td>

      {/* Father's Name */}
      <td className={cellStyle}>
        <span className={`${textPrimary} text-sm`}>
          {user.fathername}
        </span>
      </td>

      {/* Phone & Email */}
      <td className={cellStyle}>
        <div className="space-y-2.5">
          <div className={`${textPrimary} flex items-center justify-center gap-2 text-sm`}>
            <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="font-medium">{user.phone}</span>
          </div>
          <div className={`${textSecondary} flex items-center justify-center gap-2 text-xs break-all px-2`}>
            <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>{user.email}</span>
          </div>
        </div>
      </td>

      {/* Aadhar & PAN */}
      <td className={cellStyle}>
        <div className="space-y-2.5">
          <div className={`${textPrimary} flex items-center justify-center gap-2 text-sm`}>
            <CreditCard className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="font-mono">{user.aadhar_no}</span>
          </div>
          <div className={`${textSecondary} flex items-center justify-center gap-2 text-xs`}>
            <Shield className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            <span className="font-mono font-semibold">{user.pan_no}</span>
          </div>
        </div>
      </td>

      {/* Organization */}
      <td className={cellStyle}>
        <div className={`${textPrimary} flex items-center justify-center gap-2 text-sm`}>
          <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <span>{user.organisation_name}</span>
        </div>
      </td>

      {/* Migration Status */}
      <td className={cellStyle}>
        {user.migration_status === "migrated" ? (
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold text-sm">Migrated</span>
            </div>
            {user.migration_date && (
              <div className={`${textSecondary} text-xs flex items-center justify-center gap-1.5`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(user.migration_date)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
            isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-50 text-amber-700'
          }`}>
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">Pending</span>
          </div>
        )}
      </td>

      {/* Action - Migration Button */}
      <td className={`${cellBase} ${cellBorder}`}>
        {user.migration_status === "migrated" ? (
          <button
            disabled
            className={`px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center gap-2 cursor-not-allowed ${
              isDark 
                ? 'bg-gray-700 text-gray-400' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            <Check className="w-4 h-4" />
            Migrated
          </button>
        ) : (
          <button
            onClick={handleMigrationClick}
            className={`px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center gap-2 transition-all ${
              isDark
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            Migrate
          </button>
        )}
      </td>
    </tr>
  );
};

export default UsersMigrationRow;