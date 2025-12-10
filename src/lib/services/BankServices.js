import api from '@/utils/axiosInstance';

export const bankService = {
  // Get all banks with pagination and search
  getBanks: async (params = {}) => {
    try {
      const response = await api.get('/crm/bank/manage', {
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

  // Get single bank by ID for edit
  getBankById: async (id) => {
    try {
      const response = await api.get(`/crm/bank/edit/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add new bank
  addBank: async (bankData) => {
    try {
      const response = await api.post('/crm/bank/add', bankData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update bank
  updateBank: async (id, bankData) => {
    try {
      const response = await api.put(`/crm/bank/update/${id}`, bankData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Toggle bank status (active/inactive)
  toggleStatus: async (id) => {
    try {
      const response = await api.put(`/crm/bank/status/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete bank (if needed in future)
  deleteBank: async (id) => {
    try {
      const response = await api.delete(`/crm/bank/delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format bank data for UI
export const formatBankForUI = (bank) => {
  return {
    id: bank.id,
    bankName: bank.bank_name || `${bank.bank}-${bank.account_no.slice(-4)}`,
    bank: bank.bank || 'N/A',
    branchName: bank.branch_name || 'N/A',
    accountNo: bank.account_no || 'N/A',
    ifscCode: bank.ifsc_code || 'N/A',
    accountType: bank.account_type || 'N/A',
    name: bank.name || 'N/A',
    contactPerson: bank.contact_person || 'N/A',
    phone: bank.phone || 'N/A',
    email: bank.email || 'N/A',
    amount: parseFloat(bank.amount) || 0,
    usesFor: bank.uses_for || 'N/A',
    apikey: bank.apikey || 'N/A',
    passCode: bank.passCode || 'N/A',
    bcID: bank.bcID || 'N/A',
    isActive: bank.isActive === 1,
    addedBy: bank.added_by || 'N/A',
    createdAt: bank.created_at || 'N/A',
    status: bank.isActive === 1 ? 'Active' : 'Inactive'
  };
};