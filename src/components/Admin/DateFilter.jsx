"use client"
import { useState } from "react";

const DateFilter = ({ isDark, onFilterChange }) => {
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [sourceFilter, setSourceFilter] = useState("all");
  
    const handleDateChange = (type, value) => {
      const newDateRange = { ...dateRange, [type]: value };
      setDateRange(newDateRange);
      onFilterChange({ dateRange: newDateRange, source: sourceFilter });
    };
  
    const handleSourceChange = (value) => {
      setSourceFilter(value);
      onFilterChange({ dateRange, source: value });
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            From Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateChange("start", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          />
        </div>
  
        <div className="md:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            To Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateChange("end", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          />
        </div>
  
        <div className="md:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Source Filter
          </label>
          <select
            value={sourceFilter}
            onChange={(e) => handleSourceChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          >
            <option value="all">All Sources</option>
            <option value="New Android">New Android</option>
            <option value="Web Portal">Web Portal</option>
            <option value="iOS App">iOS App</option>
          </select>
        </div>
  
        <div className="md:col-span-1 flex items-end">
          <button
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
            } shadow-lg hover:shadow-xl`}
          >
            Apply Filter
          </button>
        </div>
      </div>
    );
  };

  export default DateFilter;
  