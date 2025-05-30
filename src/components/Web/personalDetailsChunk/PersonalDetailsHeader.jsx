import React from 'react';
import { User } from 'lucide-react';

const PersonalDetailsHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
        <User className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Personal Details
      </h1>
      <p className="text-gray-600">
        Please fill in your personal information to continue
      </p>
    </div>
  );
};

export default PersonalDetailsHeader;