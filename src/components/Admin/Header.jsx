"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, LogOut, Sun, Moon, RefreshCw, User } from 'lucide-react';
import { useAdminAuth } from '@/lib/AdminAuthContext';

const AdminHeader = () => {
  const { user, isDark, toggleTheme, logout, refreshToken } = useAdminAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  const handleRefreshToken = async () => {
    setRefreshing(true);
    try {
      await refreshToken();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-4 md:px-6 py-4 border-b transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Left side - FIXED: Better responsive margins */}
      <div className="flex items-center ml-12 lg:ml-64">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>

      {/* Right side - FIXED: Better mobile spacing */}
      <div className="flex items-center gap-1 md:gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDark 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
        </button>

        <button
          onClick={handleRefreshToken}
          disabled={refreshing}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDark 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          } disabled:opacity-50`}
          title="Refresh token"
        >
          <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        <div className="relative dropdown-container">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 md:gap-3 p-2 rounded-lg transition-colors duration-200 ${
              isDark 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            {/* User info - hide on mobile */}
            <div className="text-right hidden md:block">
              <p className={`text-sm font-semibold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {user?.name || 'Admin'}
              </p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {user?.email}
              </p>
            </div>
            
            {/* Avatar */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user?.selfie ? (
                <img 
                  src={user.selfie} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </div>
            
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            } ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>

          {dropdownOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="py-2">
                {/* Show user info on mobile in dropdown */}
                <div className={`px-4 py-2 border-b md:hidden ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <p className={`text-sm font-semibold ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {user?.name || 'Admin'}
                  </p>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {user?.email}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-200 ${
                    isDark 
                      ? 'hover:bg-gray-700 text-red-400' 
                      : 'hover:bg-gray-100 text-red-600'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;