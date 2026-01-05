"use client";
import api from "@/utils/axiosInstance";

export const eligibilityAPI = {
    // Get eligibility data for a specific enquiry
    getEligibilityData: (id) => {
        return api.get(`/crm/eligibity/get/${id}`);
    },

    // Update eligibility with approved amount and max limit
    updateEligibility: (data) => {
        return api.post("/crm/eligibity/update", {
            id: data.id,
            approved_amount: data.approved_amount,
            max_limit: data.max_limit
        });
    },

    // Get rejection status options
    getRejectionStatuses: () => {
        return api.get("/crm/reject/status");
    },

    // Reject loan application
    rejectLoan: (data) => {
        return api.post("/crm/eligibity/reject", {
            id: data.id,
            remark: data.remark
        });
    }
};

// Format eligibility data from API response for UI
export const formatEligibilityForUI = (eligibilityData) => {
    const data = eligibilityData.data || {};
    
    return {
        id: data.id || '',
        crnNo: data.crnno || '',
        name: data.name || '',
        grossSalary: data.gross_salary || 0,  
        netSalary: data.net_salary || 0,
        totalExitingEMI: data.emi_amount || 0,
        balance: data.balance || 0,
        min20PercentOfBalance: data.minBalance || 0,
        max30PercentOfBalance: data.maxBalance || 0,
        maximumLimit: data.max_limit || '',
        finalRecommended: data.final_report || '',
        createdAt: data.created_at || '',
        updatedAt: data.updated_at || ''
    };
};

// Format rejection status options for dropdown
export const formatRejectionStatusForUI = (statusData) => {
    return statusData.data.map(status => ({
        id: status.id,
        reason: status.reason
    }));
};