"use client";
import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { collectionService } from "@/lib/services/colletionForms/CollectionService";
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
    penaltyInput: "",
    penalInterest: "",
    bounceCharge: "",
    collectionBy: "",
    bankName: "",
    transactionId: "",
    collectionAmount: "",
    status: "",
    normalInterest: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [collectionData, setCollectionData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [penaltyChecked, setPenaltyChecked] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [selectedBankId, setSelectedBankId] = useState("");

  useEffect(() => {
    fetchBanks();
  }, []);

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
        status: "", 
        normalInterest: ""
      });
      setPenaltyChecked(false);
      setSelectedBankId("");
    }
  }, [isOpen, application]);

  useEffect(() => {
    if (formData.collectionDate && collectionData) {
      calculateAndSetCharges();
    }
  }, [formData.collectionDate, collectionData]);

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

  const fetchCollectionData = async () => {
    if (!application?.id) return;
    
    try {
      setApiLoading(true);
      setApiError(null);
      
      const response = await collectionService.getCollectionDetails(application.id);
      
      if (response.success) {
        setCollectionData(response.data);
        
        if (response.data.bank_name) {
          const bank = banks.find(b => b.bank_name === response.data.bank_name);
          if (bank) {
            setSelectedBankId(bank.id.toString());
            setFormData(prev => ({
              ...prev,
              bankName: response.data.bank_name
            }));
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

  const calculateAndSetCharges = () => {
    if (!collectionData || !formData.collectionDate) return;

    const approvedAmount = parseFloat(collectionData.approved_amount);
    const dueDate = new Date(collectionData.duedate);
    const gracePeriod = parseInt(collectionData.grace_period);
    const collectionDate = new Date(formData.collectionDate);
    const lastCollectionDate = collectionData.last_collection_date 
      ? new Date(collectionData.last_collection_date) 
      : null;
    const totalPenaltyPaid = parseFloat(collectionData.total_penalty_paid || 0);
    const hasOverduePayment = collectionData.has_overdue_payment === 1;

    const gracePeriodEnd = new Date(dueDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriod);

    const isWithinGracePeriod = collectionDate <= gracePeriodEnd;

    if (isWithinGracePeriod && !hasOverduePayment) {
      setFormData(prev => ({
        ...prev,
        normalInterest: "0",
        penaltyInput: "0",
        penalInterest: "0"
      }));
      setPenaltyChecked(false);
      return;
    }

    const isFirstLatePayment = !lastCollectionDate;
    
    let diffDays;
    
    if (isFirstLatePayment) {
      diffDays = Math.floor((collectionDate - dueDate) / (1000 * 60 * 60 * 24));
    } else {
      diffDays = Math.floor((collectionDate - lastCollectionDate) / (1000 * 60 * 60 * 24));
    }

    diffDays = Math.max(0, diffDays);

    const normalInterest = ((approvedAmount * 0.067) / 100) * diffDays;
    const penalInterestBase = ((approvedAmount * 0.6) / 100) * diffDays;
    const penalGst = penalInterestBase * 0.18;
    const penalInterestTotal = penalInterestBase + penalGst;
    
    let penalty = 0;
    if (isFirstLatePayment) {
      penalty = 500;
    } else {
      penalty = totalPenaltyPaid >= 500 ? 0 : 500;
    }

    setFormData(prev => ({
      ...prev,
      normalInterest: normalInterest.toFixed(2),
      penaltyInput: penalty.toString(),
      penalInterest: penalInterestTotal.toFixed(2)
    }));
    
    setPenaltyChecked(penalty === 500);
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
    if (!collectionData) {
      toast.error('Collection data is still loading. Please wait...', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: isDark ? '#1f2937' : '#fff',
          color: isDark ? '#fff' : '#111827',
        }
      });
      return;
    }

    if (!formData.collectionDate || !formData.collectionBy || !formData.collectionAmount || !formData.status) {
      toast.error('Please fill all required fields.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: isDark ? '#1f2937' : '#fff',
          color: isDark ? '#fff' : '#111827',
        }
      });
      return;
    }

    if (formData.collectionBy === "by bank" && !selectedBankId) {
      toast.error('Please select a bank.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: isDark ? '#1f2937' : '#fff',
          color: isDark ? '#fff' : '#111827',
        }
      });
      return;
    }

    try {
      setLoading(true);
      
      const dataToSend = {
        ...formData,
        bankId: selectedBankId
      };
      
      await collectionService.submitNormalCollection(application.id, dataToSend, collectionData);
      
      if (onCollectionSubmit) {
        await onCollectionSubmit(application.id, formData);
      }
      
      toast.success('Collection processed successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        }
      });
      
      onClose();
    } catch (error) {
      console.error("Collection error:", error);
      toast.error(error.message || 'Failed to process collection. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: isDark ? '#1f2937' : '#fff',
          color: isDark ? '#fff' : '#111827',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const sanctionAmount = collectionData?.approved_amount || "0";
  const processFee = collectionData?.process_fee || "0";
  const processFeePrincipal = parseFloat(processFee) - parseFloat(collectionData?.gst || 0);
  const processFeeGST = collectionData?.gst || "0";
  const processFeeDetail = `(Principal: ${processFeePrincipal.toLocaleString('en-IN')} + GST: ${parseFloat(processFeeGST).toLocaleString('en-IN')})`;
  const disburseDate = collectionData?.disburse_date || "";
  const transactionDate = collectionData?.transaction_date || "";
  const dueDate = collectionData?.duedate || "";
  const interest = collectionData?.roi ? `${collectionData.roi}%` : "";
  const dueAmount = collectionData?.dw_collection || "";
  
  const calculateTotalDue = () => {
    const base = parseFloat(collectionData?.dw_collection || 0);
    const normalInt = parseFloat(formData.normalInterest || 0);
    const penalty = parseFloat(formData.penaltyInput || 0);
    const penalInt = parseFloat(formData.penalInterest || 0);
    const bounce = parseFloat(formData.bounceCharge || 0);
    return (base + normalInt + penalty + penalInt + bounce).toFixed(2);
  };
  
  const totalDueAmount = calculateTotalDue();
  const amtDisbursedFrom = collectionData?.bank_name || "";

  const penaltyAmount = formData.penaltyInput ? parseFloat(formData.penaltyInput) : 0;
  const penaltyPrincipal = penaltyAmount > 0 ? Math.round(penaltyAmount / 1.18) : 0;
  const penaltyGST = penaltyAmount > 0 ? penaltyAmount - penaltyPrincipal : 0;
  const penaltyDetail = penaltyAmount > 0 ? `(Principal: ${penaltyPrincipal.toLocaleString('en-IN')} + GST: ${penaltyGST.toLocaleString('en-IN')})` : "";

  const penalInterestAmount = formData.penalInterest ? parseFloat(formData.penalInterest) : 0;
  const penalInterestPrincipal = penalInterestAmount > 0 ? Math.round(penalInterestAmount / 1.18) : 0;
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
        <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}>
          <h2 className={`text-xl font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Collection of {application?.name || "Customer"}
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

        <div className="p-6">
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
                    max={new Date().toISOString().split('T')[0]}
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
                <div></div>
              </div>
            </div>
          </div>

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