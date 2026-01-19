import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

const NachFormDocument = ({
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
        className={`p-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center cursor-not-allowed ${className}`}
        title={`NACH Form Missing: ${fileName || 'No file'}`}
      >
        <FileText size={size === "small" ? 16 : size === "large" ? 20 : 18} className="flex-shrink-0" />
        <span className="text-xs ml-1">✗</span>
      </div>
    );
  }

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

  return (
    <Link
      href={`/documents/view?file=${encodeURIComponent(fileName)}&type=nach_form${applicationId ? `&appId=${applicationId}` : ''}`}
      target="_blank"
      className={`${sizeClasses[size]} rounded-lg transition-colors cursor-pointer flex items-center justify-center group relative ${
        isDark
          ? 'bg-purple-900/50 hover:bg-purple-800/50 text-purple-300'
          : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
      } ${className}`}
      title={`View NACH Form`}
    >
      <FileText 
        size={iconSizes[size]} 
        className="flex-shrink-0" 
      />
      <ExternalLink 
        size={size === "small" ? 8 : 10} 
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity" 
      />
    </Link>
  );
};

export default NachFormDocument;