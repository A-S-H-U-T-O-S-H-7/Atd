"use client"
import { useState, useMemo } from "react";

const DateFilter = ({ 
  isDark, 
  onFilterChange,
  dateField = "enquiry_date",
  showSourceFilter = true,
  sourceOptions = [
    { value: "all", label: "All Sources" },
    { value: "Desktop", label: "Desktop" },
    { value: "iOS", label: "iOS" },
    { value: "Android", label: "Android" }
  ],
  buttonLabels = {
    apply: "Apply",
    clear: "Clear"
  }
}) => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sourceFilter, setSourceFilter] = useState("all");
  const [isApplying, setIsApplying] = useState(false);

  // Get current date in YYYY-MM-DD format for max date validation
  const currentDate = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Calculate max date for end date - FIXED VERSION
  const getMaxEndDate = () => {
    // If no start date selected, max is today
    if (!dateRange.start) return currentDate;
    
    const startDate = new Date(dateRange.start);
    const today = new Date(currentDate);
    
    // If start date is in future (shouldn't happen due to validation), max is today
    if (startDate > today) return currentDate;
    
    // Otherwise, max is today (users can select any date between start date and today)
    return currentDate;
  };

  const handleDateChange = (type, value) => {
    const newDateRange = { ...dateRange };
    
    if (type === "start") {
      newDateRange.start = value;
      // If new start date is after current end date, reset end date
      if (value && dateRange.end && new Date(value) > new Date(dateRange.end)) {
        newDateRange.end = "";
      }
    } else {
      // Ensure end date is not before start date and not in future
      if (value) {
        const endDate = new Date(value);
        const today = new Date(currentDate);
        
        if (dateRange.start && endDate < new Date(dateRange.start)) {
          return;
        }
        if (endDate > today) {
          return;
        }
      }
      newDateRange.end = value;
    }
    
    setDateRange(newDateRange);
  };

  const handleSourceChange = (value) => {
    setSourceFilter(value);
  };

  const handleApplyFilter = async () => {
    if (!onFilterChange) return;

    setIsApplying(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const filters = { 
        dateRange,
        dateField
      };
      
      if (showSourceFilter) {
        filters.source = sourceFilter;
      }
      
      onFilterChange(filters);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearFilter = () => {
    const clearedDateRange = { start: "", end: "" };
    const clearedSource = "all";
    
    setDateRange(clearedDateRange);
    setSourceFilter(clearedSource);
    
    if (onFilterChange) {
      const filters = { 
        dateRange: clearedDateRange,
        dateField
      };
      
      if (showSourceFilter) {
        filters.source = clearedSource;
      }
      
      onFilterChange(filters);
    }
  };

  // Check if apply button should be enabled
  const isApplyEnabled = !isApplying && (
    dateRange.start !== "" || 
    dateRange.end !== "" || 
    (showSourceFilter && sourceFilter !== "all")
  );

  const gridCols = showSourceFilter ? "md:grid-cols-5" : "md:grid-cols-4";

  return (
    <div 
      className={`border rounded-lg p-6 mb-6 transition-colors duration-300 ${
        isDark 
          ? "border-emerald-600/30 bg-gray-800/50" 
          : "border-emerald-200 bg-emerald-50/30"
      }`}
      role="region"
      aria-label="Date and Source Filters"
    >
      <div className={`grid grid-cols-1 ${gridCols} gap-4 items-end`}>
        {/* From Date Input */}
        <div className="md:col-span-1">
          <label 
            htmlFor="from-date"
            className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            From Date
          </label>
          <input
            id="from-date"
            type="date"
            value={dateRange.start}
            max={currentDate}
            onChange={(e) => handleDateChange("start", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-1 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isApplying}
          />
        </div>

        {/* To Date Input */}
        <div className="md:col-span-1">
          <label 
            htmlFor="to-date"
            className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            To Date
          </label>
          <input
            id="to-date"
            type="date"
            value={dateRange.end}
            min={dateRange.start || undefined}
            max={getMaxEndDate()}
            onChange={(e) => handleDateChange("end", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-1 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isApplying}
          />
        </div>

        {/* Source Filter - Conditionally Rendered */}
        {showSourceFilter && (
          <div className="md:col-span-1">
            <label 
              htmlFor="source-filter"
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Source Filter
            </label>
            <select
              id="source-filter"
              value={sourceFilter}
              onChange={(e) => handleSourceChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-1 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isApplying}
            >
              {sourceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Apply Button */}
        <div className="md:col-span-1">
          <button
            onClick={handleApplyFilter}
            disabled={!isApplyEnabled}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              isApplying 
                ? "animate-pulse bg-gray-400 text-white" 
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
            } shadow-lg hover:shadow-xl disabled:shadow-none`}
          >
            {isApplying ? "Applying..." : buttonLabels.apply}
          </button>
        </div>

        {/* Clear Button */}
        <div className="md:col-span-1">
          <button
            onClick={handleClearFilter}
            disabled={isApplying || !isApplyEnabled}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
            } shadow-lg hover:shadow-xl disabled:shadow-none`}
          >
            {buttonLabels.clear}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilter;