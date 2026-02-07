"use client";
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bell, LogOut } from 'lucide-react';
import { TokenManager } from '@/utils/tokenManager';
import { db } from '@/lib/firebase';
import { ref, onValue, off, set, get } from 'firebase/database';
import NotificationModal from './NotificationModal';

export default function Header({ user, isRefreshing, onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [loadingNotificationId, setLoadingNotificationId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const profileMenuRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const isListenerSetup = useRef(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Setup Firebase real-time listener
  useEffect(() => {
    if (!user?.user_id || isListenerSetup.current) {
      return;
    }

    setupFirebaseListener();
    
    return () => {
      console.log('🔄 Cleanup in dependency effect');
    };
  }, [user?.user_id]);

  const setupFirebaseListener = () => {
    const userId = user.user_id;
    
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
    
    // Set up listener
    onValue(userNotificationsRef, handleFirebaseData);
    
    // Store cleanup function
    unsubscribeRef.current = () => {
      off(userNotificationsRef, handleFirebaseData);
    };
    
    isListenerSetup.current = true;
  };

  const cleanupFirebaseListener = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    isListenerSetup.current = false;
  };

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

  // Click outside handlers for profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogoutClick = async () => {
    cleanupFirebaseListener();
    await onLogout();
  };

  const closeNotifications = () => {
    setShowNotifications(false);
    setExpandedNotificationId(null);
  };

  return (
    <>
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
            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2.5 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 rounded-xl transition-all duration-300 hover:shadow-md border border-slate-200/50"
                aria-label="Notifications"
              >
                <Bell className={`w-5 h-5 ${showNotifications ? 'text-blue-500' : 'text-slate-600'} transition-colors`} />
                
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Desktop Notification Dropdown */}
              {!isMobile && showNotifications && (
                <NotificationModal
                  isOpen={showNotifications}
                  onClose={closeNotifications}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onNotificationClick={handleNotificationClick}
                  expandedNotificationId={expandedNotificationId}
                  loadingNotificationId={loadingNotificationId}
                  isMobile={false}
                />
              )}
            </div>

            {/* Profile Menu */}
            <div 
              className="relative group"
              ref={profileMenuRef}
              onMouseEnter={!isMobile ? () => setShowProfileMenu(true) : undefined}
              onMouseLeave={!isMobile ? () => setShowProfileMenu(false) : undefined}
            >
              <button 
                onClick={() => {
                  if (isMobile) {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }
                }}
                className="flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 rounded-xl px-3 md:px-4 py-2 transition-all duration-300 hover:shadow-md border border-slate-200/50"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">{user.fname?.[0]}</span>
                </div>
                <span className="text-slate-700 font-medium hidden sm:block">{user.fname}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-all duration-300 ${showProfileMenu ? 'rotate-180 text-blue-500' : ''}`} />
              </button>
              
              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className={`${
                  isMobile 
                    ? 'fixed inset-x-4 top-20 mx-auto max-w-sm z-[9999]' 
                    : 'absolute right-0 w-48 z-[9999]'
                } bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 py-2`}>
                  <button 
                    onClick={handleLogoutClick}
                    className="w-full px-4 py-3 cursor-pointer text-left hover:bg-red-50/50 flex items-center space-x-3 transition-all duration-200 text-red-600 group/item"
                  >
                    <LogOut className="w-4 h-4 group-hover/item:text-red-700 transition-colors" />
                    <span className="group-hover/item:text-red-700 font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NOTIFICATION MODAL - RENDERED OUTSIDE HEADER */}
      {isMobile && showNotifications && (
        <NotificationModal
          isOpen={showNotifications}
          onClose={closeNotifications}
          notifications={notifications}
          unreadCount={unreadCount}
          onNotificationClick={handleNotificationClick}
          expandedNotificationId={expandedNotificationId}
          loadingNotificationId={loadingNotificationId}
          isMobile={true}
        />
      )}
    </>
  );
}