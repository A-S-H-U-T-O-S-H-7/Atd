import React, { useState, useRef, useEffect } from "react";
import { X, Upload, FileText, Trash2 } from "lucide-react";
import complaintService from "@/lib/services/ComplaintService";
import { toast } from "react-hot-toast";

const UploadModal = ({ isOpen, onClose, complaint, onUpload, isDark }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentType, setDocumentType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const modalRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Restore body scroll
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle multiple file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Check each file size (5MB limit)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    
    // Add to selected files
    const updatedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(updatedFiles);
    
    // Reset file input
    e.target.value = null;
  };

  // Remove a single file
  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  // Clear all files
  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedFiles.length || !documentType) {
      toast.error("Please select both document type and at least one file");
      return;
    }

    setIsUploading(true);
    try {
      // Upload each file sequentially
      const uploadPromises = selectedFiles.map(file => 
        complaintService.uploadDocument(complaint.id, file, documentType)
      );
      
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      // Call the callback for each uploaded file
      selectedFiles.forEach(file => {
        onUpload(complaint.id, file, documentType);
      });
      
      // Reset form
      setSelectedFiles([]);
      setDocumentType("");
      onClose();
      
      toast.success(`Successfully uploaded ${selectedFiles.length} file(s)`);
      
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to upload some files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // File Icon component
  const FileIcon = ({ file, isDark }) => {
    const extension = file.name.split('.').pop().toLowerCase();
    const iconProps = {
      className: `w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`,
      size: 16
    };

    switch (extension) {
      case 'pdf':
        return <FileText {...iconProps} className={`${iconProps.className} ${isDark ? 'text-red-400' : 'text-red-500'}`} />;
      case 'doc':
      case 'docx':
        return <FileText {...iconProps} className={`${iconProps.className} ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <FileText {...iconProps} className={`${iconProps.className} ${isDark ? 'text-green-400' : 'text-green-500'}`} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className={`rounded-2xl shadow-2xl border-2 w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden ${
          isDark 
            ? "bg-gray-800 border-emerald-600/50" 
            : "bg-white border-emerald-300"
        }`}
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b-2 flex items-center justify-between ${
          isDark ? "border-emerald-600/50" : "border-emerald-300"
        }`}>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Upload Documents for {complaint?.name}
            </h3>
            <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Upload one or multiple files (Max 5MB each)
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Document Type Selection */}
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
          
          {/* File Upload Area */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Document Files:
            </label>
            
            {/* File Upload Dropzone */}
            <label
              htmlFor="file-upload"
              className={`block px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 hover:border-solid mb-4 ${
                isDark
                  ? "border-emerald-600/50 hover:border-emerald-500 bg-gray-700/50"
                  : "border-emerald-300 hover:border-emerald-400 bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <Upload
                  className={`w-8 h-8 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                />
                <div className="text-center">
                  <span
                    className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Drop files here or click to upload
                  </span>
                  <span
                    className={`block text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    PDF, DOC, JPG, PNG (Max 5MB each)
                  </span>
                </div>
                
              </div>
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.svg"
              id="file-upload"
            />
            
            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Selected Files ({selectedFiles.length})
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFiles}
                    className={`text-xs px-2 py-1 rounded transition-colors flex items-center space-x-1 ${
                      isDark
                        ? "text-red-400 hover:text-red-300 hover:bg-red-900/30"
                        : "text-red-600 hover:text-red-700 hover:bg-red-100"
                    }`}
                  >
                    <Trash2 size={12} />
                    <span>Clear All</span>
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg group ${
                        isDark ? "bg-gray-700/70 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileIcon file={file} isDark={isDark} />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${isDark ? "text-gray-300" : "text-gray-700"}`}
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                          isDark
                            ? "hover:bg-red-900/50 text-red-400 hover:text-red-300"
                            : "hover:bg-red-100 text-red-600 hover:text-red-700"
                        }`}
                        title="Remove file"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedFiles.length || !documentType || isUploading}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              !selectedFiles.length || !documentType || isUploading
                ? isDark ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isDark 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading {selectedFiles.length} file(s)...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Upload {selectedFiles.length} File(s)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;