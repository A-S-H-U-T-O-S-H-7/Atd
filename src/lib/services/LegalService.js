"use client";
import api from "@/utils/axiosInstance";

export const legalService = {
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

  // Get courts list
  getCourts: async () => {
    try {
      const response = await api.get("/crm/legal/court");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get authorised representatives
  getAuthorisedRepresentatives: async () => {
    try {
      const response = await api.get("/crm/legal/authorised");
      return response;
    } catch (error) {
      throw error;
    }
  },

  exportLegalCases: async (params = {}) => {
    try {
      const response = await api.get("/crm/legal/export", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create criminal case
createCriminalCase: async (legalId, caseData) => {
  try {
    const response = await api.put(
      `/crm/legal/create-crminal-case/${legalId}`,
      caseData
    );
    
    if (typeof response === 'string' && response.includes('<html')) {
      return {
        success: true,
        data: new Blob([response], { type: 'application/msword' })
      };
    }
    
    // Handle unexpected response format
    return {
      success: false,
      message: 'Unexpected response format'
    };
    
  } catch (error) {
    console.error('Create criminal case error:', error);
    
    if (error.response?.data && typeof error.response.data === 'string' && 
        error.response.data.includes('<html')) {
      return {
        success: true,
        data: new Blob([error.response.data], { type: 'application/msword' })
      };
    }
    
    throw new Error(error.response?.data?.message || 'Failed to create criminal case');
  }
},

  // Create arbitration criminal case
createArbitrationCriminalCase: async (legalId, caseData) => {
  try {
    const response = await api.put(
      `/crm/legal/arbitration-crminal/${legalId}`,
      caseData
    );
    
    if (typeof response === 'string' && response.includes('<html')) {
      return response; 
    }
    
    return response;
    
  } catch (error) {
    console.error('Create arbitration criminal case error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create arbitration criminal case');
  }
},

  createLegalNotice: async (legalId, noticeData) => {
    try {
      const responseData = await api.put(`/crm/legal/create-notice/${legalId}`, noticeData);
      
      if (responseData && (responseData.success || responseData.status === 'success')) {
        return responseData;
      } else {
        return {
          success: false,
          message: responseData.message || "Unknown error"
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Network error"
      };
    }
  },

  createArbitrationNotice: async (legalId, noticeData) => {
    try {
      const response = await api.put(
        `/crm/legal/arbitration-notice/${legalId}`,
        noticeData,
        { responseType: 'blob' } 
      );
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Network error"
      };
    }
  },

  updateLegalCase: async (legalId, updateData) => {
    try {
      const response = await api.put(`/crm/legal/${legalId}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAddresses: async (chequeId) => {
    try {
      const response = await api.get(`/crm/legal/addresses/${chequeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addAddress: async (chequeId, addressData) => {
    try {
      const response = await api.put(`/crm/legal/address/add/${chequeId}`, addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/crm/legal/address/update/${addressId}`, addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getHearings: async (chequeId) => {
    try {
      const response = await api.get(`/crm/legal/case/hearings/${chequeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addHearing: async (chequeId, formData) => {
    try {
      const response = await api.post(`/crm/legal/case/hearing/add/${chequeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error adding hearing:', error);
      throw error;
    }
  },

  updateHearing: async (hearingId, formData) => {
    try {
      const response = await api.post(`/crm/legal/case/hearing/update/${hearingId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating hearing:', error);
      throw error;
    }
  },

  getAdvocates: async () => {
    try {
      const response = await api.get("/crm/legal/advocate");
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Format legal case data for UI
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
  
  // Get raw addresses array from response
  const rawAddresses = legalCase.addresses || [];

  // Enhanced format date function with time option
  const formatDateString = (dateString, includeTime = false) => {
    if (!dateString || dateString === 'N/A' || dateString === null || dateString === 'null') return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try to extract just the date part if it's a datetime string
        const dateOnly = dateString.split('T')[0];
        if (dateOnly) {
          return dateOnly.split('-').reverse().join('-'); // Convert YYYY-MM-DD to DD-MM-YYYY
        }
        return dateString;
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      // Include time for address dates (speed post)
      if (includeTime) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        // Only show time if it's not midnight
        if (hours !== '00' || minutes !== '00') {
          return `${day}-${month}-${year} ${hours}:${minutes}`;
        }
      }
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString;
    }
  };

  // Format addresses for speed post display
  const formattedAddresses = rawAddresses.map((addr, index) => ({
    id: addr.id || index + 1,
    cheque_id: addr.cheque_id || 'N/A',
    address: addr.address || 'N/A',
    // Format posted_date WITH time
    posted_date: addr.posted_date ? formatDateString(addr.posted_date, true) : 'N/A',
    // Format delivered_date WITH time
    delivered_date: addr.delivered_date ? formatDateString(addr.delivered_date, true) : 'N/A',
    tracking_no: addr.tracking_no || 'N/A',
    status: addr.status || 'N/A'
  }));

  // Calculate derived values
  const approvedAmount = parseFloat(financial.approved_amount) || 0;
  const principal = parseFloat(cheque.principal_amount) || 0;
  const processingFee = parseFloat(financial.process_fee) || 0;
  const gst = parseFloat(financial.gst) || 0;
  const interest = parseFloat(cheque.interest) || 0;
  const penalInterest = parseFloat(cheque.penal_interest) || 0;
  const penalty = parseFloat(cheque.penality) || 0;
  const bounceCharge = parseFloat(cheque.bounce_charge) || 0;
  const chequeAmount = parseFloat(cheque.deposit_amount) || 0;
  
  const totalPfGst = processingFee + gst;
  const totalAmount = principal + interest + penalInterest + penalty;

  // Combine addresses for display (for address column)
  const displayAddresses = [];
  if (address.permanent_address && address.permanent_address !== 'N/A') {
    displayAddresses.push({ type: "Permanent", address: address.permanent_address });
  }
  if (address.current_address && address.current_address !== 'N/A') {
    displayAddresses.push({ type: "Current", address: address.current_address });
  }
  if (address.company_address && address.company_address !== 'N/A') {
    displayAddresses.push({ type: "Company", address: address.company_address });
  }

  return {
    id: legalCase.cheque_deposit_id,
    sNo: legalCase.cheque_deposit_id,
    applicationId: legalCase.application_id,
    chequeId: legalCase.cheque_deposit_id, 
    medium: legalCase.medium || 'N/A',
    
    // Customer Details
    customerName: customer.customer_name || 'N/A',
    fatherHusbandName: customer.customer_fathername || 'N/A',
    mobileNo: customer.customer_phone || 'N/A',
    email: customer.customer_email || 'N/A', 
    gender: customer.customer_gender || 'N/A',
    loanId: customer.loan_no || 'N/A',
    crnNo: customer.crnno || 'N/A',
    
    // Address Details
    addresses: formattedAddresses, 
    displayAddresses: displayAddresses, 
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
    totalPfGst: totalPfGst, 
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
    
    // Important Dates
    approvedDate: formatDateString(dates.approved_date),
    approvedAmount: approvedAmount,
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
    criminalCaseStatus: legalStatus.criminal_case_status || 'Pending',
    
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

// Hearing status utilities
export const hearingStatusService = {
  getHearingStatus: (hearing) => {
    const today = new Date().toISOString().split('T')[0];
    const nextDate = hearing.next_hearing_date?.split('T')[0];
    
    if (!nextDate) return 'pending';
    if (new Date(nextDate) < new Date(today)) return 'overdue';
    if (nextDate === today) return 'today';
    return 'upcoming';
  },

  getStatusColor: (status, isDark = false) => {
    switch (status) {
      case 'today':
        return isDark 
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700" 
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'overdue':
        return isDark 
          ? "bg-red-900/50 text-red-300 border-red-700" 
          : "bg-red-100 text-red-800 border-red-200";
      case 'upcoming':
        return isDark 
          ? "bg-green-900/50 text-green-300 border-green-700" 
          : "bg-green-100 text-green-800 border-green-200";
      default:
        return isDark 
          ? "bg-gray-700 text-gray-300 border-gray-600" 
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  },

  getStatusIcon: (status) => {
    switch (status) {
      case 'today':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'upcoming':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  }
  
};