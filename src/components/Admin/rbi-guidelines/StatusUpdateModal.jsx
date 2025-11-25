import React, { useState } from "react";
import { X, Loader } from "lucide-react";

const StatusUpdateModal = ({ isOpen, onClose, guideline, isDark, onUpdateStatus, isUpdating = false }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [finalRemark, setFinalRemark] = useState("");

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedStatus("");
      setFinalRemark("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (selectedStatus && !isUpdating) {
      try {
        await onUpdateStatus(guideline.id, selectedStatus, finalRemark);
        // Don't reset and close here - let the parent handle it after success
      } catch (error) {
        // Error is handled in parent, just keep modal open
        console.error('Error in modal submit:', error);
      }
    }
  };

  const handleCancel = () => {
    if (!isUpdating) {
      setSelectedStatus("");
      setFinalRemark("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl overflow-hidden shadow-2xl border-2 w-full max-w-md transition-all duration-300 ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b-2 flex items-center justify-between ${
            isDark
              ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
              : "bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-300"
          }`}
        >
          <h2
            className={`text-lg font-bold ${
              isDark ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Update Status
          </h2>
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              isUpdating 
                ? "opacity-50 cursor-not-allowed" 
                : ""
            } ${
              isDark
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-4">
            <h3
              className={`text-sm font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Guideline Subject:
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {guideline?.subject}
            </p>
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Status: <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isUpdating}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="">Select status</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Final Remark:
            </label>
            <textarea
              value={finalRemark}
              onChange={(e) => setFinalRemark(e.target.value)}
              disabled={isUpdating}
              placeholder="Enter final remark (optional)"
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium resize-none ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedStatus || isUpdating}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
                !selectedStatus || isUpdating
                  ? isDark
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isDark
                  ? "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isUpdating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;