import React from "react";
import { Calendar, Mail, Phone, MapPin, Smartphone, User } from "lucide-react";

const RegisteredAppRow = ({ item, index, isDark }) => {
  const getStatusColor = (status) => {
    if (status === "--" || !status) {
      return isDark
        ? "bg-gray-700 text-gray-400 border-gray-600"
        : "bg-gray-100 text-gray-500 border-gray-300";
    }
    
    switch (status.toLowerCase()) {
      case 'active':
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case 'inactive':
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      default:
        return isDark
          ? "bg-gray-700 text-gray-400 border-gray-600"
          : "bg-gray-100 text-gray-500 border-gray-300";
    }
  };

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

      {/* Name */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <Mail className={`w-4 h-4 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-blue-400" : "text-blue-600"
          } hover:underline cursor-pointer`}>
            {item.email}
          </span>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {formatPhone(item.phone)}
          </span>
        </div>
      </td>

      {/* Location */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.location}
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

      {/* Active/Inactive */}
      <td className="px-4 py-3">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
          getStatusColor(item.activeInactive)
        }`}>
          {item.activeInactive}
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}>
          {item.date}
        </span>
      </td>
    </tr>
  );
};

export default RegisteredAppRow;