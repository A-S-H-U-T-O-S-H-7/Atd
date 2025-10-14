import React from 'react';
import { FileText, Loader } from 'lucide-react';

const SocialScoreDocument = ({ fileName, hasDoc, onFileView, fileLoading, loadingFileName }) => {
  const isLoading = fileLoading && loadingFileName === fileName;

  const handleClick = () => {
    if (typeof onFileView === 'function') {
      onFileView(fileName, 'social_score_report');
    } else {
      console.error('onFileView is not a function:', onFileView);
      alert('Document viewer not available');
    }
  };

  if (!hasDoc || !fileName) {
    return (
      <div className="p-2 w-15 rounded-lg bg-red-100 text-red-600 flex items-center justify-center cursor-not-allowed" title="Document Missing">
        <FileText size={18} />
        <span className="text-xs ml-1">✗</span>
      </div>
    );
  }

  return (
   <button
  onClick={handleClick}
  disabled={fileLoading}
  className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
    isLoading 
      ? 'bg-gray-300 text-gray-500 cursor-wait' 
      : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
  }`}
  title={isLoading ? "Loading..." : "View Social Score Report"}
>
  {isLoading ? (
    <Loader size={18} className="flex-shrink-0 animate-spin" />
  ) : (
    <FileText size={18} className="flex-shrink-0" />
  )}
</button>
  );
};

export default SocialScoreDocument;