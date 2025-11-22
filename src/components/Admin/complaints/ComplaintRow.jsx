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
import { IoDocumentAttach } from "react-icons/io5";
import ExpandableText from "./ExpandableText";

const ComplaintRow = ({
  complaint,
  index,
  isDark,
  onUploadClick,
  onDetailClick,
  onFileView
}) => {
  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case "close":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case "open":
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <tr
      className={`border-b  transition-all duration-200 hover:shadow-lg ${isDark
        ? "border-emerald-700 hover:bg-gray-700/50"
        : "border-emerald-300 hover:bg-emerald-50/50"} ${index % 2 === 0
        ? isDark ? "bg-gray-700/30" : "bg-gray-50"
        : ""}`}
    >
      {/* SR No */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-medium ${isDark
            ? "text-gray-100"
            : "text-gray-900"}`}
        >
          {complaint.srNo}
        </span>
      </td>

      {/* Complaint Date */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Calendar
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-800"}`}
          >
            {complaint.complaintDate}
          </span>
        </div>
      </td>

      {/* Customer */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-3">
          <div>
            <p
              className={`font-medium text-sm ${isDark
                ? "text-gray-100"
                : "text-gray-900"}`}
            >
              {complaint.name}
            </p>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Phone
              className={`w-4 h-4 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
            <span
              className={`text-xs font-medium ${isDark
                ? "text-gray-200"
                : "text-gray-700"}`}
            >
              {complaint.mobileNo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail
              className={`w-4 h-4 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
            <span
              className={`text-xs ${isDark
                ? "text-gray-300"
                : "text-gray-600"}`}
            >
              {complaint.email}
            </span>
          </div>
        </div>
      </td>

      {/* Loan No */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {complaint.loanNo || "N/A"}
        </span>
      </td>

      {/* Loan Belong To */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Building2
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            {complaint.loanBelongTo || "N/A"}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
            complaint.status
          )}`}
        >
          {complaint.status}
        </span>
      </td>

      {/* Complaint Details */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ maxWidth: "200px" }}>
        <ExpandableText
          text={complaint.complaintDetails}
          maxLength={80}
          isDark={isDark}
        />
      </td>

      {/* Complaint Documents */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          {complaint.hasComplaintDocs
            ? <button
                onClick={() => onFileView(complaint, "complaint")}
                className="p-2 rounded-lg transition-colors duration-200 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 cursor-pointer"
                title="View Complaint Document"
              >
                <IoDocumentAttach className="text-xl" />
              </button>
            : <div
                className="p-1 rounded-lg bg-red-100 text-red-600"
                title="Document Missing"
              >
                <X />
              </div>}
        </div>
      </td>

      {/* Complaint For */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {complaint.complaintFor || "N/A"}
        </span>
      </td>

      {/* Complaint Assign To */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-medium ${isDark
            ? "text-gray-200"
            : "text-gray-700"}`}
        >
          {complaint.assignedTo || "N/A"}
        </span>
      </td>

      {/* Complaint Assign Date */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Clock
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            {complaint.open_date || complaint.complaintAssignDate || "N/A"}
          </span>
        </div>
      </td>

      {/* Complaint Resolution */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ maxWidth: "200px" }}>
        <ExpandableText
          text={complaint.complaintResolution}
          maxLength={60}
          isDark={isDark}
        />
      </td>

      {/* Resolution Documents */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          {complaint.hasResolutionDocs
            ? <button
                onClick={() => onFileView(complaint, "resolution")}
                className="p-2 rounded-lg border border-indigo-400 transition-colors duration-200 bg-indigo-200 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
                title="View Resolution Document"
              >
                <IoDocumentAttach className="text-xl" />
              </button>
            : <div
                className="p-1 rounded-lg bg-red-100 text-red-600"
                title="Document Missing"
              >
                <X />
              </div>}
        </div>
      </td>

      {/* Complaint Close Date */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {complaint.complaintCloseDate || "N/A"}
        </span>
      </td>

      {/* Final Remarks */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {complaint.finalRemarks || "N/A"}
        </span>
      </td>

      {/* Upload */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <button
          onClick={() => onUploadClick(complaint)}
          className={`p-2 cursor-pointer text-sm flex justify-center items-center gap-3 border-2 border-blue-500 rounded-lg transition-colors duration-200 ${isDark
            ? "bg-blue-900/50 hover:bg-blue-800 text-gray-50"
            : "bg-blue-100 hover:bg-blue-200 text-blue-700"}`}
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
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
              ? "bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300"
              : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"}`}
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