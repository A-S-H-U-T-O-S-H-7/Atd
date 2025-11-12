"use client";
import api from "@/utils/axiosInstance";

export const applicationAPI = {
  // Get application data for editing
  getApplicationForEdit: (id) => {
    return api.get(`/crm/application/edit/${id}`);
  },

  // Update application
  updateApplication: (id, data) => {
    return api.put(`/crm/application/update/${id}`, data);
  },

  // Create new application (if needed)
  createApplication: (data) => {
    return api.post("/crm/application/create", data);
  }
};

// Format application data from API response for UI
export const formatApplicationForUI = (applicationData) => {
  if (!applicationData?.data) return {};
  
  const data = applicationData.data;
  console.log('Raw API data for administration fee:', {
    process_percent: data.process_percent,
    process_fee: data.process_fee,
    gst: data.gst
  });
  
  return {
    // Personal Details
    formNo: data.loan_no || '',
    name: data.name || '',
    firstName: data.fname || '',
    lastName: data.lname || '',
    fatherName: data.fathername || '',
    dob: data.dob ? {
      day: new Date(data.dob).getDate(),
      month: new Date(data.dob).getMonth() + 1,
      year: new Date(data.dob).getFullYear()
    } : { day: '', month: '', year: '' },
    gender: data.gender || '',
    phoneNo: data.phone || '',
    email: data.email || '',
    
    // Current Address
    currentHouseNo: data.current_house_no || '',
    currentAddress: data.current_address || '',
    currentState: data.current_state || '',
    currentCity: data.current_city || '',
    currentPinCode: data.current_pincode || '',
    currentAddressCode: data.current_address_code || '',
    currentStateCode: data.current_state_code || '',
    currentAddressType: data.current_address_type || '', 
    
    // Permanent Address
    permanentHouseNo: data.house_no || '',
    permanentAddress: data.address || '',
    permanentState: data.state || '',
    permanentCity: data.city || '',
    permanentPinCode: data.pincode || '',
    permanentAddressCode: data.address_code || '',
    permanentStateCode: data.state_code || '',
    permanentAddressType: data.address_type || '',

    
    // Loan Details - FIXED: Handle null values properly
    amountApproved: data.approved_amount || '',
    amountApplied: data.applied_amount || '',
    loanTerm: data.loan_term || '',
    roi: data.roi || '',
    tenure: data.tenure || '',
    collectionAmount: data.dw_collection ? String(data.dw_collection) : '',
    emiCollectionAmount: data.emi_collection ? String(data.emi_collection) : '',
    gracePeriod: data.grace_period ? String(data.grace_period) : '',
    
    // FIX: Handle null values explicitly
    administrationFeePercent: data.process_percent !== null ? String(data.process_percent) : '',
    administrationFeeAmount: data.process_fee !== null ? String(data.process_fee) : '',
    gst: data.gst !== null ? String(data.gst) : '',
    
    redeemPoints: data.redeem_points ? String(data.redeem_points) : '',

    // Organization Details
    organisationName: data.organisation_name || '',
    organisationAddress: data.organisation_address || '',
    officePhone: data.office_phone || '',
    contactPerson: data.contact_person || '',
    mobileNo: data.mobile_no || '',
    hrMail: data.hr_mail || '',
    website: data.website || '',
    officialEmail: data.official_email || '',
    grossMonthlySalary: data.gross_monthly_salary || '',
    workSinceMm: data.work_since_mm || '',
    designation: data.designation || '',
    workSinceYy: data.work_since_yy || '',
    netHouseHoldIncome: data.net_house_hold_income || '',
    netMonthlySalary: data.net_monthly_salary || '',
    
    // Bank Details
    bankName: data.bank_name || '',
    branchName: data.branch_name || '',
    accountType: data.account_type || '',
    accountNo: data.account_no || '',
    ifscCode: data.ifsc_code || '',
    panNo: data.pan_no || '',
    aadharNo: data.aadhar_no || '',
    crnNo: data.crnno || '',
    accountId: data.accountId || '',
    approvalNote: data.approval_note || '',
    enachBank: data.enachbankname || '',
    enachMode: data.enachbankmode || '',
    enachBankCode: data.enachbankcode || '',
    
    // Reference Details
    referenceName: data.ref_name || '',
    referenceAddress: data.ref_address || '',
    referenceMobile: data.ref_mobile || '',
    referenceEmailId: data.ref_email || '',
    referenceRelation: data.ref_relation || ''
  };
};

// Format data for API submission
export const formatApplicationForAPI = (formData) => {
  return {
    crnno: formData.crnNo,
    account_id: formData.accountId,
    name: formData.name,
    fname: formData.firstName,
    lname: formData.lastName,
    dob: formData.dob.day && formData.dob.month && formData.dob.year 
      ? `${formData.dob.year}-${formData.dob.month.toString().padStart(2, '0')}-${formData.dob.day.toString().padStart(2, '0')}`
      : null,
    gender: formData.gender,
    father_name: formData.fatherName,
    phone: formData.phoneNo,
    email: formData.email,
    redeempoints: formData.redeemPoints || "0",
    
    // Current Address
    current_house_no: formData.currentHouseNo,
    current_address: formData.currentAddress,
    current_state: formData.currentState,
    current_city: formData.currentCity,
    current_pincode: formData.currentPinCode,
    current_address_code: formData.currentAddressCode,
    current_state_code: formData.currentStateCode,
    current_address_type: formData.currentAddressType || "1",
    
    // Permanent Address
    house_no: formData.permanentHouseNo,
    address: formData.permanentAddress,
    state: formData.permanentState,
    city: formData.permanentCity,
    pincode: formData.permanentPinCode,
    address_code: formData.permanentAddressCode,
    state_code: formData.permanentStateCode,
    address_type: formData.permanentAddressType || "1",
    
    // Loan Details
    loan_no: formData.formNo,
    applied_amount: formData.amountApplied,
    approved_amount: formData.amountApproved,
    roi: formData.roi,
    tenure: formData.tenure,
    loan_term: formData.loanTerm,
    dw_collection: formData.collectionAmount,
    emi_collection: formData.emiCollectionAmount,
    grace_period: formData.gracePeriod,
    process_percent: formData.administrationFeePercent || null,
    process_fee: formData.administrationFeeAmount || null,
    gst: formData.gst || null,
    approval_note: formData.approvalNote,
    
    // Bank Details
    bank_name: formData.bankName,
    branch_name: formData.branchName,
    account_type: formData.accountType,
    account_no: formData.accountNo,
    ifsc_code: formData.ifscCode,
    panno: formData.panNo,
    aadharno: formData.aadharNo,
    
    // E-Nach Details
    enachbankname: formData.enachBank || "",
    enachbankmode: formData.enachMode || "",
    enachbankcode: formData.enachBankCode || "",
    
    // Organization Details
    organisation_name: formData.organisationName,
    organisation_address: formData.organisationAddress,
    office_phone: formData.officePhone,
    contact_person: formData.contactPerson,
    mobile_no: formData.mobileNo,
    hr_mail: formData.hrMail,
    website: formData.website,
    office_mail: formData.officialEmail,
    gross_montly_salary: formData.grossMonthlySalary || "0",
    work_since_mm: formData.workSinceMm,
    designation: formData.designation,
    work_since_yy: formData.workSinceYy,
    net_house_hold_income: formData.netHouseHoldIncome,
    net_monthly_salary: formData.netMonthlySalary,

    // Reference Details
    ref_name: formData.referenceName,
    ref_address: formData.referenceAddress,
    ref_mobile: formData.referenceMobile,
    ref_email: formData.referenceEmailId,
    ref_relation: formData.referenceRelation
  };
};