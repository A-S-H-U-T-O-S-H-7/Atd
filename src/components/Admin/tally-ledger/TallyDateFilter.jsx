import React, { useState } from "react";
import { Search, Calendar, Users } from "lucide-react";

const DateFilter = ({ 
  dateRange, 
  selectedAgent, 
  agents, 
  isDark, 
  onFilterChange, 
  onSearch 
}) => {
  const [localDateRange, setLocalDateRange] = useState(dateRange);
  const [localSelectedAgent, setLocalSelectedAgent] = useState(selectedAgent);

  const handleDateChange = (field, value) => {
    const newDateRange = { ...localDateRange, [field]: value };
    setLocalDateRange(newDateRange);
  };

  const handleAgentChange = (value) => {
    setLocalSelectedAgent(value);
  };

  const handleSearchClick = () => {
    onFilterChange({
      dateRange: localDateRange,
      selectedAgent: localSelectedAgent
    });
    onSearch();
  };

  const handleReset = () => {
    const resetDateRange = { from: "", to: "" };
    const resetAgent = "all";
    
    setLocalDateRange(resetDateRange);
    setLocalSelectedAgent(resetAgent);
    
    onFilterChange({
      dateRange: resetDateRange,
      selectedAgent: resetAgent
    });
  };

  return (
    <div className={`rounded-2xl p-6 mb-6 border-2 shadow-lg ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className={`w-5 h-5 ${
          isDark ? "text-emerald-400" : "text-emerald-600"
        }`} />
        <h3 className={`text-lg font-semibold ${
          isDark ? "text-gray-100" : "text-gray-900"
        }`}>
          Date Range Filter
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* From Date */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            From Date
          </label>
          <input
            type="date"
            value={localDateRange.from}
            onChange={(e) => handleDateChange('from', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          />
        </div>
        
        {/* To Date */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            To Date
          </label>
          <input
            type="date"
            value={localDateRange.to}
            onChange={(e) => handleDateChange('to', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          />
        </div>

        {/* Agent Dropdown */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Agent</span>
            </div>
          </label>
          <select
            value={localSelectedAgent}
            onChange={(e) => handleAgentChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          >
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="self-end">
          <button
            onClick={handleSearchClick}
            className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 ${
              isDark
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
            }`}
          >
            <Search size={16} />
            <span>Search</span>
          </button>
        </div>

        {/* Reset Button */}
        <div className="self-end">
          <button
            onClick={handleReset}
            className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 border-2 ${
              isDark
                ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilter;