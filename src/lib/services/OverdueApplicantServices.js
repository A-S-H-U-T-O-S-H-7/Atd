// lib/services/OverdueApplicantServices.js
"use client";
import api from "@/utils/axiosInstance";

export const overdueApplicantAPI = {
  getOverdueApplicants: async (params = {}) => {
    try {
      const response = await api.get("/crm/overdue/applicant", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getEmandateDetails: async (id) => {
    try {
      const response = await api.get(`/crm/overdue/enach/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  assignToAgency: async (applicationId) => {
    try {
      const response = await api.get(`/crm/overdue/assign/ajency/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },


  getChargeAmount: async (data) => {
    try {
      const response = await api.post("/crm/overdue/enach", data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  scheduleCharge: async (data) => {
    try {
      const response = await api.post("/crm/overdue/enach/schedule", data);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const formatOverdueApplicantForUI = (applicant) => {
  if (!applicant) return null;
  
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
    id: applicant.application_id,
    application_id: applicant.application_id,
    loanNo: applicant.loan_no || "N/A",
    dueDate: formatDate(applicant.duedate),
    name: applicant.fullname || "N/A",
    phoneNo: applicant.phone || "N/A",
    email: applicant.email || "N/A",
    balance: parseFloat(applicant.ledger_balance || 0),
    overdueAmt: parseFloat(applicant.overdue_details?.overdue?.total_due || applicant.ledger_balance || 0),
    upiPayments: parseFloat(applicant.total_collection || 0),
    total_collection: parseFloat(applicant.total_collection || 0), 
    approved_amount: parseFloat(applicant.approved_amount || 0),
    roi: parseFloat(applicant.roi || 0),
    tenure: applicant.tenure || "N/A",
    ovedays: applicant.ovedays || 0,
    last_collection_date: applicant.last_collection_date,
    overdue_details: applicant.overdue_details,
    status: applicant.ovedays > 0 ? "Overdue" : "Adjustment",
    assign_status: applicant.assign_status ?? 0,   
     assign_date: applicant.assign_date || null, 
  };
};

export const overdueApplicantService = {
  getOverdueApplicants: async (params = {}) => {
    try {
      const response = await overdueApplicantAPI.getOverdueApplicants(params);
      
      const actualResponse = response?.success ? response : { 
        success: true, 
        data: response, 
        pagination: {} 
      };
      
      if (actualResponse && actualResponse.success) {
        const applicantsData = actualResponse.data || [];
        const formattedApplicants = applicantsData.map(formatOverdueApplicantForUI);
        
        return {
          data: formattedApplicants,
          pagination: actualResponse.pagination || {
            total: applicantsData.length,
            current_page: params.page || 1,
            per_page: params.per_page || 10,
            total_pages: Math.ceil(applicantsData.length / (params.per_page || 10))
          }
        };
      }
      throw new Error('Failed to fetch overdue applicants');
    } catch (error) {
      throw error;
    }
  },

  assignToAgency: async (applicationId) => {
    try {
      const response = await overdueApplicantAPI.assignToAgency(applicationId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getEmandateDetails: async (id) => {
    try {
      const response = await overdueApplicantAPI.getEmandateDetails(id);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getChargeAmount: async (data) => {
    try {
      const response = await overdueApplicantAPI.getChargeAmount(data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  scheduleCharge: async (data) => {
    try {
      const response = await overdueApplicantAPI.scheduleCharge(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
};