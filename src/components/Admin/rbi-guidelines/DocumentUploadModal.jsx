import React, { useState } from "react";
import { X, Upload } from "lucide-react";

const DocumentUploadModal = ({ isOpen, onClose, guideline, isDark, onUploadDocument }) => {
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (selectedFileType && selectedFile) {
      setIsUploading(true);
      try {
        await onUploadDocument(guideline.id, selectedFileType, selectedFile);
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
            Uploads of {guideline?.subject}
          </h2>
          <button
            onClick={handleCancel}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
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
          <div className="mb-6">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Document File Type:
            </label>
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="">Select Document Type</option>
              <option value="rbi-guidelines">RBI Guidelines</option>
              <option value="resolution">Resolution</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Document File:
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                    : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                  isDark
                    ? "file:bg-emerald-600 file:text-white"
                    : "file:bg-emerald-100 file:text-emerald-700"
                }`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            {selectedFile && (
              <p
                className={`text-xs mt-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Selected: {selectedFile.name}
              </p>
            )}
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
                  <span>Upload</span>
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