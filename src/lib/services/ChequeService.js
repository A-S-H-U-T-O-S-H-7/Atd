"use client";
import api from "@/utils/axiosInstance";

export const ChequeService = {
  getLoans: async () => {
    try {
      const response = await api.get("/crm/deposit/loans");
      return response;
    } catch (error) {
      throw error;
    }
  },

  getLoanDetails: async (loanId) => {
    try {
      const response = await api.get(`/crm/deposit/loan/${loanId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addChequeDeposit: async (depositData) => {
    try {
      const response = await api.post("/crm/deposit/cheque/add", depositData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateChequeDeposit: async (depositId, depositData) => {
    try {
      const response = await api.put(`/crm/deposit/cheque/update/${depositId}`, depositData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getChequeDeposit: async (depositId) => {
    try {
      const response = await api.get(`/crm/deposit/cheque/edit/${depositId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getChequeDeposits: async (params = {}) => {
    try {
      const response = await api.get("/crm/deposit/cheque/manage", { params });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const formatLoanOptions = (loans) => {
  if (!loans || !Array.isArray(loans)) return [];
  return loans.map(loan => ({
    id: loan.id,
    loanNo: loan.loan_no
  }));
};

export const formatLoanDetails = (loanData) => {
  if (!loanData) return {};
  
  return {
    companyBankName: loanData.company_bank || "",
    companyBankBranch: loanData.company_bank_branch || "",
    companyBankAC: loanData.company_bank_account_no || "",
    companyBankIFSC: loanData.company_bank_ifsc_code || "",
    customerBankName: loanData.customer_bank_name || "",
    customerBankBranch: loanData.customer_bank_branch_name || "",
    customerBankAC: loanData.customer_bank_account_no || "",
    customerBankIFSC: loanData.customer_bank_ifsc_code || ""
  };
};

export const formatDepositDataForForm = (apiData) => {
  if (!apiData) return {};
  
  return {
    loanNo: apiData.loan_no || "",
    applicationId: apiData.application_id || "",
    name: apiData.name || "",
    fatherName: apiData.f_name || "",
    relation: apiData.relation_with || "",
    chequePresented: "Repayment Cheque",
    otherAddress: apiData.other_address || "",
    companyBankName: apiData.company_bank_name || "",
    companyBankBranch: apiData.company_bank_branch || "",
    companyBankAC: apiData.company_bank_ac || "",
    companyBankIFSC: apiData.company_bank_ifsc || "",
    customerBankName: apiData.customer_bank_name || "",
    customerBankBranch: apiData.customer_bank_branch || "",
    customerBankAC: apiData.customer_bank_ac || "",
    customerBankIFSC: apiData.customer_bank_ifsc || "",
    chequeNo: apiData.cheque_no || "",
    chequeReceivedDate: apiData.cheque_date || "",
    chequeDepositDate: apiData.deposit_date || "",
    amount: apiData.deposit_amount || "",
    interest: apiData.interest || "",
    penalInterest: apiData.penal_interest || "",
    penalty: apiData.penality || "",
    deliveryStatus: apiData.delivery_status || "",
    deliveryAddress: apiData.delivery_address || ""
  };
};

export const formatDepositDataForAPI = (formData, loanOptions, isEdit = false) => {
  // Find application_id from selected loan number
  const selectedLoan = loanOptions.find(loan => loan.loanNo === formData.loanNo);
  const applicationId = isEdit ? formData.applicationId : selectedLoan?.id;

  const baseData = {
    id: applicationId,
    name: formData.name || "",
    fathername: formData.fatherName || "",
    relation: formData.relation || "",
    other_address: formData.otherAddress || "",
    company_bank_name: formData.companyBankName || "",
    company_bank_branch: formData.companyBankBranch || "",
    company_bank_ac: formData.companyBankAC || "",
    company_bank_ifsc: formData.companyBankIFSC || "",
    customer_bank_name: formData.customerBankName || "",
    customer_bank_branch: formData.customerBankBranch || "",
    customer_bank_ac: formData.customerBankAC || "",
    customer_bank_ifsc: formData.customerBankIFSC || "",
    cheque_no: formData.chequeNo || "",
    cheque_date: formData.chequeReceivedDate || "",
    deposit_date: formData.chequeDepositDate || "",
    deposit_amount: parseFloat(formData.amount) || 0,
    interest: parseFloat(formData.interest) || 0,
    penal_interest: parseFloat(formData.penalInterest) || 0,
    penality: parseFloat(formData.penalty) || 0,
    cheque_present: 1,
    delivery_status: formData.deliveryStatus || "Pending",
    delivery_address: formData.deliveryAddress || ""
  };

  return baseData;
};

export const formatDepositsForTable = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  return apiData.map(deposit => ({
    id: deposit.id,
    applicationId: deposit.application_id,
    loanNo: deposit.loan_no || "",
    chequeNo: deposit.cheque_no || "",
    bankName: deposit.company_bank_name || "",
    depositDate: deposit.deposit_date ? new Date(deposit.deposit_date).toLocaleDateString('en-GB') : "",
    amount: parseFloat(deposit.deposit_amount) || 0,
    user: deposit.admin_name || "",
    name: deposit.name || "",
    fatherName: deposit.f_name || "",
    relation: deposit.relation_with || "",
    status: deposit.delivery_status || "Pending"
  }));
};