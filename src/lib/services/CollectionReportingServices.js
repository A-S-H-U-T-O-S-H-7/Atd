"use client";
import api from "@/utils/axiosInstance";

export const collectionAPI = {
  getCollectionData: async (params = {}) => {
    try {
      const response = await api.get("/crm/collection/reporting", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  exportCollectionData: async (params = {}) => {
    try {
      const response = await api.get("/crm/collection/export", { params });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format collection data for UI
export const formatCollectionDataForUI = (collection) => {
  if (!collection) return null;
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  return {
    id: collection.id,
    application_id: collection.application_id,
    collectionDate: formatDate(collection.collection_date),
    crnNo: collection.crnno || 'N/A',
    loanNo: collection.loan_no || 'N/A',
    name: collection.fullname || 'N/A',
    adminFee: parseFloat(collection.admin_fee) || 0,
    gst: parseFloat(collection.gst) || 0,
    sanctionAmount: parseFloat(collection.approved_amount) || 0,
    disburseDate: formatDate(collection.disburse_date),
    transactionDate: formatDate(collection.transaction_date),
    dueDate: formatDate(collection.due_date),
    interest: parseFloat(collection.interest) || 0,
    penalty: parseFloat(collection.penality) || 0,
    gstPenalty: parseFloat(collection.penal_interest_gst) || 0,
    penalInterest: parseFloat(collection.penal_interest) || 0,
    renewalCharge: parseFloat(collection.renewal_charge) || 0,
    bounceCharge: parseFloat(collection.bounce_charge) || 0,
    collectionAmount: parseFloat(collection.collection_amount) || 0,
    totalAmount: parseFloat(collection.total_due_amount) || 0,
    agent: collection.collection_by || 'N/A',
    userBy: collection.collection_by || '-'
  };
};

// Collection reporting service
export const collectionReportingService = {
  getCollectionData: async (params = {}) => {
    try {
      const response = await collectionAPI.getCollectionData(params);
      
      const actualResponse = response?.success ? response : { 
        success: true, 
        data: response, 
        pagination: {} 
      };
      
      if (actualResponse && actualResponse.success) {
        const collectionsData = actualResponse.data || [];
        const formattedCollections = collectionsData.map(formatCollectionDataForUI);
        
        return {
          data: formattedCollections,
          pagination: actualResponse.pagination || {
            total: collectionsData.length,
            current_page: params.page || 1,
            per_page: params.per_page || 10,
            total_pages: Math.ceil(collectionsData.length / (params.per_page || 10))
          }
        };
      }
      throw new Error('Failed to fetch collection data');
    } catch (error) {
      throw error;
    }
  },

  exportCollection: async (params = {}) => {
    try {
      const response = await collectionAPI.exportCollectionData(params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAgents: async () => {
    return [
      { id: "all", name: "All Agents" },
      { id: "agent1", name: "Agent 1" },
      { id: "agent2", name: "Agent 2" }
    ];
  }
};

export default collectionReportingService;