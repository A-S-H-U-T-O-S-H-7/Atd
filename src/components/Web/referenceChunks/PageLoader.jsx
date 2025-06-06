import React from 'react';
import { BeatLoader } from 'react-spinners';
import { CheckCircle2 } from 'lucide-react';

const FullPageLoader = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-900/90 via-emerald-900/90 to-cyan-900/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 animate-pulse">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Completing Registration...</h2>
        <p className="text-lg mb-6 opacity-90">Please wait while we process your information</p>
        <BeatLoader color="#ffffff" size={12} />
      </div>
    </div>
  );
};

export default FullPageLoader;