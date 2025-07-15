import React from "react";
import { MessageSquare } from "lucide-react";
import HelpTicketRow from "./HelpTicketRow";
import Pagination from "../Pagination";

const HelpTicketTable = ({ 
  paginatedHelpTicketData,
  filteredHelpTicketData,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onReplyClick,
  onSummaryClick
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "1000px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Issue Date
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Ticket ID
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "200px" }}>
                  Subject
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Message
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  User
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Status
                </th>
                <th className={`px-4 py-4 text-left text-xs font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedHelpTicketData.map((item, index) => (
                <HelpTicketRow
                  key={item.id}
                  item={item}
                  index={index}
                  isDark={isDark}
                  onReplyClick={onReplyClick}
                  onSummaryClick={onSummaryClick}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedHelpTicketData.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <MessageSquare className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No help tickets found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
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
              totalItems={filteredHelpTicketData.length}  
              itemsPerPage={itemsPerPage}   
            />
          </div>
        )}
      </div>
    </>
  );
};

export default HelpTicketTable;