"use client";
import api from "@/utils/axiosInstance";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

export const rejectedApplicationAPI = {
  // Get all rejected applications with filters
  getRejectedApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/rejected", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export rejected applications
  exportRejectedApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/export/rejected", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Restore application (move from rejected to pending/in-progress)
  restoreApplication: async (applicationId) => {
    try {
      const response = await api.put(`/crm/application/restore/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format application data for UI
export const formatRejectedApplicationForUI = (application) => {
  // Format dates
  const enquiryDate = application.created_at ? new Date(application.created_at) : new Date();
  
  // Create permanent address from available fields
  const permanentAddress = application.address || 
    `${application.house_no || ''}, ${application.city || ''}, ${application.state || ''} - ${application.pincode || ''}`.trim();

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

    // Contact information
    phoneNo: application.phone,
    email: application.email || 'N/A',

    // Loan information
    appliedLoan: application.applied_amount,
    approvedAmount: application.approved_amount,
    roi: application.roi,
    tenure: application.tenure,
    loanTerm: application.loan_term === 4 ? "One Time Payment" : "Daily",

    // Rejection information
    remark: application.remark,
    approvalNote: application.approval_note,
    verifierName: application.verifier_name,
    verifierPhoto: application.verifier_photo,

    // Status information
    status: getLoanStatusText(application.loan_status),
    loanStatus: getLoanStatusText(application.loan_status),

    // Application stage information
    isVerified: application.verify === 1,
    isReportChecked: application.report_check === 1,
    isFinalStage: application.verify === 1 && application.report_check === 1,
    verifyStatus: application.verify,
    reportCheckStatus: application.report_check,

    // Final report information
    hasAppraisalReport: !!application.totl_final_report,
    finalReportStatus: application.totl_final_report,
    isRecommended: application.totl_final_report === "Recommended",

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

    // Mail information
    mailCounter: application.mail_counter,
    mailerDate: application.mailer_date,

    // Button visibility flags
    showActionButton: true,
    showAppraisalButton: true,
    showEligibilityButton: true,
    showRestoreButton: true
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
    default: return "Rejected";
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
    default: return 3; // Default to Rejected for rejected applications
  }
};

// Application actions utility
export const rejectedApplicationService = {
  restoreApplication: async (applicationId) => {
    try {
      const response = await rejectedApplicationAPI.restoreApplication(applicationId);
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