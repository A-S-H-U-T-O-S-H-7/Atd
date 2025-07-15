import React from "react";
import { FileText } from "lucide-react";
import ECollectionRow from "./ECollectionRow";
import Pagination from "../Pagination";

const ECollectionTable = ({ 
  paginatedECollectionData,
  filteredECollectionData,
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "2200px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "50px" }}>
                  SN
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Collection Date
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  CRN No
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "130px" }}>
                  Loan No
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "180px" }}>
                  Name
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Transaction Mode
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Transaction UTR
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Transaction Remarks
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Client A/c No
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "130px" }}>
                  Collection Amount
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Payer Name
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  Payer A/C No
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Payer Bank IFSC
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Bank Transaction No
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedECollectionData.map((item, index) => (
                <ECollectionRow
                  key={item.id}
                  item={item}
                  index={index}
                  isDark={isDark}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedECollectionData.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No e-collection data found</p>
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
            totalItems={filteredECollectionData.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
      </div>

      
    </>
  );
};

export default ECollectionTable;