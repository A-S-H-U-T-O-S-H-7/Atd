'use client';

import { useState } from 'react';
import Image from 'next/image';
import { fetchLoanHistory } from '@/lib/services/user/LoanHistory';
import LoanHistoryModal from './LoanHistoryModal';

export default function LoanInformation({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanHistory, setLoanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLoanHistoryData = async () => {
  setIsLoading(true);
  setError(null); 
  
  try { 
    let token = localStorage.getItem('user_auth_token') || 
                sessionStorage.getItem('admin_view_token');
    
    if (!token) {
      setError('Please login again to view loan history');
      setIsLoading(false);
      return;
    }
    
    const result = await fetchLoanHistory(token);
    
    if (result.success) {
      setLoanHistory(result.loans || []);
    } else {
      setError(result.message || 'Failed to fetch loan history');
    }
  } catch (err) {
    setError('Unable to load loan history. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleCheckHistory = () => {
    setIsModalOpen(true);
    fetchLoanHistoryData();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  return (
    <>
      <div className="relative rounded-full w-full bg-gradient-to-r from-blue-100 via-teal-100 to-cyan-100 border border-cyan-300 shadow-md px-2 md:px-6 py-2 flex flex-col items-center justify-between gap-2 overflow-hidden">
        
        {/* Content - Image */}
        <div className="relative z-10 flex-shrink-0">
          <div className="relative">
            <Image 
              src="/loanhistory2.png" 
              alt="Loan History" 
              width={110} 
              height={180} 
              className="rounded-xl" 
            />
            {/* Subtle glow effect around image */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-xl blur-lg -z-10 scale-110"></div>
          </div>
        </div>

        {/* Text and Button */}
        <div className="relative z-10 flex flex-col justify-between items-center w-full gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-bold text-blue-700 mb-2 drop-shadow-sm">
              View Your Loan History
            </h3>
            <p className="text-blue-600/80 text-xs font-medium">
              Track all your loan applications & status
            </p>
          </div>
 
          <button
            onClick={handleCheckHistory}
            disabled={isLoading}
            className="relative cursor-pointer bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10">
              {isLoading ? 'Loading...' : 'Check History'}
            </span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm mt-2 text-center">
            {error}
          </div>
        )}

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-transparent rounded-br-2xl"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-cyan-200/30 to-transparent rounded-tl-2xl"></div>
      </div>

      {/* Modal */}
      <LoanHistoryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        loanHistory={loanHistory}
        isLoading={isLoading}
      />
    </>
  );
}