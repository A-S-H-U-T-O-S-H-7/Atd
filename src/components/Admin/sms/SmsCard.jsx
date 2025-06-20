'use client';

import React, { useState } from 'react';
import { MessageCircle, Send, FileText } from 'lucide-react';

// You need to import or define these in your main component or pass as props
const categories = [
  { value: '', label: '--Select Category--' },
  { value: 'in_process', label: 'In Process Enquiries' },
  { value: 'followup', label: 'FollowUp Enquiries' },
  { value: 'completed', label: 'Completed Enquiries' },
  { value: 'pending', label: 'Pending Enquiries' },
  { value: 'rejected', label: 'Rejected Enquiries' },
  { value: 'closed', label: 'Closed Enquiries' },
  { value: 'refer_friends', label: 'Refer Friends' }
];

const SendSMSCard = ({ isDark }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSendSMS = () => {
    if (!selectedCategory || !message.trim()) {
      alert('Please select a category and enter a message');
      return;
    }
    // SMS sending logic here
    console.log('Sending SMS to category:', selectedCategory, 'Message:', message);
    alert('SMS sent successfully!');
  };

  return (
    <div
      className={`rounded-2xl shadow-lg border-2 overflow-hidden h-fit ${
        isDark
          ? 'bg-gray-800 border-emerald-600/50 shadow-emerald-900/20'
          : 'bg-white border-emerald-300 shadow-emerald-500/10'
      }`}
    >
      <div
        className={`px-6 py-3 border-b-2 ${
          isDark
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${
              isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'
            }`}
          >
            <MessageCircle
              className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
            />
          </div>
          <h2
            className={`text-lg font-bold ${
              isDark ? 'text-gray-100' : 'text-gray-700'
            }`}
          >
            Send SMS
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label
            className={`block text-sm font-semibold mb-2 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Upload File (Optional) :
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".csv,.txt,.xlsx"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold ${
                isDark
                  ? 'bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400 file:bg-emerald-600 file:text-white'
                  : 'bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500 file:bg-emerald-100 file:text-emerald-700'
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            />
          </div>
          {selectedFile && (
            <div className="mt-2 flex items-center space-x-2">
              <FileText className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedFile.name}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            className={`block text-sm font-semibold mb-2 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Select Category :
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? 'bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400'
                : 'bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500'
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className={`block text-sm font-semibold mb-2 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Message :
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your SMS message here..."
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium resize-none ${
              isDark
                ? 'bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400'
                : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          />
          <div className="mt-2 flex justify-between items-center">
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {message.length}/160 characters
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              SMS Count: {Math.ceil(message.length / 160) || 1}
            </span>
          </div>
        </div>

        <button
          onClick={handleSendSMS}
          className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-200 cursor-pointer hover:shadow-lg flex items-center justify-center space-x-2 ${
            isDark
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
          }`}
        >
          <Send className="w-5 h-5" />
          <span>Send SMS</span>
        </button>
      </div>
    </div>
  );
};

export default SendSMSCard;