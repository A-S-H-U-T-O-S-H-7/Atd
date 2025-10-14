"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, LogOut, Sun, Moon, User } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { useRouter } from 'next/navigation'
const AdminHeader = () => {

  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAdminAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter()
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.replace("/crm");
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
    <header className={`fixed top-0 right-0 left-0 z-40 px-3 sm:px-4 md:px-6 py-3 sm:py-4 transition-all duration-300 ${theme === "dark"
      ? 'bg-gray-900 border-b border-gray-700 shadow-xl'
      : 'bg-[#ECFEFF] border-b border-emerald-400 shadow-sm backdrop-blur-md'
      }`}>
      <div className="flex items-center justify-end">
        {/* Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4">
          <button
            onClick={toggleTheme}
            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 ${theme === "dark"
              ? 'bg-gray-800/80 hover:bg-gray-700 text-emerald-400 border border-gray-700'
              : 'bg-emerald-100 hover:bg-emerald-100 text-emerald-600 border border-emerald-200'
              }`}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>

        {/* User dropdown - Enhanced mobile responsive */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 ${theme === "dark"
              ? 'bg-gray-800/80 hover:bg-gray-700 border border-gray-700'
              : 'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200'
              }`}
          >
            {/* User info - Enhanced mobile responsiveness */}
            <div className="text-right min-w-0 flex-shrink hidden sm:block">
              <p className={`text-xs sm:text-sm font-semibold truncate max-w-[80px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[200px] ${theme === "dark" ? 'text-white' : 'text-gray-800'
                }`}>
                {user?.name || 'Admin'}
              </p>
              <p className={`text-xs truncate max-w-[80px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[200px] ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {user?.email}
              </p>
            </div>

            {/* Avatar - Smaller on mobile */}
            <div className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${theme === "dark"
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-md'
              }`}>
              {user?.selfie ? (
                <img
                  src={user.selfie}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              )}
            </div>

            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''
              } ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>

          {/* Dropdown menu - Enhanced mobile positioning */}
          {dropdownOpen && (
            <div className={`absolute right-0 mt-2 w-48 sm:w-56 rounded-xl shadow-xl border z-50 ${theme === "dark"
              ? 'bg-gray-800/95 border-gray-700'
              : 'bg-white/95 border-emerald-200'
              } backdrop-blur-md`}>
              <div className="py-2">
                {/* User info section - Enhanced mobile display */}
                <div className={`px-3 sm:px-4 py-2 sm:py-3 border-b ${theme === "dark" ? 'border-gray-700' : 'border-emerald-100'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold ${theme === "dark"
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                      }`}>
                      {user?.selfie ? (
                        <img
                          src={user.selfie}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${theme === "dark" ? 'text-white' : 'text-gray-800'
                        }`}>
                        {user?.name || 'Admin'}
                      </p>
                      <p className={`text-xs truncate mt-0.5 ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout button - Enhanced styling */}
                <button
                  onClick={handleLogout}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-3 transition-all duration-200 rounded-b-xl font-medium ${theme === "dark"
                    ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                    : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                    }`}
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Logout</span>
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