import { db } from '@/lib/firebase';
import { ref, set, push, get, remove, onValue, off } from 'firebase/database';

export class FirebaseNotificationService {
  static async sendNotification({ userIds, subject, message, sender, adminId }) {
    try {
      
      const chunkSize = 50; 
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        
        const chunkPromises = chunk.map(async (userId) => {
          try {
            const userNotificationsRef = ref(db, `users/${userId}/notifications`);
            const newNotificationRef = push(userNotificationsRef);
            const firebaseId = newNotificationRef.key;
            
            const notification = {
              id: firebaseId,
              firebase_id: firebaseId,
              subject: subject,
              comment: message,
              status: 0,
              created_at: new Date().toISOString(),
              sender: sender,
              admin_id: adminId,
              user_id: userId,
            };
            
            await set(newNotificationRef, notification);
            successCount++;
            return { success: true, userId, firebaseId };
          } catch (error) {
            errorCount++;
            console.error(`Failed for user ${userId}:`, error);
            return { success: false, userId, error: error.message };
          }
        });
        
        await Promise.all(chunkPromises);
      }
      
      
      return { 
        success: errorCount === 0,
        count: successCount,
        errors: errorCount,
        total: userIds.length
      };
    } catch (error) {
      console.error('❌ Firebase Error:', error);
      return { 
        success: false, 
        error: error.message,
        count: 0 
      };
    }
  }

  // NEW: Get all notifications from all users
  static async getAllNotifications() {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      
      if (!snapshot.exists()) {
        return { success: true, notifications: [], total: 0 };
      }
      
      const usersData = snapshot.val();
      const allNotifications = [];
      
      // Loop through all users
      Object.keys(usersData).forEach(userId => {
        const userNotifications = usersData[userId]?.notifications;
        
        if (userNotifications) {
          // Loop through user's notifications
          Object.keys(userNotifications).forEach(notifId => {
            const notif = userNotifications[notifId];
            allNotifications.push({
              ...notif,
              user_id: userId,
              notification_id: notifId,
              firebase_id: notifId
            });
          });
        }
      });
      
      // Sort by created_at (newest first)
      allNotifications.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      
      return {
        success: true,
        notifications: allNotifications,
        total: allNotifications.length
      };
    } catch (error) {
      console.error('❌ Firebase Error fetching notifications:', error);
      return {
        success: false,
        notifications: [],
        total: 0,
        error: error.message
      };
    }
  }

  // NEW: Delete specific notification for a specific user
  static async deleteNotification(userId, notificationId) {
    try {
      const notificationRef = ref(db, `users/${userId}/notifications/${notificationId}`);
      await remove(notificationRef);
      
      
      return {
        success: true,
        message: 'Notification deleted successfully'
      };
    } catch (error) {
      console.error('❌ Firebase Error deleting notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // NEW: Real-time listener for all notifications
  static subscribeToNotifications(callback) {
    try {
      const usersRef = ref(db, 'users');
      
      const listener = onValue(usersRef, (snapshot) => {
        if (!snapshot.exists()) {
          callback({ success: true, notifications: [], total: 0 });
          return;
        }
        
        const usersData = snapshot.val();
        const allNotifications = [];
        
        Object.keys(usersData).forEach(userId => {
          const userNotifications = usersData[userId]?.notifications;
          
          if (userNotifications) {
            Object.keys(userNotifications).forEach(notifId => {
              const notif = userNotifications[notifId];
              allNotifications.push({
                ...notif,
                user_id: userId,
                notification_id: notifId,
                firebase_id: notifId
              });
            });
          }
        });
        
        // Sort by created_at (newest first)
        allNotifications.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        callback({
          success: true,
          notifications: allNotifications,
          total: allNotifications.length
        });
      });
      
      return listener;
    } catch (error) {
      console.error('❌ Firebase Error subscribing:', error);
      return null;
    }
  }

  // NEW: Unsubscribe from real-time updates
  static unsubscribeFromNotifications(listener) {
    if (listener) {
      const usersRef = ref(db, 'users');
      off(usersRef, 'value', listener);
    }
  }

  // Existing methods below...
  static async getNotificationStatus(userId, sqlNotification) {
    try {
      if (!userId || !sqlNotification) return false;
      
      const userNotificationsRef = ref(db, `users/${userId}/notifications`);
      const snapshot = await get(userNotificationsRef);
      
      if (!snapshot.exists()) return false;
      
      const firebaseNotifications = snapshot.val();
      
      const matchingNotification = Object.values(firebaseNotifications).find(fbNotif => {
        const timeDiff = Math.abs(
          new Date(fbNotif.created_at).getTime() - 
          new Date(sqlNotification.created_at).getTime()
        );
        
        return (
          fbNotif.subject === sqlNotification.subject &&
          timeDiff < 10000 &&
          fbNotif.user_id == userId
        );
      });
      
      return matchingNotification ? matchingNotification.status === 1 : false;
    } catch (error) {
      console.error('Error getting Firebase status:', error);
      return false;
    }
  }

  static async getBatchFirebaseStatus(sqlNotifications) {
    try {
      if (!sqlNotifications || sqlNotifications.length === 0) return {};
      
      const statusMap = {};
      const userGroups = {};
      
      sqlNotifications.forEach(notif => {
        const userId = notif.user_id;
        if (!userGroups[userId]) userGroups[userId] = [];
        userGroups[userId].push(notif);
      });
      
      const userIds = Object.keys(userGroups);
      
      for (const userId of userIds) {
        try {
          const userNotificationsRef = ref(db, `users/${userId}/notifications`);
          const snapshot = await get(userNotificationsRef);
          
          if (snapshot.exists()) {
            const firebaseNotifications = snapshot.val();
            
            userGroups[userId].forEach(sqlNotif => {
              const matchingNotification = Object.values(firebaseNotifications).find(fbNotif => {
                const timeDiff = Math.abs(
                  new Date(fbNotif.created_at).getTime() - 
                  new Date(sqlNotif.created_at).getTime()
                );
                
                return (
                  fbNotif.subject === sqlNotif.subject &&
                  timeDiff < 10000 &&
                  fbNotif.user_id == userId
                );
              });
              
              statusMap[sqlNotif.notification_id] = matchingNotification ? 
                matchingNotification.status === 1 : false;
            });
          }
        } catch (error) {
          console.error(`Error for user ${userId}:`, error);
          userGroups[userId].forEach(sqlNotif => {
            statusMap[sqlNotif.notification_id] = false;
          });
        }
      }
      
      return statusMap;
    } catch (error) {
      console.error('Error in batch Firebase status:', error);
      return {};
    }
  }
}