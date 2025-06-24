import React from "react";
import { Search, Building, Calendar } from "lucide-react";

const BankLedgerFilters = ({ 
  filters, 
  availableBanks, 
  onFilterChange, 
  onSearch, 
  isDark 
}) => {
  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className={`rounded-2xl shadow-lg border p-6 mb-6 ${
      isDark
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200"
    }`}>
      <div className="flex items-center space-x-2 mb-4">
        <Search className={`w-5 h-5 ${
          isDark ? "text-blue-400" : "text-blue-600"
        }`} />
        <h2 className={`text-lg font-semibold ${
          isDark ? "text-gray-100" : "text-gray-800"
        }`}>
          Search Box
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Bank Dropdown */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Bank
          </label>
          <div className="relative">
            <Building className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`} />
            <select
              value={filters.selectedBank}
              onChange={(e) => handleInputChange('selectedBank', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            >
              <option value="">Choose a Bank...</option>
              {availableBanks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Date From
          </label>
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`} />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Date To
          </label>
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`} />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleInputChange('dateTo', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="space-y-2">
          <label className="block text-sm font-medium opacity-0">Search</label>
          <button
            onClick={onSearch}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankLedgerFilters;