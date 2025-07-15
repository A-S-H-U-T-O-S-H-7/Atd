import React from "react";
import { Users } from "lucide-react";
import ClientHistoryRow from "./ClientHistoryRow";
import Pagination from "../Pagination";

const ClientHistoryTable = ({ 
  paginatedClientData,
  filteredClientData,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onViewClick
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "1000px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "60px" }}>
                  SN
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "180px" }}>
                  Name
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "130px" }}>
                  Loan No
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "180px" }}>
                  Father Name
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  CRN No
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "180px" }}>
                  Account ID
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "130px" }}>
                  Phone
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "220px" }}>
                  Email
                </th>
                <th className={`px-4 py-4 text-center text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedClientData.map((item, index) => (
                <ClientHistoryRow
                  key={item.id}
                  item={item}
                  index={index}
                  isDark={isDark}
                  onViewClick={onViewClick}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedClientData.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <Users className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No client history found</p>
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
            totalItems={filteredClientData.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
      </div>

      
    </>
  );
};

export default ClientHistoryTable;