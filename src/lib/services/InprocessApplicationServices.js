"use client";
import api from "@/utils/axiosInstance";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

export const inProgressApplicationAPI = {
  // Get all in-progress applications with filters
  getInProgressApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/inprocess", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export in-progress applications
  exportInProgressApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/export/inprocess", { params });
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
  }
};

// Format application data for UI
export const formatInProgressApplicationForUI = (application) => {
  // Format dates
  const enquiryDate = application.created_at ? new Date(application.created_at) : new Date();
  const updatedDate = application.updated_at ? new Date(application.updated_at) : new Date();
  
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
    loanNo: application.loan_no || `LN${application.application_id}`,

    // Date and time information
    enquiryDate: enquiryDate.toLocaleDateString('en-GB'),
    enquiryTime: enquiryDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    updatedDate: updatedDate.toLocaleDateString('en-GB'),
    updatedTime: updatedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),

    // Personal information
    name: `${application.fname || ''} ${application.lname || ''}`.trim() || 'N/A',
    
    // Address information
    permanentAddress: permanentAddress,
    state: application.state,
    city: application.city,
    
    // Current address information
    currentAddress: currentAddress,
    currentState: application.current_state,
    currentCity: application.current_city,

    // Contact information
    phoneNo: application.phone,
    email: application.email || 'N/A',

    // Loan information
    appliedLoan: application.applied_amount,
    approvedAmount: application.approved_amount,
    roi: application.roi,
    tenure: application.tenure,
    loanTerm: application.loan_term === 4 ? "One Time Payment" : "Daily",

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
    hasPdc: !!application.pdc_file,
    hasAgreement: !!application.agreement_file,

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
    pdcFileName: application.pdc_file,
    agreementFileName: application.agreement_file,

    // Status and approval information
    approvalNote: application.approval_note,
    loanStatus: getLoanStatusText(application.loan_status),

    // Application stage information
    isVerified: application.verify === 1,
    isReportChecked: application.report_check === 1,
    isFinalStage: application.verify === 1 && application.report_check === 1,

    // Final report information
    hasAppraisalReport: !!application.totl_final_report,
    finalReportStatus: application.totl_final_report,
    finalReportFile: application.totl_final_report_file,
    isRecommended: application.totl_final_report === "Recommended",

    // Button visibility flags
    showActionButton: true,
    showAppraisalButton: true,
    showEligibilityButton: true
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
    default: return "In Progress";
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
      'pdc_file': 'agreement',
      'agreement_file': 'agreement',
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