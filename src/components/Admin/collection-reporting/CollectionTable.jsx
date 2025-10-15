import React from "react";
import { FileText } from "lucide-react";
import CollectionRow from "./CollectionRow";
import Pagination from "../Pagination";

const CollectionTable = ({ 
  paginatedCollectionData,
  filteredCollectionData,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  totals
}) => {
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
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "50px" }}>
                  SN
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "160px" }}>
                  Collection Date
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "100px" }}>
                  CRN No
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "130px" }}>
                  Loan No
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "200px" }}>
                  Name
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "100px" }}>
                  Admin Fee
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "80px" }}>
                  GST
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "130px" }}>
                  Sanction Amount
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "120px" }}>
                  Disburse Date
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "130px" }}>
                  Transaction Date
                </th>
                <th className={`px-4 py-6 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "240px" }}>
                  Due Date
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "80px" }}>
                  Interest
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "80px" }}>
                  Penalty
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "80px" }}>
                  GST
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "100px" }}>
                  Penal Interest
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "110px" }}>
                  Renewal Charge
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "110px" }}>
                  Bounce Charge
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "130px" }}>
                  Collection Amount
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "110px" }}>
                  Total Amount
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold border-r ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "80px" }}>
                  Agent
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
                }`} style={{ minWidth: "80px" }}>
                  User By
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCollectionData.map((item, index) => (
                <CollectionRow
                  key={item.id}
                  item={item}
                  index={index}
                  isDark={isDark}
                />
              ))}
              
              {/* Totals Row */}
              {paginatedCollectionData.length > 0 && (
                <tr className={`border-t-2 font-bold ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-emerald-400"
                    : "bg-emerald-50 border-emerald-300 text-emerald-700"
                }`}>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4 text-sm">TOTAL</td>
                  <td className="px-4 py-4 text-sm">₹{totals.adminFee.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm">₹{totals.gst.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm">₹{totals.sanctionAmount.toFixed(2)}</td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4 text-sm">₹{totals.interest.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm">{totals.penalty.toFixed(0)}</td>
                  <td className="px-4 py-4 text-sm">{totals.gstPenalty.toFixed(0)}</td>
                  <td className="px-4 py-4 text-sm">{totals.penalInterest.toFixed(0)}</td>
                  <td className="px-4 py-4 text-sm">{totals.renewalCharge.toFixed(0)}</td>
                  <td className="px-4 py-4 text-sm">₹{totals.bounceCharge.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm">₹{totals.collectionAmount.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm">₹{totals.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedCollectionData.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No collection data found</p>
              <p className="text-sm">Try adjusting your search criteria or filters</p>
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
            totalItems={filteredCollectionData.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
      </div>

      
    </>
  );
};

export default CollectionTable;