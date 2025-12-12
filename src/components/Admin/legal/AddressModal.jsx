"use client";
import React, { useState, useEffect } from "react";
import { X, MapPin, Plus, Edit, Calendar, Truck, Package, Clock, AlertCircle, CheckCircle, User } from "lucide-react";
import { legalService } from "@/lib/services/LegalService";

const AddressModal = ({ isOpen, onClose, legal, isDark, onSuccess }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // New address form state
  const [newAddress, setNewAddress] = useState({
    advocate_id: "",
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

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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
      advocate_id: "",
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
      advocate_id: address.advocate_id || "",
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "posted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "returned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "unknown":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "posted":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "returned":
        return <Package className="w-4 h-4 text-yellow-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Fixed to prevent interaction with background */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-md bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container - Fixed positioning with proper z-index */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          {/* Modal - More compact */}
          <div 
            className={`relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all w-full max-w-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Header - More compact */}
            <div className={`px-5 py-3 border-b flex items-center justify-between ${
              isDark ? "border-gray-700" : "border-gray-200"
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
                    {legal?.customerName || 'Customer'} • Loan ID: {legal?.loanId || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body - More compact */}
            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
              {/* Customer Info Card - Compact */}
              <div className={`mb-4 p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700/30 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded ${
                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                  }`}>
                    <User className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className={isDark ? "text-gray-400" : "text-gray-600"}>Mobile:</span>
                        <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                          {legal?.mobileNo || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className={isDark ? "text-gray-400" : "text-gray-600"}>CRN:</span>
                        <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                          {legal?.crnNo || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Original Addresses - More compact */}
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Original Addresses
              </h4>
              <div className="space-y-2">
                {legal?.addresses && legal.addresses.map((addr, index) => (
                  <div
                    key={index}
                    className={`p-2.5 rounded border text-xs ${
                      isDark
                        ? "bg-gray-700/20 border-gray-600 text-gray-300"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          isDark
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {addr.type}
                        </span>
                        <p className="mt-1 line-clamp-2">
                          {addr.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Addresses Header with Add Button */}
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Legal Addresses
              </h4>
              <button
                onClick={() => {
                  setIsAddingAddress(true);
                  setEditingAddress(null);
                  resetForm();
                }}
                className={`px-3 py-1.5 text-xs rounded-lg flex items-center space-x-1.5 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Add/Edit Form - More compact */}
            {(isAddingAddress || editingAddress) && (
              <div className={`mb-4 p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700/30 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <h5 className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h5>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Advocate ID
                      </label>
                      <input
                        type="number"
                        value={newAddress.advocate_id}
                        onChange={(e) => setNewAddress({
                          ...newAddress,
                          advocate_id: e.target.value
                        })}
                        className={`w-full px-2.5 py-1.5 text-xs rounded border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                        placeholder="Advocate ID"
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Type
                      </label>
                      <select
                        value={newAddress.types}
                        onChange={(e) => setNewAddress({
                          ...newAddress,
                          types: e.target.value
                        })}
                        className={`w-full px-2.5 py-1.5 text-xs rounded border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                      >
                        <option value="138 Notice">Legal Notice (138)</option>
                        <option value="Arbitration">Arbitration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Address
                    </label>
                    <textarea
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({
                        ...newAddress,
                        address: e.target.value
                      })}
                      rows="2"
                      className={`w-full px-2.5 py-1.5 text-xs rounded border ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      }`}
                      placeholder="Enter full address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Posted Date
                      </label>
                      <input
                        type="date"
                        value={newAddress.posted_date}
                        onChange={(e) => setNewAddress({
                          ...newAddress,
                          posted_date: e.target.value
                        })}
                        className={`w-full px-2.5 py-1.5 text-xs rounded border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Status
                      </label>
                      <select
                        value={newAddress.status}
                        onChange={(e) => setNewAddress({
                          ...newAddress,
                          status: e.target.value
                        })}
                        className={`w-full px-2.5 py-1.5 text-xs rounded border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
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

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Tracking No.
                      </label>
                      <input
                        type="text"
                        value={newAddress.tracking_no}
                        onChange={(e) => setNewAddress({
                          ...newAddress,
                          tracking_no: e.target.value
                        })}
                        className={`w-full px-2.5 py-1.5 text-xs rounded border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                        placeholder="Tracking number"
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Remarks
                      </label>
                      <input
                        type="text"
                        value={newAddress.remarks}
                        onChange={(e) => setNewAddress({
                          ...newAddress,
                          remarks: e.target.value
                        })}
                        className={`w-full px-2.5 py-1.5 text-xs rounded border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
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
                    className={`px-3 py-1.5 text-xs rounded ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                    disabled={isLoading}
                    className={`px-3 py-1.5 text-xs rounded text-white ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? "Processing..." : editingAddress ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            )}

            {/* Addresses List - More compact */}
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
                  ? "bg-gray-700/20 border-gray-600"
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
              <div className="space-y-2">
                {addresses.map((address) => (
                  <div
                    key={address.address_id}
                    className={`p-3 rounded border ${
                      isDark
                        ? "bg-gray-700/20 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-1.5">
                        {getStatusIcon(address.status)}
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${getStatusColor(address.status)}`}>
                          {address.status}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          isDark
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {address.types}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEditAddress(address)}
                        className={`p-1 rounded ${
                          isDark
                            ? "hover:bg-gray-600 text-gray-400"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <p className={`text-xs mb-2 line-clamp-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {address.address}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 opacity-70" />
                        <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                          Posted: {address.posted_date?.split('T')[0] || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Truck className="w-3 h-3 opacity-70" />
                        <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                          Track: {address.tracking_no || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {address.remarks && (
                      <div className={`mt-2 p-1.5 rounded text-xs ${
                        isDark ? "bg-gray-600/30" : "bg-gray-100"
                      }`}>
                        <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                          <span className="font-medium">Remarks:</span> {address.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - More compact */}
          <div className={`px-5 py-3 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className={`px-4 py-1.5 text-sm rounded ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
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