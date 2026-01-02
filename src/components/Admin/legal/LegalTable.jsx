import React from "react";
import { FileText, Loader } from "lucide-react";
import LegalRow from "./LegalRow";
import Pagination from "../Pagination";

const LegalTable = ({ 
  paginatedLegals,
  filteredLegals,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onCreateNotice, 
  onShowAddress,   
  onCriminalCase,
  onShowCriminalStatus,
  onEdit ,
  isLoading = false
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-blue-900/20"
          : "bg-white border-emerald-300 shadow-blue-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "800px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "80px" }}>
                  S.No.
                </th>

                {/* Medium */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "100px" }}>
                  Medium
                </th>
                
                {/* Customer Details */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "150px" }}>
                  Customer Details
                </th>
                
                {/* Address - Single Column */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "300px" }}>
                  Address
                </th>
                
                {/* Financial Details */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "350px" }}>
                  Financial Details (Cheque Breakup)
                </th>
                
                {/* Loan Details */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "200px" }}>
                  Loan Details
                </th>
                
                {/* Bank Information - Split into 2 columns */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "200px" }}>
                  ATD Bank Details
                </th>
                
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "250px" }}>
                  Customer Bank Details
                </th>
                
                {/* Cheque Details */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "120px" }}>
                  Cheque Details
                </th>
                
                {/* Cheque Return Details */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "300px" }}>
                  Cheque Return Details
                </th>
                
                {/* Important Dates */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "220px" }}>
                  Important Dates
                </th>
                
                {/* Legal Notice Status - Updated heading */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "200px" }}>
                  Legal Notice Status
                </th>
                
                {/* NEW: Criminal Case Status */}
                <th className={`px-2 py-5 text-left text-sm font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
                }`} style={{ minWidth: "250px" }}>
                  Criminal Case Status
                </th>
                
                {/* Actions */}
                <th className={`px-2 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "300px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="14" className="px-2 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                        Loading legal cases...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLegals.map((legal, index) => (
                  <LegalRow
                    key={legal.id}
                    legal={legal}
                    index={index}
                    isDark={isDark}
                    onCreateNotice={onCreateNotice}    
                    onCriminalCase={onCriminalCase}
                    onShowAddress={onShowAddress}
                    onShowCriminalStatus ={onShowCriminalStatus}
                    onEdit={onEdit }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {!isLoading && paginatedLegals.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No legal cases found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
        
        {!isLoading && totalPages > 0 && (
          <div >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={filteredLegals.length}  
              itemsPerPage={itemsPerPage}   
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LegalTable;