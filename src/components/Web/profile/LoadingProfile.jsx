"use client"
import React, { useEffect } from 'react';

const ProfileLoadingOverlay = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); 

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Clean Pulsing Ring Loader */}
        <div className="w-16 h-16 mx-auto mb-6 relative">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-blue-300 animate-ping"></div>
          {/* Inner solid circle */}
          <div className="absolute inset-2 w-12 h-12 bg-blue-500 rounded-full animate-pulse"></div>
        </div>

        {/* Simple Text with Emoji */}
        <p className=" font-medium text-gray-700">
          Setting up your profile... 😊
        </p>
      </div>
    </div>
  );
};

export default ProfileLoadingOverlay;