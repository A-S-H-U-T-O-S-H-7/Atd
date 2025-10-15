import React from "react";
import { Edit, Trash2, FileText, Upload, Eye } from "lucide-react";

const RbiGuidelinesTableRow = ({
  guideline,
  index,
  currentPage,
  itemsPerPage,
  isDark,
  onEdit,
  onDelete,
  onStatusClick,
  onUploadDocument,  
  onViewDocument
}) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "closed":
        return isDark
          ? "bg-green-900/30 text-green-300 border-green-600/50"
          : "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return isDark
          ? "bg-red-900/30 text-red-300 border-red-600/50"
          : "bg-red-50 text-red-700 border-red-200";
      default:
        return isDark
          ? "bg-gray-700/30 text-gray-300 border-gray-600/50"
          : "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit"
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const handleEditClick = () => {
    onEdit(guideline.id);
  };

  const handleDeleteClick = () => {
    onDelete(guideline.id, guideline.subject);
  };

  const handleStatusClick = () => {
    const status = guideline.status.toLowerCase();
    if (status === 'pending' || status === 'open') {
      onStatusClick(guideline);
    }
  };

  const handleViewDocument = () => {
    console.log("View document for guideline:", guideline.id);
  };

  const handleUploadDocument = () => {
    console.log("Upload document for guideline:", guideline.id);
  };

  return (
    <tr
      className={`transition-all duration-200 ${isDark
        ? "hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-blue-900/20"
        : "hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50"}`}
    >
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-bold ${isDark
            ? "text-white"
            : "text-gray-900"}`}
        >
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-medium ${isDark
            ? "text-gray-300"
            : "text-gray-700"}`}
        >
          {formatDate(guideline.guidelineDate)}
        </span>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-medium ${isDark
            ? "text-gray-300"
            : "text-gray-700"}`}
        >
          {guideline.referenceNo}
        </span>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium leading-relaxed ${isDark
              ? "text-white"
              : "text-gray-900"}`}
          >
            {guideline.subject}
          </p>
        </div>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-medium ${isDark
            ? "text-gray-300"
            : "text-gray-700"}`}
        >
          {guideline.cautionAdviceNo}
        </span>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark
            ? "text-gray-300"
            : "text-gray-700"}`}
        >
          {guideline.remarks || "-"}
        </span>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-medium ${isDark
            ? "text-gray-300"
            : "text-gray-700"}`}
        >
          {formatDateTime(guideline.lastModify)}
        </span>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div
          className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border cursor-pointer transition-all duration-200 hover:scale-105 ${
            guideline.status.toLowerCase() === 'pending' || guideline.status.toLowerCase() === 'open'
              ? 'hover:shadow-md'
              : 'cursor-not-allowed opacity-75'
          } ${getStatusColor(guideline.status)}`}
          onClick={handleStatusClick}
        >
          <div
            className={`w-2 h-2 rounded-md mr-2 ${
              guideline.status.toLowerCase() === 'closed' 
                ? 'bg-green-400' 
                : guideline.status.toLowerCase() === 'pending'
                ? 'bg-red-400'
                : 'bg-gray-400'
            }`}
          />
          <span className="capitalize">{guideline.status}</span>
        </div>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-medium ${isDark
            ? "text-gray-300"
            : "text-gray-700"}`}
        >
          {guideline.addedBy}
        </span>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex flex-col items-center space-y-2">
          {/* Upload Button */}
          <button
            onClick={() => onUploadDocument(guideline)}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 text-xs font-medium ${
              isDark
                ? "bg-blue-900/50 hover:bg-blue-800/50 text-blue-400 border border-blue-600/50"
                : "bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300"
            }`}
          >
            <Upload className="w-3 h-3 inline mr-1" />
            Upload
          </button>

          {/* Document Links */}
          <div className="flex flex-col space-y-1">
            {guideline.documents?.["rbi-guidelines"] && (
              <div className="flex items-center space-x-1">
                <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  RBI Guidelines
                </span>
                <button
                  onClick={() => onViewDocument(guideline.id, "rbi-guidelines")}
                  className={`p-1 rounded transition-all duration-200 hover:scale-105 ${
                    isDark
                      ? "hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-600/30"
                      : "hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {guideline.documents?.["resolution"] && (
              <div className="flex items-center space-x-1">
                <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Resolution
                </span>
                <button
                  onClick={() => onViewDocument(guideline.id, "resolution")}
                  className={`p-1 rounded transition-all duration-200 hover:scale-105 ${
                    isDark
                      ? "hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-600/30"
                      : "hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
      
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-medium ${isDark
            ? "text-gray-300"
            : "text-gray-700"}`}
        >
          {formatDateTime(guideline.createdDate)}
        </span>
      </td>
      
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEditClick}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-blue-900/50 hover:bg-blue-800/50 text-blue-400 border border-blue-600/50"
                : "bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300"
            }`}
            title="Edit Guideline"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-600/50"
                : "bg-red-100 hover:bg-red-200 text-red-600 border border-red-300"
            }`}
            title="Delete Guideline"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RbiGuidelinesTableRow;