import React from "react";
import {
  Calendar,
  Phone,
  Mail,
  Upload,
  Clock,
  Building2,
  X,
  SquarePen
} from "lucide-react";
import ExpandableText from "./ExpandableText";
import { Files } from "./Files";

const ComplaintRow = ({
  complaint,
  index,
  isDark,
  onUploadClick,
  onDetailClick,
  onFileView
}) => {
  const isClosed = complaint.status === "Close";
  
  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case "close":
        return isDark
          ? "bg-green-900/50 text-green-200 border-green-600"
          : "bg-green-100 text-green-800 border-green-400";
      case "open":
        return isDark
          ? "bg-yellow-900/50 text-yellow-200 border-yellow-600"
          : "bg-yellow-100 text-yellow-800 border-yellow-400";
      default:
        return isDark
          ? "bg-gray-700/50 text-gray-200 border-gray-500"
          : "bg-gray-100 text-gray-800 border-gray-400";
    }
  };

  // Row background based on status and theme
  const getRowBgColor = () => {
    if (isClosed) {
      return isDark
        ? "bg-green-950/40 hover:bg-green-950/60"
        : "bg-green-200 hover:bg-green-100";
    }
    
    return index % 2 === 0
      ? isDark
        ? "bg-gray-800/40 hover:bg-gray-700/60"
        : "bg-gray-50 hover:bg-gray-100"
      : isDark
        ? "bg-gray-900/40 hover:bg-gray-700/60"
        : "bg-white hover:bg-gray-100";
  };

  // Border color based on status and theme
  const getBorderColor = () => {
    if (isClosed) {
      return isDark
        ? "border-green-800/70"
        : "border-green-300";
    }
    
    return isDark
      ? "border-gray-700"
      : "border-gray-200";
  };

  // Row hover effect based on status
  const getRowHoverEffect = () => {
    if (isClosed) {
      return isDark
        ? "hover:shadow-lg hover:shadow-green-900/30"
        : "hover:shadow-md hover:shadow-green-200/50";
    }
    
    return isDark
      ? "hover:shadow-lg hover:shadow-gray-900/50"
      : "hover:shadow-md";
  };

  // Text color for closed rows
  const getTextColor = () => {
    if (isClosed) {
      return isDark ? "text-green-100" : "text-green-900";
    }
    return isDark ? "text-gray-100" : "text-gray-900";
  };

  const getSecondaryTextColor = () => {
    if (isClosed) {
      return isDark ? "text-green-200" : "text-green-800";
    }
    return isDark ? "text-gray-200" : "text-gray-700";
  };

  const getIconColor = () => {
    if (isClosed) {
      return isDark ? "text-green-400" : "text-green-600";
    }
    return isDark ? "text-emerald-400" : "text-emerald-600";
  };

  const getCellBorderColor = () => {
    if (isClosed) {
      return isDark ? "border-green-800/50" : "border-green-200";
    }
    return isDark ? "border-gray-700" : "border-gray-200";
  };

  return (
    <tr
      className={`border-b transition-all duration-200 ${getRowHoverEffect()} ${getRowBgColor()} ${getBorderColor()}`}
    >
      {/* SR No */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <span className={`font-medium ${getTextColor()}`}>
          {complaint.srNo}
        </span>
      </td>

      {/* Complaint Date */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${getIconColor()}`} />
          <span className={`text-sm font-medium ${getSecondaryTextColor()}`}>
            {complaint.complaintDate}
          </span>
        </div>
      </td>

      {/* Customer */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <div className="flex items-center space-x-3">
          <div>
            <p className={`font-medium text-sm ${getTextColor()}`}>
              {complaint.name}
            </p>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Phone className={`w-4 h-4 ${getIconColor()}`} />
            <span className={`text-xs font-medium ${getSecondaryTextColor()}`}>
              {complaint.mobileNo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className={`w-4 h-4 ${getIconColor()}`} />
            <span className={`text-xs ${getSecondaryTextColor()}`}>
              {complaint.email}
            </span>
          </div>
        </div>
      </td>

      {/* Loan No */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <span className={`text-sm font-semibold ${getIconColor()}`}>
          {complaint.loanNo || "N/A"}
        </span>
      </td>

      {/* Loan Belong To */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <div className="flex items-center space-x-2">
          <Building2 className={`w-4 h-4 ${getIconColor()}`} />
          <span className={`text-sm ${getSecondaryTextColor()}`}>
            {complaint.loanBelongTo || "N/A"}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
            complaint.status
          )}`}
        >
          {complaint.status}
        </span>
      </td>

      {/* Complaint Details */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`} style={{ maxWidth: "200px" }}>
        <ExpandableText
          text={complaint.complaintDetails}
          maxLength={80}
          isDark={isDark}
        />
      </td>

      {/* Complaint Documents */}
      <td className={`px-2 py-2 border-r ${getCellBorderColor()}`}>
        <div className="flex items-center flex-wrap gap-1">
          {complaint.complaintDocuments?.length > 0 ? (
            complaint.complaintDocuments.map((doc, index) => (
              <button
                key={`complaint-${doc.file}-${index}`}
                onClick={() => onFileView(doc.url)}
                className={`p-1.5 rounded-md transition-all duration-200 hover:scale-110 cursor-pointer ${
                  isClosed
                    ? isDark
                      ? "hover:bg-green-800/50"
                      : "hover:bg-green-200"
                    : isDark
                      ? "hover:bg-gray-600"
                      : "hover:bg-indigo-200"
                }`}
                title={`View ${doc.file.split('/').pop() || 'document'}`}
              >
                <Files fileUrl={doc.url} isDark={isDark} size="w-6 h-6" />
              </button>
            ))
          ) : (
            <div
              className="p-1.5 rounded-md"
              title="No Complaint Documents"
            >
              <X className={`w-6 h-6 ${isDark ? "text-red-400" : "text-red-500"}`} />
            </div>
          )}
        </div>
      </td>

      {/* Complaint For */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <span className={`text-sm ${getSecondaryTextColor()}`}>
          {complaint.complaintFor || "N/A"}
        </span>
      </td>

      {/* Complaint Assign To */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <span className={`text-sm font-medium ${getSecondaryTextColor()}`}>
          {complaint.assignedTo || "N/A"}
        </span>
      </td>

      {/* Complaint Assign Date */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${getIconColor()}`} />
          <span className={`text-sm ${getSecondaryTextColor()}`}>
            {complaint.open_date || complaint.complaintAssignDate || "N/A"}
          </span>
        </div>
      </td>

      {/* Complaint Resolution */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`} style={{ maxWidth: "200px" }}>
        <ExpandableText
          text={complaint.complaintResolution}
          maxLength={60}
          isDark={isDark}
        />
      </td>

      {/* Resolution Documents */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <div className="flex items-center flex-wrap gap-1">
          {complaint.resolutionDocuments?.length > 0 ? (
            complaint.resolutionDocuments.map((doc, index) => (
              <button
                key={`resolution-${doc.file}-${index}`}
                onClick={() => onFileView(doc.url)}
                className={`p-1.5 rounded-md transition-all duration-200 hover:scale-110 cursor-pointer ${
                  isClosed
                    ? isDark
                      ? "hover:bg-green-800/50"
                      : "hover:bg-green-200"
                    : isDark
                      ? "hover:bg-gray-600"
                      : "hover:bg-emerald-200"
                }`}
                title={`View ${doc.file.split('/').pop() || 'document'}`}
              >
                <Files fileUrl={doc.url} isDark={isDark} size="w-6 h-6" />
              </button>
            ))
          ) : (
            <div
              className="p-1.5 rounded-md"
              title="No Resolution Documents"
            >
              <X className={`w-6 h-6 ${isDark ? "text-red-400" : "text-red-500"}`} />
            </div>
          )}
        </div>
      </td>

      {/* Complaint Close Date */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <span className={`text-sm ${getSecondaryTextColor()}`}>
          {complaint.complaintCloseDate || "N/A"}
        </span>
      </td>

      {/* Final Remarks */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <span className={`text-sm ${getSecondaryTextColor()}`}>
          {complaint.finalRemarks || "N/A"}
        </span>
      </td>

      {/* Upload */}
      <td className={`px-6 py-4 border-r ${getCellBorderColor()}`}>
        <button
          onClick={() => onUploadClick(complaint)}
          className={`p-2 cursor-pointer text-sm flex justify-center items-center gap-3 border-2 rounded-lg transition-colors duration-200 ${
            isClosed
              ? isDark
                ? "border-green-600 bg-green-900/50 hover:bg-green-800 text-green-100"
                : "border-green-500 bg-green-100 hover:bg-green-200 text-green-800"
              : isDark
                ? "border-blue-500 bg-blue-900/50 hover:bg-blue-800 text-blue-100"
                : "border-blue-500 bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
          title="Upload Document"
        >
          <Upload size={14} /> Upload
        </button>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDetailClick(complaint)}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              isClosed
                ? isDark
                  ? "bg-green-900/50 hover:bg-green-800 text-green-300"
                  : "bg-green-200 hover:bg-green-300 text-green-800"
                : isDark
                  ? "bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300"
                  : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
            }`}
            title="Edit Complaint"
          >
            <SquarePen />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ComplaintRow;