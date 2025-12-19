import { db } from '@/lib/firebase';
import { ref, set, push } from 'firebase/database';

export class FirebaseNotificationService {
  
  /**
   * Send notification to specific users via Firebase
   */
  
  static async sendNotification({ userIds, subject, message, sender, adminId }) {
    try {
      console.log(`🚀 Firebase: Sending to ${userIds.length} users`);
      
      // For large batches, show progress
      if (userIds.length > 10) {
        console.log(`⏳ This might take a moment for ${userIds.length} users...`);
      }
      
      // Process in chunks for better performance (if many users)
      const chunkSize = 50; // Process 50 users at a time
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
        
        // Show progress for large batches
        if (userIds.length > 20) {
          console.log(`📊 Progress: ${Math.min(i + chunkSize, userIds.length)}/${userIds.length} users`);
        }
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

}