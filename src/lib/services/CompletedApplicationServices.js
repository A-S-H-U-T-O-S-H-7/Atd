"use client";
import api from "@/utils/axiosInstance";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';
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

  // Update application status - FIXED ENDPOINT
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await api.put(`/crm/application/status/${applicationId}`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Blacklist application - FIXED ENDPOINT
  blacklistApplication: async (applicationId) => {
    try {
      const response = await api.put(`/crm/application/black-list/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Activate account - FIXED ENDPOINT
  activateAccount: async (applicationId) => {
    try {
      const response = await api.put(`/crm/application/activate/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format application data for UI
export const formatCompletedApplicationForUI = (application) => {
  const enquiryDate = application.created_at ? new Date(application.created_at) : new Date();
  const completedDate = application.updated_at ? new Date(application.updated_at) : new Date();
  
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
    enquiryDate: enquiryDate.toLocaleDateString('en-GB'),
    enquiryTime: enquiryDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    completedDate: completedDate.toLocaleDateString('en-GB'),
    completedTime: completedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    createdAt: application.created_at,
    updatedAt: application.updated_at,
    name: `${application.fname || ''} ${application.lname || ''}`.trim() || 'N/A',
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
    approvalNote: application.approval_note,
    status: getStatusName(application.loan_status),
    loanStatus: getStatusName(application.loan_status),
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

  activateAccount: async (applicationId) => {
    try {
      const response = await completedApplicationAPI.activateAccount(applicationId);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// File view utility
export const fileService = {
  viewFile: async (fileName, documentCategory) => {
    if (!fileName) {
      throw new Error('No file available');
    }

    const folderMappings = {
      'bank_statement': 'bank-statement',
      'aadhar_proof': 'idproof', 
      'address_proof': 'address',
      'pan_proof': 'pan',
      'selfie': 'photo',
      'salary_slip': 'first_salaryslip',
      'second_salary_slip': 'second_salaryslip', 
      'third_salary_slip': 'third_salaryslip',
      'bank_verif_report': 'reports',
      'social_score_report': 'reports',
      'cibil_score_report': 'reports',
    };

    const folder = folderMappings[documentCategory];
    
    if (!folder) {
      throw new Error('Document type not configured');
    }
    
    const filePath = `${folder}/${fileName}`;
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);
    
    return url;
  }
};