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

// Status mapping constants
export const APPLICATION_STATUS = {
  PENDING: { id: 1, name: "Pending" },
  COMPLETED: { id: 2, name: "Completed" },
  REJECTED: { id: 3, name: "Rejected" },
  FOLLOW_UP: { id: 4, name: "Follow Up" },
  PROCESSING: { id: 5, name: "Processing" },
  SANCTION: { id: 6, name: "Sanction" },
  READY_TO_VERIFY: { id: 7, name: "Ready To Verify" },
  READY_TO_DISBURSED: { id: 8, name: "Ready To Disbursed" },
  DISBURSED: { id: 9, name: "Disbursed" },
  TRANSACTION: { id: 10, name: "Transaction" },
  COLLECTION: { id: 11, name: "Collection" },
  RE_COLLECTION: { id: 12, name: "Re-Collection" },
  CLOSED: { id: 13, name: "Closed" },
  DEFAULTER: { id: 14, name: "Defaulter" },
  CANCELLED: { id: 15, name: "Cancelled" },
  CLOSED_BY_ADMIN: { id: 16, name: "Closed By Admin" },
  RETURN: { id: 17, name: "Return" },
  RENEWAL: { id: 18, name: "Renewal" },
  EMI: { id: 19, name: "EMI" }
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
    totl_final_report: application.totl_final_report,

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

// Get loan status text - USE APPLICATION_STATUS
const getLoanStatusText = (status) => {
  const statusObj = Object.values(APPLICATION_STATUS).find(s => s.id === Number(status));
  return statusObj ? statusObj.name : "Unknown";
};

// Get status number from text - USE APPLICATION_STATUS (FIXED)
export const getStatusNumber = (status) => {
  const statusObj = Object.values(APPLICATION_STATUS).find(s => 
    s.name.toLowerCase() === String(status).toLowerCase()
  );
  return statusObj ? statusObj.id : 4; // Default to Follow Up (4)
};

// Status update utility
export const followUpService = {
  updateStatus: async (applicationId, status, remark = "") => {
    try {
      const statusData = {
        status: getStatusNumber(status), // This uses APPLICATION_STATUS mapping
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