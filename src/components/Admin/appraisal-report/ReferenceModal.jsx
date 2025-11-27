import React, { useRef, useEffect } from 'react';
import { X, Users, Phone, Mail, RefreshCw, Loader2 } from 'lucide-react';

const ReferenceModal = ({ 
  isOpen, 
  onClose, 
  references, 
  isDark, 
  loading,
  onRefresh 
}) => {
  const modalRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalClassName = "fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4";
  const contentClassName = `rounded-lg border max-w-md w-full max-h-[80vh] overflow-hidden ${
    isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
  }`;

  const titleClassName = `text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`;

  return (
    <div className={modalClassName}>
      <div ref={modalRef} className={contentClassName}>
        {/* Compact Header */}
        <div className={`p-3 border-b ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              <h3 className={titleClassName}>
                References ({references.length})
              </h3>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={onRefresh}
                disabled={loading}
                className={`p-1.5 rounded transition-all duration-200 ${
                  isDark 
                    ? "hover:bg-gray-700 text-gray-300 disabled:text-gray-600" 
                    : "hover:bg-gray-200 text-gray-600 disabled:text-gray-400"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
              </button>
              
              <button
                onClick={onClose}
                className={`p-1.5 rounded transition-all duration-200 ${
                  isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-3 overflow-y-auto max-h-[55vh]">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className={`text-xs ml-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Loading...
              </span>
            </div>
          ) : references.length === 0 ? (
            <div className={`text-center py-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No references found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {references.map((ref, index) => (
                <div 
                  key={ref.id || index} 
                  className={`p-3 rounded border text-sm ${
                    isDark 
                      ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700" 
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  } transition-colors duration-200`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-medium truncate max-w-[60%] ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}>
                      {ref.name}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center space-x-2">
                      <Phone className={`w-3 h-3 ${isDark ? "text-green-400" : "text-green-600"}`} />
                      <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                        {ref.mobile}
                      </span>
                    </div>
                    
                    {ref.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className={`w-3 h-3 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                        <span className={`truncate max-w-[300px] ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {ref.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compact Footer */}
        <div className={`p-3 border-t ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}>
          <button
            onClick={onClose}
            className={`w-full py-1.5 rounded text-sm font-medium transition-all duration-200 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceModal;