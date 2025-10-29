import React from 'react';
import FileUploadField from './FileUploadField';
import { DOCUMENT_CONFIG } from '@/lib/services/replaceKycSevice';

const DocumentGrid = ({ documents, onFileChange, onFileRemove, isDark }) => {
  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDark
        ? "bg-gray-900/50 border-gray-700 shadow-xl shadow-black/20"
        : "bg-white border-gray-200 shadow-xl shadow-gray-200/50"
    }`}>
      <div className={`px-6 py-4 border-b ${
        isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              KYC Documents
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Upload required documents • <span className={isDark ? "text-blue-400" : "text-blue-600"}>Blue</span> = Uploaded • <span className={isDark ? "text-emerald-400" : "text-emerald-600"}>Green</span> = Ready to upload
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isDark 
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          }`}>
            {Object.values(documents).filter(d => d?.available || d?.newFile).length} / {DOCUMENT_CONFIG.length}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DOCUMENT_CONFIG.map((field) => (
            <FileUploadField
              key={field.name}
              name={field.name}
              label={field.label}
              document={documents[field.name]}
              onFileChange={onFileChange}
              onFileRemove={onFileRemove}
              isDark={isDark}
              isRequired={field.required}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentGrid;