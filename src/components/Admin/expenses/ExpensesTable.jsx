import React from "react";
import { Calculator } from "lucide-react";
import ExpenseRow from "./ExpenseRow";
import Pagination from "../Pagination";

const ExpensesTable = ({ 
  paginatedExpenses,
  filteredExpenses,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onEditClick
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "1800px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Month
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  Year
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Salary
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "130px" }}>
                  Mobile Expenses
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "110px" }}>
                  Convence
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Interest
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "110px" }}>
                  Electricity
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  Rent
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "160px" }}>
                  Promotion/Advertisement
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  Cibil
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Others
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Total
                </th>
                <th className={`px-4 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.map((expense, index) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  index={index}
                  isDark={isDark}
                  onEditClick={onEditClick}
                />
              ))}
            </tbody>
          </table>
          
        </div>
        
        {/* Empty State */}
        {paginatedExpenses.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <Calculator className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No expenses found</p>
              <p className="text-sm">Try adjusting your filter criteria</p>
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
            totalItems={filteredExpenses.length}  
            itemsPerPage={itemsPerPage}   
          />
        </div>
      )}
        
      </div>

      
    </>
  );
};

export default ExpensesTable;