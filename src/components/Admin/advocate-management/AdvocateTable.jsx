// app/crm/advocate/components/AdvocateTable.jsx
'use client';
import React from 'react';
import { FileText, Loader } from 'lucide-react';
import AdvocateRow from './AdvocateRow';
import Pagination from '../Pagination';

const AdvocateTable = ({ 
  paginatedAdvocates,
  filteredAdvocates,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onEdit,
  onToggleStatus,
  isLoading = false
}) => {
  return (
    <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-blue-900/20"
        : "bg-white border-emerald-300 shadow-blue-500/10"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max" style={{ minWidth: "1400px" }}>
          <thead className={`border-b-2 ${
            isDark
              ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
              : "bg-gradient-to-r from-blue-50 to-indigo-50 border-emerald-300"
          }`}>
            <tr>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "80px" }}>
                S.No.
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "250px" }}>
                Advocate Details
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "200px" }}>
                Court
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "300px" }}>
                Address
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "200px" }}>
                Contact
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "150px" }}>
                Licence No.
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "200px" }}>
                Added Details
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold border-r ${
                isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
              }`} style={{ minWidth: "120px" }}>
                Status
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold ${
                isDark ? "text-gray-100" : "text-gray-700"
              }`} style={{ minWidth: "120px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                      Loading advocates...
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedAdvocates.map((advocate, index) => (
                <AdvocateRow
                  key={advocate.id}
                  advocate={advocate}
                  index={index}
                  isDark={isDark}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Empty State */}
      {!isLoading && paginatedAdvocates.length === 0 && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <FileText className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">No advocates found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </div>
      )}
      
      {!isLoading && totalPages > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={filteredAdvocates.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
    </div>
  );
};

export default AdvocateTable;