import React from "react";
import { Info } from 'lucide-react';
import VideoVerification from "./VideoVerification";
import EMandate from "./EMandate";
import DigitalLoanAgreement from "./DigitalLoanAgreement";

const VerificationComponent = ({ loanStatus = 2, user }) => {
  // Loan status mapping
  const getLoanStatusLabel = (statusCode) => {
    switch (parseInt(statusCode)) {
      case 2: return 'applied';
      case 3: return 'rejected';
      case 6: return 'sanctioned';
      case 9: return 'disbursed';
      case 13: return 'closed';
      case 5: return 'inprogress';
      default: return 'applied';
    }
  };

  // Convert API status code to string label
  const statusLabel = getLoanStatusLabel(loanStatus);
  
  // Verification is enabled only when loan is sanctioned
  const isVerificationEnabled = statusLabel === 'sanctioned';

  // Tooltip component
  const Tooltip = ({ children, text, show }) => (
    <div className="relative group">
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs font-medium text-white bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-48 text-center">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );

  // Shared VerificationButton component
  const VerificationButton = ({ children, enabled, tooltipText, colorScheme, onClick, isLoading = false }) => {
    const colors = {
      blue: {
        enabled: 'border-blue-400 bg-blue-500 hover:bg-blue-600 text-white',
        disabled: 'border-blue-200 bg-blue-200 text-blue-400 cursor-not-allowed'
      },
      green: {
        enabled: 'border-green-400 bg-green-500 hover:bg-green-600 text-white',
        disabled: 'border-green-200 bg-green-200 text-green-400 cursor-not-allowed'
      },
      purple: {
        enabled: 'border-purple-400 bg-purple-500 hover:bg-purple-600 text-white',
        disabled: 'border-purple-200 bg-purple-200 text-purple-400 cursor-not-allowed'
      }
    };

    return (
      <Tooltip text={tooltipText} show={!enabled}>
        <button 
          onClick={onClick}
          className={`border-2 text-xs sm:text-sm md:text-base font-medium md:font-semibold rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-md transition-all duration-300 w-full sm:w-auto flex items-center justify-center space-x-1 ${
            enabled && !isLoading
              ? `${colors[colorScheme].enabled} hover:shadow-lg hover:scale-105` 
              : colors[colorScheme].disabled
          }`}
          disabled={!enabled || isLoading}
        >
          <span>{isLoading ? 'Processing...' : children}</span>
          {!enabled && <Info className="w-3 h-3 ml-1" />}
        </button>
      </Tooltip>
    );
  };

  // Shared VerificationIcon component
  const VerificationIcon = ({ icon: Icon, title, enabled, colorScheme }) => {
    const colors = {
      blue: {
        enabled: 'border-blue-300 bg-blue-100 text-blue-600',
        disabled: 'border-blue-100 bg-blue-50 text-blue-300'
      },
      green: {
        enabled: 'border-green-300 bg-green-100 text-green-600',
        disabled: 'border-green-100 bg-green-50 text-green-300'
      },
      purple: {
        enabled: 'border-purple-300 bg-purple-100 text-purple-600',
        disabled: 'border-purple-100 bg-purple-50 text-purple-300'
      }
    };

    return (
      <div className={`rounded-full font-semibold border-2 flex flex-col justify-center items-center text-center w-20 h-20 md:w-24 md:h-24 shadow-md transition-all duration-300 ${
        enabled ? colors[colorScheme].enabled : colors[colorScheme].disabled
      }`}>
        <Icon className={`text-base md:text-2xl transition-all duration-300`} />
        <p className={`text-xs md:text-sm font-semibold md:font-bold transition-all duration-300 ${
          enabled 
            ? (colorScheme === 'blue' ? 'text-blue-800' : colorScheme === 'green' ? 'text-green-800' : 'text-purple-800') 
            : (colorScheme === 'blue' ? 'text-blue-400' : colorScheme === 'green' ? 'text-green-400' : 'text-purple-400')
        }`}>
          {title}
        </p>
      </div>
    );
  };

  return (
    <div>
      {/* Status Message */}
      {!isVerificationEnabled && (
        <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700 font-medium text-center">
            🔒 Verification options will be available once your loan is sanctioned.
          </p>
        </div>
      )}

      {isVerificationEnabled && (
        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium text-center">
            ✅ 🎉 Congratulations! Your loan has been sanctioned. Please complete the formalities via the following steps:<br/> <span className="font-semibold text-blue-500">Video Verification</span>, <span className="font-semibold text-green-500">E-Mandate</span>, and <span className="font-semibold text-purple-500">Digital loan agreement</span>.
          </p>
        </div>
      )}
      
      <div className={`border-2 p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center rounded-2xl shadow-lg gap-4 sm:gap-6 lg:gap-4 transition-all duration-300 ${
        isVerificationEnabled 
          ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-100' 
          : 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100'
      }`}>
        
        <VideoVerification 
          enabled={isVerificationEnabled}
          VerificationIcon={VerificationIcon}
          VerificationButton={VerificationButton}
        />
        
        <EMandate 
          enabled={isVerificationEnabled}
          VerificationIcon={VerificationIcon}
          VerificationButton={VerificationButton}
        />
        
        <DigitalLoanAgreement 
          enabled={isVerificationEnabled}
          user={user}
          VerificationIcon={VerificationIcon}
          VerificationButton={VerificationButton}
        />
      </div>
    </div>
  );
};

export default VerificationComponent;