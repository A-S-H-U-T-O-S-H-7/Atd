// components/Web/profile/EMandate.js
import React, { useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import EMandateModal from './EmandateModal';
import toast from 'react-hot-toast';

const EMandate = ({ enabled, VerificationIcon, VerificationButton, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEMandateModal, setShowEMandateModal] = useState(false);

  const handleEMandateClick = () => {
    if (!enabled) {
      toast.error('E-Mandate is not available at the moment');
      return;
    }
    setShowEMandateModal(true);
  };

  const handleEMandateSuccess = () => {
    toast.success('E-Mandate completed successfully!');
    console.log('E-Mandate completed successfully');
    setIsLoading(false);
  };

  return (
    <>
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
          onClick={handleEMandateClick}
          isLoading={isLoading}
        >
          Subscribe
        </VerificationButton>
      </div>

      <EMandateModal
        isOpen={showEMandateModal}
        onClose={() => setShowEMandateModal(false)}
        onSuccess={handleEMandateSuccess}
        user={user}
      />
    </>
  );
};

export default EMandate;