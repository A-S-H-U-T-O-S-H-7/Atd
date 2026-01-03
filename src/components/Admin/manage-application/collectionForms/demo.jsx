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
  const sanctionAmount = application?.approvedAmount || "0"; 
  const disburseDate = application?.disburse_date || "";
  const transactionDate = application?.transaction_date || "";
  const dueDate = application?.due_date || "";
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
                  {formatDate(application?.disburseDateTime)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Transaction Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(application?.transactionDateTime )}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Due Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(application?.dueDateTime)}
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


///////
"use client";
import React, { useState, useEffect } from "react";
import { X, Calendar, IndianRupee, BanknoteIcon, ArrowRight } from "lucide-react";
import { collectionService } from "@/lib/services/colletionForms/CollectionService";
import toast from "react-hot-toast";

const RenewalCollectionForm = ({
  isOpen,
  onClose,
  application,
  onRenewalSubmit,
  initialData = null,
  isDark
}) => {
  const [formData, setFormData] = useState({
    collectionDate: "",
    principalAmount: "0",
    normalInterest: "0",
    penalInterest: "0",
    penaltyInput: "0",
    bounceCharge: "0", 
    renewalCharge: "0", 
    renewalGst: "0",
    totalDueAmount: "0",
    collectionBy: "",
    collectionBankName: "", 
    disbursedBank: "",
    collectionAmount: "0",
    collectionTransactionId: "" 
  });

  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [selectedBankId, setSelectedBankId] = useState("");

  useEffect(() => {
    if (isOpen && application) {
      setFormData({
        collectionDate: "",
        principalAmount: "0",
        normalInterest: "0",
        penalInterest: "0",
        penaltyInput: "0",
        bounceCharge: "0",
        renewalCharge: "0",
        renewalGst: "0",
        totalDueAmount: "0",
        collectionBy: "",
        collectionBankName: "",
        disbursedBank: initialData?.disburse_bank || "",
        collectionAmount: "0",
        collectionTransactionId: ""
      });

      fetchBankList();
      
      // If initialData is already provided, populate the form
      if (initialData) {
        populateFormWithInitialData(initialData);
      }
    }
  }, [isOpen, application, initialData]);

  const fetchBankList = async () => {
    try {
      const response = await collectionService.getBankList();
      console.log("Bank list response:", response);
      
      if (response.success) {
        const banks = response.data || response.bank || response.banks || response;
        setBankList(Array.isArray(banks) ? banks : []);
      } else {
        setBankList(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error('Error fetching bank list:', error);
      toast.error('Failed to load bank list');
      setBankList([]);
    }
  };

  const fetchBankDetails = async (bankId) => {
    try {
      const response = await collectionService.getBankDetails(bankId);
      if (response.success) {
        setSelectedBankDetails(response.bank || response.data);
      } else {
        setSelectedBankDetails(null);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      setSelectedBankDetails(null);
    }
  };

  const populateFormWithInitialData = (data) => {
    // Calculate total amounts like NormalCollectionForm
    const normalInterestTotal = (parseFloat(data.normal_interest_before || 0) + parseFloat(data.normal_interest_after || 0));
    const penalInterestTotal = (parseFloat(data.penal_interest_before || 0) + parseFloat(data.penal_interest_after || 0));
    const penaltyTotal = (parseFloat(data.penalty_before || 0) + parseFloat(data.penalty_after || 0));

    const formattedData = {
      principalAmount: data.principal_amount || "0",
      normalInterest: normalInterestTotal.toFixed(2),
      penalInterest: penalInterestTotal.toFixed(2),
      penaltyInput: penaltyTotal.toFixed(2),
      bounceCharge: data.bounce_amount || "0",
      renewalCharge: data.renewal || "0",
      renewalGst: data.renewal_gst || "0",
      disbursedBank: data.disburse_bank || ""
    };

    setFormData(prev => ({
      ...prev,
      ...formattedData
    }));

    calculateTotalDueAmount(formattedData);
  };

  const calculateTotalDueAmount = (data) => {
    const principal = parseFloat(data.principalAmount || 0);
    const normalInterest = parseFloat(data.normalInterest || 0);
    const penalInterest = parseFloat(data.penalInterest || 0);
    const penalty = parseFloat(data.penaltyInput || 0);
    const bounceCharge = parseFloat(data.bounceCharge || 0);
    const renewalCharge = parseFloat(data.renewalCharge || 0);
    const renewalGst = parseFloat(data.renewalGst || 0);

    const totalDue = principal + normalInterest + penalInterest + penalty + bounceCharge + renewalCharge + renewalGst;
    
    setFormData(prev => ({
      ...prev,
      totalDueAmount: totalDue.toFixed(2)
    }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    if (name === "collectionDate") {
      setFormData(prev => ({
        ...prev,
        collectionDate: value
      }));
      
      // Auto-calculate when date is selected
      if (value && application?.id) {
        try {
          setCalculating(true);
          const response = await collectionService.calculateRenewalCollection(
            application.id,
            value
          );

          if (response.success) {
            populateFormWithInitialData(response.data);
            toast.success('Renewal calculated successfully');
          } else {
            toast.error('Failed to calculate renewal');
          }
        } catch (error) {
          console.error('Calculation error:', error);
          toast.error('Failed to calculate renewal');
        } finally {
          setCalculating(false);
        }
      }
    } else if (name === "collectionBy") {
      setFormData(prev => ({
        ...prev,
        collectionBy: value,
        collectionBankName: value === "by cash" ? "" : prev.collectionBankName
      }));
      if (value === "by cash") {
        setSelectedBankId("");
        setSelectedBankDetails(null);
      }
    } else if (name === "collectionBankName") {
      const bankId = value;
      setSelectedBankId(bankId);
      
      const selectedBank = bankList.find(bank => bank.id && bank.id.toString() === bankId);
      if (selectedBank) {
        setFormData(prev => ({
          ...prev,
          collectionBankName: selectedBank.bank_name || selectedBank.name || ""
        }));
        fetchBankDetails(selectedBank.id);
      } else {
        setFormData(prev => ({
          ...prev,
          collectionBankName: ""
        }));
        setSelectedBankDetails(null);
      }
    } else if (name === "bounceCharge" || name === "renewalCharge" || name === "renewalGst" || name === "collectionAmount") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Recalculate total if these fields change
      if (name !== "collectionAmount") {
        setTimeout(() => recalculateTotal(), 10);
      }
    } else if (name === "collectionTransactionId") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const recalculateTotal = () => {
    const principal = parseFloat(formData.principalAmount || 0);
    const normalInterest = parseFloat(formData.normalInterest || 0);
    const penalInterest = parseFloat(formData.penalInterest || 0);
    const penalty = parseFloat(formData.penaltyInput || 0);
    const bounceCharge = parseFloat(formData.bounceCharge || 0);
    const renewalCharge = parseFloat(formData.renewalCharge || 0);
    const renewalGst = parseFloat(formData.renewalGst || 0);

    const totalDue = principal + normalInterest + penalInterest + penalty + bounceCharge + renewalCharge + renewalGst;
    
    setFormData(prev => ({
      ...prev,
      totalDueAmount: totalDue.toFixed(2)
    }));
  };

 const handleSubmit = async () => {
  // Validation
  const requiredFields = ['collectionDate', 'collectionAmount', 'collectionBy', 'totalDueAmount'];
  const missingFields = requiredFields.filter(field => !formData[field] && field !== 'collectionAmount');
  
  if (missingFields.length > 0) {
    toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
    return;
  }

  if (formData.collectionBy === "by bank" && !selectedBankId) {
    toast.error('Please select a bank');
    return;
  }

  try {
    setLoading(true);
    
    // Calculate values to ensure consistency
    const bounceCharge = parseFloat(formData.bounceCharge || 0);
    const renewalCharge = parseFloat(formData.renewalCharge || 0);
    const renewalGst = parseFloat(formData.renewalGst || 0);
    const totalDueAmount = parseFloat(formData.totalDueAmount || 0);
    
    const submissionData = {
      collection_date: formData.collectionDate,
      principal_amount: parseFloat(formData.principalAmount || 0),
      normal_interest_before: parseFloat(initialData?.normal_interest_before || 0),
      normal_interest_after: parseFloat(initialData?.normal_interest_after || 0),
      penal_interest_before: parseFloat(initialData?.penal_interest_before || 0),
      penal_interest_after: parseFloat(initialData?.penal_interest_after || 0),
      penalty_before: parseFloat(initialData?.penalty_before || 0),
      penalty_after: parseFloat(initialData?.penalty_after || 0),
      bounce_charge: bounceCharge,
      renewal_charge: renewalCharge,
      renewal_gst: renewalGst,
      total_due_amount: totalDueAmount,
      collection_bank_name: selectedBankId ? parseInt(selectedBankId) : null,
      disbursed_bank: formData.disbursedBank || "",
      collection_amount: parseFloat(formData.collectionAmount),
      collection_transaction_id: formData.collectionTransactionId || "",
      collection_by: formData.collectionBy
    };

    console.log('Submitting renewal data:', submissionData);
    
    await onRenewalSubmit(application.id, submissionData);
    
  } catch (error) {
    console.error("Renewal error:", error);
    toast.error('Failed to submit renewal');
  } finally {
    setLoading(false);
  }
};

  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!isOpen) return null;

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
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}>
          <div>
            <h2 className={`text-xl font-bold ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`}>
              Loan Renewal - {application?.name || "Customer"}
            </h2>
            <p className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Loan No: {application?.loanNo} | CRN: {application?.crnNo}
            </p>
          </div>
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

        {/* Form Content */}
        <div className="p-6">
          {/* Loan Information Section */}
          <div className={`mb-6 p-4 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${
              isDark ? "text-purple-300" : "text-purple-700"
            }`}>
              Loan Information
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Sanction Amount
                </div>
                <div className={` font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  ₹{formatCurrency(application?.approvedAmount || 0)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Disburse Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {initialData?.disburse_date ? formatDate(initialData.disburse_date) : "N/A"}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Transaction Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {initialData?.transaction_date ? formatDate(initialData.transaction_date) : "N/A"}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Due Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {initialData?.due_date ? formatDate(initialData.due_date) : "N/A"}
                </div>  
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Last Collection Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {initialData?.last_collection_date ? formatDate(initialData.last_collection_date) : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Collection Date */}
          <div className="mb-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Collection Date <span className="text-red-500">*</span>
                {calculating && <span className="ml-2 text-yellow-500 text-sm">(Calculating...)</span>}
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`} />
                <input
                  type="date"
                  name="collectionDate"
                  value={formData.collectionDate}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Renewal Calculation Section */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? "text-purple-300" : "text-purple-700"
            }`}>
              <IndianRupee className="w-5 h-5" />
              Renewal Calculation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Principal Amount */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Principal Amount
                </label>
                <input
                  type="text"
                  value={formatCurrency(formData.principalAmount)}
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
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Normal Interest
                </label>
                <input
                  type="text"
                  name="normalInterest"
                  value={formatCurrency(formData.normalInterest)}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                  }`}
                />
                {initialData && (
                  <div className="text-xs mt-1 flex justify-between px-1">
                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                      Before: ₹{formatCurrency(initialData.normal_interest_before || 0)}
                    </span>
                    <span className={isDark ? "text-blue-300" : "text-blue-600"}>
                      <ArrowRight className="w-3 h-3 inline mr-1" />
                      After: ₹{formatCurrency(initialData.normal_interest_after || 0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Penal Interest */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Penal Interest
                </label>
                <input
                  type="text"
                  name="penalInterest"
                  value={formatCurrency(formData.penalInterest)}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                  }`}
                />
                {initialData && (
                  <div className="text-xs mt-1 flex justify-between px-1">
                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                      Before: ₹{formatCurrency(initialData.penal_interest_before || 0)}
                    </span>
                    <span className={isDark ? "text-amber-300" : "text-amber-600"}>
                      <ArrowRight className="w-3 h-3 inline mr-1" />
                      After: ₹{formatCurrency(initialData.penal_interest_after || 0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Penalty */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Penalty
                </label>
                <input
                  type="text"
                  name="penaltyInput"
                  value={formatCurrency(formData.penaltyInput)}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                  }`}
                />
                {initialData && (
                  <div className="text-xs mt-1 flex justify-between px-1">
                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                      Before: ₹{formatCurrency(initialData.penalty_before || 0)}
                    </span>
                    <span className={isDark ? "text-red-300" : "text-red-600"}>
                      <ArrowRight className="w-3 h-3 inline mr-1" />
                      After: ₹{formatCurrency(initialData.penalty_after || 0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Renewal Charges */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Renewal Charge
                  </label>
                  <input
                    type="number"
                    name="renewalCharge"
                    value={formData.renewalCharge}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Renewal GST
                  </label>
                  <input
                    type="number"
                    name="renewalGst"
                    value={formData.renewalGst}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Bounce Charge */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Bounce Charge
                </label>
                <input
                  type="number"
                  name="bounceCharge"
                  value={formData.bounceCharge}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Disbursed Bank */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Disbursed Bank
                </label>
                <input
                  type="text"
                  name="disbursedBank"
                  value={formData.disbursedBank}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Total Due Amount */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Total Due Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formatCurrency(formData.totalDueAmount)}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm font-bold ${
                    isDark 
                      ? "bg-purple-900/30 border-purple-700 text-purple-300 cursor-not-allowed" 
                      : "bg-purple-50 border-purple-300 text-purple-700 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Collection Details Section */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? "text-purple-300" : "text-purple-700"
            }`}>
              <BanknoteIcon className="w-5 h-5" />
              Collection Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Collection Amount */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Collection Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="collectionAmount"
                  value={formData.collectionAmount}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  step="0.01"
                  required
                  min="0"
                />
              </div>

              {/* Collection By */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Collection By <span className="text-red-500">*</span>
                </label>
                <select
                  name="collectionBy"
                  value={formData.collectionBy}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                >
                  <option value="">-- Select Method --</option>
                  <option value="by cash">By Cash</option>
                  <option value="by bank">By Bank</option>
                </select>
              </div>

              {/* Bank Selection (conditionally shown) */}
              {formData.collectionBy === "by bank" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Bank Name <span className="text-red-500">*</span>
                    {selectedBankDetails && (
                      <span className={`text-xs ml-2 ${
                        isDark ? "text-emerald-300" : "text-emerald-600"
                      }`}>
                        ({selectedBankDetails.branch_name || selectedBankDetails.branch})
                      </span>
                    )}
                  </label>
                  <select
                    name="collectionBankName"
                    value={selectedBankId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required
                  >
                    <option value="">-- Select Bank --</option>
                    {bankList.length > 0 ? (
                      bankList.map((bank) => (
                        <option key={bank.id || bank._id} value={bank.id || bank._id}>
                          {bank.bank_name || bank.name || `Bank ${bank.id}`}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading banks...</option>
                    )}
                  </select>
                </div>
              )}

              {/* Transaction ID */}
              {formData.collectionBy === "by bank" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    name="collectionTransactionId"
                    value={formData.collectionTransactionId}
                    onChange={handleChange}
                    placeholder="Enter transaction ID"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.collectionDate || !formData.collectionAmount || calculating}
              className={`px-8 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 font-medium ${
                loading || calculating
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-600/20"
              } ${(!formData.collectionDate || !formData.collectionAmount || calculating) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Submit Renewal
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

export default RenewalCollectionForm;
