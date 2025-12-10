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

  const customer = legalCase.customer_details || {};
  const address = legalCase.customer_address || {};
  const financial = legalCase.financial_details || {};
  const bank = legalCase.bank_details || {};
  const cheque = legalCase.cheque_details || {};
  const dates = legalCase.important_dates || {};
  const legalStatus = legalCase.legal_status || {};
  const customerBank = bank.customer_bank || {};
  const companyBank = bank.company_bank || {};

  // Calculate derived values
  const principal = parseFloat(financial.approved_amount) || 0;
  const processingFee = parseFloat(financial.process_fee) || 0;
  const gst = parseFloat(financial.gst) || 0;
  const interest = parseFloat(cheque.interest) || 0;
  const penalInterest = parseFloat(cheque.penal_interest) || 0;
  const penalty = parseFloat(cheque.penality) || 0;
  const chequeAmount = parseFloat(cheque.deposit_amount) || 0;
  
  // Calculate total PF + GST
  const totalPfGst = processingFee + gst;
  
  // Calculate total amount (Principal + Interest + Penal Interest + Penalty)
  const totalAmount = principal + interest + penalInterest + penalty;

  return {
    id: legalCase.cheque_deposit_id,
    sNo: legalCase.cheque_deposit_id,
    applicationId: legalCase.application_id,
    
    // Customer Details
    customerName: customer.customer_name || 'N/A',
    fatherHusbandName: customer.customer_fathername || 'N/A',
    mobileNo: customer.customer_phone || 'N/A',
    email: customer.customer_email || 'N/A',
    gender: customer.customer_gender || 'N/A',
    loanId: customer.loan_no || 'N/A',
    crnNo: customer.crnno || 'N/A',
    
    // Address Details
    permanentAddress: address.permanent_address || 'N/A',
    currentAddress: address.current_address || 'N/A',
    companyAddress: address.company_address || 'N/A',
    
    // Financial Details
    principal: principal,
    roi: parseFloat(financial.roi) || 0,
    tenure: financial.tenure || 0,
    interest: interest,
    penalInterest: penalInterest,
    penalty: penalty,
    processingFee: processingFee,
    gst: gst,
    totalPfGst: totalPfGst,
    disbursementAmount: parseFloat(financial.disburse_amount) || 0,
    
    // Bank Details
    bankName: customerBank.customer_bank || 'N/A',
    bankBranch: customerBank.customer_bank_branch || 'N/A',
    accountType: customerBank.customer_ac_type || 'N/A',
    accountNo: customerBank.customer_ac_no || 'N/A',
    ifsc: customerBank.customer_bank_ifsc || 'N/A',
    
    // ATD Bank Details
    companyName: companyBank.company_name || 'N/A',
    companyBankName: companyBank.company_bank || 'N/A',
    companyBankBranch: companyBank.company_bank_branch || 'N/A',
    companyAccountNo: companyBank.company_ac_no || 'N/A',
    companyIfsc: companyBank.company_bank_ifsc || 'N/A',
    
    // Cheque Details
    chequeNo: cheque.cheque_no || 'N/A',
    chequeDate: cheque.cheque_date || 'N/A',
    chequeAmount: chequeAmount,
    depositDate: cheque.deposit_date || 'N/A',
    
    // Important Dates
    approvedDate: dates.approved_date || 'N/A',
    transactionDate: dates.transaction_date || 'N/A',
    dueDate: dates.duedate || 'N/A',
    lastCollectionDate: dates.last_collection_date || 'N/A',
    bounceDate: dates.bounce_date || 'N/A',
    memoReceivedDate: dates.memo_received_date || 'N/A',
    
    // Legal Documents Dates (mostly null)
    statementDisburDate: dates.statement_date_disbur || 'N/A',
    statementDespatchDate: dates.statement_date_despatch || 'N/A',
    noticeDate: dates.notice_date || 'N/A',
    legalNoticeSpeedPostDate: dates.legal_notice_speed_post_date || 'N/A',
    speedpostReceivedDate: dates.speedpost_received_date_customer || 'N/A',
    boardResolutionDate: dates.board_resolution_date || 'N/A',
    loanAgreementDate: dates.loan_agreement_date || 'N/A',
    loanApplicationDate: dates.loan_application_date || 'N/A',
    replyReceivedDate: dates.reply_received_date || 'N/A',
    caseFilledDate: dates.case_filled_date || 'N/A',
    
    // Legal Status
    deliveryStatus: legalStatus.delivery_status || 'N/A',
    criminalComplaintNo: legalStatus.criminal_complaint_no || 'N/A',
    policeStation: legalStatus.police_station || 'N/A',
    bounceReason: legalStatus.reason_bounce || cheque.reason_bounce || 'N/A',
    remarkWithCaseDetails: legalStatus.remark_with_case_details || 'N/A',
    
    // Calculated totals
    totalAmount: totalAmount,
    
    // Other
    updatedBy: legalCase.updated_by || 'N/A',
    chequePresent: chequeAmount > 0
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