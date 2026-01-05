import React from "react";
import {
  Phone,
  Mail,
  CreditCard
} from "lucide-react";
import CallButton from "../call/CallButton";
import { useRouter } from "next/navigation";

const OverdueApplicantListRow = ({
  applicant,
  index,
  isDark,
  onAdjustment,
  onRenew,
  onSendNotice,
  onOverdueAmountClick,
  onView,
  onChargeICICI,
  onSREAssign
}) => {
  const router = useRouter();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${isDark
        ? "border-emerald-700 hover:bg-gray-700/50"
        : "border-emerald-300 hover:bg-emerald-50/50"} ${index % 2 === 0
        ? isDark ? "bg-gray-700/30" : "bg-gray-50"
        : ""}`}
    >
      {/* SN */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-medium ${isDark
            ? "text-gray-100"
            : "text-gray-900"}`}
        >
          {applicant.srNo}
        </span>
      </td>

      {/* Call */}
      <td className={`text-md px-2 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
  <CallButton
    applicant={applicant}
    isDark={isDark}
    size="small"
    variant="default"
    className="px-2 py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105"
  />
</td>

      {/* Loan No */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
  <button
    onClick={() => {
      if (applicant.dueDate && applicant.dueDate !== 'N/A' && applicant.dueDate !== null ) {
        router.push(`/crm/statement-of-account?id=${applicant.application_id}`);
      }
    }}
    className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
      applicant.dueDate && applicant.dueDate !== 'N/A'
        ? 'underline cursor-pointer'
        : 'no-underline cursor-default'
    } ${
      applicant.dueDate && applicant.dueDate !== 'N/A'
        ? (isDark
            ? "text-emerald-400 hover:text-emerald-300"
            : "text-emerald-600 hover:text-emerald-800")
        : (isDark
            ? "text-gray-400"
            : "text-gray-500")
    }`}
    disabled={!(applicant.dueDate && applicant.dueDate !== 'N/A')}
  >
    <CreditCard className="w-4 h-4" />
    <span className="font-semibold">
      {applicant.loanNo}
    </span>
  </button>
</td>

      {/* Due Date */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-800"}`}
          >
            {applicant.dueDate}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-3">
          <p
            className={`font-medium text-sm ${isDark
              ? "text-gray-100"
              : "text-gray-900"}`}
          >
            {applicant.name}
          </p>
        </div>
      </td>

      {/* Phone No */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-700"}`}
          >
            {applicant.phoneNo}
          </span>
        </div>
      </td>

      {/* E-mail */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Mail
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-sm ${isDark
              ? "text-gray-300"
              : "text-gray-600"}`}
          >
            {applicant.email}
          </span>
        </div>
      </td>

      {/* Adjustment */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <button
          onClick={() => onAdjustment(applicant)}
          className={`px-3 py-1 cursor-pointer rounded-lg font-medium transition-all duration-200 text-sm ${
            isDark
              ? "bg-pink-900/50 hover:bg-pink-800 text-pink-300 border border-pink-700"
              : "bg-pink-100 hover:bg-pink-200 text-pink-700 border border-pink-200"
          }`}
        >
          Adjustment
        </button>
      </td>

      {/* Balance */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm font-bold ${isDark
              ? "text-gray-100"
              : "text-gray-900"}`}
          >
            {formatCurrency(applicant.balance)}
          </span>
        </div>
      </td>

      {/* Overdue Amt */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        {(() => {
          const today = new Date();
          
          const dateParts = applicant.dueDate.split('-');
          const formattedDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
          const dueDate = new Date(formattedDate);
          
          const daysDiff = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
          
          if (daysDiff >= 0 && daysDiff <= 3) {
            return (
              <button
                onClick={() => onRenew(applicant)}
                className={`px-3 py-1 rounded-lg font-bold transition-all duration-200 text-sm ${
                  isDark
                    ? " text-green-500 "
                    : " text-green-500"
                }`}
              >
                Renew
              </button>
            );
          }
          else {
            return (
              <button
                onClick={() => onOverdueAmountClick(applicant)}
                className={`px-2 py-1 rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 hover:opacity-80 ${
                  applicant.overdueAmt > applicant.balance
                    ? isDark
                      ? "bg-red-900/50 text-red-300 hover:bg-red-800"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                    : isDark
                    ? "bg-orange-900/50 text-orange-300 hover:bg-orange-800"
                    : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                    }`}
              >
                {formatCurrency(applicant.overdueAmt)}
              </button>
            );
          }
        })()}
      </td>

      {/* View */}
      <td className={`px-2 py-4 text-center border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <button
          onClick={() => onView(applicant)}
          className={`px-3 py-1 cursor-pointer rounded-md font-medium transition-all duration-200 text-sm ${
            isDark
              ? "bg-gradient-to-r from-purple-300 to-purple-400 hover:bg-purple-800 text-purple-900 border border-purple-700"
              : "bg-gradient-to-r from-purple-200 to-purple-300 hover:bg-purple-200 text-purple-700 border border-purple-200"
          }`}
        >
          View
        </button>
      </td>

      {/* Charge Amount */}
      <td className={`px-2 py-4 text-center border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <button
          onClick={() => onChargeICICI(applicant)}
          className={`px-3 py-1 cursor-pointer rounded-md font-medium transition-all duration-200 text-sm ${
            isDark
              ? "bg-gradient-to-r from-indigo-300 to-indigo-400 hover:bg-indigo-800 text-indigo-900 border border-indigo-700"
              : "bg-gradient-to-r from-indigo-200 to-indigo-300 hover:bg-indigo-200 text-indigo-700 border border-indigo-200"
          }`}
        >
          Schedule
        </button>
      </td>

      {/* SRE Assign */}
      <td className={`px-2 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <button
          onClick={() => onSREAssign(applicant)}
          className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 text-sm ${
            isDark
              ? "bg-teal-900/50 hover:bg-teal-800 text-teal-300 border border-teal-700"
              : "bg-teal-100 hover:bg-teal-200 text-teal-700 border border-teal-200"
          }`}
        >
          SRE Assign
        </button>
      </td>

      {/* SRE Assign Date */}
      <td className="px-2 py-4">
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-700"}`}
          >
            {applicant.sreAssignDate || 'N/A'}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default OverdueApplicantListRow;