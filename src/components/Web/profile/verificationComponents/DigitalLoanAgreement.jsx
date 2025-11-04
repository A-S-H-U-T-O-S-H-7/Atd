import React, { useState } from 'react';
import { FaSignature } from 'react-icons/fa';

const DigitalLoanAgreement = ({ enabled, user, VerificationIcon, VerificationButton }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [esignUrl, setEsignUrl] = useState(null);

  const handleDigitalAgreement = async () => {
    if (!enabled || !user.user_id) return;

    setIsLoading(true);
    setError(null);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5hdGRtb25leS5pbi9hcGkvdXNlci9sb2dpbi92ZXJpZnkiLCJpYXQiOjE3NjE5Nzc2MjAsImV4cCI6MTc2Mzc3NzYyMCwibmJmIjoxNzYxOTc3NjIwLCJqdGkiOiJZYklydDNZYXJrQThnRzgwIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.b5cCFqrc2o5sLRmJaGb-by7VM7tYOvxw-lPyL7KMGnI");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`https://api.atdmoney.in/api/user/loan-agreement/leegality/${user.user_id}`, requestOptions);
      const result = await response.json();

      if (result.success && result.url) {
        setEsignUrl(result.url);
        window.open(result.url, '_blank');
      } else {
        throw new Error(result.message || 'Failed to generate eSign link');
      }
    } catch (err) {
      setError(err.message);
      console.error('Digital Agreement Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If URL is available, show different state
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
        Digital Loan Agreement
      </VerificationButton>
      {error && (
        <p className="text-red-500 text-xs text-center mt-1">{error}</p>
      )}
    </div>
  );
};

export default DigitalLoanAgreement;