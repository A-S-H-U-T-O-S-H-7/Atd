import React from "react";
import { Calendar, Hash, FileText, MessageSquare, User, CheckCircle, Clock } from "lucide-react";

const HelpTicketRow = ({ item, index, isDark, onReplyClick, onSummaryClick }) => {
  const getStatusBadge = (status) => {
    if (status === "Closed") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Closed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Clock className="w-3 h-3 mr-1" />
          Open
        </span>
      );
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
          ? isDark 
            ? "bg-gray-700/50" 
            : "bg-gray-100"
          : ""
      }`}
    >
      {/* Issue Date */}
      <td className={`px-4 py-3 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.issueDate}
          </span>
        </div>
      </td>

      {/* Ticket ID */}
      <td className={`px-4 py-3 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Hash className={`w-4 h-4 ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.ticketId}
          </span>
        </div>
      </td>

      {/* Subject */}
      <td className={`px-4 py-3 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <FileText className={`w-4 h-4 ${
            isDark ? "text-green-400" : "text-green-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.subject}
          </span>
        </div>
      </td>

      {/* Message */}
      <td className={`px-4 py-3 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <MessageSquare className={`w-4 h-4 ${
            isDark ? "text-orange-400" : "text-orange-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.message}
          </span>
        </div>
      </td>

      {/* User */}
      <td className={`px-4 py-3 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <User className={`w-4 h-4 ${
            isDark ? "text-cyan-400" : "text-cyan-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.user}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className={`px-4 py-3 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        {getStatusBadge(item.status)}
      </td>

      {/* Action */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onReplyClick(item)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Reply
          </button>
          <button
            onClick={() => onSummaryClick(item)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
              isDark
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Summary
          </button>
        </div>
      </td>
    </tr>
  );
};

export default HelpTicketRow;