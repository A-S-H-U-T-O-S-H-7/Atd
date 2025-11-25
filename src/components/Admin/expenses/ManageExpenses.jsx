"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import ExpensesTable from "./ExpensesTable";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { expenseService, formatExpenseForUI } from "@/lib/services/ExpenseService";
import { toast } from 'react-hot-toast';

const ManageExpensesPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState([]); // ✅ Separate state for years
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 1
  });

  const itemsPerPage = 10;

  // ✅ Fetch available years on mount (only once)
  useEffect(() => {
    fetchAvailableYears();
  }, []);

  // ✅ Fetch expenses when filters change
  useEffect(() => {
    fetchExpenses();
  }, [currentPage, yearFilter, monthFilter]);

  // ✅ Fetch all available years (without filters)
  const fetchAvailableYears = async () => {
    try {
      // Fetch all expenses without pagination to get unique years
      const response = await expenseService.getExpenses({ per_page: 1000 }); // Get large number
      
      if (response.success) {
        const formattedExpenses = response.data.map(formatExpenseForUI);
        const years = [...new Set(formattedExpenses.map(expense => expense.year))].sort((a, b) => b - a);
        setAvailableYears(years);
      }
    } catch (error) {
      console.error('Error fetching years:', error);
      // Fallback: Generate years from current year
      const currentYear = new Date().getFullYear();
      const fallbackYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
      setAvailableYears(fallbackYears);
    }
  };

  // Helper to convert month name to number
  const getMonthNumberForAPI = (monthName) => {
    if (monthName === "all") return null;
    const months = {
      'january': '01', 'february': '02', 'march': '03',
      'april': '04', 'may': '05', 'june': '06',
      'july': '07', 'august': '08', 'september': '09',
      'october': '10', 'november': '11', 'december': '12'
    };
    return months[monthName.toLowerCase()];
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        ...(yearFilter !== "all" && { year: yearFilter }),
        ...(monthFilter !== "all" && { month: getMonthNumberForAPI(monthFilter) })
      };

      const response = await expenseService.getExpenses(params);
      
      if (response.success) {
        const formattedExpenses = response.data.map(formatExpenseForUI);
        setExpenses(formattedExpenses);
        setPagination(response.pagination);
      } else {
        toast.error('Failed to fetch expenses');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Error loading expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    router.push("/crm/manage-expenses/expenses-management");
  };

  const handleEditClick = (expense) => {
    router.push(`/crm/manage-expenses/expenses-management?id=${expense.id}`);
  };

  const totalPages = pagination.total_pages;

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
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(1);
              }}
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
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setCurrentPage(1);
              }}
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
          paginatedExpenses={loading ? [] : expenses}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={pagination.total}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          loading={loading}
          onPageChange={setCurrentPage}
          onEditClick={handleEditClick}
          onRefresh={fetchExpenses}
        />
      </div>
    </div>
  );
};

export default ManageExpensesPage;