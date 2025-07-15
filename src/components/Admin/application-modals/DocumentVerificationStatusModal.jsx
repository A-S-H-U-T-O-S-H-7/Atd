import React, { useState } from "react";
import { X, FileText, CheckCircle, AlertCircle } from "lucide-react";

const DocumentVerificationModal = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  isDark, 
  application 
}) => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Salary Slip",
      comments: "",
      isVerified: false
    },
    {
      id: 2,
      name: "Agreement",
      comments: "",
      isVerified: false
    },
    {
      id: 3,
      name: "PDC",
      comments: "",
      isVerified: false
    },
    {
      id: 4,
      name: "NACH",
      comments: "",
      isVerified: false
    },
    {
      id: 5,
      name: "Others",
      comments: "",
      isVerified: false
    }
  ]);

  const handleCommentChange = (docId, comment) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === docId ? { ...doc, comments: comment } : doc
      )
    );
  };

  const handleVerify = (docId) => {
    // Navigate to application form for this specific user
    if (onVerify) {
      onVerify(application, docId);
    }
  };

  const handleStatusToggle = (docId) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === docId ? { ...doc, isVerified: !doc.isVerified } : doc
      )
    );
  };

  const handleSubmit = () => {
    // Process all document verifications
    const verificationData = documents.map(doc => ({
      documentType: doc.name,
      comments: doc.comments,
      isVerified: doc.isVerified
    }));
    
    console.log('Document verification data:', verificationData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden ${
        isDark 
          ? "bg-gray-800 border border-emerald-600/50" 
          : "bg-white border border-emerald-200"
      }`}>
        {/* Header */}
        <div className={`px-6 py-3 border-b ${
          isDark 
            ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50" 
            : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className={`w-6 h-6 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`} />
              <h2 className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Documents Verification Status Check
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isDark 
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white" 
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Application Info */}
          {application && (
            <div className={`mt-2 p-2 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-emerald-50/50"
            }`}>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className={`font-medium ${
                  isDark ? "text-emerald-300" : "text-emerald-700"
                }`}>
                  Loan No: {application.loanNo}
                </span>
                <span className={`font-medium ${
                  isDark ? "text-emerald-300" : "text-emerald-700"
                }`}>
                  Name: {application.name}
                </span>
                <span className={`font-medium ${
                  isDark ? "text-emerald-300" : "text-emerald-700"
                }`}>
                  CRN: {application.crnNo}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Table Header */}
          <div className={`grid grid-cols-12 gap-3 p-3 rounded-lg mb-3 ${
            isDark 
              ? "bg-gray-700/50 border border-emerald-600/30" 
              : "bg-emerald-50/50 border border-emerald-200"
          }`}>
            <div className={`col-span-3 font-semibold text-sm ${
              isDark ? "text-emerald-300" : "text-emerald-700"
            }`}>
              Verification
            </div>
            <div className={`col-span-4 font-semibold text-sm ${
              isDark ? "text-emerald-300" : "text-emerald-700"
            }`}>
              Comments
            </div>
            <div className={`col-span-2 font-semibold text-sm ${
              isDark ? "text-emerald-300" : "text-emerald-700"
            }`}>
              Links
            </div>
            <div className={`col-span-3 font-semibold text-sm ${
              isDark ? "text-emerald-300" : "text-emerald-700"
            }`}>
              Status Check
            </div>
          </div>

          {/* Document Rows */}
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`grid grid-cols-12 gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  isDark 
                    ? "bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50" 
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                {/* Document Name */}
                <div className={`col-span-3 flex items-center font-medium ${
                  isDark ? "text-gray-200" : "text-gray-900"
                }`}>
                  <FileText className={`w-4 h-4 mr-2 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                  {doc.name}
                </div>

                {/* Comments */}
                <div className="col-span-4 flex items-center">
                  <input
                    type="text"
                    value={doc.comments}
                    onChange={(e) => handleCommentChange(doc.id, e.target.value)}
                    placeholder="Add comments..."
                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200 ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-emerald-500" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                    } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                {/* Verify Link */}
                <div className="col-span-2 flex items-center">
                  <button
                    onClick={() => handleVerify(doc.id)}
                    className={`px-4 py-1 rounded-md font-medium transition-all duration-200 transform hover:scale-105 ${
                      isDark 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white" 
                        : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-700 text-white"
                    } shadow-lg hover:shadow-xl`}
                  >
                    Verify
                  </button>
                </div>

                {/* Status Checkbox */}
                <div className="col-span-3 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleStatusToggle(doc.id)}
                    className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 ${
                      doc.isVerified
                        ? isDark 
                          ? "bg-emerald-600 border-emerald-600" 
                          : "bg-emerald-500 border-emerald-500"
                        : isDark 
                          ? "border-gray-500 hover:border-emerald-500" 
                          : "border-gray-300 hover:border-emerald-400"
                    }`}
                  >
                    {doc.isVerified && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <span className={`text-sm ${
                    doc.isVerified 
                      ? isDark ? "text-emerald-400" : "text-emerald-600"
                      : isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {doc.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t ${
          isDark 
            ? "bg-gray-700/50 border-emerald-600/30" 
            : "bg-emerald-50/50 border-emerald-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className={`w-4 h-4 ${
                isDark ? "text-yellow-400" : "text-yellow-600"
              }`} />
              <span className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                {documents.filter(doc => doc.isVerified).length} of {documents.length} documents verified
              </span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDark 
                    ? "bg-gray-600 hover:bg-gray-500 text-white" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  isDark 
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white" 
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                } shadow-lg hover:shadow-xl`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerificationModal;