import React from "react";
import { X, User } from "lucide-react";
import ClientProfile from "./ClientViewProfile";
import ClientTables from "./ClientViewTables";

const ClientViewModal = ({ isOpen, onClose, clientData, isDark }) => {
  if (!isOpen || !clientData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b-2 ${
          isDark
            ? "bg-gray-800 border-emerald-600/50"
            : "bg-emerald-50 border-emerald-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-emerald-600/20" : "bg-emerald-100"
              }`}>
                <User className={`w-6 h-6 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Client Details
                </h2>
                <p className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  {clientData.name} - {clientData.crnNo}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-8">
            <ClientProfile clientData={clientData} isDark={isDark} />
            <ClientTables clientData={clientData} isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientViewModal;