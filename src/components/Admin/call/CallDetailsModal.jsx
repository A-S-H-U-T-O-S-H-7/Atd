import React, { useState, useEffect } from "react";
import { X, Phone, User, CreditCard, Clock, Smartphone, Building } from "lucide-react";
import { callAPI } from "@/lib/services/CallServices";
import RefMobileModal from "./Ref-MobileModal";
import AccountDetailsModal from "./AccountDetailsModal";
import toast from "react-hot-toast";

const CallDetailsModal = ({ 
  isOpen, 
  onClose, 
  data, 
  isDark, 
  onSubmit, 
  submitting = false 
}) => {
  const [remarks, setRemarks] = useState("");
  const [nextCallDate, setNextCallDate] = useState("");
  const [callHistory, setCallHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [showRefModal, setShowRefModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Get user ID from data
  const userId = data?.user_id || data?.userId;
  const customerId = data?.id || data?.customer_id || data?.application_id;

  // Close on Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const fetchCallHistory = async () => {
    if (!customerId) return;
    
    setLoadingHistory(true);
    try {
      const response = await callAPI.getCallHistory(customerId);
      setCallHistory(response.calls || []);
      setCustomerDetails(response.details || null);
    } catch (error) {
      console.error('Error fetching call history:', error);
      setCallHistory([]);
      setCustomerDetails(null);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCallHistory();
      setRemarks("");
      setNextCallDate("");
      setSubmitError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    
    if (!remarks.trim()) {
      setSubmitError("Please enter remarks");
      return;
    }

    try {
      if (!customerId) {
        setSubmitError("Customer ID is missing");
        return;
      }
      
      const callData = {
        remark: remarks.trim(),
        nextcall: nextCallDate || null
      };
      
      const response = await callAPI.addCallRemark(customerId, callData);
      
      await fetchCallHistory();
      
      setRemarks("");
      setNextCallDate("");
      setSubmitError("");
      
      if (onSubmit) {
        onSubmit(true, response.data);
      }
      
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || "Validation failed";
        setSubmitError(firstError);
      } else if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setSubmitError("Authentication failed. Please login again.");
      } else if (error.response?.status === 404) {
        setSubmitError("Customer not found.");
      } else {
        setSubmitError(error.message || "Failed to submit call. Please try again.");
      }
      
      if (onSubmit) {
        onSubmit(false, error);
      }
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    const numericAmount = typeof amount === 'string' ? 
      parseFloat(amount.replace(/,/g, '')) : amount;
    return `₹${numericAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getCustomerData = (field) => {
    if (customerDetails && customerDetails[field] !== undefined) {
      return customerDetails[field];
    }
    return data[field] || "--";
  };

  const getMaxFutureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleOpenRefModal = () => {
    if (!userId) {
      toast.error('User ID not found. Cannot fetch references.');
      return;
    }
    setShowRefModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Click to close */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content - Stop click propagation */}
      <div 
        className={`relative w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl border-2 z-10 ${
          isDark
            ? "bg-gray-900 border-gray-600"
            : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/80"
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow border">
              <img 
                src="/atdlogo.png" 
                alt="ATD Finance" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded items-center justify-center text-white font-bold text-sm hidden">
                ATD
              </div>
            </div>
            <div>
              <div className="text-green-600 font-bold text-lg">ATD FINANCE</div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Customer Call Details
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenRefModal}
              disabled={!userId}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDark 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                  : "bg-blue-100 hover:bg-blue-200 text-blue-700"
              } ${!userId ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={!userId ? "User ID not available" : "View References"}
            >
              <Smartphone className="w-4 h-4" />
              <span>Ref Mobile</span>
            </button>
            
            <button
              onClick={() => setShowAccountModal(true)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDark 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                  : "bg-green-100 hover:bg-green-200 text-green-700"
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Account Details</span>
            </button>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-red-100 text-gray-500 hover:text-red-600"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {submitError && (
            <div className={`p-3 rounded-lg border ${
              isDark ? "border-red-500 bg-red-900/20" : "border-red-300 bg-red-50"
            }`}>
              <div className="text-red-600 text-sm font-medium">
                {submitError}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className={`rounded-lg border p-4 ${
              isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className={`text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>Customer Information</h3>
              </div>
              
              <div className="space-y-1 text-sm">
                {[
                  { label: "Name", value: getCustomerData('name') },
                  { label: "Mobile", value: getCustomerData('mobile'), important: true },
                  { label: "Alternate Mobile", value: getCustomerData('alternate_no'), important: true },
                  { label: "CRN No", value: getCustomerData('crnno'), important: true },
                  { label: "Loan No", value: getCustomerData('loan_no'), important: true },
                  { label: "Due Date", value: formatDate(getCustomerData('duedate')) },
                  { label: "Overdue Amount", value: getCustomerData('overdueamount'), amount: true },
                  { label: "Due Amount", value: getCustomerData('dueamount'), amount: true },
                  { label: "No of Days", value: getCustomerData('no_of_days') || "0 Days" },
                  { label: "Salary Date", value: formatDate(getCustomerData('salary_date')) },
                  { label: "Customer A/c No", value: getCustomerData('customer_ac_no'), important: true },
                ].map((item, index) => {
                  const displayValue = item.value === "--" ? "" : item.value;
                  const isImportant = item.important;
                  const isAmount = item.amount;
                  let formattedValue = displayValue;
                  
                  if (isAmount && displayValue && displayValue !== "--") {
                    formattedValue = formatCurrency(displayValue);
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className="py-1 border-b border-gray-400"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <div className="flex-shrink-0">
                        <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {item.label}: 
                        </span>
                      </div>
                      
                      <div className="flex-grow text-right min-w-0">
                        <span className={`inline-block ${
                          isImportant 
                            ? isDark 
                              ? "text-white bg-blue-900/30 px-1 rounded font-bold" 
                              : "text-blue-700 bg-blue-100 px-1 rounded font-bold"
                            : isAmount && displayValue && !isNaN(parseFloat(displayValue))
                              ? isDark 
                                ? "text-green-400 bg-green-900/20 px-1 rounded font-bold"
                                : item.label === "Overdue Amount" && parseFloat(displayValue) > 0
                                  ? "text-red-600 bg-red-50 px-1 rounded font-bold"
                                  : "text-green-700 bg-green-50 px-1 rounded font-bold"
                              : isDark 
                                ? "text-gray-100" 
                                : "text-gray-900"
                        }`}>
                          {formattedValue || "--"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`rounded-lg border p-4 ${
              isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                <CreditCard className="w-4 h-4 text-green-600" />
                <h3 className={`text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>Loan Details</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                {[
                  { label: "Disburse Date", value: formatDate(getCustomerData('disburse_date')) },
                  { label: "Sanction Amount", value: getCustomerData('sanction_amount'), amount: true },
                  { label: "Disburse Amount", value: getCustomerData('disburse_amount'), amount: true },
                  { label: "Ledger Amount", value: getCustomerData('ledger_amount'), amount: true },
                  { label: "Penal Interest", value: getCustomerData('penal_interest'), amount: true },
                  { label: "Penalty", value: getCustomerData('penality'), amount: true },
                ].map((item, index) => {
                  const displayValue = item.value === "--" ? "" : item.value;
                  const isAmount = item.amount;
                  let formattedValue = displayValue;
                  
                  if (isAmount && displayValue && displayValue !== "--") {
                    formattedValue = formatCurrency(displayValue);
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className="border-b border-gray-400 py-[1px]"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <div className="flex-shrink-0">
                        <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {item.label}: 
                        </span>
                      </div>
                      
                      <div className="flex-grow text-right min-w-0">
                        <span className={`inline-block ${
                          isAmount && displayValue && !isNaN(parseFloat(displayValue))
                            ? isDark 
                              ? "text-green-400 bg-green-900/20 px-1 rounded font-bold"
                              : "text-green-700 bg-green-50 px-1 rounded font-bold"
                            : isDark 
                              ? "text-gray-100" 
                              : "text-gray-900"
                        }`}>
                          {formattedValue || "--"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`rounded-lg border p-4 ${
              isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-4 h-4 text-blue-600" />
                <h3 className={`text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>Call Details</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Remarks *
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => {
                      setRemarks(e.target.value);
                      setSubmitError("");
                    }}
                    rows={3}
                    required
                    disabled={submitting}
                    className={`w-full px-3 py-2 text-sm rounded border transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        : "bg-white border-blue-200 text-gray-900 placeholder-gray-500 focus:border-blue-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 ${
                      submitError ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    placeholder="Enter call remarks..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Next Call Date
                  </label>
                  <input
                    type="date"
                    value={nextCallDate}
                    onChange={(e) => setNextCallDate(e.target.value)}
                    max={getMaxFutureDate()}
                    min={getTodayDate()} 
                    disabled={submitting}
                    className={`w-full px-3 py-2 text-sm rounded border transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-blue-200 text-gray-900 focus:border-blue-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !remarks.trim()}
                  className="w-full px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium shadow hover:shadow-md"
                >
                  {submitting ? "Submitting..." : "Submit Call"}
                </button>
              </form>
            </div>
          </div>

          <div className={`rounded-lg border overflow-hidden ${
            isDark ? "border-gray-600" : "border-blue-200"
          }`}>
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Call History</h3>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {callHistory.length} calls
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${isDark ? "bg-gray-800" : "bg-blue-50"}`}>
                  <tr>
                    <th className={`px-4 py-2 text-center font-semibold ${
                      isDark ? "text-cyan-300" : "text-gray-700"
                    }`}>Date & Time</th>
                    <th className={`px-4 py-2 text-center font-semibold ${
                      isDark ? "text-cyan-300" : "text-gray-700"
                    }`}>Remark</th>
                    <th className={`px-4 py-2 text-center font-semibold ${
                      isDark ? "text-cyan-300" : "text-gray-700"
                    }`}>Next Call</th>
                    <th className={`px-4 py-2 text-center font-semibold ${
                      isDark ? "text-cyan-300" : "text-gray-700"
                    }`}>User</th>
                  </tr>
                </thead>
                <tbody className={isDark ? "bg-gray-800" : "bg-white"}>
                  {loadingHistory ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center text-gray-500 text-sm">
                        Loading call history...
                      </td>
                    </tr>
                  ) : callHistory.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center text-gray-500 text-sm">
                        No call history found
                      </td>
                    </tr>
                  ) : (
                    callHistory.map((call) => (
                      <tr key={call.id} className={`border-b transition-colors hover:${
                        isDark ? "bg-gray-700" : "bg-blue-50"
                      } ${isDark ? "border-gray-700" : "border-blue-100"}`}>
                        <td className={`px-4 text-center py-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {new Date(call.created_at).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className={`px-4 text-center py-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {call.remark}
                        </td>
                        <td className={`px-4 text-center py-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {call.nextcall ? formatDate(call.nextcall) : "--"}
                        </td>
                        <td className={`px-4 text-center py-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {call.admin_name || "System"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RefMobileModal
        isOpen={showRefModal}
        onClose={() => setShowRefModal(false)}
        userId={userId}
        isDark={isDark}
      />

      <AccountDetailsModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        accountDetails={customerDetails?.company_account_details}
        isDark={isDark}
      />
    </div>
  );
};

export default CallDetailsModal;