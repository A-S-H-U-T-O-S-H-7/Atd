// components/modals/ChargeICICIModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, Calendar, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { overdueApplicantService } from '@/lib/services/OverdueApplicantServices';

const ChargeICICIModal = ({
  isOpen,
  onClose,
  applicant,
  isDark,
  onChargeSubmit
}) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [chargeAmount, setChargeAmount] = useState('');
  const [emandateDetails, setEmandateDetails] = useState(null);
  const [chargeHistory, setChargeHistory] = useState([]);
  
  const modalRef = useRef(null);

  useEffect(() => {
    if (applicant && isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduleDate(tomorrow.toISOString().split('T')[0]);
      setChargeAmount(applicant.overdueAmt?.toFixed(2) || '');
      fetchEmandateDetails();
    }
  }, [applicant, isOpen]);

  // Outside click, escape key, and scroll lock functionality
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchEmandateDetails = async () => {
    if (!applicant?.id) return;
    
    setLoading(true);
    try {
      const response = await overdueApplicantService.getEmandateDetails(applicant.id);
      if (response?.success) {
        setEmandateDetails(response.e_nach);
        setChargeHistory(response.history || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching emandate details:', error);
      toast.error('Failed to load emandate details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!scheduleDate || !chargeAmount || !applicant?.id) return;

    const amount = parseFloat(chargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid charge amount');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Scheduling charge...');
    
    try {
      const scheduleData = {
        id: applicant.id,
        identifier: emandateDetails?.identifier || '',
        transaction: emandateDetails?.transactionId || '',
        amount: amount,
        schedule_date: scheduleDate
      };

      const response = await overdueApplicantService.scheduleCharge(scheduleData);
      
      if (response?.success) {
        toast.success(response.message || 'Charge scheduled successfully!', { id: toastId });
        
        if (onChargeSubmit) {
          onChargeSubmit({ ...scheduleData, response });
        }
        
        setChargeHistory(response.history || []);
        fetchEmandateDetails(); // Refresh data
      } else {
        // Handle API response with success: false
        let errorMessage = response?.message || 'Failed to schedule charge';
        
        // Extract more detailed error from paymentMethod
        if (response?.error?.paymentMethod?.error?.desc) {
          errorMessage = response.error.paymentMethod.error.desc;
        } else if (response?.error?.paymentMethod?.paymentTransaction?.errorMessage) {
          errorMessage = response.error.paymentMethod.paymentTransaction.errorMessage;
        } else if (response?.paymentMethod?.error?.desc) {
          errorMessage = response.paymentMethod.error.desc;
        } else if (response?.paymentMethod?.paymentTransaction?.errorMessage) {
          errorMessage = response.paymentMethod.paymentTransaction.errorMessage;
        }
        
        toast.error(errorMessage, { id: toastId, duration: 5000 });
      }
    } catch (error) {
      console.error('Error scheduling charge:', error);
      toast.error(error.message || 'Failed to schedule charge', { id: toastId, duration: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  // Keep the existing handleOutsideClick for backward compatibility
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return dateTimeString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateTimeString;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm" 
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-emerald-600/30' : 'bg-gradient-to-br from-white to-gray-50 border border-emerald-300'}`}
      >
        
        <div className={`px-4 py-3 border-b rounded-t-xl ${isDark ? 'border-emerald-600/50 bg-gradient-to-r from-gray-800 to-gray-900' : 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-900/30 border border-emerald-600/30' : 'bg-emerald-100 border border-emerald-200'}`}>
                <CreditCard className={isDark ? 'text-emerald-400' : 'text-emerald-600'} size={20} />
              </div>
              <div>
                <h2 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                  ICICI Emandate Details Of{' '}
                  <span className={`bg-gradient-to-r ${isDark ? 'from-emerald-400 to-teal-400' : 'from-emerald-600 to-teal-600'} bg-clip-text text-transparent`}>
                    {applicant?.name || 'Applicant'}
                  </span>
                </h2>
                <p className={`text-sm font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Loan No. {applicant?.loanNo || 'N/A'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              disabled={submitting}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50 border border-emerald-600/20' : 'bg-emerald-50/50 border border-emerald-200'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Identifier
                  </label>
                  <input
                    type="text"
                    value={emandateDetails?.identifier || ''}
                    readOnly
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-900/50 border-emerald-600/30 text-gray-300' : 'bg-gray-100 border-emerald-300 text-gray-700'} cursor-not-allowed`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={emandateDetails?.transactionId || ''}
                    readOnly
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-900/50 border-emerald-600/30 text-gray-300' : 'bg-gray-100 border-emerald-300 text-gray-700'} cursor-not-allowed`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Schedule Date
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={submitting}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'bg-gray-900 border-emerald-600/50 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-white border-emerald-300 text-gray-900 focus:ring-emerald-400 focus:border-emerald-400'}`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Charge Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    min="1"
                    step="1"
                    disabled={submitting}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'bg-gray-900 border-emerald-600/50 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-white border-emerald-300 text-gray-900 focus:ring-emerald-400 focus:border-emerald-400'}`}
                    placeholder="Amount"
                    required
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Overdue: ₹{applicant?.overdueAmt?.toLocaleString('en-IN') || '0'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105 ${isDark ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Charge'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-gray-800/50 border border-emerald-600/20' : 'bg-emerald-50/50 border border-emerald-200'}`}>
            <div className={`px-4 py-3 border-b ${isDark ? 'border-emerald-600/30' : 'border-emerald-200'} ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-emerald-50 to-teal-50'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-bold text-lg ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Charge History
                </h3>
                <button
                  onClick={fetchEmandateDetails}
                  disabled={loading || submitting}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${(loading || submitting) ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'hover:bg-gray-700 text-emerald-400' : 'hover:bg-emerald-100 text-emerald-600'}`}
                >
                  <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className={`animate-spin mx-auto mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} size={24} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading charge history...</p>
              </div>
            ) : chargeHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-gradient-to-r from-gray-800/80 to-gray-900/80' : 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80'}>
                    <tr>
                      <th className={`px-4 py-3 text-left font-bold border-r ${isDark ? 'border-emerald-600/30 text-gray-300' : 'border-emerald-200 text-gray-700'}`}>Charge Date</th>
                      <th className={`px-4 py-3 text-left font-bold border-r ${isDark ? 'border-emerald-600/30 text-gray-300' : 'border-emerald-200 text-gray-700'}`}>Schedule Date</th>
                      <th className={`px-4 py-3 text-left font-bold border-r ${isDark ? 'border-emerald-600/30 text-gray-300' : 'border-emerald-200 text-gray-700'}`}>Transaction ID</th>
                      <th className={`px-4 py-3 text-left font-bold border-r ${isDark ? 'border-emerald-600/30 text-gray-300' : 'border-emerald-200 text-gray-700'}`}>Amount</th>
                      <th className={`px-4 py-3 text-left font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chargeHistory.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`border-t transition-colors duration-200 ${isDark ? 'border-emerald-600/20 hover:bg-gray-800/30' : 'border-emerald-200 hover:bg-emerald-50/30'}`}
                      >
                        <td className={`px-4 border-r py-3 ${isDark ? 'text-gray-300 border-emerald-900' : 'text-gray-600 border-emerald-200'}`}>
                          {item.created_at ? formatDateTime(item.created_at) : (item.charge_date ? formatDateTime(item.charge_date) : 'N/A')}
                        </td>
                        <td className={`px-4 py-3 border-r font-medium ${isDark ? 'text-gray-200 border-emerald-900' : 'text-gray-700 border-emerald-200'}`}>
                          {item.schedule_date ? formatDate(item.schedule_date) : 'N/A'}
                        </td>
                        <td className={`px-4 py-3 border-r font-mono font-semibold ${isDark ? 'text-emerald-300 border-emerald-900' : 'text-emerald-600 border-emerald-200'}`}>
                          {item.transaction_id || item.transactionId || 'N/A'}
                        </td>
                        <td className={`px-4 py-3 border-r font-bold ${isDark ? 'text-gray-100 border-emerald-900' : 'text-gray-900 border-emerald-200'}`}>
                          ₹{parseFloat(item.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col space-y-1">
                            <span className={`text-xs px-2 py-1 rounded-full text-center ${item.status_code === '0300' || item.status_code === '0398' ? 
                              (isDark ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/30' : 'bg-yellow-100 text-yellow-800 border border-yellow-200') : 
                              item.status_code === '0000' ? 
                              (isDark ? 'bg-green-900/40 text-green-300 border border-green-700/30' : 'bg-green-100 text-green-800 border border-green-200') : 
                              (isDark ? 'bg-red-900/40 text-red-300 border border-red-700/30' : 'bg-red-100 text-red-800 border border-red-200')
                            }`}>
                              Code: {item.status_code || 'N/A'}
                            </span>
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Message: <span className="font-medium">{item.status_message || 'N/A'}</span>
                            </span>
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Reason: <span className="font-medium">{item.status_reason || item.errorMessage || 'N/A'}</span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className={`p-4 rounded-lg inline-block ${isDark ? 'bg-gray-800/50' : 'bg-emerald-100/50'}`}>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No charge history found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargeICICIModal;