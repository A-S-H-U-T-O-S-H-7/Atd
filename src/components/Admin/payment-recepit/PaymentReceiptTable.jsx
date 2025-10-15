import React from "react";
import { FileText } from "lucide-react";
import PaymentReceiptRow from "./PaymentReceiptRow";
import Pagination from "../Pagination";

const PaymentReceiptTable = ({ 
  paginatedPayments,
  filteredPayments,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onUpdateClick
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
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "80px" }}>
                  SN
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "160px" }}>
                  Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "140px" }}>
                  Loan No
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "200px" }}>
                  Name
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "250px" }}>
                  Email
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "120px" }}>
                  Phone
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "150px" }}>
                  Outstanding Amount
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "140px" }}>
                  Payable Amount
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "140px" }}>
                  Received Amount
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "120px" }}>
                  Commission
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold  ${
                  isDark ? "text-gray-100" : "text-gray-700 "
                }`} style={{ minWidth: "100px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment, index) => (
                <PaymentReceiptRow
                  key={payment.id}
                  payment={payment}
                  index={index}
                  isDark={isDark}
                  onUpdateClick={onUpdateClick}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedPayments.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No payment records found</p>
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
              totalItems={filteredPayments.length}  
              itemsPerPage={itemsPerPage}   
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentReceiptTable;