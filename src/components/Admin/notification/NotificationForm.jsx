'use client';
import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import FormFields from './FormFields';
import RichTextEditor from '../RichTextEditor';
import { notificationAPI } from '@/lib/services/NotificationServices';
import { FirebaseNotificationService } from '@/lib/services/FirebaseNotificationService';
import toast from 'react-hot-toast';

const NotificationForm = ({ emailOptions, onSuccess,isDark }) => {
  const [customerType, setCustomerType] = useState('all');
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const text = html.replace(/<[^>]*>/g, '');
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

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
      
      const getAdminData = () => {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('adminUser');
          return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
      };
      
      const adminUser = getAdminData();
      
      if (customerType === 'all') {
        payload = {
          users: "All",
          subject: subject.trim(),
          message: stripHtmlTags(comment.trim()),
        };
        
        try {
          const emailResponse = await notificationAPI.getEmailList();
          if (emailResponse?.success && emailResponse.data) {
            userIdsForFirebase = emailResponse.data.map(user => user.id);
          } else {
            toast.error("Could not retrieve user list");
            setIsSubmitting(false);
            return;
          }
        } catch (error) {
          toast.error("Failed to get user list");
          setIsSubmitting(false);
          return;
        }
        
      } else {
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
          
        } catch (error) {
          toast.error("Invalid user selection");
          setIsSubmitting(false);
          return;
        }
      }
      
      const response = await notificationAPI.sendNotification(payload);
      
      if (response?.success) {
        if (userIdsForFirebase.length > 0) {
          const firebaseResult = await FirebaseNotificationService.sendNotification({
            userIds: userIdsForFirebase,
            subject: payload.subject,
            message: payload.message,
            sender: adminUser?.name || adminUser?.username || 'Admin',
            adminId: adminUser?.id || 68
          });
          
          if (firebaseResult.success) {
            toast.success(
              <div>
                <div>✓ Notification sent successfully!</div>
                <div className="text-sm opacity-80 mt-1">
                  MySQL: {response.count || 0} • Firebase: {firebaseResult.count}
                </div>
              </div>,
              { duration: 4000 }
            );
          } else {
            toast.success(`${response.message} (MySQL: ${response.count || 0} users)`);
          }
        } else {
          toast.success(`${response.message} (${response.count || 0} users)`);
        }
        
        setCustomerType('all');
        setEmails('');
        setSubject('');
        setComment('');
        setIsFormOpen(false);
        
        if (onSuccess) {
          onSuccess();
        }
        
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

  const headerBgStyle = isFormOpen
    ? isDark
      ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50 hover:bg-gray-800"
      : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 hover:bg-emerald-50"
    : "";

  return (
    <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
      isFormOpen
        ? isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
        : isDark
          ? "bg-gray-800 border-emerald-600/30"
          : "bg-white border-emerald-200"
    }`}>
      {/* Card Header with Toggle */}
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className={`w-full px-6 py-5 border-b-2 flex items-center justify-between transition-all duration-200 hover:bg-opacity-80 ${headerBgStyle}`}
      >
        <div className="text-left">
          <h2 className={`text-xl font-bold ${
            isFormOpen
              ? isDark ? "text-gray-100" : "text-gray-700"
              : isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            Send New Notification
          </h2>
        </div>
        <div className={`flex items-center gap-2 ${
          isFormOpen
            ? isDark ? "text-emerald-400" : "text-emerald-600"
            : isDark ? "text-gray-400" : "text-gray-500"
        }`}>
          <span className="text-sm font-medium">{isFormOpen ? 'Collapse' : 'Expand'}</span>
          {isFormOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Collapsible Form Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isFormOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            <FormFields
              customerType={customerType}
              setCustomerType={setCustomerType}
              emails={emails}
              setEmails={setEmails}
              subject={subject}
              setSubject={setSubject}
              emailOptions={emailOptions}
            />

            <RichTextEditor 
              value={comment} 
              onChange={setComment}
              label="Notification Message"
              placeholder="Write your notification..."
              minHeight="150px" 
            />

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-4 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 flex items-center gap-3 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
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
  );
};

export default NotificationForm;