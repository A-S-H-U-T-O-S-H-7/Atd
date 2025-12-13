import api from "@/utils/axiosInstance";

export const callAPI = {
    // Get call history for a specific customer
    getCallHistory: (customerId, params = {}) => {
        return api.get(`/crm/call/get/${customerId}`, { params });
    },

    // Add new call remark
    addCallRemark: (customerId, callData) => {
        return api.put(`/crm/call/add/${customerId}`, callData);
    },

    // Get all calls with pagination and filters
    getAllCalls: (params = {}) => {
        return api.get("/crm/call/list", { params });
    },

    // Export calls to Excel
    exportCalls: (params = {}) => {
        return api.get("/crm/call/export", { params });
    },

     getReferences: (userId) => {
        return api.get(`/crm/call/refferences/${userId}`);
    }
};

export const callService = {
    // Format call data for UI display
    formatCallForUI: (call) => {
        if (!call) return null;
        
        return {
            id: call.id,
            customerId: call.customer_id,
            name: call.name?.trim() || "Customer",
            mobile: call.mobile,
            crnNo: call.crnno,
            loanNo: call.loan_no,
            dueDate: call.duedate,
            overdueAmount: call.overdueamount,
            dueAmount: call.dueamount,
            noOfDays: call.no_of_days,
            salaryDate: call.salary_date,
            customerAcNo: call.customer_ac_no,
            disburseDate: call.disburse_date,
            sanctionAmount: call.sanction_amount,
            disburseAmount: call.disburse_amount,
            ledgerAmount: call.ledger_amount,
            penalInterest: call.penal_interest,
            penalty: call.penality,
            alternateNo: call.alternate_no,
            refDetails: Array.isArray(call.ref_details) ? call.ref_details : [],
            companyAccountDetails: call.company_account_details || {},
            remark: call.remark,
            nextCall: call.nextcall,
            callDate: call.created_at,
            adminName: call.admin_name,
            status: call.status || "completed"
        };
    },

    // Format call history for UI
    formatCallHistoryForUI: (callHistory) => {
        if (!callHistory) return null;
        
        const callDate = new Date(callHistory.created_at);
        return {
            id: callHistory.id,
            remark: callHistory.remark,
            nextCall: callHistory.nextcall,
            callDate: callHistory.created_at,
            adminName: callHistory.admin_name,
            formattedDate: callDate.toLocaleDateString('en-GB'),
            formattedTime: callDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            formattedDateTime: callDate.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    },

    // Format customer details for UI
    formatCustomerDetailsForUI: (details) => {
        if (!details) return null;
        
        return {
            name: details.name,
            mobile: details.mobile,
            crnNo: details.crnno,
            loanNo: details.loan_no,
            dueDate: details.duedate,
            overdueAmount: details.overdueamount,
            dueAmount: details.dueamount,
            noOfDays: details.no_of_days,
            salaryDate: details.salary_date,
            customerAcNo: details.customer_ac_no,
            disburseDate: details.disburse_date,
            sanctionAmount: details.sanction_amount,
            disburseAmount: details.disburse_amount,
            ledgerAmount: details.ledger_amount,
            penalInterest: details.penal_interest,
            penalty: details.penality,
            alternateNo: details.alternate_no,
            refDetails: Array.isArray(details.ref_details) ? details.ref_details : [],
            companyAccountDetails: details.company_account_details || {}
        };
    },

    // Prepare call data for API submission - FIXED VERSION
    prepareCallData: (remark, nextCallDate = "") => {
        const callData = {
            remark: remark?.trim() || ""
        };
        
        // Only add nextcall if it has a value
        if (nextCallDate && nextCallDate.trim()) {
            callData.nextcall = nextCallDate.trim();
        }
        
        return callData;
    },

    // Alternative method that might work better
    prepareCallDataV2: (remark, nextCallDate = "") => {
        return {
            remark: remark?.trim() || "",
            next_call_date: nextCallDate || null  
        };
    },

    // Format multiple calls for UI
    formatCallsForUI: (calls) => {
        if (!Array.isArray(calls)) return [];
        return calls.map(call => this.formatCallForUI(call)).filter(Boolean);
    },

    // Format multiple call history items for UI
    formatCallHistoriesForUI: (callHistories) => {
        if (!Array.isArray(callHistories)) return [];
        return callHistories.map(history => this.formatCallHistoryForUI(history)).filter(Boolean);
    }
};

// Utility functions
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₹0.00";
    
    const numericAmount = typeof amount === 'string' 
        ? parseFloat(amount.replace(/,/g, '')) 
        : Number(amount);
    
    return `₹${numericAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString('en-GB');
    } catch (error) {
        return "N/A";
    }
};

export const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return "N/A";
    }
};

export const getCallStatus = (status) => {
    const statusMap = {
        "completed": "Completed",
        "pending": "Pending",
        "scheduled": "Scheduled",
        "missed": "Missed"
    };
    return statusMap[status] || "Completed";
};

// Additional utility for handling API responses
export const handleCallAPIResponse = (response) => {
    if (!response || !response.data) {
        throw new Error("Invalid API response");
    }
    
    const { success, message, data, calls, details } = response.data;
    
    if (!success) {
        throw new Error(message || "API call failed");
    }
    
    return {
        success,
        message,
        data,
        calls: Array.isArray(calls) ? calls : [],
        details: details || null
    };
};