import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { TokenManager } from '@/utils/tokenManager';
import FileUploadSection from './FileUploadSection';

const LoanApplicationModal = ({ isOpen, onClose, onSuccess, userId }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [documents, setDocuments] = useState({});
  const [documentIds, setDocumentIds] = useState({}); 

  const tenureOptions = [
    { value: 10, label: '10 Days' },
    { value: 20, label: '20 Days' },
    { value: 30, label: '30 Days' },
    { value: 95, label: '95 Days' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!loanAmount.trim()) {
      newErrors.loanAmount = 'Loan amount is required';
    } else if (isNaN(loanAmount) || parseFloat(loanAmount) < 3000 || parseFloat(loanAmount) > 50000) {
      newErrors.loanAmount = 'Loan amount must be between ₹3,000 and ₹50,000';
    }

    if (!tenure) {
      newErrors.tenure = 'Please select a tenure period';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const tokenData = TokenManager.getToken();
    if (!tokenData?.token) {
      setErrors({ submit: 'You are not logged in. Please log in again.' });
      return;
    }

    if (!userId) {
      setErrors({ submit: 'User information not available. Please refresh the page.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare documents array for API
      const documentArray = [];
      
      // Map document types to API format
      if (documentIds.salarySlip1) {
        documentArray.push({
          upload: 'firstsalaryslip',
          filename: documents.salarySlip1, 
          document_id: documentIds.salarySlip1
        });
      }
      
      if (documentIds.salarySlip2) {
        documentArray.push({
          upload: 'secondsalaryslip',
          filename: documents.salarySlip2,
          document_id: documentIds.salarySlip2
        });
      }
      
      if (documentIds.salarySlip3) {
        documentArray.push({
          upload: 'thirdsalaryslip',
          filename: documents.salarySlip3,
          document_id: documentIds.salarySlip3
        });
      }
      
      if (documentIds.bankStatement) {
        documentArray.push({
          upload: 'statement',
          filename: documents.bankStatement,
          document_id: documentIds.bankStatement
        });
      }

      const requestBody = {
        "loan_amount": parseInt(loanAmount),
        "tenure": parseInt(tenure),
        "enquiry_type": "Desktop",
      };

      // Add documents if any exist
      if (documentArray.length > 0) {
        requestBody.documents = documentArray;
      }

      const response = await fetch(`https://api.atdmoney.in/api/user/apply/loan/${userId}`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${tokenData.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          resetForm();
          onClose();
        }, 1500);
      } else {
        if (result.message?.includes('not authenticated')) {
          setErrors({ submit: 'Session expired. Please log in again.' });
          TokenManager.clearAllTokens();
        } else {
          setErrors({ submit: result.message || 'Failed to apply for loan. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setLoanAmount('');
    setTenure('');
    setDocuments({});
    setDocumentIds({});
    setErrors({});
    setSuccess(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {success ? 'Application Submitted!' : 'Apply for Loan'}
            </h2>
            {!success && (
              <p className="text-xs text-gray-600 mt-0.5">Complete your application in minutes</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {success ? (
            <div className="text-center py-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Successfully Applied!
              </h3>
              <p className="text-sm text-gray-600">
                Your application is under review. We'll notify you once approved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Loan Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Loan Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="3,000 - 50,000"
                    className={`w-full pl-8 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-all ${
                      errors.loanAmount 
                        ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.loanAmount && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.loanAmount && (
                  <p className="text-red-500 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.loanAmount}
                  </p>
                )}
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Min: ₹3000</span>
                  <span>Max: ₹50,000</span>
                </div>
              </div>

              {/* Tenure Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Tenure <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-all appearance-none ${
                      errors.tenure 
                        ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    {tenureOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.tenure && (
                  <p className="text-red-500 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.tenure}
                  </p>
                )}
              </div>
              </div>

              {/* File Upload Section  */}
              <FileUploadSection
                userId={userId}
                onDocumentsUpdate={setDocuments}
                onDocumentIdsUpdate={setDocumentIds} 
                disabled={isSubmitting}
              />

              {errors.submit && (
                <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg animate-shake">
                  <p className="text-xs text-red-600 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                    {errors.submit}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-3 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationModal;