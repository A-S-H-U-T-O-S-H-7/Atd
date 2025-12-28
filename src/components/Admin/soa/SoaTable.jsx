import React from "react";
import { FileText } from "lucide-react";
import Pagination from "../Pagination";
import SoaRow from "./SoaRow";

const SoaTable = ({ 
  details,           
  allDetails,       
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange
}) => {
  // Table headers configuration
  const tableHeaders = [
    { label: "SN", width: "60px" },
    { label: "Date", width: "140px" },
    { label: "Normal Interest Charged", width: "80px" },
    { label: "Penal Interest Charged", width: "80px" },
    { label: "Penality Charged", width: "80px" },
    { label: "Collection Received", width: "80px" },
    { label: "Principle Adjusted", width: "80px" },
    { label: "Normal Interest Adjusted", width: "80px" },
    { label: "Penal Interest Adjusted", width: "80px" },
    { label: "Penalty Adjusted", width: "80px" },
    { label: "Principle After Adjusted", width: "80px" },
    { label: "Normal Interest After Adjusted", width: "80px" },
    { label: "Penal Interest After Adjusted", width: "80px" },
    { label: "Penalty After Adjusted", width: "80px" },
    { label: "Total Outstanding Amount", width: "80px" }
  ];

  const headerStyle = `px-2 py-4 text-left text-xs font-bold uppercase tracking-wider border-r ${
    isDark ? "text-gray-100 border-gray-600" : "text-gray-700 border-gray-300"
  }`;

  return (
    <div className={`rounded-2xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-max" style={{ minWidth: "1000px" }}>
          <thead className={`border-b-2 ${
            isDark
              ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
              : "bg-gradient-to-r from-emerald-50 to-indigo-50 border-emerald-300"
          }`}>
            <tr>
              {tableHeaders.map((header, index) => (
                <th 
                  key={index}
                  className={headerStyle}
                  style={{ minWidth: header.width }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <SoaRow
                key={`${item.id}-${currentPage}-${index}`}
                item={item}
                index={index}
                isDark={isDark}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Empty State */}
      {allDetails.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <FileText className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">No transaction data found</p>
            <p className="text-sm">No transactions available for this account</p>
          </div>
        </div>
      ) : (
        /* Pagination Component */
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={allDetails.length}
          itemsPerPage={itemsPerPage}
          className={isDark ? "border-gray-700" : "border-gray-200"}
        />
      )}
    </div>
  );
};

export default SoaTable;