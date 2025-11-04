import React, { useState } from 'react';
import { FaUserCheck } from 'react-icons/fa';

const VideoVerification = ({ enabled, VerificationIcon, VerificationButton }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoVerification = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    try {
      // Add your video verification API call here
      console.log('Starting video verification...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Video verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
      <VerificationIcon 
        icon={FaUserCheck}
        title="Video Verification"
        enabled={enabled}
        colorScheme="blue"
      />
      <VerificationButton
        enabled={enabled}
        tooltipText="Video verification not available!"
        colorScheme="blue"
        onClick={handleVideoVerification}
        isLoading={isLoading}
      >
        Capture Video
      </VerificationButton>
    </div>
  );
};

export default VideoVerification;