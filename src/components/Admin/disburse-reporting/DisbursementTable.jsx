import React from "react";
import { FileText, Calculator, Loader } from "lucide-react";
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
  onTransactionClick,
  onTransactionStatusClick,
  onTransferClick,
  isLoading = false
}) => {
  // Calculate totals
  const totalSanctionedAmount = filteredDisbursementData.reduce((sum, item) => 
    sum + parseFloat(item.sanctionedAmount || 0), 0
  );
  
  const totalDisbursedAmount = filteredDisbursementData.reduce((sum, item) => 
    sum + parseFloat(item.disbursedAmount || 0), 0
  );

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Common header style - similar to DisburseTable
  const headerStyle = `px-2 py-3 text-center text-sm font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
  }`;

  // Table headers configuration with their respective widths
  const tableHeaders = [
    { label: "SN", width: "60px" },
    { label: "Loan No", width: "60px" },
    { label: "Customer name", width: "180px" },
    { label: "Disburse Date", width: "150px" },
    { label: "CRN No.", width: "100px" },
    { label: "Tran. Ref. No", width: "120px" },
    { label: "Tran. Date", width: "130px" },
    { label: "Sanctioned Amount", width: "140px" },
    { label: "Disbursed Amount", width: "110px" },
    { label: "Sender a/c no (Debit a/c number)", width: "200px" },
    { label: "Sender name (Debit a/c name)", width: "180px" },
    { label: "Transaction", width: "100px" },
    { label: "ICICI Transaction", width: "100px" },
    { label: "ICICI Transaction Status", width: "170px" },
    { label: "Beneficiary Bank IFSC Code", width: "120px" },
    // { label: "Beneficiary a/c type", width: "120px" },
    { label: "Beneficiary a/c no", width: "150px" },
    { label: "Send to Rec (Transaction Narration)", width: "180px" },
  ];

  if (isLoading) {
    return (
      <div className={`rounded-2xl shadow-2xl border-2 p-12 flex items-center justify-center ${
        isDark
          ? "bg-gray-800 border-emerald-600/50"
          : "bg-white border-emerald-300"
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-emerald-500" />
          <p className={`text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading disbursement data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "900px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
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
              {paginatedDisbursementData.map((item, index) => (
                <DisbursementRow
                  key={item.id}
                  item={item}
                  index={index}
                  isDark={isDark}
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
          <div>
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