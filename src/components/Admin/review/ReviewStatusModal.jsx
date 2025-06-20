'use client'
import React, { useState } from 'react';
import { useAdminAuth } from '@/lib/AdminAuthContext';

const ReviewStatusModal = ({ 
  isOpen, 
  onClose, 
  review, 
  onSubmit 
}) => {
  const { isDark } = useAdminAuth();
  const [status, setStatus] = useState(review?.status || 'pending');
  const [replyText, setReplyText] = useState(review?.reply || '');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = () => {
    onSubmit(review.id, status, replyText);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      onClose();
    }, 1500);
  };

  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Update Review Status
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>

          {showConfirmation ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h4 className={`text-lg font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Success!
              </h4>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Review status updated successfully.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Customer
                </label>
                <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <img
                    src={review.photo}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {review.name}
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {review.crnNo}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Enter your reply to the customer..."
                  rows={4}
                  className={`w-full p-3 rounded-lg border transition-colors resize-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewStatusModal;