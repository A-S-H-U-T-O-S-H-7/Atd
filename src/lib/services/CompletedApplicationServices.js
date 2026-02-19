"use client";
import api from "@/utils/axiosInstance";
import fileService from "./fileService";
import { getStatusName, getStatusId } from "@/utils/applicationStatus";

export const completedApplicationAPI = {
  // Get all completed applications with filters
  getCompletedApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/completed", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export completed applications
  exportCompletedApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/export/completed", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update application status 
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await api.put(`/crm/application/status/${applicationId}`, statusData);
      
      if (response.success === false) {
        const error = new Error(response.message || 'Status update failed');
        throw error;
      }
      
      return response;
      
    } catch (error) {
      if (error.message && error.message !== 'No response data received') {
        throw error;
      }
      
      if (error.response) {
        const errorData = error.response.data || error.response;
        throw new Error(errorData.message || 'Status update failed');
      }
      
      throw new Error(error.message || 'Status update failed');
    }
  },

  // Blacklist application
  blacklistApplication: async (userId) => {
    try {
      const response = await api.put(`/crm/application/black-list/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
 
  // Activate account 
  sendActivationEmail: async (applicationId) => {
    try {
      const response = await api.get(`/crm/office/email/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format application data for UI 
export const formatCompletedApplicationForUI = (application) => {
  const enquiryDate = application.enquiry_date ? new Date(application.enquiry_date) : null;

  // Helper function to format time from backend
  const formatTimeString = (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      const timeParts = timeString.split(' ');
      if (timeParts.length >= 2) {
        const time = timeParts[0]; 
        const period = timeParts[1]; 
        
        const [hours, minutes, seconds] = time.split(':');
        
        return `${parseInt(hours, 10)}:${minutes} ${period}`;
      }
      
      // If not in expected format, return as is
      return timeString;
    } catch (error) {
      console.error('Time formatting error:', error);
      return timeString || 'N/A';
    }
  };

  // Helper function to format date
  const formatDateString = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // If date has time component, extract just date
      const dateOnly = dateString.split(' ')[0];
      const date = new Date(dateOnly);
      
      // Format as DD/MM/YYYY
      return date.toLocaleDateString('en-GB');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString || 'N/A';
    }
  };

  const permanentAddress = application.address || 
    `${application.house_no || ''}, ${application.city || ''}, ${application.state || ''} - ${application.pincode || ''}`.trim();
  
  const currentAddress = application.current_address || 
    `${application.current_house_no || ''}, ${application.current_city || ''}, ${application.current_state || ''} - ${application.current_pincode || ''}`.trim();

  return {
    id: application.application_id,
    userId: application.user_id,
    srNo: application.application_id,
    enquirySource: application.enquiry_type || 'N/A',
    crnNo: application.crnno,
    accountId: application.accountId,

    enquiryDate: formatDateString(application.enquiry_date),
    enquiryTime: formatTimeString(application.enquiry_time || application.enquiry_date?.split(' ')[1]),
    enquiryDateTime: application.enquiry_date,
    
    // Fixed: Use complete_date and complete_time fields
    completeDate: formatDateString(application.complete_date),
    completeTime: formatTimeString(application.complete_time),
    completeDateTime: `${application.complete_date} ${application.complete_time}`,

    name: application.name|| '' ,
    firstName: application.fname || '',
    lastName: application.lname || '',
    dob: application.dob,
    gender: application.gender,
    permanentAddress: permanentAddress,
    state: application.state,
    city: application.city,
    pincode: application.pincode,
    houseNo: application.house_no,
    currentAddress: currentAddress,
    currentState: application.current_state,
    currentCity: application.current_city,
    currentPincode: application.current_pincode,
    currentHouseNo: application.current_house_no,
    phoneNo: application.phone,
    email: application.email || 'N/A',
    appliedLoan: application.applied_amount,
    approvedAmount: application.approved_amount,
    roi: application.roi,
    tenure: application.tenure,
    loanTerm: application.loan_term === 4 ? "One Time Payment" : "Daily",
    accountActivation: application.accountActivation === 1,
    activateDate: application.activateDate,
    isBlacklisted: application.blacklist === 1,
    blacklistDate: application.blacklistdate,

    // Document availability flags
    hasPhoto: !!application.selfie,
    hasPanCard: !!application.pan_proof,
    hasAddressProof: !!application.address_proof,
    hasIdProof: !!application.aadhar_proof,
    hasSalaryProof: !!application.salary_slip,
    hasSecondSalaryProof: !!application.second_salary_slip,
    hasThirdSalaryProof: !!application.third_salary_slip,
    hasBankStatement: !!application.bank_statement,
    hasBankVerificationReport: !!application.bank_verif_report,
    hasSocialScoreReport: !!application.social_score_report,
    hasCibilScoreReport: !!application.cibil_score_report,
    hasSecondBankStatement: !!application.second_bank_statement,
    hasBankFraudReport: !!application.bank_fraud_report,
    hasCamSheet: !!application.cam_sheet,  
    hasNachForm: !!application.nach_form,  
    hasPdc: !!application.pdc,             
    hasAgreement: !!application.aggrement, 
    hasVideo: !!application.video,         

    // Document file names 
    photoFileName: application.selfie,
    panCardFileName: application.pan_proof,
    addressProofFileName: application.address_proof,
    idProofFileName: application.aadhar_proof,
    salarySlip1: application.salary_slip,
    salarySlip2: application.second_salary_slip,
    salarySlip3: application.third_salary_slip,
    bankStatementFileName: application.bank_statement,
    bankVerificationFileName: application.bank_verif_report,
    socialScoreFileName: application.social_score_report,
    cibilScoreFileName: application.cibil_score_report,
    secondBankStatementFileName: application.second_bank_statement,
    bankFraudReportFileName: application.bank_fraud_report,
    camSheetFileName: application.cam_sheet,       
    nachFormFileName: application.nach_form,       
    pdcFileName: application.pdc,                  
    agreementFileName: application.aggrement,      
    videoFileName: application.video,              

    approvalNote: application.approval_note,
    status: getStatusName(application.loan_status),
    loanStatus: getStatusName(application.loan_status),
    verify: application.verify,
    isVerified: application.verify === 1,
    isReportChecked: application.report_check === 1,
    isFinalStage: application.verify === 1 && application.report_check === 1,
    verifyStatus: application.verify,
    reportCheckStatus: application.report_check,
    hasAppraisalReport: !!application.totl_final_report,
    finalReportStatus: application.totl_final_report,
    isRecommended: application.totl_final_report === "Recommended",
    mailCounter: application.mail_counter,
    mailerDate: application.mailer_date,
    showActionButton: true,
    showAppraisalButton: true,
    showEligibilityButton: true
  };
};

// Status update utility
export const statusService = {
  updateStatus: async (applicationId, statusName, remark = "") => {
    try {
      const statusData = {
        status: getStatusId(statusName),
        remark: remark
      };
      
      const response = await completedApplicationAPI.updateApplicationStatus(applicationId, statusData);
      
      return response;
       
    } catch (error) {
      throw error;
    }
  },

  blacklist: async (applicationId) => {
    try {
      const response = await completedApplicationAPI.blacklistApplication(applicationId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  sendActivationEmail: async (applicationId) => {
    try {
      const response = await completedApplicationAPI.sendActivationEmail(applicationId);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export { fileService };