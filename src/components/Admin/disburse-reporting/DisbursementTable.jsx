import React from "react";
import { FileText, Calculator } from "lucide-react";
import DisbursementRow from "./DisbursementRow";
import Pagination from "../Pagination";

const DisbursementTable = ({ 
  paginatedDisbursementData,
  filteredDisbursementData,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onNewLoanClick,
  onUpdateClick,
  onTransactionClick,
  onTransactionStatusClick,
  onTransferClick  
}) => {
  // Calculate totals
  const totalSanctionedAmount = filteredDisbursementData.reduce((sum, item) => 
    sum + parseFloat(item.sanctionedAmount), 0
  );
  
  const totalDisbursedAmount = filteredDisbursementData.reduce((sum, item) => 
    sum + parseFloat(item.disbursedAmount), 0
  );

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "2000px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "60px" }}>
                  SN
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "120px" }}>
                  Loan No
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "160px" }}>
                  Disburse Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r  ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "100px" }}>
                  CRN No.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r  ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "130px" }}>
                  Tran. Ref. No
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r  ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "160px" }}>
                  Tran. Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "140px" }}>
                  Sanctioned Amount
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "160px" }}>
                  Disbursed Amount
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r  ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "150px" }}>
                  Sender a/c no (Debit a/c number)
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r  ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "180px" }}>
                  Sender name (Debit a/c name)
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r  ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "100px" }}>
                  Transaction
                </th>

                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "100px" }}>
                  ICICI Transaction
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r  ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "170px" }}>
                  ICICI Transaction Status
                </th>


                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "120px" }}>
                  Beneficiary Bank IFSC Code
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "120px" }}>
                  Beneficiary a/c type
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "150px" }}>
                  Beneficiary a/c no
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "180px" }}>
                  Beneficiary a/c name
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "180px" }}>
                  Send to Rec (Transaction Narration)
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "150px" }}>
                  New Loan
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold  ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDisbursementData.map((item, index) => (
                <DisbursementRow
                  key={item.id}
                  item={item}
                  index={index}
                  isDark={isDark}
                  onNewLoanClick={onNewLoanClick}
                  onUpdateClick={onUpdateClick}
                  onTransactionClick={onTransactionClick}
                    onTransactionStatusClick={onTransactionStatusClick}
                    onTransferClick={onTransferClick}

                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedDisbursementData.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No disbursement data found</p>
              <p className="text-sm">Try adjusting your search criteria or filters</p>
            </div>
          </div>
        )}

        {/* Totals Summary */}
        {paginatedDisbursementData.length > 0 && (
          <div className={`border-t-2 px-6 py-4 ${
            isDark 
              ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50" 
              : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                <span className={`text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`}>
                  Total Summary ({filteredDisbursementData.length} records)
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Total Sanctioned Amount
                  </p>
                  <p className={`text-lg font-bold ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                    {formatCurrency(totalSanctionedAmount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Total Disbursed Amount
                  </p>
                  <p className={`text-lg font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
                    {formatCurrency(totalDisbursedAmount)}
                  </p>
                </div>
              </div>
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
              totalItems={filteredDisbursementData.length}  
              itemsPerPage={itemsPerPage}   
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DisbursementTable;