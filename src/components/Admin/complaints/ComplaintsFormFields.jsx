"use client";
import React from "react";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  Building,
  Calendar,
  Search,
  Loader2
} from "lucide-react";

const ComplaintFormFields = ({
  isDark,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  isSearching
}) => {

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Loan A/C No. - First Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            className={`flex items-center space-x-3 text-xs font-bold ${
              isDark ? "text-gray-100" : "text-gray-700"
            }`}
          >
            <div
              className={`p-1.5 rounded-md ${
                isDark ? "bg-emerald-900/50" : "bg-emerald-100"
              }`}
            >
              <CreditCard
                className={`w-3 h-3 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </div>
            <span>Loan A/C No. *</span>
          </label>
          {isSearching && (
            <div className="flex items-center space-x-1">
              <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
              <span className="text-xs text-emerald-500">Searching...</span>
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            name="loanAcNo"
            placeholder="Enter loan account number"
            value={values.loanAcNo || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none pl-10`}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>
        {errors.loanAcNo && touched.loanAcNo && (
          <p className="mt-1 text-xs text-red-500">{errors.loanAcNo}</p>
        )}
        <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Enter loan number to auto-fill customer details
        </p>
      </div>

      {/* Complaint Date */}
      <div>
        <label
          className={`flex items-center space-x-2 text-xs font-bold mb-1 ${
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          <div
            className={`p-1.5 rounded-md ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <Calendar
              className={`w-3 h-3 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <span>Complaint Date *</span>
        </label>
        <input
          type="date"
          name="complaintDate"
          value={values.complaintDate || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
              : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
          } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
        {errors.complaintDate && touched.complaintDate && (
          <p className="mt-1 text-xs text-red-500">{errors.complaintDate}</p>
        )}
      </div>

      {/* Customer Name */}
      <div>
        <label
          className={`flex items-center space-x-3 text-xs font-bold mb-1 ${
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          <div
            className={`p-1.5 rounded-md ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <User
              className={`w-3 h-3 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <span>Customer Name *</span>
        </label>
        <input
          type="text"
          name="customerName"
          placeholder="Enter customer name"
          value={values.customerName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
              : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
          } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
        {errors.customerName && touched.customerName && (
          <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>
        )}
      </div>

      {/* Mobile Number */}
      <div>
        <label
          className={`flex items-center space-x-3 text-xs font-bold mb-1 ${
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          <div
            className={`p-1.5 rounded-md ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <Phone
              className={`w-3 h-3 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <span>Mobile No. *</span>
        </label>
        <input
          type="tel"
          name="mobileNo"
          placeholder="Enter mobile number"
          value={values.mobileNo || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
              : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
          } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
        {errors.mobileNo && touched.mobileNo && (
          <p className="mt-1 text-xs text-red-500">{errors.mobileNo}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          className={`flex items-center space-x-3 text-xs font-bold mb-1 ${
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          <div
            className={`p-1.5 rounded-md ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <Mail
              className={`w-3 h-3 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <span>Email *</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          value={values.email || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
              : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
          } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
        {errors.email && touched.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Loan Provider */}
      <div>
        <label
          className={`flex items-center space-x-3 text-xs font-bold mb-1 ${
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          <div
            className={`p-1.5 rounded-md ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <Building
              className={`w-3 h-3 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <span>Loan Belongs To *</span>
        </label>
        <select
          name="loanProvider"
          value={values.loanProvider || 'AtdMoney'}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
              : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
          } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        >
          <option value="AtdMoney">ATD Money</option>
          <option value="MyLoanBazr">My Loan Bazar</option>
          <option value="Others">Others</option>
        </select>
        {errors.loanProvider && touched.loanProvider && (
          <p className="mt-1 text-xs text-red-500">{errors.loanProvider}</p>
        )}
      </div>
    </div>
  );
};

export default ComplaintFormFields;