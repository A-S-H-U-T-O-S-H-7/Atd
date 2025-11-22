import React, { useState, useEffect } from "react";
import { X, Edit3, Check, FileText } from "lucide-react";
import { toast } from 'react-hot-toast';
import complaintService from "@/lib/services/ComplaintService";

const ComplaintDetailModal = ({ isOpen, onClose, complaint, onUpdate, isDark }) => {
  const [editMode, setEditMode] = useState(false);
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [showFinalRemarkForm, setShowFinalRemarkForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    complaintDetails: "",
    complaintFor: "",
    assignedTo: "",
    resolutionRemarks: "",
    closeDate: "",
    finalRemarks: ""
  });

  // Update formData when complaint prop changes
  useEffect(() => {
    if (complaint) {
      setFormData({
        complaintDetails: complaint.complaint_details || "",
        complaintFor: complaint.complaint_for || "",
        assignedTo: complaint.complaint_assign_to || "",
        resolutionRemarks: complaint.resolution_remarks || "",
        closeDate: complaint.close_date || "",
        finalRemarks: complaint.final_remarks || ""
      });
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const handleAssignComplaint = async () => {
    if (!formData.complaintDetails.trim() || !formData.complaintFor.trim() || !formData.assignedTo) {
      toast.error("Please provide complaint details, complaint for, and assign to");
      return;
    }

    setIsSubmitting(true);
    try {
      await complaintService.assignComplaint(complaint.id, {
        complaintDetails: formData.complaintDetails,
        complaintFor: formData.complaintFor,
        assignedTo: formData.assignedTo
      });
      
      // Call onUpdate to update parent state
      onUpdate(complaint.id, {
        complaint_details: formData.complaintDetails,
        complaint_for: formData.complaintFor,
        complaint_assign_to: formData.assignedTo,
        status: "Open" // Update status to Open after assignment
      });
      
      setEditMode(false);
      toast.success('Complaint assigned successfully!');
    } catch (error) {
      console.error('Error assigning complaint:', error);
      const errorMessage = error.message || 'Failed to assign complaint.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseComplaint = async () => {
    if (!formData.resolutionRemarks.trim() || !formData.closeDate) {
      toast.error("Please provide both resolution remarks and close date");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await complaintService.closeComplaint(complaint.id, {
        resolutionRemarks: formData.resolutionRemarks,
        closeDate: formData.closeDate
      });
      
      // Call onUpdate to update parent state
      onUpdate(complaint.id, {
        resolution_remarks: formData.resolutionRemarks,
        close_date: formData.closeDate,
        status: "Close"
      });
      
      setShowCloseForm(false);
      setEditMode(false);
      toast.success('Complaint closed successfully!');
    } catch (error) {
      console.error('Error closing complaint:', error);
      const errorMessage = error.message || 'Failed to close complaint.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalRemarks = async () => {
    if (!formData.finalRemarks.trim()) {
      toast.error("Please provide final remarks");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await complaintService.addFinalRemarks(complaint.id, formData.finalRemarks);
      
      // Call onUpdate to update parent state
      onUpdate(complaint.id, {
        final_remarks: formData.finalRemarks
      });
      
      setShowFinalRemarkForm(false);
      setEditMode(false);
      toast.success('Final remarks added successfully!');
    } catch (error) {
      console.error('Error adding final remarks:', error);
      const errorMessage = error.message || 'Failed to add final remarks.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setShowCloseForm(false);
    setShowFinalRemarkForm(false);
    // Reset form data to current complaint data
    setFormData({
      complaintDetails: complaint.complaint_details || "",
      complaintFor: complaint.complaint_for || "",
      assignedTo: complaint.complaint_assign_to || "",
      resolutionRemarks: complaint.resolution_remarks || "",
      closeDate: complaint.close_date || "",
      finalRemarks: complaint.final_remarks || ""
    });
  };

  const getStatusDisplay = () => {
    const status = complaint.status || "Pending";
    if (status === "Close" && complaint.final_remarks) {
      return (
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
            isDark ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800"
          }`}>
            {status}
          </span>
          <Check className="text-green-500" size={20} />
        </div>
      );
    }
    
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
        status === "Close" 
          ? isDark ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800"
          : status === "Open"
          ? isDark ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-800"
          : isDark ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-800"
      }`}>
        {status}
      </span>
    );
  };

  const getActionButton = () => {
    const status = complaint.status || "Pending";
    
    if (status === "Pending") {
      return (
        <button
          onClick={() => setEditMode(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Assign Complaint
        </button>
      );
    } else if (status === "Open" && complaint.complaint_assign_to && !complaint.close_date) {
      return (
        <button
          onClick={() => {
            setShowCloseForm(true);
            setEditMode(true);
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Close Complaint
        </button>
      );
    } else if (status === "Close" && !complaint.final_remarks) {
      return (
        <button
          onClick={() => {
            setShowFinalRemarkForm(true);
            setEditMode(true);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
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
        {/* Modal header */}
        <div className={`px-6 py-4 border-b-2 flex items-center justify-between ${
          isDark ? "border-emerald-600/50" : "border-emerald-300"
        }`}>
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Complaint Details - {complaint.name}
          </h3>
          <div className="flex items-center space-x-2">
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
          {/* Customer Information */}
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
                  <span className="font-medium">Loan No:</span> {complaint.loan_no || "N/A"}
                </p>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Loan Provider:</span> {complaint.loan_belong_to || "N/A"}
                </p>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Date:</span> {complaint.complaint_date}
                </p>
              </div>
            </div>
            
            {/* Complaint Status */}
            <div>
              <h4 className={`font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Complaint Status
              </h4>
              <div className="space-y-3">
                {getStatusDisplay()}
                <div className="space-y-2">
                  {editMode && complaint.status === "Pending" && !showCloseForm ? (
                    <>
                      <input
                        type="text"
                        placeholder="Complaint For (e.g., RBI, Other)"
                        value={formData.complaintFor}
                        onChange={(e) => setFormData({...formData, complaintFor: e.target.value})}
                        className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                          isDark
                            ? "bg-gray-700 border-emerald-600/50 text-white"
                            : "bg-white border-emerald-300 text-gray-900"
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Assign To (User ID)"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                        className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                          isDark
                            ? "bg-gray-700 border-emerald-600/50 text-white"
                            : "bg-white border-emerald-300 text-gray-900"
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        <span className="font-medium">Complaint For:</span> {complaint.complaint_for || "Not assigned"}
                      </p>
                      <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        <span className="font-medium">Assigned To:</span> {complaint.complaint_assign_to || "Not assigned"}
                      </p>
                      {complaint.open_date && (
                        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          <span className="font-medium">Open Date:</span> {complaint.open_date}
                        </p>
                      )}
                    </>
                  )}
                  {complaint.close_date && (
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="font-medium">Close Date:</span> {complaint.close_date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Complaint Details */}
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
              Complaint Details
            </h4>
            {editMode && complaint.status === "Pending" && !showCloseForm ? (
              <textarea
                value={formData.complaintDetails}
                onChange={(e) => setFormData({...formData, complaintDetails: e.target.value})}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-white"
                    : "bg-white border-emerald-300 text-gray-900"
                }`}
                placeholder="Enter complaint details..."
              />
            ) : (
              <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {complaint.complaint_details || "No details provided"}
                </p>
              </div>
            )}
          </div>

          {/* Resolution Remarks */}
          {(complaint.resolution_remarks || showCloseForm) && (
            <div>
              <h4 className={`font-semibold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Resolution Remarks
              </h4>
              {showCloseForm ? (
                <textarea
                  value={formData.resolutionRemarks}
                  onChange={(e) => setFormData({...formData, resolutionRemarks: e.target.value})}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white"
                      : "bg-white border-emerald-300 text-gray-900"
                  }`}
                  placeholder="Enter resolution remarks..."
                />
              ) : (
                <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    {complaint.resolution_remarks || "No resolution provided"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Close Date Input */}
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

          {/* Final Remarks */}
          {(complaint.final_remarks || showFinalRemarkForm) && (
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
                    {complaint.final_remarks}
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
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isDark ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
                {showCloseForm ? (
                  <button
                    onClick={handleCloseComplaint}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Closing...' : 'Close Complaint'}
                  </button>
                ) : showFinalRemarkForm ? (
                  <button
                    onClick={handleFinalRemarks}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Final Remarks'}
                  </button>
                ) : (
                  <button
                    onClick={handleAssignComplaint}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Assigning...' : 'Assign Complaint'}
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