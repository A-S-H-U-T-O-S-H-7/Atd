import React, { useState, useRef } from 'react';
import { Upload, FileText, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import kycService from '@/lib/services/replaceKycSevice';

const FileUploadField = ({ label, name, document, onFileChange, onFileRemove, isDark, isRequired = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
    e.target.value = '';
  };

  const handleFileSelection = (file) => {
    try {
      kycService.validateFile(file);
      onFileChange(name, file);
      toast.success(`${file.name} selected for upload`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileView = async () => {
    if (document?.available && document.fileName) {
      setViewLoading(true);
      try {
        const fileUrl = await kycService.viewFile(document.fileName, name);
        window.open(fileUrl, '_blank');
        toast.success(`Opening ${document.fileName}`);
      } catch (error) {
        toast.error(`Failed to view file: ${error.message}`);
      } finally {
        setViewLoading(false);
      }
    }
  };

  const handleFileDelete = () => {
    onFileRemove(name);
    toast.success('File removed from upload queue');
  };

  const hasFile = document?.available || document?.newFile;
  const fileName = document?.newFile?.name || document?.fileName || "Unknown file";
  const isExisting = document?.available;

  return (
    <div 
      className={`group relative rounded-lg border transition-all duration-200 ${
        dragActive 
          ? isDark 
            ? "border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20" 
            : "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20"
          : hasFile
            ? isDark
              ? isExisting 
                ? "border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:border-blue-400"
                : "border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 hover:border-emerald-400"
              : isExisting
                ? "border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/30 hover:border-blue-500"
                : "border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100/30 hover:border-emerald-500"
            : isDark
              ? "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70"
              : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.mp4,.avi,.mov"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold truncate ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              {label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {hasFile && (
              <p className={`text-xs truncate mt-0.5 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`} title={fileName}>
                {fileName}
              </p>
            )}
          </div>
          
          {hasFile ? (
            <div className="flex items-center gap-1 flex-shrink-0">
              {isExisting && (
                <button
                  type="button"
                  onClick={handleFileView}
                  disabled={viewLoading}
                  className={`p-1.5 cursor-pointer rounded-md transition-all ${
                    isDark 
                      ? "hover:bg-orange-500/20 text-orange-400 hover:text-orange-300" 
                      : "hover:bg-orange-100 text-orange-600 hover:text-orange-700"
                  } ${viewLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                  title="View file"
                >
                  {viewLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}
              
              <button
                type="button"
                onClick={openFileDialog}
                className={`p-1.5 rounded-md transition-all hover:scale-110 ${
                  isDark 
                    ? isExisting
                      ? "hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
                      : "hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300"
                    : isExisting
                      ? "hover:bg-blue-100 text-blue-600 hover:text-blue-700"
                      : "hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700"
                }`}
                title={isExisting ? "Replace file" : "Change file"}
              >
                <Upload className="w-4 h-4" />
              </button>
              
              {document?.newFile && (
                <button
                  type="button"
                  onClick={handleFileDelete}
                  className={`p-1.5 rounded-md transition-all hover:scale-110 ${
                    isDark 
                      ? "hover:bg-red-500/20 text-red-400 hover:text-red-300" 
                      : "hover:bg-red-100 text-red-600 hover:text-red-700"
                  }`}
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <Upload className={`w-5 h-5 flex-shrink-0 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`} />
          )}
        </div>
        
        {hasFile ? (
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${
            isDark
              ? isExisting
                ? "bg-blue-500/10 border border-blue-500/30"
                : "bg-emerald-500/10 border border-emerald-500/30"
              : isExisting
                ? "bg-blue-100/50 border border-blue-200"
                : "bg-emerald-100/50 border border-emerald-200"
          }`}>
            <FileText className={`w-5 h-5 flex-shrink-0 ${
              isExisting 
                ? isDark ? "text-blue-400" : "text-blue-500"
                : isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <span className={`text-xs font-medium ${
              isExisting
                ? isDark ? "text-blue-300" : "text-blue-700"
                : isDark ? "text-emerald-300" : "text-emerald-700"
            }`}>
              {isExisting ? "✓ Uploaded" : "✓ Ready to upload"}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={openFileDialog}
            className={`w-full text-center py-3 px-2 rounded-md border-2 border-dashed transition-all ${
              isDark
                ? "border-gray-600 hover:border-emerald-500 hover:bg-emerald-500/5"
                : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
            }`}
          >
            <p className={`text-xs font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Click or drop file here
            </p>
            <p className={`text-xs mt-0.5 ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}>
              PDF, JPG, PNG, MP4 (Max 10MB)
            </p>
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUploadField;