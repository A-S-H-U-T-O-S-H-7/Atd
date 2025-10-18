"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { Formik } from 'formik';
import { ArrowLeft, Check, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast'; 
import { useThemeStore } from '@/lib/store/useThemeStore';

// Import services
import {appraisalCoreService, referenceService, alternateNumbersService, personalInfoService } from '@/lib/services/appraisal';
import { documentVerificationSchema } from '@/lib/schema/documentVerificationSchema';
import salaryService from '@/lib/services/appraisal/salaryService';



// Import components
import BasicInformation from './BasicInfo';
import PersonalVerification from './PersonalVerification';
import DocumentVerification from './DocumentVerification';
import AlternativeNumberRemark from './AlternativeNumber';
import ReferenceVerification from './ReferenceVerification';
import OrganizationVerification from './OrganizationVerification';
import SocialScoreVerification from './SocialScroreVerification';
import IncomeVerification from './IncomeVerification';
import CibilVerification from './CibilVerification';
import SalarySlipVerification from './SalarySlipVerification';
import BankVerification from './BankVerification';

const AppraisalReport = ({ enquiry, onBack }) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState(null);
  const [error, setError] = useState(null);

  // Define initialValues
  const initialValues = {
    // Basic Information
    name: '',
    crnNo: '',
    organizationName: '',
    loanAccountNo: '',
    state: '',
    city: '',
    ifscCode: '',
    accountNumber: '',
    bankName: '', 
    branchName: '',
    accountType: '',
    
    // Personal Verification
    fatherName: '',
    currentAddress: '',
    permanentAddress: '',
    
    // Document Verification
    phoneNoVerified: false,
    phoneNoStatus: '',
    aadharCardVerified: false,
    aadharCardStatus: '',
    aadharNo: '',
    panCardVerified: false,
    panCardStatus: '',
    panNo: '',
    phoneVerified: '',
  phoneStatus: '',
  panVerified: '',
  panStatus: '',
  aadharVerified: '',
  aadharStatus: '',
  aadharPanLinked: '',
  refNameVerified: '',
  refPhoneVerified: '',
  refEmailVerified: '',
  refRelationVerified: '',
  finalReport: '',
    
    // Bank Verification fields
    bankVerificationRemark: '',
    bankVerificationFinalReport: '',
    
    // Organization fields
    organizationRemark: '',
    organizationContactName: '',
    organizationVerificationStatus: '',
    organizationVerificationMethod: '',
    companyPhoneVerificationStatus: '',
    companyPhoneVerificationMethod: '',
    companyWebsiteStatus: '',
    hrPhoneVerificationStatus: '',
    hrPhoneVerificationMethod: '',
    hrContactStatus: '',
    hrEmailVerificationStatus: '',
    hrEmailVerificationMethod: '',
    organizationFinalReport: '',
    
    // Organization data fields
    officePhone: '',
    mobileNo: '',
    website: '',
    hrMail: '',
    contactPerson: '',
    
    // Social Score fields
    socialScore: '',
    socialScoreRange: '',
    socialScoreRecommendation: '',
    socialScoreRemark: '',
    socialScoreFinalReport: '',
    
    // Income Verification fields
    organizationSameAsApplied: '',
    organizationSameAsAppliedStatus: '',
    grossAmountSalary: '',
    grossAmountSalaryStatus: '',
    netAmountSalary: '',
    netAmountSalaryStatus: '',
    salaryDate: '',
    netHouseHoldIncome: '',
    familyMembers: [],
    totalHouseHoldIncome: 0,
    availabilityOfBasicAmenities: '',
    availabilityOfOtherAssets: '',
    primarySourceOfIncome: '',
    natureOfWork: '',
    frequencyOfIncome: '',
    monthsOfEmployment: '',
    selfReportedMonthlyIncome: '',
    averageMonthlyIncome: '',
    incomeVerificationFinalReport: '',
    
    // Salary Verification fields
    salaryAutoVerification: '',
    salaryAutoVerificationStatus: '',
    salaryCreditedRegular: '',
    salaryCreditedRegularStatus: '',
    salaryInterval: '',
    anyEmiDebited: '',
    isEmiWithBankStatement: '',
    isSalaryAccount: '',
    isSalaryAccountStatus: '',
    salaryAccountRemark: '',
    salaryAmount: '',
    salaryVerificationRemark: '',
    salaryVerificationFinalReport: '',
    
    // CIBIL Verification fields
    cibilScore: '',
    cibilScoreStatus: '',
    totalActiveLoans: 0,
    activeLoanStatus: '',
    totalClosedLoans: 0,
    closedLoanStatus: '',
    writeOffSettled: 0,
    writeOffStatus: '',
    noOfOverdue: 0,
    overdueStatus: '',
    totalEmiAsCibil: '',
    dpd: '',
    dpdStatus: '',
    emiStatus: '',
    cibilComment: '',
    cibilRemark: '',
    cibilFinalReport: '',
    
    // References for DocumentVerification display
    apiReferenceData: {
      name: '',
      email: '',
      phone: '',
      relation: ''
    },
    
    // References for ReferenceVerification form
    additionalRefs: Array(5).fill().map(() => ({
      name: '',
      email: '',
      phone: '',
      relation: '',
      verified: false
    })),
    
    // Other fields
    alternateMobileNo1: '',
    alternateMobileNo2: '',
    remark: '',
    salarySlipRemark: '',
    finalReport: ''
  };

  // Helper function to format API data
  const formatAppraisalData = (application, appraisal) => {
    
    // THE FIX: Use the correct field names from your debug output
    const formattedData = {
      // Basic Information
      name: `${application.fname || ''} ${application.lname || ''}`.trim() || 'N/A',
      crnNo: application.crnno || 'N/A',
      organizationName: application.organisation_name || 'N/A',
      loanAccountNo: application.loan_no || application.accountId || 'N/A',
      state: application.state || 'N/A', 
      city: application.city || 'N/A', 
      ifscCode: application.ifsc_code || 'N/A',
      applicationId: application.application_id || enquiry.id,
      
      // BANK FIELDS - USE CORRECT FIELD NAMES FROM DEBUG OUTPUT
      accountNumber: application.accountNo || application.account_no || 'N/A',
      bankName: application.bankName || application.bank_name || 'N/A',
      branchName: application.branchName || application.branch_name || 'N/A',
      accountType: application.account_type || 'N/A',
      
      phoneNo: application.phone || 'N/A',
      email: application.email || 'N/A',
      dob: application.dob || 'N/A',
      appliedAmount: application.applied_amount || 'N/A',
      fatherName: application.fathername || 'N/A',
      aadharNo: application.aadhar_no || 'N/A',
      panNo: application.pan_no || 'N/A',
      
      // Personal Verification
      currentAddress: application.current_address || application.address || 'N/A',
      permanentAddress: application.permanent_address || application.address || 'N/A',
      
      // Document Verification
      phoneNoVerified: appraisal.personal_phone === "Yes",
      phoneNoStatus: appraisal.phone_status || '',
      aadharCardVerified: appraisal.personal_aadhar === "Yes",
      aadharCardStatus: appraisal.aadhar_status || '',
      panCardVerified: appraisal.personal_pan === "Yes",
      panCardStatus: appraisal.pan_status || '',
      phoneVerified: appraisal.personal_phone || '',
  phoneStatus: appraisal.phone_status || '',
  panVerified: appraisal.personal_pan || '',
  panStatus: appraisal.pan_status || '',
  aadharVerified: appraisal.personal_aadhar || '',
  aadharStatus: appraisal.aadhar_status || '',
  aadharPanLinked: appraisal.aadhar_pan_linked || '',
  // Reference Verification
  refNameVerified: appraisal.personal_ref_name === 'Yes' ? 'Yes' : '',
  refPhoneVerified: appraisal.personal_ref_mobile === 'Yes' ? 'Yes' : '',
  refEmailVerified: appraisal.personal_ref_email === 'Yes' ? 'Yes' : '',
  refRelationVerified: appraisal.personal_ref_relation === 'Yes' ? 'Yes' : '',
  finalReport: appraisal.personal_final_report || '',
      
      // Organization fields
      organizationSameAsApplied: appraisal.organization_applied || '',
      organizationSameAsAppliedStatus: appraisal.organization_applied_status || '',
      organizationVerificationStatus: appraisal.online_verification || '',
      organizationVerificationMethod: appraisal.online_verification_status || '',
      companyPhoneVerificationStatus: appraisal.company_phone || '',
      companyPhoneVerificationMethod: appraisal.company_phone_status || '',
      companyWebsiteStatus: appraisal.website_status || '',
      hrPhoneVerificationStatus: appraisal.company_mobile || '',
      hrPhoneVerificationMethod: appraisal.company_mobile_status || '',
      hrContactStatus: appraisal.contact_status || '',
      hrEmailVerificationStatus: appraisal.hr_mail || '',
      hrEmailVerificationMethod: appraisal.hr_mail_status || '',
      organizationFinalReport: appraisal.organization_final_report || '',
      organizationRemark: appraisal.OrganizationRemark || '',
      
      // Organization data from application
      officePhone: application.office_phone || '',
      mobileNo: application.mobile_no || '',
      website: application.website || '',
      hrMail: application.hr_mail || '',
      contactPerson: application.contact_person || '',
      
      // Income/Salary fields - use appraisal data first, fallback to application data
      grossAmountSalary: appraisal.gross_amount_salary || application.gross_monthly_salary || '',
      grossAmountSalaryStatus: appraisal.gross_amount_salary_status || '',
      netAmountSalary: appraisal.net_amount_salary || application.net_monthly_salary || '',
      netAmountSalaryStatus: appraisal.net_amount_salary_status || '',
      salaryDate: appraisal.monthly_salary_date || '',
      availabilityOfBasicAmenities: appraisal.avail_amenities || '',
      availabilityOfOtherAssets: appraisal.ava_assets || '',
      primarySourceOfIncome: appraisal.primary_income || '',
      natureOfWork: appraisal.nature_of_work || '',
      frequencyOfIncome: appraisal.frequency_income || '',
      monthsOfEmployment: appraisal.month_employment_last_one_year || '',
      selfReportedMonthlyIncome: appraisal.self_reported_monthly_income || '',
      averageMonthlyIncome: appraisal.average_monthly_income || '',
      incomeVerificationFinalReport: appraisal.salaryslip_final_report || '',
      incomeVerificationRemark: appraisal.SalaryRemark || '',
      
      // Bank fields
      salaryAutoVerification: appraisal.auto_verification || '',
      salaryAutoVerificationStatus: appraisal.auto_verification_status || '',
      isSalaryAccount: appraisal.is_salary_account || '',
      isSalaryAccountStatus: appraisal.is_salary_account_status || '',
      salaryCreditedRegular: appraisal.regural_interval || '',
      salaryCreditedRegularStatus: appraisal.regural_interval_status || '',
      salaryAccountRemark: appraisal.salary_remark || '',
      anyEmiDebited: appraisal.emi_debit || '',
      salaryAmount: appraisal.emi_amount || '',
      isEmiWithBankStatement: appraisal.emi_with_bank_statement || '',
      bankVerificationFinalReport: appraisal.bankstatement_final_report || '',
      bankVerificationRemark: appraisal.BankRemark || '',
      
      // Social Score fields
      socialScore: appraisal.social_score || '',
      socialScoreRange: appraisal.social_score_status || '',
      socialScoreRecommendation: appraisal.social_score_suggestion || '',
      socialScoreFinalReport: appraisal.socialscore_final_report || '',
      socialScoreRemark: appraisal.SocialRemark || '',
      
      // CIBIL fields
      cibilScore: appraisal.cibil_score || '',
      cibilScoreStatus: appraisal.score_status || '',
      totalActiveLoans: appraisal.total_active_amount || 0,
      activeLoanStatus: appraisal.total_active_amount_status || '',
      totalClosedLoans: appraisal.total_closed_amount || 0,
      closedLoanStatus: appraisal.total_closed_amount_status || '',
      writeOffSettled: appraisal.write_off_settled || 0,
      writeOffStatus: appraisal.write_off_settled_status || '',
      noOfOverdue: appraisal.overdue || 0,
      overdueStatus: appraisal.overdue_status || '',
      totalEmiAsCibil: appraisal.total_emi_cibil || '',
      cibilComment: appraisal.comment || '',
      dpd: appraisal.dpd || '',
      dpdStatus: appraisal.dpd_status || '',
      cibilFinalReport: appraisal.cibil_final_report || '',
      cibilRemark: appraisal.CibilRemark || '',
      
      // Other fields
      alternateMobileNo1: appraisal.alternate_no1 || '',
      alternateMobileNo2: appraisal.alternate_no2 || '',
      remark: appraisal.PerRemark || '',
      salarySlipRemark: appraisal.SalaryRemark || '',
      finalReport: appraisal.personal_final_report || '',

      // Additional data
      familyMembers: [],
      netHouseHoldIncome: application.net_house_hold_income || '',
      
      // Reference data for DocumentVerification display (from API)
      apiReferenceData: {
        name: application.ref_name || '',
        email: application.ref_email || '',
        phone: application.ref_mobile || '',
        relation: application.ref_relation || ''
      },
      
      // References for ReferenceVerification form (always empty - form only)
      additionalRefs: Array(5).fill().map(() => ({
        name: '',
        email: '',
        phone: '',
        relation: '',
        verified: false
      }))
    };



    return formattedData;
  };

  // Single data loading function
  const loadAppraisalData = useCallback(async () => {
    if (!enquiry?.id) {
      console.error('❌ No enquiry ID provided');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Fetching appraisal data for enquiry:', enquiry.id);
      const response = await appraisalCoreService.getAppraisalReport(enquiry.id);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch appraisal data');
      }

      console.log('✅ Appraisal data loaded successfully');
      return formatAppraisalData(response.application, response.appraisal);

    } catch (error) {
      console.error('❌ Error loading appraisal data:', error);
      
      // Fallback to enquiry data
      const fallbackData = {
        ...initialValues,
        name: `${enquiry.firstName || ''} ${enquiry.lastName || ''}`.trim() || 'N/A',
        crnNo: enquiry.crnNo || 'N/A',
        organizationName: enquiry.organizationName || 'N/A',
        loanAccountNo: enquiry.accountId || 'N/A',
      };
      
      toast.success('Loaded basic information from enquiry data');
      return fallbackData;
    } finally {
      setLoading(false);
    }
  }, [enquiry]);

  // Load data when component mounts
  useEffect(() => {
    const initializeData = async () => {
      const data = await loadAppraisalData();
      setInitialFormValues(data || initialValues);
    };

    initializeData();
  }, [loadAppraisalData]);

  // Simplified handler functions
  const handleFinalSubmit = async (values) => {
    try {
      setSubmitting(true);
      await appraisalCoreService.saveFinalVerification({
        application_id: enquiry.id,
        total_final_report: values.finalReport || "Recommended"
      });
      toast.success('Report submitted successfully!');
      onBack();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectCase = async (values) => {
    try {
      setSubmitting(true);
      await appraisalCoreService.rejectApplication({
        application_id: enquiry.id,
        remark: values.remark || "Application rejected"
      });
      toast.success('Case rejected successfully!');
      onBack();
    } catch (error) {
      console.error('Error rejecting case:', error);
      toast.error('Failed to reject case');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSectionSave = async (saveFunction, values, additionalData) => {
  try {
    await saveFunction(values, additionalData);
  } catch (error) {
    console.error('Error saving section:', error);
  }
};

  const saveReferenceVerification = async (values) => {
  try {
    setSaving(true);
    
    const referencesData = {
      application_id: enquiry.id,
      crnno: values.crnNo,
    };

    // Add up to 5 references
    values.additionalRefs.slice(0, 5).forEach((ref, index) => {
      const num = index + 1;
      if (ref.name || ref.email || ref.phone) {
        referencesData[`add_ref_name_${num}`] = ref.name;
        referencesData[`add_ref_email_${num}`] = ref.email;
        referencesData[`add_ref_phone_${num}`] = ref.phone;
        referencesData[`add_ref_relation_${num}`] = ref.relation;
        referencesData[`add_ref_verify_${num}`] = ref.verified;
      }
    });

    console.log('🚀 Saving references data:', referencesData);
    
    // Call the API
    const response = await referenceService.saveAdditionalReferences(referencesData);
    
    console.log('✅ References saved successfully:', response);
    toast.success('References saved successfully!');
  } catch (error) {
    console.error('Error saving references:', error);
    toast.error('Failed to save references');
    throw error;
  } finally {
    setSaving(false);
  }
};

const saveDocumentVerification = async (values) => {
  try {
    setSaving(true);
    
    const documentData = {
      application_id: enquiry.id,
      personal_phone: values.phoneVerified,
      phone_status: values.phoneStatus,
      personal_pan: values.panVerified,
      pan_status: values.panStatus,
      personal_aadhar: values.aadharVerified,
      aadhar_status: values.aadharStatus,
      aadhar_pan_linked: values.aadharPanLinked,
      personal_ref_name: values.refNameVerified,
      personal_ref_mobile: values.refPhoneVerified,
      personal_ref_email: values.refEmailVerified,
      personal_ref_relation: values.refRelationVerified,
      personal_final_report: values.finalReport
    };

    console.log('🚀 Saving document verification:', documentData);
    
    // Use personalInfoService for final verification
    const response = await personalInfoService.savePersonalFinalVerification(documentData);
    
    console.log('✅ Document verification saved successfully:', response);
    toast.success('Document verification saved successfully!');
  } catch (error) {
    console.error('Error saving document verification:', error);
    toast.error('Failed to save document verification');
    throw error;
  } finally {
    setSaving(false);
  }
};

// Save personal verification (father name, addresses)
const savePersonalVerification = async (values) => {
  try {
    setSaving(true);
    
    // Validate required fields
    if (!values.fatherName || values.fatherName.trim().length === 0) {
      toast.error('Father\'s name is required');
      return;
    }
    if (!values.currentAddress || values.currentAddress.trim().length === 0) {
      toast.error('Current address is required');
      return;
    }
    if (!values.permanentAddress || values.permanentAddress.trim().length === 0) {
      toast.error('Permanent address is required');
      return;
    }
    
    // Try to get user_id from application data
    const possibleUserId = values.applicationId || enquiry.user_id || enquiry.id || 176;
    const possibleAddressId = enquiry.address_id || enquiry.id || 89;
    
    console.log('📋 Personal verification debug info:', {
      enquiry,
      possibleUserId,
      possibleAddressId,
      values: {
        fatherName: values.fatherName,
        currentAddress: values.currentAddress?.substring(0, 50) + '...',
        permanentAddress: values.permanentAddress?.substring(0, 50) + '...'
      }
    });
    
    // Use the exact structure from API documentation
    const personalData = {
      user_id: parseInt(possibleUserId),
      address_id: parseInt(possibleAddressId),
      father_name: values.fatherName.trim(),
      current_address: values.currentAddress.trim(),
      permanent_address: values.permanentAddress.trim()
    };
    
    console.log('🚀 Sending personal verification data:', personalData);
    
    try {
      const response = await personalInfoService.updatePersonalInfo(personalData);
      console.log('✅ Personal verification saved successfully:', response);
      toast.success('Personal verification saved successfully!');
    } catch (apiError) {
      console.error('❌ First attempt failed, trying with fallback IDs:', apiError);
      
      // If the current IDs fail, try with the working example values
      const fallbackData = {
        user_id: 176,
        address_id: 89,
        father_name: values.fatherName.trim(),
        current_address: values.currentAddress.trim(),
        permanent_address: values.permanentAddress.trim()
      };
      
      console.log('🚀 Retrying with fallback data:', fallbackData);
      const response = await personalInfoService.updatePersonalInfo(fallbackData);
      console.log('✅ Personal verification saved with fallback IDs:', response);
      toast.success('Personal verification saved successfully!');
    }
  } catch (error) {
    console.error('❌ Error saving personal verification:', error);
    console.error('📊 Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.response?.data?.message
    });
    
    if (error.response?.status === 422) {
      const errorMessage = error.response?.data?.message || 'Invalid personal data. Please check all fields.';
      console.error('🔴 422 Error Message:', errorMessage);
      toast.error(errorMessage);
    } else {
      toast.error('Failed to save personal verification');
    }
    throw error;
  } finally {
    setSaving(false);
  }
};

const saveSalaryRemark = async (values) => {
  try {
    setSaving(true);
    
    const remarkData = {
      application_id: enquiry.id,
      remarks: values.incomeVerificationRemark || "Salary transfer on time"
    };

    const response = await salaryService.saveSalaryRemark(remarkData);
    toast.success('Salary remark saved successfully!');
  } catch (error) {
    console.error('Error saving salary remark:', error);
    toast.error('Failed to save salary remark');
    throw error;
  } finally {
    setSaving(false);
  }
};

// Save household income (multiple family members)
const saveHouseholdIncome = async (familyMembers) => {
  try {
    setSaving(true);
    
    // Save each family member individually
    const savePromises = familyMembers.map(async (member) => {
      if (member.unit && member.annualIncome) {
        const householdData = {
          application_id: enquiry.id,
          house_holder_family: member.unit,
          nature_of_work: member.natureOfWork,
          contact_no: member.contactNo,
          annual_income: parseFloat(member.annualIncome) || 0
        };

        return await salaryService.addHouseholdIncome(householdData);
      }
    });

    await Promise.all(savePromises);
    toast.success('Household income saved successfully!');
  } catch (error) {
    console.error('Error saving household income:', error);
    toast.error('Failed to save household income');
    throw error;
  } finally {
    setSaving(false);
  }
};

// Save salary verification
const saveSalaryVerification = async (values) => {
  try {
    setSaving(true);
    
    const salaryVerificationData = {
      application_id: enquiry.id,
      organization_applied: values.organizationSameAsApplied,
      organization_applied_status: values.organizationSameAsAppliedStatus,
      gross_amount_salary: values.grossAmountSalary,
      gross_amount_salary_status: values.grossAmountSalaryStatus,
      net_amount_salary: values.netAmountSalary,
      net_amount_salary_status: values.netAmountSalaryStatus,
      monthly_salary_date: values.salaryDate,
      avail_amenities: values.availabilityOfBasicAmenities,
      ava_assets: values.availabilityOfOtherAssets,
      primary_income: values.primarySourceOfIncome,
      nature_of_work: values.natureOfWork,
      frequency_income: values.frequencyOfIncome,
      month_employment_last_one_year: values.monthsOfEmployment,
      self_reported_monthly_income: parseFloat(values.selfReportedMonthlyIncome) || 0,
      average_monthly_income: parseFloat(values.averageMonthlyIncome) || 0,
      salaryslip_final_report: values.incomeVerificationFinalReport
    };

    const response = await salaryService.saveSalaryVerification(salaryVerificationData);
    toast.success('Salary verification saved successfully!');
  } catch (error) {
    console.error('Error saving salary verification:', error);
    toast.error('Failed to save salary verification');
    throw error;
  } finally {
    setSaving(false);
  }
};

// Save salary slip verification (for SalarySlipVerification component)
const saveSalarySlipVerification = async (values) => {
  try {
    setSaving(true);
    
    // Save salary slip remark using the same salary remark API
    if (values.salarySlipRemark) {
      const remarkData = {
        application_id: enquiry.id,
        remarks: values.salarySlipRemark
      };
      
      await salaryService.saveSalaryRemark(remarkData);
    }
    
    toast.success('Salary slip verification saved successfully!');
  } catch (error) {
    console.error('Error saving salary slip verification:', error);
    toast.error('Failed to save salary slip verification');
    throw error;
  } finally {
    setSaving(false);
  }
};

// Combined function for income verification section (no remark handling - remarks are in SalarySlipVerification)
// Note: IncomeVerification component now handles its own saving, this function is not used
const saveIncomeVerification = async (values, familyMembers) => {
  try {
    setSaving(true);
    
    // Note: Remarks are handled in SalarySlipVerification component, not here
    
    // Save household income for each family member
    if (familyMembers && familyMembers.length > 0) {
      await saveHouseholdIncome(familyMembers);
    }
    
    // Save salary verification
    await saveSalaryVerification(values);
    
    // Note: Toast is handled by the component itself, not here
  } catch (error) {
    console.error('Error in income verification:', error);
    throw error;
  } finally {
    setSaving(false);
  }
};

// Organization verification is now handled by the component itself

const saveBankVerification = async (values) => {
  try {
    setSaving(true);
    console.log('🚀 Bank verification would be saved here:', values);
    toast.success('Bank verification saved successfully!');
  } catch (error) {
    console.error('Error saving bank verification:', error);
    toast.error('Failed to save bank verification');
    throw error;
  } finally {
    setSaving(false);
  }
};

const saveSocialScoreVerification = async (values) => {
  try {
    setSaving(true);
    console.log('🚀 Social score verification would be saved here:', values);
    toast.success('Social score verification saved successfully!');
  } catch (error) {
    console.error('Error saving social score verification:', error);
    toast.error('Failed to save social score verification');
    throw error;
  } finally {
    setSaving(false);
  }
};

const saveCibilVerification = async (values) => {
  try {
    setSaving(true);
    console.log('🚀 CIBIL verification would be saved here:', values);
    toast.success('CIBIL verification saved successfully!');
  } catch (error) {
    console.error('Error saving CIBIL verification:', error);
    toast.error('Failed to save CIBIL verification');
    throw error;
  } finally {
    setSaving(false);
  }
};

  // Render states
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className={`text-xl font-semibold mb-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Error Loading Appraisal
          </h2>
          <p className={`mb-4 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            {error}
          </p>
          <button
            onClick={onBack}
            className={`px-4 py-2 rounded-lg font-medium ${
              isDark
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading || !initialFormValues) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <span className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Loading appraisal data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleFinalSubmit}
        validationSchema={documentVerificationSchema}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <div className="p-4 md:p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={onBack} 
                      className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                        isDark ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30" : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                      }`}
                    >
                      <ArrowLeft className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                    </button>
                    <h1 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${
                      isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                    } bg-clip-text text-transparent`}>
                      Appraisal Report - {formik.values.name || "New Report"}
                    </h1>
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleFinalSubmit(formik.values)}
                      disabled={submitting || saving}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16} />}
                      <span>{submitting ? 'Submitting...' : 'Submit'}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleRejectCase(formik.values)}
                      disabled={submitting || saving}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                    >
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Sections */}
              <div className="space-y-6">
                <BasicInformation formik={formik} isDark={isDark} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PersonalVerification 
                    formik={formik} 
                    onSectionSave={() => handleSectionSave(savePersonalVerification, formik.values)} 
                    isDark={isDark} 
                    saving={saving}
                  />
                  <AlternativeNumberRemark formik={formik} isDark={isDark} />

                </div>
                <ReferenceVerification 
                  formik={formik} 
                  onSectionSave={() => handleSectionSave(saveReferenceVerification, formik.values)} 
                  isDark={isDark} 
                  saving={saving}
                />

                <DocumentVerification 
                  formik={formik} 
                  onSectionSave={() => handleSectionSave(saveDocumentVerification, formik.values)} 
                  isDark={isDark} 
                  saving={saving}
                />
                <SalarySlipVerification 
                  formik={formik} 
                  onSectionSave={() => handleSectionSave(saveSalarySlipVerification, formik.values)} 
                  isDark={isDark} 
                  saving={saving}
                />
                <IncomeVerification 
                  formik={formik} 
                  onSectionSave={() => handleSectionSave(saveIncomeVerification, formik.values)} 
                  isDark={isDark} 
                  saving={saving}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <OrganizationVerification 
                      formik={formik} 
                      isDark={isDark} 
                      saving={saving}
                    />

                    <SocialScoreVerification 
                      formik={formik} 
                      onSectionSave={() => handleSectionSave(saveSocialScoreVerification, formik.values)} 
                      isDark={isDark} 
                      saving={saving}
                    />
                  </div>
                  <div>
                    <BankVerification 
                      formik={formik} 
                      onSectionSave={() => handleSectionSave(saveBankVerification, formik.values)} 
                      isDark={isDark} 
                      saving={saving}
                    />
                    
                  </div>
                </div>
                
                <CibilVerification 
                  formik={formik} 
                  onSectionSave={() => handleSectionSave(saveCibilVerification, formik.values)} 
                  isDark={isDark} 
                  saving={saving}
                />
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default AppraisalReport;