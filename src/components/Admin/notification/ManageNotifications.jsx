"use client";
import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FirebaseNotificationService } from '@/lib/services/FirebaseNotificationService';
import { notificationAPI } from '@/lib/services/NotificationServices';
import NotificationTable from "./NotificationTable";

const ManageNotifications = ({ isDark }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const mergeNotifications = (sqlNotifications, firebaseNotifications) => {
    const merged = [];
    const firebaseMap = new Map();

    firebaseNotifications.forEach(fb => {
      const key = `${fb.user_id}_${fb.subject}`;
      if (!firebaseMap.has(key)) {
        firebaseMap.set(key, []);
      }
      firebaseMap.get(key).push(fb);
    });

    sqlNotifications.forEach(sql => {
      const key = `${sql.user_id}_${sql.subject}`;
      const fbMatches = firebaseMap.get(key) || [];
      
      let bestMatch = null;
      let minTimeDiff = 10000;
      
      fbMatches.forEach(fb => {
        const timeDiff = Math.abs(
          new Date(sql.created_at).getTime() - new Date(fb.created_at).getTime()
        );
        if (timeDiff < minTimeDiff) {
          minTimeDiff = timeDiff;
          bestMatch = fb;
        }
      });

      if (bestMatch) {
        merged.push({
          sql_id: sql.notification_id,
          firebase_id: bestMatch.firebase_id || bestMatch.notification_id,
          notification_id: bestMatch.notification_id || bestMatch.firebase_id,
          user_id: sql.user_id || bestMatch.user_id,
          userName: sql.user_name || null,
          crnno: sql.crnno || null,
          subject: bestMatch.subject,
          comment: bestMatch.comment,
          created_at: bestMatch.created_at,
          updated_at: bestMatch.updated_at || null,
          status: bestMatch.status || 0,
          sender: sql.sender || bestMatch.sender,
          hasSQL: true,
          hasFirebase: true
        });
      } else {
        merged.push({
          sql_id: sql.notification_id,
          firebase_id: null,
          notification_id: sql.notification_id,
          user_id: sql.user_id,
          userName: sql.user_name,
          crnno: sql.crnno,
          subject: sql.subject,
          comment: sql.comment,
          created_at: sql.created_at,
          updated_at: null,
          status: 0,
          sender: sql.sender,
          hasSQL: true,
          hasFirebase: false
        });
      }
    });

    merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return merged;
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const [sqlResponse, firebaseResponse] = await Promise.all([
        notificationAPI.getNotifications({ per_page: 1000, page: 1 }),
        FirebaseNotificationService.getAllNotifications()
      ]);

      const sqlNotifs = sqlResponse?.success ? sqlResponse.notifications.map(n => ({
        notification_id: n.id,
        user_id: n.user_id,
        user_name: n.userName,
        crnno: n.crnno,
        subject: n.subject,
        comment: n.comment,
        created_at: n.createdAt,
        sender: n.sender
      })) : [];

      const firebaseNotifs = firebaseResponse?.success ? firebaseResponse.notifications : [];
      const mergedData = mergeNotifications(sqlNotifs, firebaseNotifs);
      
      setNotifications(mergedData);
      setTotalCount(mergedData.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const unsubscribe = FirebaseNotificationService.subscribeToNotifications((result) => {
      if (result.success) {
        loadNotifications();
      }
    });

    return () => {
      if (unsubscribe) {
        FirebaseNotificationService.unsubscribeFromNotifications(unsubscribe);
      }
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleDeleteNotification = async (notification) => {
    const result = await Swal.fire({
      title: 'Delete Notification?',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p style="margin-bottom: 10px;"><strong>This will delete:</strong></p>
          <ul style="margin-top: 10px; list-style: none; padding-left: 0;">
            ${notification.hasSQL ? '<li style="color: #10b981;">✓ From SQL Database</li>' : '<li style="color: #6b7280;">✗ Not in SQL</li>'}
            ${notification.hasFirebase ? '<li style="color: #10b981;">✓ From Firebase Database</li>' : '<li style="color: #6b7280;">✗ Not in Firebase</li>'}
          </ul>
          <p style="margin-top: 15px; font-size: 14px; color: #6b7280;">
            User ID: ${notification.user_id}<br/>
            Subject: ${notification.subject}
          </p>
        </div>
      `,
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
      const deletePromises = [];
      let deletedFrom = [];

      if (notification.hasSQL && notification.sql_id) {
        deletePromises.push(
          notificationAPI.deleteNotification(notification.sql_id)
            .then(() => deletedFrom.push('SQL'))
            .catch(err => console.error('SQL delete failed:', err))
        );
      }

      if (notification.hasFirebase && notification.firebase_id && notification.user_id) {
        deletePromises.push(
          FirebaseNotificationService.deleteNotification(notification.user_id, notification.firebase_id)
            .then(() => deletedFrom.push('Firebase'))
            .catch(err => console.error('Firebase delete failed:', err))
        );
      }

      await Promise.all(deletePromises);

      if (deletedFrom.length > 0) {
        toast.success(`✓ Deleted from: ${deletedFrom.join(' & ')}`);
        setTimeout(() => loadNotifications(), 500);
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

  const handleRefresh = () => {
    loadNotifications();
  };

  const tableHeaderStyle = isDark 
    ? "text-gray-100 border-gray-600/40" 
    : "text-gray-700 border-gray-300/40";

  return (
    <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${isDark ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20" : "bg-white border-emerald-300 shadow-emerald-500/10"}`}>
      <div className={`px-6 py-5 border-b-2 ${isDark ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50" : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`}>
              All Notifications ({totalCount})
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

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
      </div>

      <NotificationTable
        notifications={notifications}
        loading={loading}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalCount={totalCount}
        isDark={isDark}
        onPageChange={handlePageChange}
        onDeleteNotification={handleDeleteNotification}
      />
    </div>
  );
};

export default ManageNotifications;