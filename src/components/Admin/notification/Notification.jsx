'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import NotificationForm from './NotificationForm';
import ManageNotifications from './ManageNotifications'; // Import ManageNotifications instead
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { notificationAPI } from '@/lib/services/NotificationServices';

const NotificationPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [emailOptions, setEmailOptions] = useState([]);

  useEffect(() => {
    fetchEmailList();
  }, []);

  const fetchEmailList = async () => {
    try {
      const response = await notificationAPI.getEmailList();
      if (response?.success) {
        setEmailOptions(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching email list:", error);
    }
  };

  const handleFormSubmit = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </button>
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${isDark ? "from-emerald-400 to-teal-400" : "from-gray-800 to-black"} bg-clip-text text-transparent`}>
                  Notification Management
                </h1>
                <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Send notifications • Unified SQL + Firebase view
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="space-y-8">
          <NotificationForm 
            emailOptions={emailOptions}
            onSuccess={handleFormSubmit}
            isDark={isDark}
          />
          
          {/* Use ManageNotifications instead of UnifiedNotificationTable */}
          <ManageNotifications key={refreshKey} isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;