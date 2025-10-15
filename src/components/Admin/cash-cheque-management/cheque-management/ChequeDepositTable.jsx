import React from "react";
import { Landmark } from "lucide-react";
import ChequeDepositRow from "./ChequeDepositRow";
import Pagination from "../../Pagination";

const ChequeDepositTable = ({ 
  paginatedDeposits,
  filteredDeposits,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onEditClick
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "1200px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "120px" }}>
                  Sr No
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "120px" }}>
                  Loan No
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"

                }`} style={{ minWidth: "120px" }}>
                  Cheque No
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"

                }`} style={{ minWidth: "150px" }}>
                  Bank Name
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"

                }`} style={{ minWidth: "140px" }}>
                  Deposit Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"

                }`} style={{ minWidth: "120px" }}>
                  Amount
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"

                }`} style={{ minWidth: "100px" }}>
                  User
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"

                }`} style={{ minWidth: "120px" }}>
                  Status
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"

                }`} style={{ minWidth: "100px" }}>
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDeposits.map((deposit, index) => (
                <ChequeDepositRow
                  key={deposit.id}
                  deposit={deposit}
                  index={index}
                  isDark={isDark}
                  onEditClick={onEditClick}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedDeposits.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <Landmark className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No deposits found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
        {/* Pagination */}
      {totalPages > 0 && (
        <div >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={filteredDeposits.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
      </div>

      
    </>
  );
};

export default ChequeDepositTable;