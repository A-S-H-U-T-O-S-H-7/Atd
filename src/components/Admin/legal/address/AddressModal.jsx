"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, MapPin, Plus, User, Phone, Truck } from "lucide-react";
import { legalService } from "@/lib/services/LegalService";
import AddressForm from "./AddressForm";
import AddressCard from "./AddressCard";

const AddressModal = ({ isOpen, onClose, legal, isDark, onSuccess }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const modalRef = useRef(null);

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

              {(isAddingAddress || editingAddress) && (
                <AddressForm
                  newAddress={newAddress}
                  setNewAddress={setNewAddress}
                  isLoading={isLoading}
                  isDark={isDark}
                  editingAddress={editingAddress}
                  handleUpdateAddress={handleUpdateAddress}
                  handleAddAddress={handleAddAddress}
                  setIsAddingAddress={setIsAddingAddress}
                  setEditingAddress={setEditingAddress}
                  resetForm={resetForm}
                />
              )}

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
                    <AddressCard
                      key={address.address_id}
                      address={address}
                      isDark={isDark}
                      isLoading={isLoading}
                      handleEditAddress={handleEditAddress}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </div>
              )}
            </div>

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