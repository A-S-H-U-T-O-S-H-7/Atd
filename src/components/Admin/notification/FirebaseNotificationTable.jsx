"use client";
import React, { useState, useEffect } from "react";
import { User, FileText, Calendar, Clock, Send, Eye, EyeOff, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FirebaseNotificationService } from '@/lib/services/FirebaseNotificationService';

const FirebaseNotificationRow = ({ notification, index, isDark, onDelete }) => {
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
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const truncatedComment = notification.comment?.length > 100 
    ? notification.comment.substring(0, 100) + "..."
    : notification.comment || '';

  const handleDelete = async () => {
    await onDelete(notification.user_id, notification.notification_id);
  };

  const isRead = notification.status === 1;

  return (
    <tr className={`border-b transition-all duration-200 hover:shadow-lg ${isDark ? "border-emerald-700 hover:bg-gray-700/50" : "border-emerald-300 hover:bg-emerald-50/50"} ${index % 2 === 0 ? isDark ? "bg-gray-700/30" : "bg-gray-50" : ""}`}>
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-100 text-emerald-700"}`}>
          {index + 1}
        </div>
      </td>

      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <User className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
          <div>
            <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              User ID: {notification.user_id}
            </span>
            <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Firebase ID: {notification.firebase_id?.substring(0, 10)}...
            </div>
          </div>
        </div>
      </td>

      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <FileText className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {notification.subject}
          </span>
        </div>
      </td>

      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {showFullComment ? notification.comment : truncatedComment}
          {notification.comment?.length > 100 && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className={`ml-2 text-xs font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"} hover:underline`}
            >
              {showFullComment ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </td>

      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {formatDate(notification.created_at)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {formatTime(notification.created_at)}
            </span>
          </div>
        </div>
      </td>

      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        {notification.updated_at && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className={`w-4 h-4 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {formatDate(notification.updated_at)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={`w-4 h-4 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {formatTime(notification.updated_at)}
              </span>
            </div>
          </div>
        )}
        {!notification.updated_at && (
          <span className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Not read yet
          </span>
        )}
      </td>

      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isRead
            ? isDark ? "bg-green-900/50 text-green-300 border border-green-700" : "bg-green-100 text-green-800 border border-green-300"
            : isDark ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700" : "bg-yellow-100 text-yellow-800 border border-yellow-300"
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

      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Send className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {notification.sender}
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <button
          onClick={handleDelete}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${isDark ? "bg-red-900/50 text-red-300 border border-red-700 hover:bg-red-800" : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"}`}
          title="Delete Notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

const FirebaseNotificationTable = ({ isDark }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Load notifications with real-time listener
  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = FirebaseNotificationService.subscribeToNotifications((result) => {
      if (result.success) {
        setNotifications(result.notifications);
        setTotalCount(result.total);
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        FirebaseNotificationService.unsubscribeFromNotifications(unsubscribe);
      }
    };
  }, []);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleDeleteNotification = async (userId, notificationId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will delete the notification for User ${userId}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isDark ? '#059669' : '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#e5e7eb' : '#374151',
      customClass: {
        popup: 'rounded-xl',
        title: 'text-lg font-bold',
        confirmButton: 'rounded-lg px-4 py-2 font-medium',
        cancelButton: 'rounded-lg px-4 py-2 font-medium'
      }
    });

    if (result.isConfirmed) {
      const deleteResult = await FirebaseNotificationService.deleteNotification(userId, notificationId);
      
      if (deleteResult.success) {
        toast.success('Notification deleted successfully from Firebase!');
      } else {
        toast.error('Failed to delete notification');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
  };

  return (
    <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${isDark ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20" : "bg-white border-emerald-300 shadow-emerald-500/10"}`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b-2 ${isDark ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50" : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`}>
              Firebase Notifications ({totalCount})
            </h2>
            <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Real-time notifications from Firebase • Updates automatically
            </p>
          </div>
          
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Show:
            </span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className={`px-3 py-2 rounded-lg border-2 font-medium transition-all ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white"
                  : "bg-white border-emerald-300 text-gray-900"
              }`}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className={`border-b-2 ${isDark ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50" : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"}`}>
            <tr>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`}>
                S.No.
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`}>
                User
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`}>
                Subject
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`}>
                Message
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`}>
                Created Date & Time
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`}>
                Read Date & Time
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`}>
                Status
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`}>
                Sender
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentNotifications.map((notification, index) => (
              <FirebaseNotificationRow
                key={notification.notification_id}
                notification={notification}
                index={indexOfFirstItem + index}
                isDark={isDark}
                onDelete={handleDeleteNotification}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && notifications.length === 0 && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <Send className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">No notifications found in Firebase</p>
            <p className="text-sm">Notifications will appear here when sent</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Loading Firebase notifications...</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`px-6 py-4 border-t-2 ${isDark ? "border-emerald-600/50 bg-gray-800/50" : "border-emerald-300 bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalCount)} of {totalCount} notifications
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === 1
                    ? isDark ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isDark ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className={`px-4 py-2 rounded-lg font-medium ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === totalPages
                    ? isDark ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isDark ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseNotificationTable;