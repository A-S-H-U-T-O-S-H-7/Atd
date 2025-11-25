"use client";
import React from "react";
import { Search } from "lucide-react";

const SearchFilter = ({ 
  selectedMonth, 
  setSelectedMonth, 
  selectedYear, 
  setSelectedYear,
  availableYears = [], // ✅ Now receives years as prop
  onSearch, 
  isDark 
}) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className={`p-6 rounded-2xl border-2 mb-8 ${
      isDark 
        ? "bg-gray-800/50 border-emerald-600/30" 
        : "bg-white border-emerald-200 shadow-lg"
    }`}>
      <h2 className={`text-lg font-semibold mb-4 ${
        isDark ? "text-white" : "text-gray-800"
      }`}>
        Filter by Date
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              isDark
                ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          >
            <option value="--Select Month--">--Select Month--</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              isDark
                ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          >
            <option value="--Select Year--">--Select Year--</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onSearch}
            className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 ${
              isDark
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
            } shadow-lg`}
          >
            <Search size={20} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;