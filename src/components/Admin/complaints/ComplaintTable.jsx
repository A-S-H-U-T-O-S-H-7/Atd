import React from "react";
import { FileText } from "lucide-react";
import ComplaintRow from "./ComplaintRow";
import Pagination from "../Pagination";

const ComplaintTable = ({ 
  paginatedComplaints,
  filteredComplaints,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onUploadClick,
  onDetailClick,
  onFileView
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "1400px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  SR. No.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "160px" }}>
                  Complaint Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "250px" }}>
                  Customer
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "270px" }}>
                  Contact
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Loan No.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Loan Belong To
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Status
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "200px" }}>
                  Complaint Details
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Complaint Documents
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Complaint For
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Complaint Assign To
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Complaint Assign Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "200px" }}>
                  Complaint Resolution
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Resolution Documents
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Complaint Close Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Final Remarks
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
  isDark ? "text-gray-100" : "text-gray-700"
}`} style={{ minWidth: "120px" }}>
  Upload
</th>
<th className={`px-6 py-5 text-left text-sm font-bold ${
  isDark ? "text-gray-100" : "text-gray-700"
}`} style={{ minWidth: "120px" }}>
  Action
</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComplaints.map((complaint, index) => (
                <ComplaintRow
                  key={complaint.id}
                  complaint={complaint}
                  index={index}
                  isDark={isDark}
                  onUploadClick={onUploadClick}
                  onDetailClick={onDetailClick}
                  onFileView={onFileView}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedComplaints.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No complaints found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
        {totalPages > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={filteredComplaints.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
      </div>

      
      
    </>
  );
};

export default ComplaintTable;