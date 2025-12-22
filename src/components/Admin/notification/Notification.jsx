'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import FormFields from './FormFields';
import RichTextEditor from '../RichTextEditor';
import NotificationTable from './NotificationTable';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { notificationAPI, formatNotificationForUI } from '@/lib/services/NotificationServices';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FirebaseNotificationService } from '@/lib/services/FirebaseNotificationService';

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

  // Fetch email list
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

  // Fetch notifications
  const fetchNotifications = async () => {
  try {
    setLoading(true);
    const response = await notificationAPI.getNotifications({
      per_page: itemsPerPage,
      page: currentPage,
    });
    
    if (response?.success) {
      const notificationsData = response.notifications || [];
      
      setNotifications(notificationsData);
      setTotalCount(response.pagination?.total || notificationsData.length);
      setTotalPages(response.pagination?.total_pages || 1);
    } else {
      setNotifications([]);
      setTotalCount(0);
      setTotalPages(0);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
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


  // Strip HTML tags from message
  const stripHtmlTags = (html) => {
    if (!html) return '';
    const text = html.replace(/<[^>]*>/g, '');
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  // Handle notification submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!subject.trim()) {
    toast.error("Please enter a subject");
    return;
  }

  if (!comment.trim()) {
    toast.error("Please enter a message");
    return;
  }

  setIsSubmitting(true);
  
  try {
    let payload;
    let userIdsForFirebase = [];
    
    // Get admin data
    const getAdminData = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('adminUser');
        return storedUser ? JSON.parse(storedUser) : null;
      }
      return null;
    };
    
    const adminUser = getAdminData();
    console.log('Admin User:', adminUser);
    
    if (customerType === 'all') {
      // For "All Customers"
      payload = {
        users: "All",
        subject: subject.trim(),
        message: stripHtmlTags(comment.trim()),
      };
      
      console.log('Sending to ALL customers');
      
      // Get ALL user IDs from your API
      try {
        const emailResponse = await notificationAPI.getEmailList();
        if (emailResponse?.success && emailResponse.data) {
          userIdsForFirebase = emailResponse.data.map(user => user.id);
          console.log(`Found ${userIdsForFirebase.length} users to send to:`, userIdsForFirebase);
        } else {
          console.error('Could not get user list from API');
          toast.error("Could not retrieve user list");
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.error('Error getting all users:', error);
        toast.error("Failed to get user list");
        setIsSubmitting(false);
        return;
      }
      
    } else {
      // For "Custom" selection
      try {
        userIdsForFirebase = emails ? JSON.parse(emails) : [];
        
        if (userIdsForFirebase.length === 0) {
          toast.error("Please select at least one user");
          setIsSubmitting(false);
          return;
        }
        
        payload = {
          users: "Custom",
          user_ids: userIdsForFirebase,
          subject: subject.trim(),
          message: stripHtmlTags(comment.trim()),
        };
        
        console.log('Sending to specific users:', userIdsForFirebase);
        
      } catch (error) {
        toast.error("Invalid user selection");
        setIsSubmitting(false);
        return;
      }
    }
    
    // 1. Send to your existing MySQL API
    console.log('Sending to MySQL API:', payload);
    const response = await notificationAPI.sendNotification(payload);
    
    if (response?.success) {
      console.log('MySQL API response:', response);
      
      // 2. ALSO send to Firebase for real-time updates
      if (userIdsForFirebase.length > 0) {
        console.log(`🚀 Firebase: Sending to ${userIdsForFirebase.length} users`);
        
        // Use REAL admin data
        const firebaseResult = await FirebaseNotificationService.sendNotification({
          userIds: userIdsForFirebase,
          subject: payload.subject,
          message: payload.message,
          sender: adminUser?.name || adminUser?.username || 'Admin',
          adminId: adminUser?.id || 68
        });
        
        if (firebaseResult.success) {
          console.log(`✅ Firebase: Successfully sent to ${firebaseResult.count} users`);
          
          // Show success message with count
          toast.success(
            <div>
              <div>{response.message}</div>
              <div className="text-sm opacity-80">
                (MySQL: {response.count || 0} users, Firebase: {firebaseResult.count} users)
              </div>
            </div>,
            { duration: 4000 }
          );
          
        } else {
          console.warn('⚠️ Firebase failed:', firebaseResult.error);
          // Still show MySQL success
          toast.success(`${response.message} (MySQL: ${response.count || 0} users)`);
        }
      } else {
        toast.success(`${response.message} (${response.count || 0} users)`);
      }
      
      // Reset form
      setCustomerType('all');
      setEmails('');
      setSubject('');
      setComment('');
      setIsFormOpen(false);
      fetchNotifications();
      
    } else {
      toast.error(response?.message || "Failed to send notification");
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    toast.error(error.response?.data?.message || "Failed to send notification");
  } finally {
    setIsSubmitting(false);
  }
};

  // Handle delete notification with confirmation
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
        
        if (response?.success) {
          toast.success(response.message, {
            position: "top-right",
            autoClose: 3000,
          });
          
          fetchNotifications();
          
          
        } else {
          toast.error(response?.message || "Failed to delete notification", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete notification", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
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
                  Send Notification
                </h1>
                <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
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
          <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${isDark ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20" : "bg-white border-emerald-300 shadow-emerald-500/10"}`}>
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
                <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`}>
                  Send New Notification
                </h2>
                <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Configure and send notifications to your customers
                </p>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                <span className="text-sm font-medium">{isFormOpen ? 'Collapse' : 'Expand'}</span>
                {isFormOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {/* Collapsible Form Content */}
            <div className={`transition-all duration-300 ease-in-out ${isFormOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
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