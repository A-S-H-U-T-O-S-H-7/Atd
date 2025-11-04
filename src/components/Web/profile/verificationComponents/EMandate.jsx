import React, { useState } from 'react';
import { FaVideo } from 'react-icons/fa';

const EMandate = ({ enabled, VerificationIcon, VerificationButton }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEMandate = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    try {
      // Add your E-Mandate API call here
      console.log('Starting E-Mandate subscription...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('E-Mandate error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
      <VerificationIcon 
        icon={FaVideo}
        title="E-Mandate"
        enabled={enabled}
        colorScheme="green"
      />
      <VerificationButton
        enabled={enabled}
        tooltipText="E-Mandate not available!"
        colorScheme="green"
        onClick={handleEMandate}
        isLoading={isLoading}
      >
        Subscribe
      </VerificationButton>
    </div>
  );
};

export default EMandate;