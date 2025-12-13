import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Package, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react';

const CourierPickedModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isDark, 
  customerName, 
  loanNo 
}) => {
  const [pickedDate, setPickedDate] = useState('');
  const [isPicked, setIsPicked] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const modalRef = useRef(null);

  // Outside click, escape key, and scroll lock functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !isSubmitting) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(isPicked, isPicked ? pickedDate : null);
      setPickedDate('');
      setIsPicked(true);
      onClose();
    } catch (error) {
      console.error('Error submitting courier picked status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setPickedDate('');
      setIsPicked(true);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <div 
        ref={modalRef}
        className={`
          max-w-md w-full rounded-2xl shadow-2xl border-2 
          ${isDark 
            ? 'bg-gray-800 border-emerald-600/50' 
            : 'bg-white border-emerald-300'
          }
        `}
      >
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
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`
                  text-xl font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Courier Picked
                </h2>
                <p className={`
                  text-sm
                  ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  Record courier pickup status
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
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

            {/* Yes/No Toggle */}
            <div className="space-y-3">
              <label className={`
                block text-sm font-medium
                ${isDark ? 'text-gray-300' : 'text-gray-700'}
              `}>
                Courier Pickup Status
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => !isSubmitting && setIsPicked(true)}
                  disabled={isSubmitting}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 flex-1 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    isPicked
                      ? isDark
                        ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400'
                        : 'bg-emerald-100 border-emerald-500 text-emerald-700'
                      : isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isPicked ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                  <span>Yes, Picked Up</span>
                </button>

                <button
                  type="button"
                  onClick={() => !isSubmitting && setIsPicked(false)}
                  disabled={isSubmitting}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 flex-1 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    !isPicked
                      ? isDark
                        ? 'bg-red-900/30 border-red-500 text-red-400'
                        : 'bg-red-100 border-red-500 text-red-700'
                      : isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {!isPicked ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                  <span>No, Not Picked</span>
                </button>
              </div>
            </div>

            {/* Date Input - Only show when "Yes" is selected */}
            {isPicked && (
              <div className="space-y-2">
                <label 
                  htmlFor="pickedDate"
                  className={`
                    block text-sm font-medium
                    ${isDark ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Pickup Date 
                </label>
                <div className="relative">
                  <Calendar className={`
                    absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                    ${isDark ? 'text-gray-400' : 'text-gray-500'}
                  `} />
                  <input
                    type="date"
                    id="pickedDate"
                    value={pickedDate}
                    onChange={(e) => !isSubmitting && setPickedDate(e.target.value)}
                    disabled={isSubmitting}
                    max={new Date().toISOString().split('T')[0]}
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                      ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-600'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:bg-gray-50'
                      }
                      focus:ring-4 focus:ring-emerald-500/20 focus:outline-none
                    `}
                    required
                  />
                </div>
                <p className={`
                  text-xs
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Select the date when courier picked up the documents
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
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
                disabled={isSubmitting || (isPicked && !pickedDate)}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200
                  flex items-center justify-center space-x-2
                  ${isSubmitting || (isPicked && !pickedDate)
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
                    <Package className="w-4 h-4" />
                    <span>Confirm Status</span>
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

export default CourierPickedModal;