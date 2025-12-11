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
      if (response.status === false) {
        throw new Error(response.message || 'Failed to add bank');
      }
      return response;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data || {};
        throw {
          response: {
            data: errorData,
            status: error.response.status
          },
          message: errorData.message || 'Failed to add bank'
        };
      }
      throw error;
    }
  },

  // Update bank
  updateBank: async (id, bankData) => {
    try {
      const response = await api.put(`/crm/bank/update/${id}`, bankData);
      if (response.status === false) {
        throw new Error(response.message || 'Failed to update bank');
      }
      return response;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data || {};
        throw {
          response: {
            data: errorData,
            status: error.response.status
          },
          message: errorData.message || 'Failed to update bank'
        };
      }
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


export const formatBankForUI = (bank) => {
  const isEmpty = (value) => {
    return value === null || value === undefined || value === '' || value === 'N/A';
  };

  return {
    id: bank.id,
    bankName: bank.bank_name || `${bank.bank || ''}-${(bank.account_no || '').slice(-4)}`,
    bank: bank.bank || '',
    branchName: bank.branch_name || '',
    accountNo: bank.account_no || '',
    ifscCode: bank.ifsc_code || '',
    accountType: bank.account_type || '',
    name: bank.name || '',
    contactPerson: isEmpty(bank.contact_person) ? '' : bank.contact_person,
    phone: isEmpty(bank.phone) ? '' : bank.phone,
    email: isEmpty(bank.email) ? '' : bank.email,
    amount: parseFloat(bank.amount) || 0,
    usesFor: bank.uses_for || 'collection', 
    apikey: isEmpty(bank.apikey) ? '' : bank.apikey,
    passCode: isEmpty(bank.passCode) ? '' : bank.passCode,
    bcID: isEmpty(bank.bcID) ? '' : bank.bcID,
    isActive: bank.isActive === 1,
    addedBy: bank.added_by || '',
    createdAt: bank.created_at || '',
    status: bank.isActive === 1 ? 'Active' : 'Inactive'
  };
};