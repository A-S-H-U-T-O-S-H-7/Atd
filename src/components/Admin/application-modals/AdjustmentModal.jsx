import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';

const AdjustmentModal = ({ isOpen, onClose, applicant, isDark, onSubmit }) => {
  const [adjustmentType, setAdjustmentType] = useState('');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const modalRef = useRef(null);

  // Get today's date in YYYY-MM-DD format for the max attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateForm = () => {
    if (!adjustmentType) {
      return 'Please select adjustment type';
    }
    if (!adjustmentAmount || parseFloat(adjustmentAmount) <= 0) {
      return 'Please enter a valid adjustment amount greater than 0';
    }
    if (!date) {
      return 'Please select date';
    }
    if (new Date(date) > new Date()) {
      return 'Future dates are not allowed';
    }
    return null;
  };

  const resetForm = () => {
    setAdjustmentType('');
    setAdjustmentAmount('');
    setDate('');
    setRemark('');
    setError('');
    setSubmitting(false);
  };

  const handleClose = () => {
    if (!submitting) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async () => {
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const adjustmentData = {
        applicant: applicant,
        type: adjustmentType,
        amount: parseFloat(adjustmentAmount),
        date: date,
        remark: remark || 'No remark provided'
      };
      
      await onSubmit(adjustmentData);
      
      // Reset form and close on successful submission
      resetForm();
      onClose();
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit adjustment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Early return if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className={`w-full max-w-md rounded-lg shadow-2xl transform transition-all duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Adjustment for {applicant?.name || 'Applicant'}
          </h2>
          <button
            onClick={handleClose}
            disabled={submitting}
            className={`p-1 rounded-lg transition-colors ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-3 rounded-lg border ${
              isDark 
                ? 'bg-red-900/20 border-red-700 text-red-300' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X size={16} className="text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Adjustment Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Adjustment Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={adjustmentType}
                  onChange={(e) => {
                    setAdjustmentType(e.target.value);
                    setError(''); // Clear error when user starts typing
                  }}
                  disabled={submitting}
                  className={`w-full px-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    submitting ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">--Select Type--</option>
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className={`w-4 h-4 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Adjustment Amount */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Adjustment Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={adjustmentAmount}
                onChange={(e) => {
                  setAdjustmentAmount(e.target.value);
                  setError('');
                }}
                disabled={submitting}
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError('');
                }}
                disabled={submitting}
                max={getTodayDate()}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <p className={`text-xs mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Future dates are not allowed
              </p>
            </div>

            {/* Remark */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Remark
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                disabled={submitting}
                placeholder="Enter remark (optional)"
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-end space-x-3 p-6 border-t ${
          isDark ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={handleClose}
            disabled={submitting}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentModal;