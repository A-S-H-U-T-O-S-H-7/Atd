import React, { useState } from 'react';
import { CreditCard, X, Building2, Eye, EyeOff, IndianRupee } from 'lucide-react';

const BankLoanModal = ({ isOpen, onClose, user }) => {
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 mt-20 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Bank & Loan Details</h2>
                <p className="text-emerald-100 text-xs">Financial information</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4">
            {/* Loan Information */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                <IndianRupee className="w-4 h-4 text-emerald-500 mr-2" />
                Loan Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                  <p className="font-bold text-xl text-emerald-600">₹{Number(user?.applied_amount || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Loan Tenure</p>
                  <p className="font-semibold text-base text-gray-800">{user?.tenure || 'Not specified'} days</p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                <Building2 className="w-4 h-4 text-blue-500 mr-2" />
                Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Bank Name', value: user?.bank_name },
                  { label: 'Branch', value: user?.branch_name },
                  { label: 'IFSC Code', value: user?.ifsc_code, mono: true },
                  { label: 'Account Type', value: user?.account_type }
                ].map((item, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className={`font-medium text-sm text-gray-800 ${item.mono ? 'font-mono' : ''}`}>
                      {item.value || 'Not provided'}
                    </p>
                  </div>
                ))}
                
                {/* Account Number with toggle */}
                <div className="p-3 bg-white rounded-lg md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Account Number</p>
                      <p className="font-medium text-sm text-gray-800 font-mono">
                        {showAccountNumber 
                          ? user?.account_no || 'Not provided'
                          : `****${(user?.account_no || '').slice(-4)}`
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="ml-3 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankLoanModal;