import React from "react";
import { Building } from "lucide-react";
import BankLedgerRow from "./BankLedgerRow";
import Pagination from "../Pagination";

const BankLedgerTable = ({ 
  paginatedEntries,
  entries,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        {/* Table Header */}
        

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-800 to-gray-700 border-emerald-600/50"
                : "bg-gradient-to-r from-gray-50 to-emerald-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`}>
                  Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`}>
                  Particulars
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`}>
                  Debit
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`}>
                  Credit
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`}>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.map((entry, index) => (
                <BankLedgerRow
                  key={entry.id}
                  entry={entry}
                  index={index}
                  isDark={isDark}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedEntries.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <Building className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">
                {entries.length === 0 ? "No ledger entries found" : "Not Available!!!"}
              </p>
              {entries.length === 0 && (
                <p className="text-sm">Try adjusting your search filters</p>
              )}
            </div>
          </div>
        )}
        {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={entries.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
      </div>
      
      
    </>
  );
};

export default BankLedgerTable;