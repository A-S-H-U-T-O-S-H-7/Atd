import React from "react";
import Pagination from "../Pagination";
import RbiGuidelinesTableRow from "./GuidelinesRow";

const RbiGuidelinesTable = ({
  guidelines,
  currentPage,
  itemsPerPage,
  totalPages,
  totalItems,
  isUpdating,
  isDark,
  error,
  onEdit,
  onDelete,
  onPageChange,
  onStatusClick ,
  onUploadDocument,  
  onViewDocument
}) => {
  return (
    <div
      className={`rounded-2xl shadow-2xl border-2 overflow-hidden transition-opacity duration-200 ${
        isUpdating ? 'opacity-70' : 'opacity-100'
      } ${isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"}`}
    >
      {guidelines.length === 0 && !error ? (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <p className="text-lg">No RBI guidelines found</p>
          <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max" style={{ minWidth: "1400px" }}>
              <thead
                className={`border-b-2 ${isDark
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                  : "bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-300"}`}
              >
                <tr>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "60px" }}
                  >
                    SR. No.
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "140px" }}
                  >
                    RBI Guideline Date
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "200px" }}
                  >
                    Reference No.
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "300px" }}
                  >
                    Subject
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "120px" }}
                  >
                    Caution advice No
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "150px" }}
                  >
                    Remarks
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "140px" }}
                  >
                    Last Modify
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "100px" }}
                  >
                    Status
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "120px" }}
                  >
                    Added By
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "140px" }}
                  >
                    Upload Documents
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "140px" }}
                  >
                    Created Date
                  </th>
                  <th
                    className={`px-4 py-4 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "120px" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y-2 ${isDark
                  ? "divide-emerald-800/30"
                  : "divide-emerald-200"}`}
              >
                {guidelines.map((guideline, index) => (
                  <RbiGuidelinesTableRow
                    key={guideline.id}
                    guideline={guideline}
                    index={index}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    isDark={isDark}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusClick={onStatusClick}
                    onUploadDocument={onUploadDocument}  
                    onViewDocument={onViewDocument} 
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            disabled={isUpdating}
          />
        </>
      )}
    </div>
  );
};

export default RbiGuidelinesTable;