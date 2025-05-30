import React from 'react';

const SectionCard = ({ icon: Icon, title, children }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default SectionCard;