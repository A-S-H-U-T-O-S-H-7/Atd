"use client";
import api from "@/utils/axiosInstance";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';
import { getStatusName, getStatusId } from "@/utils/applicationStatus";

export const disburseApprovalAPI = {
  // Get all disburse approval applications with filters
  getDisburseApprovalApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/disburse-approval", { params });
      return response;
    } catch (error) { 
      throw error;
    }
  },

  // Export disburse approval applications
  exportDisburseApprovalApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/export/disburse-approval", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update bank verification status
  updateBankVerification: async (applicationId) => {
    try {
      const response = await api.get(`/crm/application/disburse/bank-verify/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update disburse approval status
  updateDisburseApproval: async (applicationId) => {
    try {
      const response = await api.get(`/crm/application/disburse/disburse-approval/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Disburse application
  disburseApplication: async (applicationId, disburseData) => {
    try {
      const response = await api.put(`/crm/disbursement/disburse/${applicationId}`, disburseData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format application data for UI
export const formatDisburseApprovalApplicationForUI = (application) => {
  const enquiryDate = application.created_at ? new Date(application.created_at) : new Date();
  const updatedDate = application.updated_at ? new Date(application.updated_at) : new Date();
  
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
    userId: application.user_id,


    // Date and time information
    enquiryDate: enquiryDate.toLocaleDateString('en-GB'),
    enquiryTime: enquiryDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    updatedDate: updatedDate.toLocaleDateString('en-GB'),
    updatedTime: updatedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    approvedDate: enquiryDate.toLocaleDateString('en-GB'),
    disburseDate: application.disburse_date || 'N/A',
    dueDate: application.due_date || 'N/A',

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
    adminFee: application.process_fee,
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
    sanctionLetter: !!application.sanction_letter, 

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
    originalDocuments: application.original_documents === "Yes" ? "Yes" : "No",
    receivedDisburse: application.emandateverification === 1 || application.emandateverification === "1" ? "Yes" : "No",
    emandateVerificationRaw: application.emandateverification,
    readyForApprove: application.ready_verification === 1 ? "ready_to_verify" : "pending",
    sanctionMail: application.sanction_mail || "Not Sent",

    // Bank verification and disburse approval
    disburseAmount: application.disburse_amount,
    customerBank: application.customer_ac_bank,
    customerBranch: application.customer_ac_branch, 
    customerAccount: application.customer_ac_no,
    customerIfsc: application.customer_ac_ifsc,
    bankVerification: application.bank_veried === 1 ? "verified" : "not_verified",
    disburseApproval: application.credit_approval === 1 ? "approved" : "not_approved",
    
    // ADD RAW VALUES FOR VALIDATION
    bankVerifiedRaw: application.bank_veried,
    creditApprovalRaw: application.credit_approval,
    
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
    showEligibilityButton: true,

    // Additional fields for disburse
    mailCounter: application.mail_counter || 0,
    mailerDate: application.mailer_date || null,
    renewStatus: application.renewStatus || 0,
    accountActivation: application.accountActivation || 0,
    activateDate: application.activateDate || null,
    blacklist: application.blacklist || 0,
    blacklistdate: application.blacklistdate || null
  };
};

// Combined service with direct API calls
export const disburseApprovalService = {
  // Data fetching
  getApplications: async (params = {}) => {
    try {
      const response = await disburseApprovalAPI.getDisburseApprovalApplications(params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export functionality
  exportApplications: async (params = {}) => {
    try {
      const response = await disburseApprovalAPI.exportDisburseApprovalApplications(params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateStatusChange: async (applicationId, updateData) => {
  try {
    const payload = {};
    
    if (updateData.courierPickedDate) {
      payload.courier_picked = 1;
      payload.picked_date = updateData.courierPickedDate;
    }
    
    if (updateData.originalDocumentsReceived) {
      payload.original_documents = updateData.originalDocumentsReceived === "yes" ? "Yes" : "No";
      // Send received_date if provided, regardless of yes/no selection
      if (updateData.documentsReceivedDate) {
        payload.received_date = updateData.documentsReceivedDate;
      }
    }
    
    const response = await api.put(`/crm/application/sanction/document-status/${applicationId}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
},

  // Bank verification
  updateBankVerification: async (applicationId) => {
    try {
      const response = await disburseApprovalAPI.updateBankVerification(applicationId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Disburse approval
  updateDisburseApproval: async (applicationId) => {
    try {
      const response = await disburseApprovalAPI.updateDisburseApproval(applicationId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit disbursement
submitDisbursement: async (applicationId, formData) => {
  try {
    const payload = {
      loan_status: 9, // Disbursed status
      disburse_amount: parseFloat(formData.disburseAmount),
      disburse_date: formData.disbursementDate,
      // Include all required bank details from the form data
      customer_bank: formData.bankName,
      customer_branch: formData.branchName,
      customer_account: formData.accountNo,
      customer_ifsc: formData.ifscCode
    };
    
    console.log('🔄 Disbursement Payload:', payload);
    
    const response = await api.put(`/crm/disbursement/disburse/${applicationId}`, payload);
    return response;
  } catch (error) {
    console.error('❌ Disbursement API Error:', error);
    throw error;
  }
},

  // Modal functions (same as other pages)
  updateChequeNumber: async (applicationId, chequeNo) => {
    try {
      const response = await api.put(`/crm/application/sanction/update-check/${applicationId}`, { 
        cheque_no: chequeNo 
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateSendToCourier: async (applicationId, courierDate) => {
    try {
      const response = await api.put(`/crm/application/sanction/send-courier/${applicationId}`, {
        courier_date: courierDate
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateCourierPicked: async (applicationId, isPicked, pickedDate = null) => {
    try {
      const response = await api.put(`/crm/application/sanction/courier-picked/${applicationId}`, {
        courier_picked: isPicked ? 1 : 0,
        picked_date: isPicked ? pickedDate : null
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateOriginalDocuments: async (applicationId, isReceived, receivedDate = null) => {
    try {
      const response = await api.put(`/crm/application/sanction/document-status/${applicationId}`, {
        original_documents: isReceived ? "Yes" : "No",
        received_date: isReceived ? receivedDate : null
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateEmandateStatus: async (applicationId, emandateStatus) => {
  try {
    const response = await api.put(`/crm/application/sanction/enach-status/${applicationId}`, {
      emandateverification: emandateStatus === "Yes" ? 1 : 0
    });
    return response;
  } catch (error) {
    throw error;
  }
},

  updateLoanStatus: async (applicationId, status, remark = "") => {
    try {
      const statusData = {
        status: getStatusId(status),
        remark: remark
      };
      const response = await api.put(`/crm/application/status/${applicationId}`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateRemarks: async (applicationId, remarks) => {
    try {
      const response = await api.put(`/crm/application/remarks/${applicationId}`, {
        remarks: remarks
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// File view utility (same as other pages)
export const disburseFileService = {
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