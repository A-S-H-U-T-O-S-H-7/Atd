// ApplicationForm.js - Updated Formik implementation
"use client"
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import PersonalDetails from './PersonalDetails';
import AddressDetails from './AddressDetails';
import BankDetails from './BankDetails';
import LoanDetails from './LoanDetails';
import ReferenceDetails from './ReferenceDetails';
import OrganizationDetails from './OrganizationDetails';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { applicationAPI, formatApplicationForAPI, formatApplicationForUI } from '@/lib/services/ApplicationFormServices';
import { applicationValidationSchema } from '@/lib/schema/applicationFormValidation';

const ApplicationForm = ({ enquiry, onBack }) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
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
          const response = await applicationAPI.getApplicationForEdit(enquiry.id);
          if (response.success) {
            setApiData(response.data);
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
    return formatApplicationForUI({ data: apiData });
  };

  const mapFormDataToApi = (formData) => {
    return formatApplicationForAPI(formData);
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

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setLoading(true);
      setSubmitError('');
      setFieldErrors({});
      
      const mappedData = mapFormDataToApi(values);
      
      const response = await applicationAPI.updateApplication(enquiry.id, mappedData);
      
      if (response.success) {
        onBack();
      } else {
        setSubmitError(response.message || 'Failed to update application');
      }
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 422) {
        const validationErrors = parseValidationErrors(error.response.data);
        setErrors(validationErrors); // Set errors in Formik
        setFieldErrors(validationErrors);
        setSubmitError('Please correct the highlighted errors below');
      } else if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError('An error occurred while updating the application');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const parseValidationErrors = (errorResponse) => {
    const errors = {};
    
    const errorData = errorResponse?.data || errorResponse;
    
    if (errorData?.errors) {
      Object.keys(errorData.errors).forEach(field => {
        const messages = errorData.errors[field];
        if (Array.isArray(messages)) {
          errors[field] = messages.join(', ');
        } else {
          errors[field] = messages;
        }
      });
    }
    
    if (errorData?.message && !errors.general) {
      errors.general = errorData.message;
    }
    
    return errors;
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
        validationSchema={applicationValidationSchema} // Add validation schema
        onSubmit={handleSubmit}
        enableReinitialize={true}
        validateOnBlur={true}
        validateOnChange={false}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <div className="p-4 md:p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button 
                      type="button"
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
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                  <AddressDetails 
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <LoanDetails 
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                  <BankDetails 
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                  <ReferenceDetails 
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                </div>
              </div>
              
              {/* Organization Details */}
              <div className="mt-6">
                <OrganizationDetails 
                  formik={formik}
                  isDark={isDark}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || formik.isSubmitting}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl ${
                    loading || formik.isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                  } text-white`}
                >
                  {loading || formik.isSubmitting ? (
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
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ApplicationForm;