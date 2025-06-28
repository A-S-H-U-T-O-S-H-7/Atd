'use client'
import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { X, CheckCircle } from 'lucide-react';

const ReviewStatusModal = ({ 
  isOpen, 
  onClose, 
  review, 
  onSubmit 
}) => {
  const { isDark } = useAdminAuth();
  const [status, setStatus] = useState('pending');
  const [replyText, setReplyText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset and sync state when review changes or modal opens
  useEffect(() => {
    if (isOpen && review) {
      setStatus(review.status || 'pending');
      setReplyText(review.reply || '');
      setShowConfirmation(false);
      setIsSubmitting(false);
    }
  }, [isOpen, review]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowConfirmation(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!review || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(review.id, status, replyText);
      
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting review status:', error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; 
    onClose();
  };

  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border ${
        isDark 
          ? 'bg-gray-800 border-emerald-600/30' 
          : 'bg-white border-emerald-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold bg-gradient-to-r ${
              isDark ? 'from-emerald-400 to-teal-400' : 'from-emerald-600 to-teal-600'
            } bg-clip-text text-transparent`}>
              Update Review Status
            </h3>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {showConfirmation ? (
            <div className="text-center py-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDark ? 'bg-green-900/50' : 'bg-green-100'
              }`}>
                <CheckCircle className={`w-8 h-8 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <h4 className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Success!
              </h4>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Review status updated successfully.
              </p>
            </div>
          ) : (
            <>
              {/* Customer Info */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Customer Information
                </label>
                <div className={`flex items-center space-x-4 p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-700/50 border-emerald-600/30' 
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}>
                  <div className="relative">
                    <img
                      src={review.photo}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/48/48';
                      }}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                      isDark
                        ? 'bg-emerald-500 border-gray-700'
                        : 'bg-emerald-400 border-white'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {review.name}
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      CRN: {review.crnNo}
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Rating: {review.rating}/5 ⭐
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Text
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Customer Review
                </label>
                <div className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-700/30 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-800'
                }`}>
                  <p className="text-sm leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </div> */}

              {/* Status Selection */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isSubmitting}
                  className={`w-full p-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                    isDark 
                      ? 'bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400' 
                      : 'bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500'
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Reply Text */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Reply to Customer
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Enter your reply to the customer..."
                  rows={4}
                  disabled={isSubmitting}
                  className={`w-full p-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                    isDark 
                      ? 'bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400' 
                      : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <div className={`mt-2 text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {replyText.length}/500 characters
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isSubmitting 
                      ? 'bg-emerald-500 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105'
                  } text-white shadow-lg`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Update Status'
                  )}
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