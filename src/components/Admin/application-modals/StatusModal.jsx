import React, { useState } from 'react';
import { X, Calendar, FileText, CheckCircle, Edit } from 'lucide-react';

const ChangeStatusModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isDark, 
  customerName, 
  loanNo 
}) => {
  const [originalDocumentsReceived, setOriginalDocumentsReceived] = useState('');
  const [documentsReceivedDate, setDocumentsReceivedDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // At least one field should be filled
    if (!originalDocumentsReceived && !documentsReceivedDate) {
      toast.error('Please fill at least one field to update');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare data to submit
      const updateData = {};
      if (originalDocumentsReceived) {
        updateData.originalDocumentsReceived = originalDocumentsReceived;
      }
      if (documentsReceivedDate) {
        updateData.documentsReceivedDate = documentsReceivedDate;
      }
      
      await onSubmit(updateData);
      
      // Reset form
      setOriginalDocumentsReceived('');
      setDocumentsReceivedDate('');
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      // Error handled by parent via throw
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOriginalDocumentsReceived('');
    setDocumentsReceivedDate('');
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
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`
                  text-xl font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Change Status
                </h2>
                <p className={`
                  text-sm
                  ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  Status of {customerName}
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
            {/* Original Documents Received Dropdown */}
            <div className="space-y-2">
              <label 
                htmlFor="originalDocumentsReceived"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Original Documents Received
              </label>
              <div className="relative">
                <FileText className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <select
                  id="originalDocumentsReceived"
                  value={originalDocumentsReceived}
                  onChange={(e) => setOriginalDocumentsReceived(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:bg-gray-50'
                    }
                    focus:ring-4 focus:ring-emerald-500/20 focus:outline-none
                  `}
                >
                  <option value="">Select status</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            {/* Documents Received Date - ALWAYS VISIBLE */}
            <div className="space-y-2">
              <label 
                htmlFor="documentsReceivedDate"
                className={`
                  block text-sm font-medium
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Documents Received Date 
              </label>
              <div className="relative">
                <Calendar className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `} />
                <input
                  type="date"
                  id="documentsReceivedDate"
                  value={documentsReceivedDate}
                  onChange={(e) => setDocumentsReceivedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
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
                disabled={isSubmitting || 
                  (!originalDocumentsReceived && !documentsReceivedDate)
                }
                className={`
                  flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200
                  flex items-center justify-center space-x-2
                  ${isSubmitting || 
                    (!originalDocumentsReceived && !documentsReceivedDate)
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
                    <CheckCircle className="w-4 h-4" />
                    <span>Update Status</span>
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

export default ChangeStatusModal;