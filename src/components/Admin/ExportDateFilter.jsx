import React from 'react';
import { Calendar } from 'lucide-react';

const ExportDateFilter = ({ 
  dateRange, 
  onDateRangeChange, 
  isDark, 
  title = "Date Range",
  showLabel = true 
}) => {
  const handleStartDateChange = (e) => {
    onDateRangeChange({ ...dateRange, start: e.target.value });
  };

  const handleEndDateChange = (e) => {
    onDateRangeChange({ ...dateRange, end: e.target.value });
  };

  return (
    <div className="space-y-4">
      {showLabel && (
        <label className={`block text-sm font-medium ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}>
          {title}
        </label>
      )}
      
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`} />
          <input
            type="date"
            value={dateRange.start}
            onChange={handleStartDateChange}
            placeholder="Start Date"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
              isDark
                ? "bg-gray-700/50 border-gray-600 text-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-400"
                : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-500"
            }`}
          />
        </div>
        
        <div className={`px-3 py-2 font-medium ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}>
          to
        </div>
        
        <div className="flex-1 relative">
          <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`} />
          <input
            type="date"
            value={dateRange.end}
            onChange={handleEndDateChange}
            placeholder="End Date"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
              isDark
                ? "bg-gray-700/50 border-gray-600 text-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-400"
                : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ExportDateFilter;