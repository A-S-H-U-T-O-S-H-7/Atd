import React, { useEffect } from "react";
import { X, Building } from "lucide-react";

const AccountDetailsModal = ({ isOpen, onClose, accountDetails = null, isDark }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Click to close */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content - Stop click propagation */}
      <div 
        className={`relative w-full max-w-md rounded-xl shadow-2xl border-2 z-10 ${
          isDark ? "bg-gray-900 border-gray-600" : "bg-white border-blue-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? "border-gray-600" : "border-blue-200"
        }`}>
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-green-600" />
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Company Account Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-red-100 text-gray-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {accountDetails ? (
            <div className={`text-sm space-y-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <div className={`p-3 rounded border ${
                isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-blue-50"
              }`}>
                <h4 className="font-semibold mb-2">Virtual Account</h4>
                <div className="space-y-1">
                  <div className="flex justify-between"><strong>Name:</strong> {accountDetails.virtual_details?.name}</div>
                  <div className="flex justify-between">
                    <strong>Account No:</strong> 
                    <span className="font-bold text-blue-600 bg-blue-100 px-1 rounded">
                      {accountDetails.virtual_details?.virtual_ac_no || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between"><strong>IFSC:</strong> {accountDetails.virtual_details?.ifsc}</div>
                </div>
              </div>
              
              <div className={`p-3 rounded border ${
                isDark ? "border-gray-600 bg-gray-800" : "border-green-200 bg-green-50"
              }`}>
                <h4 className="font-semibold mb-2">Bank Account</h4>
                <div className="space-y-1">
                  <div className="flex justify-between"><strong>Name:</strong> {accountDetails.account_details?.name}</div>
                  <div className="flex justify-between">
                    <strong>Account No:</strong> 
                    <span className="font-bold text-green-700 bg-green-100 px-1 rounded">
                      {accountDetails.account_details?.ac_no}
                    </span>
                  </div>
                  <div className="flex justify-between"><strong>IFSC:</strong> {accountDetails.account_details?.ifsc}</div>
                  <div className="flex justify-between"><strong>Bank:</strong> {accountDetails.account_details?.bank_name}</div>
                  <div className="flex justify-between"><strong>Account Type:</strong> {accountDetails.account_details?.bank_ac_type}</div>
                  <div className="flex justify-between"><strong>Branch:</strong> {accountDetails.account_details?.bank_branch}</div>
                </div>
              </div>
              
              <div className={`p-3 rounded border ${
                isDark ? "border-gray-600 bg-gray-800" : "border-purple-200 bg-purple-50"
              }`}>
                <h4 className="font-semibold mb-2">UPI Details</h4>
                <div className="flex justify-between">
                  <strong>UPI ID:</strong> 
                  <span className="font-bold text-purple-700 bg-purple-100 px-1 rounded">
                    {accountDetails.upi_detial}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No account details available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsModal;