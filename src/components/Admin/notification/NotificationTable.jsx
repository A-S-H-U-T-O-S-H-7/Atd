"use client";
import React from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import NotificationRow from "./NotificationRow";

const NotificationTable = ({ 
  notifications, 
  loading,
  currentPage,
  itemsPerPage,
  totalCount,
  isDark,
  onPageChange,
  onItemsPerPageChange,
  onDeleteNotification
}) => {
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Common styles
  const headerStyle = `px-4 py-4 text-left text-xs font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
  }`;
  
  const tableContainerStyle = `rounded-2xl shadow-2xl border-2 overflow-hidden ${
    isDark 
      ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20" 
      : "bg-white border-emerald-300 shadow-emerald-500/10"
  }`;
  
  const headerBgStyle = isDark 
    ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50" 
    : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300";
  
  const paginationStyle = `px-6 py-4 border-t-2 ${
    isDark 
      ? "border-emerald-600/50 bg-gray-800/50" 
      : "border-emerald-300 bg-gray-50"
  }`;
  
  const paginationText = isDark ? "text-gray-300" : "text-gray-700";
  const paginationBtnStyle = isDark 
    ? "bg-emerald-600 text-white hover:bg-emerald-500" 
    : "bg-emerald-500 text-white hover:bg-emerald-600";
  
  const paginationBtnDisabled = isDark 
    ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
    : "bg-gray-200 text-gray-400 cursor-not-allowed";

  // Table headers configuration
  const tableHeaders = [
    { label: "S.No.", width: "80px" },
    { label: "User", width: "180px" },
    { label: "Subject", width: "150px" },
    { label: "Message", width: "220px" },
    { label: "Created Date & Time", width: "150px" },
    { label: "Read Date & Time", width: "150px" },
    { label: "Status", width: "100px" },
    { label: "Sender", width: "120px" },
    { label: "Actions", width: "100px" }
  ];

  return (
    <div className={tableContainerStyle}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className={`border-b-2 ${headerBgStyle}`}>
            <tr>
              {tableHeaders.map((header, index) => (
                <th 
                  key={index}
                  className={headerStyle}
                  style={{ minWidth: header.width }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentNotifications.map((notification, index) => (
              <NotificationRow
                key={`${notification.sql_id}_${notification.firebase_id}_${notification.user_id}`}
                notification={notification}
                index={indexOfFirstItem + index}
                isDark={isDark}
                onDelete={onDeleteNotification}
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
            <p className="text-lg font-medium">No notifications found</p>
            <p className="text-sm">Send your first notification to get started</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Loading notifications...</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={paginationStyle}>
          <div className="flex items-center justify-between">
            <div className={`text-sm ${paginationText}`}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalCount)} of {totalCount} notifications
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === 1 ? paginationBtnDisabled : paginationBtnStyle
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className={`px-4 py-2 rounded-lg font-medium ${
                isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
              }`}>
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${
                  currentPage === totalPages ? paginationBtnDisabled : paginationBtnStyle
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

export default NotificationTable;