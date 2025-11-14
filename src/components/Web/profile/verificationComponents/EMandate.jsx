// components/Web/profile/EMandate.js
import React, { useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import EMandateModal from './EmandateModal';
import toast from 'react-hot-toast';

const EMandate = ({ enabled, VerificationIcon, VerificationButton, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEMandateModal, setShowEMandateModal] = useState(false);

  // Get application_id from user object
  const applicationId = user?.application_id;

  const handleEMandateClick = () => {
    if (!enabled) {
      toast.error('E-Mandate is not available at the moment');
      return;
    }

    if (!applicationId) {
      toast.error('Application ID not found. Please contact support.');
      return;
    }

    setShowEMandateModal(true);
  };

  const handleEMandateSuccess = () => {
    toast.success('E-Mandate completed successfully!');
    console.log('E-Mandate completed successfully');
    setIsLoading(false);
    setShowEMandateModal(false);
  };

  const handleEMandateClose = () => {
    setShowEMandateModal(false);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
        <VerificationIcon 
          icon={FaVideo}
          title="E-Mandate"
          enabled={enabled && !!applicationId}
          colorScheme="green"
        />
        <VerificationButton
          enabled={enabled && !!applicationId}
          tooltipText={!applicationId ? "Application ID not available" : "Complete E-Mandate process"}
          colorScheme="green"
          onClick={handleEMandateClick}
          isLoading={isLoading}
        >
          E-Mandate
        </VerificationButton>
      </div>

      <EMandateModal
        isOpen={showEMandateModal}
        onClose={handleEMandateClose}
        onSuccess={handleEMandateSuccess}
        user={user}
        applicationId={applicationId}
      />
    </>
  );
};

export default EMandate;