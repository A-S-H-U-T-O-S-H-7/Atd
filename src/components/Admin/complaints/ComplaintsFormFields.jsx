"use client";
import React from "react";
import {
  AlertCircle,
  User,
  Phone,
  Mail,
  CreditCard,
  Building
} from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";


const ComplaintFormFields = ({
    isDark,
  complaintDate,
  setComplaintDate,
  customerName,
  setCustomerName,
  mobileNo,
  setMobileNo,
  email,
  setEmail,
  loanAcNo,
  setLoanAcNo,
  loanProvider,
  setLoanProvider
}) => {

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Complaint Date */}
      <div>
        <label
          className={`flex items-center space-x-2 text-xs font-bold mb-1 ${isDark
            ? "text-gray-100"
            : "text-gray-700"}`}
        >
          <div
            className={`p-1.5 rounded-md ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <AlertCircle
              className={`w-3 h-3 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <span>Complaint Date</span>
        </label>
        <input
          type="date"
          value={complaintDate}
          onChange={e => setComplaintDate(e.target.value)}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${isDark
            ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
      </div>

      {/* Customer Name */}
      <div>
        <label
          className={`flex items-center space-x-3 text-xs font-bold mb-1 ${isDark
            ? "text-gray-100"
            : "text-gray-700"}`}
        >
          <div
            className={`p-1.5 rounded-md ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <User
              className={`w-3 h-3 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <span>Customer Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${isDark
            ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
      </div>

      {/* Mobile Number */}
      <div>
        <label
          className={`flex items-center space-x-3 text-xs font-bold mb-1 ${isDark
            ? "text-gray-100"
            : "text-gray-700"}`}
        >
          <div
            className={`p-1.5 rounded-md ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <Phone
              className={`w-3 h-3 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <span>Mobile No.</span>
        </label>
        <input
          type="tel"
          placeholder="Enter mobile number"
          value={mobileNo}
          onChange={e => setMobileNo(e.target.value)}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${isDark
            ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
      </div>

      {/* Email */}
      <div>
        <label
          className={`flex items-center space-x-3 text-xs font-bold mb-1 ${isDark
            ? "text-gray-100"
            : "text-gray-700"}`}
        >
          <div
            className={`p-1.5 rounded-md ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <Mail
              className={`w-3 h-3 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <span>Email</span>
        </label>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${isDark
            ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
      </div>

      {/* Loan A/C No. */}
      <div>
        <label
          className={`flex items-center space-x-3 text-xs font-bold mb-1 ${isDark
            ? "text-gray-100"
            : "text-gray-700"}`}
        >
          <div
            className={`p-1.5 rounded-md ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <CreditCard
              className={`w-3 h-3 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <span>Loan A/C No.</span>
        </label>
        <input
          type="text"
          placeholder="Enter loan account number"
          value={loanAcNo}
          onChange={e => setLoanAcNo(e.target.value)}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${isDark
            ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
      </div>

      {/* Loan Provider */}
      <div>
        <label
          className={`flex items-center space-x-3 text-xs font-bold mb-1 ${isDark
            ? "text-gray-100"
            : "text-gray-700"}`}
        >
          <div
            className={`p-1.5 rounded-md ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <Building
              className={`w-3 h-3 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <span>Loan Belong To</span>
        </label>
        <select
          value={loanProvider}
          onChange={e => setLoanProvider(e.target.value)}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${isDark
            ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        >
          <option value="">Select Loan Provider</option>
          <option value="AtdMoney">ATD Money</option>
          <option value="MyLoanBazr">My Loan Bazar</option>
          <option value="nbfc1">Others</option>
        </select>
      </div>
    </div>
  );
};

export default ComplaintFormFields;
