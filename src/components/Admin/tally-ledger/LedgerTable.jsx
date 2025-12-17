"use client";
import React from "react";
import { FileText } from "lucide-react";
import Pagination from "../Pagination";
import LedgerRow from "./LedgerRow";

const LedgerTable = ({ 
  paginatedLedgerData,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onViewTransaction,
  onDownloadPDF,
  loading,
  totalItems
}) => {
  const headerStyle = `px-2 py-4 text-center text-sm font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
  }`;

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
                <th className={headerStyle} style={{ minWidth: "60px" }}>
                  SN
                </th>
                <th className={headerStyle} style={{ minWidth: "80px" }}>
                  Call
                </th>
                <th className={headerStyle} style={{ minWidth: "130px" }}>
                  Loan No.
                </th>
                <th className={headerStyle} style={{ minWidth: "150px" }}>
                  Disburse Date
                </th>
                <th className={headerStyle} style={{ minWidth: "160px" }}>
                  Due Date
                </th>
                <th className={headerStyle} style={{ minWidth: "200px" }}>
                  Name
                </th>
                <th className={headerStyle} style={{ minWidth: "300px" }}>
                  Address
                </th>
                <th className={headerStyle} style={{ minWidth: "100px" }}>
                  Phone No.
                </th>
                <th className={headerStyle} style={{ minWidth: "220px" }}>
                  E-mail
                </th>
                <th className={headerStyle} style={{ minWidth: "80px" }}>
                  Balance
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLedgerData.map((item, index) => (
                <LedgerRow
                  key={item.application_id || item.id}
                  item={item}
                  index={index}
                  isDark={isDark}
                  onViewTransaction={onViewTransaction}
                  onDownloadPDF={(appId, action) => onDownloadPDF(appId, action, item)}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {paginatedLedgerData.length === 0 && !loading && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No tally ledger data found</p>
              <p className="text-sm">Try adjusting your search criteria or filters</p>
            </div>
          </div>
        )}

        {loading && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">Loading tally ledger data...</p>
            </div>
          </div>
        )}

        {totalPages > 0 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LedgerTable;