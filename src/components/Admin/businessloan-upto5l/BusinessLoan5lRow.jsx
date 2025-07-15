import React from "react";
import { Calendar } from "lucide-react";

const BusinessLoan5lRow = ({ item, index, isDark ,onFollowUpClick}) => {
  const formatPhone = (phone) => {
    if (!phone || phone === "--") return "--";
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "--";
    return dateStr;
  };

  const formatPAN = (pan) => {
    if (!pan || pan === "--") return "--";
    return pan.toUpperCase();
  };

  const formatAadhar = (aadhar) => {
    if (!aadhar || aadhar === "--") return "--";
    return aadhar.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
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
      <td className="px-3 py-3 text-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
          isDark
            ? "text-white"
            : "text-black"
        }`}>
          {item.sn}
        </div>
      </td>

       {/* Date */}
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-3 h-3 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={`text-sm ${
            isDark ? "text-white" : "text-black"
          }`}>
            {formatDate(item.date)}
          </span>
        </div>
      </td>

      {/* Action */}
      <td className="px-3 py-2">
        <button 
        onClick={() => onFollowUpClick(item)}
        className={`px-3 py-1 rounded-md border cursor-pointer text-xs font-medium transition-colors ${
          isDark
            ? "bg-purple-900/50 text-purple-300  border-purple-800 hover:bg-purple-800/50"
            : "bg-purple-100 text-purple-800 hover:bg-purple-200"
        }`}>
          Follow Up
        </button>
      </td>

      {/* History */}
      <td className="px-3 py-2">
        <button className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          isDark
            ? "bg-blue-900/50 text-blue-300 hover:bg-blue-800/50"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}>
          View
        </button>
      </td>

      {/* City */}
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.city}
          </span>
        </div>
      </td>

      {/* Business Type */}
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.businessType}
          </span>
        </div>
      </td>

      {/* Credit Amount */}
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.creditAmount}
          </span>
        </div>
      </td>

      {/* Industry Margin */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.industryMargin}
        </span>
      </td>

      {/* Cheque Bounce */}
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-2 rounded-full text-xs font-medium ${
            item.chequeBounce === "Yes"
              ? isDark
                ? "bg-red-900/50 text-red-300"
                : "bg-red-100 text-red-800"
              : isDark
                ? "bg-green-900/50 text-green-300"
                : "bg-green-100 text-green-800"
          }`}>
            {item.chequeBounce}
          </span>
        </div>
      </td>

      {/* ITR */}
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.itr === "Yes"
              ? isDark
                ? "bg-green-900/50 text-green-300"
                : "bg-green-100 text-green-800"
              : isDark
                ? "bg-red-900/50 text-red-300"
                : "bg-red-100 text-red-800"
          }`}>
            {item.itr}
          </span>
        </div>
      </td>

      {/* EMI Liability */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.emiLiability}
        </span>
      </td>

      {/* Name */}
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.name}
          </span>
        </div>
      </td>

      {/* DoB */}
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-3 h-3 ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`} />
          <span className={`text-sm ${
            isDark ? "text-white" : "text-black"
          }`}>
            {formatDate(item.dob)}
          </span>
        </div>
      </td>

      {/* Gender */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.gender}
        </span>
      </td>

      {/* Pan No */}
      <td className="px-3 py-2">
        <span className={`text-sm font-mono ${
          isDark ? "text-white" : "text-black"
        }`}>
          {formatPAN(item.panNo)}
        </span>
      </td>

      {/* Aadhar No */}
      <td className="px-3 py-2">
        <span className={`text-sm font-mono ${
          isDark ? "text-white" : "text-black"
        }`}>
          {formatAadhar(item.aadharNo)}
        </span>
      </td>

      {/* Mobile */}
      <td className="px-3 py-2">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-medium ${
            isDark ? "text-white" : "text-black"
          }`}>
            {formatPhone(item.mobile)}
          </span>
        </div>
      </td>

      {/* Residential Ownership */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.residentialOwnership}
        </span>
      </td>

      {/* Residential Address */}
      <td className="px-3 py-2 max-w-xs">
        <div  title={item.residentialAddress}>
          <span className={`text-sm ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.residentialAddress}
          </span>
        </div>
      </td>

      {/* Residential State */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.residentialState}
        </span>
      </td>

      {/* Residential City */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.residentialCity}
        </span>
      </td>

      {/* Residential Pincode */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.residentialPincode}
        </span>
      </td>

      {/* Business Name */}
      <td className="px-3 py-3">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.businessName}
          </span>
        </div>
      </td>

      {/* Business Ownership */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.businessOwnership}
        </span>
      </td>

      {/* Business Address */}
      <td className="px-3 py-2 max-w-xs">
        <div  title={item.businessAddress}>
          <span className={`text-sm ${
            isDark ? "text-white" : "text-black"
          }`}>
            {item.businessAddress}
          </span>
        </div>
      </td>

      {/* Business State */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.businessState}
        </span>
      </td>

      {/* Business City */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.businessCity}
        </span>
      </td>

      {/* Business Pincode */}
      <td className="px-3 py-2">
        <span className={`text-sm ${
          isDark ? "text-white" : "text-black"
        }`}>
          {item.businessPincode}
        </span>
      </td>

     
    </tr>
  );
};

export default BusinessLoan5lRow;