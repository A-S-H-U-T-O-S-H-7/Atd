import api from "@/utils/axiosInstance";

export const disbursementAPI = {
  getDisbursementReporting: async (params = {}) => {
    try {
      const response = await api.get("/crm/disbursement/reporting", { 
        params: {
          per_page: params.per_page || 10,
          page: params.page || 1,
          search_by: params.search_by || '',
          search_value: params.search_value || '',
          from_date: params.from_date || '',
          to_date: params.to_date || '',
          bank: params.bank || '',
          transaction_status: params.transaction_status || '',
          ...params
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  exportDisbursementData: async (params = {}) => {
    try {
      const response = await api.get("/crm/disbursement/export", {
        params: {
          per_page: params.per_page || 10,
          page: params.page || 1,
          search_by: params.search_by || '',
          search_value: params.search_value || '',
          from_date: params.from_date || '',
          to_date: params.to_date || '',
          bank: params.bank || '',
          transaction_status: params.transaction_status || '',
          ...params
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateManualTransaction: async (disburseId, transactionData) => {
    try {
      const response = await api.put(`/crm/disbursement/transaction/manual/${disburseId}`, transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getBankList: async () => {
    try {
      const response = await api.get("/crm/disbursement/bank");
      return response;
    } catch (error) {
      throw error;
    }
  },

  getBankBranch: async (bankId) => {
    try {
      const response = await api.get(`/crm/disbursement/bank/${bankId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkTransactionStatus: async (transactionData) => {
    try {
      const response = await api.post("/crm/disbursement/transaction/status", transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  processTransfer: async (transferData) => {
    try {
      const response = await api.post("/crm/disbursement/transfer", transferData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const formatDisbursementDataForUI = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  return apiData.map((item, index) => ({
    id: item.disburse_id || item.id || index + 1,
    sn: index + 1,
    loanNo: item.loan_no || 'N/A',
    disburseDate: item.disburse_date || 'N/A',
    crnNo: item.crnno || 'N/A',
    tranRefNo: item.transaction_ref_no || 'N/A',
    tranDate: item.transaction_date || 'N/A',
    sanctionedAmount: item.sanction_amount || '0.00',
    disbursedAmount: item.disburse_amount || '0.00',
    senderAcNo: item.sender_acno || 'N/A',
    senderName: item.sender_name || 'ATD FINANCIAL SERVICES PVT LTD',
    transaction: item.transaction_type || 'NEFT',
    dueDate: item.due_date || 'N/A',
    beneficiaryBankIFSC: item.customer_ifsc || 'N/A',
    beneficiaryAcType: item.customer_ac_type || 'Saving',
    beneficiaryAcNo: item.customer_ac || 'N/A',
    beneficiaryAcName: item.customer_name || 'N/A',
    beneficiaryPhone: item.customer_phone || 'N/A',
    sendToRec: item.transaction_narration || `Loan/${item.loan_no || 'N/A'}`,
    newLoan: "Active",
    action: item.transaction_status || "Pending",
    isTransaction: !!item.transaction_ref_no,
    user_id: item.user_id,
    application_id: item.application_id,
    disburse_id: item.disburse_id
  }));
};

export const formatDisbursementExportData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  return apiData.map(item => ({
    'CRN No': item.crnno || 'N/A',
    'Name': item.name || 'N/A',
    'Loan No': item.loan_no || 'N/A',
    'Approved Amount': item.approved_amount || '0.00',
    'Disburse Transaction ID': item.disburse_transaction_id || 'N/A',
    'Disbursement Transaction Date': item.disbursement_transaction_date || 'N/A',
    'Disburse Amount': item.disburse_amount || '0.00',
    'Disburse Date': item.disburse_date || 'N/A',
    'ATD Bank': item.atd_bank || 'N/A',
    'ATD Branch': item.atd_branch || 'N/A',
    'Customer Bank': item.customer_bank || 'N/A',
    'Customer Branch': item.customer_branch || 'N/A',
    'Customer Account': item.customer_ac || 'N/A',
    'Customer IFSC': item.customer_ifsc || 'N/A'
  }));
};

export const formatManualTransactionData = (formData, disbursementData) => {
  return {
    transaction_amount: parseFloat(formData.disbursementAmount) || 0,
    transaction_id: formData.transactionId,
    transaction_date: formData.transactionDate,
    due_date: formData.dueDate,
    atd_bank: formData.bankName,
    atd_branch: formData.branchName
  };
};

export const formatTransferData = (formData, disbursementData) => {
  return {
    disburse_id: disbursementData?.disburse_id,
    application_id: disbursementData?.application_id,
    loan_no: disbursementData?.loan_no,
    transaction_amount: parseFloat(formData.disbursementAmount) || 0,
    beneficiary_account: formData.accountNo,
    beneficiary_ifsc: formData.ifscNo,
    beneficiary_name: disbursementData?.beneficiaryAcName,
    auth_code_1: formData.authCode1,
    auth_code_2: formData.authCode2,
    transaction_date: formData.transactionDate,
    due_date: formData.dueDate,
    atd_bank: formData.atdBankName,
    atd_branch: formData.atdBranchName
  };
};

export const formatTransactionStatusData = (formData, disbursementData) => {
  return {
    disburse_id: disbursementData?.disburse_id,
    loan_no: disbursementData?.loan_no,
    auth_code_1: formData.authCode1,
    auth_code_2: formData.authCode2,
    customer_name: disbursementData?.beneficiaryAcName,
    timestamp: new Date().toISOString()
  };
};

export const disbursementService = {
  getDisbursementData: async (filters = {}) => {
    try {
      const response = await disbursementAPI.getDisbursementReporting(filters);
      
      if (response.success && response.data) {
        return {
          data: formatDisbursementDataForUI(response.data),
          pagination: response.pagination || {
            total: response.data.length,
            current_page: filters.page || 1,
            per_page: filters.per_page || 10,
            total_pages: Math.ceil(response.data.length / (filters.per_page || 10))
          }
        };
      }
      throw new Error(response.message || 'Failed to fetch disbursement data');
    } catch (error) {
      throw error;
    }
  },

  exportDisbursement: async (filters = {}, exportType = 'all') => {
    try {
      const response = await disbursementAPI.exportDisbursementData(filters);
      
      if (response.success && response.data) {
        if (exportType === 'gst') {
          const gstData = response.data.filter(item => !item.disburse_transaction_id);
          return formatDisbursementExportData(gstData);
        }
        return formatDisbursementExportData(response.data);
      }
      throw new Error(response.message || 'Failed to export disbursement data');
    } catch (error) {
      throw error;
    }
  },

  updateTransaction: async (disburseId, formData, disbursementData) => {
    try {
      const transactionData = formatManualTransactionData(formData, disbursementData);
      const response = await disbursementAPI.updateManualTransaction(disburseId, transactionData);
      
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Failed to update transaction');
    } catch (error) {
      throw error;
    }
  },

  getBanks: async () => {
    try {
      const response = await disbursementAPI.getBankList();
      
      if (response.success && response.bank) {
        return response.bank.map(bank => ({
          id: bank.id,
          name: bank.bank_name
        }));
      }
      throw new Error(response.message || 'Failed to fetch bank list');
    } catch (error) {
      throw error;
    }
  },

  getBankDetails: async (bankId) => {
    try {
      const response = await disbursementAPI.getBankBranch(bankId);
      
      if (response.success && response.bank) {
        return response.bank;
      }
      throw new Error(response.message || 'Failed to fetch bank details');
    } catch (error) {
      throw error;
    }
  },

  checkTransactionStatus: async (formData, disbursementData) => {
    try {
      const statusData = formatTransactionStatusData(formData, disbursementData);
      const response = await disbursementAPI.checkTransactionStatus(statusData);
      
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Failed to check transaction status');
    } catch (error) {
      throw error;
    }
  },

  processTransfer: async (formData, disbursementData) => {
    try {
      const transferData = formatTransferData(formData, disbursementData);
      const response = await disbursementAPI.processTransfer(transferData);
      
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Failed to process transfer');
    } catch (error) {
      throw error;
    }
  },

  searchOptions: [
    { value: 'crnNo', label: 'CRN No', apiField: 'crnno' },
    { value: 'loanNo', label: 'Loan No', apiField: 'loan_no' },
    { value: 'beneficiaryAcName', label: 'Name', apiField: 'customer_name' },
    { value: 'beneficiaryPhone', label: 'Phone', apiField: 'customer_phone' },
    { value: 'tranRefNo', label: 'Trans Ref', apiField: 'transaction_ref_no' }
  ],

  mapFiltersToAPI: (filters) => {
    const apiFilters = {};
    
    if (filters.dateRange?.from) {
      apiFilters.from_date = filters.dateRange.from;
    }
    if (filters.dateRange?.to) {
      apiFilters.to_date = filters.dateRange.to;
    }
    
    if (filters.selectedBank && filters.selectedBank !== 'all') {
      apiFilters.bank = filters.selectedBank;
    }
    
    if (filters.filterBy && filters.filterBy !== 'all') {
      apiFilters.transaction_status = filters.filterBy;
    }
    
    if (filters.advancedSearch?.field && filters.advancedSearch?.term) {
      const searchOption = disbursementService.searchOptions.find(
        opt => opt.value === filters.advancedSearch.field
      );
      if (searchOption) {
        apiFilters.search_by = searchOption.apiField;
        apiFilters.search_value = filters.advancedSearch.term;
      }
    }
    
    return apiFilters;
  }
};

export default disbursementService;