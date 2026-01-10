import React from "react";
import { Info } from 'lucide-react';
import VideoVerification from "./VideoVerification/VideoVerification";
import EMandate from "./EMandate";
import DigitalLoanAgreement from "./DigitalLoanAgreement";

const VerificationComponent = ({ loanStatus = 2, user }) => {
  const currentLoanStatus = parseInt(loanStatus); 
  
  const isSanctioned = currentLoanStatus === 6;
  
  const isEMandateEnabled = isSanctioned && user?.emandate_status !== "0300";
  const isEMandateCompleted = user?.emandate_status === "0300";
  
  const isAgreementEnabled = isSanctioned && user?.agreement_status !== 1;
  const isAgreementCompleted = user?.agreement_status === 1;
  
  const isVideoEnabled = isSanctioned && user?.video_status !== 1;
  const isVideoCompleted = user?.video_status === 1;

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
  const VerificationButton = ({ children, enabled, tooltipText, colorScheme, onClick, isLoading = false, completed = false }) => {
    const colors = {
      blue: {
        enabled: 'border-blue-400 bg-blue-500 hover:bg-blue-600 text-white',
        disabled: 'border-blue-200 bg-blue-200 text-blue-400 cursor-not-allowed',
        completed: 'border-green-400 bg-green-500 text-white'
      },
      pink: {
        enabled: 'border-pink-400 bg-pink-500 hover:bg-pink-600 text-white',
        disabled: 'border-pink-200 bg-pink-200 text-pink-400 cursor-not-allowed',
        completed: 'border-green-400 bg-green-500 text-white'
      },
      purple: {
        enabled: 'border-purple-400 bg-purple-500 hover:bg-purple-600 text-white',
        disabled: 'border-purple-200 bg-purple-200 text-purple-400 cursor-not-allowed',
        completed: 'border-green-400 bg-green-500 text-white'
      },
      green: {
        enabled: 'border-green-400 bg-green-500 hover:bg-green-600 text-white',
        disabled: 'border-green-200 bg-green-200 text-green-400 cursor-not-allowed',
        completed: 'border-green-400 bg-green-500 text-white'
      }
    };

    if (completed) {
      return (
        <button 
          className={`border-2 text-xs sm:text-sm md:text-base font-medium md:font-semibold rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-md w-full sm:w-auto flex items-center justify-center space-x-1 ${colors.green.completed}`}
          disabled
        >
          <span>✅ Completed</span>
        </button>
      );
    }

    return (
      <Tooltip text={tooltipText} show={!enabled}>
        <button 
          onClick={onClick}
          className={`border-2 text-xs sm:text-sm md:text-base font-medium md:font-semibold rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-md transition-all duration-300 w-full sm:w-auto flex items-center justify-center space-x-1 ${
            enabled && !isLoading
              ? `${colors[colorScheme]?.enabled || colors.blue.enabled} hover:shadow-lg hover:scale-105` 
              : colors[colorScheme]?.disabled || colors.blue.disabled
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
  const VerificationIcon = ({ icon: Icon, title, enabled, colorScheme, completed = false }) => {
    const colors = {
      blue: {
        enabled: 'border-blue-300 bg-blue-100 text-blue-600',
        disabled: 'border-blue-100 bg-blue-50 text-blue-300',
        completed: 'border-green-300 bg-green-100 text-green-600'
      },
      pink: {
        enabled: 'border-pink-300 bg-pink-100 text-pink-600',
        disabled: 'border-pink-100 bg-pink-50 text-pink-300',
        completed: 'border-green-300 bg-green-100 text-green-600'
      },
      purple: {
        enabled: 'border-purple-300 bg-purple-100 text-purple-600',
        disabled: 'border-purple-100 bg-purple-50 text-purple-300',
        completed: 'border-green-300 bg-green-100 text-green-600'
      },
      green: {
        enabled: 'border-green-300 bg-green-100 text-green-600',
        disabled: 'border-green-100 bg-green-50 text-green-300',
        completed: 'border-green-300 bg-green-100 text-green-600'
      }
    };

    if (completed) {
      return (
        <div className={`rounded-full font-semibold border-2 flex flex-col justify-center items-center text-center w-20 h-20 md:w-24 md:h-24 shadow-md ${colors.green.completed}`}>
          <span className="text-2xl">✅</span>
          <p className={`text-xs md:text-sm font-semibold md:font-bold text-green-800`}>
            {title}
          </p>
        </div>
      );
    }

    const schemeColors = colors[colorScheme] || colors.blue;
    
    return (
      <div className={`rounded-full font-semibold border-2 flex flex-col justify-center items-center text-center w-20 h-20 md:w-24 md:h-24 shadow-md transition-all duration-300 ${
        enabled ? schemeColors.enabled : schemeColors.disabled
      }`}>
        <Icon className={`text-base md:text-2xl transition-all duration-300`} />
        <p className={`text-xs md:text-sm font-semibold md:font-bold transition-all duration-300 ${
          enabled 
            ? (colorScheme === 'blue' ? 'text-blue-800' : colorScheme === 'pink' ? 'text-pink-800' : colorScheme === 'purple' ? 'text-purple-800' : 'text-green-800') 
            : (colorScheme === 'blue' ? 'text-blue-400' : colorScheme === 'pink' ? 'text-pink-400' : colorScheme === 'purple' ? 'text-purple-400' : 'text-green-400')
        }`}>
          {title}
        </p>
      </div>
    );
  };

  return (
    <div>
      {/* Status Message */}
      {!isSanctioned && (
        <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700 font-medium text-center">
            🔒 Verification options will be available once your loan is sanctioned.
          </p>
        </div>
      )}

      {isSanctioned && (
        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium text-center">
            ✅ 🎉 Congratulations! Your loan has been sanctioned. Please complete the formalities via the following steps:<br/> 
            <span className="font-semibold text-blue-500">Video Verification</span>, 
            <span className="font-semibold text-pink-500">E-Mandate</span>, and 
            <span className="font-semibold text-purple-500">Digital loan agreement</span>.
          </p>
        </div>
      )}
      
      <div className={`border-2 p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center rounded-2xl shadow-lg gap-4 sm:gap-6 lg:gap-4 transition-all duration-300 ${
        isSanctioned 
          ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-100' 
          : 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100'
      }`}>
        
        <VideoVerification 
          enabled={isVideoEnabled}
          completed={isVideoCompleted}
          VerificationIcon={VerificationIcon}
          VerificationButton={VerificationButton}
          user={user}
        />
        
        <EMandate 
          enabled={isEMandateEnabled}
          completed={isEMandateCompleted}
          VerificationIcon={VerificationIcon}
          VerificationButton={VerificationButton}
          user={user}
        />
        
        <DigitalLoanAgreement 
          enabled={isAgreementEnabled}
          completed={isAgreementCompleted}
          user={user}
          VerificationIcon={VerificationIcon}
          VerificationButton={VerificationButton}
        />
      </div>
    </div>
  );
};

export default VerificationComponent;