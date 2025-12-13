"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, FileText, Plus, Edit, Download, Scale, Upload, Trash2, User, Phone, Eye } from "lucide-react";
import { legalService } from "@/lib/services/LegalService";

const CriminalStatusModal = ({ isOpen, onClose, legal, isDark, onSuccess }) => {
  const [hearings, setHearings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingHearing, setIsAddingHearing] = useState(false);
  const [editingHearing, setEditingHearing] = useState(null);
  
  const [newHearing, setNewHearing] = useState({
    hearing_date: "",
    next_hearing_date: "",
    remarks: "",
    documents: []
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen && legal?.chequeId) {
      fetchHearings();
    }
  }, [isOpen, legal]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === null) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
          return dateString;
        }
        return dateString;
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString.split('T')[0] || 'N/A';
    }
  };

  const fetchHearings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await legalService.getHearings(legal.chequeId);
      if (response.success) {
        setHearings(response.data || []);
      } else {
        throw new Error(response.message || "Failed to fetch hearings");
      }
    } catch (err) {
      setError(err.message || "Failed to load hearing records");
      setHearings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHearing = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('hearing_date', newHearing.hearing_date);
      formData.append('next_hearing_date', newHearing.next_hearing_date || '');
      formData.append('remarks', newHearing.remarks || '');
      
      uploadedFiles.forEach(file => {
        formData.append('documents[]', file);
      });

      const response = await legalService.addHearing(legal.chequeId, formData);
      if (response.success) {
        await fetchHearings();
        resetForm();
        setIsAddingHearing(false);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.message || "Failed to add hearing");
      }
    } catch (err) {
      setError(err.message || "Failed to add hearing record");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHearing = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('hearing_date', newHearing.hearing_date);
      formData.append('next_hearing_date', newHearing.next_hearing_date || '');
      formData.append('remarks', newHearing.remarks || '');
      
      uploadedFiles.forEach(file => {
        formData.append('documents[]', file);
      });

      existingDocuments.forEach(doc => {
        formData.append('existing_documents[]', doc);
      });

      const response = await legalService.updateHearing(editingHearing.hearing_id, formData);
      if (response.success) {
        await fetchHearings();
        resetForm();
        setEditingHearing(null);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.message || "Failed to update hearing");
      }
    } catch (err) {
      setError(err.message || "Failed to update hearing record");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewHearing({
      hearing_date: "",
      next_hearing_date: "",
      remarks: "",
      documents: []
    });
    setUploadedFiles([]);
    setExistingDocuments([]);
  };

  const handleEditHearing = (hearing) => {
    setEditingHearing(hearing);
    setNewHearing({
      hearing_date: hearing.hearing_date?.split('T')[0] || "",
      next_hearing_date: hearing.next_hearing_date?.split('T')[0] || "",
      remarks: hearing.remarks || "",
      documents: hearing.documents || []
    });
    setExistingDocuments(hearing.documents || []);
    setUploadedFiles([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingDocument = (index) => {
    setExistingDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const getHearingStatus = (hearing) => {
    const today = new Date().toISOString().split('T')[0];
    const nextDate = hearing.next_hearing_date?.split('T')[0];
    
    if (!nextDate) return 'pending';
    if (nextDate < today) return 'overdue';
    if (nextDate === today) return 'today';
    return 'upcoming';
  };

  const getStatusColor = (status, isDarkMode) => {
    const baseColors = isDarkMode 
      ? {
          today: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
          overdue: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
          upcoming: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
          pending: "bg-gray-500/20 text-gray-300 border border-gray-500/30"
        }
      : {
          today: "bg-amber-100 text-amber-800 border border-amber-300",
          overdue: "bg-rose-100 text-rose-800 border border-rose-300",
          upcoming: "bg-emerald-100 text-emerald-800 border border-emerald-300",
          pending: "bg-gray-100 text-gray-800 border border-gray-300"
        };
    
    return baseColors[status] || baseColors.pending;
  };

  if (!isOpen) return null;

  // Enhanced dark mode colors
  const cellBase = "px-2 py-3 text-center border-r";
  const cellBorder = isDark ? "border-gray-700/70" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  const headerStyle = `px-2 py-3 text-center text-sm font-bold border-r ${
    isDark 
      ? "text-gray-50 bg-gray-800/90 border-gray-700/70" 
      : "text-gray-700 bg-gray-50 border-gray-300/90"
  }`;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"  />
      
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div 
            ref={modalRef}
            className={`relative transform overflow-hidden rounded-xl shadow-2xl transition-all w-full max-w-6xl ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            {/* Header */}
            <div className={`px-5 py-4 border-b flex items-center justify-between ${
              isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-600"
                }`}>
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    Case Hearings Management
                  </h3>
                  <p className={`text-xs mt-0.5 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Customer: <span className="font-medium">{legal?.customerName || 'N/A'}</span> • 
                    Loan ID: <span className="font-medium">{legal?.loanId || 'N/A'}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsAddingHearing(true);
                    setEditingHearing(null);
                    resetForm();
                  }}
                  className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-all ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/20"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/30"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Hearing</span>
                </button>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-gray-800 text-gray-300"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-5 py-4 max-h-[105vh] overflow-y-auto">
              {/* Add/Edit Form */}
              {(isAddingHearing || editingHearing) && (
                <div className={`mb-5 p-4 rounded-lg border ${
                  isDark
                    ? "bg-gray-800/60 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className={`text-sm font-semibold ${
                      isDark ? "text-emerald-400" : "text-teal-600"
                    }`}>
                      {editingHearing ? "Edit Hearing Record" : "Add New Hearing Record"}
                    </h5>
                    <button
                      onClick={() => {
                        setIsAddingHearing(false);
                        setEditingHearing(null);
                        resetForm();
                      }}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        isDark
                          ? "bg-red-600/20 hover:bg-red-500/30 text-red-400 border border-red-600/30"
                          : "bg-red-100 hover:bg-red-200 text-red-700 border border-red-200"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                  
                  {/* First Row: Hearing Date & Next Hearing Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={`block text-xs font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Hearing Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newHearing.hearing_date}
                        onChange={(e) => setNewHearing({
                          ...newHearing,
                          hearing_date: e.target.value
                        })}
                        required
                        className={`w-full px-3 py-2 text-xs rounded border ${
                          isDark
                            ? "bg-gray-800/80 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Next Hearing Date
                      </label>
                      <input
                        type="date"
                        value={newHearing.next_hearing_date}
                        onChange={(e) => setNewHearing({
                          ...newHearing,
                          next_hearing_date: e.target.value
                        })}
                        className={`w-full px-3 py-2 text-xs rounded border ${
                          isDark
                            ? "bg-gray-800/80 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Second Row: Remarks & Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={`block text-xs font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Remarks
                      </label>
                      <textarea
                        value={newHearing.remarks}
                        onChange={(e) => setNewHearing({
                          ...newHearing,
                          remarks: e.target.value
                        })}
                        rows="2"
                        className={`w-full px-3 py-2 text-xs rounded border ${
                          isDark
                            ? "bg-gray-800/80 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                        }`}
                        placeholder="Enter hearing remarks..."
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Documents
                      </label>
                      <div className={`border rounded p-3 ${
                        isDark
                          ? "border-gray-700 bg-gray-800/60"
                          : "border-gray-300 bg-gray-50"
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs flex items-center gap-1 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}>
                            <Upload className="w-3.5 h-3.5" />
                            Drop files here or click to upload
                          </span>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className={`text-xs max-w-[120px] ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          />
                        </div>
                        
                        {(uploadedFiles.length > 0 || existingDocuments.length > 0) && (
                          <div className="mt-3 space-y-1">
                            {existingDocuments.map((doc, index) => (
                              <div
                                key={`existing-${index}`}
                                className={`flex items-center justify-between p-1.5 rounded ${
                                  isDark
                                    ? "bg-gray-700/60"
                                    : "bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <FileText className={`w-3.5 h-3.5 ${
                                    isDark ? "text-blue-400" : "text-blue-600"
                                  }`} />
                                  <span className={`text-xs truncate ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}>
                                    Document {index + 1}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <a
                                    href={doc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-1 rounded ${
                                      isDark
                                        ? "hover:bg-gray-600 text-blue-400"
                                        : "hover:bg-gray-200 text-blue-600"
                                    }`}
                                    title="View Document"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => removeExistingDocument(index)}
                                    className={`p-1 rounded ${
                                      isDark
                                        ? "hover:bg-gray-600 text-gray-400"
                                        : "hover:bg-gray-200 text-gray-600"
                                    }`}
                                    title="Remove Document"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={`new-${index}`}
                                className={`flex items-center justify-between p-1.5 rounded ${
                                  isDark
                                    ? "bg-gray-700/60 border-l-2 border-emerald-500"
                                    : "bg-gray-100 border-l-2 border-emerald-400"
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <FileText className={`w-3.5 h-3.5 ${
                                    isDark ? "text-emerald-400" : "text-emerald-600"
                                  }`} />
                                  <span className={`text-xs truncate max-w-[150px] ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}>
                                    {file.name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeUploadedFile(index)}
                                  className={`p-1 rounded ${
                                    isDark
                                      ? "hover:bg-gray-600 text-gray-400"
                                      : "hover:bg-gray-200 text-gray-600"
                                    }`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={editingHearing ? handleUpdateHearing : handleAddHearing}
                      disabled={isLoading || !newHearing.hearing_date}
                      className={`px-5 py-2 text-sm font-medium rounded-lg flex items-center space-x-2 transition-all ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : editingHearing ? (
                        <>
                          <Edit className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Hearing</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Hearing Records Table */}
              <div className={`rounded-lg border overflow-hidden ${
                isDark
                  ? "bg-gray-800/60 border-gray-700"
                  : "bg-white border-gray-200"
              }`}>
                <div className={`px-3 py-2 border-b ${
                  isDark ? "border-gray-700 bg-gray-800/80" : "border-gray-200 bg-gray-50"
                }`}>
                  <h4 className={`text-sm font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-800"
                  }`}>
                    Hearing Records ({hearings.length})
                  </h4>
                </div>

                {isLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className={`mt-2 text-xs ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Loading hearing records...
                    </p>
                  </div>
                ) : hearings.length === 0 ? (
                  <div className={`py-8 text-center ${
                    isDark ? "bg-gray-800/40" : "bg-gray-50"
                  }`}>
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      isDark ? "bg-gray-700/60 text-gray-400" : "bg-gray-100 text-gray-400"
                    }`}>
                      <Scale className="w-6 h-6" />
                    </div>
                    <p className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      No hearing records found
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className={headerStyle}>SN</th>
                          <th className={headerStyle}>Hearing Date</th>
                          <th className={headerStyle}>Next Hearing Date</th>
                          <th className={headerStyle}>Remarks</th>
                          <th className={headerStyle}>Status</th>
                          <th className={headerStyle}>Documents</th>
                          <th className={headerStyle}>Added By</th>
                          <th className={headerStyle}>Created Date</th>
                          <th className={`px-2 py-3 text-center text-sm font-bold ${
                            isDark 
                              ? "text-gray-50 bg-gray-800/90" 
                              : "text-gray-700 bg-gray-50"
                          }`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hearings.map((hearing, index) => {
                          const status = getHearingStatus(hearing);
                          return (
                            <tr
                              key={hearing.hearing_id}
                              className={`border-t ${
                                isDark
                                  ? "border-gray-700 hover:bg-gray-800/60"
                                  : "border-gray-200 hover:bg-gray-50/80"
                              } transition-colors`}
                            >
                              <td className={`${cellStyle} ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}>
                                {index + 1}
                              </td>
                              <td className={cellStyle}>
                                <div className="flex items-center justify-center space-x-2">
                                  <Calendar className={`w-3.5 h-3.5 ${
                                    isDark ? "text-blue-400" : "text-blue-600"
                                  }`} />
                                  <span className={`text-xs font-medium ${
                                    isDark ? "text-gray-200" : "text-gray-800"
                                  }`}>
                                    {formatDate(hearing.hearing_date)}
                                  </span>
                                </div>
                              </td>
                              <td className={cellStyle}>
                                {hearing.next_hearing_date ? (
                                  <div className="flex items-center justify-center space-x-2">
                                    <Calendar className={`w-3.5 h-3.5 ${
                                      isDark ? "text-blue-400" : "text-blue-600"
                                    }`} />
                                    <span className={`text-xs font-medium ${
                                      isDark ? "text-gray-200" : "text-gray-800"
                                    }`}>
                                      {formatDate(hearing.next_hearing_date)}
                                    </span>
                                  </div>
                                ) : (
                                  <span className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}>
                                    -
                                  </span>
                                )}
                              </td>
                              <td className={cellStyle}>
                                <span className={`text-xs line-clamp-2 max-w-[200px] ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}>
                                  {hearing.remarks || '-'}
                                </span>
                              </td>
                              <td className={cellStyle}>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(status, isDark)}`}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                              </td>
                              <td className={cellStyle}>
                                {hearing.documents && hearing.documents.length > 0 ? (
                                  <div className="flex justify-center items-center space-x-1">
                                    {hearing.documents.map((_, index) => (
                                      <div
                                        key={index}
                                        className={`p-1.5 rounded ${
                                          isDark ? "bg-blue-600/20" : "bg-blue-100"
                                        }`}
                                        title={`Document ${index + 1}`}
                                      >
                                        <FileText className={`w-3.5 h-3.5 ${
                                          isDark ? "text-blue-400" : "text-blue-600"
                                        }`} />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}>
                                    -
                                  </span>
                                )}
                              </td>
                              <td className={cellStyle}>
                                <span className={`text-xs ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}>
                                  {hearing.admin_name || 'Admin'}
                                </span>
                              </td>
                              <td className={cellStyle}>
                                <span className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}>
                                  {formatDate(hearing.created_at)}
                                </span>
                              </td>
                              <td className={`px-2 py-3 text-center border-l ${cellBorder}`}>
                                <button
                                  onClick={() => handleEditHearing(hearing)}
                                  className={`p-1.5 rounded transition-colors ${
                                    isDark
                                      ? "hover:bg-blue-600/30 text-blue-400 hover:text-blue-300"
                                      : "hover:bg-blue-100 text-blue-600 hover:text-blue-700"
                                  }`}
                                  title="Edit Hearing"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {error && (
                <div className={`mt-3 p-2 rounded border text-xs ${
                  isDark
                    ? "bg-red-600/20 border-red-500/30 text-red-300"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`px-5 py-3 border-t ${
              isDark ? "border-gray-700 bg-gray-900/95" : "border-gray-200 bg-white/95"
            }`}>
              <div className="flex items-center justify-between">
                <div className={`text-xs ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Total: <span className="font-medium">{hearings.length}</span> records
                </div>
                <button
                  onClick={onClose}
                  className={`px-4 py-2 text-sm rounded transition-all ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CriminalStatusModal;