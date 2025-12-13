import React, { useState, useEffect, useRef } from "react";
import { X, Smartphone, User, Phone, Mail, Users, Copy, Check } from "lucide-react";

const RefMobileModal = ({ isOpen, onClose, references = [], isDark }) => {
  const [copiedField, setCopiedField] = useState(null);
  const modalRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className={`relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden z-10 ${
          isDark 
            ? "bg-slate-900 border border-slate-700" 
            : "bg-white border border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Compact Header */}
        <div className={`flex items-center justify-between px-4 py-2.5 ${
          isDark 
            ? "bg-gradient-to-r from-blue-600 to-purple-600" 
            : "bg-gradient-to-r from-blue-500 to-indigo-600"
        }`}>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white">
              References ({references.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Content */}
        <div className="p-3 max-h-[70vh] overflow-y-auto">
          {references && references.length > 0 ? (
            <div className="space-y-2">
              {references.map((ref, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg p-2.5 border ${
                    isDark 
                      ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800" 
                      : "border-gray-200 bg-gray-50 hover:bg-white"
                  } transition-all`}
                >
                  {/* Name and Relation */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${
                        isDark 
                          ? "bg-blue-500/20" 
                          : "bg-blue-100"
                      }`}>
                        <User className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className={`text-xs font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}>
                        {ref.ref_name}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isDark 
                        ? "bg-slate-700 text-slate-300" 
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {ref.ref_relation}
                    </span>
                  </div>

                  {/* Mobile */}
                  <div className={`flex items-center justify-between gap-2 p-1.5 rounded mb-1.5 ${
                    isDark ? "bg-slate-700/50" : "bg-white"
                  }`}>
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <Phone className={`w-3 h-3 flex-shrink-0 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`} />
                      <span className={`text-xs font-medium ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}>
                        {ref.ref_mobile}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(ref.ref_mobile, `mobile-${index}`)}
                      className={`p-1 rounded transition-all ${
                        isDark 
                          ? "bg-slate-600 hover:bg-slate-500 text-slate-300" 
                          : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                      }`}
                    >
                      {copiedField === `mobile-${index}` ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Email */}
                  {ref.ref_email && (
                    <div className={`flex items-center justify-between gap-2 p-1.5 rounded ${
                      isDark ? "bg-slate-700/50" : "bg-white"
                    }`}>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Mail className={`w-3 h-3 flex-shrink-0 ${
                          isDark ? "text-purple-400" : "text-purple-600"
                        }`} />
                        <span className={`text-xs font-medium break-all ${
                          isDark ? "text-purple-400" : "text-purple-600"
                        }`}>
                          {ref.ref_email}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(ref.ref_email, `email-${index}`)}
                        className={`p-1 rounded transition-all flex-shrink-0 ${
                          isDark 
                            ? "bg-slate-600 hover:bg-slate-500 text-slate-300" 
                            : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                        }`}
                      >
                        {copiedField === `email-${index}` ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center py-8 ${
              isDark ? "text-slate-400" : "text-gray-400"
            }`}>
              <Users className="w-8 h-8 mb-2" />
              <p className="text-xs font-medium">No references available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefMobileModal;