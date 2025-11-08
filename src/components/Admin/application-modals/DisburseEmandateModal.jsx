import React, { useState } from 'react';
import { X, CreditCard, CheckCircle, ChevronDown } from 'lucide-react';

const DisburseEmandateModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isDark, 
  customerName, 
  loanNo 
}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedOption) {
      // Remove alert - let parent handle validation if needed
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(selectedOption);
      setSelectedOption('');
      onClose();
    } catch (error) {
      console.error('Error submitting disburse e-mandate option:', error);
      // Error handled by parent via throw
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedOption('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`
        max-w-md w-full rounded-2xl shadow-2xl border-2 
        ${isDark 
          ? 'bg-gray-800 border-emerald-600/50' 
          : 'bg-white border-emerald-300'
        }
      `}>
        {/* Header */}
        <div className={`
          p-6 border-b rounded-t-2xl
          ${isDark 
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50' 
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
          }
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`
                p-2 rounded-lg
                ${isDark 
                  ? 'bg-emerald-900/30 text-emerald-400' 
                  : 'bg-emerald-100 text-emerald-600'
                }
              `}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`
                  text-xl font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Disburse Behalf of E-mandate
                </h2>
                <p className={`
                  text-sm
                  ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  Set disbursement status
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
            {/* Customer Info */}
            <div className={`
              p-4 rounded-lg border
              ${isDark 
                ? 'bg-gray-700/30 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
              }
            `}>
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-lg
                  ${isDark 
                    ? 'bg-blue-900/30 text-blue-400' 
                    : 'bg-blue-100 text-blue-600'
                  }
                `}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    {customerName}
                  </p>
                  <p className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Loan No: {loanNo}
                  </p>
                </div>
              </div>
            </div>

            {/* Dropdown Selection */}
            <div className="space-y-2">
              <label 
                htmlFor="disburseOption"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Disburse Behalf of E-mandate Status
              </label>
              <div className="relative">
                <select
                  id="disburseOption"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 appearance-none
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:bg-gray-50'
                    }
                    focus:ring-4 focus:ring-emerald-500/20 focus:outline-none
                  `}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown className={`
                  absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
              </div>
              <p className={`
                text-xs
                ${isDark ? 'text-gray-400' : 'text-gray-500'}
              `}>
                Select whether to disburse on behalf of e-mandate
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200
                  ${isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                  }
                `}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedOption}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200
                  flex items-center justify-center space-x-2
                  ${isSubmitting || !selectedOption
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }
                `}
              >
                {isSubmitting ? (
  <>
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    <span>Saving...</span>
  </>
) : (
  <>
    <CreditCard className="w-4 h-4" />
    <span>Save</span>
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

export default DisburseEmandateModal;