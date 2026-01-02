import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CreditCard, Save, AlertCircle, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { appraisalCoreService } from '@/lib/services/appraisal';
import { cibilVerificationService } from '@/lib/services/appraisal/cibilVerificationService';
import { cibilVerificationSchema } from '@/lib/schema/cibilValidationSchemas';

const CibilVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [submittingCibil, setSubmittingCibil] = useState(false);
  const [localRemarkValue, setLocalRemarkValue] = useState(formik.values.cibilRemark || '');
  const [customerData, setCustomerData] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [userManuallyChangedFinalReport, setUserManuallyChangedFinalReport] = useState(false);
  const timeoutRef = useRef(null);
  const formikUpdateTimeoutRef = useRef(null);
  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-semibold mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  const debouncedSaveRemark = useCallback((value) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(async () => {
    try {
      // ✅ Add better validation
      if (!value || value.trim().length === 0) {
        console.log('CIBIL remark is empty, not saving');
        return;
      }
      
      if (!formik.values.applicationId) {
        toast.error('Application ID is required to save CIBIL remark');
        return;
      }

      setRemarkSaving(true);
      
      const response = await cibilVerificationService.saveCibilRemark({
        application_id: parseInt(formik.values.applicationId),
        remarks: value.trim()
      });
      
      // ✅ Explicitly show success toast
      if (response?.data?.success) {
        toast.success('CIBIL remark saved successfully');
      }
    } catch (error) {
      // ✅ Show error toast
      toast.error('Failed to save CIBIL remark');
      console.error('Error saving CIBIL remark:', error);
    } finally {
      setRemarkSaving(false);
    }
  }, 2000); // Reduce to 2 seconds for better UX
}, [formik.values.applicationId]);

  // Sync external changes to local state
  useEffect(() => {
    setLocalRemarkValue(formik.values.cibilRemark || '');
  }, [formik.values.cibilRemark]);

  // Use customer data from formik values (already loaded in parent component)
  useEffect(() => {
    // Extract customer data from formik values using correct field names
    const extractedData = cibilVerificationService.extractCustomerData(formik.values);
    
    setCustomerData(extractedData);
  }, [formik.values.name, formik.values.phoneNo, formik.values.email, formik.values.dob, formik.values.appliedAmount, formik.values.crnNo, formik.values.organizationName, formik.values.panNo, formik.values.aadharNo]);

  // Handle status change for CIBIL fields
  const handleStatusChange = (valueField, statusField, value) => {
    formik.setFieldValue(valueField, value);
    
    // Auto-set status based on value
    if (value > 0) {
      formik.setFieldValue(statusField, 'Negative');
    } else {
      formik.setFieldValue(statusField, 'Positive');
    }
  };

  // Handle final report change - track manual changes
  const handleFinalReportChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('cibilFinalReport', value);
    setUserManuallyChangedFinalReport(true);
  };

  // Auto-update final report based on all conditions - ONLY if user hasn't manually changed it
  useEffect(() => {
    // If user manually changed final report, don't auto-update
    if (userManuallyChangedFinalReport) {
      return;
    }

    // Check for Positive conditions
    const hasValidScore = 
      formik.values.cibilScore && 
      formik.values.cibilScore.toString().trim() !== '' &&
      !isNaN(parseInt(formik.values.cibilScore)) &&
      formik.values.cibilScoreStatus === 'Positive';

    const allLoanFieldsPositive = 
      formik.values.activeLoanStatus === 'Positive' &&
      formik.values.closedLoanStatus === 'Positive' &&
      formik.values.writeOffStatus === 'Positive' &&
      formik.values.overdueStatus === 'Positive';

    const hasValidEmi = 
      formik.values.totalEmiAsCibil !== null &&
      formik.values.totalEmiAsCibil !== undefined &&
      formik.values.totalEmiAsCibil.toString().trim() !== '';

    const dpdConditionsMet = 
      formik.values.dpd === 'Nil' &&
      formik.values.dpdStatus === 'Positive';

    // Set final report
    if (hasValidScore && allLoanFieldsPositive && hasValidEmi && dpdConditionsMet) {
      if (formik.values.cibilFinalReport !== 'Positive') {
        formik.setFieldValue('cibilFinalReport', 'Positive');
      }
    } else {
      // Check if any field is negative
      const hasAnyNegative = 
        formik.values.cibilScoreStatus === 'Negative' ||
        formik.values.activeLoanStatus === 'Negative' ||
        formik.values.closedLoanStatus === 'Negative' ||
        formik.values.writeOffStatus === 'Negative' ||
        formik.values.overdueStatus === 'Negative' ||
        formik.values.dpd === 'Irregular' ||
        formik.values.dpdStatus === 'Negative';

      if (hasAnyNegative && formik.values.cibilFinalReport !== 'Negative') {
        formik.setFieldValue('cibilFinalReport', 'Negative');
      }
    }
  }, [formik.values, userManuallyChangedFinalReport]);

  // Reset manual change flag when all fields are cleared
  useEffect(() => {
    // Reset manual change if all CIBIL fields are empty/not set
    const allFieldsEmpty = 
      !formik.values.cibilScore &&
      !formik.values.totalActiveLoans &&
      !formik.values.totalClosedLoans &&
      !formik.values.writeOffSettled &&
      !formik.values.noOfOverdue &&
      !formik.values.totalEmiAsCibil &&
      !formik.values.dpd;
    
    if (allFieldsEmpty) {
      setUserManuallyChangedFinalReport(false);
    }
  }, [formik.values]);

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

  // Optimized remark change handler
  const handleRemarkChange = (value) => {
    // 1. Update local state immediately (no re-render lag)
    setLocalRemarkValue(value);
    
    // 2. Debounce formik update
    if (formikUpdateTimeoutRef.current) {
      clearTimeout(formikUpdateTimeoutRef.current);
    }
    formikUpdateTimeoutRef.current = setTimeout(() => {
      formik.setFieldValue('cibilRemark', value);
    }, 500);
    
    // 3. Debounce the API call
    debouncedSaveRemark(value);
  };

  const handleSaveCibilVerification = async () => {
    try {
      setSubmittingCibil(true);
      
      // Validate required fields before saving
      if (!formik.values.cibilScore || formik.values.cibilScore.toString().trim() === '') {
        toast.error('CIBIL Score is required');
        return;
      }

      if (formik.values.totalEmiAsCibil === null || formik.values.totalEmiAsCibil === undefined || formik.values.totalEmiAsCibil.toString().trim() === '') {
        toast.error('Total EMI as per CIBIL is required');
        return;
      }

      const cibilData = cibilVerificationService.formatCibilVerificationData(
        formik.values.applicationId,
        formik.values
      );
      
      // ✅ Use Yup schema for validation in component
      try {
        await cibilVerificationSchema.validate(cibilData, { abortEarly: false });
      } catch (validationError) {
        const firstError = validationError.errors[0] || validationError.message;
        toast.error(firstError);
        return;
      }
      
      await cibilVerificationService.saveCibilVerificationData(cibilData);
      toast.success('CIBIL verification saved successfully!');
      
    } catch (error) {
      // Errors are handled in service
    } finally {
      setSubmittingCibil(false);
    }
  };
  
  const statusBadge = (status, value) => {
    const isPositive = status === 'Positive';
    const hasValue = value && value > 0;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
        isDark
          ? isPositive ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
          : isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {isPositive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        <span>{status || (hasValue ? 'Review' : 'No Data')}</span>
      </div>
    );
  };

  // CIBIL Score Field Component with local state - FIXED
  const CibilScoreField = () => {
    const [localScore, setLocalScore] = useState(formik.values.cibilScore || '');
    const [localStatus, setLocalStatus] = useState(formik.values.cibilScoreStatus || '');
    
    // Sync with formik values when they change externally
    useEffect(() => {
      setLocalScore(formik.values.cibilScore || '');
    }, [formik.values.cibilScore]);
    
    useEffect(() => {
      setLocalStatus(formik.values.cibilScoreStatus || '');
    }, [formik.values.cibilScoreStatus]);
    
    const handleScoreChange = (e) => {
      const newScore = e.target.value;
      setLocalScore(newScore);
    };
    
    const handleStatusChange = (e) => {
      const newStatus = e.target.value;
      setLocalStatus(newStatus);
      formik.setFieldValue('cibilScoreStatus', newStatus);
    };
    
    const handleScoreBlur = () => {
      formik.setFieldValue('cibilScore', localScore);
      
      // Auto-set status based on score value on blur
      if (localScore && !isNaN(parseInt(localScore))) {
        const scoreNum = parseInt(localScore);
        if (scoreNum > 500) {
          setLocalStatus('Positive');
          formik.setFieldValue('cibilScoreStatus', 'Positive');
        } else if (scoreNum <= 500) {
          setLocalStatus('Negative');
          formik.setFieldValue('cibilScoreStatus', 'Negative');
        }
      }
    };
    
    return (
      <div>
        <label className={labelClassName}>CIBIL Score (&gt;500)</label>
        <div className="space-y-2">
          <input
            type="number"
            value={localScore}
            onChange={handleScoreChange}
            onBlur={handleScoreBlur}
            className={inputClassName}
            placeholder="Enter Score (e.g. 746)"
            min="300"
            max="900"
          />
          <select
            value={localStatus}
            onChange={handleStatusChange}
            className={selectClassName}
          >
            <option value="">Select Status</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
        {localScore && parseInt(localScore) <= 500 && (
          <div className="text-xs text-red-500 mt-1">
            Score is 500 or below - will auto-set to Negative
          </div>
        )}
      </div>
    );
  };

  const CibilField = ({ label, value, status, onValueChange, onStatusChange, placeholder, icon: Icon }) => {
    const [localValue, setLocalValue] = useState(value || 0);
    const [localStatus, setLocalStatus] = useState(status || '');
    
    // Sync with formik values when they change externally
    useEffect(() => {
      setLocalValue(value || 0);
    }, [value]);
    
    useEffect(() => {
      setLocalStatus(status || '');
    }, [status]);
    
    const handleValueChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
    };
    
    const handleStatusChange = (e) => {
      const newStatus = e.target.value;
      setLocalStatus(newStatus);
      onStatusChange(e);
    };
    
    // Update formik only when input loses focus (onBlur)
    const handleBlur = () => {
      onValueChange({ target: { value: localValue } });
      // Auto-set status based on value
      if (localValue > 0) {
        onStatusChange({ target: { value: 'Negative' } });
      } else {
        onStatusChange({ target: { value: 'Positive' } });
      }
    };
    
    return (
      <div className={`p-3 rounded-lg border transition-all duration-200 ${
        isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />}
            <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {label}
            </span>
          </div>
          {statusBadge(localStatus, localValue)}
        </div>
        
        <div className="space-y-2">
          <input
            type="number"
            value={localValue}
            onChange={handleValueChange}
            onBlur={handleBlur}
            className={inputClassName}
            placeholder={placeholder}
            min="0"
          />
          <select
            value={localStatus}
            onChange={handleStatusChange}
            className={selectClassName}
          >
            <option value="">Select Status</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
      </div>
    );
  };
  
  // EMI & Comments Field Component with local state
  const EmiCommentsField = () => {
    const [localEmi, setLocalEmi] = useState(formik.values.totalEmiAsCibil || '');
    const [localComments, setLocalComments] = useState(formik.values.cibilComment || '');
    
    // Sync with formik values when they change externally
    useEffect(() => {
      setLocalEmi(formik.values.totalEmiAsCibil || '');
    }, [formik.values.totalEmiAsCibil]);
    
    useEffect(() => {
      setLocalComments(formik.values.cibilComment || '');
    }, [formik.values.cibilComment]);
    
    const handleEmiChange = (e) => {
      setLocalEmi(e.target.value);
    };
    
    const handleCommentsChange = (e) => {
      setLocalComments(e.target.value);
    };
    
    const handleEmiBlur = () => {
      formik.setFieldValue('totalEmiAsCibil', localEmi);
    };
    
    const handleCommentsBlur = () => {
      formik.setFieldValue('cibilComment', localComments);
    };
    
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelClassName}>Total EMI as per CIBIL (₹)</label>
          <input
            type="number"
            value={localEmi}
            onChange={handleEmiChange}
            onBlur={handleEmiBlur}
            className={inputClassName}
            placeholder="60000"
            min="0"
            required
          />
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Required - can be 0
          </div>
        </div>
        <div className="space-y-2">
          <label className={labelClassName}>Comments</label>
          <textarea
            rows="3"
            value={localComments}
            onChange={handleCommentsChange}
            onBlur={handleCommentsBlur}
            className={textareaClassName}
            placeholder="Enter detailed comments about CIBIL analysis and EMI observations..."
          />
          
        </div>
      </div>
    );
  };
  
  const DpdStatusField = () => {
    const [localDpd, setLocalDpd] = useState(formik.values.dpd || '');
    const [localDpdStatus, setLocalDpdStatus] = useState(formik.values.dpdStatus || '');
    
    // Sync with formik values when they change externally
    useEffect(() => {
      setLocalDpd(formik.values.dpd || '');
    }, [formik.values.dpd]);
    
    useEffect(() => {
      setLocalDpdStatus(formik.values.dpdStatus || '');
    }, [formik.values.dpdStatus]);
    
    const handleDpdChange = (e) => {
      const newValue = e.target.value;
      setLocalDpd(newValue);
      formik.setFieldValue('dpd', newValue);
      
      // Auto-set verification status
      if (newValue === 'Nil') {
        setLocalDpdStatus('Positive');
        formik.setFieldValue('dpdStatus', 'Positive');
      } else if (newValue === 'Irregular') {
        setLocalDpdStatus('Negative');
        formik.setFieldValue('dpdStatus', 'Negative');
      }
    };
    
    const handleDpdStatusChange = (e) => {
      const newValue = e.target.value;
      setLocalDpdStatus(newValue);
      formik.setFieldValue('dpdStatus', newValue);
    };
    
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClassName}>DPD Status</label>
            <select
              value={localDpd}
              onChange={handleDpdChange}
              className={selectClassName}
            >
              <option value="">Select DPD</option>
              <option value="Nil">Nil</option>
              <option value="Irregular">Irregular</option>
            </select>
          </div>
          <div>
            <label className={labelClassName}>DPD Verification</label>
            <select
              value={localDpdStatus}
              onChange={handleDpdStatusChange}
              className={selectClassName}
            >
              <option value="">Select Status</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
        </div>
      </div>
    );
  };
  
  // Final Report Field Component with local state
  const FinalReportField = () => {
    const [localFinalReport, setLocalFinalReport] = useState(formik.values.cibilFinalReport || '');
    
    // Sync with formik values when they change externally
    useEffect(() => {
      setLocalFinalReport(formik.values.cibilFinalReport || '');
    }, [formik.values.cibilFinalReport]);
    
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalFinalReport(newValue);
      handleFinalReportChange(e); // Use the new handler
    };
    
    return (
      <div className="flex-1 max-w-xs">
        <label className={labelClassName}>Final Report</label>
        <select
          value={localFinalReport}
          onChange={handleChange}
          className={selectClassName}
        >
          <option value="">Select Final Report</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
      </div>
    );
  };

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
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <CreditCard className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              CIBIL Verification
            </h3>
          </div>
          <button
            onClick={() => window.open('https://dc.cibil.com/DE/ccir/Login.aspx', '_blank')}
            className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isDark 
                ? "bg-orange-600 hover:bg-orange-500 text-white border border-orange-500" 
                : "bg-orange-500 hover:bg-orange-600 text-white border border-orange-400"
            }`}
          >
            Verification Link
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Customer Information - Single Line */}
        <div className={`mb-6 p-4 rounded-lg border ${
          isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
        }`}>
          <h4 className={`font-medium mb-3 flex items-center space-x-2 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}>
            <BarChart3 className="w-4 h-4" />
            <span>Customer CIBIL Information</span>
            {loadingCustomer && (
              <div className={`text-xs flex items-center space-x-1 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Loading...</span>
              </div>
            )}
          </h4>
          
          {customerData ? (
            <div className="space-y-4">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="min-w-0">
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>Name</div>
                  <div className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`} title={`${customerData.fname} ${customerData.lname}`}>
                    {customerData.fname} {customerData.lname}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>Mobile</div>
                  <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {customerData.phone || 'N/A'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>Email</div>
                  <div className={`font-medium text-xs truncate ${isDark ? "text-white" : "text-gray-900"}`} title={customerData.email}>
                    {customerData.email || 'N/A'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>CRN</div>
                  <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {customerData.crnno || 'N/A'}
                  </div>
                </div>
              </div>
              
              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="min-w-0">
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>Applied Amount</div>
                  <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    ₹{customerData.applied_amount || 'N/A'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>PAN</div>
                  <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {customerData.pan_no || 'N/A'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>Aadhar</div>
                  <div className={`font-medium text-xs ${isDark ? "text-white" : "text-gray-900"}`}>
                    {customerData.aadhar_no || 'N/A'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>DoB</div>
                  <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {customerData.dob || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {loadingCustomer ? 'Loading customer information...' : 'Customer information not available'}
            </div>
          )}
        </div>

        {/* Remarks and CIBIL Score in One Line */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClassName}>CIBIL Remarks</label>
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
              className={textareaClassName}
              placeholder="Enter CIBIL verification remarks..."
            />
            <div className={`flex justify-between items-center mt-2 text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              <span>{(localRemarkValue?.length || 0)} characters</span>
              <span>💾 Auto-saves after 2 seconds</span>
            </div>
          </div>

          <CibilScoreField />
        </div>

        {/* Loan Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CibilField
            label="Active Loans"
            value={formik.values.totalActiveLoans}
            status={formik.values.activeLoanStatus}
            onValueChange={(e) => handleStatusChange('totalActiveLoans', 'activeLoanStatus', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('activeLoanStatus', e.target.value)}
            placeholder="2"
            icon={CreditCard}
          />

          <CibilField
            label="Closed Loans"
            value={formik.values.totalClosedLoans}
            status={formik.values.closedLoanStatus}
            onValueChange={(e) => handleStatusChange('totalClosedLoans', 'closedLoanStatus', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('closedLoanStatus', e.target.value)}
            placeholder="1"
            icon={CheckCircle}
          />

          <CibilField
            label="Write-offs"
            value={formik.values.writeOffSettled}
            status={formik.values.writeOffStatus}
            onValueChange={(e) => handleStatusChange('writeOffSettled', 'writeOffStatus', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('writeOffStatus', e.target.value)}
            placeholder="00"
            icon={XCircle}
          />

          <CibilField
            label="Overdue"
            value={formik.values.noOfOverdue}
            status={formik.values.overdueStatus}
            onValueChange={(e) => handleStatusChange('noOfOverdue', 'overdueStatus', e.target.value)}
            onStatusChange={(e) => formik.setFieldValue('overdueStatus', e.target.value)}
            placeholder="1"
            icon={AlertCircle}
          />
        </div>

        {/* EMI & Comments and DPD Status in One Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <EmiCommentsField />

          <DpdStatusField />
        </div>

        {/* Final Report and Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <FinalReportField />
          
          <button
            type="button"
            onClick={handleSaveCibilVerification}
            disabled={submittingCibil || saving || !formik.values.cibilScore || formik.values.totalEmiAsCibil === null || formik.values.totalEmiAsCibil === undefined}
            className={buttonClassName}
          >
            {(submittingCibil || saving) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{submittingCibil ? 'Saving...' : saving ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CibilVerification;