import React from "react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import { FileText, Loader2 } from "lucide-react";
import ReviewRow from "./ReviewRow";
import Pagination from "../Pagination";

const ReviewTable = ({ 
  reviews, 
  currentPage,
  totalPages,
  itemsPerPage,
  totalReviews,
  onPageChange,
  onStatusClick,
  loading
}) => {
  const { isDark } = useAdminAuth();
  
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div
      className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}
    >
      {/* Loading State */}
      {loading && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-lg font-medium">Loading reviews...</p>
          </div>
        </div>
      )}

      {/* Table Content */}
      {!loading && (
        <>
          <div className="overflow-x-auto ">
            <table className="w-full min-w-max" style={{ minWidth: "1200px" }}>
              <thead
                className={`border-b-2 ${
                  isDark
                    ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                    : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
                }`}
              >
                <tr>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "60px" }}
                  >
                    SN
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "300px" }}
                  >
                    Customer
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "270px" }}
                  >
                    Contact
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "120px" }}
                  >
                    CRN No.
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "300px" }}
                  >
                    Review
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "120px" }}
                  >
                    Rating
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "100px" }}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "250px" }}
                  >
                    Reply
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "120px" }}
                  >
                    Approved By
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                    style={{ minWidth: "170px" }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y-2 ${
                  isDark ? "divide-emerald-800/30" : "divide-emerald-200"
                }`}
              >
                {reviews && reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <ReviewRow
                      key={review.id}
                      review={review}
                      index={startIndex + index + 1}
                      onStatusClick={onStatusClick}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      <div className="flex flex-col items-center space-y-4">
                        <FileText className="w-16 h-16 opacity-50" />
                        <p className="text-lg font-medium">No reviews found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Only show if there are pages */}
          {totalPages > 1 && (
            <div className={`border-t-2 px-6 py-4 ${
              isDark ? "border-emerald-800/30 bg-gray-800/50" : "border-emerald-200 bg-emerald-50/30"
            }`}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                totalItems={totalReviews}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}

         
        </>
      )}
    </div>
  );
};

export default ReviewTable;