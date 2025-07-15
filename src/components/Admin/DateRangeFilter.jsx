"use client"
import { useState } from "react";

const DateRangeFilter = ({ isDark, onFilterChange }) => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleDateChange = (type, value) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);
  };

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({ dateRange });
    }
  };

  const handleClearFilter = () => {
    const clearedDateRange = { start: "", end: "" };
    setDateRange(clearedDateRange);
    if (onFilterChange) {
      onFilterChange({ dateRange: clearedDateRange });
    }
  };

  return (
    <div className={`border rounded-lg p-4 sm:p-6 mb-6 ${
      isDark 
        ? "border-emerald-600/30 bg-gray-800/50" 
        : "border-emerald-200 bg-emerald-50/30"
    }`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            From Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateChange("start", e.target.value)}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          />
        </div>

        <div className="sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            To Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateChange("end", e.target.value)}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          />
        </div>

        <div className="sm:col-span-1">
          <button
            onClick={handleApplyFilter}
            className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
            } shadow-lg hover:shadow-xl`}
          >
            Search
          </button>
        </div>

        <div className="sm:col-span-1">
          <button
            onClick={handleClearFilter}
            className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
            } shadow-lg hover:shadow-xl`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;