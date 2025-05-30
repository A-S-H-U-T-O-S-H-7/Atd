import React from 'react';

const ErrorDisplay = ({ errorMessage }) => {
  if (!errorMessage) return null;
  
  return (
    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
      <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
    </div>
  );
};

export default ErrorDisplay;