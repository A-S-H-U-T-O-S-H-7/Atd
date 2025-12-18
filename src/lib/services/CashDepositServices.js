import api from "@/utils/axiosInstance";

const API_ENDPOINTS = {
  GET_ALL: "/crm/deposit/cash/manage",
  GET_SINGLE: (id) => `/crm/deposit/cash/edit/${id}`,
  CREATE: "/crm/deposit/cash/add",
  UPDATE: (id) => `/crm/deposit/cash/update/${id}`,
};

// Map API response bank_name to dropdown options
const mapBankNameForUI = (apiBankName) => {
  const mappings = {
    "HDFCFFF-9012": "HDFC Bank-A/C-2456",
  };
  return mappings[apiBankName] || apiBankName;
};

// Map dropdown bank name to API bank_id
const mapBankNameToId = (dropdownBankName) => {
  const mappings = {
    "ICICI Bank-A/C-1738": 1,
    "HDFC Bank-A/C-2456": 6,
    "SBI Bank-A/C-9871": 3,
    "Axis Bank-A/C-3421": 4,
    "PNB Bank-A/C-5678": 5,
  };
  return mappings[dropdownBankName];
};

export const formatCashDepositForUI = (apiData, index, currentPage = 1, itemsPerPage = 10) => {
  return {
    id: apiData.id,
    sNo: (currentPage - 1) * itemsPerPage + index + 1,
    bankName: mapBankNameForUI(apiData.bank_name),
    depositDate: apiData.deposit_date?.split('T')[0] || apiData.deposit_date,
    amount: apiData.deposit_amount,
    user: apiData.admin_name || "admin",
    bank_id: apiData.bank_id
  };
};

export const getBankIdFromName = (bankName) => {
  return mapBankNameToId(bankName);
};

export const cashDepositAPI = {
  getCashDeposits: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ALL, { params });
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  getCashDepositById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_SINGLE(id));
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  getBanks: async () => {
    try {
      const response = await api.get("/crm/deposit/banks");
      return response;
    } catch (error) {
      throw error;
    }
  },

  getBankDetails: async (bankId) => {
    try {
      const response = await api.get(`/crm/deposit/bank/${bankId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },


  createCashDeposit: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE, data);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  updateCashDeposit: async (id, data) => {
    try {
      const response = await api.put(API_ENDPOINTS.UPDATE(id), data);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
};