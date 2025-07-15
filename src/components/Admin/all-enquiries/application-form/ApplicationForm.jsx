"use client"
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import PersonalDetails from './PersonalDetails';
import AddressDetails from './AddressDetails';
import BankDetails from './BankDetails';
import LoanDetails from './LoanDetails';
import ReferenceDetails from './ReferenceDetails';
import OrganizationDetails from './OrganizationDetails';
import { enquiryAPI } from '@/lib/api';

const ApplicationForm = ({ enquiry, onBack, mode }) => {
  const { isDark } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch application data when component mounts
  useEffect(() => {
    const fetchApplicationData = async () => {
      if (enquiry?.id) {
        try {
          setLoading(true);
          const response = await enquiryAPI.getApplicationForEdit(enquiry.id);
          if (response.data.success) {
            setApiData(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching application data:', error);
          setSubmitError('Failed to load application data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchApplicationData();
  }, [enquiry?.id]);

  const mapApiDataToForm = (apiData) => {
    return {
      // Personal Details
      formNo: apiData.loan_no || '',
      name: apiData.name || '',
      firstName: apiData.fname || '',
      lastName: apiData.lname || '',
      fatherName: apiData.fathername || '',
      dob: apiData.dob ? {
        day: new Date(apiData.dob).getDate(),
        month: new Date(apiData.dob).getMonth() + 1,
        year: new Date(apiData.dob).getFullYear()
      } : { day: '', month: '', year: '' },
      gender: apiData.gender || '',
      phoneNo: apiData.phone || '',
      email: apiData.email || '',
      
      // Current Address
      currentHouseNo: apiData.current_house_no || '',
      currentAddress: apiData.current_address || '',
      currentState: apiData.current_state || '',
      currentCity: apiData.current_city || '',
      currentPinCode: apiData.current_pincode || '',
      currentAddressCode: apiData.current_address_code || '',
      currentStateCode: apiData.current_state_code || '',
      
      // Permanent Address
      permanentHouseNo: apiData.house_no || '',
      permanentAddress: apiData.address || '',
      permanentState: apiData.state || '',
      permanentCity: apiData.city || '',
      permanentPinCode: apiData.pincode || '',
      permanentAddressCode: apiData.address_code || '',
      permanentStateCode: apiData.state_code || '',
      
      // Loan Details
      amountApproved: apiData.approved_amount || '',
      amountApplied: apiData.applied_amount || '',
      loanTerm: apiData.loan_term || '',
      roi: apiData.roi || '',
      tenure: apiData.tenure || '',
      collectionAmount: apiData.dw_collection || '',
      emiCollectionAmount: apiData.emi_collection || '',
      gracePeriod: apiData.grace_period || '',
      administrationFeePercent: apiData.process_percent || '',
      administrationFeeAmount: apiData.process_fee || '',
      gst: apiData.gst || '',
      redeemPoints: apiData.redeem_points || '',

      // Organization Details
      organisationName: apiData.organisation_name || '',
      organisationAddress: apiData.organisation_address || '',
      officePhone: apiData.office_phone || '',
      contactPerson: apiData.contact_person || '',
      mobileNo: apiData.mobile_no || '',
      hrMail: apiData.hr_mail || '',
      website: apiData.website || '',
      officialEmail: apiData.official_email || '',
      grossMonthlySalary: apiData.gross_monthly_salary || '',
      workSinceMm: apiData.work_since_mm || '',
      designation: apiData.designation || '',
      workSinceYy: apiData.work_since_yy || '',
      netHouseHoldIncome: apiData.net_house_hold_income || '',
      netMonthlySalary: apiData.net_monthly_salary || '',
      
      // Bank Details
      bankName: apiData.bank_name || '',
      branchName: apiData.branch_name || '',
      accountType: apiData.account_type || '',
      accountNo: apiData.account_no || '',
      ifscCode: apiData.ifsc_code || '',
      panNo: apiData.pan_no || '',
      aadharNo: apiData.aadhar_no || '',
      crnNo: apiData.crnno || '',
      accountId: apiData.accountId || '',
      approvalNote: apiData.approval_note || '',
      enachBank: apiData.enach_bank || '',
      enachMode: apiData.enach_mode || '',
      enachBankCode: apiData.enach_bank_code || '',
      
      // Reference Details
      referenceName: apiData.ref_name || '',
      referenceAddress: apiData.ref_address || '',
      referenceMobile: apiData.ref_mobile || '',
      referenceEmailId: apiData.ref_email || '',
      referenceRelation: apiData.ref_relation || ''
    };
  };

  const mapFormDataToApi = (formData) => {
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
      process_percent: formData.administrationFeePercent || "0",
      process_fee: formData.administrationFeeAmount,
      gst: formData.gst,
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
  
  const getInitialValues = () => {
    const baseValues = {
      // Personal Details
      formNo: '',
      name: '',
      firstName: '',
      lastName: '',
      fatherName: '',
      dob: { day: '', month: '', year: '' },
      gender: '',
      phoneNo: '',
      email: '',
      
      // Current Address
      currentHouseNo: '',
      currentAddress: '',
      currentState: '',
      currentCity: '',
      currentPinCode: '',
      currentAddressType: '',
      currentAddressCode: '',
      currentStateCode: '',

      // Organization Details
      organisationName: '',
      organisationAddress: '',
      officePhone: '',
      contactPerson: '',
      mobileNo: '',
      hrMail: '',
      website: '',
      officialEmail: '',
      grossMonthlySalary: '',
      workSinceMm: '',
      designation: '',
      workSinceYy: '',
      netHouseHoldIncome: '',
      netMonthlySalary: '',
      
      // Permanent Address
      permanentHouseNo: '',
      permanentAddress: '',
      permanentState: '',
      permanentCity: '',
      permanentAddressType: '',
      permanentAddressCode: '',
      permanentStateCode: '',
      permanentPinCode: '',
      
      // Loan Details
      amountApproved: '',
      amountApplied: '',
      loanTerm: '',
      roi: '',
      tenure: '',
      collectionAmount: '',
      emiCollectionAmount: '',
      gracePeriod: '',
      administrationFeePercent: '',
      administrationFeeAmount: '',
      gst: '',
      redeemPoints: '',
      
      // Bank Details
      bankName: '',
      branchName: '',
      accountType: '',
      accountNo: '',
      ifscCode: '',
      panNo: '',
      aadharNo: '',
      crnNo: '',
      accountId: '',
      approvalNote: '',
      enachBank: '',
      enachMode: '',
      enachBankCode: '',
      
      // Reference Details
      referenceName: '',
      referenceAddress: '',
      referenceMobile: '',
      referenceEmailId: '',
      referenceRelation: ''
    };

    // If we have API data, use it
    if (apiData) {
      return { ...baseValues, ...mapApiDataToForm(apiData) };
    }

    // If we have enquiry data, use it
    if (enquiry) {
      return {
        ...baseValues,
        name: enquiry.name || '',
        firstName: enquiry.firstName || '',
        lastName: enquiry.lastName || '',
        phoneNo: enquiry.phoneNo || '',
        email: enquiry.email || '',
        amountApplied: enquiry.appliedLoan || '',
        currentAddress: enquiry.currentAddress || '',
        currentState: enquiry.currentState || '',
        currentCity: enquiry.currentCity || '',
        crnNo: enquiry.crnNo || '',
        accountId: enquiry.accountId || '',
        roi: enquiry.roi || '',
        tenure: enquiry.tenure || '',
        loanTerm: enquiry.loanTerm || ''
      };
    }

    return baseValues;
  };

  // Parse validation errors from API response
  const parseValidationErrors = (errorResponse) => {
    const errors = {};
    
    if (errorResponse?.data?.errors) {
      Object.keys(errorResponse.data.errors).forEach(field => {
        const messages = errorResponse.data.errors[field];
        if (Array.isArray(messages)) {
          errors[field] = messages.join(', ');
        } else {
          errors[field] = messages;
        }
      });
    }
    
    return errors;
  };



  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setSubmitError('');
      setFieldErrors({});
      
      const mappedData = mapFormDataToApi(values);
      const response = await enquiryAPI.updateApplication(enquiry.id, mappedData);
      
      if (response.data.success) {
        // Success - navigate back to enquiry page
        onBack();
      } else {
        setSubmitError(response.data.message || 'Failed to update application');
      }
    } catch (error) {
      console.error('Submit error:', error);
      
      if (error.response?.status === 422) {
        // Validation errors
        const validationErrors = parseValidationErrors(error.response);
        setFieldErrors(validationErrors);
        setSubmitError('Please correct the highlighted errors below');
      } else if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError('An error occurred while updating the application');
      }
    } finally {
      setLoading(false);
    }
  };

  // Error Alert Component
  const ErrorAlert = ({ message, errors = {} }) => {
    if (!message && Object.keys(errors).length === 0) return null;
    
    return (
      <div className={`mb-6 p-4 rounded-xl border ${
        isDark 
          ? 'bg-red-900/20 border-red-600/30 text-red-400' 
          : 'bg-red-50 border-red-200 text-red-700'
      }`}>
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">{message}</p>
            {Object.keys(errors).length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <p key={field} className="text-sm">
                    <span className="font-medium">{field}:</span> {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && !apiData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className={`mt-4 text-lg ${isDark ? "text-white" : "text-gray-700"}`}>
            Loading application data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <Formik
        initialValues={getInitialValues()}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(formik) => (
          <div className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={onBack}
                    className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                        : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                    }`}
                  >
                    <ArrowLeft className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                  </button>
                  <h1 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${
                    isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                  } bg-clip-text text-transparent`}>
                    Application Form - {formik.values.name || 'New Application'}
                  </h1>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            <ErrorAlert message={submitError} errors={fieldErrors} />

            {/* Form Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <PersonalDetails 
                  formik={formik}
                  isDark={isDark}
                  errors={fieldErrors}
                />
                <AddressDetails 
                  formik={formik}
                  isDark={isDark}
                  errors={fieldErrors}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <LoanDetails 
                  formik={formik}
                  isDark={isDark}
                  errors={fieldErrors}
                />
                <BankDetails 
                  formik={formik}
                  isDark={isDark}
                  errors={fieldErrors}
                />
                <ReferenceDetails 
                  formik={formik}
                  isDark={isDark}
                  errors={fieldErrors}
                />
              </div>
            </div>
            
            {/* Organization Details */}
            <div className="mt-6">
              <OrganizationDetails 
                formik={formik}
                isDark={isDark}
                errors={fieldErrors}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => formik.handleSubmit()}
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                } text-white`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default ApplicationForm;