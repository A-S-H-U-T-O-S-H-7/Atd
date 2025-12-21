import api from '@/utils/axiosInstance';

export const adminService = {
  // Get admins with pagination and search
  getAdmins: async (params = {}) => {
    try {
      const response = await api.get('/crm/admin/manage', {
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

  // Check username availability
  checkUsername: async (username) => {
    try {
      const response = await api.post('/crm/admin/check', { username });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single admin by ID for edit
  getAdminById: async (id) => {
    try {
      const response = await api.get(`/crm/admin/edit/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add new admin
  addAdmin: async (adminData) => {
    try {
      const response = await api.post('/crm/admin/add', adminData);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to add admin');
      }
      
      return response;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data || {};
        
        const serverError = new Error(
          errorData.message || errorData.errors || 'Failed to add admin'
        );
        
        serverError.response = error.response;
        throw serverError;
      }
      throw error;
    }
  },

  // Update admin
  updateAdmin: async (id, adminData) => {
    try {
      const response = await api.post(`/crm/admin/update/${id}`, adminData);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to update admin');
      }
      
      return response;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data || {};
        const serverError = new Error(
          errorData.message || errorData.errors || 'Failed to update admin'
        );
        serverError.response = error.response;
        throw serverError;
      }
      throw error;
    }
  },

  // Toggle admin status (active/inactive)
  toggleStatus: async (id, status) => {
  try {
    const formData = new FormData();
    formData.append('isActive', status ? '1' : '0');
    
    const response = await api.post(`/crm/admin/update/${id}`, formData);
    
    if (response.success === false) {
      throw new Error(response.message || 'Failed to update status');
    }
    
    return response;
  } catch (error) {
    throw error;
  }
},

  // Delete admin (if needed)
  deleteAdmin: async (id) => {
    try {
      const response = await api.delete(`/crm/admin/delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format admin data for UI
export const formatAdminForUI = (admin) => {
  return {
    id: admin.id,
    username: admin.username || 'N/A',
    name: admin.name || 'N/A',
    email: admin.email || 'N/A',
    phone: admin.phone || 'N/A',
    type: admin.type || 'user',
    isActive: admin.isActive === 1,
    selfie: admin.selfie || null,
    selfieUrl: admin.selfie_url || null,
    createdBy: admin.created_by || 'N/A',
    createdAt: admin.created_at || 'N/A',
    roleId: admin.role_id || null,
    providerId: admin.provider_id || null
  };
};