import React, { useState } from "react";
import { X, Calendar, MessageSquare, Building2, Phone, CreditCard } from "lucide-react";

const BusinessCallModal = ({ isOpen, onClose, customerData, isDark }) => {
  const [nextCallDate, setNextCallDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [callHistory, setCallHistory] = useState([
    { date: "2024-01-15", remark: "Customer interested, requested more details", user: "Admin", nextCall: "2024-01-20" },
    { date: "2024-01-10", remark: "Initial contact made", user: "Sales", nextCall: "2024-01-15" }
  ]);

  const handleSubmit = () => {
    if (nextCallDate && remarks) {
      const newCall = {
        date: new Date().toISOString().split('T')[0],
        remark: remarks,
        user: "Admin",
        nextCall: nextCallDate
      };
      setCallHistory([newCall, ...callHistory]);
      setNextCallDate("");
      setRemarks("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl ${
        isDark ? "bg-gray-800 border border-emerald-600/30" : "bg-white border border-emerald-200"
      }`}>
        {/* Header */}
        <div className={`px-6 py-3 border-b ${
          isDark ? "border-emerald-600/30 bg-gradient-to-r from-gray-900 to-gray-800" : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-emerald-600/20" : "bg-emerald-100"
              }`}>
                <Building2 className={`w-4 h-4 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </div>
              <h2 className={`text-lg font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Follow Up - Business Loan Enquiry
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Customer Info Section */}
        <div className={`px-6 py-3 border-b ${
          isDark ? "border-emerald-600/30" : "border-emerald-200"
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-2 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-emerald-50/50"
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isDark ? "bg-emerald-600/20" : "bg-emerald-100"
                }`}>
                  <span className={`text-xs font-bold ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    {customerData?.name?.charAt(0)?.toUpperCase() || "N"}
                  </span>
                </div>
                <span className={`text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Name</span>
              </div>
              <p className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {customerData?.name || "N/A"}
              </p>
            </div>

            <div className={`p-2 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-emerald-50/50"
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                <Phone className={`w-3 h-3 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`} />
                <span className={`text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Mobile</span>
              </div>
              <p className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {customerData?.mobile || "N/A"}
              </p>
            </div>

            <div className={`p-2 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-emerald-50/50"
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                <Building2 className={`w-3 h-3 ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`} />
                <span className={`text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Business</span>
              </div>
              <p className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {customerData?.businessName || "N/A"}
              </p>
            </div>

            <div className={`p-2 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-emerald-50/50"
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                <CreditCard className={`w-3 h-3 ${
                  isDark ? "text-green-400" : "text-green-600"
                }`} />
                <span className={`text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Amount</span>
              </div>
              <p className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {customerData?.creditAmount || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-6 py-3 border rounded-md border-emerald-400">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Next Call Date
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-2.5 w-4 h-4 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`} />
                <input
                  type="date"
                  value={nextCallDate}
                  onChange={(e) => setNextCallDate(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm transition-colors ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                  } focus:outline-none`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Remarks
              </label>
              <div className="relative">
                <MessageSquare className={`absolute left-3 top-2.5 w-4 h-4 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`} />
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter your remarks here..."
                  rows="2"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm transition-colors resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                  } focus:outline-none`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!nextCallDate || !remarks}
              className={`px-6 py-2 rounded-lg font-semibold transition-all text-sm ${
                (!nextCallDate || !remarks)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Call History Section */}
        <div className={`px-6 py-3 border-t ${
          isDark ? "border-emerald-600/30" : "border-emerald-200"
        }`}>
          <h3 className={`text-md font-semibold mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Call History
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full rounded-md overflow-hidden text-sm">
              <thead className="bg-red-600   rounded-2xl overflow-hidden ">
                <tr className={`${
                  isDark ? "bg-gray-700/50" : "bg-emerald-50"
                }`}>
                  <th className={`px-3 py-2 text-left text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>Call Date</th>
                  <th className={`px-3 py-2 text-left text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>Remark</th>
                  <th className={`px-3 py-2 text-left text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>User</th>
                  <th className={`px-3 py-2 text-left text-xs font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>Next Call Date</th>
                </tr>
              </thead>
              <tbody>
                {callHistory.map((call, index) => (
                  <tr key={index} className={`border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}>
                    <td className={`px-3 py-2 text-xs ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>{call.date}</td>
                    <td className={`px-3 py-2 text-xs ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>{call.remark}</td>
                    <td className={`px-3 py-2 text-xs ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>{call.user}</td>
                    <td className={`px-3 py-2 text-xs ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>{call.nextCall}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCallModal;