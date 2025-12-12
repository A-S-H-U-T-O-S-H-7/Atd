import React, { useState, useEffect } from "react";
import { X, Building, CreditCard, Calendar, Lock } from "lucide-react";
import disbursementService from "@/lib/services/disbursementService";
import toast from 'react-hot-toast';

const TransferModal = ({ isOpen, onClose, onSubmit, isDark, disbursementData }) => {
  const [formData, setFormData] = useState({
    disbursementAmount: "",
    bankName: "",
    accountNo: "",
    ifscNo: "",
    branchName: "",
    accountType: "SAVING",
    authCode1: "",
    authCode2: "",
    transactionDate: "",
    dueDate: "",
    atdBankName: "",
    atdBranchName: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [atdBanks, setAtdBanks] = useState([]);
  const [tenure, setTenure] = useState(0);

  useEffect(() => {
    if (isOpen && disbursementData) {
      const loanTenure = disbursementData.tenure || 0;
      setTenure(loanTenure);

      let dueDate = "";
      if (disbursementData.tranDate && loanTenure > 0) {
        const transactionDate = new Date(disbursementData.tranDate);
        const calculatedDueDate = new Date(transactionDate);
        calculatedDueDate.setDate(calculatedDueDate.getDate() + loanTenure);
        dueDate = formatLocalDate(calculatedDueDate);
      }

      // Extract ATD bank name from sender_acno
      const extractBankName = (senderAcno) => {
        if (!senderAcno) return "";
        // Extract bank name from "ICICI banks-A/c-5399" format
        const match = senderAcno.match(/^([^-]+)/);
        return match ? match[1].trim() : senderAcno;
      };

      // Set initial form data from disbursementData API
      setFormData(prev => ({
        ...prev,
        disbursementAmount: disbursementData.disbursedAmount || "",
        bankName: disbursementData.beneficiaryBankIFSC?.includes("FDRL") ? "THE FEDERAL BANK LTD" : "",
        accountNo: disbursementData.beneficiaryAcNo || "",
        ifscNo: disbursementData.beneficiaryBankIFSC || "",
        accountType: disbursementData.beneficiaryAcType || "SAVING",
        transactionDate: disbursementData.tranDate || "",
        dueDate: dueDate,
        atdBankName: extractBankName(disbursementData.senderAcNo) || "",
        branchName: disbursementData.branchName || "" // You might need to map this from your API
      }));

      // Load ATD banks and set branch name
      const loadAtdBanks = async () => {
        try {
          const bankList = await disbursementService.getBanks();
          setAtdBanks(bankList);
          
          // Try to find matching bank and set branch
          if (bankList.length > 0) {
            const extractedBankName = extractBankName(disbursementData.senderAcNo);
            if (extractedBankName) {
              // Find bank in list and get branch details
              const matchedBank = bankList.find(bank => 
                bank.name.toLowerCase().includes(extractedBankName.toLowerCase()) ||
                extractedBankName.toLowerCase().includes(bank.name.toLowerCase())
              );
              
              if (matchedBank) {
                try {
                  const bankDetails = await disbursementService.getBankDetails(matchedBank.id);
                  if (bankDetails && bankDetails.branch_name) {
                    setFormData(prev => ({
                      ...prev,
                      atdBranchName: bankDetails.branch_name
                    }));
                  }
                } catch (error) {
                  console.error('Error loading bank branch:', error);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error loading ATD banks:', error);
          toast.error('Failed to load bank list');
        }
      };
      
      loadAtdBanks();
    }
  }, [isOpen, disbursementData]);

  const formatLocalDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.authCode1.trim()) {
      toast.error('Please enter Authorization Code 1');
      return;
    }

    if (!formData.authCode2.trim()) {
      toast.error('Please enter Authorization Code 2');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await disbursementService.processTransfer(formData, disbursementData);
      
      if (response.success) {
        toast.success('Transfer processed successfully!');
        
        // Call parent onSubmit callback if provided
        if (onSubmit) {
          await onSubmit({
            ...disbursementData,
            ...formData
          });
        }
        
        onClose();
      } else {
        throw new Error(response.message || 'Failed to process transfer');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error(error.message || 'Transfer failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Compact static display component for non-editable fields
  const StaticField = ({ label, value, icon: Icon }) => (
    <div className="space-y-1">
      <label className={`block text-xs font-medium ${
        isDark ? "text-gray-300" : "text-gray-600"
      }`}>
        {label}
      </label>
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
        isDark 
          ? "bg-gray-700/50 border-gray-600 text-gray-100" 
          : "bg-gray-50 border-gray-200 text-gray-800"
      }`}>
        {Icon && <Icon className={`w-3 h-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />}
        <span className="text-sm font-medium">{value || "Not specified"}</span>
      </div>
    </div>
  );

  // Non-editable input field component
  const NonEditableField = ({ label, value, icon: Icon, type = "text" }) => (
    <div className="space-y-1">
      <label className={`block text-xs font-medium ${
        isDark ? "text-gray-300" : "text-gray-600"
      }`}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className={`
            absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
            ${isDark ? "text-gray-400" : "text-gray-500"}
          `} />
        )}
        <input
          type={type}
          value={value}
          readOnly
          className={`
            w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 rounded-lg border transition-all duration-200 text-sm
            ${isDark
              ? "bg-gray-700/50 border-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
            }
          `}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto border ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b ${
          isDark 
            ? "bg-gray-900 border-gray-700" 
            : "bg-gradient-to-r from-emerald-50 to-teal-50 border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg ${
                isDark ? "bg-emerald-600/20" : "bg-emerald-100"
              }`}>
                <Building className={`w-4 h-4 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  Disbursement Transfer
                </h2>
                <p className={`text-xs ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  {disbursementData?.beneficiaryAcName} - {disbursementData?.loanNo}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-all duration-200 ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Customer Details */}
            <div className="space-y-4">
              {/* Disbursement Amount */}
              <div className="space-y-1">
                <label className={`block text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Disbursement Amount
                </label>
                <div className={`relative overflow-hidden rounded-lg border ${
                  isDark 
                    ? "bg-gray-700 border-gray-600" 
                    : "bg-emerald-50 border-emerald-200"
                }`}>
                  <div className="flex items-center px-3 py-2">
                    <CreditCard className={`w-4 h-4 mr-2 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-lg font-bold ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}>
                      ₹{formData.disbursementAmount || "0"}
                    </span>
                    <Lock className={`w-3 h-3 ml-auto ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`} />
                  </div>
                </div>
              </div>

              {/* Customer's Bank Details */}
              <div className={`p-3 rounded-lg border ${
                isDark 
                  ? "bg-gray-700/30 border-gray-600" 
                  : "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex items-center space-x-1 mb-2">
                  <Building className={`w-4 h-4 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`} />
                  <h3 className={`text-sm font-semibold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}>
                    Customer's Bank Details
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <StaticField 
                    label="Bank Name" 
                    value={formData.bankName}
                    icon={Building}
                  />
                  <StaticField 
                    label="Account Number" 
                    value={formData.accountNo}
                    icon={CreditCard}
                  />
                  <StaticField 
                    label="IFSC Code" 
                    value={formData.ifscNo}
                  />
                  <StaticField 
                    label="Branch Name" 
                    value={formData.branchName}
                  />
                </div>
              </div>

              {/* Account Type */}
              <NonEditableField 
                label="Account Type"
                value={formData.accountType}
                icon={CreditCard}
              />
            </div>

            {/* Right Column - Transfer Details */}
            <div className="space-y-4">
              {/* Auth Codes - ONLY EDITABLE FIELDS */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={`block text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Authorization Code 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="authCode1"
                    value={formData.authCode1}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                    } focus:outline-none focus:ring-1 focus:ring-emerald-500/20 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`block text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Authorization Code 2 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="authCode2"
                    value={formData.authCode2}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                    } focus:outline-none focus:ring-1 focus:ring-emerald-500/20 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Date Fields - NON EDITABLE */}
              <div className="space-y-3">
                <NonEditableField 
                  label="Transaction Date"
                  value={formData.transactionDate}
                  icon={Calendar}
                  type="date"
                />

                <NonEditableField 
                  label="Due Date"
                  value={formData.dueDate}
                  icon={Calendar}
                  type="date"
                />
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Auto-calculated (Transaction Date + {tenure} days)
                </p>
              </div>

              {/* ATD Bank Details - NON EDITABLE */}
              <div className={`p-3 rounded-lg border ${
                isDark 
                  ? "bg-gray-700/30 border-gray-600" 
                  : "bg-purple-50 border-purple-200"
              }`}>
                <div className="flex items-center space-x-1 mb-2">
                  <Building className={`w-4 h-4 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`} />
                  <h3 className={`text-sm font-semibold ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}>
                    ATD Bank Details
                  </h3>
                </div>

                <div className="space-y-2">
                  <NonEditableField 
                    label="Bank Name"
                    value={formData.atdBankName}
                    icon={Building}
                  />

                  <NonEditableField 
                    label="Branch Name"
                    value={formData.atdBranchName}
                    icon={Building}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.authCode1.trim() || !formData.authCode2.trim()}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105 ${
                isSubmitting || !formData.authCode1.trim() || !formData.authCode2.trim()
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : isDark
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/25"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Transfer...</span>
                </>
              ) : (
                <>
                  <span>Submit Transfer</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;