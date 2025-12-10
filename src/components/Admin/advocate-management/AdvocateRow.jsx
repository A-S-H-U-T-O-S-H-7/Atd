// app/crm/advocate/components/AdvocateRow.jsx
'use client';
import React from 'react';
import { 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Calendar,
  Edit2,
  Power,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdvocateRow = ({ advocate, index, isDark, onEdit, onToggleStatus }) => {
  const getStatusColor = (isActive) => {
    return isActive
      ? isDark
        ? "bg-green-900/50 text-green-300 border-green-700"
        : "bg-green-100 text-green-800 border-green-200"
      : isDark
        ? "bg-red-900/50 text-red-300 border-red-700"
        : "bg-red-100 text-red-800 border-red-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
      {/* S.No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {index + 1}
        </span>
      </td>

      {/* Name and Email */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "250px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`font-medium text-sm ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              {advocate.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {advocate.email}
            </span>
          </div>
        </div>
      </td>

      {/* Court */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="flex items-start space-x-2">
          <Building className={`w-4 h-4 mt-0.5 ${isDark ? "text-green-400" : "text-green-600"}`} />
          <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {advocate.court}
          </span>
        </div>
      </td>

      {/* Address */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "300px" }}>
        <div className="flex items-start space-x-2">
          <MapPin className={`w-4 h-4 mt-0.5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          <div className="flex-1">
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {advocate.address.length > 100 
                ? `${advocate.address.substring(0, 100)}...` 
                : advocate.address}
            </p>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Phone className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
            <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {advocate.phone.split(',')[0].trim()}
            </span>
          </div>
          {advocate.phone.split(',').length > 1 && (
            <div className="flex items-center space-x-2">
              <Phone className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
              <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                +{advocate.phone.split(',').length - 1} more
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Licence No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "150px" }}>
        <div className="flex items-center space-x-2">
          <FileText className={`w-4 h-4 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {advocate.licenceNo}
          </span>
        </div>
      </td>

      {/* Added By & Date */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <User className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              By: {advocate.addedBy}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {formatDate(advocate.createdAt)}
            </span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(advocate.isActive)}`}>
          {advocate.isActive ? (
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Active</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1">
              <XCircle className="w-3 h-3" />
              <span>Inactive</span>
            </span>
          )}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(advocate)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-blue-900/50 hover:bg-blue-800 text-blue-300"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700"
            }`}
            title="Edit Advocate"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleStatus(advocate.id)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              advocate.isActive
                ? isDark
                  ? "bg-red-900/50 hover:bg-red-800 text-red-300"
                  : "bg-red-100 hover:bg-red-200 text-red-700"
                : isDark
                  ? "bg-green-900/50 hover:bg-green-800 text-green-300"
                  : "bg-green-100 hover:bg-green-200 text-green-700"
            }`}
            title={advocate.isActive ? "Deactivate" : "Activate"}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdvocateRow;