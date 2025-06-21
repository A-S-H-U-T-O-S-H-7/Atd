import React from "react";
import Pagination from "../Pagination";
import BlogTableRow from "./BlogTableRow";

const BlogTable = ({
  blogs,
  currentPage,
  itemsPerPage,
  totalPages,
  totalItems,
  isUpdating,
  isDark,
  error,
  onEdit,
  onDelete,
  onPageChange
}) => {
  return (
    <div
      className={`rounded-2xl shadow-2xl border-2 overflow-hidden transition-opacity duration-200 ${
        isUpdating ? 'opacity-70' : 'opacity-100'
      } ${isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"}`}
    >
      {blogs.length === 0 && !error ? (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <p className="text-lg">No blogs found</p>
          <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max" style={{ minWidth: "1200px" }}>
              <thead
                className={`border-b-2 ${isDark
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                  : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"}`}
              >
                <tr>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "60px" }}
                  >
                    SN
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "120px" }}
                  >
                    Image
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "400px" }}
                  >
                    Title
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "120px" }}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "180px" }}
                  >
                    Publication Date
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "100px" }}
                  >
                    Views
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "200px" }}
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
                {blogs.map((blog, index) => (
                  <BlogTableRow
                    key={blog.id}
                    blog={blog}
                    index={index}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    isDark={isDark}
                    onEdit={onEdit}
                    onDelete={onDelete}
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

export default BlogTable;