import React from "react";
import { Phone, Mail, User, Eye } from "lucide-react";

const ClientHistoryRow = ({ item, index, isDark, onViewClick }) => {
  const formatPhone = (phone) => {
    if (!phone || phone === "--") return "--";
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  const formatEmail = (email) => {
    if (!email || email === "--") return "--";
    return email.length > 30 ? email.substring(0, 30) + "..." : email;
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
      <td className={`px-4 py-4 text-center border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
          isDark
            ? "bg-emerald-600/20 text-emerald-400"
            : "bg-emerald-100 text-emerald-600"
        }`}>
          {item.sn}
        </div>
      </td>

      {/* Name */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-3">
          <div>
            <span className={`text-sm font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {item.name}
            </span>
          </div>
        </div>
      </td>

      {/* Loan No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-mono ${
          isDark ? "text-emerald-400" : "text-emerald-600"
        }`}>
          {item.loanNo}
        </span>
      </td>

      {/* Father Name */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}>
          {item.fatherName}
        </span>
      </td>

      {/* CRN No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-mono px-2 py-1 rounded ${
          isDark 
            ? "bg-purple-600/20 text-purple-400" 
            : "bg-purple-100 text-purple-600"
        }`}>
          {item.crnNo}
        </span>
      </td>

      {/* Account ID */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-mono ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}>
          {item.accountId}
        </span>
      </td>

      {/* Phone */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {formatPhone(item.phone)}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Mail className={`w-4 h-4 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`text-sm ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`} title={item.email}>
            {formatEmail(item.email)}
          </span>
        </div>
      </td>

      {/* View Button */}
      <td className="px-4 py-4 text-center">
        <button
          onClick={() => onViewClick(item)}
          className={`inline-flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
          } shadow-lg hover:shadow-xl`}
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
      </td>
    </tr>
  );
};

export default ClientHistoryRow;