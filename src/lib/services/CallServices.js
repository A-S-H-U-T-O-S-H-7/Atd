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
    }
};

export const callService = {
    // Format call data for UI display
    formatCallForUI: (call) => {
        return {
            id: call.id,
            customerId: call.customer_id,
            name: call.name || "Customer",
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
            refDetails: call.ref_details || [],
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
        return {
            id: callHistory.id,
            remark: callHistory.remark,
            nextCall: callHistory.nextcall,
            callDate: callHistory.created_at,
            adminName: callHistory.admin_name,
            formattedDate: new Date(callHistory.created_at).toLocaleDateString('en-GB'),
            formattedTime: new Date(callHistory.created_at).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    },

    // Format customer details for UI
    formatCustomerDetailsForUI: (details) => {
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
            refDetails: details.ref_details || [],
            companyAccountDetails: details.company_account_details || {}
        };
    },

    // Prepare call data for API submission
    prepareCallData: (remark, nextCallDate = "") => {
        return {
            remark: remark,
            nextcall: nextCallDate || ""
        };
    }
};

// Utility functions
export const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
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