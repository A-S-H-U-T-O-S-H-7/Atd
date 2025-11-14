"use client";
import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { collectionService } from "@/lib/services/colletionForms/CollectionService";

const NormalCollectionForm = ({
  isOpen,
  onClose,
  application,
  onCollectionSubmit,
  isDark
}) => {
  const [formData, setFormData] = useState({
    collectionDate: "",
    penaltyInput: "",
    penalInterest: "",
    bounceCharge: "",
    collectionBy: "",
    bankName: "",
    transactionId: "",
    collectionAmount: "",
    status: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [collectionData, setCollectionData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [penaltyChecked, setPenaltyChecked] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);

  // Fetch banks when component mounts
  useEffect(() => {
    fetchBanks();
  }, []);

  // Fetch collection data when modal opens
  useEffect(() => {
    if (isOpen && application) {
      fetchCollectionData();
      setFormData({
        collectionDate: new Date().toISOString().split('T')[0],
        penaltyInput: "",
        penalInterest: "",
        bounceCharge: "",
        collectionBy: "",
        bankName: "",
        transactionId: "",
        collectionAmount: "",
        status: ""
      });
      setPenaltyChecked(false);
    }
  }, [isOpen, application]);

  // Fetch bank list from API
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

  // Fetch bank details when bank is selected
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

  // API call to fetch collection details using the service
  const fetchCollectionData = async () => {
    if (!application?.id) return;
    
    try {
      setApiLoading(true);
      setApiError(null);
      
      const response = await collectionService.getCollectionDetails(application.id);
      
      if (response.success) {
        setCollectionData(response.data);
        
        // Pre-fill bank name from collection data if available
        if (response.data.bank_name) {
          setFormData(prev => ({
            ...prev,
            bankName: response.data.bank_name
          }));
          
          // Find and set bank details
          const bank = banks.find(b => b.bank_name === response.data.bank_name);
          if (bank) {
            fetchBankDetails(bank.id);
          }
        }
      } else {
        throw new Error(response.message || "Failed to fetch collection data");
      }
    } catch (error) {
      console.error("Error fetching collection data:", error);
      setApiError(error.message || "Failed to load collection details");
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
    } else if (name === "bankName") {
      setFormData(prev => ({
        ...prev,
        bankName: value
      }));
      
      // Fetch bank details when a bank is selected
      if (value) {
        const selectedBank = banks.find(bank => bank.bank_name === value);
        if (selectedBank) {
          fetchBankDetails(selectedBank.id);
        }
      } else {
        setSelectedBankDetails(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePenaltyCheckbox = (e) => {
    const checked = e.target.checked;
    setPenaltyChecked(checked);
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        penaltyInput: "500"
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        penaltyInput: ""
      }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.collectionDate || !formData.collectionBy || !formData.collectionAmount || !formData.status) {
      alert('Please fill all required fields.');
      return;
    }

    if (formData.collectionBy === "by bank" && !formData.bankName) {
      alert('Please select a bank.');
      return;
    }

    try {
      setLoading(true);
      
      // Use the service to submit collection
      await collectionService.submitNormalCollection(application.id, formData);
      
      // Call the parent handler for any additional logic
      if (onCollectionSubmit) {
        await onCollectionSubmit(application.id, formData);
      }
      
      alert('Collection processed successfully!');
      onClose();
    } catch (error) {
      console.error("Collection error:", error);
      alert(`Failed to process collection: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Use API data or fallback to application data
  const sanctionAmount = collectionData?.approved_amount || application?.approvedAmount || "9000";
  const processFee = collectionData?.process_fee || application?.processFee || "1274";
  const processFeePrincipal = parseFloat(processFee) - (collectionData?.gst || 194);
  const processFeeGST = collectionData?.gst || 194;
  const processFeeDetail = `(Principal: ${processFeePrincipal.toLocaleString('en-IN')} + GST: ${processFeeGST.toLocaleString('en-IN')})`;
  const disburseDate = collectionData?.disburse_date || application?.disburseDate || "2025-11-10";
  const transactionDate = collectionData?.transaction_date || application?.transactionDate || "2025-11-10";
  const dueDate = collectionData?.duedate || application?.dueDate || "2025-12-09";
  const interest = collectionData?.roi ? `${collectionData.roi}%` : "";
  const dueAmount = collectionData?.dw_collection || "";
  const penalty = application?.penalty || "";
  const totalDueAmount = collectionData?.emi_collection || "";
  const amtDisbursedFrom = collectionData?.bank_name || application?.amtDisbursedFrom || "ICICI Bank-A/c-5399";

  // Calculate penalty details
  const penaltyAmount = formData.penaltyInput ? parseFloat(formData.penaltyInput) : 0;
  const penaltyPrincipal = penaltyAmount > 0 ? Math.round(penaltyAmount / 1.18) : 0; // Assuming 18% GST
  const penaltyGST = penaltyAmount > 0 ? penaltyAmount - penaltyPrincipal : 0;
  const penaltyDetail = penaltyAmount > 0 ? `(Principal: ${penaltyPrincipal.toLocaleString('en-IN')} + GST: ${penaltyGST.toLocaleString('en-IN')})` : "";

  // Calculate penal interest details
  const penalInterestAmount = formData.penalInterest ? parseFloat(formData.penalInterest) : 0;
  const penalInterestPrincipal = penalInterestAmount > 0 ? Math.round(penalInterestAmount / 1.18) : 0; // Assuming 18% GST
  const penalInterestGST = penalInterestAmount > 0 ? penalInterestAmount - penalInterestPrincipal : 0;
  const penalInterestDetail = penalInterestAmount > 0 ? `(Penal Int: ${penalInterestPrincipal.toLocaleString('en-IN')} + GST: ${penalInterestGST.toLocaleString('en-IN')})` : "";

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
          <h2 className={`text-xl font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Collection of {application?.name || "Dileep Kumar"}
            {apiLoading && <span className="text-sm ml-2 text-yellow-500">(Loading...)</span>}
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

        {/* Error Message */}
        {apiError && (
          <div className={`mx-6 mt-4 p-3 rounded-lg border ${
            isDark ? "bg-red-900/20 border-red-700 text-red-300" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <strong>Error:</strong> {apiError}
            <button 
              onClick={() => setApiError(null)}
              className="ml-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          {/* Non-editable Application Details */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? "text-indigo-300" : "text-indigo-700"
            }`}>
              Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  Sanction Amount
                </label>
                <input
                  type="text"
                  value={`₹${parseFloat(sanctionAmount).toLocaleString('en-IN')}`}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  Process Fee
                </label>
                <div className="space-y-1">
                  <input
                    type="text"
                    value={`₹${parseFloat(processFee).toLocaleString('en-IN')}`}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                  <p className={`text-xs px-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {processFeeDetail}
                  </p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  Disburse Date
                </label>
                <input
                  type="date"
                  value={disburseDate}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={transactionDate}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
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

          {/* Due Amount Section */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? "text-indigo-300" : "text-indigo-700"
            }`}>
              Collection Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Collection date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="collectionDate"
                    value={formData.collectionDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Interest (ROI)
                  </label>
                  <input
                    type="text"
                    value={interest}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Due Amount
                  </label>
                  <input
                    type="text"
                    value={dueAmount ? `₹${parseFloat(dueAmount).toLocaleString('en-IN')}` : "N/A"}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Total Due Amount
                  </label>
                  <input
                    type="text"
                    value={totalDueAmount ? `₹${parseFloat(totalDueAmount).toLocaleString('en-IN')}` : "N/A"}
                    readOnly
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                      isDark 
                        ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                        : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Penalty and Penal Interest in 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Penalty
                  </label>
                  <div className="space-y-1">
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        name="penaltyInput"
                        value={formData.penaltyInput}
                        onChange={handleChange}
                        placeholder="Enter penalty amount"
                        className={`flex-1 px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                          isDark 
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        min="0"
                      />
                      <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                        isDark 
                          ? penaltyChecked 
                            ? "bg-emerald-600 border-emerald-500 text-white" 
                            : "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                          : penaltyChecked 
                            ? "bg-emerald-500 border-emerald-400 text-white" 
                            : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                      }`}>
                        <input
                          type="checkbox"
                          checked={penaltyChecked}
                          onChange={handlePenaltyCheckbox}
                          className="hidden"
                        />
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-medium">₹500</span>
                      </label>
                    </div>
                    {penaltyDetail && (
                      <p className={`text-xs px-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        {penaltyDetail}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Penal Interest
                  </label>
                  <div className="space-y-1">
                    <input
                      type="number"
                      name="penalInterest"
                      value={formData.penalInterest}
                      onChange={handleChange}
                      placeholder="Enter penal interest"
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                        isDark 
                          ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      min="0"
                    />
                    {penalInterestDetail && (
                      <p className={`text-xs px-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        {penalInterestDetail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bounce Charge and Collection By in 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  />
                </div>

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
              </div>

              {/* Bank Name and Amt Disbursed From in 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    name="bankName"
                    value={formData.bankName}
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
                      <option key={bank.id} value={bank.bank_name}>
                        {bank.bank_name}
                      </option>
                    ))}
                  </select>
                </div>

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

              {/* Transaction ID and Collection Amount in 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Transaction Id
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
              </div>

              {/* Status field */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required
                  >
                    <option value="">--Select Status--</option>
                    <option value="Returned">Returned</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div></div> {/* Empty div for grid alignment */}
              </div>
            </div>
          </div>

          {/* Actions */}
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
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 font-medium ${
                loading
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
                  <span>→</span>
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