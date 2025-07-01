"use client"
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import PersonalDetails from './PersonalDetails';
import AddressDetails from './AddressDetails';
import BankDetails from './BankDetails';
import LoanDetails from './LoanDetails';
import ReferenceDetails from './ReferenceDetails';

const ApplicationForm = ({ enquiry, onBack, mode }) => {
  const { isDark } = useAdminAuth();
  
  const initialValues = {
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

  const handleSave = async (values) => {
    try {
      console.log('Saving Application Form:', values);
      // API call: await saveApplicationFormAPI(enquiry.id, values);
      alert('Application form saved successfully!');
    } catch (error) {
      console.error('Error saving application form:', error);
      alert('Error saving application form');
    }
  };

  const handleSubmit = async (values) => {
    try {
      console.log('Submitting Application Form:', values);
      // API call: await submitApplicationFormAPI(enquiry.id, values);
      alert('Application form submitted successfully!');
      onBack();
    } catch (error) {
      console.error('Error submitting application form:', error);
      alert('Error submitting application form');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(formik) => {
          // Initialize form data from enquiry when component mounts
          useEffect(() => {
            if (enquiry) {
              formik.setValues({
                ...formik.values,
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
              });
            }
          }, [enquiry]);

          return (
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
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleSave(formik.values)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => handleSubmit(formik.values)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                    >
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
                  <PersonalDetails 
                    formik={formik}
                    isDark={isDark}
                  />
                  <AddressDetails 
                    formik={formik}
                    isDark={isDark}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <LoanDetails 
                    formik={formik}
                    isDark={isDark}
                  />
                  <BankDetails 
                    formik={formik}
                    isDark={isDark}
                  />
                  <ReferenceDetails 
                    formik={formik}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default ApplicationForm;