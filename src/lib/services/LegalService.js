// Update LegalService.js with new address APIs
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
  },

  // NEW: Get addresses for a legal case
  getAddresses: async (chequeId) => {
    try {
      const response = await api.get(`/crm/legal/addresses/${chequeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // NEW: Add address to a legal case
  addAddress: async (chequeId, addressData) => {
    try {
      const response = await api.put(`/crm/legal/address/add/${chequeId}`, addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // NEW: Update address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/crm/legal/address/update/${addressId}`, addressData);
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

  // Format date function for consistent date formatting
  const formatDateString = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === null || dateString === 'null') return 'N/A';
    
    try {
      // Handle different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString.split(' ')[0]; 
      
      // Format as dd-mm-yyyy
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString.split(' ')[0] || 'N/A';
    }
  };

  // Calculate derived values
  const principal = parseFloat(financial.approved_amount) || 0;
  const processingFee = parseFloat(financial.process_fee) || 0;
  const gst = parseFloat(financial.gst) || 0;
  const interest = parseFloat(cheque.interest) || 0;
  const penalInterest = parseFloat(cheque.penal_interest) || 0;
  const penalty = parseFloat(cheque.penality) || 0;
  const bounceCharge = parseFloat(cheque.bounce_charge) || 0;
  const chequeAmount = parseFloat(cheque.deposit_amount) || 0;
  
  
  const totalPfGst = processingFee + gst;
  
  // Calculate total amount (Principal + Interest + Penal Interest + Penalty)
  const totalAmount = principal + interest + penalInterest + penalty;


  // Combine addresses for display
  const addresses = [];
  if (address.permanent_address && address.permanent_address !== 'N/A') {
    addresses.push({ type: "Permanent", address: address.permanent_address });
  }
  if (address.current_address && address.current_address !== 'N/A') {
    addresses.push({ type: "Current", address: address.current_address });
  }
  if (address.company_address && address.company_address !== 'N/A') {
    addresses.push({ type: "Company", address: address.company_address });
  }

  return {
    id: legalCase.cheque_deposit_id,
    sNo: legalCase.cheque_deposit_id,
    applicationId: legalCase.application_id,
    chequeId: legalCase.cheque_deposit_id, // Added for address APIs
    
    // Customer Details
    customerName: customer.customer_name || 'N/A',
    fatherHusbandName: customer.customer_fathername || 'N/A',
    mobileNo: customer.customer_phone || 'N/A',
    email: customer.customer_email || 'N/A',
    gender: customer.customer_gender || 'N/A',
    loanId: customer.loan_no || 'N/A',
    crnNo: customer.crnno || 'N/A',
    
    // Address Details - Combined for display
    addresses: addresses,
    permanentAddress: address.permanent_address || 'N/A',
    currentAddress: address.current_address || 'N/A',
    companyAddress: address.company_address || 'N/A',
    
    // Financial Details
    principal: principal,
    roi: financial.roi, 
    tenure: financial.tenure || 0,
    interest: interest,
    penalInterest: penalInterest,
    penalty: penalty,
    processingFee: processingFee,
    gst: gst,
    totalPfGst: totalPfGst, // Calculated as processingFee + gst
    disbursementAmount: parseFloat(financial.disburse_amount) || 0,
    bounceCharge: bounceCharge,
    emiCollection: parseFloat(financial.emi_collection) || 0,
    dwCollection: parseFloat(financial.dw_collection) || 0,
    
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
    chequeDate: formatDateString(cheque.cheque_date),
    chequeAmount: chequeAmount,
    depositDate: formatDateString(cheque.deposit_date),
    
    // Important Dates - All formatted as dd-mm-yyyy
    approvedDate: formatDateString(dates.approved_date),
    transactionDate: formatDateString(dates.transaction_date),
    dueDate: formatDateString(dates.duedate),
    lastCollectionDate: formatDateString(dates.last_collection_date),
    bounceDate: formatDateString(dates.bounce_date),
    memoReceivedDate: formatDateString(dates.memo_received_date),
    closeDate: formatDateString(dates.closed_date),
    
    // Intimation dates from legal_status
    intimationMail: legalStatus.intimation_mail || 'N/A',
    intimationMailDespatch: formatDateString(legalStatus.intimation_mail_despatch),
    intimationMailDeliver: formatDateString(legalStatus.intimation_mail_deliver),
    chequeReturnMemo: formatDateString(legalStatus.cheque_return_memo),
    
    // Legal Documents Dates
    noticeDate: formatDateString(dates.notice_date),
    legalNoticeSpeedPostDate: formatDateString(dates.legal_notice_speed_post_date),
    speedpostReceivedDate: formatDateString(dates.speedpost_received_date_customer),
    boardResolutionDate: formatDateString(dates.board_resolution_date),
    loanAgreementDate: formatDateString(dates.loan_agreement_date),
    loanApplicationDate: formatDateString(dates.loan_application_date),
    replyReceivedDate: formatDateString(dates.reply_received_date),
    caseFilledDate: formatDateString(dates.case_filled_date),
    
    // Legal Status
    deliveryStatus: legalStatus.delivery_status || 'N/A',
    criminalComplaintNo: legalStatus.criminal_complaint_no || 'N/A',
    policeStation: legalStatus.police_station || 'N/A',
    bounceReason: legalStatus.reason_bounce || cheque.reason_bounce || 'N/A',
    remarkWithCaseDetails: legalStatus.remark_with_case_details || 'N/A',
    criminalCaseStatus: legalStatus.criminal_case_status || 'Pending', // NEW field
    
    // Calculated totals
    totalAmount: totalAmount,
    
    // Other
    updatedBy: legalCase.updated_by || 'N/A',
    chequePresent: chequeAmount > 0,
    status: legalStatus.status || 'N/A'
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