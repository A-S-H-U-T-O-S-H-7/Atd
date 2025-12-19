import api from "@/utils/axiosInstance";

const API_ENDPOINTS = {
  GET_ALL: "/crm/payment-receipt",
  CREATE_RECEIPT: "/crm/payment-receipt",
  UPDATE_RECEIPT: (id) => `/crm/payment-receipt/${id}`,
};

export const formatPaymentForUI = (apiData, index, currentPage = 1, itemsPerPage = 10) => {
  return {
    id: apiData.id,
    srNo: (currentPage - 1) * itemsPerPage + index + 1,
    date: apiData.create_date?.split(' ')[0] || apiData.create_date,
    loanNo: apiData.loan_no,
    name: apiData.name,
    email: apiData.email,
    phone: apiData.phone,
    outstandingAmount: apiData.outstanding_amount,
    payableAmount: apiData.paylable_amount,
    receivedAmount: apiData.received_amount,
    commission: "-",
    status: apiData.status,
    payment_from: apiData.payment_from,
    collection_status: apiData.collection_status,
    application_id: apiData.application_id
  };
};

export const paymentReceiptAPI = {
  getPayments: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ALL, { params });
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  createPaymentReceipt: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_RECEIPT, data);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  updatePaymentReceipt: async (id, data) => {
    try {
      const response = await api.put(API_ENDPOINTS.UPDATE_RECEIPT(id), data);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
};