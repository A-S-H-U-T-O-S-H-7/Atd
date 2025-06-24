import React, { useState, useEffect } from "react";
import { X, Edit3, Check } from "lucide-react";

const ComplaintDetailModal = ({ isOpen, onClose, complaint, onUpdate, isDark }) => {
  const [editMode, setEditMode] = useState(false);
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [showFinalRemarkForm, setShowFinalRemarkForm] = useState(false);
  const [formData, setFormData] = useState({
    status: complaint?.status || "",
    complaintResolution: complaint?.complaintResolution || "",
    assignedTo: complaint?.assignedTo || "",
    closeDate: complaint?.closeDate || "",
    finalRemarks: complaint?.finalRemarks || ""
  });

  useEffect(() => {
    if (complaint) {
      setFormData({
        status: complaint.status || "",
        complaintResolution: complaint.complaintResolution || "",
        assignedTo: complaint.assignedTo || "",
        closeDate: complaint.closeDate || "",
        finalRemarks: complaint.finalRemarks || ""
      });
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  // Handle status button click based on current status
  const handleStatusAction = () => {
    if (complaint.status === "Open") {
      setShowCloseForm(true);
      setEditMode(true);
    } else if (complaint.status === "Close" && !complaint.finalRemarks) {
      setShowFinalRemarkForm(true);
      setEditMode(true);
    }
  };

  const handleCloseComplaint = () => {
    if (!formData.complaintResolution.trim() || !formData.closeDate) {
      alert("Please provide both resolution remarks and close date");
      return;
    }
    
    const updatedData = {
      ...formData,
      status: "Close"
    };
    
    onUpdate(complaint.id, updatedData);
    setShowCloseForm(false);
    setEditMode(false);
    onClose();
  };

  const handleFinalRemarks = () => {
    if (!formData.finalRemarks.trim()) {
      alert("Please provide final remarks");
      return;
    }
    
    onUpdate(complaint.id, formData);
    setShowFinalRemarkForm(false);
    setEditMode(false);
    onClose();
  };

  const handleRegularUpdate = () => {
    // Only allow updating assignedTo and complaintResolution if status is Open
    if (complaint.status === "Open") {
      onUpdate(complaint.id, {
        assignedTo: formData.assignedTo,
        complaintResolution: formData.complaintResolution
      });
    }
    setEditMode(false);
    onClose();
  };

  const cancelEdit = () => {
    setEditMode(false);
    setShowCloseForm(false);
    setShowFinalRemarkForm(false);
    // Reset form data to original complaint data
    setFormData({
      status: complaint.status || "",
      complaintResolution: complaint.complaintResolution || "",
      assignedTo: complaint.assignedTo || "",
      closeDate: complaint.closeDate || "",
      finalRemarks: complaint.finalRemarks || ""
    });
  };

  const getStatusDisplay = () => {
    if (complaint.status === "Close" && complaint.finalRemarks) {
      return (
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
            isDark ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800"
          }`}>
            {complaint.status}
          </span>
          <Check className="text-green-500" size={20} />
        </div>
      );
    }
    
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
        complaint.status === "Close" 
          ? isDark ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800"
          : isDark ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-800"
      }`}>
        {complaint.status}
      </span>
    );
  };

  const getActionButton = () => {
    if (complaint.status === "Open") {
      return (
        <button
          onClick={handleStatusAction}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Close Complaint
        </button>
      );
    } else if (complaint.status === "Close" && !complaint.finalRemarks) {
      return (
        <button
          onClick={handleStatusAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Add Final Remarks
        </button>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`rounded-2xl shadow-2xl border-2 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden ${
        isDark 
          ? "bg-gray-800 border-emerald-600/50" 
          : "bg-white border-emerald-300"
      }`}>
        <div className={`px-6 py-4 border-b-2 flex items-center justify-between ${
          isDark ? "border-emerald-600/50" : "border-emerald-300"
        }`}>
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Complaint Details - {complaint.name}
          </h3>
          <div className="flex items-center space-x-2">
            {!editMode && complaint.status === "Open" && (
              <button
                onClick={() => setEditMode(true)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark ? "hover:bg-gray-700 text-emerald-400" : "hover:bg-emerald-100 text-emerald-600"
                }`}
              >
                <Edit3 size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Customer Information
              </h4>
              <div className="space-y-2">
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Name:</span> {complaint.name}
                </p>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Phone:</span> {complaint.phone}
                </p>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Email:</span> {complaint.email}
                </p>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Loan No:</span> {complaint.loanNo}
                </p>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Date:</span> {complaint.date}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className={`font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Complaint Status
              </h4>
              <div className="space-y-3">
                {getStatusDisplay()}
                <div className="space-y-2">
                  {editMode && complaint.status === "Open" && !showCloseForm ? (
                    <input
                      type="text"
                      placeholder="Assigned To"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-emerald-600/50 text-white"
                          : "bg-white border-emerald-300 text-gray-900"
                      }`}
                    />
                  ) : (
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="font-medium">Assigned To:</span> {complaint.assignedTo}
                    </p>
                  )}
                  {complaint.closeDate && (
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="font-medium">Close Date:</span> {complaint.closeDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
              Complaint Details
            </h4>
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {complaint.complaintDetails}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
              Complaint Resolution
            </h4>
            {editMode && (complaint.status === "Open" || showCloseForm) ? (
              <textarea
                value={formData.complaintResolution}
                onChange={(e) => setFormData({...formData, complaintResolution: e.target.value})}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-white"
                    : "bg-white border-emerald-300 text-gray-900"
                }`}
                placeholder="Enter complaint resolution..."
              />
            ) : (
              <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {complaint.complaintResolution || "No resolution provided yet"}
                </p>
              </div>
            )}
          </div>

          {/* Close Date Input - Only shown when closing complaint */}
          {showCloseForm && (
            <div>
              <h4 className={`font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Complaint Close Date
              </h4>
              <input
                type="date"
                value={formData.closeDate}
                onChange={(e) => setFormData({...formData, closeDate: e.target.value})}
                className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-white"
                    : "bg-white border-emerald-300 text-gray-900"
                }`}
              />
            </div>
          )}

          {/* Final Remarks Section */}
          {(complaint.finalRemarks || showFinalRemarkForm) && (
            <div>
              <h4 className={`font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Final Remarks
              </h4>
              {showFinalRemarkForm ? (
                <textarea
                  value={formData.finalRemarks}
                  onChange={(e) => setFormData({...formData, finalRemarks: e.target.value})}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white"
                      : "bg-white border-emerald-300 text-gray-900"
                  }`}
                  placeholder="Enter final remarks..."
                />
              ) : (
                <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    {complaint.finalRemarks}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div>
              {!editMode && getActionButton()}
            </div>
            
            {editMode && (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelEdit}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isDark ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  Cancel
                </button>
                {showCloseForm ? (
                  <button
                    onClick={handleCloseComplaint}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Close Complaint
                  </button>
                ) : showFinalRemarkForm ? (
                  <button
                    onClick={handleFinalRemarks}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Save Final Remarks
                  </button>
                ) : (
                  <button
                    onClick={handleRegularUpdate}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;