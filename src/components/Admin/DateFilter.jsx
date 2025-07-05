"use client"
import { useState } from "react";

const DateFilter = ({ isDark, onFilterChange }) => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sourceFilter, setSourceFilter] = useState("all");

  const handleDateChange = (type, value) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);
    // Auto-apply filter when date changes
    if (onFilterChange) {
      onFilterChange({ dateRange: newDateRange, source: sourceFilter });
    }
  };

  const handleSourceChange = (value) => {
    setSourceFilter(value);
    // Auto-apply filter when source changes
    if (onFilterChange) {
      onFilterChange({ dateRange, source: value });
    }
  };

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({ dateRange, source: sourceFilter });
    }
  };

  const handleClearFilter = () => {
    const clearedDateRange = { start: "", end: "" };
    const clearedSource = "all";
    setDateRange(clearedDateRange);
    setSourceFilter(clearedSource);
    if (onFilterChange) {
      onFilterChange({ dateRange: clearedDateRange, source: clearedSource });
    }
  };

  return (
    <div className={`border rounded-lg p-6 mb-6 ${
      isDark 
        ? "border-emerald-600/30 bg-gray-800/50" 
        : "border-emerald-200 bg-emerald-50/30"
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
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
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
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
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
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
            <option value="Website">Website</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Web Portal">Web Portal</option>
            <option value="iOS App">iOS App</option>
            <option value="Android App">Android App</option>
          </select>
        </div>

        <div className="md:col-span-1">
          <button
            onClick={handleApplyFilter}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
            } shadow-lg hover:shadow-xl`}
          >
            Apply Filter
          </button>
        </div>

        <div className="md:col-span-1">
          <button
            onClick={handleClearFilter}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
            } shadow-lg hover:shadow-xl`}
          >
            Clear Filter
          </button>
        </div>
      </div>

      {/* Filter Summary
      {(dateRange.start || dateRange.end || sourceFilter !== "all") && (
        <div className={`mt-4 p-3 rounded-lg border ${
          isDark ? "bg-gray-700/50 border-emerald-600/20" : "bg-emerald-50 border-emerald-200"
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Active Filters:
            </span>
            {dateRange.start && (
              <span className={`px-2 py-1 rounded text-xs ${
                isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
              }`}>
                From: {dateRange.start}
              </span>
            )}
            {dateRange.end && (
              <span className={`px-2 py-1 rounded text-xs ${
                isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
              }`}>
                To: {dateRange.end}
              </span>
            )}
            {sourceFilter !== "all" && (
              <span className={`px-2 py-1 rounded text-xs ${
                isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
              }`}>
                Source: {sourceFilter}
              </span>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DateFilter;