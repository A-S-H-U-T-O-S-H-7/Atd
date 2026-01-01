"use client";
import { useState, useEffect, useRef } from 'react';
import { Bell, X, ChevronRight, Loader2 } from 'lucide-react';

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  notifications, 
  unreadCount,
  onNotificationClick,
  expandedNotificationId,
  loadingNotificationId,
  isMobile 
}) => {
  const modalRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMobile]);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // For mobile - Fixed height modal
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999]">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Container with fixed height */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="relative w-full max-w-md h-[85vh] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200/50 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-slate-800 text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content - Scrollable area */}
            <div className="flex-1 overflow-y-auto p-2">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-8 text-slate-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                  <p className="text-xs mt-1 text-slate-400">Notifications will appear here in real-time</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-xl transition-all duration-300 cursor-pointer border-l-4 ${
                        !notification.status 
                          ? 'bg-blue-50/50 border-l-blue-500' 
                          : 'hover:bg-slate-50 border-l-transparent'
                      } ${notification._source === 'firebase' ? 'border-l-blue-400' : ''}`}
                      onClick={() => onNotificationClick(notification)}
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-3">
                            <h4 className="font-semibold text-slate-900 text-sm leading-snug">
                              {notification.subject}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatDate(notification.created_at)}
                              {notification.status && (
                                <span className="ml-2 text-green-600">• Read</span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {!notification.status && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            )}
                            <ChevronRight 
                              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                                expandedNotificationId === notification.id ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {expandedNotificationId === notification.id && (
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-t border-slate-200/50 overflow-hidden">
                          <div className="px-3 py-3">
                            {loadingNotificationId === notification.id ? (
                              <div className="flex items-center justify-center py-3">
                                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                <span className="ml-2 text-sm text-slate-600">Marking as read...</span>
                              </div>
                            ) : notification.comment ? (
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                                  Message Details
                                </div>
                                <div 
                                  className="text-sm text-slate-700 leading-relaxed"
                                  style={{ wordBreak: 'break-word' }}
                                >
                                  {notification.comment}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400 italic py-2">
                                No additional details available
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-200/50 text-center text-xs text-slate-500">
                <div>
                  Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                  {unreadCount > 0 && ` • ${unreadCount} unread`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // For desktop - Dropdown
  return (
    <div 
      ref={modalRef}
      className="absolute right-0 mt-2 w-[450px] max-w-[90vw] bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 z-[9999]"
    >
      <div className="p-4 border-b border-slate-200/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-slate-800 text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs mt-1 text-slate-400">Notifications will appear here in real-time</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`transition-all duration-300 cursor-pointer border-l-4 ${
                  !notification.status 
                    ? 'bg-blue-50/50 border-l-blue-500' 
                    : 'hover:bg-slate-50 border-l-transparent'
                } ${notification._source === 'firebase' ? 'border-l-blue-400' : ''}`}
                onClick={() => onNotificationClick(notification)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-3">
                      <div className="flex items-start gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm leading-snug flex-1">
                          {notification.subject}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">
                        {formatDate(notification.created_at)}
                        {notification.status && (
                          <span className="ml-2 text-green-600">• Read</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {!notification.status && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      )}
                      <ChevronRight 
                        className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                          expandedNotificationId === notification.id ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {expandedNotificationId === notification.id && (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-t border-slate-200/50 overflow-hidden transition-all duration-300">
                    <div className="px-4 py-4">
                      {loadingNotificationId === notification.id ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                          <span className="ml-2 text-sm text-slate-600">Marking as read...</span>
                        </div>
                      ) : notification.comment ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                              Message Details
                            </div>
                          </div>
                          <div 
                            className="text-sm text-slate-700 leading-relaxed"
                            style={{ wordBreak: 'break-word' }}
                          >
                            {notification.comment}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 italic py-2">
                          No additional details available
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-slate-200/50 text-center text-xs text-slate-500">
          <div className="mt-1">
            Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            {unreadCount > 0 && ` • ${unreadCount} unread`}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;