import React from "react";
import { FileText, Calendar, DollarSign, Percent, Clock, CheckCircle, AlertCircle } from "lucide-react";
import ApplicationMigrationRow from "./ApplicationRow";
import Pagination from "../Pagination";

const ApplicationMigrationTable = ({ 
  applications, 
  isDark,
  loading,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onMigration
}) => {

  const headerStyle = `px-3 py-3 text-center text-xs font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
  }`;

  // Table headers configuration - Important fields from applications table
  const tableHeaders = [
    { label: "Sr. No", width: "70px" },
    { label: "Loan No", width: "120px" },
    { label: "CRN No", width: "100px" },
    { label: "Account ID", width: "120px" },
    { label: "Name", width: "150px" },
    { label: "Applied Amount", width: "130px" },
    { label: "Approved Amount", width: "130px" },
    { label: "ROI %", width: "80px" },
    { label: "Tenure", width: "80px" },
    { label: "Loan Term", width: "120px" },
    { label: "Loan Status", width: "120px" },
    { label: "Approval Note", width: "180px" },
    { label: "Enquiry Type", width: "110px" },
    { label: "Verified", width: "90px" },
    { label: "Report Check", width: "100px" },
    { label: "Profile %", width: "80px" },
    { label: "Approved Date", width: "120px" },
    { label: "Created Date", width: "120px" },
    { label: "Status Date", width: "120px" },
    { label: "EMI Amount", width: "110px" },
    { label: "EMI No", width: "80px" },
    { label: "Final Report", width: "120px" },
    { label: "Migration Status", width: "130px" },
    { label: "Action", width: "100px" },
  ];

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
              {applications.map((application, index) => (
                <ApplicationMigrationRow
                  key={application.id}
                  application={application}
                  index={index}
                  srNo={(currentPage - 1) * itemsPerPage + index + 1}
                  isDark={isDark}
                  onMigration={onMigration}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {applications.length === 0 && !loading && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No applications found</p>
              <p className="text-sm">No applications available for migration</p>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && applications.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              <p className="text-lg font-medium">Loading applications...</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {applications.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            className="border-t-0"
          />
        )}
      </div>
    </>
  );
};

export default ApplicationMigrationTable;