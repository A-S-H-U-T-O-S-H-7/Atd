import React from "react";
import { Users } from "lucide-react";
import OverdueApplicantRow from "./OverdueApplicantListRow";

const OverdueApplicantListTable = ({
  paginatedApplicants,
  isDark,
  loading,
  onAdjustment,
  onRenew,
  onSendNotice,
  onOverdueAmountClick,
  onView,
  onChargeICICI,
  onSREAssign,
}) => {
  return (
    <div
      className={`rounded-2xl shadow-2xl border-2 overflow-hidden relative ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}
    >
      {/* ── Loading overlay — shown on top of existing table rows during refetch ── */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-2xl">
          <div
            className={`flex flex-col items-center gap-3 px-8 py-5 rounded-xl shadow-xl ${
              isDark ? "bg-gray-800 border border-emerald-700/50" : "bg-white border border-emerald-200"
            }`}
          >
            <svg
              className={`w-9 h-9 animate-spin ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <p
              className={`text-sm font-semibold ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading applicants...
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-max" style={{ minWidth: "1400px" }}>
          <thead
            className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}
          >
            <tr>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "80px" }}
              >
                SN
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "100px" }}
              >
                Call
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "140px" }}
              >
                Loan No.
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "120px" }}
              >
                Due Date
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "150px" }}
              >
                Name
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "140px" }}
              >
                Phone No.
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "200px" }}
              >
                E-mail
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "120px" }}
              >
                Adjustment
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "120px" }}
              >
                Balance
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "110px" }}
              >
                Overdue Amt.
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "90px" }}
              >
                View
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "120px" }}
              >
                E-Nach
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold border-r ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "150px" }}
              >
                Agency Assign
              </th>
              <th
                className={`px-6 py-5 text-center text-sm font-bold ${
                  isDark
                    ? "text-gray-100 border-gray-600/80"
                    : "text-gray-700 border-gray-300/80"
                }`}
                style={{ minWidth: "150px" }}
              >
                Agency Assign Date
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplicants.map((applicant, index) => (
              <OverdueApplicantRow
                key={applicant.id || index}
                applicant={applicant}
                index={index}
                isDark={isDark}
                onAdjustment={onAdjustment}
                onRenew={onRenew}
                onSendNotice={onSendNotice}
                onOverdueAmountClick={onOverdueAmountClick}
                onView={onView}
                onChargeICICI={onChargeICICI}
                onSREAssign={onSREAssign}
              />
            ))}
          </tbody>
        </table>
      </div>

      {paginatedApplicants.length === 0 && !loading && (
        <div
          className={`text-center py-12 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <Users className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">No overdue applicants found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverdueApplicantListTable;