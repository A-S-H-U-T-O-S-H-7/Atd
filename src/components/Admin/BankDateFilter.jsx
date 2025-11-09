import React, { useState } from "react";
import { Search, Calendar, Building, RotateCcw } from "lucide-react";

const BankDateFilter = ({ 
  dateRange, 
  selectedBank, 
  banks, 
  isDark, 
  onFilterChange, 
  onSearch 
}) => {
  const [localDateRange, setLocalDateRange] = useState(dateRange);
  const [localSelectedBank, setLocalSelectedBank] = useState(selectedBank);

  const handleDateChange = (field, value) => {
    const newDateRange = { ...localDateRange, [field]: value };
    setLocalDateRange(newDateRange);
  };

  const handleBankChange = (value) => {
    setLocalSelectedBank(value);
  };

  const handleSearchClick = () => {
    onFilterChange({
      dateRange: localDateRange,
      selectedBank: localSelectedBank
    });
    onSearch();
  };

  const handleReset = () => {
    const resetDateRange = { from: "", to: "" };
    const resetBank = "all";
    
    setLocalDateRange(resetDateRange);
    setLocalSelectedBank(resetBank);
    
    onFilterChange({
      dateRange: resetDateRange,
      selectedBank: resetBank
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* From Date */}
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            From Date
          </label>
          <input
            type="date"
            value={localDateRange.from}
            onChange={(e) => handleDateChange('from', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
              isDark
                ? "bg-gray-700/50 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
          />
        </div>
        
        {/* To Date */}
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            To Date
          </label>
          <input
            type="date"
            value={localDateRange.to}
            onChange={(e) => handleDateChange('to', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
              isDark
                ? "bg-gray-700/50 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
          />
        </div>

        {/* Bank Dropdown */}
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            <div className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              <span>Bank</span>
            </div>
          </label>
          <select
            value={localSelectedBank}
            onChange={(e) => handleBankChange(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
              isDark
                ? "bg-gray-700/50 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
          >
            {banks.map(bank => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleReset}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border flex items-center gap-2 ${
            isDark
              ? "border-gray-600 bg-gray-700/50 hover:bg-gray-600 text-gray-300"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
          }`}
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        <button
          onClick={handleSearchClick}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${
            isDark
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          <Search size={14} />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default BankDateFilter;