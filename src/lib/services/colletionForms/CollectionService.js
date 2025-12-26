"use client";
import api from "@/utils/axiosInstance";

// collectionService.js - Complete updated service
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

  

  // Calculate collection (PATCH) - NEW METHOD
  calculateCollection: async (applicationId, collectionDate) => {
    try {
      const response = await api.patch(`/crm/collection/get/${applicationId}`, {
        collection_date: collectionDate
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit normal collection (PUT) - UPDATED
  submitNormalCollection: async (applicationId, formData, collectionData) => {
    try {
      const payload = {
        collection_date: formData.collectionDate,
        principal_amount: parseFloat(collectionData?.principal_amount || 0),
        normal_interest_before: parseFloat(formData.normalInterestBefore || 0),
        normal_interest_after: parseFloat(formData.normalInterestAfter || 0),
        penal_interest_before: parseFloat(formData.penalInterestBefore || 0),
        penal_interest_after: parseFloat(formData.penalInterestAfter || 0),
        penalty_before: parseFloat(formData.penaltyBefore || 0),
        penalty_after: parseFloat(formData.penaltyAfter || 0),
        bounce_charge: parseFloat(formData.bounceCharge || 0),
        total_due_amount: parseFloat(formData.totalDueAmount || 0),
        collection_bank_name: formData.bankId ? parseInt(formData.bankId) : null,
        disbursed_bank: collectionData?.disburse_bank || "",
        collection_amount: parseFloat(formData.collectionAmount),
        collection_transaction_id: formData.transactionId || "",
        collection_by: formData.collectionBy,
      };

      console.log("Submitting collection payload:", payload);
      
      const response = await api.put(`/crm/collection/add-collection/${applicationId}`, payload);
      return response;
    } catch (error) {
      console.error("Collection service error:", error);
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