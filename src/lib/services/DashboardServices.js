import api from "@/utils/axiosInstance";

const API_ENDPOINTS = {
  GET_DASHBOARD_DATA: "/crm/dashboard",
};

export const dashboardAPI = {
  getDashboardData: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_DASHBOARD_DATA, { 
        params 
      });
      return response;
    } catch (error) {
      console.error("Dashboard API Error:", error);
      throw error;
    }
  }
};