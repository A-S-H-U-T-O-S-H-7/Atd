import React from 'react';
import { Briefcase } from 'lucide-react';

const PageHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
        <Briefcase className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Organization Details
      </h1>
      <p className="text-gray-600">
        Please provide your employment and financial information
      </p>
    </div>
  );
};

export default PageHeader;