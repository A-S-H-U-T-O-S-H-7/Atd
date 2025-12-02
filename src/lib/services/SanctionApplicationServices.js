"use client";
import api from "@/utils/axiosInstance";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';
import { getStatusName, getStatusId } from "@/utils/applicationStatus";

export const sanctionApplicationAPI = {
  getSanctionApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/sanction", { params });
      return response;
    } catch (error) { 
      throw error;
    }
  },

  exportSanctionApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/export/sanction", { params });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const formatSanctionApplicationForUI = (application) => {
  const enquiryDate = application.created_at ? new Date(application.created_at) : new Date();
  const approvedDate = application.approved_date ? new Date(application.approved_date) : null;
  
  const permanentAddress = application.address || 
    `${application.house_no || ''}, ${application.city || ''}, ${application.state || ''} - ${application.pincode || ''}`.trim();
  
  const currentAddress = application.current_address ||  
    `${application.current_house_no || ''}, ${application.current_city || ''}, ${application.current_state || ''} - ${application.current_pincode || ''}`.trim();

  return {
    id: application.application_id,
    srNo: application.application_id,
    enquirySource: application.enquiry_type || 'N/A',
    crnNo: application.crnno,
    accountId: application.accountId,
    loanNo: application.loan_no || `LN${application.application_id}`,
    user_Id: application.user_id,

    enquiryDate: enquiryDate.toLocaleDateString('en-GB'),
    enquiryTime: enquiryDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    
    approvedDate: approvedDate ? approvedDate.toLocaleDateString('en-GB') : 'N/A',
    approvedDateTime: application.approved_date,

    name: `${application.fname || ''} ${application.lname || ''}`.trim() || 'N/A',
    
    permanentAddress: permanentAddress,
    state: application.state,
    city: application.city,
    
    currentAddress: currentAddress,
    currentState: application.current_state,
    currentCity: application.current_city,

    phoneNo: application.phone,
    email: application.email || 'N/A',

    appliedAmount: application.applied_amount,
    approvedAmount: application.approved_amount,
    adminFee: (parseFloat(application.process_fee || 0) + parseFloat(application.gst || 0)).toFixed(2),
    roi: application.roi,
    tenure: application.tenure,
    loanTerm: application.loan_term === 4 ? "One Time Payment" : "Daily",
    disbursalAccount: application.disbursal_account,
    customerAcVerified: application.customer_ac_verify === 1 ? "Yes" : "No",

    // Document flags - CORRECTED based on your API response
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

    // Status information 
    approvalNote: application.approval_note,
    loanStatus: getStatusName(application.loan_status),
    emandateStatus: application.emandateverification || "Pending",
    iciciEmandateStatus: application.emandatestatus || "Pending",
    chequeNo: application.cheque_no, 
    sendToCourier: application.send_courier === 1 ? "Yes" : "No",
    courierPicked: application.courier_picked === 1 ? "Yes" : "No",
    originalDocuments: application.original_documents === "Yes" ? "Yes" : "No", 
    receivedDisburse: application.emandateverification === 1 || application.emandateverification === "1" ? "Yes" : "No",
    emandateVerificationRaw: application.emandateverification,

    // Raw values for validation logic
    sendToCourierRaw: application.send_courier,
    courierPickedRaw: application.courier_picked,
    originalDocumentsRaw: application.original_documents,
    emandateVerificationRaw: application.emandateverification,
    readyForApprove: application.ready_verification === 1 ? "ready_to_verify" : "pending",
    verify: application.verify,
    isVerified: application.verify === 1,
    isReportChecked: application.report_check === 1,
    isFinalStage: application.verify === 1 && application.report_check === 1,

    hasAppraisalReport: !!application.totl_final_report,
    finalReportStatus: application.totl_final_report,
    finalReportFile: application.totl_final_report_file,
    isRecommended: application.totl_final_report === "Recommended",

    showActionButton: true,
    showAppraisalButton: true,
    showEligibilityButton: true
  };
};

export const sanctionService = {
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
  }
};

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