"use client";
import api from "@/utils/axiosInstance";

export const ledgerAPI = {
  // Get ledger data with filters
  getLedgerData: async (params = {}) => {
    try {
      const response = await api.get("/crm/ledger/get", { params });
      return response.data || response;
    } catch (error) {
      console.error("API Error - getLedgerData:", error);
      throw error;
    }
  },

  // Get ledger details for a specific application
  getLedgerDetails: async (applicationId) => {
    try {
      const response = await api.get(`/crm/ledger/detail/${applicationId}`);
      return response.data || response;
    } catch (error) {
      console.error("API Error - getLedgerDetails:", error);
      throw error;
    }
  },

  // Submit adjustment
  submitAdjustment: async (applicationId, adjustmentData) => {
    try {
      const response = await api.put(`/crm/ledger/adjustment/${applicationId}`, adjustmentData);
      return response.data || response;
    } catch (error) {
      console.error("API Error - submitAdjustment:", error);
      throw error;
    }
  }
};

// Format ledger data for UI
export const formatLedgerDataForUI = (ledger, index) => {
  if (!ledger) return null;
  
  return {
    id: ledger.application_id || index,
    sn: ledger.application_id || index,
    loanNo: ledger.loan_no || "N/A",
    disburseDate: formatDate(ledger.disburse_date),
    dueDate: formatDate(ledger.duedate || ledger.due_date),
    name: ledger.name || "N/A",
    address: ledger.address ? `${ledger.address}, ${ledger.city || ''}, ${ledger.state || ''}` : "N/A",
    phone: ledger.phone || "N/A",
    email: ledger.email || "N/A",
    balance: ledger.balance || 0,
    over_due: ledger.over_due || 0,
    settled: (ledger.Settled === 1 || ledger.settled === 1),
    application_id: ledger.application_id,
    crnno: ledger.crnno || "N/A"
  };
};

// Format ledger details for transaction modal
export const formatLedgerDetailsForUI = (ledgerDetails) => {
  if (!ledgerDetails || !ledgerDetails.ledger) return { transactions: [], summary: {} };

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

// Helper function to format date
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

// Export to Excel utility
export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }
  
  // Create CSV content
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => 
      JSON.stringify(row[header] || '').replace(/"/g, '""')
    ).join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};