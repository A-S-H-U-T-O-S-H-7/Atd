"use client";
import React, { useState, useEffect } from "react";
import { X, Calendar, Banknote, AlertCircle, ArrowRight } from "lucide-react";
import { collectionService } from "@/lib/services/colletionForms/CollectionService";
import { manageApplicationService } from "@/lib/services/ManageApplicationServices";
import toast from "react-hot-toast";

const NormalCollectionForm = ({ 
  isOpen,
  onClose,
  application,
  onCollectionSubmit,
  isDark
}) => {
  const [formData, setFormData] = useState({
    collectionDate: "",
    normalInterest: "",
    penalInterest: "",
    penaltyInput: "",
    bounceCharge: "0",
    collectionBy: "",
    bankName: "",
    transactionId: "",
    collectionAmount: "",
    totalDueAmount: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [collectionData, setCollectionData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [banks, setBanks] = useState([]);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [selectedBankId, setSelectedBankId] = useState("");

  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    if (isOpen && application) {
      setFormData({
        collectionDate: "",
        normalInterest: "",
        penalInterest: "",
        penaltyInput: "",
        bounceCharge: "0",
        collectionBy: "",
        bankName: "",
        transactionId: "",
        collectionAmount: "",
        totalDueAmount: ""
      });
      setSelectedBankId("");
      setCollectionData(null);
    }
  }, [isOpen, application]);

  const fetchBanks = async () => {
    try {
      const response = await collectionService.getBankList();
      if (response.success) {
        setBanks(response.bank || []);
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const fetchBankDetails = async (bankId) => {
    try {
      const response = await collectionService.getBankDetails(bankId);
      if (response.success) {
        setSelectedBankDetails(response.bank);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setSelectedBankDetails(null);
    }
  };

  const calculateCharges = async (date) => {
    if (!application?.id || !date) return;

    try {
      setApiLoading(true);
      setApiError(null);
      
      const response = await collectionService.calculateCollection(
        application.id, 
        date
      );
      
      if (response.success && response.data) {
        setCollectionData(response.data);
        
        const {
          principal_amount,
          normal_interest_before,
          normal_interest_after,
          penal_interest_before,
          penal_interest_after,
          penalty_before,
          penalty_after,
          bounce_amount,
          disburse_bank
        } = response.data;

        const normalInterestTotal = (parseFloat(normal_interest_before || 0) + parseFloat(normal_interest_after || 0));
        const penalInterestTotal = (parseFloat(penal_interest_before || 0) + parseFloat(penal_interest_after || 0));
        const penaltyTotal = (parseFloat(penalty_before || 0) + parseFloat(penalty_after || 0));

        const totalDue = parseFloat(principal_amount || 0) + 
                        normalInterestTotal + 
                        penalInterestTotal + 
                        penaltyTotal + 
                        parseFloat(bounce_amount || 0);

        setFormData(prev => ({
          ...prev,
          normalInterest: normalInterestTotal.toFixed(2),
          penalInterest: penalInterestTotal.toFixed(2),
          penaltyInput: penaltyTotal.toFixed(2),
          bounceCharge: bounce_amount || "0",
          totalDueAmount: totalDue.toFixed(2)
        }));

        if (disburse_bank && banks.length > 0) {
          const bankName = disburse_bank.split('-')[0];
          const bank = banks.find(b => b.bank_name.includes(bankName));
          if (bank) {
            setSelectedBankId(bank.id.toString());
            setFormData(prev => ({
              ...prev,
              bankName: bank.bank_name
            }));
            fetchBankDetails(bank.id);
          }
        }
      } else {
        throw new Error(response.message || "Failed to calculate charges");
      }
    } catch (error) {
      console.error("Error calculating charges:", error);
      setApiError(error.message || "Failed to calculate charges");
      toast.error('Failed to calculate charges for selected date');
    } finally {
      setApiLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "collectionBy") {
      setFormData(prev => ({
        ...prev,
        collectionBy: value,
        bankName: value === "by cash" ? "" : prev.bankName
      }));
    } else if (name === "bankId") {
      const bankId = value;
      setSelectedBankId(bankId);
      
      const selectedBank = banks.find(bank => bank.id.toString() === bankId);
      if (selectedBank) {
        setFormData(prev => ({
          ...prev,
          bankName: selectedBank.bank_name
        }));
        fetchBankDetails(selectedBank.id);
      } else {
        setFormData(prev => ({
          ...prev,
          bankName: ""
        }));
        setSelectedBankDetails(null);
      }
    } else if (name === "bounceCharge") {
      setFormData(prev => {
        const principal = parseFloat(collectionData?.principal_amount || 0);
        const normalInt = parseFloat(prev.normalInterest || 0);
        const penalInt = parseFloat(prev.penalInterest || 0);
        const penalty = parseFloat(prev.penaltyInput || 0);
        const bounce = parseFloat(value || 0);
        
        const totalDue = principal + normalInt + penalInt + penalty + bounce;
        
        return {
          ...prev,
          bounceCharge: value,
          totalDueAmount: totalDue.toFixed(2)
        };
      });
    } else if (name === "collectionAmount") {
      setFormData(prev => ({
        ...prev,
        collectionAmount: value
      }));
    } else if (name === "transactionId") {
      setFormData(prev => ({
        ...prev,
        transactionId: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (!collectionData) {
      toast.error('Please select a collection date to calculate charges first');
      return;
    }

    if (!formData.collectionDate || !formData.collectionBy || !formData.collectionAmount) {
      toast.error('Please fill all required fields (Collection Date, Collection By, Collection Amount)');
      return;
    }

    if (formData.collectionBy === "by bank" && !selectedBankId) {
      toast.error('Please select a bank for bank collection');
      return;
    }

    try {
      setLoading(true);
      
      const submissionData = {
        collectionDate: formData.collectionDate,
        normalInterestBefore: parseFloat(collectionData?.normal_interest_before || 0),
        normalInterestAfter: parseFloat(collectionData?.normal_interest_after || 0),
        penalInterestBefore: parseFloat(collectionData?.penal_interest_before || 0),
        penalInterestAfter: parseFloat(collectionData?.penal_interest_after || 0),
        penaltyBefore: parseFloat(collectionData?.penalty_before || 0),
        penaltyAfter: parseFloat(collectionData?.penalty_after || 0),
        bounceCharge: parseFloat(formData.bounceCharge || 0),
        totalDueAmount: parseFloat(formData.totalDueAmount || 0),
        collectionAmount: parseFloat(formData.collectionAmount),
        transactionId: formData.transactionId,
        collectionBy: formData.collectionBy,
        bankId: selectedBankId
      };
      
      await collectionService.submitNormalCollection(
        application.id, 
        submissionData, 
        collectionData
      );
      
      if (onCollectionSubmit) {
        await onCollectionSubmit(application.id, submissionData);
      }
      
      onClose();
    } catch (error) {
      console.error("Collection error:", error);
      toast.error(error.message || 'Failed to process collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Get data from collectionData (API response) instead of applicationData
  const sanctionAmount = application?.approvedAmount || "0"; // Only this from application
  const disburseDate = collectionData?.disburse_date || "";
  const transactionDate = collectionData?.transaction_date || "";
  const dueDate = collectionData?.due_date || "";
  const lastCollectionDate = collectionData?.last_collection_date || "";
  const principalAmount = collectionData?.principal_amount || "0";
  const amtDisbursedFrom = collectionData?.disburse_bank || "";

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all ${
          isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}>
          <h2 className={`text-xl font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Collection of {application?.name || "Customer"}
            {apiLoading && <span className="text-sm ml-2 text-yellow-500">(Calculating...)</span>}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiError && (
          <div className={`mx-6 mt-4 p-3 rounded-lg border ${
            isDark ? "bg-red-900/20 border-red-700 text-red-300" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <div className="flex items-start">
              <AlertCircle className={`w-5 h-5 mt-0.5 mr-2 ${isDark ? "text-red-400" : "text-red-500"}`} />
              <div>
                <strong className="font-semibold">Error:</strong> {apiError}
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Application Details */}
          <div className={`mb-6 p-4 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${
              isDark ? "text-indigo-300" : "text-indigo-700"
            }`}>
              Application Details
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Sanction Amount
                </div>
                <div className={`text-lg font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  ₹{formatCurrency(sanctionAmount)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Disburse Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(disburseDate)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Transaction Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(transactionDate)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Due Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(dueDate)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Last Collection
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(lastCollectionDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Collection Details */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${
              isDark ? "text-indigo-300" : "text-indigo-700"
            }`}>
              Collection Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Collection Date */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Collection Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="collectionDate"
                    value={formData.collectionDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setFormData(prev => ({ ...prev, collectionDate: newDate }));
                      
                      // Call calculateCharges with the new date directly
                      if (newDate && application?.id) {
                        calculateCharges(newDate);
                      }
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required
                  />
                </div>

                {/* Principal Amount */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Principal Amount
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(principalAmount)}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Normal Interest */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Normal Interest
                  </label>
                  <input
                    type="text"
                    name="normalInterest"
                    value={formData.normalInterest}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                  {collectionData && (
                    <div className="text-xs mt-1 flex justify-between">
                      <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                        Before: {formatCurrency(collectionData.normal_interest_before)}
                      </span>
                      <span className={isDark ? "text-blue-300" : "text-blue-600"}>
                        <ArrowRight className="w-3 h-3 inline mr-1" />
                        After: {formatCurrency(collectionData.normal_interest_after)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Penal Interest */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Penal Interest
                  </label>
                  <input
                    type="text"
                    name="penalInterest"
                    value={formData.penalInterest}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                  {collectionData && (
                    <div className="text-xs mt-1 flex justify-between">
                      <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                        Before: {formatCurrency(collectionData.penal_interest_before)}
                      </span>
                      <span className={isDark ? "text-amber-300" : "text-amber-600"}>
                        <ArrowRight className="w-3 h-3 inline mr-1" />
                        After: {formatCurrency(collectionData.penal_interest_after)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Penalty */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Penalty
                  </label>
                  <input
                    type="text"
                    name="penaltyInput"
                    value={formData.penaltyInput}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                  {collectionData && (
                    <div className="text-xs mt-1 flex justify-between">
                      <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                        Before: {formatCurrency(collectionData.penalty_before)}
                      </span>
                      <span className={isDark ? "text-red-300" : "text-red-600"}>
                        <ArrowRight className="w-3 h-3 inline mr-1" />
                        After: {formatCurrency(collectionData.penalty_after)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bounce Charge */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Bounce Charge
                  </label>
                  <input
                    type="number"
                    name="bounceCharge"
                    value={formData.bounceCharge}
                    onChange={handleChange}
                    placeholder="Enter bounce charge"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Total Due Amount */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Total Due Amount
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(formData.totalDueAmount)}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm font-bold ${
                      isDark 
                        ? "bg-emerald-900/30 border-emerald-700 text-emerald-300 cursor-not-allowed" 
                        : "bg-emerald-50 border-emerald-300 text-emerald-700 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Collection Amount */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Collection Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="collectionAmount"
                    value={formData.collectionAmount}
                    onChange={handleChange}
                    placeholder="Enter collection amount"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Collection By */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Collection By <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="collectionBy"
                      value={formData.collectionBy}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                        isDark 
                          ? "bg-gray-600 border-gray-500 text-white" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="by bank">By Bank</option>
                      <option value="by cash">By Cash</option>
                    </select>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction ID"
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                        isDark 
                          ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Bank Name
                      {selectedBankDetails && (
                        <span className={`text-xs ml-2 ${
                          isDark ? "text-emerald-300" : "text-emerald-600"
                        }`}>
                          ({selectedBankDetails.branch_name})
                        </span>
                      )}
                    </label>
                    <select
                      name="bankId"
                      value={selectedBankId}
                      onChange={handleChange}
                      disabled={formData.collectionBy === "by cash"}
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                        formData.collectionBy === "by cash"
                          ? isDark
                            ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                          : isDark 
                            ? "bg-gray-600 border-gray-500 text-white" 
                            : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">--Select Bank--</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.bank_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amt Disbursed From */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Amt Disbursed From
                    </label>
                    <input
                      type="text"
                      value={amtDisbursedFrom}
                      readOnly
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                        isDark 
                          ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                          : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || apiLoading}
              className={`px-8 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 font-medium ${
                loading || apiLoading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Submit Collection
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalCollectionForm;