'use client';
import React from 'react';
import { Users, Loader } from 'lucide-react';
import AdminRow from './AdminRow';

const AdminTable = ({ 
  admins,
  isDark,
  onEdit,
  onToggleStatus,
  onOpenPermissions,
  isLoading,
}) => {
  const styles = {
    headerClass: `px-4 py-5 text-left text-sm font-bold border-r ${
      isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
    }`,
    gradientClass: `border-b-2 ${
      isDark
        ? "bg-gradient-to-r from-gray-900 to-gray-800 border-purple-600/50"
        : "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300"
    }`
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max">
        <thead className={styles.gradientClass}>
          <tr>
            <th className={styles.headerClass} style={{ minWidth: "60px" }}>S.No.</th>
            <th className={styles.headerClass} style={{ minWidth: "250px" }}>Admin Details</th>
            <th className={styles.headerClass} style={{ minWidth: "200px" }}>Contact</th>
            <th className={styles.headerClass} style={{ minWidth: "180px" }}>Added Details</th>
            <th className={styles.headerClass} style={{ minWidth: "100px" }}>Status</th>
            <th className={styles.headerClass} style={{ minWidth: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                    Loading admins...
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            admins.map((admin, index) => (
              <AdminRow
                key={admin.id}
                admin={admin}
                index={index}
                isDark={isDark}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onOpenPermissions={onOpenPermissions}
              />
            ))
          )}
        </tbody>
      </table>
      
      {!isLoading && admins.length === 0 && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <Users className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">No admins found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;