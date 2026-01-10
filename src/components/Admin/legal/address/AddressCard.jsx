"use client";
import React from "react";
import { Calendar, Truck, Package, Clock, AlertCircle, CheckCircle, Edit } from "lucide-react";

const AddressCard = ({ 
  address, 
  isDark, 
  isLoading, 
  handleEditAddress, 
  getStatusColor, 
  getStatusIcon 
}) => {
  return (
    <div
      key={address.address_id}
      className={`p-3.5 rounded border ${
        isDark
          ? "bg-gray-800/30 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-1.5">
          <div className={`p-1 rounded ${
            isDark ? "bg-gray-700/50" : "bg-gray-100"
          }`}>
            {getStatusIcon(address.status)}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded border ${
            getStatusColor(address.status, isDark)
          }`}>
            {address.status}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            isDark
              ? "bg-blue-900/50 text-blue-300 border border-blue-800/50"
              : "bg-blue-100 text-blue-700 border border-blue-300"
          }`}>
            {address.types}
          </span>
        </div>
        <button
          onClick={() => !isLoading && handleEditAddress(address)}
          disabled={isLoading}
          className={`p-1 rounded ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            isDark
              ? "hover:bg-gray-700 text-gray-400"
              : "hover:bg-gray-200 text-gray-600"
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <p className={`text-xs mb-2 ${
        isDark ? "text-gray-300" : "text-gray-700"
      }`}>
        {address.address}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-xs">
        <div className="flex items-center space-x-1.5">
          <Calendar className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
            Posted:
          </span>
          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {address.posted_date?.split('T')[0] || 'N/A'}
          </span>
        </div>
        
        {address.delivered_date && (
          <div className="flex items-center space-x-1.5">
            <Calendar className={`w-3 h-3 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>
              Delivered:
            </span>
            <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              {address.delivered_date?.split('T')[0] || 'N/A'}
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-1.5">
          <Truck className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
            Tracking:
          </span>
          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {address.tracking_no || 'N/A'}
          </span>
        </div>
      </div>
      
      {address.remarks && (
        <div className={`mt-2 p-1.5 rounded text-xs ${
          isDark ? "bg-gray-700/50" : "bg-gray-100"
        }`}>
          <p className={`font-medium mb-0.5 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            Remarks:
          </p>
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            {address.remarks}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressCard;