"use client";
import React, { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import ProfitLossSummary from "./ProfitLoassSummery";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { expenseService, formatProfitLossForUI } from "@/lib/services/ExpenseService";
import { toast } from 'react-hot-toast';

const ProfitLossPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [selectedMonth, setSelectedMonth] = useState("--Select Month--");
  const [selectedYear, setSelectedYear] = useState("--Select Year--");
  const [profitLossData, setProfitLossData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Fetch available years on mount
    fetchAvailableYears();
    // Load initial data when component mounts
    fetchProfitLossData();
  }, []);

  const fetchAvailableYears = async () => {
    try {
      const response = await expenseService.getExpenses({ per_page: 1000 });
      
      if (response.success) {
        const years = [...new Set(response.data.map(item => item.year))].sort((a, b) => b - a);
        setAvailableYears(years.map(String));
      }
    } catch (error) {
      console.error('Error fetching years:', error);
      // Fallback years
      const currentYear = new Date().getFullYear();
      setAvailableYears([String(currentYear), String(currentYear - 1), String(currentYear - 2)]);
    }
  };

  const getMonthNumber = (monthName) => {
    const months = {
      'January': '01',
      'February': '02',
      'March': '03',
      'April': '04',
      'May': '05',
      'June': '06',
      'July': '07',
      'August': '08',
      'September': '09',
      'October': '10',
      'November': '11',
      'December': '12'
    };
    return months[monthName] || null;
  };

  const fetchProfitLossData = async (month = null, year = null) => {
    try {
      setLoading(true);
      
      const params = {};
      if (month && month !== "--Select Month--") {
        params.month = getMonthNumber(month);
      }
      if (year && year !== "--Select Year--") {
        params.year = year;
      }

      console.log('Fetching profit-loss data with params:', params);
      
      const response = await expenseService.getProfitLoss(params);
      
      console.log('Profit-loss API response:', response);
      
      // ✅ Fixed: response already unwrapped by axios interceptor
      if (response && response.success) {
        const formattedData = formatProfitLossForUI(response);
        console.log('Formatted profit-loss data:', formattedData);
        setProfitLossData(formattedData);
        toast.success('Profit & Loss data loaded successfully');
      } else {
        toast.error('Failed to load Profit & Loss data');
        setProfitLossData(null);
      }
    } catch (error) {
      console.error('Error fetching profit-loss data:', error);
      toast.error('Error loading Profit & Loss data');
      setProfitLossData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log("Searching for:", selectedMonth, selectedYear);
    fetchProfitLossData(selectedMonth, selectedYear);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${
            isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
          } bg-clip-text text-transparent mb-2`}>
            Profit and Loss Statement
          </h1>
          <p className={`text-lg ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            Track your business performance and financial health
          </p>
        </div>

        {/* Search Filter Component */}
        <SearchFilter
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
          onSearch={handleSearch}
          isDark={isDark}
        />

        {/* Loading State */}
        {loading && (
          <div className={`p-8 rounded-2xl border-2 text-center ${
            isDark ? "bg-gray-800 border-emerald-600/30" : "bg-white border-emerald-200"
          }`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Loading Profit & Loss data...
            </p>
          </div>
        )}

        {/* Profit Loss Summary Component */}
        {!loading && profitLossData && (
          <ProfitLossSummary
            data={profitLossData}
            isDark={isDark}
          />
        )}

        {/* No Data State */}
        {!loading && !profitLossData && (
          <div className={`p-8 rounded-2xl border-2 text-center ${
            isDark ? "bg-gray-800 border-emerald-600/30" : "bg-white border-emerald-200"
          }`}>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              No Profit & Loss data available for the selected period.
            </p>
            <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Try selecting a different month or year.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitLossPage;