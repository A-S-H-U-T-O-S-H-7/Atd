import React, { useState, useEffect } from 'react';
import { X, Calendar, CreditCard, IndianRupee, CheckCircle, Edit3, Hash } from 'lucide-react';

const UpdateDisbursementModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isDark, 
  disbursementData 
}) => {
  const [formData, setFormData] = useState({
    disburseAmount: '',
    disburseDate: '',
    transactionId: '',
    transactionDate: '',
    dueDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when modal opens with disbursement data
  useEffect(() => {
    if (isOpen && disbursementData) {
      setFormData({
        disburseAmount: disbursementData.disbursedAmount || '',
        disburseDate: disbursementData.disburseDate || '',
        transactionId: disbursementData.tranRefNo || '',
        transactionDate: disbursementData.tranDate || '',
        dueDate: disbursementData.dueDate || ''
      });
    }
  }, [isOpen, disbursementData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.disburseAmount.trim()) {
      alert('Please enter the Disburse Amount');
      return;
    }

    if (!formData.disburseDate) {
      alert('Please select Disburse Date');
      return;
    }

    if (!formData.transactionId.trim()) {
      alert('Please enter Transaction ID');
      return;
    }

    if (!formData.transactionDate) {
      alert('Please select Transaction Date');
      return;
    }

    if (!formData.dueDate) {
      alert('Please select Due Date');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare data to submit
      const updateData = {
        ...disbursementData,
        disbursedAmount: formData.disburseAmount.trim(),
        disburseDate: formData.disburseDate,
        tranRefNo: formData.transactionId.trim(),
        tranDate: formData.transactionDate,
        dueDate: formData.dueDate
      };
      
      await onSubmit(updateData);
      onClose();
    } catch (error) {
      console.error('Error updating disbursement:', error);
      alert('Failed to update disbursement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      disburseAmount: '',
      disburseDate: '',
      transactionId: '',
      transactionDate: '',
      dueDate: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`
        max-w-md w-full rounded-xl shadow-2xl border-2 
        ${isDark 
          ? 'bg-gray-800 border-emerald-600/50' 
          : 'bg-white border-emerald-300'
        }
      `}>
        {/* Header */}
        <div className={`
          p-4 border-b rounded-t-xl
          ${isDark 
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50' 
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
          }
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`
                p-1.5 rounded-lg
                ${isDark 
                  ? 'bg-emerald-900/30 text-emerald-400' 
                  : 'bg-emerald-100 text-emerald-600'
                }
              `}>
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`
                  text-lg font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Update Disbursement
                </h2>
                <p className={`
                  text-xs
                  ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  {disbursementData?.beneficiaryAcName || 'Customer'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`
                p-1.5 rounded-lg transition-colors duration-200
                ${isDark 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
                }
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="space-y-4">
            {/* Disburse Amount */}
            <div className="space-y-1">
              <label 
                htmlFor="disburseAmount"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Disburse Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="number"
                  id="disburseAmount"
                  value={formData.disburseAmount}
                  onChange={(e) => handleInputChange('disburseAmount', e.target.value)}
                  placeholder="Enter amount"
                  className={`
                    w-full pl-9 pr-3 py-2.5 rounded-lg border transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:bg-gray-50'
                    }
                    focus:ring-2 focus:ring-emerald-500/20 focus:outline-none
                  `}
                />
              </div>
            </div>

            {/* Disburse Date */}
            <div className="space-y-1">
              <label 
                htmlFor="disburseDate"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Disburse Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="date"
                  id="disburseDate"
                  value={formData.disburseDate}
                  onChange={(e) => handleInputChange('disburseDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`
                    w-full pl-9 pr-3 py-2.5 rounded-lg border transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:bg-gray-50'
                    }
                    focus:ring-2 focus:ring-emerald-500/20 focus:outline-none
                  `}
                />
              </div>
            </div>

            {/* Transaction ID */}
            <div className="space-y-1">
              <label 
                htmlFor="transactionId"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="text"
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  placeholder="Enter transaction ID"
                  className={`
                    w-full pl-9 pr-3 py-2.5 rounded-lg border transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:bg-gray-50'
                    }
                    focus:ring-2 focus:ring-emerald-500/20 focus:outline-none
                  `}
                />
              </div>
            </div>

            {/* Transaction Date */}
            <div className="space-y-1">
              <label 
                htmlFor="transactionDate"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Transaction Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="date"
                  id="transactionDate"
                  value={formData.transactionDate}
                  onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`
                    w-full pl-9 pr-3 py-2.5 rounded-lg border transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:bg-gray-50'
                    }
                    focus:ring-2 focus:ring-emerald-500/20 focus:outline-none
                  `}
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label 
                htmlFor="dueDate"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Due Date <span className="text-red-500">*</span>
                <span className={`
                  ml-2 text-xs
                  ${isDark ? 'text-orange-400' : 'text-orange-600'}
                `}>
                  (Check for correct value)
                </span>
              </label>
              <div className="relative">
                <Calendar className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="date"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={`
                    w-full pl-9 pr-3 py-2.5 rounded-lg border transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:bg-gray-50'
                    }
                    focus:ring-2 focus:ring-emerald-500/20 focus:outline-none
                  `}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={handleClose}
                className={`
                  flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200
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
                disabled={isSubmitting || !formData.disburseAmount.trim() || !formData.disburseDate || !formData.transactionId.trim() || !formData.transactionDate || !formData.dueDate}
                className={`
                  flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200
                  flex items-center justify-center space-x-2
                  ${isSubmitting || !formData.disburseAmount.trim() || !formData.disburseDate || !formData.transactionId.trim() || !formData.transactionDate || !formData.dueDate
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Update</span>
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

export default UpdateDisbursementModal;