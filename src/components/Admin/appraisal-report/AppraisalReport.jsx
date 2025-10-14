"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { Formik } from 'formik';
import { ArrowLeft, Save, Check, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast'; 
import { useThemeStore } from '@/lib/store/useThemeStore';

// Import services
import { appraisalCoreService, personalInfoService, alternateNumbersService, referenceService, documentVerificationService, incomeVerificationService, organizationVerificationService, bankVerificationService, socialScoreService, cibilService } from '@/lib/services/appraisal';

// Import components
import BasicInformation from './BasicInfo';
import PersonalVerification from './PersonalVerification';
import DocumentVerification from './DocumentVerification';
import AlternativeNumberRemark from './AlternativeNumber';
import ReferenceVerification from './ReferenceVerification';
import OrganizationVerification from './OrganizationVerification';
import SocialScoreVerification from './SocialScroreVerification';
import IncomeVerification from './IncomeVerification';
import SalaryVerification from './SalaryVerification';
import CibilVerification from './CibilVerification';
import SalarySlipVerification from './SalarySlipVerification';
import BankVerification from './BankVerification';

const AppraisalReport = ({ enquiry, onBack }) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [appraisalData, setAppraisalData] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState(null);
  const [error, setError] = useState(null);

  // Define initialValues separately
  const initialValues = {
    // Basic Information
    name: '',
    crnNo: '',
    organizationName: '',
    loanAccountNo: '',
    state: '',
    city: '',
    ifscCode: '',
    accountDetails: '',
    phoneNo: '',
    
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
    hrPhoneVerificationStatus: '',
    hrPhoneVerificationMethod: '',
    companyWebsiteStatus: '',
    hrContactStatus: '',
    hrEmailVerificationStatus: '',
    hrEmailVerificationMethod: '',
    organizationFinalReport: '',
    
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
    incomeVerificationRemark: '',
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
    totalActiveLoans: '',
    activeLoanStatus: '',
    totalClosedLoans: '',
    closedLoanStatus: '',
    writeOffSettled: '',
    writeOffStatus: '',
    noOfOverdue: '',
    overdueStatus: '',
    totalEmiAsCibil: '',
    dpd: '',
    dpdStatus: '',
    emiStatus: '',
    cibilComment: '',
    cibilRemark: '',
    cibilFinalReport: '',
    
    // References (6 additional references)
    additionalRefs: Array(6).fill().map(() => ({
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
    finalReport: ''
  };

  // Improved data loading function
const loadAppraisalData = useCallback(async () => {
  console.log('🔍 Enquiry object:', enquiry);

  // Check if we have the basic enquiry data (wrong structure)
  if (enquiry && enquiry.id && !enquiry.application_id) {
    console.log('🔄 Using enquiry ID to fetch appraisal data:', enquiry.id);
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Making API call to /crm/appraisal/edit/' + enquiry.id);
      const response = await appraisalCoreService.getAppraisalReport(enquiry.id);
      
      console.log('🔍 API Response received, checking data...');
      console.log('📄 Response object:', response);
      
      if (!response) {
        console.error('❌ No response received');
        throw new Error('No data received from API');
      }
      
      // The API returns data directly, not wrapped in response.data
      if (!response.success && !response.application && !response.appraisal) {
        console.error('❌ API Response error:', response);
        throw new Error(response.message || 'Failed to fetch appraisal data');
      }

      console.log('✅ Appraisal data loaded successfully');
      setAppraisalData(response);
      
      const { application, appraisal } = response;
      console.log('📋 Application data structure:', application);
      console.log('📋 Appraisal data structure:', appraisal);
      
      // Create formatted data that matches initialValues structure
      const formattedData = {
        // Basic Information from application
        name: `${application.fname || ''} ${application.lname || ''}`.trim(),
        crnNo: application.crnno || '',
        organizationName: application.organisation_name || '',
        loanAccountNo: application.accountId || '',
        state: '',
        city: '',
        ifscCode: application.ifsc_code || '',
        accountDetails: application.account_no || '',
        phoneNo: application.phone || '',
        fatherName: application.fathername || '',
        aadharNo: application.aadhar_no || '',
        panNo: application.pan_no || '',
        
        // Personal Verification - Address fields from application
        currentAddress: application.current_address || application.address || '',
        permanentAddress: application.permanent_address || application.address || '',
        
        // Document Verification from appraisal
        phoneNoVerified: appraisal.personal_phone === "Yes",
        phoneNoStatus: appraisal.phone_status || '',
        aadharCardVerified: appraisal.personal_aadhar === "Yes",
        aadharCardStatus: appraisal.aadhar_status || '',
        panCardVerified: appraisal.personal_pan === "Yes",
        panCardStatus: appraisal.pan_status || '',
        
        // Organization fields
        organizationSameAsApplied: appraisal.organization_applied || '',
        organizationSameAsAppliedStatus: appraisal.organization_applied_status || '',
        organizationVerificationStatus: appraisal.online_verification || '',
        organizationVerificationMethod: appraisal.online_verification_status || '',
        companyPhoneVerificationStatus: appraisal.company_phone || '',
        companyPhoneVerificationMethod: appraisal.company_phone_status || '',
        hrPhoneVerificationStatus: appraisal.company_mobile || '',
        hrPhoneVerificationMethod: appraisal.company_mobile_status || '',
        hrContactStatus: appraisal.contact_status || '',
        hrEmailVerificationStatus: appraisal.hr_mail || '',
        hrEmailVerificationMethod: appraisal.hr_mail_status || '',
        organizationFinalReport: appraisal.organization_final_report || '',
        organizationRemark: appraisal.OrganizationRemark || '',
        
        // Income/Salary fields
        grossAmountSalary: appraisal.gross_amount_salary || '',
        grossAmountSalaryStatus: appraisal.gross_amount_salary_status || '',
        netAmountSalary: appraisal.net_amount_salary || '',
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
        totalActiveLoans: appraisal.total_active_amount || '',
        activeLoanStatus: appraisal.total_active_amount_status || '',
        totalClosedLoans: appraisal.total_closed_amount || '',
        closedLoanStatus: appraisal.total_closed_amount_status || '',
        writeOffSettled: appraisal.write_off_settled || '',
        writeOffStatus: appraisal.write_off_settled_status || '',
        noOfOverdue: appraisal.overdue || '',
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
        finalReport: appraisal.personal_final_report || '',

        // Initialize family members and household income data from application if available
        familyMembers: [],
        netHouseHoldIncome: application.net_house_hold_income || '',
        
        // References - populate from application data first, then any additional refs from appraisal
        additionalRefs: [
          // First reference from application
          {
            name: application.ref_name || '',
            email: application.ref_email || '',
            phone: application.ref_mobile || '',
            relation: application.ref_relation || '',
            verified: appraisal.personal_ref_name === 'Yes' || false
          },
          // Additional 5 references - initialize empty for now
          ...Array(5).fill().map(() => ({
            name: '',
            email: '',
            phone: '',
            relation: '',
            verified: false
          }))
        ]
      };

      console.log('📋 Formatted data ready:', formattedData);
      return formattedData;

    } catch (error) {
      console.error('❌ Error loading appraisal data:', error);
      console.log('🔄 Trying to use enquiry data directly as fallback');
      
      // Fallback: Use enquiry data directly if API fails
      const fallbackData = {
        // Basic Information from enquiry object
        name: `${enquiry.firstName || ''} ${enquiry.lastName || ''}`.trim(),
        crnNo: enquiry.crnNo || '',
        organizationName: enquiry.organizationName || '',
        loanAccountNo: enquiry.accountId || '',
        state: enquiry.state || '',
        city: enquiry.city || '',
        ifscCode: enquiry.ifscCode || '',
        accountDetails: enquiry.accountId || '',
        phoneNo: enquiry.phoneNo || '',
        fatherName: enquiry.fatherName || '',
        aadharNo: enquiry.aadharNo || '',
        panNo: enquiry.panNo || '',
        
        // Document Verification - default values for new appraisal
        phoneNoVerified: false,
        phoneNoStatus: '',
        aadharCardVerified: false,
        aadharCardStatus: '',
        panCardVerified: false,
        panCardStatus: '',
        
        // Initialize other fields with empty values
        organizationSameAsApplied: '',
        organizationSameAsAppliedStatus: '',
        organizationVerificationStatus: '',
        organizationVerificationMethod: '',
        companyPhoneVerificationStatus: '',
        companyPhoneVerificationMethod: '',
        hrPhoneVerificationStatus: '',
        hrPhoneVerificationMethod: '',
        hrContactStatus: '',
        hrEmailVerificationStatus: '',
        hrEmailVerificationMethod: '',
        organizationFinalReport: '',
        organizationRemark: '',
        
        // Income/Salary fields
        grossAmountSalary: '',
        grossAmountSalaryStatus: '',
        netAmountSalary: '',
        netAmountSalaryStatus: '',
        salaryDate: '',
        availabilityOfBasicAmenities: '',
        availabilityOfOtherAssets: '',
        primarySourceOfIncome: '',
        natureOfWork: '',
        frequencyOfIncome: '',
        monthsOfEmployment: '',
        selfReportedMonthlyIncome: '',
        averageMonthlyIncome: '',
        incomeVerificationFinalReport: '',
        incomeVerificationRemark: '',
        
        // Bank fields
        salaryAutoVerification: '',
        salaryAutoVerificationStatus: '',
        isSalaryAccount: '',
        isSalaryAccountStatus: '',
        salaryCreditedRegular: '',
        salaryCreditedRegularStatus: '',
        salaryAccountRemark: '',
        anyEmiDebited: '',
        salaryAmount: '',
        isEmiWithBankStatement: '',
        bankVerificationFinalReport: '',
        bankVerificationRemark: '',
        
        // Social Score fields
        socialScore: '',
        socialScoreRange: '',
        socialScoreRecommendation: '',
        socialScoreFinalReport: '',
        socialScoreRemark: '',
        
        // CIBIL fields
        cibilScore: '',
        cibilScoreStatus: '',
        totalActiveLoans: '',
        activeLoanStatus: '',
        totalClosedLoans: '',
        closedLoanStatus: '',
        writeOffSettled: '',
        writeOffStatus: '',
        noOfOverdue: '',
        overdueStatus: '',
        totalEmiAsCibil: '',
        cibilComment: '',
        dpd: '',
        dpdStatus: '',
        cibilFinalReport: '',
        cibilRemark: '',
        
        // Other fields
        alternateMobileNo1: '',
        alternateMobileNo2: '',
        remark: '',
        finalReport: '',

        // Ensure all arrays are properly initialized
        familyMembers: [],
        additionalRefs: Array(6).fill().map(() => ({
          name: '',
          email: '',
          phone: '',
          relation: '',
          verified: false
        }))
      };
      
      console.log('📋 Using fallback data:', fallbackData);
      toast.success('Creating new appraisal report with basic information');
      return fallbackData;
    } finally {
      setLoading(false);
    }
  }

  // If we have proper appraisal data structure
  if (enquiry?._fullApiResponse) {
    console.log('✅ Using stored API response');
    setAppraisalData(enquiry._fullApiResponse);
    
    const { application, appraisal } = enquiry._fullApiResponse;
    
    // Create formatted data that matches initialValues structure
    const formattedData = {
      // Basic Information from application
      name: `${application.fname || ''} ${application.lname || ''}`.trim(),
      crnNo: application.crnno || '',
      organizationName: application.organisation_name || '',
      loanAccountNo: application.accountId || '',
      state: '',
      city: '',
      ifscCode: application.ifsc_code || '',
      accountDetails: application.account_no || '',
      phoneNo: application.phone || '',
      fatherName: application.fathername || '',
      aadharNo: application.aadhar_no || '',
      panNo: application.pan_no || '',
      
      // Document Verification from appraisal
      phoneNoVerified: appraisal.personal_phone === "Yes",
      phoneNoStatus: appraisal.phone_status || '',
      aadharCardVerified: appraisal.personal_aadhar === "Yes",
      aadharCardStatus: appraisal.aadhar_status || '',
      panCardVerified: appraisal.personal_pan === "Yes",
      panCardStatus: appraisal.pan_status || '',
      
      // Organization fields
      organizationSameAsApplied: appraisal.organization_applied || '',
      organizationSameAsAppliedStatus: appraisal.organization_applied_status || '',
      organizationVerificationStatus: appraisal.online_verification || '',
      organizationVerificationMethod: appraisal.online_verification_status || '',
      companyPhoneVerificationStatus: appraisal.company_phone || '',
      companyPhoneVerificationMethod: appraisal.company_phone_status || '',
      hrPhoneVerificationStatus: appraisal.company_mobile || '',
      hrPhoneVerificationMethod: appraisal.company_mobile_status || '',
      hrContactStatus: appraisal.contact_status || '',
      hrEmailVerificationStatus: appraisal.hr_mail || '',
      hrEmailVerificationMethod: appraisal.hr_mail_status || '',
      organizationFinalReport: appraisal.organization_final_report || '',
      organizationRemark: appraisal.OrganizationRemark || '',
      
      // Income/Salary fields
      grossAmountSalary: appraisal.gross_amount_salary || '',
      grossAmountSalaryStatus: appraisal.gross_amount_salary_status || '',
      netAmountSalary: appraisal.net_amount_salary || '',
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
      totalActiveLoans: appraisal.total_active_amount || '',
      activeLoanStatus: appraisal.total_active_amount_status || '',
      totalClosedLoans: appraisal.total_closed_amount || '',
      closedLoanStatus: appraisal.total_closed_amount_status || '',
      writeOffSettled: appraisal.write_off_settled || '',
      writeOffStatus: appraisal.write_off_settled_status || '',
      noOfOverdue: appraisal.overdue || '',
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
      finalReport: appraisal.personal_final_report || '',

      // Ensure all arrays are properly initialized
      familyMembers: [],
      additionalRefs: Array(6).fill().map(() => ({
        name: '',
        email: '',
        phone: '',
        relation: '',
        verified: false
      }))
    };

    console.log('📋 Formatted data ready from stored response:', formattedData);
    return formattedData;
  }

  // If no valid data structure
  const errorMsg = 'Invalid enquiry data structure. Please check the data.';
  console.error('❌', errorMsg);
  setError(errorMsg);
  setLoading(false);
  return null;
}, [enquiry]);
  // Load data when component mounts
  useEffect(() => {
    if (!enquiry) {
      setError('No enquiry data provided');
      setLoading(false);
      return;
    }

    const initializeData = async () => {
      console.log('🚀 Initializing appraisal data...');
      const data = await loadAppraisalData();
      if (data) {
        console.log('✨ Setting initial form values with data:', data);
        setInitialFormValues(data);
      } else {
        console.log('⚠️ No data loaded, using empty initial values');
        setInitialFormValues(initialValues);
      }
    };

    initializeData();
  }, [loadAppraisalData, enquiry]);

  // Show error state
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

  // Show loading state
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

  

   const savePersonalVerification = async (values) => {
      try {
        console.log('💾 Saving personal verification with values:', values);
        setSaving(true);
        
        // Update personal info (father name and addresses)
        console.log('🚀 Calling updatePersonalInfo API...');
        await personalInfoService.updatePersonalInfo({
          user_id: enquiry.user_id,
          address_id: enquiry.address_id,
          father_name: values.fatherName,
          current_address: values.currentAddress,
          permanent_address: values.permanentAddress
        });
        console.log('✅ updatePersonalInfo API call successful');
  
        // Save personal remarks
        if (values.remark) {
          await personalInfoService.savePersonalRemarks({
            application_id: enquiry.id,
            remarks: values.remark
          });
        }

        // Save alternate numbers
        if (values.alternateMobileNo1) {
          await alternateNumbersService.saveAlternateNumber1({
            application_id: enquiry.id,
            alternate_no1: values.alternateMobileNo1
          });
        }

        if (values.alternateMobileNo2) {
          await alternateNumbersService.saveAlternateNumber2({
            application_id: enquiry.id,
            alternate_no2: values.alternateMobileNo2
          });
        }

        // Save personal final verification
        await personalInfoService.savePersonalFinalVerification({
          application_id: enquiry.id,
          personal_phone: values.phoneNoVerified ? "Yes" : "No",
          phone_status: values.phoneNoStatus,
          personal_pan: values.panCardVerified ? "Yes" : "No",
          pan_status: values.panCardStatus,
          personal_aadhar: values.aadharCardVerified ? "Yes" : "No",
          aadhar_status: values.aadharCardStatus,
          personal_ref_name: "Yes",
          personal_ref_mobile: "Yes",
          personal_ref_email: "Yes",
          personal_ref_relation: "Yes",
          personal_final_report: values.finalReport || "Positive"
        });
  
        toast.success('Personal verification saved successfully!');
      } catch (error) {
        console.error('Error saving personal verification:', error);
        toast.error('Failed to save personal verification');
        throw error;
      } finally {
        setSaving(false);
      }
    };

  const saveReferenceVerification = async (values) => {
      try {
        setSaving(true);
        
        const additionalRefsData = {
          application_id: enquiry.id,
          crnno: values.crnNo,
        };
  
        // Add up to 5 additional references
        values.additionalRefs.slice(0, 5).forEach((ref, index) => {
          const num = index + 1;
          if (ref.name || ref.email || ref.phone) {
            additionalRefsData[`add_ref_name_${num}`] = ref.name;
            additionalRefsData[`add_ref_email_${num}`] = ref.email;
            additionalRefsData[`add_ref_phone_${num}`] = ref.phone;
            additionalRefsData[`add_ref_relation_${num}`] = ref.relation;
            additionalRefsData[`add_ref_verify_${num}`] = ref.verified;
          }
        });
  
        await referenceService.saveAdditionalReferences(additionalRefsData);
        toast.success('Reference verification saved successfully!');
      } catch (error) {
        console.error('Error saving reference verification:', error);
        toast.error('Failed to save reference verification');
        throw error;
      } finally {
        setSaving(false);
      }
    };

  const saveIncomeVerification = async (values) => {
     try {
       setSaving(true);
       
       // Add household income if family members exist
       if (values.familyMembers && values.familyMembers.length > 0) {
         for (const member of values.familyMembers) {
           if (member.individualFamilyUnit && member.annualIncome) {
             await incomeVerificationService.addHouseHoldIncome({
               application_id: enquiry.id,
               house_holder_family: member.individualFamilyUnit,
               nature_of_work: member.natureOfWork,
               contact_no: member.contactNo,
               annual_income: parseFloat(member.annualIncome) || 0
             });
           }
         }
       }
 
       // Save salary verification
       await incomeVerificationService.saveSalaryVerification({
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
         self_reported_monthly_income: values.selfReportedMonthlyIncome,
         average_monthly_income: values.averageMonthlyIncome,
         salaryslip_final_report: values.incomeVerificationFinalReport
       });
 
       // Save salary remarks
       if (values.incomeVerificationRemark) {
         await incomeVerificationService.saveSalaryRemarks({
           application_id: enquiry.id,
           remarks: values.incomeVerificationRemark
         });
       }
 
       toast.success('Income verification saved successfully!');
     } catch (error) {
       console.error('Error saving income verification:', error);
       toast.error('Failed to save income verification');
       throw error;
     } finally {
       setSaving(false);
     }
   };

   const saveOrganizationVerification = async (values) => {
      try {
        setSaving(true);
        
        // Save organization remarks
        if (values.organizationRemark) {
          await organizationVerificationService.saveOrganizationRemarks({
            application_id: enquiry.id,
            remarks: values.organizationRemark
          });
        }
  
        // Save organization verification
        await organizationVerificationService.saveOrganizationVerification({
          application_id: enquiry.id,
          online_verification: values.organizationVerificationStatus,
          online_verification_status: values.organizationVerificationMethod,
          company_phone: values.companyPhoneVerificationStatus,
          company_phone_status: values.companyPhoneVerificationMethod,
          company_mobile: values.hrPhoneVerificationStatus,
          company_mobile_status: values.hrPhoneVerificationMethod,
          contact_status: values.hrContactStatus,
          hr_mail: values.hrEmailVerificationStatus,
          hr_mail_status: values.hrEmailVerificationMethod,
          organization_final_report: values.organizationFinalReport
        });
  
        toast.success('Organization verification saved successfully!');
      } catch (error) {
        console.error('Error saving organization verification:', error);
        toast.error('Failed to save organization verification');
        throw error;
      } finally {
        setSaving(false);
      }
    };

   const saveBankVerification = async (values) => {
     try {
       setSaving(true);
       
       // Save bank remarks
       if (values.bankVerificationRemark) {
         await bankVerificationService.saveBankRemarks({
           application_id: enquiry.id,
           remarks: values.bankVerificationRemark
         });
       }
 
       // Save bank verification
       await bankVerificationService.saveBankVerification({
         application_id: enquiry.id,
         auto_verification: values.salaryAutoVerification,
         auto_verification_status: values.salaryAutoVerificationStatus,
         is_salary_account: values.isSalaryAccount,
         is_salary_account_status: values.isSalaryAccountStatus,
         regural_interval: values.salaryCreditedRegular,
         regural_interval_status: values.salaryCreditedRegularStatus,
         salary_date: values.salaryDate,
         salary_remark: values.salaryAccountRemark,
         emi_debit: values.anyEmiDebited,
         emi_amount: values.salaryAmount,
         emi_with_bank_statement: values.isEmiWithBankStatement,
         bankstatement_final_report: values.bankVerificationFinalReport
       });
 
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
        
        // Save social remarks
        if (values.socialScoreRemark) {
          await socialScoreService.saveSocialRemarks({
            application_id: enquiry.id,
            remarks: values.socialScoreRemark
          });
        }

        // Save social verification
        await socialScoreService.saveSocialVerification({
          application_id: enquiry.id,
          social_score: values.socialScore,
          social_score_status: values.socialScoreRange,
          social_score_suggestion: values.socialScoreRecommendation,
          socialscore_final_report: values.socialScoreFinalReport
        });
  
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
        
        // Save CIBIL remarks
        if (values.cibilRemark) {
          await cibilService.saveCibilRemarks({
            application_id: enquiry.id,
            remarks: values.cibilRemark
          });
        }

        // Save CIBIL verification
        await cibilService.saveCibilVerification({
          application_id: enquiry.id,
          cibil_score: values.cibilScore,
          score_status: values.cibilScoreStatus,
          total_active_amount: values.totalActiveLoans,
          total_active_amount_status: values.activeLoanStatus,
          total_closed_amount: values.totalClosedLoans,
          total_closed_amount_status: values.closedLoanStatus,
          write_off_settled: values.writeOffSettled,
          write_off_settled_status: values.writeOffStatus,
          overdue: values.noOfOverdue,
          overdue_status: values.overdueStatus,
          total_emi_cibil: values.totalEmiAsCibil,
          comment: values.cibilComment,
          dpd: values.dpd,
          dpd_status: values.dpdStatus,
          cibil_final_report: values.cibilFinalReport
        });
  
        toast.success('CIBIL verification saved successfully!');
      } catch (error) {
        console.error('Error saving CIBIL verification:', error);
        toast.error('Failed to save CIBIL verification');
        throw error;
      } finally {
        setSaving(false);
      }
    };

  const handleFinalSubmit = async (values) => {
      try {
        setSubmitting(true);
        
        // Save final verification
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

  const handleSectionSave = async (saveFunction, values) => {
    try {
      await saveFunction(values);
    } catch (error) {
    }
  };

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

  // Show loading state
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
        enableReinitialize={true}
      >
        {(formik) => {
          console.log('🎯 Current formik values:', formik.values);

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

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleFinalSubmit(formik.values)}
                      disabled={submitting || saving}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
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

              {/* Rest of your form sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <BasicInformation 
                    formik={formik} 
                    isDark={isDark} 
                  />
                  
                  <PersonalVerification 
                    formik={formik} 
                    onSectionSave={() => handleSectionSave(savePersonalVerification, formik.values)} 
                    isDark={isDark} 
                    saving={saving}
                  />
                </div>

                <div className="space-y-6">
                  <DocumentVerification 
                    formik={formik} 
                    isDark={isDark} 
                  />
                  <AlternativeNumberRemark 
                    formik={formik} 
                    isDark={isDark} 
                  />
                </div>
              </div>

              <ReferenceVerification 
                formik={formik} 
                onSectionSave={() => handleSectionSave(saveReferenceVerification, formik.values)} 
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
                    onSectionSave={() => handleSectionSave(saveOrganizationVerification, formik.values)} 
                    isDark={isDark} 
                    saving={saving}
                  />
                  <SalarySlipVerification 
                    formik={formik} 
                    isDark={isDark} 
                  />
                </div>
                <div>
                  <BankVerification 
                    formik={formik} 
                    onSectionSave={() => handleSectionSave(saveBankVerification, formik.values)} 
                    isDark={isDark} 
                    saving={saving}
                  />
                  <SalaryVerification 
                    formik={formik} 
                    isDark={isDark} 
                  />
                  <SocialScoreVerification 
                    formik={formik} 
                    onSectionSave={() => handleSectionSave(saveSocialScoreVerification, formik.values)} 
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
          );
        }}
      </Formik>
    </div>
  );
};

export default AppraisalReport;