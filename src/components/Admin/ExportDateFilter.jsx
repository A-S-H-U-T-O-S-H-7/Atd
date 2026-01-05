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
        <label className={`block text-sm font-medium mb-2 ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}>
          {title}
        </label>
      )}
      
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        {/* Start Date Input */}
        <div className="flex-1">
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`} />
            <input
              type="date"
              value={dateRange.start}
              onChange={handleStartDateChange}
              placeholder="Start Date"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
                isDark
                  ? "bg-gray-700/50 border-gray-600 text-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-400"
                  : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-500"
              }`}
            />
            <span className={`absolute -top-2 left-2 px-1 text-xs font-medium sm:hidden ${
              isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
            }`}>
              From
            </span>
          </div>
        </div>
        
        {/* Desktop Separator */}
        <div className={`hidden sm:flex items-center justify-center px-2 font-medium ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}>
          to
        </div>
        
        {/* End Date Input */}
        <div className="flex-1">
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`} />
            <input
              type="date"
              value={dateRange.end}
              onChange={handleEndDateChange}
              placeholder="End Date"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
                isDark
                  ? "bg-gray-700/50 border-gray-600 text-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-400"
                  : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder-gray-500"
              }`}
            />
            <span className={`absolute -top-2 left-2 px-1 text-xs font-medium sm:hidden ${
              isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
            }`}>
              To
            </span>
          </div>
        </div>
      </div>
      
      {/* Mobile Separator - Better placement */}
      <div className={`text-center text-sm font-medium sm:hidden ${
        isDark ? "text-gray-400" : "text-gray-500"
      }`}>
        to
      </div>
    </div>
  );
};

export default ExportDateFilter;