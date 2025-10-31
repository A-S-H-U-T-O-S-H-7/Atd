"use client";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

const InProcessStatusModal = ({
  isOpen,
  onClose,
  application,
  statusOptions = [],
  onStatusUpdate,
  isDark
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [documentsReceived, setDocumentsReceived] = useState("");
  const [bankVerified, setBankVerified] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  
  const modalRef = useRef(null);

  const bankOptions = [
    "Yes Bank",
    "ICICI Bank-A/c-5399",
    "ICICI Bank-A/C-1738",
    "ICICI Bank-A/c-5395",
    "ICICI Bank-A/c-5403",
    "ICICI Bank-A/c-5402",
    "ICICI Bank-A/c-1661",
    "CASH FEE",
    "ICICI Bank-A/c-5400"
  ];

  useEffect(() => {
    if (isOpen && application) {
      setSelectedStatus(application.status || "");
      setDocumentsReceived("");
      setBankVerified("");
      setSelectedBank("");
      setRemark("");
    }
  }, [isOpen, application]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unhidden';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      await Swal.fire({
        title: 'Missing Status!',
        text: 'Please select a status.',
        icon: 'warning',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {
        status: selectedStatus,
        documentsReceived,
        bankVerified,
        selectedBank,
        remark
      };
      
      await onStatusUpdate(application.id, updateData);
      
      await Swal.fire({
        title: 'Status Updated!',
        text: 'Application status has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });

      onClose();
    } catch (error) {
      console.error("Status update error:", error);
      await Swal.fire({
        title: 'Update Failed!',
        text: 'Failed to update status. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className={`rounded-2xl shadow-2xl w-full max-w-lg transform transition-all ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className={`p-6 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 className={`text-xl font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            In-Process Status Update
          </h2>
          <p className={`mt-1 text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            {application?.name} ({application?.crnNo})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Status *
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Original Documents Received */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Original Documents Received
              </label>
              <select
                value={documentsReceived}
                onChange={(e) => setDocumentsReceived(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Bank Verified */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Customer Bank Verified Received
              </label>
              <select
                value={bankVerified}
                onChange={(e) => setBankVerified(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Select Bank */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Select Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Select Bank</option>
                {bankOptions.map((bank, index) => (
                  <option key={index} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
            </div>

            {/* Remark */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Remark
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
                placeholder="Add any remarks or notes..."
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InProcessStatusModal;