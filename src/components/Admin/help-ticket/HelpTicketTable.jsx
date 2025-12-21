'use client';
import React from 'react';
import { MessageSquare, Loader } from 'lucide-react';
import TicketRow from './HelpTicketRow';
import Pagination from '../Pagination';

const TicketTable = ({
  tickets,
  filteredTickets,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onViewTicket,
  isLoading = false,
  totalItems
}) => {
  const styles = {
    headerClass: `px-4 py-5 text-left text-sm font-bold border-r ${
      isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
    }`,
    gradientClass: `border-b-2 ${
      isDark
        ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
        : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
    }`,
    tableClass: `rounded-2xl shadow-2xl border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`
  };

  return (
    <div className={styles.tableClass}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max" style={{ minWidth: "1200px" }}>
          <thead className={styles.gradientClass}>
            <tr>
              <th className={styles.headerClass} style={{ minWidth: "120px" }}>
                Ticket ID
              </th>
              <th className={styles.headerClass} style={{ minWidth: "250px" }}>
                Subject
              </th>
              <th className={styles.headerClass} style={{ minWidth: "100px" }}>
                Priority
              </th>
              <th className={styles.headerClass} style={{ minWidth: "120px" }}>
                Status
              </th>
              <th className={styles.headerClass} style={{ minWidth: "120px" }}>
                Type
              </th>
              <th className={styles.headerClass} style={{ minWidth: "150px" }}>
                Created By
              </th>
              <th className={styles.headerClass} style={{ minWidth: "150px" }}>
                Created Date
              </th>
              <th className={styles.headerClass} style={{ minWidth: "150px" }}>
                Messages
              </th>
              <th className={`px-4 py-5 text-left text-sm font-bold ${
                isDark ? "text-gray-100" : "text-gray-700"
              }`} style={{ minWidth: "100px" }}>
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
                      Loading tickets...
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              tickets.map((ticket, index) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  index={index}
                  isDark={isDark}
                  onViewTicket={onViewTicket}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Empty State */}
      {!isLoading && tickets.length === 0 && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <MessageSquare className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm">Try adjusting your search criteria or create a new ticket</p>
          </div>
        </div>
      )}
      
      {!isLoading && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default TicketTable;