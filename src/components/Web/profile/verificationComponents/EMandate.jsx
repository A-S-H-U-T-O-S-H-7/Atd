import React, { useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import EMandateModal from './EmandateModal';
import toast from 'react-hot-toast';

const EMandate = ({ enabled, completed, VerificationIcon, VerificationButton, user }) => {
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

  const handleEMandateSuccess = (statusCode) => {
    if (statusCode === '0300') {
      toast.success('E-Mandate completed successfully!');
      // Refresh the page to update status
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast.error(`E-Mandate failed with status: ${statusCode}`);
    }
    setIsLoading(false);
    setShowEMandateModal(false);
  };

  const handleEMandateClose = () => {
    setShowEMandateModal(false);
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
        <VerificationIcon 
          icon={FaVideo}
          title="E-Mandate"
          enabled={false}
          completed={true}
          colorScheme="green"
        />
        <VerificationButton
          enabled={false}
          completed={true}
          tooltipText="E-Mandate completed!"
          colorScheme="green"
        >
          E-Mandate
        </VerificationButton>
      </div>
    );
  }

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