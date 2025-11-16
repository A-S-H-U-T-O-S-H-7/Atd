import api from "@/utils/axiosInstance";

export const collectionAPI = {
  getCollectionReporting: async (params = {}) => {
    try {
      const response = await api.get("/crm/collection/reporting", { 
        params: {
          per_page: params.per_page || 10,
          page: params.page || 1,
          search_by: params.search_by || '',
          search_value: params.search_value || '',
          from_date: params.from_date || '',
          to_date: params.to_date || '',
          agent: params.agent || '',
          ...params
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  exportCollectionData: async (params = {}) => {
    try {
      const response = await api.get("/crm/collection/export", {
        params: {
          search_by: params.search_by || '',
          search_value: params.search_value || '',
          from_date: params.from_date || '',
          to_date: params.to_date || '',
          agent: params.agent || '',
          ...params
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

};

export const formatCollectionDataForUI = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  return apiData.map((item, index) => ({
    id: item.id || index + 1,
    sn: index + 1,
    collectionDate: formatDateForDisplay(item.collection_date),
    crnNo: item.crnno || 'N/A',
    loanNo: item.loan_no || 'N/A',
    name: item.fullname || 'N/A',
    adminFee: parseFloat(item.admin_fee) || 0,
    gst: parseFloat(item.gst) || 0,
    sanctionAmount: parseFloat(item.sanction_amount) || 0,
    disburseDate: formatDateForDisplay(item.disburse_date),
    transactionDate: formatDateForDisplay(item.transaction_date),
    dueDate: formatDateForDisplay(item.due_date),
    interest: parseFloat(item.interest) || 0,
    penalty: parseFloat(item.penality) || 0,
    gstPenalty: parseFloat(item.penal_interest_gst) || 0,
    penalInterest: parseFloat(item.penal_interest) || 0,
    renewalCharge: parseFloat(item.renewal_charge) || 0,
    bounceCharge: parseFloat(item.bounce_charge) || 0,
    collectionAmount: parseFloat(item.collection_amount) || 0,
    totalAmount: parseFloat(item.total_due_amount) || 0,
    agent: item.collection_by || 'N/A',
    userBy: item.collection_by || '-'
  }));
};


const formatDateForDisplay = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    return dateString;
  }
};

export const formatDateForAPI = (dateString) => {
  if (!dateString) return '';
  
  try {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return dateString;
  }
};

export const collectionReportingService = {
  getCollectionData: async (filters = {}) => {
    try {
      const response = await collectionAPI.getCollectionReporting(filters);
      
      if (response.success && response.data) {
        return {
          data: formatCollectionDataForUI(response.data),
          pagination: response.pagination || {
            total: response.data.length,
            current_page: filters.page || 1,
            per_page: filters.per_page || 10,
            total_pages: Math.ceil(response.data.length / (filters.per_page || 10))
          }
        };
      }
      throw new Error(response.message || 'Failed to fetch collection data');
    } catch (error) {
      throw error;
    }
  },

  exportCollection: async (filters = {}) => {
    try {
      const response = await collectionAPI.exportCollectionData(filters);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAgents: async () => {
    // Return static agents list (no API available)
    return [
      { id: "all", name: "All Agents" },
      { id: "agent1", name: "Agent 1" },
      { id: "agent2", name: "Agent 2" }
    ];
  },

  searchOptions: [
    { value: 'name', label: 'Name', apiField: 'fullname' },
    { value: 'loanNo', label: 'Loan No', apiField: 'loan_no' },
    { value: 'crnNo', label: 'CRN No', apiField: 'crnno' },
    { value: 'agent', label: 'Agent', apiField: 'collection_by' }
  ],

  mapFiltersToAPI: (filters) => {
    const apiFilters = {};
    
    if (filters.dateRange?.from) {
      apiFilters.from_date = formatDateForAPI(filters.dateRange.from);
    }
    if (filters.dateRange?.to) {
      apiFilters.to_date = formatDateForAPI(filters.dateRange.to);
    }
    
    if (filters.selectedAgent && filters.selectedAgent !== 'all') {
      apiFilters.agent = filters.selectedAgent;
    }
    
    if (filters.advancedSearch?.field && filters.advancedSearch?.term) {
      const searchOption = collectionReportingService.searchOptions.find(
        opt => opt.value === filters.advancedSearch.field
      );
      if (searchOption) {
        apiFilters.search_by = searchOption.apiField;
        apiFilters.search_value = filters.advancedSearch.term;
      }
    }

    if (filters.dueDateSearch) {
      apiFilters.due_date = formatDateForAPI(filters.dueDateSearch);
    }
    
    // Add pagination parameters
    if (filters.page) {
      apiFilters.page = filters.page;
    }
    if (filters.per_page) {
      apiFilters.per_page = filters.per_page;
    }
    
    return apiFilters;
  }
};

export default collectionReportingService;