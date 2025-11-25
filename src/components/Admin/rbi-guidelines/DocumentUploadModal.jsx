import React, { useState } from "react";
import { X, Upload } from "lucide-react";

const DocumentUploadModal = ({ isOpen, onClose, guideline, isDark, onUploadDocument }) => {
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (selectedFileType && selectedFile) {
      setIsUploading(true);
      
      try {
        // Map frontend document types to backend expected values
        const backendDocumentType = selectedFileType === "rbi-guidelines" 
          ? "RBI Guideline" 
          : "Resolution";
        
        await onUploadDocument(guideline.id, backendDocumentType, selectedFile);
        handleCancel();
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCancel = () => {
    setSelectedFileType("");
    setSelectedFile(null);
    onClose();
  };

  const isSubmitDisabled = !selectedFileType || !selectedFile || isUploading;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl overflow-hidden shadow-2xl border-2 w-full max-w-md transition-all duration-300 ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b-2 flex items-center justify-between ${
            isDark
              ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
              : "bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-300"
          }`}
        >
          <h2
            className={`text-lg font-bold ${
              isDark ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Upload Document
          </h2>
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDark
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Guideline Subject */}
          <div className="mb-4">
            <h3
              className={`text-sm font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Guideline Subject:
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {guideline?.subject}
            </p>
          </div>

          {/* Document Type Selection */}
          <div className="mb-6">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Document Type: <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              disabled={isUploading}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="">Select Document Type</option>
              <option value="rbi-guidelines">RBI Guidelines</option>
              <option value="resolution">Resolution</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Select File: <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                    : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                  isDark
                    ? "file:bg-emerald-600 file:text-white"
                    : "file:bg-emerald-100 file:text-emerald-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*,application/pdf"
              />
            </div>
            {selectedFile && (
              <p
                className={`text-xs mt-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                isUploading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                isSubmitDisabled
                  ? isDark
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isDark
                  ? "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;