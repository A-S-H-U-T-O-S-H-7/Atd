"use client";
import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import ExpensesTable from "./ExpensesTable";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";


const ManageExpensesPage = () => {
const { theme } = useThemeStore();
 const isDark = theme === "dark";
   const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      month: "January",
      year: 2019,
      salary: 200000,
      mobileExpenses: 20000,
      convence: 20000,
      interest: 15000,
      electricity: 2000,
      rent: 10000,
      promotionAdvertisement: 0,
      cibil: 0,
      others: 20000,
      total: 287000
    },
    {
      id: 2,
      month: "February",
      year: 2019,
      salary: 250000,
      mobileExpenses: 5000,
      convence: 6000,
      interest: 15000,
      electricity: 2000,
      rent: 10000,
      promotionAdvertisement: 0,
      cibil: 0,
      others: 4000,
      total: 292000
    },
    {
      id: 3,
      month: "December",
      year: 2018,
      salary: 260000,
      mobileExpenses: 4000,
      convence: 4000,
      interest: 4000,
      electricity: 4000,
      rent: 4000,
      promotionAdvertisement: 0,
      cibil: 0,
      others: 5000,
      total: 285000
    },
    {
      id: 4,
      month: "October",
      year: 2021,
      salary: 251907,
      mobileExpenses: 5000,
      convence: 0,
      interest: 87555,
      electricity: 9237,
      rent: 35000,
      promotionAdvertisement: 0,
      cibil: 0,
      others: 197747,
      total: 586446
    },
    {
      id: 5,
      month: "November",
      year: 2020,
      salary: 160599,
      mobileExpenses: 5000,
      convence: 0,
      interest: 50000,
      electricity: 7000,
      rent: 20000,
      promotionAdvertisement: 0,
      cibil: 0,
      others: 72420,
      total: 315019
    },
    {
      id: 6,
      month: "November",
      year: 2021,
      salary: 256233,
      mobileExpenses: 5000,
      convence: 0,
      interest: 81790,
      electricity: 7000,
      rent: 35000,
      promotionAdvertisement: 0,
      cibil: 0,
      others: 215459,
      total: 600482
    }
  ]);

  const itemsPerPage = 10;

  const handleAddExpense = () => {
    router.push("/crm/manage-expenses/expenses-management");
  };

  const handleEditClick = (expense) => {
    router.push(`/crm/manage-expenses/expenses-management?id=${expense.id}`);
  };

  // Get unique years for filter
  const availableYears = [...new Set(expenses.map(expense => expense.year))].sort((a, b) => b - a);

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesYear = yearFilter === "all" || expense.year.toString() === yearFilter;
    const matchesMonth = monthFilter === "all" || expense.month.toLowerCase() === monthFilter.toLowerCase();
    return matchesYear && matchesMonth;
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Manage Expenses
              </h1>
            </div>
            
            {/* Add Expense Button */}
            <button
              onClick={handleAddExpense}
              className={`px-6 py-3 cursor-pointer rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
              } shadow-lg`}
            >
              <Plus size={20} />
              <span>Add Expense</span>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Months</option>
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <ExpensesTable
          paginatedExpenses={paginatedExpenses}
          filteredExpenses={filteredExpenses}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onEditClick={handleEditClick}
        />
      </div>
    </div>
  );
};

export default ManageExpensesPage;