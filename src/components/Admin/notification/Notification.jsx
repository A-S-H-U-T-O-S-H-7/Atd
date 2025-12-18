'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Bell, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import FormFields from './FormFields';
import RichTextEditor from '../RichTextEditor';
import NotificationTable from './NotificationTable';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { notificationAPI, formatNotificationForUI } from '@/lib/services/NotificationServices';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const NotificationPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [customerType, setCustomerType] = useState('all');
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailOptions, setEmailOptions] = useState([]);
  
  // Table states
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Toggle state for form section
  const [isFormOpen, setIsFormOpen] = useState(false);

  const itemsPerPage = 10;

  // Fetch email list - run once
  const fetchEmailList = async () => {
    try {
      const response = await notificationAPI.getEmailList();
      if (response && response.success) {
        setEmailOptions(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching email list:", error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications({
        per_page: itemsPerPage,
        page: currentPage,
      });
      
      if (response && response.success) {
        const notificationsData = response.notifications || [];
        const formattedNotifications = notificationsData.map((notification, index) => 
          formatNotificationForUI(notification, index, currentPage, itemsPerPage)
        );
        
        setNotifications(formattedNotifications);
        setTotalCount(response.pagination?.total || notificationsData.length);
        setTotalPages(response.pagination?.total_pages || 1);
      } else {
        setNotifications([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setTotalCount(0);
      setTotalPages(0);
      toast.error("Failed to load notifications", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      fetchEmailList();
      fetchNotifications();
    }
  }, [initialLoad]);

  // Fetch notifications when page changes
  useEffect(() => {
    if (!initialLoad) {
      fetchNotifications();
    }
  }, [currentPage]);

  // Handle notification submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!subject.trim()) {
    toast.error("Please enter a subject", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  if (!comment.trim()) {
    toast.error("Please enter a message", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  setIsSubmitting(true);
  
  try {
    let usersPayload;
    
    if (customerType === 'all') {
  usersPayload = 'All';
} else {
  try {
    console.log('Raw emails string from state:', emails);
    
    const userIds = emails ? JSON.parse(emails) : [];
    console.log('Parsed user IDs:', userIds);
    console.log('User IDs type:', typeof userIds);
    console.log('Is array?', Array.isArray(userIds));
    
    if (userIds.length === 0) {
      toast.error("Please select at least one user", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }
    
    // Check what's in the array
    userIds.forEach((id, index) => {
      console.log(`User ID at index ${index}:`, id, 'Type:', typeof id);
    });
    
    usersPayload = userIds;
    
  } catch (error) {
    console.error('Error parsing user IDs:', error);
    console.error('Error stack:', error.stack);
    toast.error("Invalid user selection", {
      position: "top-right",
      autoClose: 3000,
    });
    setIsSubmitting(false);
    return;
  }
}
    
    const payload = {
      users: usersPayload, // This should be "All" or [1, 2, 3, 7]
      subject: subject.trim(),
      message: comment.trim(), // Don't strip HTML if backend expects HTML
    };
    
    console.log('Complete Payload being sent:', payload);
    console.log('Payload as JSON:', JSON.stringify(payload));
    
    const response = await notificationAPI.sendNotification(payload);
    
    if (response && response.success) {
      toast.success(`${response.message} (Sent to ${response.count || 0} users)`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Reset form
      setCustomerType('all');
      setEmails('');
      setSubject('');
      setComment('');
      
      // Collapse form after successful submission
      setIsFormOpen(false);
      
      // Refresh notifications
      fetchNotifications();
    } else {
      console.error('API Error Response:', response);
      toast.error(response?.message || "Failed to send notification", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    toast.error(error.response?.data?.message || "Failed to send notification", {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    setIsSubmitting(false);
  }
};


  // Handle delete notification with SweetAlert2 confirmation
  const handleDeleteNotification = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This notification will be deleted permanently!",
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
      try {
        const response = await notificationAPI.deleteNotification(id);
        
        if (response && response.success) {
          toast.success(response.message, {
            position: "top-right",
            autoClose: 3000,
          });
          
          // Refresh notifications
          fetchNotifications();
          
          // Show success alert
          Swal.fire({
            title: 'Deleted!',
            text: 'Notification has been deleted.',
            icon: 'success',
            confirmButtonColor: isDark ? '#059669' : '#10b981',
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#e5e7eb' : '#374151',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          toast.error(response?.message || "Failed to delete notification", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error(error.response?.data?.message || "Failed to delete notification", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}
    >
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
                <ArrowLeft
                  className={`w-5 h-5 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </button>
              <div>
                <h1
                  className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark
                      ? "from-emerald-400 to-teal-400"
                      : "from-gray-800 to-black"
                  } bg-clip-text text-transparent`}
                >
                  Send Notification
                </h1>
                <p className={`text-sm mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Send notifications to customers and track sent history
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  fetchEmailList();
                  fetchNotifications();
                }}
                disabled={loading || isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } ${loading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="space-y-8">
          {/* Send New Notification Card - Collapsible */}
          <div
            className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
                : "bg-white border-emerald-300 shadow-emerald-500/10"
            }`}
          >
            {/* Card Header with Toggle */}
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={`w-full px-6 py-5 border-b-2 flex items-center justify-between transition-all duration-200 hover:bg-opacity-80 ${
                isDark
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50 hover:bg-gray-800"
                  : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              <div className="text-left">
                <h2
                  className={`text-xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-700"
                  }`}
                >
                  Send New Notification
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Configure and send notifications to your customers
                </p>
              </div>
              <div className={`flex items-center gap-2 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}>
                <span className="text-sm font-medium">
                  {isFormOpen ? 'Collapse' : 'Expand'}
                </span>
                {isFormOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {/* Collapsible Form Content */}
            <div className={`transition-all duration-300 ease-in-out ${
              isFormOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-8">
                  {/* Form Fields */}
                  <FormFields
                    customerType={customerType}
                    setCustomerType={setCustomerType}
                    emails={emails}
                    setEmails={setEmails}
                    subject={subject}
                    setSubject={setSubject}
                    emailOptions={emailOptions}
                  />

                  {/* Rich Text Editor */}
                  <RichTextEditor 
                    value={comment} 
                    onChange={setComment}
                    label="Notification Message"
                    placeholder="Write your notification..."
                    minHeight="150px" 
                  />

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-4 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:outline-none flex items-center gap-3 ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : isDark
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25"
                          : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Notification</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Notification Table */}
          <div>
            <NotificationTable
              paginatedNotifications={notifications}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              isDark={isDark}
              onPageChange={setCurrentPage}
              onDeleteNotification={handleDeleteNotification}
              loading={loading}
              totalItems={totalCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;