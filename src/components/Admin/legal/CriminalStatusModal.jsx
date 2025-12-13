"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, FileText, Plus, Edit, Download, Scale, Upload, Trash2, User, Phone } from "lucide-react";
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
        // Try to parse as dd-mm-yyyy if it's already in that format
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
          today: "bg-amber-900/40 text-amber-200 border-amber-700/60",
          overdue: "bg-rose-900/40 text-rose-200 border-rose-700/60",
          upcoming: "bg-emerald-900/40 text-emerald-200 border-emerald-700/60",
          pending: "bg-slate-800/50 text-slate-200 border-slate-700"
        }
      : {
          today: "bg-amber-100 text-amber-800 border-amber-300",
          overdue: "bg-rose-100 text-rose-800 border-rose-300",
          upcoming: "bg-emerald-100 text-emerald-800 border-emerald-300",
          pending: "bg-slate-100 text-slate-800 border-slate-300"
        };
    
    return baseColors[status] || baseColors.pending;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />
      
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div 
            ref={modalRef}
            className={`relative transform overflow-hidden rounded-xl text-left shadow-xl transition-all w-full max-w-4xl ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className={`px-5 py-3.5 border-b flex items-center justify-between ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}>
              <div className="flex items-center space-x-2">
                <Scale className={`w-5 h-5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`} />
                <div>
                  <h3 className={`text-md font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    Case Hearings Management
                  </h3>
                  <p className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {legal?.customerName || 'Customer'} • Loan: {legal?.loanId || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
              <div className={`mb-4 p-3.5 rounded-lg border ${
                isDark
                  ? "bg-gray-800/40 border-gray-700"
                  : "bg-blue-50/50 border-blue-100"
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded ${
                      isDark ? "bg-gray-700" : "bg-blue-100"
                    }`}>
                      <User className={`w-3 h-3 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`} />
                    </div>
                    <div>
                      <span className={isDark ? "text-gray-400" : "text-gray-600"}>Customer</span>
                      <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                        {legal?.customerName || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded ${
                      isDark ? "bg-gray-700" : "bg-blue-100"
                    }`}>
                      <Phone className={`w-3 h-3 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`} />
                    </div>
                    <div>
                      <span className={isDark ? "text-gray-400" : "text-gray-600"}>Mobile</span>
                      <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                        {legal?.mobileNo || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Hearing Records ({hearings.length})
                </h4>
                <button
                  onClick={() => {
                    setIsAddingHearing(true);
                    setEditingHearing(null);
                    resetForm();
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg flex items-center space-x-1.5 transition-all ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Hearing</span>
                </button>
              </div>

              {(isAddingHearing || editingHearing) && (
                <div className={`mb-4 p-3.5 rounded-lg border ${
                  isDark
                    ? "bg-gray-800/40 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <h5 className={`text-sm font-medium mb-2 ${
                    isDark ? "text-emerald-300" : "text-teal-600"
                  }`}>
                    {editingHearing ? "Edit Hearing" : "Add New Hearing"}
                  </h5>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Hearing Date *
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
                              ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-600"
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
                              ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
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
                            ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                        }`}
                        placeholder="Enter hearing remarks..."
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Documents (Multiple files allowed)
                      </label>
                      <div className={`p-2.5 rounded border ${
                        isDark
                          ? "border-gray-700 bg-gray-800/50"
                          : "border-gray-300 bg-gray-50"
                      }`}>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="w-full text-xs"
                        />
                        
                        {uploadedFiles.length > 0 && (
                          <div className="mt-2">
                            <p className={`text-xs mb-1 ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}>
                              New files:
                            </p>
                            <div className="space-y-1">
                              {uploadedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-1.5 rounded text-xs ${
                                    isDark
                                      ? "bg-gray-700/50"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  <span className={`truncate max-w-[200px] ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}>
                                    {file.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeUploadedFile(index)}
                                    className={`p-0.5 rounded ${
                                      isDark
                                        ? "hover:bg-gray-600 text-gray-400"
                                        : "hover:bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {editingHearing && existingDocuments.length > 0 && (
                          <div className="mt-2">
                            <p className={`text-xs mb-1 ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}>
                              Existing documents:
                            </p>
                            <div className="space-y-1">
                              {existingDocuments.map((doc, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-1.5 rounded text-xs ${
                                    isDark
                                      ? "bg-gray-700/50"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  <a
                                    href={doc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center space-x-1 truncate max-w-[180px] ${
                                      isDark ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"
                                    }`}
                                  >
                                    <FileText className="w-3 h-3 flex-shrink-0" />
                                    <span>Document {index + 1}</span>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => removeExistingDocument(index)}
                                    className={`p-0.5 rounded ${
                                      isDark
                                        ? "hover:bg-gray-600 text-gray-400"
                                        : "hover:bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => {
                        setIsAddingHearing(false);
                        setEditingHearing(null);
                        resetForm();
                      }}
                      className={`px-3 py-1.5 text-xs rounded transition-all ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingHearing ? handleUpdateHearing : handleAddHearing}
                      disabled={isLoading || !newHearing.hearing_date}
                      className={`px-3 py-1.5 text-xs rounded text-white transition-all ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isLoading ? "Processing..." : editingHearing ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className={`mt-2 text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Loading hearings...
                  </p>
                </div>
              ) : hearings.length === 0 ? (
                <div className={`text-center py-6 rounded border ${
                  isDark
                    ? "bg-gray-800/30 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <Scale className={`w-8 h-8 mx-auto mb-2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`} />
                  <p className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    No hearing records found
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {hearings.map((hearing) => {
                    const status = getHearingStatus(hearing);
                    return (
                      <div
                        key={hearing.hearing_id}
                        className={`p-3.5 rounded border ${
                          isDark
                            ? "bg-gray-800/30 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(status, isDark)}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            <span className={`text-xs font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}>
                              Hearing #{hearing.hearing_id}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEditHearing(hearing)}
                            className={`p-1 rounded ${
                              isDark
                                ? "hover:bg-gray-700 text-gray-400"
                                : "hover:bg-gray-200 text-gray-600"
                            }`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-xs">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                            <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                              Hearing:
                            </span>
                            <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                              {formatDate(hearing.hearing_date)}
                            </span>
                          </div>
                          
                          {hearing.next_hearing_date && (
                            <div className="flex items-center space-x-1.5">
                              <Calendar className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                Next Hearing:
                              </span>
                              <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                                {formatDate(hearing.next_hearing_date)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {hearing.remarks && (
                          <div className={`mt-2 p-1.5 rounded text-xs ${
                            isDark ? "bg-gray-700/50" : "bg-gray-100"
                          }`}>
                            <p className={`font-medium mb-0.5 ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}>
                              Remarks:
                            </p>
                            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                              {hearing.remarks}
                            </p>
                          </div>
                        )}
                        
                        {hearing.documents && hearing.documents.length > 0 && (
                          <div className="mt-2">
                            <p className={`text-xs font-medium mb-1 ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}>
                              Documents:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {hearing.documents.map((doc, index) => (
                                <a
                                  key={index}
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`px-2 py-1 text-xs rounded flex items-center space-x-1 transition-all ${
                                    isDark
                                      ? "bg-gray-700 hover:bg-gray-600 text-blue-300 hover:text-blue-200 border border-gray-600"
                                      : "bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 border border-gray-300"
                                  }`}
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>Document {index + 1}</span>
                                  <Download className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className={`mt-2 pt-2 border-t text-xs ${
                          isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-600"
                        }`}>
                          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                            Added by: <span className={isDark ? "text-gray-300" : "text-gray-700"}>{hearing.admin_name || 'Admin'}</span>
                          </span>
                          <span className={`mx-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}>•</span>
                          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                            Created Date: <span className={isDark ? "text-gray-300" : "text-gray-700"}>{formatDate(hearing.created_at)}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={`px-5 py-3.5 border-t ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}>
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className={`px-4 py-1.5 text-sm rounded transition-all ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300"
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