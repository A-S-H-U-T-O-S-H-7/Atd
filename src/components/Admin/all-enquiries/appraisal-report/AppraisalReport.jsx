"use client"
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { ArrowLeft, Save, Check, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { appraisalAPI } from '@/lib/api';
import { toast } from 'react-hot-toast'; 
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
  const { isDark } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [appraisalData, setAppraisalData] = useState(null);
  
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
    aadharVerificationLink: '',
    aadharPanLinkStatus: '',
    panCardVerified: false,
    panCardStatus: '',
    panNo: '',
    panVerificationLink: '',
    
    // Bank Verification fields
    firstBankName: '',
    firstBankStatement: null,
    secondBankName: '',
    secondBankStatement: null,
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
    grossAmountSalaryVerified: '',
    grossAmountSalaryStatus: '',
    netAmountSalary: '',
    netAmountSalaryVerified: '',
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

  // Section-specific save functions with API integration
  const savePersonalVerification = async (values) => {
    try {
      setSaving(true);
      
      // First update personal info (father name and addresses)
      await appraisalAPI.updatePersonalInfo({
        user_id: enquiry.user_id,
        address_id: enquiry.address_id,
        father_name: values.fatherName,
        current_address: values.currentAddress,
        permanent_address: values.permanentAddress
      });

      // Save personal remarks
      if (values.remark) {
        await appraisalAPI.savePersonalRemarks({
          application_id: enquiry.application_id,
          remarks: values.remark
        });
      }

      // Save alternate numbers
      if (values.alternateMobileNo1) {
        await appraisalAPI.saveAlternateNumber1({
          application_id: enquiry.application_id,
          alternate_no1: values.alternateMobileNo1
        });
      }

      if (values.alternateMobileNo2) {
        await appraisalAPI.saveAlternateNumber2({
          application_id: enquiry.application_id,
          alternate_no2: values.alternateMobileNo2
        });
      }

      // Save personal final verification
      await appraisalAPI.savePersonalFinalVerification({
        application_id: enquiry.application_id,
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
    } finally {
      setSaving(false);
    }
  };

  const saveReferenceVerification = async (values) => {
    try {
      setSaving(true);
      
      // Prepare additional references data
      const additionalRefsData = {
        application_id: enquiry.application_id,
        crnno: values.crnNo,
      };

      // Add up to 5 additional references (API supports 1-5)
      values.additionalRefs.slice(0, 5).forEach((ref, index) => {
        const num = index + 1;
        additionalRefsData[`add_ref_name_${num}`] = ref.name;
        additionalRefsData[`add_ref_email_${num}`] = ref.email;
        additionalRefsData[`add_ref_phone_${num}`] = ref.phone;
        additionalRefsData[`add_ref_relation_${num}`] = ref.relation;
        additionalRefsData[`add_ref_verify_${num}`] = ref.verified;
      });

      await appraisalAPI.saveAdditionalReferences(additionalRefsData);
      toast.success('Reference verification saved successfully!');
    } catch (error) {
      console.error('Error saving reference verification:', error);
      toast.error('Failed to save reference verification');
    } finally {
      setSaving(false);
    }
  };

  const saveIncomeVerification = async (values) => {
    try {
      setSaving(true);
      
      // Add household income if family members exist
      if (values.familyMembers.length > 0) {
        for (const member of values.familyMembers) {
          await appraisalAPI.addHouseHoldIncome({
            application_id: enquiry.application_id,
            house_holder_family: member.relation,
            nature_of_work: member.occupation,
            contact_no: member.phone,
            annual_income: member.income
          });
        }
      }

      // Save salary verification
      await appraisalAPI.saveSalaryVerification({
        application_id: enquiry.application_id,
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
        await appraisalAPI.saveSalaryRemarks({
          application_id: enquiry.application_id,
          remarks: values.incomeVerificationRemark
        });
      }

      toast.success('Income verification saved successfully!');
    } catch (error) {
      console.error('Error saving income verification:', error);
      toast.error('Failed to save income verification');
    } finally {
      setSaving(false);
    }
  };

  const saveOrganizationVerification = async (values) => {
    try {
      setSaving(true);
      
      // Save organization remarks
      if (values.organizationRemark) {
        await appraisalAPI.saveOrganizationRemarks({
          application_id: enquiry.application_id,
          remarks: values.organizationRemark
        });
      }

      // Save organization verification
      await appraisalAPI.saveOrganizationVerification({
        application_id: enquiry.application_id,
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
    } finally {
      setSaving(false);
    }
  };

  const saveBankVerification = async (values) => {
    try {
      setSaving(true);
      
      // Save bank remarks
      if (values.bankVerificationRemark) {
        await appraisalAPI.saveBankRemarks({
          application_id: enquiry.application_id,
          remarks: values.bankVerificationRemark
        });
      }

      // Save bank verification
      await appraisalAPI.saveBankVerification({
        application_id: enquiry.application_id,
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
    } finally {
      setSaving(false);
    }
  };

  const saveSocialScoreVerification = async (values) => {
    try {
      setSaving(true);
      
      // Save social remarks
      if (values.socialScoreRemark) {
        await appraisalAPI.saveSocialRemarks({
          application_id: enquiry.application_id,
          remarks: values.socialScoreRemark
        });
      }

      // Save social verification
      await appraisalAPI.saveSocialVerification({
        application_id: enquiry.application_id,
        social_score: values.socialScore,
        social_score_status: values.socialScoreRange,
        social_score_suggestion: values.socialScoreRecommendation,
        socialscore_final_report: values.socialScoreFinalReport
      });

      toast.success('Social score verification saved successfully!');
    } catch (error) {
      console.error('Error saving social score verification:', error);
      toast.error('Failed to save social score verification');
    } finally {
      setSaving(false);
    }
  };

  const saveCibilVerification = async (values) => {
    try {
      setSaving(true);
      
      // Save CIBIL remarks
      if (values.cibilRemark) {
        await appraisalAPI.saveCibilRemarks({
          application_id: enquiry.application_id,
          remarks: values.cibilRemark
        });
      }

      // Save CIBIL verification
      await appraisalAPI.saveCibilVerification({
        application_id: enquiry.application_id,
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
    } finally {
      setSaving(false);
    }
  };

  const handleFinalSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // Save final verification
      await appraisalAPI.saveFinalVerification({
        application_id: enquiry.application_id,
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
      
      await appraisalAPI.rejectCase({
        application_id: enquiry.application_id,
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

  if (loading) {
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
        initialValues={initialValues}
        onSubmit={handleFinalSubmit}
        enableReinitialize={true}
      >
        {(formik) => {
          // Load appraisal data and populate form
          const loadAppraisalData = async () => {
            try {
              setLoading(true);
              const response = await appraisalAPI.getAppraisalReport(enquiry.application_id);
              console.log('🔍 FULL API RESPONSE:', response);
    console.log('🔍 RESPONSE DATA:', response.data);
              
              if (response.data.success) {
                setAppraisalData(response.data);
                const { application, appraisal } = response.data;

                 console.log('🔍 APPLICATION DATA:', application);
      console.log('🔍 APPRAISAL DATA:', appraisal);
      console.log('🔍 Name parts:', {
        fname: application.fname,
        lname: application.lname,
        combined: `${application.fname} ${application.lname}`.trim()
      });

      
                
                // Populate form with API data
                formik.setValues({
                  ...formik.values,
                  // Basic Information from application
                  name: `${application.fname} ${application.lname}`.trim(),
                  crnNo: application.crnno,
                  organizationName: application.organisation_name,
                  loanAccountNo: application.accountId,
                  state: application.currentState || '',
                  city: application.currentCity || '',
                  ifscCode: application.ifsc_code,
                  accountDetails: application.account_no,
                  phoneNo: application.phone,
                  fatherName: application.fathername,
                  aadharNo: application.aadhar_no,
                  panNo: application.pan_no,
                  
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
                  finalReport: appraisal.personal_final_report || ''
                });
              }
            } catch (error) {
              console.error('Error loading appraisal data:', error);
              toast.error('Failed to load appraisal data');
            } finally {
              setLoading(false);
            }
          };

          // Load data when component mounts or enquiry changes
          useEffect(() => {
            if (enquiry?.application_id) {
              loadAppraisalData();
            }
          }, [enquiry?.application_id]);

          // Initialize form data from enquiry when component mounts (fallback)
          useEffect(() => {
            if (enquiry && !appraisalData) {
              formik.setValues({
                ...formik.values,
                name: enquiry.fname + " " + enquiry.lname || "",
                crnNo: enquiry.crnno || "",
                organizationName: enquiry.organisation_name || "",
                state: enquiry.currentState || "",
                city: enquiry.currentCity || "",
                accountDetails: enquiry.account_no || "",
                phoneNo: enquiry.phone || "",
                fatherName: enquiry.fathername || "",
                aadharNo: enquiry.aadhar_no || "",
                panNo: enquiry.pan_no || "",
                ifscCode: enquiry.ifsc_code || "",
                loanAccountNo: enquiry.accountId || ""
              });
            }
          }, [enquiry, appraisalData]);

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
                      disabled={submitting}
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
                      disabled={submitting}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                    >
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Sections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <BasicInformation 
                    formik={formik} 
                    onSectionSave={() => {}} 
                    isDark={isDark} 
                  />
                  
                  <PersonalVerification 
                    formik={formik} 
                    onSectionSave={() => savePersonalVerification(formik.values)} 
                    isDark={isDark} 
                    saving={saving}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <DocumentVerification 
                    formik={formik} 
                    onSectionSave={() => {}} 
                    isDark={isDark} 
                  />
                  <AlternativeNumberRemark 
                    formik={formik} 
                    onSectionSave={() => {}} 
                    isDark={isDark} 
                  />
                </div>
              </div>

              <ReferenceVerification 
                formik={formik} 
                onSectionSave={() => saveReferenceVerification(formik.values)} 
                isDark={isDark} 
                saving={saving}
              />
              
              <IncomeVerification 
                formik={formik} 
                onSectionSave={() => saveIncomeVerification(formik.values)} 
                isDark={isDark} 
                saving={saving}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <OrganizationVerification 
                    formik={formik} 
                    onSectionSave={() => saveOrganizationVerification(formik.values)} 
                    isDark={isDark} 
                    saving={saving}
                  />
                  <SalarySlipVerification 
                    formik={formik} 
                    onSectionSave={() => {}} 
                    isDark={isDark} 
                  />
                </div>
                <div>
                  <BankVerification 
                    formik={formik} 
                    onSectionSave={() => saveBankVerification(formik.values)} 
                    isDark={isDark} 
                    saving={saving}
                  />
                  <SalaryVerification 
                    formik={formik} 
                    onSectionSave={() => {}} 
                    isDark={isDark} 
                  />
                  <SocialScoreVerification 
                    formik={formik} 
                    onSectionSave={() => saveSocialScoreVerification(formik.values)} 
                    isDark={isDark} 
                    saving={saving}
                  />
                </div>
              </div>
              
              <CibilVerification 
                formik={formik} 
                onSectionSave={() => saveCibilVerification(formik.values)} 
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