import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, Check, X, CheckCircle, AlertCircle } from 'lucide-react';
import { eligibilityAPI, formatEligibilityForUI, formatRejectionStatusForUI } from '@/lib/services/EligibilityServices';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useNavigation } from '@/hooks/useNavigation';

// Toast Component
const Toast = ({ message, type, onClose }) => { 
  const { theme } = useThemeStore();
    const isDark = theme === "dark";
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border-2 flex items-center space-x-3 max-w-md transform transition-all duration-300 ${
      type === 'success' 
        ? isDark 
          ? 'bg-green-800 border-green-600 text-green-100'
          : 'bg-green-50 border-green-200 text-green-800'
        : isDark
          ? 'bg-red-800 border-red-600 text-red-100'
          : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className={`text-sm font-medium hover:opacity-70 ${
          type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}
      >
        ×
      </button>
    </div>
  );
};

const LoanEligibility = ({ enquiry }) => {
const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRejectionId, setSelectedRejectionId] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
    const { navigateBack } = useNavigation();


  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  }; 

  // Close toast function
  const closeToast = () => {
    setToast(null);
  };

  // Fetch eligibility data and rejection reasons on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch eligibility data
        const eligibilityResponse = await eligibilityAPI.getEligibilityData(enquiry.id);
        
        if (eligibilityResponse.success) {
          const formattedData = formatEligibilityForUI(eligibilityResponse);
          setEligibilityData(formattedData);
        } else {
          showToast('Failed to load eligibility data', 'error');
        }

        // Fetch rejection reasons
        const rejectionResponse = await eligibilityAPI.getRejectionStatuses();
        
        if (rejectionResponse.success) {
          const formattedReasons = formatRejectionStatusForUI(rejectionResponse);
          setRejectionReasons(formattedReasons);
        } else {
          showToast('Failed to load rejection reasons', 'error');
        }
      } catch (error) {
        showToast('Failed to load eligibility data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (enquiry?.id) {
      fetchData();
    }
  }, [enquiry?.id]);

  // Simplified validation schema - only validate required user inputs
  const validationSchema = Yup.object({
    
    finalRecommended: Yup.number()
      .min(0, 'Final recommended amount must be positive')
      .required('Final recommended amount is required'),
  });

  // Initial form values
  const initialValues = eligibilityData ? {
    ...eligibilityData,
    maximumLimit: eligibilityData.maximumLimit?.toString() || '',
    finalRecommended: eligibilityData.finalRecommended?.toString() || ''
  } : {
    name: '',
    grossSalary: '',
    netSalary: '',
    totalExitingEMI: '',
    balance: '',
    min20PercentOfBalance: '',
    max30PercentOfBalance: '',
    maximumLimit: '',
    finalRecommended: ''
  };

  const handleApprove = async (values) => {
    try {
      setSubmitting(true);

       const approvedAmount = parseFloat(values.finalRecommended);
        const maxLimit = parseFloat(values.maximumLimit);
        
        if (isNaN(approvedAmount) ) {
            showToast('Please enter valid numbers', 'error');
            setSubmitting(false);
            return;
        }
        
        if (approvedAmount <= 0 ) {
            showToast('Amounts must be greater than 0', 'error');
            setSubmitting(false);
            return;
        }
      
      const response = await eligibilityAPI.updateEligibility({
        id: eligibilityData.id,
        approved_amount: approvedAmount,
        max_limit: maxLimit
      });

      if (response.success) {
    showToast(response.message || 'Loan application approved successfully!', 'success');
        setTimeout(() => {
          navigateBack();
        }, 1000);
      } else {
        setSubmitting(false); 
      }
    } catch (error) {
    showToast(response.message || 'Approval failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRejectionId) {
      showToast('Please select a rejection reason', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const selectedReason = rejectionReasons.find(r => r.id === parseInt(selectedRejectionId));
      
      const response = await eligibilityAPI.rejectLoan({
        id: eligibilityData.id,
        remark: selectedReason.reason
      });

      if (response.success) {
        showToast('Loan application rejected successfully!', 'success');
        setShowRejectModal(false);
        setTimeout(() => {
          navigateBack();
        }, 1000);
      } else {
        setSubmitting(false); 
      }
    } catch (error) {
      showToast('Failed to reject loan application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Custom Field component for better styling
  const CustomField = ({ 
    name, 
    label, 
    type = "number", 
    placeholder, 
    readOnly = false, 
    helpText
  }) => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        isDark ? "text-gray-200" : "text-gray-700"
      }`}>
        {label}:
      </label>
      <Field name={name}>
        {({ field, meta }) => (
          <>
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              readOnly={readOnly}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                readOnly
                  ? isDark
                    ? "bg-slate-700 border-gray-500 text-gray-100 cursor-not-allowed"
                    : "bg-slate-100 border-gray-400 text-gray-600 cursor-not-allowed"
                  : isDark
                    ? `bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400 ${
                        meta.touched && meta.error ? 'border-red-500' : ''
                      }`
                    : `bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500 ${
                        meta.touched && meta.error ? 'border-red-500' : ''
                      }`
              } focus:ring-1 focus:ring-emerald-500/20 focus:outline-none`}
            />
            {helpText && (
              <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {helpText}
              </p>
            )}
            <ErrorMessage name={name}>
              {msg => <div className="text-red-500 text-sm mt-1">{msg}</div>}
            </ErrorMessage>
          </>
        )}
      </Field>
    </div>
  );

  // Rejection Modal Component
  const RejectModal = () => (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-2xl shadow-2xl border-2 p-6 w-full max-w-md mx-4 ${
        isDark
          ? "bg-gray-800 border-gray-600"
          : "bg-white border-gray-300"
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          Reject Loan Application
        </h3>
        
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}>
            Reason for Rejection:
          </label>
          <select
            value={selectedRejectionId}
            onChange={(e) => setSelectedRejectionId(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white focus:border-red-400"
                : "bg-gray-100 border-gray-300 text-gray-900 focus:border-red-500"
            } focus:ring-4 focus:ring-red-500/20 focus:outline-none`}
          >
            <option value="">Select a reason...</option>
            {rejectionReasons.map((reason) => (
              <option key={reason.id} value={reason.id}>
                {reason.reason}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowRejectModal(false)}
            disabled={submitting}
            className={`flex-1 cursor-pointer px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              isDark
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Cancel
          </button>
          <button
  onClick={handleReject}
  disabled={submitting}
  className={`flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 ${
    submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  }`}
>
            {submitting ? 'Rejecting...' : 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading eligibility data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-4 md:p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleApprove}
          enableReinitialize={true}
        >
          {({ values, isValid, errors, touched }) => (
            <Form>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-4">
                  <button 
                    type="button"
                    onClick={navigateBack}
                    className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                        : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                    }`}
                  >
                    <ArrowLeft className={`w-5 h-5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                  </button>
                  <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                  } bg-clip-text text-transparent`}>
                    Loan Eligibility of {values.name || 'Applicant'}
                  </h1>
                </div>
              </div>

              {/* Eligibility Form */}
              <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden relative ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
                  : "bg-white border-emerald-300 shadow-emerald-500/10"
              }`}>
                <div className="p-8 pb-20">
                  <h2 className={`text-xl font-semibold mb-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    Eligibility Calculation
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <CustomField
                        name="name"
                        label="Applicant Name"
                        type="text"
                        placeholder="Applicant name"
                        readOnly={true}
                      />

                      <CustomField
                        name="grossSalary"
                        label="Gross Salary (₹)"
                        placeholder="Gross salary"
                        readOnly={true}
                      />

                      <CustomField
                        name="netSalary"
                        label="Net Salary (₹)"
                        placeholder="Net salary"
                        readOnly={true}
                      />

                      <CustomField
                        name="totalExitingEMI"
                        label="Total Existing EMI (₹)"
                        placeholder="Total EMI"
                        readOnly={true}
                      />

                      <CustomField
                        name="maximumLimit"
                        label="Maximum Limit (₹)"
                        placeholder="Enter maximum limit"
                      />

                      <CustomField
                        name="finalRecommended"
                        label="Final Recommended (₹)"
                        placeholder="Enter final recommended amount"
                      />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <CustomField
                        name="balance"
                        label="Balance (₹)"
                        placeholder="Balance"
                        helpText="Net Salary - Total EMI"
                        readOnly={true}
                      />

                      <CustomField
                        name="min20PercentOfBalance"
                        label="Min 20% of Balance (₹)"
                        placeholder="20% of balance"
                        helpText="20% of Balance"
                        readOnly={true}
                      />

                      <CustomField
                        name="max30PercentOfBalance"
                        label="Max 30% of Balance (₹)"
                        placeholder="30% of balance"
                        helpText="30% of Balance"
                        readOnly={true}
                      />
                      
                      {/* Reference Info */}
                      <div className={`p-4 rounded-xl border-2 ${
                        isDark ? "bg-gray-700/50 border-gray-600 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}>
                        <p className="text-sm font-medium mb-2">Reference Range:</p>
                        <p className="text-xs">
                          Recommended amount typically falls between 20%-30% of available balance
                        </p>
                        <p className="text-xs mt-1">
                          Range: ₹{values.min20PercentOfBalance} - ₹{values.max30PercentOfBalance}
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end mt-8 space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowRejectModal(true)}
                          disabled={submitting}
                          className={`px-6 py-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl ${
                            submitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <X size={18} />
                          <span>Reject</span>
                        </button>
                        
                        <button
  type="submit"
  disabled={!isValid || submitting}
  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl ${
    isValid && !submitting
      ? "bg-green-500 hover:bg-green-600 text-white"
      : "bg-gray-400 text-gray-200 cursor-not-allowed"
  }`}
>
                          <Check size={18} />
                          <span>{submitting ? 'Updating...' : 'Update'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {/* Rejection Modal */}
        {showRejectModal && <RejectModal />}
        
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}
      </div>
    </div>
  );
};

export default LoanEligibility;