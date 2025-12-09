import React, { useState, useEffect, useRef } from "react";
import { X, Edit3, Check, FileText, ChevronDown, Users } from "lucide-react";
import { toast } from 'react-hot-toast';
import complaintService from "@/lib/services/ComplaintService";

const ComplaintDetailModal = ({ isOpen, onClose, complaint, onUpdate, isDark }) => {
  const [editMode, setEditMode] = useState(false);
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [showFinalRemarkForm, setShowFinalRemarkForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComplaintForDropdown, setShowComplaintForDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    complaintDetails: "",
    complaintFor: "",
    complaintForType: "RBI",
    customComplaintFor: "",
    assignedTo: "",
    assignedToName: "",
    resolutionRemarks: "",
    closeDate: "",
    finalRemarks: ""
  });

  const modalRef = useRef();
  const userDropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen) {
        setIsLoadingUsers(true);
        try {
          const response = await complaintService.getUsers();
          if (response?.success) {
            setUsers(response.users || []);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          toast.error('Failed to load users');
        } finally {
          setIsLoadingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [isOpen]);

  useEffect(() => {
    if (complaint) {
      let complaintForType = "RBI";
      let complaintFor = complaint.complaint_for || "";
      let customComplaintFor = "";
      
      if (complaintFor && complaintFor !== "RBI") {
        complaintForType = "Others";
        customComplaintFor = complaintFor;
      }

      let assignedToName = "";
      if (complaint.complaint_assign_to) {
        const user = users.find(u => u.id.toString() === complaint.complaint_assign_to);
        if (user) {
          assignedToName = user.username;
        } else {
          assignedToName = complaint.complaint_assign_to;
        }
      }

      setFormData({
        complaintDetails: complaint.complaint_details || "",
        complaintFor: complaintFor,
        complaintForType: complaintForType,
        customComplaintFor: customComplaintFor,
        assignedTo: complaint.complaint_assign_to || "",
        assignedToName: assignedToName,
        resolutionRemarks: complaint.resolution_remarks || "",
        closeDate: complaint.close_date || "",
        finalRemarks: complaint.final_remarks || ""
      });
    }
  }, [complaint, users]);

  const handleComplaintForSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      complaintForType: type,
      complaintFor: type === "RBI" ? "RBI" : prev.customComplaintFor
    }));
    setShowComplaintForDropdown(false);
  };

  const handleCustomComplaintForChange = (value) => {
    setFormData(prev => ({
      ...prev,
      customComplaintFor: value,
      complaintFor: value
    }));
  };

  const handleUserSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: user.id.toString(),
      assignedToName: user.username
    }));
    setShowUserDropdown(false);
  };

  if (!isOpen || !complaint) return null;

  const handleAssignComplaint = async () => {
    let validatedComplaintFor = "";
    if (formData.complaintForType === "RBI") {
      validatedComplaintFor = "RBI";
    } else {
      validatedComplaintFor = formData.customComplaintFor.trim();
      if (!validatedComplaintFor) {
        toast.error("Please specify the complaint for (Others)");
        return;
      }
    }

    if (!formData.complaintDetails.trim() || !validatedComplaintFor || !formData.assignedTo) {
      toast.error("Please provide complaint details, complaint for, and assign to");
      return;
    }

    setIsSubmitting(true);
    try {
      await complaintService.assignComplaint(complaint.id, {
        complaintDetails: formData.complaintDetails,
        complaintFor: validatedComplaintFor,
        assignedTo: formData.assignedTo
      });
      
      onUpdate(complaint.id, {
        complaint_details: formData.complaintDetails,
        complaint_for: validatedComplaintFor,
        complaint_assign_to: formData.assignedTo,
        status: "Open"
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
    setShowComplaintForDropdown(false);
    setShowUserDropdown(false);
    
    let complaintForType = "RBI";
    let complaintFor = complaint.complaint_for || "";
    let customComplaintFor = "";
    
    if (complaintFor && complaintFor !== "RBI") {
      complaintForType = "Others";
      customComplaintFor = complaintFor;
    }

    let assignedToName = "";
    if (complaint.complaint_assign_to) {
      const user = users.find(u => u.id.toString() === complaint.complaint_assign_to);
      if (user) {
        assignedToName = user.username;
      } else {
        assignedToName = complaint.complaint_assign_to;
      }
    }

    setFormData({
      complaintDetails: complaint.complaint_details || "",
      complaintFor: complaintFor,
      complaintForType: complaintForType,
      customComplaintFor: customComplaintFor,
      assignedTo: complaint.complaint_assign_to || "",
      assignedToName: assignedToName,
      resolutionRemarks: complaint.resolution_remarks || "",
      closeDate: complaint.close_date || "",
      finalRemarks: complaint.final_remarks || ""
    });
  };

  const getStatusDisplay = () => {
    const status = complaint.status || "Pending";
    const baseClasses = "px-3 py-1.5 rounded-lg text-sm font-medium mb-4";
    
    if (status === "Close" && complaint.final_remarks) {
      return (
        <div className="flex items-center space-x-2">
          <span className={`${baseClasses} ${
            isDark ? "bg-green-900/60 text-green-300" : "bg-green-100 text-green-800"
          }`}>
            {status}
          </span>
          <Check className="text-green-500" size={20} />
        </div>
      );
    }
    
    let statusClasses = "";
    if (status === "Close") {
      statusClasses = isDark 
        ? "bg-green-900/60 text-green-300"
        : "bg-green-100 text-green-800";
    } else if (status === "Open") {
      statusClasses = isDark
        ? "bg-blue-900/60 text-blue-300"
        : "bg-blue-100 text-blue-800";
    } else {
      statusClasses = isDark
        ? "bg-yellow-900/60 text-yellow-300"
        : "bg-yellow-100 text-yellow-800";
    }
    
    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
  };

  const getActionButton = () => {
    const status = complaint.status || "Pending";
    
    if (status === "Pending") {
      return (
        <button
          onClick={() => setEditMode(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200"
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
          className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all duration-200"
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
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all duration-200"
        >
          Add Final Remarks
        </button>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className={`rounded-xl shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-hidden ${
          isDark 
            ? "bg-gray-900 border border-gray-800" 
            : "bg-white border border-gray-200"
        }`}
      >
        <div className={`px-5 py-3 border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className={isDark ? "text-emerald-400" : "text-emerald-600"} size={20} />
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Complaint Details - {complaint.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-all ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-64px)] space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800/40" : "bg-gray-50"}`}>
              <h4 className={`font-semibold mb-3 text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Customer Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Name</p>
                  <p className={`text-sm truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}>{complaint.name}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Phone</p>
                  <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>{complaint.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Email</p>
                  <p className={`text-sm truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}>{complaint.email}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loan No</p>
                  <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>{complaint.loan_no || "N/A"}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Provider</p>
                  <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>{complaint.loan_belong_to || "N/A"}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Date</p>
                  <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>{complaint.complaint_date}</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800/40" : "bg-gray-50"}`}>
              <h4 className={`font-semibold mb-3 text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Status & Assignment
              </h4>
              
              <div className="space-y-3">
                <div>
                  {getStatusDisplay()}
                </div>
                
                <div className="space-y-3">
                  {editMode && complaint.status === "Pending" && !showCloseForm ? (
                    <>
                      <div className="space-y-1.5">
                        <label className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          Complaint For
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowComplaintForDropdown(!showComplaintForDropdown)}
                            className={`w-full px-3 py-1.5 rounded-lg border flex items-center justify-between transition-all text-sm ${
                              isDark
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                          >
                            <span>{formData.complaintForType}</span>
                            <ChevronDown className={`transition-transform ${showComplaintForDropdown ? "rotate-180" : ""}`} size={16} />
                          </button>
                          
                          {showComplaintForDropdown && (
                            <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-10 text-sm ${
                              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                            }`}>
                              {["RBI", "Others"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => handleComplaintForSelect(type)}
                                  className={`w-full px-3 py-1.5 text-left ${
                                    formData.complaintForType === type
                                      ? isDark ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-50 text-emerald-700"
                                      : isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-50 text-gray-700"
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {formData.complaintForType === "Others" && (
                          <input
                            type="text"
                            placeholder="Specify complaint for..."
                            value={formData.customComplaintFor}
                            onChange={(e) => handleCustomComplaintForChange(e.target.value)}
                            className={`w-full px-3 py-1.5 rounded-lg border text-sm ${
                              isDark
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                          />
                        )}
                      </div>
                      
                      <div>
                        <label className={`text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          Assign To
                        </label>
                        <div className="relative" ref={userDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                            className={`w-full px-3 py-1.5 rounded-lg border flex items-center justify-between transition-all text-sm ${
                              isDark
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                            disabled={isLoadingUsers}
                          >
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>
                                {formData.assignedToName || (isLoadingUsers ? "Loading users..." : "Select user")}
                              </span>
                            </div>
                            <ChevronDown className={`transition-transform ${showUserDropdown ? "rotate-180" : ""} ${isLoadingUsers ? "opacity-50" : ""}`} size={16} />
                          </button>
                          
                          {showUserDropdown && !isLoadingUsers && (
                            <div className={`absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg z-10 text-sm ${
                              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                            }`}>
                              {users.length > 0 ? (
                                users.map((user) => (
                                  <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handleUserSelect(user)}
                                    className={`w-full px-3 py-2 text-left flex items-center space-x-2 ${
                                      formData.assignedTo === user.id.toString()
                                        ? isDark ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-50 text-emerald-700"
                                        : isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    <span className="font-medium">{user.username}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                      isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"
                                    }`}>
                                      ID: {user.id}
                                    </span>
                                  </button>
                                ))
                              ) : (
                                <div className={`px-3 py-2 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                  No users found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Complaint For</p>
                        <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                          {complaint.complaint_for || "Not assigned"}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Assigned To</p>
                        <div className="flex items-center space-x-2">
                          {complaint.complaint_assign_to ? (
                            <>
                              <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                                {formData.assignedToName}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"
                              }`}>
                                ID: {complaint.complaint_assign_to}
                              </span>
                            </>
                          ) : (
                            <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              Not assigned
                            </span>
                          )}
                        </div>
                      </div>
                      {complaint.open_date && (
                        <div>
                          <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Open Date</p>
                          <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{complaint.open_date}</p>
                        </div>
                      )}
                      {complaint.close_date && (
                        <div>
                          <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Close Date</p>
                          <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{complaint.close_date}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800/40" : "bg-gray-50"}`}>
            <h4 className={`font-semibold mb-3 text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
              Complaint Details
            </h4>
            {editMode && complaint.status === "Pending" && !showCloseForm ? (
              <textarea
                value={formData.complaintDetails}
                onChange={(e) => setFormData({...formData, complaintDetails: e.target.value})}
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter complaint details..."
              />
            ) : (
              <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {complaint.complaint_details || "No details provided"}
              </p>
            )}
          </div>

          {(complaint.resolution_remarks || showCloseForm) && (
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800/40" : "bg-gray-50"}`}>
              <h4 className={`font-semibold mb-3 text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Resolution Remarks
              </h4>
              {showCloseForm ? (
                <textarea
                  value={formData.resolutionRemarks}
                  onChange={(e) => setFormData({...formData, resolutionRemarks: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Enter resolution remarks..."
                />
              ) : (
                <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {complaint.resolution_remarks || "No resolution provided"}
                </p>
              )}
            </div>
          )}

          {showCloseForm && (
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800/40" : "bg-gray-50"}`}>
              <h4 className={`font-semibold mb-3 text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Complaint Close Date
              </h4>
              <input
                type="date"
                value={formData.closeDate}
                onChange={(e) => setFormData({...formData, closeDate: e.target.value})}
                className={`w-full px-3 py-1.5 rounded-lg border text-sm ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
          )}

          {(complaint.final_remarks || showFinalRemarkForm) && (
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800/40" : "bg-gray-50"}`}>
              <h4 className={`font-semibold mb-3 text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                Final Remarks
              </h4>
              {showFinalRemarkForm ? (
                <textarea
                  value={formData.finalRemarks}
                  onChange={(e) => setFormData({...formData, finalRemarks: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Enter final remarks..."
                />
              ) : (
                <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {complaint.final_remarks}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <div>
              {!editMode && getActionButton()}
            </div>
            
            {editMode && (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={cancelEdit}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    isDark 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
                {showCloseForm ? (
                  <button
                    onClick={handleCloseComplaint}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium text-sm ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Closing...' : 'Close Complaint'}
                  </button>
                ) : showFinalRemarkForm ? (
                  <button
                    onClick={handleFinalRemarks}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium text-sm ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Final Remarks'}
                  </button>
                ) : (
                  <button
                    onClick={handleAssignComplaint}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-sm ${
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