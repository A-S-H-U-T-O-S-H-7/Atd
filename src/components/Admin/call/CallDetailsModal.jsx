import React, { useState, useEffect } from "react";
import { X, Phone, User, CreditCard, Calendar, Clock, Mail } from "lucide-react";
import { callAPI, callService } from "@/lib/services/CallServices";

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

  useEffect(() => {
    const customerId = data?.userId || data?.id;
    if (isOpen && customerId) {
      fetchCallHistory();
      setRemarks("");
      setNextCallDate("");
    }
  }, [isOpen, data]);

  const fetchCallHistory = async () => {
    const customerId = data?.userId || data?.id;
    
    if (!customerId) {
      console.error('❌ No customer ID available');
      return;
    }
    
    setLoadingHistory(true);
    try {
      const response = await callAPI.getCallHistory(customerId);
      setCallHistory(response.calls || []);
    } catch (error) {
      console.error("❌ Error fetching call history:", error);
      if (error.response?.status === 404) {
        setCallHistory([]);
      } else {
        setCallHistory([]);
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen || !data) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert("Please enter remarks");
      return;
    }

    try {
      const callData = {
        ...data,
        remarks: remarks.trim(),
        nextCallDate,
        callDate: new Date().toISOString(),
        user: "Current User"
      };
      
      const success = await onSubmit(callData);
      if (success) {
        onClose();
      }
    } catch (error) {
      // Error is handled in parent component
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl border-2 ${
        isDark
          ? "bg-gray-900 border-gray-600"
          : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
      }`}>
        
        {/* Header - Compact */}
        <div className={`flex items-center justify-between p-3 border-b ${
          isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/80"
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow border">
              <img 
                src="/atdlogo.png" 
                alt="ATD Finance" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded items-center justify-center text-white font-bold text-xs hidden">
                ATD
              </div>
            </div>
            <div>
              <div className="text-green-600 font-bold text-md">ATD FINANCE</div>
              <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Customer Call Details
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-all duration-200 ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-red-100 text-gray-500 hover:text-red-600"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Customer Summary - Compact */}
          <div className={`rounded-lg border p-3 ${
            isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="truncate">
                <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Name:</span>
                <span className={`ml-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {data.name || "Samish Shailendra Behere"}
                </span>
              </div>
              <div className="truncate">
                <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Mobile:</span>
                <span className={`ml-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {data.phoneNo || data.mobile || "8087895737"}
                </span>
              </div>
              <div className="truncate">
                <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>CRN:</span>
                <span className={`ml-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {data.crnNo || "S29EQ737"}
                </span>
              </div>
              <div className="truncate">
                <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Due:</span>
                <span className="ml-1 font-bold text-emerald-600">
                  {formatCurrency(data.balance || data.dueAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content - Compact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Customer Information - Left Column */}
            <div className={`rounded-lg border p-3 ${
              isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
            }`}>
              <div className="flex items-center space-x-1 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className={`text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>Customer Info</h3>
              </div>
              
              <div className="space-y-1 text-xs">
                {[
                  { label: "Name", value: data.name || "Samish Shailendra Behere" },
                  { label: "Mobile", value: data.phoneNo || data.mobile || "8087895737" },
                  { label: "CRN NO", value: data.crnNo || "S29EQ737" },
                  { label: "Loan No.", value: data.loanNo || "ATDAM39128" },
                  { label: "C A/c No.", value: data.accountNo || "20517998977" },
                  { label: "Alternative No.", value: "9730488893, 9960518783" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {item.label}:
                    </span>
                    <span className={`text-right ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan Information - Middle Column */}
            <div className={`rounded-lg border p-3 ${
              isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
            }`}>
              <div className="flex items-center space-x-1 mb-2">
                <CreditCard className="w-4 h-4 text-green-600" />
                <h3 className={`text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>Loan Details</h3>
              </div>
              
              <div className="space-y-1 text-xs">
                {[
                  { label: "Due Date", value: formatDate(data.dueDate) || "--" },
                  { label: "Overdue Amount", value: formatCurrency(data.overdueAmount) || "0.00" },
                  { label: "Due Amount", value: formatCurrency(data.dueAmount) },
                  { label: "No of Days", value: data.noDays || data.noOfDays || "0 Days" },
                  { label: "Salary Date", value: data.salaryDate || "1 Nov 2025" },
                  { label: "Salary Amount", value: data.salaryAmount || "₹43,932.00" },
                  { label: "Sanction Amount", value: formatCurrency(data.sanctionAmount) || "₹8,000.00" },
                  { label: "Disburse Amount", value: formatCurrency(data.disburseAmount) },
                  { label: "Penal Interest", value: formatCurrency(data.penalInterest) || "0.00" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {item.label}:
                    </span>
                    <span className={`text-right ${
                      item.label.includes("Amount") ? "font-medium" : ""
                    } ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Form - Right Column */}
            <div className={`rounded-lg border p-3 ${
              isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
            }`}>
              <div className="flex items-center space-x-1 mb-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <h3 className={`text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>Call Details</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Remarks *
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={2}
                    required
                    disabled={submitting}
                    className={`w-full px-2 py-1 text-xs rounded border transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        : "bg-white border-blue-200 text-gray-900 placeholder-gray-500 focus:border-blue-400"
                    } focus:outline-none focus:ring-1 focus:ring-blue-500/20 disabled:opacity-50`}
                    placeholder="Enter call remarks..."
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Next Call Date
                  </label>
                  <input
                    type="date"
                    value={nextCallDate}
                    onChange={(e) => setNextCallDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={submitting}
                    className={`w-full px-2 py-1 text-xs rounded border transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-blue-200 text-gray-900 focus:border-blue-400"
                    } focus:outline-none focus:ring-1 focus:ring-blue-500/20 disabled:opacity-50`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !remarks.trim()}
                  className="w-full px-3 py-2 text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded transition-all duration-200 font-medium shadow hover:shadow-md"
                >
                  {submitting ? "Submitting..." : "Submit Call"}
                </button>
              </form>
            </div>
          </div>

          {/* Call History - Compact */}
          <div className={`rounded-lg border overflow-hidden ${
            isDark ? "border-gray-600" : "border-blue-200"
          }`}>
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Call History</h3>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                  {callHistory.length} calls
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-40">
              <table className="w-full text-xs">
                <thead className={`${isDark ? "bg-gray-800" : "bg-blue-50"}`}>
                  <tr>
                    <th className={`px-2 py-1 text-left font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>Date & Time</th>
                    <th className={`px-2 py-1 text-left font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>Remark</th>
                    <th className={`px-2 py-1 text-left font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>Next Call</th>
                  </tr>
                </thead>
                <tbody className={isDark ? "bg-gray-800" : "bg-white"}>
                  {loadingHistory ? (
                    <tr>
                      <td colSpan="3" className="px-2 py-3 text-center text-gray-500 text-xs">
                        Loading call history...
                      </td>
                    </tr>
                  ) : callHistory.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-2 py-3 text-center text-gray-500 text-xs">
                        No call history found
                      </td>
                    </tr>
                  ) : (
                    callHistory.map((call) => (
                      <tr key={call.id} className={`border-b transition-colors hover:${
                        isDark ? "bg-gray-700" : "bg-blue-50"
                      } ${isDark ? "border-gray-700" : "border-blue-100"}`}>
                        <td className={`px-2 py-1 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {new Date(call.created_at).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className={`px-2 py-1 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {call.remark}
                        </td>
                        <td className={`px-2 py-1 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {call.nextcall ? formatDate(call.nextcall) : "--"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Remarks Preview */}
          <div className={`rounded-lg border p-2 ${
            isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
          }`}>
            <div className="flex items-center space-x-1 mb-1">
              <Mail className="w-4 h-4 text-orange-600" />
              <h3 className={`text-sm font-semibold ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}>Recent Remarks</h3>
            </div>
            <div className="text-xs space-y-1 max-h-20 overflow-y-auto">
              {callHistory.slice(0, 3).map((call, index) => (
                <div key={index} className={`p-1 rounded ${
                  isDark ? "bg-gray-700" : "bg-blue-50"
                }`}>
                  <div className="font-medium">
                    {new Date(call.created_at).toLocaleDateString('en-GB')}:
                  </div>
                  <div className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {call.remark}
                  </div>
                </div>
              ))}
              {callHistory.length === 0 && (
                <div className="text-gray-500 text-center py-1">
                  No recent remarks
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDetailsModal;