'use client'
import { useThemeStore } from '@/lib/store/useThemeStore';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  className = ""
}) => {
  const { theme, toggletheme } = useThemeStore();

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full pl-4 pr-4 py-3 rounded-lg transition-all duration-200 ${theme === "dark"
          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400'
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
          } border focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
      />
    </div>
  );
};

export default SearchBar;