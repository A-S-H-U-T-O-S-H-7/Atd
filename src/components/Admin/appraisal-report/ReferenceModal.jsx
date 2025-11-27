import React, { useEffect, useRef } from 'react';
import { X, User, Phone, Mail, Users } from 'lucide-react';

const ReferenceModal = ({ isOpen, onClose, references, isDark }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter out empty references
  const validReferences = references.filter(ref => 
    ref.name && ref.name.trim() || 
    ref.email && ref.email.trim() || 
    ref.phone && ref.phone.trim()
  );

  const modalClassName = `fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`;

  const backdropClassName = `fixed inset-0 transition-all duration-300 ${
    isDark ? 'bg-black/70' : 'bg-black/50'
  } ${isOpen ? 'opacity-100' : 'opacity-0'}`;

  const contentClassName = `relative rounded-2xl border-2 shadow-2xl transform transition-all duration-300 max-w-2xl w-full max-h-[80vh] overflow-hidden ${
    isDark 
      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-emerald-500/30' 
      : 'bg-white border-emerald-200'
  } ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`;

  const headerClassName = `p-6 border-b ${
    isDark ? 'border-gray-700 bg-gray-800/50' : 'border-emerald-100 bg-emerald-50'
  }`;

  const cardClassName = `p-4 rounded-lg border transition-all duration-200 ${
    isDark 
      ? 'bg-gray-800/40 border-gray-700 hover:border-emerald-500/30' 
      : 'bg-white border-emerald-100 hover:border-emerald-300'
  }`;

  const iconClassName = `p-2 rounded-lg ${
    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
  }`;

  const textClassName = `text-sm ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  const labelClassName = `text-xs font-semibold ${
    isDark ? 'text-gray-400' : 'text-gray-500'
  }`;

  return (
    <div className={modalClassName}>
      {/* Backdrop */}
      <div className={backdropClassName} />
      
      {/* Modal Content */}
      <div ref={modalRef} className={contentClassName}>
        {/* Header */}
        <div className={headerClassName}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={iconClassName}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}>
                  Reference Details
                </h2>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-emerald-600'
                }`}>
                  {validReferences.length} reference{validReferences.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {validReferences.length === 0 ? (
            <div className="text-center py-8">
              <Users className={`w-12 h-12 mx-auto mb-4 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-lg font-semibold ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No References Added
              </p>
              <p className={`text-sm mt-2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Add references to see them here
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {validReferences.map((ref, index) => (
                <div key={index} className={cardClassName}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        ref.verified ? 'bg-emerald-500' : 'bg-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {ref.name || 'Unnamed Reference'}
                        </h3>
                        <p className={`text-xs ${
                          isDark ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>
                          {ref.relation || 'No relation specified'}
                          {ref.verified && (
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              isDark 
                                ? 'bg-emerald-500/20 text-emerald-300' 
                                : 'bg-emerald-500/10 text-emerald-700'
                            }`}>
                              Verified
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="flex items-center space-x-3">
                      <div className={iconClassName}>
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={labelClassName}>Phone</p>
                        <p className={textClassName}>
                          {ref.phone ? (
                            <a 
                              href={`tel:${ref.phone}`}
                              className={`hover:underline ${
                                isDark ? 'text-emerald-400' : 'text-emerald-600'
                              }`}
                            >
                              {ref.phone}
                            </a>
                          ) : (
                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-3">
                      <div className={iconClassName}>
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={labelClassName}>Email</p>
                        <p className={textClassName}>
                          {ref.email ? (
                            <a 
                              href={`mailto:${ref.email}`}
                              className={`hover:underline ${
                                isDark ? 'text-emerald-400' : 'text-emerald-600'
                              }`}
                            >
                              {ref.email}
                            </a>
                          ) : (
                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${
          isDark ? 'border-gray-700 bg-gray-800/50' : 'border-emerald-100 bg-emerald-50'
        }`}>
          <div className="flex justify-between items-center">
            <p className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-emerald-600'
            }`}>
              Click outside or press ESC to close
            </p>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceModal;