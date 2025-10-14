'use client'
import { useState, useRef, useEffect } from 'react'
import { useThemeStore } from '@/lib/store/useThemeStore';

const AdvancedSearchBar = ({ 
  searchOptions = [],
  onSearch,
  placeholder = "Enter search term...",
  className = "",
  defaultSearchField
}) => {
 const { theme } = useThemeStore();
   const isDark = theme === "dark";
  const [selectedField, setSelectedField] = useState(defaultSearchField || searchOptions[0]?.value || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() && onSearch) {
      onSearch({
        field: selectedField,
        term: searchTerm.trim()
      });
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedField(defaultSearchField || searchOptions[0]?.value || '');
    // Optionally call onSearch with empty values to clear results
    if (onSearch) {
      onSearch({
        field: defaultSearchField || searchOptions[0]?.value || '',
        term: ''
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getSelectedLabel = () => {
    const option = searchOptions.find(opt => opt.value === selectedField);
    return option?.label || 'Select Field';
  };

  const getPlaceholderText = () => {
    const option = searchOptions.find(opt => opt.value === selectedField);
    return option ? `Enter ${option.label.toLowerCase()}...` : placeholder;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Dropdown for field selection */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-between ${
            isDark 
              ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        >
          <span className="text-sm font-medium">{getSelectedLabel()}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className={`absolute top-full left-0 mt-1 w-full rounded-lg border shadow-lg z-50 ${
            isDark 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-300'
          }`}>
            {searchOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelectedField(option.value);
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  selectedField === option.value
                    ? (isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700')
                    : (isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50')
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search input */}
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder={getPlaceholderText()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`w-full pl-4 pr-4 py-3 rounded-lg border transition-all duration-200 ${
            isDark 
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
          } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
        />
      </div>

      

      {/* Search button */}
      <button
        type="button"
        onClick={handleSearch}
        disabled={!searchTerm.trim()}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${
          !searchTerm.trim()
            ? (isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search</span>
        </div>
      </button>


      {/* Clear button */}
      <button
        type="button"
        onClick={handleClear}
        disabled={!searchTerm.trim()}
        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-gray-500/20 focus:outline-none ${
          !searchTerm.trim()
            ? (isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
            : (isDark ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-500 text-white hover:bg-gray-600')
        }`}
        title="Clear search"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Clear</span>
        </div>
      </button>
    </div>
  );
};

export default AdvancedSearchBar;