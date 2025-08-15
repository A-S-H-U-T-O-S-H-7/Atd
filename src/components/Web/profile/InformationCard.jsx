'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, CreditCard, Calendar, DollarSign, Percent } from 'lucide-react';

// Modal Component
function LoanHistoryModal({ isOpen, onClose, loanHistory }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md  bg-opacity-50 z-50 flex items-center justify-center p-4">
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
          {loanHistory && loanHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-teal-50 border-b border-blue-200">
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Loan ID</th>
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Amount</th>
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Duration</th>
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Interest Rate</th>
                    <th className="text-left p-4 font-semibold text-blue-800 border-r border-blue-200">Applied Date</th>
                    <th className="text-left p-4 font-semibold text-blue-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loanHistory.map((loan, index) => (
                    <tr key={index} className="border-b border-blue-100 hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 border-r border-blue-100">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-slate-800">#{loan.id}</span>
                        </div>
                      </td>
                      <td className="p-4 border-r border-blue-100">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-slate-800">₹{loan.amount}</span>
                        </div>
                      </td>
                      <td className="p-4 border-r border-blue-100">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{loan.duration} months</span>
                        </div>
                      </td>
                      <td className="p-4 border-r border-blue-100">
                        <div className="flex items-center space-x-1">
                          <Percent className="w-4 h-4 text-purple-500" />
                          <span>{loan.interestRate}% p.a.</span>
                        </div>
                      </td>
                      <td className="p-4 border-r border-blue-100 text-slate-600">
                        {loan.appliedDate}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          loan.status === 'completed' ? 'bg-green-100 text-green-700' :
                          loan.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {loan.status?.toUpperCase()}
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

// Main Component
export default function LoanInformation({ loanHistory = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckHistory = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative rounded-full w-full bg-gradient-to-r from-blue-100 via-teal-100 to-cyan-100 border border-cyan-300 shadow-md px-6 py-2 flex flex-col items-center justify-between gap-2 overflow-hidden">
        
        {/* Content - Image */}
        <div className="relative z-10 flex-shrink-0">
          <div className="relative">
            <Image src="/loanhistory.png" alt="Loan History" width={100} height={180} className="rounded-xl" />
            {/* Subtle glow effect around image */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-xl blur-lg -z-10 scale-110"></div>
          </div>
        </div>

        {/* Text and Button */}
        <div className="relative z-10 flex flex-col justify-between items-center w-full gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-blue-700 mb-2 drop-shadow-sm">View Your Loan History</h3>
            <p className="text-blue-600/80 text-xs font-medium">Track all your loan applications & status</p>
          </div>

          <button
            onClick={handleCheckHistory}
            className="relative cursor-pointer bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden group"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10">Check History</span>
          </button>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-transparent rounded-br-2xl"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-cyan-200/30 to-transparent rounded-tl-2xl"></div>
      </div>

      {/* Modal */}
      <LoanHistoryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        loanHistory={loanHistory} 
      />
    </>
  );
}