"use client";
import api from "@/utils/axiosInstance";
import {  getStatusName, getStatusId } from "@/utils/applicationStatus";

export const enquiryAPI = {
    getAllEnquiries: (params = {}) => {
        return api.get("/crm/application/all-application", { params });
    },

    exportEnquiries: (params = {}) => {
        return api.get("/crm/application/export/all-application", { params });
    },

    getApplicationForEdit: (id) => {
        return api.get(`/crm/application/edit/${id}`);
    },

    updateApplication: (id, data) => {
        return api.put(`/crm/application/update/${id}`, data);
    },

    // ADD THESE NEW API METHODS FOR CONSISTENCY
    updateApplicationStatus: async (applicationId, statusData) => {
        try {
            const response = await api.put(`/crm/application/status/${applicationId}`, statusData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    blacklistApplication: async (applicationId) => {
        try {
            const response = await api.put(`/crm/application/black-list/${applicationId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    activateAccount: async (applicationId) => {
        try {
            const response = await api.put(`/crm/application/activate/${applicationId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
}; 

export const enachAPI = {
    getBankList: () => {
        return api.get("/enach-bank");
    },

    getBankModes: (bankName) => {
        return api.get(`/enach-bank/${encodeURIComponent(bankName)}`);
    },

    getBankCode: (modeId) => {
        return api.get(`/enach-bank/bank-code/${modeId}`);
    }
};

export const locationAPI = {
    getStates: () => {
        return api.get("/states");
    },

    getCities: (stateName) => {
        return api.get(`/cities?state=${encodeURIComponent(stateName)}`);
    }
};

// Get appraisal PDF
export const AppraisalPDF = {
    getAppraisalPDF: (applicationId) => {
        return api.get(`/crm/appraisal/pdf/${applicationId}`, {
            responseType: 'blob' 
        });
    },
};

// USE GLOBAL STATUS CONSTANTS INSTEAD OF LOCAL ONES
export const formatEnquiryForUI = (enquiry) => {
  const getTimeFromDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      console.error('Time parsing error:', error);
      return 'N/A';
    }
  };

  // Helper function to format date properly
  const getDateFromDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('en-GB');
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'N/A';
    }
  };

  return {
    // Basic identifiers
    id: enquiry.application_id,
    srNo: enquiry.application_id,
    enquirySource: enquiry.enquiry_type,
    crnNo: enquiry.crnno,
    accountId: enquiry.accountId,

    // Date and time - FIXED: Use enquiry_date from API response
    enquiryDate: getDateFromDateTime(enquiry.enquiry_date),
    enquiryTime: getTimeFromDateTime(enquiry.enquiry_date),

    // Personal information
    name: `${enquiry.fname} ${enquiry.lname}`,
    firstName: enquiry.fname,
    lastName: enquiry.lname,
    dob: enquiry.dob,
    gender: enquiry.gender,

    // Address information
    currentAddress: enquiry.current_address,
    currentState: enquiry.current_state,
    currentCity: enquiry.current_city,
    currentPincode: enquiry.current_pincode,
    currentHouseNo: enquiry.current_house_no,
    address: enquiry.address,
    state: enquiry.state,
    city: enquiry.city,
    pincode: enquiry.pincode,
    houseNo: enquiry.house_no,

    // Contact information
    phoneNo: enquiry.phone,
    email: enquiry.email,

    // Loan information
    appliedLoan: enquiry.applied_amount,
    loanAmount: enquiry.approved_amount,
    appliedAmount: enquiry.applied_amount,
    approvedAmount: enquiry.approved_amount,
    roi: `${enquiry.roi}%`,
    tenure: `${enquiry.tenure} days`,
    loanTerm: enquiry.loan_term === 4 ? "One Time Payment" : "Daily",

    // Document availability flags
    hasPhoto: !!enquiry.selfie,
    hasPanCard: !!enquiry.pan_proof,
    hasAddressProof: !!enquiry.address_proof,
    hasIdProof: !!enquiry.aadhar_proof,
    hasSalaryProof: !!enquiry.salary_slip,
    hasSecondSalaryProof: !!enquiry.second_salary_slip,
    hasThirdSalaryProof: !!enquiry.third_salary_slip,
    hasBankStatement: !!enquiry.bank_statement,
    hasBankVerificationReport: !!enquiry.bank_verif_report,
    hasSocialScoreReport: !!enquiry.social_score_report,
    hasCibilScoreReport: !!enquiry.cibil_score_report,

    // Use the same property names that components expect
    selfie: enquiry.selfie, 
    pan_proof: enquiry.pan_proof, 
    address_proof: enquiry.address_proof, 
    aadhar_proof: enquiry.aadhar_proof, 
    salary_slip: enquiry.salary_slip, 
    second_salary_slip: enquiry.second_salary_slip, 
    third_salary_slip: enquiry.third_salary_slip, 
    bank_statement: enquiry.bank_statement, 
    bank_verif_report: enquiry.bank_verif_report, 
    social_score_report: enquiry.social_score_report, 
    cibil_score_report: enquiry.cibil_score_report, 

    // Status and approval information
    approvalNote: enquiry.approval_note,
    status: getStatusName(enquiry.loan_status),
    loanStatus: getStatusName(enquiry.loan_status),

    // Application stage information
    isVerified: enquiry.verify === 1,
    isReportChecked: enquiry.report_check === 1,
    isFinalStage: enquiry.verify === 1 && enquiry.report_check === 1,
    verifyStatus: enquiry.verify,
    reportCheckStatus: enquiry.report_check,

    // Final report information
    hasAppraisalReport: !!enquiry.totl_final_report,
    finalReportStatus: enquiry.totl_final_report,
    isRecommended: enquiry.totl_final_report === "Recommended",

    // Mail information
    mailCounter: enquiry.mail_counter,
    mailerDate: enquiry.mailer_date,

    // Timestamps
    createdAt: enquiry.created_at,
    updatedAt: enquiry.updated_at,

    // Add these for consistency with completed applications
    accountActivation: enquiry.accountActivation === 1,
    isBlacklisted: enquiry.blacklist === 1,
  };
};


// ADD STATUS SERVICE FOR CONSISTENCY (Same as CompletedApplicationServices)
export const statusService = {
    updateStatus: async (applicationId, statusName, remark = "") => {
        try {
            const statusData = {
                status: getStatusId(statusName), // Using imported function
                remark: remark
            };
            const response = await enquiryAPI.updateApplicationStatus(applicationId, statusData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    blacklist: async (applicationId) => {
        try {
            const response = await enquiryAPI.blacklistApplication(applicationId);
            return response;
        } catch (error) {
            throw error;
        }
    },

    activateAccount: async (applicationId) => {
        try {
            const response = await enquiryAPI.activateAccount(applicationId);
            return response;
        } catch (error) {
            throw error;
        }
    }
};