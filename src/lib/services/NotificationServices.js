import api from "@/utils/axiosInstance";
import { FirebaseNotificationService } from './FirebaseNotificationService';

const API_ENDPOINTS = {
  GET_ALL: "/crm/notification/manage",
  CREATE: "/crm/notification/add",
  DELETE: (id) => `/crm/notification/delete/${id}`,
  GET_EMAILS: "/crm/notification/emails"
};

const stripHtmlTags = (html) => {
  if (!html) return '';
  const text = html.replace(/<[^>]*>/g, '');
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value.trim(); 
};

export const formatNotificationForUI = (apiData, index, currentPage = 1, itemsPerPage = 10) => {
  return {
    id: apiData.notification_id,
    sNo: (currentPage - 1) * itemsPerPage + index + 1,
    userName: apiData.user_name,
    crnno: apiData.crnno,
    subject: apiData.subject,
    comment: stripHtmlTags(apiData.comment),
    sql_status: apiData.status,
    createdAt: apiData.created_at,
    sender: apiData.sender,
    user_id: apiData.user_id,
    statusDisplay: apiData.status ? "Read" : "Unread"
  };
};

export const notificationAPI = {
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ALL, { params });
      
      if (response?.success && response.notifications) {
        const sqlNotifications = response.notifications;
        const firebaseStatusMap = await FirebaseNotificationService.getBatchFirebaseStatus(sqlNotifications);
        
        const notificationsWithFirebaseStatus = sqlNotifications.map((notif, index) => {
          const firebaseStatus = firebaseStatusMap[notif.notification_id] || false;
          
          return {
            ...formatNotificationForUI(notif, index, params.page || 1, params.per_page || 10),
            firebase_status: firebaseStatus,
            display_status: firebaseStatus ? 'read' : 'unread'
          };
        });
        
        return {
          ...response,
          notifications: notificationsWithFirebaseStatus
        };
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  getEmailList: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EMAILS);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAllUserIds: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EMAILS);
      if (response?.success) {
        return response.data.map(user => user.id);
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  sendNotification: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  deleteNotification: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.DELETE(id));
      return response;
    } catch (error) {
      throw error;
    }
  }
};