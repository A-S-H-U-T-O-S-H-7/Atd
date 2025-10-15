import React from "react";
import { Calendar, CreditCard, User, Building2, DollarSign, Clock, CheckCircle } from "lucide-react";

const ECollectionRow = ({ item, index, isDark }) => {
  const getTransactionModeIcon = (mode) => {
    switch (mode) {
      case 'UPI':
        return <CreditCard className="w-4 h-4" />;
      case 'IMPS':
        return <Clock className="w-4 h-4" />;
      case 'NEFT':
        return <Building2 className="w-4 h-4" />;
      case 'RTGS':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getTransactionModeColor = (mode) => {
    switch (mode) {
      case 'UPI':
        return isDark
          ? "bg-purple-900/50 text-purple-300 border-purple-700"
          : "bg-purple-100 text-purple-800 border-purple-200";
      case 'IMPS':
        return isDark
          ? "bg-blue-900/50 text-blue-300 border-blue-700"
          : "bg-blue-100 text-blue-800 border-blue-200";
      case 'NEFT':
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case 'RTGS':
        return isDark
          ? "bg-orange-900/50 text-orange-300 border-orange-700"
          : "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return isDark
          ? "bg-gray-900/50 text-gray-300 border-gray-700"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'updated':
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case 'pending':
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'failed':
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      default:
        return isDark
          ? "bg-gray-900/50 text-gray-300 border-gray-700"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-emerald-50/50"
      } ${
        index % 2 === 0
          ? isDark 
            ? "bg-gray-700/50" 
            : "bg-gray-50"
          : ""
      }`}
    >
      {/* SN */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
          isDark
            ? "text-white"
            : "text-black"
        }`}>
          {item.sn}
        </div>
      </td>

      {/* Collection Date */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.collectionDate}
          </span>
        </div>
      </td>

      {/* CRN No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-medium ${
          isDark ? "text-blue-400" : "text-blue-600"
        }`}>
          {item.crnNo}
        </span>
      </td>

      {/* Loan No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-semibold ${
          isDark ? "text-emerald-400" : "text-emerald-600"
        }`}>
          {item.loanNo}
        </span>
      </td>

      {/* Name */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.name}
          </span>
        </div>
      </td>

      {/* Transaction Mode */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
          getTransactionModeColor(item.transactionMode)
        }`}>
          {getTransactionModeIcon(item.transactionMode)}
          <span className="ml-1">{item.transactionMode}</span>
        </div>
      </td>

      {/* Transaction UTR */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <CreditCard className={`w-4 h-4 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`} />
          <span className={`text-sm font-mono ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.transactionUTR}
          </span>
        </div>
      </td>

      {/* Transaction Remarks */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}>
          {item.transactionRemarks}
        </span>
      </td>

      {/* Client A/c No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-mono ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          {item.clientAcNo}
        </span>
      </td>

      {/* Collection Amount */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-bold ${
          isDark ? "text-green-400" : "text-green-600"
        }`}>
          ₹{item.collectionAmount.toLocaleString()}
        </span>
      </td>

      {/* Payer Name */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.payerName}
          </span>
        </div>
      </td>

      {/* Payer A/C No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-mono ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          {item.payerAcNo}
        </span>
      </td>

      {/* Payer Bank IFSC */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Building2 className={`w-4 h-4 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`} />
          <span className={`text-sm font-mono ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.payerBankIFSC}
          </span>
        </div>
      </td>

      {/* Bank Transaction No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-mono ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          {item.bankTransactionNo}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${
          getStatusColor(item.status)
        }`}>
          {item.status.toLowerCase() === 'updated' && (
            <CheckCircle className="w-3 h-3 mr-1" />
          )}
          <span className="capitalize">{item.status}</span>
        </div>
      </td>
    </tr>
  );
};

export default ECollectionRow;