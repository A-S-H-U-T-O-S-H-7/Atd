import React, { useState } from "react";
import { X, Phone, User, CreditCard, Calendar, MapPin, Mail, IndianRupee, Building2, FileText, Clock, Calculator } from "lucide-react";

const CallDetailsModal = ({ isOpen, onClose, data, isDark, onSubmit }) => {
  const [remarks, setRemarks] = useState("");
  const [nextCallDate, setNextCallDate] = useState("");

  if (!isOpen || !data) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const callData = {
      ...data,
      remarks,
      nextCallDate,
      callDate: new Date().toLocaleString(),
      user: "Current User"
    };
    onSubmit(callData);
    setRemarks("");
    setNextCallDate("");
    onClose();
  };

  const handleClose = () => {
    setRemarks("");
    setNextCallDate("");
    onClose();
  };

  // Sample call history data
  const callHistory = [
    {
      date: "17-06-2025 12:13:54 pm",
      remark: "update bank statement and pay slip",
      user: "Rana Chandan",
      nextCall: ""
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border-2 ${
        isDark
          ? "bg-gray-900 border-gray-600"
          : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
      }`}>
        {/* Compact Header */}
        <div className={`flex items-center justify-between p-4 border-b-2 ${
          isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/80"
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-sm">ATD</div>
            </div>
            <div>
              <div className="text-green-600 font-bold text-lg">ATD FINANCE</div>
              <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>Customer Details</div>
            </div>
          </div>
          <button
            onClick={handleClose}
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
          {/* Compact Main Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Customer Info */}
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
                  { label: "Name", value: data.name || "Bhavikkumar Pravinbhai Patel" },
                  { label: "Mobile No.", value: data.phoneNo || "9892590294" },
                  { label: "CRN NO", value: data.crnNo || "B12AS086" },
                  { label: "Loan No.", value: data.loanNo || "ATDAM35743" },
                  { label: "Due Date", value: data.dueDate || "16-07-2025" },
                  { label: "Overdue Amount", value: data.overdueAmount || "0.00" },
                  { label: "No of Days", value: data.noDays || "0 Days" },
                  { label: "G A/c No.", value: data.gAccountNo || "159892590294" }
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
                <div className="flex justify-between items-center py-2 mt-2 border-t-2 border-dashed border-emerald-300">
                  <span className={`font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Due Amount:
                  </span>
                  <span className="font-bold text-xl text-emerald-600">
                    ₹{data.balance || "38,764"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Details */}
            <div className={`rounded-lg border-2 p-5 ${
              isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
            }`}>
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>Payment Details</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                {[
                  { label: "Disburse Date", value: data.disburseDate || "17-06-2025" },
                  { label: "Sanction Amount", value: `₹${data.sanctionAmount || "38,000"}` },
                  { label: "Disburse Amount", value: `₹${data.disburseAmount || "32,620"}` },
                  { label: "Ledger Amount", value: `₹${data.ledgerAmount || "38,764"}` },
                  { label: "Penal Interest", value: `₹${data.penalInterest || "0.00"}` },
                  { label: "Penalty", value: `₹${data.penalty || "0"}` },
                  { label: "Alternative No.", value: data.alternativeNo || "N/A" },
                  { label: "Ref. Mobile", value: data.refMobile || "N/A" }
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
          </div>

          {/* Compact Call Form */}
          <div className={`rounded-lg border-2 p-5 ${
            isDark ? "border-gray-600 bg-gray-800" : "border-blue-200 bg-white/70"
          }`}>
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="w-5 h-5 text-blue-600" />
              <h3 className={`text-lg font-semibold ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}>Call Details</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-blue-200 text-gray-900 placeholder-gray-500 focus:border-blue-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Enter call remarks..."
                />
              </div>

              <div className="space-y-4">
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
                    className={`w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-blue-200 text-gray-900 focus:border-blue-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-md transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Submit Call
                </button>
              </div>
            </div>
          </div>

          {/* Compact Call History Table */}
          <div className={`rounded-lg border-2 overflow-hidden ${
            isDark ? "border-gray-600" : "border-blue-200"
          }`}>
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <h3 className="font-semibold">Call History</h3>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? "bg-gray-800" : "bg-blue-50"}`}>
                  <tr className="border-b border-gray-400">
                    <th className={`px-4 py-3 text-left text-sm font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>Call Date</th>
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
                  {callHistory.map((call, index) => (
                    <tr key={index} className={`border-b transition-colors hover:${
                      isDark ? "bg-gray-700" : "bg-blue-50"
                    } ${isDark ? "border-gray-700" : "border-blue-100"}`}>
                      <td className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                        {call.date}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                        {call.remark}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                        {call.user}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                        {call.nextCall || "N/A"}
                      </td>
                    </tr>
                  ))}
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