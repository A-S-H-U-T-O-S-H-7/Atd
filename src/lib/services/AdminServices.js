import api from '@/utils/axiosInstance';

export const adminService = {

  //get admin
  getAdmins: async (params = {}) => {
    const response = await api.get('/crm/admin/manage', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        search: params.search || ''
      }
    });
    return response;
  },

  //check user
  checkUsername: async (username) => {
    return await api.post('/crm/admin/check', { username });
  },

  //get admin by id
  getAdminById: async (id) => {
    return await api.get(`/crm/admin/edit/${id}`);
  },

  //Add Admin
  addAdmin: async (adminData) => {
    const response = await api.post('/crm/admin/add', adminData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (!response.success) throw new Error(response.message || 'Failed to add admin');
    return response;
  },

  //update Admin
  updateAdmin: async (id, adminData) => {
    const response = await api.post(`/crm/admin/update/${id}`, adminData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (!response.success) throw new Error(response.message || 'Failed to update admin');
    return response;
  },

  //toggle status for Active and inactive admin
  toggleStatus: async (id) => {
    return await api.get(`/crm/admin/status/${id}`);
  },

  //get persmission of specific admin
  getPermissions: async (adminId) => {
    const response = await api.get(`/crm/admin/edit/${adminId}`);
    
    if (response.success && response.data.permissions) {
      return { success: true, data: response.data.permissions };
    }
    throw new Error('No permissions data found');
  },

  //update admin permission
  updatePermissions: async (adminId, permissions) => {
    const formattedPermissions = {};
    Object.keys(permissions).forEach(key => {
      formattedPermissions[key] = permissions[key] === 1 ? 1 : 0;
    });

    return await api.put(`/crm/admin/permission/${adminId}`, formattedPermissions);
  }
};

export const formatAdminForUI = (admin) => ({
  id: admin.id,
  username: admin.username || '',
  name: admin.name || '',
  email: admin.email || '',
  phone: admin.phone || '',
  type: admin.type || 'user',
  isActive: admin.isActive === true || admin.isActive === 1 || admin.isActive === '1',
  selfieUrl: admin.selfie_url || null,
  createdBy: admin.created_by || 'System',
  createdAt: admin.created_at || ''
});