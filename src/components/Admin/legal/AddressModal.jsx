"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, MapPin, Plus, Edit, Calendar, Truck, Package, Clock, AlertCircle, CheckCircle, User, Phone, FileText } from "lucide-react";
import { legalService } from "@/lib/services/LegalService";

const AddressModal = ({ isOpen, onClose, legal, isDark, onSuccess }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const modalRef = useRef(null);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    types: "Legal Notice",
    address: "",
    posted_date: "",
    delivered_date: "",
    return_date: "",
    tracking_no: "",
    remarks: "",
    status: "Pending"
  });

  useEffect(() => {
    if (isOpen && legal?.chequeId) {
      fetchAddresses();
    }
  }, [isOpen, legal]);

  // Outside click, escape key, and scroll lock functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !isLoading) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && !isLoading) {
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
  }, [isOpen, isLoading]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await legalService.getAddresses(legal.chequeId);
      if (response.success) {
        setAddresses(response.data || []);
      } else {
        throw new Error(response.message || "Failed to fetch addresses");
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError(err.message || "Failed to load addresses");
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      setIsLoading(true);
      const response = await legalService.addAddress(legal.chequeId, newAddress);
      if (response.success) {
        await fetchAddresses();
        resetForm();
        setIsAddingAddress(false);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.message || "Failed to add address");
      }
    } catch (err) {
      console.error("Error adding address:", err);
      setError(err.message || "Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    try {
      setIsLoading(true);
      const response = await legalService.updateAddress(editingAddress.address_id, newAddress);
      if (response.success) {
        await fetchAddresses();
        resetForm();
        setEditingAddress(null);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.message || "Failed to update address");
      }
    } catch (err) {
      console.error("Error updating address:", err);
      setError(err.message || "Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewAddress({
      types: "Legal Notice",
      address: "",
      posted_date: "",
      delivered_date: "",
      return_date: "",
      tracking_no: "",
      remarks: "",
      status: "Pending"
    });
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({
      types: address.types || "Legal Notice",
      address: address.address || "",
      posted_date: address.posted_date?.split('T')[0] || "",
      delivered_date: address.delivered_date?.split('T')[0] || "",
      return_date: address.return_date?.split('T')[0] || "",
      tracking_no: address.tracking_no || "",
      remarks: address.remarks || "",
      status: address.status || "Pending"
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const getStatusColor = (status, isDarkMode) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return isDarkMode
          ? "bg-emerald-900/40 text-emerald-200 border-emerald-700/60"
          : "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "posted":
        return isDarkMode
          ? "bg-blue-900/40 text-blue-200 border-blue-700/60"
          : "bg-blue-100 text-blue-800 border-blue-300";
      case "returned":
        return isDarkMode
          ? "bg-amber-900/40 text-amber-200 border-amber-700/60"
          : "bg-amber-100 text-amber-800 border-amber-300";
      case "pending":
        return isDarkMode
          ? "bg-slate-800/50 text-slate-200 border-slate-700"
          : "bg-slate-100 text-slate-800 border-slate-300";
      case "unknown":
        return isDarkMode
          ? "bg-purple-900/40 text-purple-200 border-purple-700/60"
          : "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return isDarkMode
          ? "bg-slate-800/50 text-slate-200 border-slate-700"
          : "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "posted":
        return <Truck className="w-3.5 h-3.5" />;
      case "returned":
        return <Package className="w-3.5 h-3.5" />;
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
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
            {/* Header */}
            <div className={`px-5 py-3.5 border-b flex items-center justify-between ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}>
              <div className="flex items-center space-x-2">
                <MapPin className={`w-5 h-5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`} />
                <div>
                  <h3 className={`text-md font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    Address Management
                  </h3>
                  <p className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {legal?.customerName || 'Customer'} • Loan: {legal?.loanId || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
              {/* Customer Info Card - Matching CriminalStatusModal design */}
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

              {/* Original Addresses - Enhanced design */}
              {legal?.addresses && legal.addresses.length > 0 && (
                <div className="mb-4">
                  <h4 className={`text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Original Addresses
                  </h4>
                  <div className="space-y-2">
                    {legal.addresses.map((addr, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded border ${
                          isDark
                            ? "bg-gray-800/30 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            isDark
                              ? "bg-blue-900/50 text-blue-300 border border-blue-800/50"
                              : "bg-blue-100 text-blue-700 border border-blue-300"
                          }`}>
                            {addr.type}
                          </span>
                        </div>
                        <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {addr.address}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Addresses Header with Add Button */}
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Legal Addresses ({addresses.length})
                </h4>
                <button
                  onClick={() => {
                    setIsAddingAddress(true);
                    setEditingAddress(null);
                    resetForm();
                  }}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-xs rounded-lg flex items-center space-x-1.5 transition-all ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {/* Add/Edit Form - Enhanced design */}
              {(isAddingAddress || editingAddress) && (
                <div className={`mb-4 p-3.5 rounded-lg border ${
                  isDark
                    ? "bg-gray-800/40 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <h5 className={`text-sm font-medium mb-2 ${
                    isDark ? "text-emerald-300" : "text-teal-600"
                  }`}>
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </h5>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      

                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Type
                        </label>
                        <select
                          value={newAddress.types}
                          onChange={(e) => !isLoading && setNewAddress({
                            ...newAddress,
                            types: e.target.value
                          })}
                          disabled={isLoading}
                          className={`w-full px-3 py-2 text-xs rounded border ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          } ${
                            isDark
                              ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          }`}
                        >
                          <option value="138 Notice">Legal Notice (138)</option>
                          <option value="Arbitration">Arbitration</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Address
                      </label>
                      <textarea
                        value={newAddress.address}
                        onChange={(e) => !isLoading && setNewAddress({
                          ...newAddress,
                          address: e.target.value
                        })}
                        disabled={isLoading}
                        rows="2"
                        className={`w-full px-3 py-2 text-xs rounded border ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        } ${
                          isDark
                            ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                        }`}
                        placeholder="Enter full address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Posted Date
                        </label>
                        <input
                          type="date"
                          value={newAddress.posted_date}
                          onChange={(e) => !isLoading && setNewAddress({
                            ...newAddress,
                            posted_date: e.target.value
                          })}
                          disabled={isLoading}
                          className={`w-full px-3 py-2 text-xs rounded border ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          } ${
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
                          Status
                        </label>
                        <select
                          value={newAddress.status}
                          onChange={(e) => !isLoading && setNewAddress({
                            ...newAddress,
                            status: e.target.value
                          })}
                          disabled={isLoading}
                          className={`w-full px-3 py-2 text-xs rounded border ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          } ${
                            isDark
                              ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Posted">Posted</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Returned">Returned</option>
                          <option value="Unknown">Unknown</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Tracking No.
                        </label>
                        <input
                          type="text"
                          value={newAddress.tracking_no}
                          onChange={(e) => !isLoading && setNewAddress({
                            ...newAddress,
                            tracking_no: e.target.value
                          })}
                          disabled={isLoading}
                          className={`w-full px-3 py-2 text-xs rounded border ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          } ${
                            isDark
                              ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          }`}
                          placeholder="Tracking number"
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Remarks
                        </label>
                        <input
                          type="text"
                          value={newAddress.remarks}
                          onChange={(e) => !isLoading && setNewAddress({
                            ...newAddress,
                            remarks: e.target.value
                          })}
                          disabled={isLoading}
                          className={`w-full px-3 py-2 text-xs rounded border ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          } ${
                            isDark
                              ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          }`}
                          placeholder="Optional remarks"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => {
                        setIsAddingAddress(false);
                        setEditingAddress(null);
                        resetForm();
                      }}
                      disabled={isLoading}
                      className={`px-3 py-1.5 text-xs rounded transition-all ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                      disabled={isLoading || !newAddress.address.trim()}
                      className={`px-3 py-1.5 text-xs rounded text-white transition-all ${
                        isLoading || !newAddress.address.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      } ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {isLoading ? "Processing..." : editingAddress ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              )}

              {/* Addresses List - Enhanced design */}
              {isLoading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className={`mt-2 text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Loading addresses...
                  </p>
                </div>
              ) : addresses.length === 0 ? (
                <div className={`text-center py-6 rounded border ${
                  isDark
                    ? "bg-gray-800/30 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <MapPin className={`w-8 h-8 mx-auto mb-2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`} />
                  <p className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    No legal addresses added yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.address_id}
                      className={`p-3.5 rounded border ${
                        isDark
                          ? "bg-gray-800/30 border-gray-700"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-1.5">
                          <div className={`p-1 rounded ${
                            isDark ? "bg-gray-700/50" : "bg-gray-100"
                          }`}>
                            {getStatusIcon(address.status)}
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded border ${
                            getStatusColor(address.status, isDark)
                          }`}>
                            {address.status}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            isDark
                              ? "bg-blue-900/50 text-blue-300 border border-blue-800/50"
                              : "bg-blue-100 text-blue-700 border border-blue-300"
                          }`}>
                            {address.types}
                          </span>
                        </div>
                        <button
                          onClick={() => !isLoading && handleEditAddress(address)}
                          disabled={isLoading}
                          className={`p-1 rounded ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          } ${
                            isDark
                              ? "hover:bg-gray-700 text-gray-400"
                              : "hover:bg-gray-200 text-gray-600"
                          }`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <p className={`text-xs mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}>
                        {address.address}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-xs">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                            Posted:
                          </span>
                          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            {address.posted_date?.split('T')[0] || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1.5">
                          <Truck className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                            Tracking:
                          </span>
                          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            {address.tracking_no || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      {address.remarks && (
                        <div className={`mt-2 p-1.5 rounded text-xs ${
                          isDark ? "bg-gray-700/50" : "bg-gray-100"
                        }`}>
                          <p className={`font-medium mb-0.5 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}>
                            Remarks:
                          </p>
                          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                            {address.remarks}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`px-5 py-3.5 border-t ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}>
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className={`px-4 py-1.5 text-sm rounded transition-all ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
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

export default AddressModal;