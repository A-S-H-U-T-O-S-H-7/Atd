"use client";
import api from "@/utils/axiosInstance";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

export const followUpApplicationAPI = {
  // Get all follow-up applications with filters
  getFollowUpApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/followup", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export follow-up applications
  exportFollowUpApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/export/followup", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await api.put(`/crm/application/status/${applicationId}`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Blacklist application
  blacklistApplication: async (applicationId) => {
    try {
      const response = await api.put(`/crm/application/black-list/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Activate account
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
export const formatFollowUpApplicationForUI = (application) => {
  // Format dates
  const enquiryDate = application.created_at ? new Date(application.created_at) : new Date();
  
  // Create addresses
  const permanentAddress = application.address || 
    `${application.house_no || ''}, ${application.city || ''}, ${application.state || ''} - ${application.pincode || ''}`.trim();
  
  const currentAddress = application.current_address || 
    `${application.current_house_no || ''}, ${application.current_city || ''}, ${application.current_state || ''} - ${application.current_pincode || ''}`.trim();

  return {
    // Basic identifiers
    id: application.application_id,
    srNo: application.application_id,
    enquirySource: application.enquiry_type || 'N/A',
    crnNo: application.crnno,
    accountId: application.accountId,

    // Date and time information
    enquiryDate: enquiryDate.toLocaleDateString('en-GB'),
    createdAt: application.created_at,
    updatedAt: application.updated_at,

    // Personal information
    name: `${application.fname || ''} ${application.lname || ''}`.trim() || 'N/A',
    firstName: application.fname || '',
    lastName: application.lname || '',
    dob: application.dob,
    gender: application.gender,

    // Address information
    permanentAddress: permanentAddress,
    state: application.state,
    city: application.city,
    pincode: application.pincode,
    houseNo: application.house_no,
    
    // Current address information
    currentAddress: currentAddress,
    currentState: application.current_state,
    currentCity: application.current_city,
    currentPincode: application.current_pincode,
    currentHouseNo: application.current_house_no,

    // Contact information
    phoneNo: application.phone,
    email: application.email || 'N/A',

    // Loan information
    appliedLoan: application.applied_amount,
    approvedAmount: application.approved_amount,
    roi: application.roi,
    tenure: application.tenure,
    loanTerm: application.loan_term === 4 ? "One Time Payment" : "Daily",

    // Account status
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

    // Status and approval information
    approvalNote: application.approval_note,
    status: getLoanStatusText(application.loan_status),
    loanStatus: getLoanStatusText(application.loan_status),

    // Application stage information - CRITICAL FOR BUTTONS
    isVerified: application.verify === 1,
    isReportChecked: application.report_check === 1,
    isFinalStage: application.verify === 1 && application.report_check === 1,
    verifyStatus: application.verify,
    reportCheckStatus: application.report_check,

    // Final report information - CRITICAL FOR BUTTONS
    hasAppraisalReport: !!application.totl_final_report,
    finalReportStatus: application.totl_final_report,
    isRecommended: application.totl_final_report === "Recommended",
    totl_final_report: application.totl_final_report, // Some components use this directly

    // Mail information
    mailCounter: application.mail_counter,
    mailerDate: application.mailer_date,

    // Button visibility flags - CRITICAL FOR BUTTONS
    showActionButton: true,
    showAppraisalButton: true,
    showEligibilityButton: true,
    activation: application.accountActivation === 1 ? "Activated" : "Not Activated"
  };
};

// Get loan status text
const getLoanStatusText = (status) => {
  switch (Number(status)) {
    case 0: return "Pending";
    case 1: return "In Progress";
    case 2: return "Approved";
    case 3: return "Rejected";
    case 4: return "Disbursed";
    default: return "Follow Up";
  }
};

// Get status number from text
export const getStatusNumber = (status) => {
  switch (String(status).toLowerCase()) {
    case "pending": return 0;
    case "in progress": return 1;
    case "approved": return 2;
    case "rejected": return 3;
    case "disbursed": return 4;
    default: return 4; // Default to Disbursed for follow-up applications
  }
};

// Status update utility
export const followUpService = {
  updateStatus: async (applicationId, status, remark = "") => {
    try {
      const statusData = {
        status: getStatusNumber(status),
        remark: remark
      };
      const response = await followUpApplicationAPI.updateApplicationStatus(applicationId, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  blacklist: async (applicationId) => {
    try {
      const response = await followUpApplicationAPI.blacklistApplication(applicationId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  activateAccount: async (applicationId) => {
    try {
      const response = await followUpApplicationAPI.activateAccount(applicationId);
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