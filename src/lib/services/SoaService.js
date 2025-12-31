"use client";
import api from "@/utils/axiosInstance";

export const soaAPI = {
  // Get SOA data by application ID
  getSoaData: async (applicationId) => {
    try {
      const response = await api.get(`/crm/soa/${applicationId}`);
      return response;
    } catch (error) {
      console.error("API Error in soaService:", error);
      throw error;
    }
  }
};

// Format SOA data for UI - Keep exact API field names
export const formatSoaDataForUI = (apiData) => {
  
  if (!apiData || !apiData.data) {
    console.error("Invalid API data structure:", apiData);
    throw new Error("Invalid API response structure");
  }
  
  const { data } = apiData;
  
  // Helper function to format date to dd-mm-yyyy
  const formatDateString = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const dateOnly = dateString.includes(' ') ? dateString.split(' ')[0] : dateString;
      
      if (dateOnly.match(/^\d{2}-\d{2}-\d{4}$/)) {
        return dateOnly; 
      }
      
      // Convert yyyy-mm-dd format to dd-mm-yyyy
      if (dateOnly.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateOnly.split('-');
        return `${day}-${month}-${year}`;
      }
      
      // If format doesn't match, return original
      return dateString;
    } catch (error) {
      console.error('Date formatting error for:', dateString, error);
      return dateString || 'N/A';
    }
  };

  // Helper function to format amount
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '';
    if (typeof amount === 'string' && amount.includes('.')) {
      return parseFloat(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return parseInt(amount || 0).toLocaleString('en-IN');
  };

  return {
    // Details section data - exact API field names
    application_id: data.application_id || 6,
    status: data.status || 13,
    loan_no: data.loan_no || "ATDAM00005",
    crnno: data.crnno || "P17DN229",
    fullname: data.fullname || "Priyanka Gaur",
    tenure: data.tenure || 30,
    roi: `${data.roi}%`,
    sanction_date: formatDateString(data.sanction_date),
    sanction_amount: formatAmount(data.sanction_amount),
    process_percent: `${data.process_percent || 12}%`,
    process_fee: formatAmount(data.process_fee),
    gst: formatAmount(data.gst),
    disburse_date: formatDateString(data.disburse_date),
    transaction_date: formatDateString(data.transaction_date),
    due_date: formatDateString(data.due_date),
    disburse_amount: formatAmount(data.disburse_amount),
    ledger_balance: formatAmount(Math.abs(data.ledger_balance || -0.01)),
    closed_date: formatDateString(data.closed_date),
    
    // Table data - exact API details structure
    details: data.details?.map(detail => ({
      id: detail.sn,
      sn: detail.sn,
      date: formatDateString(detail.date),
      normal_interest_charged: detail.normal_interest_charged || "0.00",
      penal_interest_charged: detail.penal_interest_charged || "0.00",
      penality_charged: detail.penality_charged || "0.00",
      collection_received: detail.collection_received || "0.00",
      principle_adjusted: detail.principle_adjusted || "0.00",
      normal_interest_adjusted: detail.normal_interest_adjusted || "0.00",
      penal_interest_adjusted: detail.penal_interest_adjusted || "0.00",
      penalty_adjusted: detail.penalty_adjusted || "0.00",
      principle_after_adjusted: detail.principle_after_adjusted || "0.00",
      normal_interest_after_adjusted: detail.normal_interest_after_adjusted || "0.00",
      penal_interest_after_adjusted: detail.penal_interest_after_adjusted || "0.00",
      penalty_after_adjusted: detail.penalty_after_adjusted || "0.00",
      total_outstanding_amount: detail.total_outstanding_amount || "0.00"
    })) || []
  };
};