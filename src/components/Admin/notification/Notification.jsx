'use client';
import React, { useState } from 'react';
import { useAdminAuth } from "@/lib/AdminAuthContext";
import { ArrowLeft, Send, Bell } from 'lucide-react';
import FormFields from './FormFields';
import RichTextEditor from '../RichTextEditor';
import { useRouter } from 'next/navigation';

const NotificationPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter()
  const [customerType, setCustomerType] = useState('custom');
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        customerType,
        emails: customerType === 'custom' ? emails.split(',').map(email => email.trim()) : [],
        subject,
        comment,
      };
      
      console.log('Sending Notification:', payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful submission
      setCustomerType('custom');
      setEmails('');
      setSubject('');
      setComment('');
      
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}
    >
      <div className="p-0 md:px-54 md:py-4 ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
              onClick={()=> router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
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
              <div className="flex items-center space-x-3">
                
                <h1
                  className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark
                      ? "from-emerald-400 to-teal-400"
                      : "from-gray-800 to-black"
                  } bg-clip-text text-transparent`}
                >
                  Send Notification
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div
          className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
              : "bg-white border-emerald-300 shadow-emerald-500/10"
          }`}
        >
          <div
            className={`px-6 py-5 border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}
          >
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-700"
              }`}
            >
              Notification Details
            </h2>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Configure and send notifications to your customers
            </p>
          </div>

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
              />

              {/* Rich Text Editor */}
              <RichTextEditor value={comment} onChange={setComment}
              label="Notification Message"
              placeholder="Write your notification..."
              minHeight="150px" />

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-4 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:outline-none flex items-center space-x-3 ${
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
    </div>
  );
};

export default NotificationPage;