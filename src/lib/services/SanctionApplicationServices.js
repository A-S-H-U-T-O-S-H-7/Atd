"use client";
import api from "@/utils/axiosInstance";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';
import { getStatusName, getStatusId } from "@/utils/applicationStatus";

export const sanctionApplicationAPI = {
  // Get all sanction applications with filters
  getSanctionApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/sanction", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export sanction applications
  exportSanctionApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/export/sanction", { params });
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

  // Update cheque number
  updateChequeNumber: async (applicationId, chequeData) => {
    try {
      const response = await api.put(`/crm/application/cheque/${applicationId}`, chequeData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update courier status
  updateCourierStatus: async (applicationId, courierData) => {
    try {
      const response = await api.put(`/crm/application/courier/${applicationId}`, courierData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update original documents status
  updateOriginalDocuments: async (applicationId, documentsData) => {
    try {
      const response = await api.put(`/crm/application/documents/${applicationId}`, documentsData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update e-mandate status
  updateEmandateStatus: async (applicationId, emandateData) => {
    try {
      const response = await api.put(`/crm/application/emandate/${applicationId}`, emandateData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format application data for UI
export const formatSanctionApplicationForUI = (application) => {
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
    approvedDate: enquiryDate.toLocaleDateString('en-GB'),

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
    appliedAmount: application.applied_amount,
    approvedAmount: application.approved_amount,
    adminFee: "0.00", // You might need to calculate this
    roi: application.roi,
    tenure: application.tenure,
    loanTerm: application.loan_term === 4 ? "One Time Payment" : "Daily",
    disbursalAccount: application.disbursal_account,
    customerAcVerified: application.customer_ac_verify === 1 ? "Yes" : "No",

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
    hasVideoKyc: !!application.video,
    hasNachForm: !!application.nach_form,
    hasPdc: !!application.pdc,
    hasAgreement: !!application.aggrement,
    sanctionLetter: !!application.sanction_letter, // You might need to add this field

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
    videoKycFileName: application.video,
    nachFormFileName: application.nach_form,
    pdcFileName: application.pdc,
    agreementFileName: application.aggrement,
    sanctionLetterFileName: application.sanction_letter,

    // Status and process information
    approvalNote: application.approval_note,
    loanStatus: getStatusName(application.loan_status),
    emandateStatus: application.emandatestatus || "Pending",
    iciciEmandateStatus: application.emandatestatus || "Pending",
    chequeNo: application.cheque_no,
    sendToCourier: application.send_courier === 1 ? "Yes" : "No",
    courierPicked: application.courier_picked === 1 ? "Yes" : "No",
    originalDocuments: application.original_documents === 1 ? "Yes" : "No",
    receivedDisburse: application.emandateverification || "No",
    readyForApprove: application.ready_verification === 1 ? "ready_to_verify" : "pending",

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

// Status update utility
export const sanctionService = {
  updateStatus: async (applicationId, updateData) => {
    try {
      const statusData = {
        status: getStatusId(updateData.status), // USE IMPORTED FUNCTION
        remark: updateData.remark,
        send_courier: updateData.sendToCourier ? 1 : 0,
        courier_picked: updateData.courierPicked ? 1 : 0,
        original_documents: updateData.originalDocuments ? 1 : 0,
        emandateverification: updateData.emandateVerification
      };
      const response = await sanctionApplicationAPI.updateApplicationStatus(applicationId, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateChequeNumber: async (applicationId, chequeNo) => {
    try {
      const response = await sanctionApplicationAPI.updateChequeNumber(applicationId, { cheque_no: chequeNo });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateCourierStatus: async (applicationId, courierData) => {
    try {
      const response = await sanctionApplicationAPI.updateCourierStatus(applicationId, courierData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateOriginalDocuments: async (applicationId, documentsData) => {
    try {
      const response = await sanctionApplicationAPI.updateOriginalDocuments(applicationId, documentsData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateEmandateStatus: async (applicationId, emandateData) => {
    try {
      const response = await sanctionApplicationAPI.updateEmandateStatus(applicationId, emandateData);
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
      'pdc_file': 'agreement',
      'agreement_file': 'agreement',
      'video': 'videokyc',
      'nach_form': 'agreement',
      'pdc': 'agreement',
      'aggrement': 'agreement',
      'sanction_letter': 'sanctionletter'
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