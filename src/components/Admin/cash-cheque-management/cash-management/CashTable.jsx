import React from "react";
import { CreditCard } from "lucide-react";
import CashRow from "./CashRow";
import Pagination from "../../Pagination";

const CashTable = ({ 
  paginatedDeposits,
  deposits,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onEditDeposit
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-blue-900/20"
          : "bg-white border-emerald-300 shadow-blue-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`}>
                  S.No.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`}>
                  Bank Name
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`}>
                  Deposit Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`}>
                  Amount
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`}>
                  User
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDeposits.map((deposit, index) => (
                <CashRow
                  key={deposit.id}
                  deposit={deposit}
                  index={index}
                  isDark={isDark}
                  onEdit={onEditDeposit}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedDeposits.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <CreditCard className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No cash deposits found</p>
              <p className="text-sm">Start by adding your first deposit</p>
            </div>
          </div>
        )}
        {totalPages > 0 && (
        <div >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={deposits.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
      </div>
      
      
    </>
  );
};

export default CashTable;