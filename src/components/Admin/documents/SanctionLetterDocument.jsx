import React from "react";
import { FaRegFilePdf, FaExternalLinkAlt } from "react-icons/fa";

const SanctionLetterDocument = ({
  fileName,
  hasDoc,
  isDark,
  applicationId,
  className = "",
  size = "default"
}) => {
  if (!hasDoc || !fileName) {
    return (
      <div 
        className={`p-2 rounded-lg bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center cursor-not-allowed shadow-sm ${className}`}
        title={`Sanction Letter Missing: ${fileName || 'No file'}`}
      >
        <FaRegFilePdf size={size === "small" ? 16 : size === "large" ? 20 : 18} className="flex-shrink-0 opacity-70" />
        <span className="text-xs font-bold ml-1">✗</span>
      </div>
    );
  }

  // If fileName is a full URL, use it directly
  // Otherwise, construct the URL
  const getFileUrl = () => {
    if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
      return fileName;
    }
    // Handle the escaped slashes in your example
    const cleanFileName = fileName.replace(/\\\//g, '/');
    return `https://live.atdmoney.com/storage/sanction_letters/${cleanFileName}`;
  };

  const fileUrl = getFileUrl();

  const sizeClasses = {
    small: "p-1.5",
    default: "p-2",
    large: "p-3"
  };

  const iconSizes = {
    small: 16,
    default: 18,
    large: 20
  };

  const handleClick = (e) => {
    e.preventDefault();
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center group relative bg-green-100 hover:bg-green-200 border-2 border-green-300 hover:border-green-400 text-green-800 hover:text-green-900 shadow-sm hover:shadow-md ${className}`}
      title={`View Sanction Letter`}
    >
      <FaRegFilePdf 
        size={iconSizes[size]} 
        className="flex-shrink-0" 
      />
      <span className="text-xs font-bold ml-1 text-green-600">✓</span>
      <FaExternalLinkAlt 
        size={size === "small" ? 8 : 10} 
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-green-600" 
      />
    </button>
  );
};

export default SanctionLetterDocument;