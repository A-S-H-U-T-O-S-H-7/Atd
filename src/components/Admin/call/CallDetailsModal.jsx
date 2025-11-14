import React, { useState, useEffect } from "react";
import { X, Phone, User, CreditCard, Calendar, Clock } from "lucide-react";
import { callAPI,callService } from "@/lib/services/CallServices";

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
      // Reset form
      setRemarks("");
      setNextCallDate("");
    }
  }, [isOpen, data]);

  const fetchCallHistory = async () => {
    // Use userId if available, otherwise fall back to id
    const customerId = data?.userId || data?.id;
    
    console.log('📞 Fetching call history for customer:', {
      userId: data?.userId,
      id: data?.id,
      selectedCustomerId: customerId,
      fullData: data
    });
    
    if (!customerId) {
      console.error('❌ No customer ID available');
      return;
    }
    
    setLoadingHistory(true);
    try {
      console.log('🔄 Calling API with customer ID:', customerId);
      const response = await callAPI.getCallHistory(customerId);
      console.log('✅ Call history response:', response);
      setCallHistory(response.calls || []);
    } catch (error) {
      console.error("❌ Error fetching call history:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Handle 404 - no call history exists yet (this is normal for new customers)
      if (error.response?.status === 404) {
        console.log('ℹ️ No call history found for this customer yet');
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border-2 ${
        isDark
          ? "bg-gray-900 border-gray-600"
          : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b-2 ${
          isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/80"
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg border">
              <img 
                src="/atdlogo.png" 
                alt="ATD Finance" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded flex items-center justify-center text-white font-bold text-sm ">
                ATD
              </div>
            </div>
            <div>
              <div className="text-green-600 font-bold text-lg">ATD FINANCE</div>
              <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Customer Call Details
              </div>
            </div>
          </div>
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

        <div className="p-6 space-y-6">
          {/* Customer Summary */}
          <div className={`rounded-lg border-2 p-4 ${
            isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Name:</span>
                <span className={`ml-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {data.name || "N/A"}
                </span>
              </div>
              <div>
                <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Mobile:</span>
                <span className={`ml-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {data.phoneNo || data.mobile || "N/A"}
                </span>
              </div>
              <div>
                <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>CRN No:</span>
                <span className={`ml-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {data.crnNo || "N/A"}
                </span>
              </div>
              <div>
                <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Due Amount:</span>
                <span className="ml-2 font-bold text-emerald-600">
                  {formatCurrency(data.balance || data.dueAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className={`rounded-lg border-2 p-5 ${
              isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
            }`}>
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>Customer Information</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                {[
                  { label: "Name", value: data.name || "N/A" },
                  { label: "Mobile No.", value: data.phoneNo || data.mobile || "N/A" },
                  { label: "CRN NO", value: data.crnNo || "N/A" },
                  { label: "Loan No.", value: data.loanNo || "N/A" },
                  { label: "Due Date", value: formatDate(data.dueDate) },
                  { label: "Overdue Amount", value: formatCurrency(data.overdueAmount) },
                  { label: "No of Days", value: data.noDays || data.noOfDays || "0 Days" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
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

            {/* Call Form */}
            <div className={`rounded-lg border-2 p-5 ${
              isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
            }`}>
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="w-5 h-5 text-blue-600" />
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>Call Details</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Remarks *
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    required
                    disabled={submitting}
                    className={`w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        : "bg-white border-blue-200 text-gray-900 placeholder-gray-500 focus:border-blue-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
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
                    min={new Date().toISOString().split('T')[0]}
                    disabled={submitting}
                    className={`w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-blue-200 text-gray-900 focus:border-blue-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !remarks.trim()}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-md transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none"
                >
                  {submitting ? "Submitting..." : "Submit Call"}
                </button>
              </form>
            </div>
          </div>

          {/* Call History */}
          <div className={`rounded-lg border-2 overflow-hidden ${
            isDark ? "border-gray-600" : "border-blue-200"
          }`}>
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-semibold">Call History</h3>
                </div>
                <span className="text-sm bg-white/20 px-2 py-1 rounded">
                  {callHistory.length} calls
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? "bg-gray-800" : "bg-blue-50"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>Call Date & Time</th>
                    <th className={`px-4 py-3 text-left text-sm font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>Remark</th>
                    <th className={`px-4 py-3 text-left text-sm font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>User</th>
                    <th className={`px-4 py-3 text-left text-sm font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>Next Call</th>
                  </tr>
                </thead>
                <tbody className={isDark ? "bg-gray-800" : "bg-white"}>
                  {loadingHistory ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        Loading call history...
                      </td>
                    </tr>
                  ) : callHistory.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        No call history found
                      </td>
                    </tr>
                  ) : (
                    callHistory.map((call) => (
                      <tr key={call.id} className={`border-b transition-colors hover:${
                        isDark ? "bg-gray-700" : "bg-blue-50"
                      } ${isDark ? "border-gray-700" : "border-blue-100"}`}>
                        <td className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {new Date(call.created_at).toLocaleString('en-GB')}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {call.remark}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {call.admin_name}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {call.nextcall ? formatDate(call.nextcall) : "N/A"}
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
    </div>
  );
};

export default CallDetailsModal;