import React, { useState } from 'react';
import { X, Shield, Key, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import disbursementService from '@/lib/services/disbursementService';
import toast from 'react-hot-toast';

const DisburseStatusModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isDark, 
  customerName,
  disbursementData 
}) => {
  const [authCode1, setAuthCode1] = useState('');
  const [authCode2, setAuthCode2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!authCode1.trim()) {
      newErrors.authCode1 = 'Auth Code 1 is required';
    }
    
    if (!authCode2.trim()) {
      newErrors.authCode2 = 'Auth Code 2 is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const statusData = {
        authCode1: authCode1.trim(),
        authCode2: authCode2.trim(),
        customer_name: customerName,
        timestamp: new Date().toISOString()
      };
      
      // Call the actual API
      const response = await disbursementService.checkTransactionStatus(statusData, disbursementData);
      
      if (response.success) {
        toast.success('Transaction status checked successfully!');
        
        // Reset form
        setAuthCode1('');
        setAuthCode2('');
        setErrors({});
        
        // Call the parent onSubmit callback if provided
        if (onSubmit) {
          await onSubmit({
            ...disbursementData,
            ...statusData,
            transactionStatus: 'Checked'
          });
        }
        
        onClose();
      } else {
        throw new Error(response.message || 'Failed to check transaction status');
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
      toast.error(error.message || 'Failed to check transaction status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAuthCode1('');
    setAuthCode2('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`
        max-w-lg w-full rounded-2xl shadow-2xl border-2 
        ${isDark 
          ? 'bg-gray-800 border-orange-600/50' 
          : 'bg-white border-orange-300'
        }
      `}>
        {/* Header */}
        <div className={`
          p-6 border-b rounded-t-2xl
          ${isDark 
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-orange-600/50' 
            : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
          }
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`
                p-2 rounded-lg
                ${isDark 
                  ? 'bg-orange-900/30 text-orange-400' 
                  : 'bg-orange-100 text-orange-600'
                }
              `}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`
                  text-xl font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Transaction Status
                </h2>
                <p className={`
                  text-sm
                  ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  of {customerName || 'Customer'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${isDark 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
                }
              `}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Customer Info Display */}
            {disbursementData && (
              <div className={`
                p-4 rounded-xl border-2
                ${isDark 
                  ? 'bg-gray-700/50 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Loan No:
                    </span>
                    <p className={`${isDark ? 'text-orange-400' : 'text-orange-600'} font-semibold`}>
                      {disbursementData.loanNo}
                    </p>
                  </div>
                  <div>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Amount:
                    </span>
                    <p className={`${isDark ? 'text-green-400' : 'text-green-600'} font-semibold`}>
                      ₹{parseFloat(disbursementData.disbursedAmount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Auth Code 1 Input */}
            <div className="space-y-2">
              <label 
                htmlFor="authCode1"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Auth Code 1: <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Key className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="text"
                  id="authCode1"
                  value={authCode1}
                  onChange={(e) => {
                    setAuthCode1(e.target.value);
                    if (errors.authCode1) {
                      setErrors(prev => ({...prev, authCode1: null}));
                    }
                  }}
                  placeholder="Enter authentication code 1"
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${errors.authCode1 
                      ? 'border-red-500 focus:border-red-500' 
                      : isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:bg-gray-600'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:bg-gray-50'
                    }
                    focus:ring-4 focus:ring-orange-500/20 focus:outline-none
                  `}
                />
                {errors.authCode1 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.authCode1 && (
                <p className="text-red-500 text-sm mt-1">{errors.authCode1}</p>
              )}
            </div>

            {/* Auth Code 2 Input */}
            <div className="space-y-2">
              <label 
                htmlFor="authCode2"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Auth Code 2: <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Key className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="text"
                  id="authCode2"
                  value={authCode2}
                  onChange={(e) => {
                    setAuthCode2(e.target.value);
                    if (errors.authCode2) {
                      setErrors(prev => ({...prev, authCode2: null}));
                    }
                  }}
                  placeholder="Enter authentication code 2"
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${errors.authCode2 
                      ? 'border-red-500 focus:border-red-500' 
                      : isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:bg-gray-600'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:bg-gray-50'
                    }
                    focus:ring-4 focus:ring-orange-500/20 focus:outline-none
                  `}
                />
                {errors.authCode2 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.authCode2 && (
                <p className="text-red-500 text-sm mt-1">{errors.authCode2}</p>
              )}
            </div>



            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className={`
                  flex-1 cursor-pointer py-3 px-4 rounded-xl font-medium transition-all duration-200
                  ${isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                  }
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  flex-1 py-3 cursor-pointer px-4 rounded-xl font-medium transition-all duration-200
                  flex items-center justify-center space-x-2
                  ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                    : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transform '
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Submitting Status...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span> Submit </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisburseStatusModal;