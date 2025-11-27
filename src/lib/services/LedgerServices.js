"use client";
import api from "@/utils/axiosInstance";

export const ledgerAPI = {
  // Get ledger data with filters
  getLedgerData: async (params = {}) => {
    try {
      const response = await api.get("/crm/ledger/get", { params });
      return response;
    } catch (error) {
      console.error("API Error - getLedgerData:", error);
      throw error;
    }
  },

  // Get ledger details for a specific application
  getLedgerDetails: async (applicationId) => {
    try {
      const response = await api.get(`/crm/ledger/detail/${applicationId}`);
      return response;
    } catch (error) {
      console.error("API Error - getLedgerDetails:", error);
      throw error;
    }
  },

  // Submit adjustment
  submitAdjustment: async (applicationId, adjustmentData) => {
    try {
      const response = await api.put(`/crm/ledger/adjustment/${applicationId}`, adjustmentData);
      return response;
    } catch (error) {
      console.error("API Error - submitAdjustment:", error);
      throw error;
    }
  },

  // Export ledger data
  exportLedgerData: async (params = {}) => {
    try {
      const response = await api.get("/crm/ledger/export", { 
        params,
        responseType: 'blob' 
      });
      return response;
    } catch (error) {
      console.error("API Error - exportLedgerData:", error);
      throw error;
    }
  },

  // Download individual ledger entry as PDF
  downloadIndividualLedgerPDF: async (applicationId, applicantName, loanNo) => {
    try {
      // Use the SAME export API but with individual entry parameters
      const params = {
        export_type: 'pdf',
        individual_entry: true,
        application_id: applicationId,
        report_type: 'customer_statement'
      };

      const response = await api.get("/crm/ledger/export", {
        params: params,
        responseType: 'blob'
      });
      
      // Create PDF blob
      const blob = new Blob([response], { 
        type: 'application/pdf' 
      });
      
      // Download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ledger-${loanNo}-${applicantName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Individual PDF download error:', error);
      throw new Error('Failed to download PDF statement');
    }
  },

  // Print individual ledger entry
 downloadIndividualLedgerPDF: async (applicationId, applicantName, loanNo) => {
    try {
      // Use the SAME export API but with individual entry parameters
      const params = {
        export_type: 'pdf',
        individual_entry: true,
        application_id: applicationId,
        report_type: 'customer_statement'
      };

      const response = await api.get("/crm/ledger/export", {
        params: params,
        responseType: 'blob'
      });
      
      // Create PDF blob
      const blob = new Blob([response], { 
        type: 'application/pdf' 
      });
      
      // Download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ledger-${loanNo}-${applicantName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Individual PDF download error:', error);
      throw new Error('Failed to download PDF statement');
    }
  },

  printIndividualLedger: async (applicationId) => {
    try {
      const params = {
        export_type: 'pdf', 
        individual_entry: true,
        application_id: applicationId,
        report_type: 'customer_statement',
        print: true
      };

      const response = await api.get("/crm/ledger/export", {
        params: params,
        responseType: 'blob'
      });
      
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open PDF in new tab for printing
      const printWindow = window.open(url);
      
      return { success: true };
    } catch (error) {
      console.error('Print error:', error);
      throw new Error('Failed to open print view');
    }
  },



  // Settle loan
  settleLoan: async (applicationId) => {
    try {
      const response = await api.get(`/crm/ledger/settle/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error("API Error - settleLoan:", error);
      throw error;
    }
  }
};

// Format ledger data for UI
export const formatLedgerDataForUI = (ledger) => {
  return {
    id: ledger.application_id,
    sn: ledger.application_id,
    call: "Call",
    loanNo: ledger.loan_no,
    disburseDate: formatDate(ledger.disburse_date),
    dueDate: formatDate(ledger.duedate || ledger.due_date),
    name: ledger.name,
    address: `${ledger.address}, ${ledger.city}, ${ledger.state}`,
    phoneNo: ledger.phone,
    email: ledger.email || "N/A",
    balance: ledger.balance,
    over_due: ledger.over_due,
    settled: ledger.Settled === 1 || ledger.settled === 1,
    application_id: ledger.application_id,
    disburse_id: ledger.disburse_id,
    crnno: ledger.crnno
  };
};

// Format ledger details for transaction modal
export const formatLedgerDetailsForUI = (ledgerDetails) => {
  if (!ledgerDetails || !ledgerDetails.ledger) return { transactions: [], summary: {} };

  const transactions = ledgerDetails.ledger.map((transaction, index) => ({
    id: transaction.id,
    date: formatDate(transaction.create_date),
    particular: transaction.particular,
    debit: transaction.trx_type === 'debit' ? parseFloat(transaction.trx_amount) : 0,
    credit: transaction.trx_type === 'credit' ? parseFloat(transaction.trx_amount) : 0,
    balance: 0
  }));

  // Calculate running balance
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
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date
    
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
        adjustment_type: adjustmentData.type.toLowerCase(),
        particular: adjustmentData.remark || 'Adjustment',
        trx_amount: parseFloat(adjustmentData.amount),
        trx_type: adjustmentData.type.toLowerCase()
      };
      
      const response = await ledgerAPI.submitAdjustment(applicationId, formattedData);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to submit adjustment';
      throw new Error(errorMessage);
    }
  }
};

// Export service
export const exportService = {
  downloadLedgerExport: async (filters = {}, filename = 'ledger-export') => {
    try {
      const response = await ledgerAPI.exportLedgerData(filters);
      
      // Create blob from response
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let exportFilename = filename;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          exportFilename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', exportFilename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Export downloaded successfully' };
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to download export';
      throw new Error(errorMessage);
    }
  }
};