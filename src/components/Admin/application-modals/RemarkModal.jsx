import React from 'react';
import { X, MessageSquare } from 'lucide-react';

const RemarksModal = ({ isOpen, onClose, isDark, customerName, loanNo }) => {
  // Static remarks data for display
  const remarksData = [
    {
      title: "Personal Remarks",
      content: "1 - Suresh - 9353439138 - (Father) - verify................... 2 - Jayesh - 7666208479 - (Brother) - verify................... 3 - Dimple - 9353439138 - (Sister) - verify................... 4 - Anna - 9353439138 - (Colleague) - verify................... 5 - Amit - 9757713595 - (Ex colleague - friend) - verify....................."
    },
    {
      title: "Salary Remarks",
      content: "5-7-2024 - 64625................... 5-8-2024 - 62488................... 5-9-2024 - 67597..........................."
    },
    {
      title: "Organization Remarks",
      content: "CLASSIC FLOORINGS"
    },
    {
      title: "Salary Slip Remarks",
      content: "ok"
    },
    {
      title: "Bank Remarks",
      content: ""
    },
    {
      title: "Social Remarks",
      content: "ok"
    },
    {
      title: "Cibil Remarks",
      content: "ok"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl max-h-[80vh] rounded-lg shadow-2xl ${
        isDark 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      } overflow-hidden`}>
        
        {/* Header */}
        <div className={`px-6 py-3 border-b flex items-center justify-between ${
          isDark 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-1.5 rounded ${
              isDark ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <MessageSquare className={`w-4 h-4 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Appraisal Remarks
              </h2>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {customerName} - Loan No: {loanNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded hover:bg-opacity-80 transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="space-y-3">
            {remarksData.map((remark, index) => (
              <div key={index} className={`grid grid-cols-4 gap-4 py-2 border-b last:border-b-0 ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className={`font-semibold  ${
                  isDark ? 'text-emerald-500' : 'text-gray-800'
                }`}>
                  {remark.title}:
                </div>
                <div className={`col-span-3 text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {remark.content || (
                    <span className={`italic ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      No remarks available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-4 py-3 border-t flex justify-end ${
          isDark 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemarksModal;