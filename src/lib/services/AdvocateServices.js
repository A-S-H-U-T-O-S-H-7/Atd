import api from '@/utils/axiosInstance';

export const advocateService = {
  getAdvocates: async (params = {}) => {
    try {
      const response = await api.get('/crm/advocate/manage', {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || ''
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single advocate by ID for edit
  getAdvocateById: async (id) => {
    try {
      const response = await api.get(`/crm/advocate/edit/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add new advocate
  addAdvocate: async (advocateData) => {
    try {
      const response = await api.post('/crm/advocate/add', advocateData);
      
      if (response.status === false) {
        throw new Error(response.message || 'Failed to add advocate');
      }
      
      return response;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data || {};
        
        const serverError = new Error(
          errorData.message || errorData.errors || 'Failed to add advocate'
        );
        
        serverError.response = error.response;
        throw serverError;
      }
      throw error;
    }
  },

  // Update advocate
  updateAdvocate: async (id, advocateData) => {
    try {
      const response = await api.put(`/crm/advocate/update/${id}`, advocateData);
      
      if (response.status === false) {
        throw new Error(response.message || 'Failed to update advocate');
      }
      
      return response;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data || {};
        const serverError = new Error(
          errorData.message || errorData.errors || 'Failed to update advocate'
        );
        serverError.response = error.response;
        throw serverError;
      }
      throw error;
    }
  },

  // Toggle advocate status (active/inactive)
  toggleStatus: async (id) => {
    try {
      const response = await api.put(`/crm/advocate/status/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete advocate (if needed in future)
  deleteAdvocate: async (id) => {
    try {
      const response = await api.delete(`/crm/advocate/delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format advocate data for UI
export const formatAdvocateForUI = (advocate) => {
  return {
    id: advocate.id,
    name: advocate.name || 'N/A',
    court: advocate.court || 'N/A',
    address: advocate.address || 'N/A',
    phone: advocate.phone || 'N/A',
    email: advocate.email || 'N/A',
    licenceNo: advocate.licence_no || 'N/A',
    isActive: advocate.isActive === 1,
    addedBy: advocate.added_by || 'N/A',
    createdAt: advocate.created_at || 'N/A',
    status: advocate.isActive === 1 ? 'Active' : 'Inactive',
    letterheadUrl: advocate.letter_head || null
  };
};