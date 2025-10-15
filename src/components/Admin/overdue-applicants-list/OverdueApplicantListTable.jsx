import React from "react";
import { Users } from "lucide-react";
import OverdueApplicantRow from "./OverdueApplicantListRow";
import Pagination from "../Pagination";

const OverdueApplicantListTable = ({ 
  paginatedApplicants,
  filteredApplicants,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onCall,
  onAdjustment,
  onRenew,
  onSendNotice,
  onOverdueAmountClick,
  onView,
  onChargeICICI,
  onSREAssign
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "1400px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "80px" }}>
                  SN
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "100px" }}>
                  Call
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "140px" }}>
                  Loan No.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "160px" }}>
                  Due Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "200px" }}>
                  Name
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "140px" }}>
                  Phone No.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "200px" }}>
                  E-mail
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "120px" }}>
                  Adjustment
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "120px" }}>
                  Balance
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "140px" }}>
                  Overdue Amt.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "140px" }}>
                  View
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "170px" }}>
                  Charge Amount
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "150px" }}>
                  SRE Assign
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "150px" }}>
                  SRE Assign Date
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplicants.map((applicant, index) => (
                <OverdueApplicantRow
                  key={applicant.id}
                  applicant={applicant}
                  index={index}
                  isDark={isDark}
                  onCall={onCall}
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
        
        {/* Empty State */}
        {paginatedApplicants.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <Users className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No overdue applicants found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
        
        {totalPages > 0 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={filteredApplicants.length}  
              itemsPerPage={itemsPerPage}   
            />
          </div>
        )}
      </div>
    </>
  );
};

export default OverdueApplicantListTable;