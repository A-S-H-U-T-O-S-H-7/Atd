"use client";
import api from "@/utils/axiosInstance";

export const legalService = {
  // Get all legal cases with pagination and search
  getLegalCases: async (params = {}) => {
    try {
      const response = await api.get("/crm/legal/manage", { 
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || ""
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export legal cases
  exportLegalCases: async (params = {}) => {
    try {
      const response = await api.get("/crm/legal/export", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create legal notice
  createLegalNotice: async (legalId, noticeData) => {
    try {
      const response = await api.post(`/crm/legal/${legalId}/notice`, noticeData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create criminal case
  createCriminalCase: async (legalId, caseData) => {
    try {
      const response = await api.post(`/crm/legal/${legalId}/criminal-case`, caseData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update legal case
  updateLegalCase: async (legalId, updateData) => {
    try {
      const response = await api.put(`/crm/legal/${legalId}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format legal case data for UI
export const formatLegalCaseForUI = (legalCase) => {
  return {
    id: legalCase.id,
    sNo: legalCase.id,
    customerName: legalCase.name || 'N/A',
    fatherHusbandName: legalCase.f_name || 'N/A',
    mobileNo: legalCase.phone || 'N/A',
    loanId: legalCase.loan_no || 'N/A',
    crnNo: legalCase.crn_no || 'N/A',
    address: legalCase.address_1 || legalCase.delivery_address || 'N/A',
    currentAddress: legalCase.address_1 || legalCase.delivery_address || 'N/A',
    otherAddress: legalCase.other_address || '',
    otherAddress2: legalCase.address_2 || '',
    principal: parseFloat(legalCase.deposit_amount) || 0,
    interest: parseFloat(legalCase.interest) || 0,
    penalty: parseFloat(legalCase.penalty) || 0,
    bounceCharges: parseFloat(legalCase.bounce_charge) || 0,
    penalInterest: parseFloat(legalCase.penal_interest) || 0,
    totalAmount: (parseFloat(legalCase.deposit_amount) || 0) + 
                 (parseFloat(legalCase.interest) || 0) + 
                 (parseFloat(legalCase.penal_interest) || 0) + 
                 (parseFloat(legalCase.bounce_charge) || 0),
    sanctionedLoanAmount: parseFloat(legalCase.deposit_amount) || 0,
    tenure: legalCase.tenure || 0,
    sanctionDate: legalCase.sanction_date || 'N/A',
    disbursementAmount: parseFloat(legalCase.disbursement_amount) || 0,
    disbursementDate: legalCase.disbursement_date || 'N/A',
    processingFee: parseFloat(legalCase.processing_fee) || 0,
    gst: parseFloat(legalCase.gst) || 0,
    emi: parseFloat(legalCase.emi) || 0,
    daysEmi: legalCase.days_emi || 0,
    totalPfGst: (parseFloat(legalCase.processing_fee) || 0) + (parseFloat(legalCase.gst) || 0),
    bankName: legalCase.customer_bank_name || 'N/A',
    ifsc: legalCase.customer_bank_ifsc || 'N/A',
    accountNo: legalCase.customer_bank_ac || 'N/A',
    bankAddress: legalCase.customer_bank_branch || 'N/A',
    chequeNo: legalCase.cheque_no || 'N/A',
    chequeDate: legalCase.cheque_date || 'N/A',
    chequeAmount: parseFloat(legalCase.deposit_amount) || 0,
    chequeBounceDate: legalCase.bounce_date || 'N/A',
    intimationMailFromBank: legalCase.intimation_mail || 'N/A',
    intimationMailFormDispatch: legalCase.intimation_mail_despatch || 'N/A',
    intimationMailBankFormDeliver: legalCase.intimation_mail_deliver || 'N/A',
    chequeReturnMemo: legalCase.cheque_return_memo || 'N/A',
    chequeReturnMemoReceived: legalCase.memo_received_date || 'N/A',
    reasonOfBounce: legalCase.reason_bounce || 'N/A',
    closeDate: legalCase.close_date || 'N/A',
    certifiedCopyStatement: legalCase.statement_date_despatch || 'N/A',
    legalNotice: legalCase.notice_date || 'N/A',
    speedPost: legalCase.legal_notice_speed_post_date || 'N/A',
    speedPostReceived: legalCase.speedpost_received_date_customer || 'N/A',
    policeStation: legalCase.police_station || 'N/A',
    boardResolution: legalCase.board_resolution_date || 'N/A',
    loanAgreement: legalCase.loan_agreement_date || 'N/A',
    loanApplication: legalCase.loan_application_date || 'N/A',
    noticeUs138: legalCase.noticedate || 'N/A',
    replyReceived: legalCase.reply_received_date || 'N/A',
    caseFilled: legalCase.case_filled_date || 'N/A',
    deliveryStatus: legalCase.delivery_status || 'NOT DELIVERED',
    applicationId: legalCase.application_id,
    providerId: legalCase.provider_id,
    adminId: legalCase.admin_id,
    adminName: legalCase.admin_name,
    createdAt: legalCase.created_at,
    updatedAt: legalCase.updated_at,
    chequePresent: legalCase.cheque_present === 1,
    criminalComplaintNo: legalCase.criminal_complaint_no,
    remarkWithCaseDetails: legalCase.remark_with_case_details
  };
};

// Status utilities
export const legalStatusService = {
  updateDeliveryStatus: async (legalId, status) => {
    try {
      const response = await legalService.updateLegalCase(legalId, {
        delivery_status: status
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateChequeStatus: async (legalId, chequeData) => {
    try {
      const response = await legalService.updateLegalCase(legalId, chequeData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};