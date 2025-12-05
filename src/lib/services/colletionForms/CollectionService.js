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

  // In your collectionService
submitNormalCollection: async (applicationId, formData, collectionData) => {
  try {
    const penaltyAmount = parseFloat(formData.penaltyInput || 0);
    const penalInterest = parseFloat(formData.penalInterest || 0);
    const bounceCharge = parseFloat(formData.bounceCharge || 0);
    
    const penalInterestBase = penalInterest > 0 ? penalInterest / 1.18 : 0;
    const penalInterestGST = penalInterest > 0 ? penalInterest - penalInterestBase : 0;
    
    const baseDueAmount = parseFloat(collectionData?.dw_collection || 0);
    const normalInterest = parseFloat(formData.normalInterest || 0);
    const totalDueAmount = baseDueAmount + normalInterest + penaltyAmount + penalInterest + bounceCharge;

    const payload = {
      sanction_amount: parseFloat(collectionData?.approved_amount || 0),
      disburse_date: collectionData?.disburse_date || "",
      transaction_date: collectionData?.transaction_date || "",
      due_date: collectionData?.duedate || "",
      principal_amount: parseFloat(collectionData?.approved_amount || 0),
      process_fee: parseFloat(collectionData?.process_fee || 0),
      interest: parseFloat(formData.normalInterest || 0),
      due_amount: baseDueAmount,
      collection_date: formData.collectionDate,
      panality: penaltyAmount,
      panality_interest: penalInterestBase,
      penal_interest_gst: penalInterestGST,
      bounce_charge: bounceCharge,
      total_due_amount: totalDueAmount,
      collection_bank_name: formData.bankName || "",
      collection_bank_id: formData.bankId || null, 
      disbursed_bank: collectionData?.bank_name || "",
      collected_amount: parseFloat(formData.collectionAmount),
      collected_transaction_id: formData.transactionId || "",
      collection_by: formData.collectionBy,
      status: formData.status
    };

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