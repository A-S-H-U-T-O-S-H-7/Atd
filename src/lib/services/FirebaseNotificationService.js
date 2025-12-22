import { db } from '@/lib/firebase';
import { ref, set, push, get, query, orderByChild, equalTo } from 'firebase/database';

export class FirebaseNotificationService {
  static async sendNotification({ userIds, subject, message, sender, adminId }) {
    try {
      console.log(`🚀 Firebase: Sending to ${userIds.length} users`);
      
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
      
      console.log(`✅ Firebase: Completed - ${successCount} success, ${errorCount} failed`);
      
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