"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { Formik } from 'formik';
import { ArrowLeft, Check, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast'; 
import { useThemeStore } from '@/lib/store/useThemeStore';

// Import services
import personalVerificationService from '@/lib/services/appraisal/personalVerificationService';
import { appraisalCoreService } from '@/lib/services/appraisal';
import { documentVerificationSchema } from '@/lib/schema/documentVerificationSchema';
import { salaryVerificationService } from '@/lib/services/appraisal';
import { bankVerificationService } from '@/lib/services/appraisal';



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
import { cibilVerificationService } from '@/lib/services/appraisal/cibilVerificationService';
import { organizationVerificationService } from '@/lib/services/appraisal/organizationVerificationService';
import { socialScoreVerificationService } from '@/lib/services/appraisal/socialScoreVerification';
import FinalReportSection from './FinalReportSection';

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
    userId: '',
    addressId: '',
    fatherName: '',
    currentAddress: '',
    permanentAddress: '',
    
    // Document Verification
    phoneNo: '', 
  aadharNo: '', 
  panNo: '', 
  personal_phone: '', 
  phone_status: '',   
  personal_pan: '',   
  pan_status: '',     
  personal_aadhar: '', 
  aadhar_status: '',  
  personal_ref_name: '',
  personal_ref_mobile: '',
  personal_ref_email: '',
  personal_ref_relation: '',
  personal_final_report: '',
    
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

    // Bank Verification Fields
  bankAutoVerification: '',
  bankAutoVerificationStatus: '',
  bankIsSalaryAccount: '',
  bankIsSalaryAccountStatus: '',
  bankSalaryCreditedRegular: '',
  bankSalaryCreditedRegularStatus: '',
  bankSalaryDate: '',
  bankAnyEmiDebited: '',
  bankEmiAmountInStatement: 0,
  bankIsEmiWithBankStatement: '',
  bankVerificationRemark: '',
  bankVerificationFinalReport: '', 
  bankSalaryCreditRemark: '',  
    
    
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
    totalEmiAsCibil: 0,
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
  const formatAppraisalData = (application, appraisal, references, householdincome) => {
    let familyMembers = [];
    
    // householdincome is passed as a separate parameter from the response root level
    const householdData = householdincome;
    
    if (householdData && householdData.length > 0) {
      familyMembers = householdData.map(income => ({
        unit: income.house_holder_family || '',
        natureOfWork: income.nature_of_work || '',
        contactNo: income.contact_no || '',
        annualIncome: income.annual_income || ''
      }));
    }

  // Load references from the nested references object in the API response
  const referencesData = references || application.references || appraisal.references || {};
  
  const savedReferences = Array(5).fill().map((_, index) => {
    const num = index + 1;
    // API returns refName1, refEmail1, refPhone1, etc. (without underscore)
    const name = referencesData[`refName${num}`] || '';
    const email = referencesData[`refEmail${num}`] || '';
    const phone = referencesData[`refPhone${num}`] || '';
    const relation = referencesData[`refRelation${num}`] || '';
    const verified = referencesData[`refVerify${num}`] === 1 || referencesData[`refVerify${num}`] === true;
    
    return {
      name: name || '',
      email: email || '',
      phone: phone || '',
      relation: relation || '',
      verified: verified || false
    };
  });
    
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
      
      // Personal Verification - store IDs needed for save
      userId: application.user_id || application.id || '',
      addressId: application.address_id || '',
      currentAddress: application.current_address || application.address || 'N/A',
      permanentAddress: application.permanent_address || application.address || 'N/A',
      
      // Document Verification
      phoneNo: application.phone || 'N/A',
    aadharNo: application.aadhar_no || 'N/A',
    panNo: application.pan_no || 'N/A',
    
    // Verification status - USE CORRECT FIELD NAMES:
    personal_phone: appraisal.personal_phone || '',
    phone_status: appraisal.phone_status || '',
    personal_pan: appraisal.personal_pan || '',
    pan_status: appraisal.pan_status || '',
    personal_aadhar: appraisal.personal_aadhar || '',
aadhar_status: appraisal.aadhar_status !== null && appraisal.aadhar_status !== undefined ? appraisal.aadhar_status : '',    
    // Reference verification - KEEP AS IS:
    personal_ref_name: appraisal.personal_ref_name === 'Yes' ? 'Yes' : '',
    personal_ref_mobile: appraisal.personal_ref_mobile === 'Yes' ? 'Yes' : '',
    personal_ref_email: appraisal.personal_ref_email === 'Yes' ? 'Yes' : '',
    personal_ref_relation: appraisal.personal_ref_relation === 'Yes' ? 'Yes' : '',
    personal_final_report: appraisal.personal_final_report || '',
      
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
       hrContactVerificationStatus: appraisal.contact_status || '',
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
      grossSalaryAmount: application.gross_monthly_salary || '',
      netSalaryAmount: application.net_monthly_salary || '',
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
      bankAutoVerification: appraisal.auto_verification || '',
    bankAutoVerificationStatus: appraisal.auto_verification_status || '',
    bankIsSalaryAccount: appraisal.is_salary_account || '',
    bankIsSalaryAccountStatus: appraisal.is_salary_account_status || '',
    bankSalaryCreditedRegular: appraisal.regural_interval || '',
    bankSalaryCreditedRegularStatus: appraisal.regural_interval_status || '',
    bankSalaryDate: appraisal.salary_date || '',
    bankAnyEmiDebited: appraisal.emi_debit || '',
    bankEmiAmountInStatement: parseFloat(appraisal.emi_amount) || 0,
    bankIsEmiWithBankStatement: appraisal.emi_with_bank_statement || '',
    bankVerificationRemark: appraisal.BankRemark || '',
    bankSalaryCreditRemark: appraisal.salary_remark || '',
    bankVerificationFinalReport: appraisal.bankstatement_final_report || '',
      
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
      
      // Other fields - ensure alternative numbers are strings (no padding for mobile numbers)
      alternateMobileNo1: appraisal.alternate_no1 ? String(appraisal.alternate_no1) : '',
      alternateMobileNo2: appraisal.alternate_no2 ? String(appraisal.alternate_no2) : '',
      remark: appraisal.PerRemark || '',
      salarySlipRemark: appraisal.SalaryRemark || '',
      // Final report should come from total_final_report, NOT personal_final_report
      finalReport: appraisal.total_final_report || '',

      // Additional data
      familyMembers: familyMembers,
      netHouseHoldIncome: application.net_house_hold_income || '',
      
      // Reference data for DocumentVerification display (from API)
      apiReferenceData: {
        name: application.ref_name || '',
        email: application.ref_email || '',
        phone: application.ref_mobile || '',
        relation: application.ref_relation || ''
      },
      
      // References for ReferenceVerification form (always empty - form only)
          additionalRefs: savedReferences,

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
    
    const response = await appraisalCoreService.getAppraisalReport(enquiry.id);
    
    if (!response?.success) {
      throw new Error(response?.message || 'Failed to fetch appraisal data');
    }

    const formattedData = formatAppraisalData(
      response.application || response.data?.application || {},
      response.appraisal || response.data?.appraisal || {},
      response.references || response.data?.references || {},
      response.householdincome || response.data?.householdincome || []
    );
    
    return formattedData;

  } catch (error) {
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
    const result = await saveFunction(values, additionalData);
    return result;
  } catch (error) {
    console.error('Error saving section:', error);
    return Promise.resolve();
  }
};

  const saveReferenceVerification = async (values) => {
    return personalVerificationService.saveReferences(values);
};

const saveDocumentVerification = async (values) => {
  if (!values.applicationId) {
    toast.error('Application ID is required for document verification');
    return Promise.resolve();
  }

  const documentData = {
    application_id: values.applicationId,
    ...values
  };

  return personalVerificationService.saveDocumentVerificationData(documentData);
};

// Save personal verification (father name, addresses)
const savePersonalVerification = async (values) => {
  if (!values.applicationId) {
    toast.error('Application ID is required');
    return Promise.resolve();
  }
  
  const personalData = {
    user_id: values.userId,
    address_id: values.addressId,
    father_name: values.fatherName,
    current_address: values.currentAddress,
    permanent_address: values.permanentAddress
  };
  
  return personalVerificationService.savePersonalInfo(personalData);
};

// Save household income (multiple family members)
const saveHouseholdIncome = async (familyMembers) => {
   return salaryVerificationService.saveHouseholdIncomes(enquiry.id, familyMembers);
};


// Save salary slip verification (for SalarySlipVerification component)
const saveSalarySlipVerification = async (values) => {
  if (values.salarySlipRemark) {
    const remarkData = {
      application_id: enquiry.id,
      remarks: values.salarySlipRemark
    };
    return salaryVerificationService.saveSalarySlipRemark(remarkData);
  }
};

//salary verification
const saveIncomeVerification = async (values, familyMembers) => {
  try {
    setSaving(true);
    
    // Save household income first
    if (familyMembers && familyMembers.length > 0) {
      const validMembers = familyMembers.filter(member => 
        member.unit && member.annualIncome && parseFloat(member.annualIncome) > 0
      );
      
      if (validMembers.length > 0) {
        await salaryVerificationService.saveHouseholdIncomes(enquiry.id, validMembers);
      }
    }
    
    // Calculate average monthly income
    const monthsEmployed = parseFloat(values.monthsOfEmployment) || 0;
    const selfReportedIncome = parseFloat(values.selfReportedMonthlyIncome) || 0;
    const averageMonthlyIncome = monthsEmployed > 0 ? (selfReportedIncome * monthsEmployed) / 12 : 0;
    
    // Save salary verification data
    const salaryVerificationData = {
      application_id: parseInt(enquiry.id),
      organization_applied: values.organizationSameAsApplied,
      organization_applied_status: values.organizationSameAsAppliedStatus,
      gross_amount_salary: values.grossAmountSalary,
      gross_amount_salary_status: values.grossAmountSalaryStatus,
      net_amount_salary: values.netAmountSalary,
      net_amount_salary_status: values.netAmountSalaryStatus,
      monthly_salary_date: values.salaryDate,
      avail_amenities: values.availabilityOfBasicAmenities || '',
      ava_assets: values.availabilityOfOtherAssets || '',
      primary_income: values.primarySourceOfIncome || '',
      nature_of_work: values.natureOfWork || '',
      frequency_income: values.frequencyOfIncome || '',
      month_employment_last_one_year: values.monthsOfEmployment || '0',
      self_reported_monthly_income: parseFloat(values.selfReportedMonthlyIncome) || 0,
      average_monthly_income: parseFloat(averageMonthlyIncome) || 0,
      salaryslip_final_report: values.incomeVerificationFinalReport
    };

    await salaryVerificationService.saveSalaryVerificationData(salaryVerificationData);
    
  } catch (error) {
    throw error;
  } finally {
    setSaving(false);
  }
};

const saveOrganizationVerification = async (values) => {
  const organizationData = organizationVerificationService.formatOrganizationVerificationData(
    enquiry.id,
    values
  );
  
  return organizationVerificationService.saveOrganizationVerificationData(organizationData);
};

const saveBankVerification = async (values) => {
  const bankVerificationData = bankVerificationService.formatBankVerificationData(
    enquiry.id,
    values
  );
  
  return bankVerificationService.saveBankVerificationData(bankVerificationData);
};

const saveSocialScoreVerification = async (values) => {
  const socialData = socialScoreVerificationService.formatSocialScoreVerificationData(
    enquiry.id,
    values
  );
  
  return socialScoreVerificationService.saveSocialScoreVerificationData(socialData);
};

const saveCibilVerification = async (values) => {
  const cibilData = cibilVerificationService.formatCibilVerificationData(
    enquiry.id,
    values
  );
  
  return cibilVerificationService.saveCibilVerificationData(cibilData);
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
                onSectionSave={(values, familyMembers) => handleSectionSave(saveIncomeVerification, values, familyMembers)} 
                isDark={isDark} 
                saving={saving}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <OrganizationVerification 
                      formik={formik} 
                      onSectionSave={() => handleSectionSave(saveOrganizationVerification, formik.values)} 
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
                {/* Final Report Section */}
              <FinalReportSection 
                formik={formik}
                onSubmit={handleFinalSubmit}
                onReject={handleRejectCase}
                isDark={isDark}
                submitting={submitting}
                saving={saving}
                applicationId={enquiry.id}
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