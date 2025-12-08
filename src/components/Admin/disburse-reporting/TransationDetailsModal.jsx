import React, { useState, useEffect } from 'react';
import { X, CreditCard, Calendar, Building, CheckCircle } from 'lucide-react';
import disbursementService from '@/lib/services/disbursementService';
import toast from 'react-hot-toast';

const TransactionDetailsModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isDark, 
  disbursementData 
}) => {
  const [formData, setFormData] = useState({
    disbursementAmount: '',
    transactionId: '',
    transactionDate: '', 
    dueDate: '',
    bankName: '',
    branchName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banks, setBanks] = useState([]);
  const [tenure, setTenure] = useState(0); 

  // Load banks and set initial data when modal opens
  useEffect(() => {
    if (isOpen && disbursementData) {
      // Extract tenure from loan data - IN DAYS
      // The tenure should come from the API response directly
      const loanTenure = disbursementData.tenure || 0;
      setTenure(loanTenure);

      // Check if transaction already exists
      const hasExistingTransaction = disbursementData.tranRefNo && disbursementData.tranRefNo !== 'N/A';
      
      // Set initial form data from disbursementData
      // Pre-fill with existing transaction data if available
      const initialFormData = {
        disbursementAmount: disbursementData.disbursedAmount || '',
        transactionId: hasExistingTransaction ? disbursementData.tranRefNo : '',
        transactionDate: hasExistingTransaction && disbursementData.tranDate && disbursementData.tranDate !== 'N/A' ? disbursementData.tranDate : '',
        dueDate: hasExistingTransaction && disbursementData.dueDate && disbursementData.dueDate !== 'N/A' ? disbursementData.dueDate : '',
        bankName: disbursementData.atdBankId || '',
        branchName: disbursementData.atdBranchName || ''
      };
      
      setFormData(initialFormData);
      
      // If bank is pre-filled, load its branch details
      if (initialFormData.bankName && !initialFormData.branchName) {
        const loadBranchForPrefilledBank = async () => {
          try {
            const bankDetails = await disbursementService.getBankDetails(initialFormData.bankName);
            if (bankDetails && bankDetails.branch_name) {
              setFormData(prev => ({
                ...prev,
                branchName: bankDetails.branch_name
              }));
            }
          } catch (error) {
            console.error('Error loading bank branch for pre-filled bank:', error);
          }
        };
        loadBranchForPrefilledBank();
      }

      // Load banks list
      const loadBanks = async () => {
        try {
          const bankList = await disbursementService.getBanks();
          setBanks(bankList);
        } catch (error) {
          console.error('Error loading banks:', error);
          toast.error('Failed to load bank list');
        }
      };
      
      loadBanks();
    }
  }, [isOpen, disbursementData]);

  // Calculate due date when transaction date changes - NOW IN DAYS
  useEffect(() => {
    if (formData.transactionDate && tenure > 0) {
      const transactionDate = new Date(formData.transactionDate);
      const calculatedDueDate = new Date(transactionDate);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + tenure); // Add days
      
      const formattedDueDate = calculatedDueDate.toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        dueDate: formattedDueDate
      }));
    } else {
      // Clear due date if transaction date is empty
      setFormData(prev => ({
        ...prev,
        dueDate: ''
      }));
    }
  }, [formData.transactionDate, tenure]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBankChange = async (bankId) => {
    setFormData(prev => ({
      ...prev,
      bankName: bankId,
      branchName: '' // Reset branch name when bank changes
    }));

    // Load branch name automatically when bank is selected
    if (bankId) {
      try {
        const bankDetails = await disbursementService.getBankDetails(bankId);
        if (bankDetails && bankDetails.branch_name) {
          setFormData(prev => ({
            ...prev,
            branchName: bankDetails.branch_name
          }));
        }
      } catch (error) {
        console.error('Error loading bank branch:', error);
        // Continue without setting branch name
      }
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.transactionId.trim()) {
      toast.error('Please enter Transaction ID');
      return;
    }

    if (!formData.transactionDate) {
      toast.error('Please select Transaction Date');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.transactionDate > today) {
      toast.error('Transaction date cannot be in the future');
      return;
    }

    if (!formData.bankName) {
      toast.error('Please select Bank Name');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Call the actual API to update manual transaction
      const response = await disbursementService.updateTransaction(
        disbursementData.disburse_id,
        formData,
        disbursementData
      );
      
      if (response.success) {
        toast.success('Transaction updated successfully!');
        
        // Reset form
        setFormData({
          disbursementAmount: disbursementData.disbursedAmount || '',
          transactionId: '',
          transactionDate: '', // Reset to blank
          dueDate: '',
          bankName: '',
          branchName: ''
        });
        
        // Call parent onSubmit callback if provided
        if (onSubmit) {
          await onSubmit({
            ...disbursementData,
            ...formData,
            updatedAt: new Date().toISOString()
          });
        }
        
        onClose();
      } else {
        throw new Error(response.message || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error(error.message || 'Failed to update transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      disbursementAmount: disbursementData?.disbursedAmount || '',
      transactionId: '',
      transactionDate: '', // Reset to blank
      dueDate: '',
      bankName: '',
      branchName: ''
    });
    onClose();
  };

  if (!isOpen || !disbursementData) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`
        max-w-2xl w-full rounded-2xl shadow-2xl border-2 max-h-[90vh] overflow-y-auto
        ${isDark 
          ? 'bg-gray-800 border-emerald-600/50' 
          : 'bg-white border-emerald-300'
        }
      `}>
        {/* Header */}
        <div className={`
          p-6 border-b rounded-t-2xl sticky top-0 z-10
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
                  ? 'bg-blue-900/30 text-blue-400' 
                  : 'bg-blue-100 text-blue-600'
                }
              `}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`
                  text-xl font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Transaction Details
                </h2>
                <p className={`
                  text-sm
                  ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  of {disbursementData?.beneficiaryAcName} (Tenure: {tenure} days)
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Disbursement Amount - Non-editable */}
            <div className="space-y-2">
              <label 
                htmlFor="disbursementAmount"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Disbursement Amount :
              </label>
              <div className="relative">
                <CreditCard className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="text"
                  id="disbursementAmount"
                  value={formData.disbursementAmount}
                  readOnly
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700/50 border-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed'
                    }
                  `}
                />
              </div>
            </div>

            {/* Transaction ID */}
            <div className="space-y-2">
              <label 
                htmlFor="transactionId"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Transaction Id : <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="text"
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  placeholder="Enter transaction ID"
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:bg-gray-50'
                    }
                    focus:ring-4 focus:ring-emerald-500/20 focus:outline-none
                  `}
                />
              </div>
            </div>

            {/* Transaction Date */}
            <div className="space-y-2">
              <label 
                htmlFor="transactionDate"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Transaction date : <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="date"
                  id="transactionDate"
                  value={formData.transactionDate}
                  onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                  max={today}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:bg-gray-50'
                    }
                    focus:ring-4 focus:ring-emerald-500/20 focus:outline-none
                  `}
                />
              </div>
            </div>

            {/* Due Date - Non-editable */}
            <div className="space-y-2">
              <label 
                htmlFor="dueDate"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Due date :
              </label>
              <div className="relative">
                <Calendar className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="date"
                  id="dueDate"
                  value={formData.dueDate}
                  readOnly
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700/50 border-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed'
                    }
                  `}
                />
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Auto-calculated (Transaction Date + {tenure} days)
              </p>
            </div>
          </div>

          {/* ATD Bank Details Section */}
          <div className="mt-8">
            <h3 className={`
              text-lg font-semibold mb-4 pb-2 border-b
              ${isDark 
                ? 'text-emerald-400 border-emerald-600/30' 
                : 'text-emerald-600 border-emerald-200'
              }
            `}>
              ATD Bank Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bank Name */}
              <div className="space-y-2">
                <label 
                  htmlFor="bankName"
                  className={`
                    block text-sm font-medium
                    ${isDark ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Bank Name : <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className={`
                    absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                    ${isDark ? 'text-gray-400' : 'text-gray-500'}
                  `} />
                  <select
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => handleBankChange(e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:bg-gray-600'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:bg-gray-50'
                      }
                      focus:ring-4 focus:ring-emerald-500/20 focus:outline-none
                    `}
                  >
                    <option value="">--Select Bank--</option>
                    {banks.map(bank => (
                      <option key={bank.id} value={bank.id}>{bank.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Branch Name - Non-editable */}
              <div className="space-y-2">
                <label 
                  htmlFor="branchName"
                  className={`
                    block text-sm font-medium
                    ${isDark ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Branch Name :
                </label>
                <div className="relative">
                  <Building className={`
                    absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                    ${isDark ? 'text-gray-400' : 'text-gray-500'}
                  `} />
                  <input
                    type="text"
                    id="branchName"
                    value={formData.branchName}
                    readOnly
                    placeholder="Auto-filled when bank is selected"
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${isDark
                        ? 'bg-gray-700/50 border-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed'
                      }
                    `}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-8">
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
              disabled={isSubmitting || !formData.transactionId.trim() || !formData.transactionDate || !formData.bankName}
              className={`
                flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200
                flex items-center justify-center space-x-2
                ${isSubmitting || !formData.transactionId.trim() || !formData.transactionDate || !formData.bankName
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;