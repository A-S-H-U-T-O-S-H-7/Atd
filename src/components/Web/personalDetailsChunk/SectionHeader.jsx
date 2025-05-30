import React from 'react';

const SectionHeader = ({ icon: Icon, title }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );
};

export default SectionHeader;
