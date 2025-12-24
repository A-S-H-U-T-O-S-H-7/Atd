import React from "react";
import { FileText, User, Calendar, Phone, Mail, Briefcase, CreditCard, Shield, AlertCircle } from "lucide-react";
import UsersMigrationRow from "./UserMigrationRow";
import Pagination from "../Pagination";

const UsersMigrationTable = ({ 
  users, 
  isDark,
  loading,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onMigration,
  onFileView
}) => {

  const headerStyle = `px-3 py-3 text-center text-xs font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
  }`;

  // Table headers configuration
  const tableHeaders = [
    { label: "ID", width: "70px" },
    { label: "CRN No", width: "100px" },
    { label: "Account ID", width: "120px" },
    { label: "Activation", width: "90px" },
    { label: "Activate Date", width: "110px" },
    { label: "Full Name", width: "150px" },
    { label: "DOB", width: "100px" },
    { label: "Photo", width: "80px" },
    { label: "Gender", width: "90px" },
    { label: "Father's Name", width: "150px" },
    { label: "Phone", width: "120px" },
    { label: "Email", width: "180px" },
    { label: "Alt Email", width: "180px" },
    { label: "PAN No", width: "120px" },
    { label: "Aadhar No", width: "140px" },
    { label: "Step", width: "70px" },
    { label: "Verified", width: "90px" },
    { label: "Blacklist", width: "100px" },
    { label: "Blacklist Date", width: "120px" },
    { label: "Organization", width: "140px" },
    { label: "Net Salary", width: "110px" },
    { label: "Admin ID", width: "100px" },
    { label: "Migration Status", width: "120px" },
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
          <table className="w-full min-w-max" style={{ minWidth: "2000px" }}>
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
              {users.map((user, index) => (
                <UsersMigrationRow
                  key={user.id}
                  user={user}
                  index={index}
                  isDark={isDark}
                  onMigration={onMigration}
                  onFileView={onFileView}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {users.length === 0 && !loading && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <User className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">No users available for migration</p>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && users.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              <p className="text-lg font-medium">Loading users...</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {users.length > 0 && (
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

export default UsersMigrationTable;