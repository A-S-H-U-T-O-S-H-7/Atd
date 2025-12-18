"use client";
import React, { useState } from "react";
import { User, FileText, Calendar, Clock, Send, Eye, EyeOff, Trash2 } from "lucide-react";
import Pagination from "../Pagination";

const NotificationRow = ({ notification, index, isDark, onDelete }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncatedComment = notification.comment.length > 100 
    ? notification.comment.substring(0, 100) + "..."
    : notification.comment;

  const handleDelete = async () => {
    await onDelete(notification.id);
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
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          isDark
            ? "bg-emerald-900/50 text-emerald-300"
            : "bg-emerald-100 text-emerald-700"
        }`}>
          {notification.sNo}
        </div>
      </td>

      {/* User Name */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <User className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
          <div>
            <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              {notification.userName}
            </span>
            {notification.crnno && (
              <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                CRN: {notification.crnno}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Subject */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <FileText className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {notification.subject}
          </span>
        </div>
      </td>

      {/* Message */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {showFullComment ? notification.comment : truncatedComment}
          {notification.comment.length > 100 && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className={`ml-2 text-xs font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"} hover:underline`}
            >
              {showFullComment ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </td>

      {/* Date & Time */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {formatDate(notification.createdAt)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {formatTime(notification.createdAt)}
            </span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          notification.status
            ? isDark
              ? "bg-green-900/50 text-green-300 border border-green-700"
              : "bg-green-100 text-green-800 border border-green-300"
            : isDark
            ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
            : "bg-yellow-100 text-yellow-800 border border-yellow-300"
        }`}>
          {notification.status ? (
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
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Send className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {notification.sender}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDelete}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-red-900/50 text-red-300 border border-red-700 hover:bg-red-800"
                : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
            }`}
            title="Delete Notification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const NotificationTable = ({ 
  paginatedNotifications,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onDeleteNotification,
  loading,
  totalItems
}) => {
  return (
    <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      {/* Table Header */}
      <div className={`px-6 py-5 border-b-2 ${
        isDark
          ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
          : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
      }`}>
        <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`}>
          Sent Notifications ({totalItems})
        </h2>
        <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          View and manage all sent notifications
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className={`border-b-2 ${
            isDark
              ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
              : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
          }`}>
            <tr>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`}>
                S.No.
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`}>
                User
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`}>
                Subject
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`}>
                Message
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`}>
                Date & Time
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`}>
                Status
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`}>
                Sender
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold ${
                isDark ? "text-gray-100" : "text-gray-700"
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedNotifications.map((notification, index) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                index={index}
                isDark={isDark}
                onDelete={onDeleteNotification}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {paginatedNotifications.length === 0 && !loading && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <Send className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">No notifications found</p>
            <p className="text-sm">Send your first notification to get started</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && paginatedNotifications.length === 0 && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <Send className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">Loading notifications...</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="px-4 py-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationTable;