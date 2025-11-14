"use client";
import api from "@/utils/axiosInstance";

export const collectionService = {
  // Get bank list
  getBankList: async () => {
    try {
      const response = await api.get("/crm/collection/bank");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get bank details
  getBankDetails: async (bankId) => {
    try {
      const response = await api.get(`/crm/collection/bank/${bankId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get collection details
  getCollectionDetails: async (applicationId) => {
    try {
      const response = await api.get(`/crm/collection/get/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit collection
  submitCollection: async (applicationId, collectionData) => {
    try {
      const response = await api.post(`/crm/collection/submit/${applicationId}`, collectionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit normal collection
  submitNormalCollection: async (applicationId, formData) => {
    try {
      const payload = {
        collection_date: formData.collectionDate,
        penalty_amount: formData.penaltyInput || "0",
        penal_interest: formData.penalInterest || "0",
        bounce_charge: formData.bounceCharge || "0",
        collection_by: formData.collectionBy,
        bank_name: formData.bankName || "",
        transaction_id: formData.transactionId || "",
        collection_amount: formData.collectionAmount,
        status: formData.status
      };

      const response = await api.post(`/crm/collection/normal/${applicationId}`, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit recollection
  submitRecollection: async (applicationId, formData) => {
    try {
      const response = await api.post(`/crm/collection/recollection/${applicationId}`, formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit renewal collection
  submitRenewalCollection: async (applicationId, formData) => {
    try {
      const response = await api.post(`/crm/collection/renewal/${applicationId}`, formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit EMI collection
  submitEmiCollection: async (applicationId, formData) => {
    try {
      const response = await api.post(`/crm/collection/emi/${applicationId}`, formData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};