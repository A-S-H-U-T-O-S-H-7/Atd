// components/LoanButtons.jsx
import { Info } from 'lucide-react';

const LoanButtons = ({ loanStatus = 2, onApplyNewLoan, onPayNow }) => {
  const getLoanStatusLabel = (statusCode) => {
    switch (parseInt(statusCode)) {
      case 2: return 'applied';
      case 3: return 'rejected';
      case 6: return 'sanctioned';

      case 10: return 'disbursed';
      case 11: return 'disbursed';
      case 12: return 'disbursed';

      case 13: return 'closed';
      case 5: return 'inprogress';
      default: return 'applied';
    }
  };

  const statusLabel = getLoanStatusLabel(loanStatus);
  const isPayNowEnabled = statusLabel === 'disbursed';
  const isNewLoanEnabled = statusLabel === 'closed';

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
    if (isPayNowEnabled && onPayNow) {
      onPayNow();
    }
  };

  const handleApplyNewLoan = () => {
    if (isNewLoanEnabled) {
      onApplyNewLoan();
    }
  };

  return (
    <div className="flex flex-row items-center justify-center border border-teal-200 my-5 rounded-md md:rounded-xl px-1 md:px-3 py-3 md:py-5 bg-white gap-4">
      {/* Pay Now Button */}
      <Tooltip 
        text={!isPayNowEnabled ? "Pay Now is available only after loan disbursement" : ""}
        show={!isPayNowEnabled}
      >
        <button 
          onClick={handlePayNow}
          className={`flex-1 px-2 md:px-6 py-2 md:py-2 font-semibold rounded-md md:rounded-xl shadow-lg transition-all duration-200 ease-out border ${
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
          className={`flex-1 px-2 md:px-6 py-2 md:py-3 font-semibold rounded-md md:rounded-xl shadow-lg transition-all duration-200 ease-out border ${
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
};

export default LoanButtons;