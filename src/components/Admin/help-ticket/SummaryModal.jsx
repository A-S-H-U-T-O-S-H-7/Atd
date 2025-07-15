import React from "react";
import { X } from "lucide-react";

const SummaryModal = ({ isOpen, onClose, ticket, isDark }) => {
  const summaryData = [
    {
      date: "2019-01-29",
      comment: "Test"
    },
    {
      date: "2019-01-29",
      comment: "Resolved"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl w-full max-w-3xl ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {ticket?.subject}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
              isDark ? "hover:bg-gray-700 text-gray-400" : "text-gray-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ticket Message */}
          <div className={`mb-6 p-4 rounded-lg ${
            isDark ? "bg-gray-700" : "bg-gray-50"
          }`}>
            <p className={`text-sm ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {ticket?.message}
            </p>
          </div>

          {/* Summary Table */}
          <div className={`rounded-lg overflow-hidden border ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}>
            <table className="w-full">
              <thead className={`${
                isDark ? "bg-blue-600" : "bg-blue-500"
              } text-white`}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } divide-y ${
                isDark ? "divide-gray-700" : "divide-gray-200"
              }`}>
                {summaryData.map((item, index) => (
                  <tr key={index} className={`${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } transition-colors`}>
                    <td className={`px-6 py-4 text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      {item.date}
                    </td>
                    <td className={`px-6 py-4 text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      {item.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;