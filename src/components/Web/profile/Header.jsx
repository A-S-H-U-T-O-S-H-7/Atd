"use client";
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bell, LogOut, Loader2, X, ChevronRight } from 'lucide-react';
import { TokenManager } from '@/utils/tokenManager';
import { db } from '@/lib/firebase';
import { ref, onValue, off, set, get } from 'firebase/database';

export default function Header({ user, isRefreshing, onLogout, onClientHistory }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [loadingNotificationId, setLoadingNotificationId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const notificationRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const isListenerSetup = useRef(false);

  // Setup Firebase real-time listener
  useEffect(() => {
    if (!user?.user_id || isListenerSetup.current) return;
    
    const userId = user.user_id;
    
    // Clean up any existing listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    const userNotificationsRef = ref(db, `users/${userId}/notifications`);
    
    const handleFirebaseData = (snapshot) => {
      const data = snapshot.val();
      const firebaseNotifs = data ? Object.values(data) : [];
      
      const formattedNotifications = firebaseNotifs.map(notif => ({
        id: `firebase_${notif.id || notif.firebase_id}`,
        notification_id: `firebase_${notif.id || notif.firebase_id}`,
        subject: notif.subject,
        comment: notif.comment,
        status: notif.status === 1,
        created_at: notif.created_at,
        sender: notif.sender,
        admin_id: notif.admin_id,
        user_id: notif.user_id,
        _source: 'firebase',
        _firebase_key: notif.id || notif.firebase_id
      })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.status).length);
    };
    
    onValue(userNotificationsRef, handleFirebaseData);
    
    unsubscribeRef.current = () => {
      off(userNotificationsRef, handleFirebaseData);
    };
    
    isListenerSetup.current = true;
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
        isListenerSetup.current = false;
      }
    };
  }, [user?.user_id]);

  const handleNotificationClick = async (notification) => {
    if (expandedNotificationId === notification.id) {
      setExpandedNotificationId(null);
    } else {
      setExpandedNotificationId(notification.id);
      
      if (!notification.status) {
        setLoadingNotificationId(notification.id);
        
        try {
          if (notification._source === 'firebase' && notification._firebase_key && user?.user_id) {
            const notificationRefPath = ref(db, `users/${user.user_id}/notifications/${notification._firebase_key}`);
            
            const snapshot = await get(notificationRefPath);
            if (snapshot.exists()) {
              const currentData = snapshot.val();
              await set(notificationRefPath, {
                ...currentData,
                status: 1,
                updated_at: new Date().toISOString()
              });
            }
          }
          
          setNotifications(prev => 
            prev.map(n => 
              n.id === notification.id 
                ? { ...n, status: true, updated_at: new Date().toISOString() } 
                : n
            )
          );
          
          setUnreadCount(prev => Math.max(0, prev - 1));
          
        } catch (error) {
          console.error('Error updating notification status:', error);
          setNotifications(prev => 
            prev.map(n => 
              n.id === notification.id 
                ? { ...n, status: true } 
                : n
            )
          );
          setUnreadCount(prev => Math.max(0, prev - 1));
        } finally {
          setLoadingNotificationId(null);
        }
      }
    }
  };

  useEffect(() => {
    if (showNotifications) {
      setExpandedNotificationId(null);
    }
  }, [showNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = async () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      isListenerSetup.current = false;
    }
    await onLogout(); 
  };

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

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-lg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/15 to-pink-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="headerWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="20%" stopColor="#06b6d4" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#8b5cf6" />
              <stop offset="80%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path
            fill="url(#headerWave)"
            d="M0,30 C200,80 400,10 600,50 C800,90 1000,20 1200,60 L1200,0 L0,0 Z"
          />
        </svg>
      </div>

      <div className="relative px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="flex-shrink-0">
            <img 
              src="/atdlogo.png" 
              alt="ATD Finance Logo" 
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
            />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 drop-shadow-sm">
              ATD MONEY
            </h1>
            <p className="text-sm text-slate-600/80 hidden sm:block font-medium">
              Welcome, {user.fname}
              {isRefreshing && <span className="ml-2 text-blue-500">(Refreshing...)</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 rounded-xl transition-all duration-300 hover:shadow-md border border-slate-200/50"
            >
              <Bell className={`w-5 h-5 ${showNotifications ? 'text-blue-500' : 'text-slate-600'} transition-colors`} />
              
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className={`absolute right-0 mt-2 w-96 md:w-[450px] lg:w-[500px] bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 transition-all duration-300 ${
              showNotifications 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}>
              <div className="p-4 border-b border-slate-200/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-slate-800 text-lg">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                  {notifications.length > 0 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                      Real-time
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
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
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-3">
                              <div className="flex items-start gap-2">
                                <h4 className="font-semibold text-slate-900 text-sm leading-snug flex-1">
                                  {notification.subject}
                                </h4>
                                {/* {notification._source === 'firebase' && (
                                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Live
                                  </span>
                                )} */}
                              </div>
                              <p className="text-xs text-slate-500 mt-1.5">
                                {formatDate(notification.created_at)}
                                {notification.status && (
                                  <span className="ml-2 text-green-600">• Read</span>
                                )}
                                {/* {notification._source === 'firebase' && (
                                  <span className="ml-2 text-blue-600">• Live</span>
                                )} */}
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
                                    {/* {notification._source === 'firebase' && (
                                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        Real-time Update
                                      </span>
                                    )} */}
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
          </div>

          <div 
            className="relative group"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <button className="flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 rounded-xl px-3 md:px-4 py-2 transition-all duration-300 hover:shadow-md border border-slate-200/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">{user.fname?.[0]}</span>
              </div>
              <span className="text-slate-700 font-medium hidden sm:block">{user.fname}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-all duration-300 ${showProfileMenu ? 'rotate-180 text-blue-500' : ''}`} />
            </button>
            
            <div className={`absolute right-0 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 py-2 transition-all duration-300 ${
              showProfileMenu 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}>
              <button 
                onClick={handleLogoutClick}
                className="w-full px-4 py-3 cursor-pointer text-left hover:bg-red-50/50 flex items-center space-x-3 transition-all duration-200 text-red-600 group/item"
              >
                <LogOut className="w-4 h-4 group-hover/item:text-red-700 transition-colors" />
                <span className="group-hover/item:text-red-700 font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}