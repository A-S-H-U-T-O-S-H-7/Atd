import React, { useState } from "react";
import { X } from "lucide-react";
import complaintService from "@/lib/services/ComplaintService";

const UploadModal = ({ isOpen, onClose, complaint, onUpload, isDark }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedFile || !documentType) {
      toast.error("Please select both document type and file");
      return;
    }

    setIsUploading(true);
    try {
      await complaintService.uploadDocument(complaint.id, selectedFile, documentType);
      onUpload(complaint.id, selectedFile, documentType);
      setSelectedFile(null);
      setDocumentType("");
      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`rounded-2xl shadow-2xl border-2 w-full max-w-md mx-4 ${
        isDark 
          ? "bg-gray-800 border-emerald-600/50" 
          : "bg-white border-emerald-300"
      }`}>
        <div className={`px-6 py-4 border-b-2 flex items-center justify-between ${
          isDark ? "border-emerald-600/50" : "border-emerald-300"
        }`}>
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Upload Documents for {complaint?.name}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Document Type:
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="">Select Document Type</option>
              <option value="complaint">Complaint Document</option>
              <option value="resolution">Resolution Document</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Document File:
            </label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || !documentType || isUploading}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              !selectedFile || !documentType || isUploading
                ? isDark ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isDark ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;