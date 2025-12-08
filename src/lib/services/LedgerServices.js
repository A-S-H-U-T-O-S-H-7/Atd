"use client";
import api from "@/utils/axiosInstance";

export const ledgerAPI = {
  // Get ledger data with filters
  getLedgerData: async (params = {}) => {
    try {
      const response = await api.get("/crm/ledger/get", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get ledger details for a specific application
  getLedgerDetails: async (applicationId) => {
    try {
      const response = await api.get(`/crm/ledger/detail/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit adjustment
  submitAdjustment: async (applicationId, adjustmentData) => {
    try {
      const response = await api.put(`/crm/ledger/adjustment/${applicationId}`, adjustmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format ledger data for UI - SIMPLIFIED like complete page
export const formatLedgerDataForUI = (ledger) => {
  if (!ledger) return null;
  
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
    id: ledger.application_id,
    application_id: ledger.application_id,
    loanNo: ledger.loan_no || "N/A",
    dueDate: formatDate(ledger.duedate || ledger.due_date),
    name: ledger.name || "N/A",
    address: ledger.address ? `${ledger.address}, ${ledger.city || ''}, ${ledger.state || ''}` : "N/A",
    phone: ledger.phone || "N/A",
    email: ledger.email || "N/A",
    balance: ledger.balance || 0,
    over_due: ledger.over_due || 0,
    settled: (ledger.Settled === 1 || ledger.settled === 1),
    crnno: ledger.crnno || "N/A"
  };
};

// Format ledger details for transaction modal
export const formatLedgerDetailsForUI = (ledgerDetails) => {
  if (!ledgerDetails || !ledgerDetails.ledger) return { transactions: [], summary: {} };

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

  const transactions = ledgerDetails.ledger.map((transaction, index) => ({
    id: transaction.id || index,
    date: formatDate(transaction.create_date),
    particular: transaction.particular || "Transaction",
    debit: transaction.trx_type === 'debit' ? parseFloat(transaction.trx_amount || 0) : 0,
    credit: transaction.trx_type === 'credit' ? parseFloat(transaction.trx_amount || 0) : 0,
    balance: 0
  }));

  let runningBalance = 0;
  transactions.forEach(transaction => {
    runningBalance = runningBalance + transaction.debit - transaction.credit;
    transaction.balance = runningBalance;
  });

  return {
    transactions: transactions,
    summary: ledgerDetails.summary || {}
  };
};

// Adjustment service
export const adjustmentService = {
  submitAdjustment: async (applicationId, adjustmentData) => {
    try {
      const formattedData = {
        create_date: adjustmentData.date,
        adjustment_type: adjustmentData.type?.toLowerCase() || 'adjustment',
        particular: adjustmentData.remark || 'Adjustment',
        trx_amount: parseFloat(adjustmentData.amount || 0),
        trx_type: adjustmentData.type?.toLowerCase() || 'adjustment'
      };
      
      const response = await ledgerAPI.submitAdjustment(applicationId, formattedData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to submit adjustment');
    }
  }
};