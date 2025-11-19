// components/LoanApplicationModal.jsx
import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const LoanApplicationModal = ({ isOpen, onClose, onSuccess }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const tenureOptions = [
    { value: 10, label: '10 Days' },
    { value: 20, label: '20 Days' },
    { value: 30, label: '30 Days' },
    { value: 95, label: '95 Days' } // Based on your API example
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

    setIsSubmitting(true);
    setErrors({});

    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5hdGRtb25leS5pbi9hcGkvdXNlci9sb2dpbi92ZXJpZnkiLCJpYXQiOjE3NjM0NzEwMDAsImV4cCI6MTc2NTI3MTAwMCwibmJmIjoxNzYzNDcxMDAwLCJqdGkiOiJ0NURPMWhZTnEzY0pIb0RkIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.Q86fViVmuhgWYfCRVR8Dd5sqRvAhZc-B-s-mAj5u5fQ");
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "loan_amount": parseInt(loanAmount),
        "tenure": parseInt(tenure),
        "enquiry_type": "Desktop"
      });

      const response = await fetch("https://api.atdmoney.in/api/user/apply/loan/1", {
        method: "PUT",
        headers: myHeaders,
        body: raw,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          resetForm();
          onClose();
        }, 2000);
      } else {
        setErrors({ submit: result.message || 'Failed to apply for loan. Please try again.' });
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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {success ? 'Application Submitted!' : 'Apply for New Loan'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            // Success State
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Successfully Applied!
              </h3>
              <p className="text-gray-600">
                Your loan application has been submitted successfully. We'll review your application and get back to you soon.
              </p>
            </div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Loan Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="Enter amount between 3,000 - 50,000"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.loanAmount 
                        ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.loanAmount && (
                    <div className="absolute right-3 top-3">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.loanAmount && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.loanAmount}
                  </p>
                )}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Min: ₹3,000</span>
                  <span>Max: ₹50,000</span>
                </div>
              </div>

              {/* Tenure Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Tenure
                </label>
                <div className="relative">
                  <select
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none ${
                      errors.tenure 
                        ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Tenure</option>
                    {tenureOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.tenure && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.tenure}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Applying...
                    </div>
                  ) : (
                    'Apply Now'
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