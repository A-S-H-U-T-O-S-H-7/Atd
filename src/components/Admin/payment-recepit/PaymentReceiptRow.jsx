import React from "react";
import { Calendar, Phone, Mail } from "lucide-react";

const PaymentReceiptRow = ({ payment, index, isDark, onUpdateClick }) => {
  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-emerald-50/50"
      } ${
        index % 2 === 0
          ? isDark ? "bg-gray-700/30" : "bg-gray-50"
          : ""
      }`}
    >
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {payment.srNo}
        </span>
      </td>

      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {payment.date}
          </span>
        </div>
      </td>

      {/* Loan No */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {payment.loanNo}
        </span>
      </td>

      {/* Name */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-3">
          <div>
            <p
              className={`font-medium text-sm ${isDark
                ? "text-gray-100"
                : "text-gray-900"}`}
            >
              {payment.name}
            </p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Mail
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-xs ${isDark
              ? "text-gray-300"
              : "text-gray-600"}`}
          >
            {payment.email}
          </span>
        </div>
      </td>

      {/* Phone */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Phone
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-xs font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-700"}`}
          >
            {payment.phone}
          </span>
        </div>
      </td>

      {/* Outstanding Amount */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-yellow-400"
            : "text-yellow-600"}`}
        >
          ₹{payment.outstandingAmount}
        </span>
      </td>

      {/* Payable Amount */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-blue-400"
            : "text-blue-600"}`}
        >
          ₹{payment.payableAmount}
        </span>
      </td>

      {/* Received Amount */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-semibold ${
            payment.receivedAmount 
              ? isDark ? "text-green-400" : "text-green-600"
              : isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {payment.receivedAmount ? `₹${payment.receivedAmount}` : "-"}
        </span>
      </td>

      {/* Commission */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {payment.commission}
        </span>
      </td>

      {/* Action */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateClick(payment)}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
              ? "bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border border-emerald-600/50"
              : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300"}`}
            title="Update Payment"
          >
            Update
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PaymentReceiptRow;