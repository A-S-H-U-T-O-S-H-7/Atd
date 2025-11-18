import api from "@/utils/axiosInstance";

export const clientService = {
  // Get all client histories
  getClientHistories: async () => {
    try {
      const response = await api.get('/crm/clients/histories');
      return response;
    } catch (error) {
      console.error('Error fetching client histories:', error);
      throw error;
    }
  },

  // Get client details by ID
  getClientDetails: async (clientId) => {
    try {
      const response = await api.get(`/crm/clients/detail/${clientId}`);
      return response;
    } catch (error) {
      console.error('Error fetching client details:', error);
      throw error;
    }
  }
};