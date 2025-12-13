"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const StatusUpdateModal = ({
  isOpen,
  onClose,
  application,
  statusOptions = [],
  onStatusUpdate,
  isDark
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && application) {
      setSelectedStatus(application.status || "");
      setRemark("");
    }
  }, [isOpen, application]);

  // Outside click, escape key, and scroll lock functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !loading) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && !loading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      toast.error('Please select a status.', {
        style: {
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
          border: isDark ? "1px solid #374151" : "1px solid #e5e7eb"
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#f9fafb',
        }
      });
      return;
    }

    try {
      setLoading(true);
      
      await onStatusUpdate(application.id, selectedStatus, remark);
      
      toast.success('Application status has been updated successfully.', {
        style: {
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
          border: isDark ? "1px solid #374151" : "1px solid #e5e7eb"
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#f9fafb',
        }
      });

      handleClose();
    } catch (error) {
      console.error("Status update error:", error);
      toast.error('Failed to update status. Please try again.', {
        style: {
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
          border: isDark ? "1px solid #374151" : "1px solid #e5e7eb"
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#f9fafb',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          handleClose();
        }
      }}
    >
      <div 
        ref={modalRef}
        className={`rounded-2xl shadow-2xl w-full max-w-md transform transition-all ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className={`p-6 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 className={`text-xl font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Status Update
          </h2>
          <p className={`mt-1 text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            {application?.name} ({application?.crnNo})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Status Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Status *
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => !loading && setSelectedStatus(e.target.value)}
                disabled={loading}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
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

            {/* Remark */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Remark
              </label>
              <textarea
                value={remark}
                onChange={(e) => !loading && setRemark(e.target.value)}
                disabled={loading}
                rows={3}
                placeholder="Add any remarks or notes..."
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
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
              onClick={handleClose}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
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

export default StatusUpdateModal;