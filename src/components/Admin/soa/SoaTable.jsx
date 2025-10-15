import React from "react";
import { FileText } from "lucide-react";
import SoaRow from "./SoaRow";

const SoaTable = ({ transactionData, isDark }) => {
  return (
    <div className={`rounded-2xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      

      <div className="overflow-x-auto">
        <table className="w-full min-w-max" style={{ minWidth: "1400px" }}>
          <thead className={`border-b-2 ${
            isDark
              ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
              : "bg-gradient-to-r from-emerald-50 to-indigo-50 border-emerald-300"
          }`}>
            <tr>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "60px" }}>
                SN
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "150px" }}>
                Particular
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "150px" }}>
                Date
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "130px" }}>
                Principal Amount
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "100px" }}>
                Interest
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "120px" }}>
                Due Amount
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "130px" }}>
                Receipt Amount
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "100px" }}>
                Penalty
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "120px" }}>
                Penal Interest
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "110px" }}>
                Penal GST
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "120px" }}>
                Bounce Charge
              </th>
              <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "120px" }}>
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((item, index) => (
              <SoaRow
                key={item.id}
                item={item}
                index={index}
                isDark={isDark}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Empty State */}
      {transactionData.length === 0 && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <FileText className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">No transaction data found</p>
            <p className="text-sm">No transactions available for this account</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoaTable;