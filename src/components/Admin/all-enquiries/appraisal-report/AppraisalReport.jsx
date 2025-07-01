"use client"
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { useAdminAuth } from '@/lib/AdminAuthContext';
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
    
    //References (6 more sets)
    additionalRefs: Array(6).fill().map(() => ({
      name: '',
      email: '',
      phone: '',
      relation: '',
      verified: false
    })),
    
    // Other fields
    alternateMobileNo: '',
    remark: '',
    finalReport: ''
  };

  // Section-specific save functions
  const saveBasicInformation = async (values) => {
    const basicInfoData = {
      name: values.name,
      crnNo: values.crnNo,
      organizationName: values.organizationName,
      loanAccountNo: values.loanAccountNo,
      state: values.state,
      city: values.city,
      ifscCode: values.ifscCode,
      accountDetails: values.accountDetails,
      phoneNo:values.phoneNo,
    };
    
    try {
      console.log('Saving Basic Information:', basicInfoData);
      // API call: await saveBasicInfoAPI(enquiry.id, basicInfoData);
      alert('Basic Information saved successfully!');
    } catch (error) {
      console.error('Error saving basic information:', error);
      alert('Error saving basic information');
    }
  };

  const savePersonalVerification = async (values) => {
    const personalData = {
      fatherName: values.fatherName,
      currentAddress: values.currentAddress,
      permanentAddress: values.permanentAddress,
      alternateMobileNo: values.alternateMobileNo
    };
    
    try {
      console.log('Saving Personal Verification:', personalData);
      // API call: await savePersonalVerificationAPI(enquiry.id, personalData);
      alert('Personal Verification saved successfully!');
    } catch (error) {
      console.error('Error saving personal verification:', error);
      alert('Error saving personal verification');
    }
  };

  const saveReferenceVerification = async (values) => {
    const referenceData = {
      additionalRefs: values.additionalRefs
    };
    
    try {
      console.log('Saving Reference Verification:', referenceData);
      // API call: await saveReferenceVerificationAPI(enquiry.id, referenceData);
      alert('Reference Verification saved successfully!');
    } catch (error) {
      console.error('Error saving reference verification:', error);
      alert('Error saving reference verification');
    }
  };

  const saveDocumentVerification = async (values) => {
    const documentData = {
      phoneNoVerified: values.phoneNoVerified,
      phoneNoStatus: values.phoneNoStatus,
      aadharCardVerified: values.aadharCardVerified,
      aadharCardStatus: values.aadharCardStatus,
      aadharNo: values.aadharNo,
      aadharVerificationLink: values.aadharVerificationLink,
      aadharPanLinkStatus: values.aadharPanLinkStatus,
      panCardVerified: values.panCardVerified,
      panCardStatus: values.panCardStatus,
      panNo: values.panNo,
      panVerificationLink: values.panVerificationLink,


    };
    
    try {
      console.log('Saving Document Verification:', documentData);
      // API call: await saveDocumentVerificationAPI(enquiry.id, documentData);
      alert('Document Verification saved successfully!');
    } catch (error) {
      console.error('Error saving document verification:', error);
      alert('Error saving document verification');
    }
  };

  const saveOrganizationVerification = async (values) => {
    const organizationData = {
      organizationRemark: values.organizationRemark,
      organizationContactName: values.organizationContactName,
      organizationVerificationStatus: values.organizationVerificationStatus,
      organizationVerificationMethod: values.organizationVerificationMethod,
      companyPhoneVerificationStatus: values.companyPhoneVerificationStatus,
      companyPhoneVerificationMethod: values.companyPhoneVerificationMethod,
      hrPhoneVerificationStatus: values.hrPhoneVerificationStatus,
      hrPhoneVerificationMethod: values.hrPhoneVerificationMethod,
      companyWebsiteStatus: values.companyWebsiteStatus,
      hrContactStatus: values.hrContactStatus,
      hrEmailVerificationStatus: values.hrEmailVerificationStatus,
      hrEmailVerificationMethod: values.hrEmailVerificationMethod,
      organizationFinalReport: values.organizationFinalReport,
    };
    
    try {
      console.log('Saving Organization Verification:', organizationData);
      // API call: await saveOrganizationVerificationAPI(enquiry.id, organizationData);
      alert('Organization Verification saved successfully!');
    } catch (error) {
      console.error('Error saving organization verification:', error);
      alert('Error saving organization verification');
    }
  };

  const saveIncomeVerification = async (values) => {
    const incomeData = {
      organizationSameAsApplied: values.organizationSameAsApplied,
      organizationSameAsAppliedStatus: values.organizationSameAsAppliedStatus,
      grossAmountSalary: values.grossAmountSalary,
      grossAmountSalaryVerified: values.grossAmountSalaryVerified,
      grossAmountSalaryStatus: values.grossAmountSalaryStatus,
      netAmountSalary: values.netAmountSalary,
      netAmountSalaryVerified: values.netAmountSalaryVerified,
      netAmountSalaryStatus: values.netAmountSalaryStatus,
      salaryDate: values.salaryDate,
      netHouseHoldIncome: values.netHouseHoldIncome,
      familyMembers: values.familyMembers,
      totalHouseHoldIncome: values.totalHouseHoldIncome,
      availabilityOfBasicAmenities: values.availabilityOfBasicAmenities,
      availabilityOfOtherAssets: values.availabilityOfOtherAssets,
      primarySourceOfIncome: values.primarySourceOfIncome,
      natureOfWork: values.natureOfWork,
      frequencyOfIncome: values.frequencyOfIncome,
      monthsOfEmployment: values.monthsOfEmployment,
      selfReportedMonthlyIncome: values.selfReportedMonthlyIncome,
      averageMonthlyIncome: values.averageMonthlyIncome,
      incomeVerificationRemark: values.incomeVerificationRemark,
      incomeVerificationFinalReport: values.incomeVerificationFinalReport,
    };
    
    try {
      console.log('Saving Income Verification:', incomeData);
      // API call: await saveIncomeVerificationAPI(enquiry.id, incomeData);
      alert('Income Verification saved successfully!');
    } catch (error) {
      console.error('Error saving income verification:', error);
      alert('Error saving income verification');
    }
  };
  const saveSalaryVerification = async (values) => {
    const salaryData = {
      salaryAutoVerification: values.salaryAutoVerification,
      salaryAutoVerificationStatus: values.salaryAutoVerificationStatus,
      salaryCreditedRegular: values.salaryCreditedRegular,
      salaryCreditedRegularStatus: values.salaryCreditedRegularStatus,
      salaryInterval: values.salaryInterval,
      anyEmiDebited: values.anyEmiDebited,
      isEmiWithBankStatement: values.isEmiWithBankStatement,
      isSalaryAccount: values.isSalaryAccount,
      isSalaryAccountStatus: values.isSalaryAccountStatus,
      salaryAccountRemark: values.salaryAccountRemark,
      salaryAmount: values.salaryAmount,
      salaryVerificationRemark: values.salaryVerificationRemark,
      salaryVerificationFinalReport: values.salaryVerificationFinalReport,
    };
    
    try {
      console.log('Saving Salary Verification:', salaryData);
      // API call: await saveSalaryVerificationAPI(enquiry.id, salaryData);
      alert('Salary Verification saved successfully!');
    } catch (error) {
      console.error('Error saving salary verification:', error);
      alert('Error saving salary verification');
    }
  };

  const saveCibilVerification = async (values) => {
    const cibilData = {
      cibilScore: values.cibilScore,
      cibilScoreStatus: values.cibilScoreStatus,
      totalActiveLoans: values.totalActiveLoans,
      activeLoanStatus: values.activeLoanStatus,
      totalClosedLoans: values.totalClosedLoans,
      closedLoanStatus: values.closedLoanStatus,
      writeOffSettled: values.writeOffSettled,
      writeOffStatus: values.writeOffStatus,
      noOfOverdue: values.noOfOverdue,
      overdueStatus: values.overdueStatus,
      totalEmiAsCibil: values.totalEmiAsCibil,
      dpd: values.dpd,
      dpdStatus: values.dpdStatus,
      emiStatus: values.emiStatus,
      cibilComment: values.cibilComment,
      cibilRemark: values.cibilRemark,
      cibilFinalReport: values.cibilFinalReport,
    };
    
    try {
      console.log('Saving CIBIL Verification:', cibilData);
      // API call: await saveCibilVerificationAPI(enquiry.id, cibilData);
      alert('CIBIL Verification saved successfully!');
    } catch (error) {
      console.error('Error saving CIBIL verification:', error);
      alert('Error saving CIBIL verification');
    }
  };
  const saveSalarySlipVerification = async (values) => {
    const salarySlipData = {
      salarySlipRemark: values.salarySlipRemark,
    };
    
    try {
      console.log('Saving Salary Slip Verification:', salarySlipData);
      // API call: await saveSalarySlipVerificationAPI(enquiry.id, salarySlipData);
      alert('Salary Slip Verification saved successfully!');
    } catch (error) {
      console.error('Error saving salary slip verification:', error);
      alert('Error saving salary slip verification');
    }
  };

  const saveBankVerification = async (values) => {
    const bankData = {
      firstBankName: values.firstBankName,
      firstBankStatement: values.firstBankStatement,
      secondBankName: values.secondBankName,
      secondBankStatement: values.secondBankStatement,
      bankVerificationRemark: values.bankVerificationRemark,
      bankVerificationFinalReport: values.bankVerificationFinalReport,
    };
    
    try {
      console.log('Saving Bank Verification:', bankData);
      // API call: await saveBankVerificationAPI(enquiry.id, bankData);
      alert('Bank Verification saved successfully!');
    } catch (error) {
      console.error('Error saving bank verification:', error);
      alert('Error saving bank verification');
    }
  };

  const saveSocialScoreVerification = async (values) => {
    const socialScoreData = {
      socialScore: values.socialScore,
      socialScoreRange: values.socialScoreRange,
      socialScoreRecommendation: values.socialScoreRecommendation,
      socialScoreRemark: values.socialScoreRemark,
      socialScoreFinalReport: values.socialScoreFinalReport,
    };
    
    try {
      console.log('Saving Social Score Verification:', socialScoreData);
      // API call: await saveSocialScoreVerificationAPI(enquiry.id, socialScoreData);
      alert('Social Score Verification saved successfully!');
    } catch (error) {
      console.error('Error saving social score verification:', error);
      alert('Error saving social score verification');
    }
  };

  
  const handleFinalSave = async (values) => {
    try {
      console.log('Final Save - All Data:', values);
      // API call: await saveCompleteAppraisalReport(enquiry.id, values);
      alert('Complete report saved successfully!');
    } catch (error) {
      console.error('Error saving complete report:', error);
      alert('Error saving complete report');
    }
  };

  const handleFinalSubmit = async (values) => {
    try {
      console.log('Final Submit - All Data:', values);
      // API call: await submitAppraisalReport(enquiry.id, values);
      alert('Report submitted successfully!');
      onBack();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report');
    }
  };

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
          // Initialize form data from enquiry when component mounts
          useEffect(() => {
            if (enquiry) {
              formik.setValues({
                ...formik.values,
                name: enquiry.name || "",
                crnNo: enquiry.crnNo || "",
                organizationName: enquiry.organizationName || "",
                state: enquiry.currentState || "",
                city: enquiry.currentCity || "",
                accountDetails: enquiry.accountDetails || "",
                currentAddress: enquiry.currentAddress || "",
                phoneNoVerified: enquiry.phoneNoVerified || false,
                aadharNo: enquiry.aadharNo || "",
                panNo: enquiry.panNo || "",
                phoneNo: enquiry.phoneNo || "",
                refName: enquiry.refName || "",
                refMobile: enquiry.refMobile || "",
                refEmail: enquiry.refEmail || "",
                refRelation: enquiry.refRelation || "",
                refMobileVerified:enquiry.refMobileVerified || false,
                refEmailVerified:enquiry.refEmailVerified || false,
                refRelationVerified:enquiry.refRelationVerified || false
              });
            }
          }, [enquiry]);

          return <div className="p-4 md:p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button onClick={onBack} className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30" : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"}`}>
                      <ArrowLeft className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                    </button>
                    <h1 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"} bg-clip-text text-transparent`}>
                      Appraisal Report - {formik.values.name || "New Report"}
                    </h1>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button onClick={() => handleFinalSave(formik.values)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm">
                      <Save size={16} />
                      <span>Save All</span>
                    </button>
                    <button onClick={() => handleFinalSubmit(formik.values)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm">
                      <Check size={16} />
                      <span>Submit</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Sections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <BasicInformation formik={formik} onSectionSave={() => saveBasicInformation(formik.values)} isDark={isDark} />
                  <PersonalVerification formik={formik} onSectionSave={() => savePersonalVerification(formik.values)} isDark={isDark} />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <DocumentVerification formik={formik} onSectionSave={() => saveDocumentVerification(formik.values)} isDark={isDark} />

                  <AlternativeNumberRemark formik={formik} onSectionSave={() => {
                      // This handles the auto-save for remark
                      console.log("Auto-saving remark:", formik.values.remark);
                      // Your auto-save API call here
                    }} isDark={isDark} />
                </div>
              </div>
              <ReferenceVerification formik={formik} onSectionSave={() => saveReferenceVerification(formik.values)} isDark={isDark} />
              <IncomeVerification formik={formik} onSectionSave={() => saveIncomeVerification(formik.values)} isDark={isDark} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <OrganizationVerification formik={formik} onSectionSave={() => saveOrganizationVerification(formik.values)} isDark={isDark} />
                  <SalarySlipVerification formik={formik} onSectionSave={() => saveSalarySlipVerification(formik.values)} isDark={isDark} />

                </div>
                <div>
                <BankVerification formik={formik} onSectionSave={() => saveBankVerification(formik.values)} isDark={isDark} />

                  <SalaryVerification formik={formik} onSectionSave={() => saveSalaryVerification(formik.values)} isDark={isDark} />
                  <SocialScoreVerification formik={formik} onSectionSave={() => saveSocialScoreVerification(formik.values)} isDark={isDark} />
                </div>
                
              </div>
              <CibilVerification formik={formik} onSectionSave={() => saveCibilVerification(formik.values)} isDark={isDark} />
            </div>;
        }}
      </Formik>
    </div>
  );
};

export default AppraisalReport;