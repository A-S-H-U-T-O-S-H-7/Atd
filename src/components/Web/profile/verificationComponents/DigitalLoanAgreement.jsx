import React, { useState } from 'react';
import { FaSignature } from 'react-icons/fa';
import { TokenManager } from '@/utils/tokenManager';

const DigitalLoanAgreement = ({ enabled, completed, user, VerificationIcon, VerificationButton }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [esignUrl, setEsignUrl] = useState(null);

  const handleDigitalAgreement = async () => {
    if (!enabled || !user?.user_id) {
      setError('User information not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenData = TokenManager.getToken();
      const userToken = tokenData.token;
      
      if (!userToken) {
        throw new Error('Please login again');
      }

      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${userToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(
        `https://live.atdmoney.com/api/user/loan-agreement/leegality/${user.application_id}`, 
        requestOptions
      );
      
      const result = await response.json();

      if (result.success && result.url) {
        setEsignUrl(result.url);
        window.open(result.url, '_blank');
        
        // Poll for agreement status
        checkAgreementStatus();
      } else {
        throw new Error(result.message || 'Failed to generate eSign link');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAgreementStatus = async () => {
    try {
      const tokenData = TokenManager.getToken();
      const userToken = tokenData.token;
      
      const interval = setInterval(async () => {
        const response = await fetch(
          `https://live.atdmoney.com/api/user/loan-agreement/status/${user.application_id}`,
          {
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Accept': 'application/json'
            }
          }
        );
        
        const result = await response.json();
        
        if (result.success && result.agreement_status === 1) {
          clearInterval(interval);
          // Refresh the page to update status
          window.location.reload();
        }
      }, 5000); // Check every 5 seconds
      
      // Stop checking after 5 minutes
      setTimeout(() => {
        clearInterval(interval);
      }, 300000);
    } catch (error) {
      console.error('Error checking agreement status:', error);
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
        <VerificationIcon 
          icon={FaSignature}
          title="Digital Loan Agreement"
          enabled={false}
          completed={true}
          colorScheme="purple"
        />
        <VerificationButton
          enabled={false}
          completed={true}
          tooltipText="Agreement completed!"
          colorScheme="purple"
        >
          Digital Loan Agreement
        </VerificationButton>
      </div>
    );
  }

  if (esignUrl) {
    return (
      <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
        <VerificationIcon 
          icon={FaSignature}
          title="Agreement Sent"
          enabled={true}
          colorScheme="purple"
        />
        <VerificationButton
          enabled={true}
          tooltipText="Open digital agreement"
          colorScheme="purple"
          onClick={() => window.open(esignUrl, '_blank')}
        >
          Open Agreement
        </VerificationButton>
        <p className="text-xs text-blue-600 text-center mt-1">
          ✅ Agreement sent for signing. Please check the opened tab.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
      <VerificationIcon 
        icon={FaSignature}
        title="Digital Loan Agreement"
        enabled={enabled}
        colorScheme="purple"
      />
      <VerificationButton
        enabled={enabled}
        tooltipText="Digital agreement not available!"
        colorScheme="purple"
        onClick={handleDigitalAgreement}
        isLoading={isLoading}
      >
        {isLoading ? 'Processing...' : 'Digital Loan Agreement'}
      </VerificationButton>
      {error && (
        <p className="text-red-500 text-xs text-center mt-1">{error}</p>
      )}
    </div>
  );
};

export default DigitalLoanAgreement;