import { Info } from 'lucide-react';

export default function LoanButtons({ loanStatus = 'applied' }) {
  const isPayNowEnabled = loanStatus === 'disbursed';
  
  const isNewLoanEnabled = loanStatus === 'closed';

  // Tooltip component
  const Tooltip = ({ children, text, show }) => (
    <div className="relative group">
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );

  const handlePayNow = () => {
    if (isPayNowEnabled) {
      console.log('Pay Now clicked');
      // Add your pay now logic here
    }
  };

  const handleApplyNewLoan = () => {
    if (isNewLoanEnabled) {
      console.log('Apply for New Loan clicked');
      // Add your new loan application logic here
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center border border-teal-200 my-5 rounded-xl px-3 py-5 bg-white  gap-4">
      {/* Pay Now Button */}
      <Tooltip 
        text={!isPayNowEnabled ? "Pay Now is available only after loan disbursement" : ""}
        show={!isPayNowEnabled}
      >
        <button 
          onClick={handlePayNow}
          className={`flex-1 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 ease-out border ${
            isPayNowEnabled
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl transform hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-700 border-emerald-400/20 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 opacity-60'
          }`}
          disabled={!isPayNowEnabled}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>Pay Now</span>
            {!isPayNowEnabled && <Info className="w-4 h-4" />}
          </div>
        </button>
      </Tooltip>
      
      {/* Apply For New Loan Button */}
      <Tooltip 
        text={!isNewLoanEnabled ? "New loan applications are available only after current loan closure" : ""}
        show={!isNewLoanEnabled}
      >
        <button 
          onClick={handleApplyNewLoan}
          className={`flex-1 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 ease-out border ${
            isNewLoanEnabled
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl transform hover:-translate-y-0.5 hover:from-blue-600 hover:to-purple-700 border-blue-400/20 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 opacity-60'
          }`}
          disabled={!isNewLoanEnabled}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>Apply For New Loan</span>
            {!isNewLoanEnabled && <Info className="w-4 h-4" />}
          </div>
        </button>
      </Tooltip>
    </div>
  );
}