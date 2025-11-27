import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Building, Save, Phone, Mail, Globe, CheckCircle, XCircle, ExternalLink, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { organizationVerificationService } from '@/lib/services/appraisal/organizationVerificationService';
import { organizationFormValidationSchema } from '@/lib/schema/organizationValidationSchemas';

const OrganizationVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [submittingOrganization, setSubmittingOrganization] = useState(false);
  const [localRemarkValue, setLocalRemarkValue] = useState(formik.values.organizationRemark || '');
  const timeoutRef = useRef(null);
  const formikUpdateTimeoutRef = useRef(null);

  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-semibold mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const valueClassName = `text-sm p-2 rounded border ${
    isDark ? "bg-gray-600/50 border-gray-500 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  // Sync external changes to local state
  useEffect(() => {
    setLocalRemarkValue(formik.values.organizationRemark || '');
  }, [formik.values.organizationRemark]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (formikUpdateTimeoutRef.current) {
        clearTimeout(formikUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Debounced save function for organization remarks
  const debouncedSaveRemark = useCallback((value) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(async () => {
    try {
      if (!value || value.trim().length === 0 || !formik.values.applicationId) {
        return;
      }

      setRemarkSaving(true);
      
      await organizationVerificationService.saveOrganizationRemark({
        application_id: parseInt(formik.values.applicationId),
        remarks: value.trim()
      });
    } catch (error) {
      // Error handled in service
    } finally {
      setRemarkSaving(false);
    }
  }, 3000);
}, [formik.values.applicationId]);


  
  // Optimized remark change handler
  const handleRemarkChange = (value) => {
    setLocalRemarkValue(value);
    
    if (formikUpdateTimeoutRef.current) {
      clearTimeout(formikUpdateTimeoutRef.current);
    }
    formikUpdateTimeoutRef.current = setTimeout(() => {
      formik.setFieldValue('organizationRemark', value);
    }, 500);
    
    debouncedSaveRemark(value);
  };

// Save organization verification
const handleSaveOrganizationVerification = async () => {
  try {
    setSubmittingOrganization(true);
    
    // Validate form fields
    try {
      await organizationFormValidationSchema.validate(formik.values, { 
        abortEarly: true
      });
    } catch (validationError) {
      toast.error(validationError.message);
      return;
    }
    
    const organizationData = organizationVerificationService.formatOrganizationVerificationData(
      formik.values.applicationId,
      formik.values
    );
    
    await organizationVerificationService.saveOrganizationVerificationData(organizationData);
    toast.success('Organization verification saved successfully!');
    
    // Don't call onSectionSave - it would trigger duplicate save
    
  } catch (error) {
    // Error handling is done in the service
  } finally {
    setSubmittingOrganization(false);
  }
};

  
  // Handle sending mail to HR with confirmation
const handleSendMailToHR = async () => {
  const hrEmail = formik.values.hrMail;
  if (!hrEmail || hrEmail === 'N/A') {
    toast.error('HR email is not available');
    return;
  }
  
  // SweetAlert2 confirmation
  const result = await Swal.fire({
    title: 'Send Email to HR?',
    text: `This will open your email client to send an email to ${hrEmail}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Send Email',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      container: isDark ? 'dark-swal' : '',
      popup: isDark ? 'bg-gray-800 text-white' : '',
      title: isDark ? 'text-white' : '',
      htmlContainer: isDark ? 'text-gray-300' : ''
    }
  });

  if (result.isConfirmed) {
    try {
      const mailtoLink = await organizationVerificationService.handleSendMailToHR(
        hrEmail, 
        formik.values.organizationName
      );
      
      window.open(mailtoLink, '_blank');
      toast.success('Email client opened for HR');
    } catch (error) {
      toast.error(error.message);
    }
  }
};


  const statusIndicator = (status) => {
    const isPositive = status === 'Positive' || status === 'Yes';
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
        isDark
          ? isPositive ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
          : isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {isPositive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        <span>{status || 'Pending'}</span>
      </div>
    );
  };

  const VerificationField = ({ label, value, verified, status, onVerifiedChange, onStatusChange, icon: Icon, showSendMail = false }) => (
    <div className={`p-3 rounded-lg border transition-all duration-200 ${
      isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {label}
          </span>
        </div>
        {statusIndicator(status)}
      </div>
      
      {value && (
        <div className="mb-2">
          <div className={`${valueClassName} flex items-center justify-between`}>
            <span>{value}</span>
            {showSendMail && (
              <button
                onClick={handleSendMailToHR}
                className={`ml-2 px-3 py-1 rounded text-xs flex items-center space-x-1 ${
                  isDark 
                    ? "bg-blue-600 hover:bg-blue-500 text-white" 
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <Send className="w-3 h-3" />
                <span>Send Mail</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <select
            value={verified}
            onChange={(e) => onVerifiedChange(e.target.value)}
            className={selectClassName}
          >
            <option value="">Verified</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={selectClassName}
          >
            <option value="">Status</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Auto-calculate final report when all inputs are Yes and Positive
 

  return (
    <div className={`rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/30 shadow-emerald-900/10 hover:shadow-emerald-900/20"
        : "bg-white border-emerald-200 shadow-emerald-500/5 hover:shadow-emerald-500/10"
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? "border-gray-700 bg-gray-800/80" : "border-gray-100 bg-emerald-50/50"
      }`}>
        <div className="flex items-center space-x-2">
          <Building className={`w-5 h-5 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Organization Verification
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Organization Remarks and Company Name in one row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Organization Remarks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-md font-medium ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>Organization Remarks</label>
              {remarkSaving && (
                <div className={`text-xs flex items-center space-x-1 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Saving...</span>
                </div>
              )}
            </div>
            <textarea
              rows="3"
              value={localRemarkValue}
              onChange={(e) => handleRemarkChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm resize-none ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
              placeholder="Enter organization verification remarks..."
            />
            <div className={`flex justify-between items-center mt-2 text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              <span>{(localRemarkValue?.length || 0)} characters</span>
              <span>💾 Auto-saves after 2 seconds</span>
            </div>
          </div>

          {/* Company Name Box */}
<div className={`p-3 rounded-lg border h-full flex flex-col justify-between ${
  isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
}`}>
  <div>
    <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
      Company Name
    </div>
    <div className={`text-base font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
      {formik.values.organizationName || "N/A"}
    </div>
    
    {/* Organization Address */}
    <div className={`text-sm mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
      <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Organization Address:
      </div>
      <div className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {formik.values.organisation_address || "At/po-iswarpur via- Bahanga,Dist-Balasore"}
      </div>
    </div>
  </div>
  
  <a
    href="https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS.html"
    target="_blank"
    rel="noopener noreferrer"
    className={`mt-3 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 ${
      isDark 
        ? "bg-blue-600 hover:bg-blue-500 text-white" 
        : "bg-blue-500 hover:bg-blue-600 text-white"
    }`}
  >
    <ExternalLink className="w-4 h-4" />
    <span>Verify on MCA</span>
  </a>
</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Online Verification */}
            <VerificationField
              label="Online Verification"
              value={formik.values.organizationName || "N/A"}
              verified={formik.values.organizationVerificationStatus}
              status={formik.values.organizationVerificationMethod}
              onVerifiedChange={(value) => formik.setFieldValue('organizationVerificationStatus', value)}
              onStatusChange={(value) => formik.setFieldValue('organizationVerificationMethod', value)}
              icon={Globe}
            />
            {/* HR Phone */}
            <VerificationField
              label="HR Phone"
              value={formik.values.mobileNo || "N/A"}
              verified={formik.values.hrPhoneVerificationStatus}
              status={formik.values.hrPhoneVerificationMethod}
              onVerifiedChange={(value) => formik.setFieldValue('hrPhoneVerificationStatus', value)}
              onStatusChange={(value) => formik.setFieldValue('hrPhoneVerificationMethod', value)}
              icon={Phone}
            />

            {/* HR Contact */}
            <div className={`p-3 rounded-lg border transition-all duration-200 ${
              isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Mail className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    HR/Contact Name
                  </span>
                </div>
                {statusIndicator(formik.values.hrContactVerificationStatus)}
              </div>
              
              <div className="mb-2">
                <div className={valueClassName}>{formik.values.contactPerson || "N/A"}</div>
              </div>

              <select
                value={formik.values.hrContactVerificationStatus}
                onChange={(e) => formik.setFieldValue('hrContactVerificationStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Verified</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Company Phone */}
            <VerificationField
              label="Company Phone"
              value={formik.values.officePhone || "N/A"}
              verified={formik.values.companyPhoneVerificationStatus}
              status={formik.values.companyPhoneVerificationMethod}
              onVerifiedChange={(value) => formik.setFieldValue('companyPhoneVerificationStatus', value)}
              onStatusChange={(value) => formik.setFieldValue('companyPhoneVerificationMethod', value)}
              icon={Phone}
            />

          
{/* Company Website */}
<div className={`p-3 rounded-lg border ${
  isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
}`}>
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center space-x-2">
      <Globe className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
      <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        Company Website
      </span>
    </div>
    {statusIndicator(formik.values.companyWebsiteStatus)}
  </div>
  
  <div className="mb-2">
    <div className={valueClassName}>
      {formik.values.website && formik.values.website !== "N/A" ? (
        <a
          href={formik.values.website.startsWith('http') ? formik.values.website : `https://${formik.values.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`block font-medium w-full truncate ${
            isDark 
              ? "text-blue-500 hover:text-blue-300" 
              : "text-blue-600 hover:text-blue-800"
          } underline hover:no-underline transition-colors duration-200`}
          title={formik.values.website}
        >
          {formik.values.website}
        </a>
      ) : (
        <span>N/A</span>
      )}
    </div>
  </div>

  <select
    value={formik.values.companyWebsiteStatus}
    onChange={(e) => formik.setFieldValue('companyWebsiteStatus', e.target.value)}
    className={selectClassName}
  >
    <option value="">Status</option>
    <option value="Positive">Positive</option>
    <option value="Negative">Negative</option>
  </select>
</div>
            
           {/* HR Email */}
<div className={`p-3 rounded-lg border transition-all duration-200 ${
  isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
}`}>
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center space-x-2">
      <Mail className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
      <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        HR Email
      </span>
    </div>
    {statusIndicator(formik.values.hrEmailVerificationStatus)}
  </div>
  
  <div className="mb-3">
    <div className={valueClassName}>
      {formik.values.hrMail && formik.values.hrMail !== "N/A" ? (
        <a
          href={`mailto:${formik.values.hrMail}`}
          className={`block w-full truncate ${
            isDark 
              ? "text-blue-400 hover:text-blue-300" 
              : "text-blue-600 hover:text-blue-800"
          } underline hover:no-underline transition-colors duration-200`}
          title={formik.values.hrMail}
        >
          {formik.values.hrMail}
        </a>
      ) : (
        <span>N/A</span>
      )}
    </div>
  </div>

  <div className="grid grid-cols-2 gap-2 mb-3">
    <div>
      <select
        value={formik.values.hrEmailVerificationStatus}
        onChange={(e) => formik.setFieldValue('hrEmailVerificationStatus', e.target.value)}
        className={selectClassName}
      >
        <option value="">Verified</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div>
      <select
        value={formik.values.hrEmailVerificationMethod}
        onChange={(e) => formik.setFieldValue('hrEmailVerificationMethod', e.target.value)}
        className={selectClassName}
      >
        <option value="">Status</option>
        <option value="Positive">Positive</option>
        <option value="Negative">Negative</option>
      </select>
    </div>
  </div>

  {formik.values.hrMail && formik.values.hrMail !== "N/A" && (
    <button
      onClick={handleSendMailToHR}
      className={`w-full px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 ${
        isDark 
          ? "bg-blue-600 hover:bg-blue-500 text-white" 
          : "bg-blue-500 hover:bg-blue-600 text-white"
      } transition-all duration-200`}
    >
      <Send className="w-4 h-4" />
      <span>Send Mail To HR</span>
    </button>
  )}
</div>
          </div>
        </div>

        {/* Final Report and Submit Button */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 max-w-xs">
            <label className={labelClassName}>Final Report</label>
            <select
              value={formik.values.organizationFinalReport}
              onChange={(e) => formik.setFieldValue('organizationFinalReport', e.target.value)}
              className={selectClassName}
            >
              <option value="">Select Final Report</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
          
          <button
            type="button"
            onClick={handleSaveOrganizationVerification}
            disabled={submittingOrganization || saving}
            className={buttonClassName}
          >
            {(submittingOrganization || saving) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{submittingOrganization ? 'Saving Organization...' : saving ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  ); 
};

export default OrganizationVerification;