import React from "react";
import { FileText } from "lucide-react";
import LedgerRow from "./LedgerRow";
import Pagination from "../Pagination";

const LedgerTable = ({ 
  paginatedLedgerData,
  filteredLedgerData,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onCall,
  onViewTransaction,
  onAdjustment 
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
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "60px" }}>
                  SN
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  Call
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "130px" }}>
                  Loan No.
                </th>
                
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "160px" }}>
                  Due Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "210px" }}>
                  Name
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "300px" }}>
                  Address
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "130px" }}>
                  Phone No.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "220px" }}>
                  E-mail
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "220px" }}>
                  EMI
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "220px" }}>
                  Adjustment
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Balance
                </th> 
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "220px" }}>
                  Overdue Amnt.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "220px" }}>
                  Settled
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLedgerData.map((item, index) => (
                <LedgerRow
                  key={item.id}
                  item={item}
                  index={index}
                  isDark={isDark}
                  onCall={onCall}
                  onViewTransaction={onViewTransaction}
                  onAdjustment={onAdjustment}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedLedgerData.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No ledger data found</p>
              <p className="text-sm">Try adjusting your search criteria or filters</p>
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
            totalItems={filteredLedgerData.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
      </div>

      
    </>
  );
};

export default LedgerTable;