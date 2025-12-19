import api from "@/utils/axiosInstance";

const API_ENDPOINTS = {
  GET_ALL: "/crm/notification/manage",
  CREATE: "/crm/notification/add",
  DELETE: (id) => `/crm/notification/delete/${id}`,
  GET_EMAILS: "/crm/notification/emails"
};

// Strip HTML tags from text
const stripHtmlTags = (html) => {
  if (!html) return '';
  const text = html.replace(/<[^>]*>/g, '');
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value.trim();
};

// Format notification data for UI
export const formatNotificationForUI = (apiData, index, currentPage = 1, itemsPerPage = 10) => {
  return {
    id: apiData.notification_id,
    sNo: (currentPage - 1) * itemsPerPage + index + 1,
    userName: apiData.user_name,
    crnno: apiData.crnno,
    subject: apiData.subject,
    comment: stripHtmlTags(apiData.comment),
    status: apiData.status,
    createdAt: apiData.created_at,
    sender: apiData.sender,
    statusDisplay: apiData.status ? "Read" : "Unread"
  };
};

// API service
export const notificationAPI = {
  // Get all notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ALL, { params });
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  getEmailList: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EMAILS);
      return response;
    } catch (error) {
      console.error("Error fetching email list:", error);
      throw error;
    }
  },

  // NEW: Get all user IDs for "All Customers"
  getAllUserIds: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EMAILS);
      if (response?.success) {
        // Extract just the IDs from the email list
        return response.data.map(user => user.id);
      }
      return [];
    } catch (error) {
      console.error("Error getting all user IDs:", error);
      return [];
    }
  },

  // Send notification (update to handle "All Customers")
  sendNotification: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE, data);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  },
  
  // Delete notification
  deleteNotification: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.DELETE(id));
      return response;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
};