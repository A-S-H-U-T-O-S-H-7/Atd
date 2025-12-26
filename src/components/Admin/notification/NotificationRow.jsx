"use client";
import React, { useState } from "react";
import { User, FileText, Calendar, Clock, Send, Eye, EyeOff, Trash2 } from "lucide-react";

const NotificationRow = ({ notification, index, isDark, onDelete }) => {
  const [showFullComment, setShowFullComment] = useState(false);

  // Common styles
  const cellBase = "px-4 py-4 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  const textBlue = isDark ? "text-blue-400" : "text-blue-600";
  const textPurple = isDark ? "text-purple-400" : "text-purple-600";
  const textGreen = isDark ? "text-green-400" : "text-green-600";
  const textYellow = isDark ? "text-yellow-400" : "text-yellow-600";
  
  // Icon styles
  const iconBlue = `w-4 h-4 ${textBlue}`;
  const iconPurple = `w-4 h-4 ${textPurple}`;
  const iconGreen = `w-4 h-4 ${textGreen}`;
  const iconYellow = `w-4 h-4 ${textYellow}`;
  
  // Background styles
  const bgAccent = isDark ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-100 text-emerald-700";
  const bgRead = isDark ? "bg-green-900/50 text-green-300 border border-green-700" : "bg-green-100 text-green-800 border border-green-300";
  const bgUnread = isDark ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700" : "bg-yellow-100 text-yellow-800 border border-yellow-300";
  const bgDelete = isDark ? "bg-red-900/50 text-red-300 border border-red-700 hover:bg-red-800" : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200";
  
  // Row background
  const evenRowBg = index % 2 === 0 
    ? (isDark ? "bg-gray-700/30" : "bg-gray-50") 
    : "";
  const hoverBg = isDark ? "hover:bg-gray-700/50" : "hover:bg-emerald-50/50";
  const rowBorder = isDark ? "border-emerald-700" : "border-emerald-300";

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const truncatedComment = notification.comment?.length > 80 
    ? notification.comment.substring(0, 80) + "..."
    : notification.comment || '-';

  const handleDelete = async () => {
    await onDelete(notification);
  };

  const isRead = notification.status === 1;

  return (
    <tr className={`border-b transition-all duration-200 hover:shadow-lg ${rowBorder} ${hoverBg} ${evenRowBg}`}>
      {/* S.No */}
      <td className={cellStyle}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${bgAccent}`}>
          {index + 1}
        </div>
      </td>

      {/* User (Name, CRN, User ID) */}
      <td className={cellStyle}>
        <div className="flex items-start space-x-2">
          <User className={`w-4 h-4 mt-1 ${textBlue}`} />
          <div className="space-y-1">
            {notification.userName ? (
              <div className={`font-medium ${textPrimary}`}>
                {notification.userName}
              </div>
            ) : (
              <div className={`font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                User (SQL N/A)
              </div>
            )}
            
            {notification.crnno && (
              <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                CRN: {notification.crnno}
              </div>
            )}
            
            <div className={`text-xs font-medium ${textBlue}`}>
              User ID: {notification.user_id || 'N/A'}
            </div>
          </div>
        </div>
      </td>

      {/* Subject */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <FileText className={iconPurple} />
          <span className={`font-medium ${textPrimary}`}>
            {notification.subject || '-'}
          </span>
        </div>
      </td>

      {/* Message (Reduced Width) */}
      <td className={`px-3 py-4 border-r max-w-[200px] ${cellBorder}`}>
        <div className={`text-sm ${textSecondary}`}>
          {showFullComment ? notification.comment : truncatedComment}
          {notification.comment?.length > 80 && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className={`ml-1 text-xs font-medium ${textAccent} hover:underline`}
            >
              {showFullComment ? "less" : "more"}
            </button>
          )}
        </div>
      </td>

      {/* Created Date & Time */}
      <td className={cellStyle}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className={iconGreen} />
            <span className={`text-sm ${textSecondary}`}>
              {formatDate(notification.created_at)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className={iconBlue} />
            <span className={`text-sm ${textSecondary}`}>
              {formatTime(notification.created_at)}
            </span>
          </div>
        </div>
      </td>

      {/* Read Date & Time */}
      <td className={cellStyle}>
        {notification.updated_at ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className={iconYellow} />
              <span className={`text-sm ${textSecondary}`}>
                {formatDate(notification.updated_at)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={iconYellow} />
              <span className={`text-sm ${textSecondary}`}>
                {formatTime(notification.updated_at)}
              </span>
            </div>
          </div>
        ) : (
          <span className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Not read yet
          </span>
        )}
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isRead ? bgRead : bgUnread
        }`}>
          {isRead ? (
            <>
              <Eye className="w-3 h-3 mr-1" />
              Read
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 mr-1" />
              Unread
            </>
          )}
        </div>
      </td>

      {/* Sender */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Send className={`w-4 h-4 ${textAccent}`} />
          <span className={`font-medium ${textPrimary}`}>
            {notification.sender || '-'}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <button
          onClick={handleDelete}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${bgDelete}`}
          title="Delete from Both Databases"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default NotificationRow;