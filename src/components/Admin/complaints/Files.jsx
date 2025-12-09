// Create a new component FileIcon.jsx or add as a helper function
import React from 'react';
import { FileText, Image, FileType, File } from 'lucide-react';

export const Files = ({ fileUrl, isDark, size = "w-10 h-10" }) => {
  const getFileType = (url) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'doc';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) return 'image';
    return 'unknown';
  };

  const fileType = getFileType(fileUrl);
  
  const iconClasses = `${size} ${isDark ? 'text-gray-300' : 'text-gray-600'}`;
  
  switch (fileType) {
    case 'pdf':
      return <FileText className={`${iconClasses} ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />;
    case 'doc':
    case 'docx':
      return <FileType className={`${iconClasses} ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />;
    case 'image':
      return <Image className={`${iconClasses} ${isDark ? 'text-green-400' : 'text-green-500'}`} />;
    default:
      return <File className={iconClasses} />;
  }
};