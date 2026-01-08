'use client';

import { X, CreditCard } from 'lucide-react';

const LOAN_STATUS_MAP = {
  2: 'applied',
  4: 'applied',
  3: 'rejected',
  5: 'inprogress',

  6: 'sanctioned',
  7: 'sanctioned',
  8: 'sanctioned',
  9: 'sanctioned',

  10: 'disbursed',
  11: 'disbursed',
  12: 'disbursed',
  13: 'closed'
};

const STATUS_STYLES = {
  closed: 'bg-green-100 text-green-700',
  disbursed: 'bg-blue-100 text-blue-700',
  sanctioned: 'bg-purple-100 text-purple-700',
  rejected: 'bg-red-100 text-red-700',
  inprogress: 'bg-orange-100 text-orange-700',
  applied: 'bg-gray-100 text-gray-700'
};

export default function LoanHistoryModal({ isOpen, onClose, loanHistory, isLoading }) {
  if (!isOpen) return null;

  const formatLoanStatus = (statusCode) => {
    return LOAN_STATUS_MAP[statusCode] || 'applied';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusStyle = (statusCode) => {
    const status = formatLoanStatus(statusCode);
    return STATUS_STYLES[status] || STATUS_STYLES.applied;
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Loan History Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading loan history...</p>
            </div>
          ) : loanHistory && loanHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-teal-50 border-b border-blue-200">
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Loan No</th>
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Approved Amount</th>
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Disbursed Amount</th>
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Applied Date</th>
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Due Date</th>
                    <th className="text-left p-4 font-semibold text-blue-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loanHistory.map((loan, index) => (
                    <tr key={index} className="border-b border-blue-100 hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 border-r border-blue-100">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-slate-800">
                            {loan.loan_no || loan.application_id || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 border-r border-blue-100">
                        <span className="font-semibold text-slate-800">
                          {loan.approved_amount ? `₹${loan.approved_amount}` : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 border-r border-blue-100">
                        <span className="font-semibold text-slate-800">
                          {loan.disburse_amount ? `₹${loan.disburse_amount}` : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 border-r border-blue-100 text-slate-600">
                        {formatDate(loan.applied_date)}
                      </td>
                      <td className="p-4 border-r border-blue-100 text-slate-600">
                        {formatDate(loan.duedate)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(loan.loan_status)}`}>
                          {formatLoanStatus(loan.loan_status).toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Loan History Found</h3>
              <p className="text-slate-500">You haven't applied for any loans yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}