import React from "react";
import { Calendar, Phone, Clock } from "lucide-react";

const DownloadedAppRow = ({ item, index, isDark }) => {
  const formatPhone = (phone) => {
    if (!phone || phone === "--") return "--";
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
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
            : "bg-gray-100"
          : ""
      }`}
    >
      {/* SN */}
      <td className="px-4 py-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
          isDark
            ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
        }`}>
          {item.sn}
        </div>
      </td>

      {/* Mobile Number */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <Phone className={`w-4 h-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {formatPhone(item.phone)}
          </span>
        </div>
      </td>

      {/* Download Date */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.downloadDate}
          </span>
        </div>
      </td>

      {/* Download Time */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.downloadTime}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default DownloadedAppRow;