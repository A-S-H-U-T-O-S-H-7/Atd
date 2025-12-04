import React, { useEffect, useState, useRef } from 'react';
import { Shield, Phone, IdCard, CreditCard, Download, ExternalLink, User, Mail, Users, Save, Loader2 } from 'lucide-react';
import personalVerificationService from '@/lib/services/appraisal/personalVerificationService';
import { documentVerificationSchema } from '@/lib/schema/documentVerificationSchema';
import toast from 'react-hot-toast';
import DocumentReportModal from './ReportModal';

const DocumentVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [panVerifying, setPanVerifying] = useState(false);
  const [aadharVerifying, setAadharVerifying] = useState(false);
  const [submittingDocument, setSubmittingDocument] = useState(false);
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    type: null, 
    data: null,
    loading: false
  });
  const [userManuallyChangedFinalReport, setUserManuallyChangedFinalReport] = useState(false);

  // Styling classes
  const fieldClassName = `p-4 rounded-lg border transition-all duration-200 ${
    isDark
      ? "bg-gray-800/60 border-gray-600 hover:border-emerald-500/40 shadow-lg"
      : "bg-emerald-50/80 border-emerald-200 hover:border-emerald-300 shadow-sm"
  }`;

  const labelClassName = `text-xs font-semibold mb-2 ${
    isDark ? "text-gray-300" : "text-emerald-700"
  }`;

  const valueClassName = `text-sm font-medium p-2 rounded border ${
    isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
  }`;

  const selectClassName = `px-3 py-2 rounded-lg border transition-all duration-200 text-sm min-w-[100px] ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } outline-none`;

  const buttonClassName = `px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-xs ${
    isDark
      ? "bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-700"
      : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  const reportButtonClassName = `px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-xs ${
    isDark
      ? "bg-orange-600 hover:bg-orange-500 text-white"
      : "bg-orange-600 hover:bg-orange-700 text-white"
  }`;

  const submitButtonClassName = `px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-700 shadow-lg shadow-blue-900/20"
      : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 shadow-lg shadow-blue-500/20"
  } disabled:cursor-not-allowed`;

  const finalReportSelectClassName = `px-4 py-3 rounded-lg border transition-all duration-200 text-sm font-medium ${
    isDark
      ? "bg-gray-800 border-gray-600 text-white hover:border-blue-500 focus:border-blue-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-blue-400 focus:border-blue-500"
  } outline-none w-full`;

  // Handle verified status change for phone, PAN, and Aadhar
  const handleVerifiedChange = (field, value) => {
    // Set the verified field
    formik.setFieldValue(field, value);
    
    // Determine corresponding status field
    const statusFieldMap = {
      personal_phone: 'phone_status',
      personal_pan: 'pan_status',
      personal_aadhar: 'aadhar_status'
    };
    
    const statusField = statusFieldMap[field];
    if (statusField) {
      // Auto-set status based on verified selection
      if (value === 'Yes') {
        formik.setFieldValue(statusField, 'Positive');
      } else if (value === 'No') {
        formik.setFieldValue(statusField, 'Negative');
      } else {
        // If cleared, also clear status
        formik.setFieldValue(statusField, '');
      }
    }
  };

  // Handle final report change - track manual changes
  const handleFinalReportChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('personal_final_report', value);
    setUserManuallyChangedFinalReport(true);
  };

  // Auto-update final report based on all verifications - ONLY if user hasn't manually changed it
  useEffect(() => {
    // If user manually changed final report, don't auto-update
    if (userManuallyChangedFinalReport) {
      return;
    }

    const allVerified = 
      formik.values.personal_phone === 'Yes' &&
      formik.values.phone_status === 'Positive' &&
      formik.values.personal_pan === 'Yes' &&
      formik.values.pan_status === 'Positive' &&
      formik.values.personal_aadhar === 'Yes' &&
      formik.values.aadhar_status === 'Positive' &&
      formik.values.personal_ref_name === 'Yes' &&
      formik.values.personal_ref_mobile === 'Yes' &&
      formik.values.personal_ref_email === 'Yes' &&
      formik.values.personal_ref_relation === 'Yes';

    if (allVerified && formik.values.personal_final_report !== 'Positive') {
      formik.setFieldValue('personal_final_report', 'Positive');
    }

    // Auto-set to Negative if any critical verification is negative
    const hasCriticalNegative = 
      formik.values.phone_status === 'Negative' ||
      formik.values.pan_status === 'Negative' ||
      formik.values.aadhar_status === 'Negative';
      
    if (hasCriticalNegative && formik.values.personal_final_report !== 'Negative') {
      formik.setFieldValue('personal_final_report', 'Negative');
    }
  }, [formik.values, userManuallyChangedFinalReport]);

  // Reset manual change flag when component mounts or when verification fields are cleared
  useEffect(() => {
    // Reset manual change if all verification fields are empty/not set
    const allFieldsEmpty = 
      !formik.values.personal_phone &&
      !formik.values.personal_pan &&
      !formik.values.personal_aadhar &&
      !formik.values.personal_ref_name &&
      !formik.values.personal_ref_mobile &&
      !formik.values.personal_ref_email &&
      !formik.values.personal_ref_relation;
    
    if (allFieldsEmpty) {
      setUserManuallyChangedFinalReport(false);
    }
  }, [formik.values]);

  const getVerificationScore = () => {
    const verifications = [
      formik.values.personal_phone === 'Yes' && formik.values.phone_status === 'Positive',
      formik.values.personal_pan === 'Yes' && formik.values.pan_status === 'Positive',
      formik.values.personal_aadhar === 'Yes' && formik.values.aadhar_status === 'Positive',
      formik.values.personal_ref_name === 'Yes',
      formik.values.personal_ref_mobile === 'Yes',
      formik.values.personal_ref_email === 'Yes',
      formik.values.personal_ref_relation === 'Yes'
    ];
    
    const passed = verifications.filter(Boolean).length;
    return Math.round((passed / verifications.length) * 100);
  };

  // API integration functions using new service
  const handlePanVerification = async () => {
    if (!formik.values.panNo) {
      toast.error('PAN number is required');
      return;
    }

    if (!formik.values.applicationId) {
      toast.error('Application ID is required');
      return;
    }

    try {
      setPanVerifying(true);
      
      const panData = {
        application_id: parseInt(formik.values.applicationId),
        crnno: formik.values.crnNo || '',
        pan_no: formik.values.panNo.toUpperCase().trim()
      };

      const response = await personalVerificationService.verifyPAN(panData);
      
      // Auto-update verification status based on response
      if (response?.success) {
        formik.setFieldValue('personal_pan', 'Yes');
        formik.setFieldValue('pan_status', response.status || 'Positive');
        toast.success('PAN verification completed successfully');
      } else {
        toast.error(response?.message || 'PAN verification failed');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'PAN verification failed');
    } finally {
      setPanVerifying(false);
    }
  };

  const handleAadharVerification = async () => {
    if (!formik.values.aadharNo) {
      toast.error('Aadhar number is required');
      return;
    }

    if (!formik.values.applicationId) {
      toast.error('Application ID is required');
      return;
    }

    try {
      setAadharVerifying(true);
      
      const aadharData = {
        application_id: parseInt(formik.values.applicationId),
        crnno: formik.values.crnNo || '',
        aadhar_no: formik.values.aadharNo
      };

      const response = await personalVerificationService.verifyAadhar(aadharData);
      
      // Auto-update verification status based on response
      if (response?.success) {
        formik.setFieldValue('personal_aadhar', 'Yes');
        formik.setFieldValue('aadhar_status', response.status || 'Positive');
        toast.success('Aadhar verification completed successfully');
      } else {
        toast.error(response?.message || 'Aadhar verification failed');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Aadhar verification failed');
    } finally {
      setAadharVerifying(false);
    }
  };

  const handleReportClick = async (type) => {
    // Validate required fields
    if (!formik.values.applicationId) {
      toast.error('Application ID is required');
      return;
    }

    if (type === 'pan' && !formik.values.panNo) {
      toast.error('PAN number is required');
      return;
    }

    if (type === 'aadhar' && !formik.values.aadharNo) {
      toast.error('Aadhar number is required');
      return;
    }

    // Open modal immediately
    setReportModal({
      isOpen: true,
      type: type,
      data: null,
      loading: true
    });

    try {
      let response;
      const requestData = {
        application_id: parseInt(formik.values.applicationId),
        crnno: formik.values.crnNo || '',
      };

      if (type === 'pan') {
        requestData.pan_no = formik.values.panNo.toUpperCase().trim();
        response = await personalVerificationService.verifyPAN(requestData);
      } else if (type === 'aadhar') {
        requestData.aadhar_no = formik.values.aadharNo;
        response = await personalVerificationService.verifyAadhar(requestData);
      }
      
      // Update modal with response data
      setReportModal(prev => ({
        ...prev,
        data: response,
        loading: false
      }));
      
      // Auto-update verification status based on response
      if (response?.success) {
        if (type === 'pan') {
          formik.setFieldValue('personal_pan', 'Yes');
          formik.setFieldValue('pan_status', 'Positive');
          toast.success('PAN verification completed successfully');
        } else if (type === 'aadhar') {
          formik.setFieldValue('personal_aadhar', 'Yes');
          formik.setFieldValue('aadhar_status', 'Positive');
          toast.success('Aadhar verification completed successfully');
        }
      } else {
        toast.error(response?.message || `${type.toUpperCase()} verification failed`);
      }
    } catch (error) {
      const errorResponse = {
        success: false,
        message: error?.message || `${type.toUpperCase()} verification failed. Please try again.`,
        data: null
      };
      
      setReportModal(prev => ({
        ...prev,
        data: errorResponse,
        loading: false
      }));
      
      toast.error(errorResponse.message);
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setReportModal({
      isOpen: false,
      type: null,
      data: null,
      loading: false
    });
  };

  // Save document verification
  const handleSaveDocumentVerification = async () => {
    try {
      setSubmittingDocument(true);
      
      // Validate form data
      try {
        await documentVerificationSchema.validate(formik.values, { abortEarly: false });
      } catch (validationError) {
        const firstError = validationError.inner?.[0]?.message || validationError.message;
        toast.error(firstError);
        return; 
      }

      // Check if final report is selected
      if (!formik.values.personal_final_report) {
        toast.error('Please select a final verification report status');
        return;
      }

      // Call parent's save handler which calls the service
      if (onSectionSave) {
        await onSectionSave();
        toast.success('Document verification saved successfully');
      }
      
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error saving document verification');
    } finally {
      setSubmittingDocument(false);
    }
  };

  const score = getVerificationScore();

  return (
    <div className="space-y-6">
      {/* Main Verification Box */}
      <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-emerald-500/20 shadow-2xl shadow-blue-900/10"
          : "bg-gradient-to-br from-gray-100 border-emerald-200 shadow-lg shadow-blue-500/10"
      }`}>
        {/* Enhanced Header */}
        <div className={`p-4 border-b ${
          isDark 
            ? "border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900" 
            : "border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"
              }`}>
                <Shield className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-700"
                }`}>
                  Document Verification
                </h3>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              score === 100 
                ? (isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-800")
                : score >= 70
                ? (isDark ? "bg-yellow-900/50 text-yellow-400" : "bg-yellow-100 text-yellow-800")
                : (isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-800")
            }`}>
              {score}% Complete
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-4">
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Phone Verification */}
              <div className={`${fieldClassName}`}>
                <label className={labelClassName}>
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number Verification
                </label>
                <div className="flex items-center space-x-3">
                  <div className={`${valueClassName} flex-1 text-center`}>
                    {formik.values.phoneNo || 'N/A'}
                  </div>
                  <select
                    value={formik.values.personal_phone}
                    onChange={(e) => handleVerifiedChange('personal_phone', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Verified</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <select
                    value={formik.values.phone_status}
                    onChange={(e) => formik.setFieldValue('phone_status', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Status</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>
              </div>

              {/* PAN Verification */}
              <div className={`${fieldClassName}`}>
                <label className={labelClassName}>
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  PAN Card Verification
                </label>
                <div className="flex items-center space-x-3">
                  <div className={`${valueClassName} flex-1 text-center`}>
                    {formik.values.panNo || 'N/A'}
                  </div>
                  <select
                    value={formik.values.personal_pan}
                    onChange={(e) => handleVerifiedChange('personal_pan', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Verified</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <select
                    value={formik.values.pan_status}
                    onChange={(e) => formik.setFieldValue('pan_status', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Status</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleReportClick('pan')}
                    className={reportButtonClassName}
                  >
                    <Download className="w-3 h-3" />
                    <span>Report</span>
                  </button>
                </div>
              </div>

              {/* Aadhar Verification */}
              <div className={`${fieldClassName}`}>
                <label className={labelClassName}>
                  <IdCard className="w-4 h-4 inline mr-2" />
                  Aadhar Card Verification
                </label>
                <div className="flex items-center space-x-3">
                  <div className={`${valueClassName} flex-1 text-center`}>
                    {formik.values.aadharNo || 'N/A'}
                  </div>
                  <select
                    value={formik.values.personal_aadhar}
                    onChange={(e) => handleVerifiedChange('personal_aadhar', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Verified</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <select
                    value={formik.values.aadhar_status}
                    onChange={(e) => formik.setFieldValue('aadhar_status', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Status</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleReportClick('aadhar')}
                    className={reportButtonClassName}
                  >
                    <Download className="w-3 h-3" />
                    <span>Report</span>
                  </button>

                  {/* Aadhar-PAN Link Status Button */}
                  <button
                    type="button"
                    onClick={() => window.open('https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar-status', '_blank')}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-xs ${
                      isDark
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Aadhar-PAN Link Status</span>
                  </button>
                </div>
              </div>
            </div>  

            {/* Relation Reference Verification */}
            <div className={`${fieldClassName}`}>
              <label className={labelClassName}>
                <Users className="w-4 h-4 inline mr-2" />
                Relation Reference Verification
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Reference Name */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    <span className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Name</span>
                  </div>
                  <div className={`${valueClassName} text-center`}>
                    {formik.values.apiReferenceData?.name || 'N/A'}
                  </div>
                  <select
                    value={formik.values.personal_ref_name}
                    onChange={(e) => formik.setFieldValue('personal_ref_name', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Verified</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Reference Phone */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    <span className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Phone</span>
                  </div>
                  <div className={`${valueClassName} text-center`}>
                    {formik.values.apiReferenceData?.phone || 'N/A'}
                  </div>
                  <select
                    value={formik.values.personal_ref_mobile}
                    onChange={(e) => formik.setFieldValue('personal_ref_mobile', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Verified</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Reference Email */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    <span className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</span>
                  </div>
                  <div className={`${valueClassName} text-center`}>
                    {formik.values.apiReferenceData?.email || 'N/A'}
                  </div>
                  <select
                    value={formik.values.personal_ref_email}
                    onChange={(e) => formik.setFieldValue('personal_ref_email', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Verified</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Reference Relation */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    <span className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Relation</span>
                  </div>
                  <div className={`${valueClassName} text-center`}>
                    {formik.values.apiReferenceData?.relation || 'N/A'}
                  </div>
                  <select
                    value={formik.values.personal_ref_relation}
                    onChange={(e) => formik.setFieldValue('personal_ref_relation', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Verified</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Report Section */}
      <div className={`rounded-xl border-2 p-6 transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500/30 shadow-2xl shadow-blue-900/10"
          : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 shadow-lg shadow-blue-500/10"
      }`}>
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Final Report Selection */}
          <div className="w-50">
            <label className={`block text-sm font-semibold mb-3 ${
              isDark ? "text-blue-400" : "text-blue-700"
            }`}>
              <Shield className="w-4 h-4 inline mr-2" />
              Final Verification Report
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <select
                value={formik.values.personal_final_report}
                onChange={handleFinalReportChange}
                className={finalReportSelectClassName}
              >
                <option value="">Select Final Verification Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            
          </div>

          {/* Save Button */}
          <div className="w-full lg:w-auto">
            <button
              type="button"
              onClick={handleSaveDocumentVerification}
              disabled={submittingDocument || saving}
              className={submitButtonClassName}
            >
              {(submittingDocument || saving) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {submittingDocument 
                  ? 'Submitting...' 
                  : saving 
                  ? 'Saving...' 
                  : 'Submit'
                }
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <DocumentReportModal
        isOpen={reportModal.isOpen}
        onClose={handleCloseModal}
        reportType={reportModal.type}
        reportData={reportModal.data}
        loadingReport={reportModal.loading}
        isDark={isDark}
        documentNumber={
          reportModal.type === 'pan' 
            ? formik.values.panNo 
            : formik.values.aadharNo
        }
      />
    </div>
  );
};

export default DocumentVerification;