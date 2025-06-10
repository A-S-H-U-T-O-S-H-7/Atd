'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { FaHome, FaBox } from 'react-icons/fa';
import { useAdminAuth } from '@/lib/AdminAuthContext';

const menuList = [
  { name: 'Dashboard', link: '/crm/dashboard', icon: <FaHome /> },
  { name: 'Products', link: '/crm/products', icon: <FaBox /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, isDark } = useAdminAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-4 left-4 z-[60] lg:hidden p-2 rounded-lg ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } shadow-lg`}
      >
        {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full shadow-lg z-50 transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 text-white border-r border-gray-700' 
            : 'bg-white text-gray-900 border-r border-gray-200'
        } ${
          // Mobile: show/hide based on isMobileOpen
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          // Desktop: expand on hover
          isExpanded ? 'w-64' : 'w-16 md:w-20'
        } flex flex-col overflow-hidden`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <Link 
          href="/crm/dashboard" 
          className={`flex items-center px-4 py-5 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
          onClick={() => setIsMobileOpen(false)}
        >
          <img src="/flame1.png" alt="Logo" className="w-10 h-10" />
          {(isExpanded || isMobileOpen) && (
            <span className="ml-3 text-lg font-bold">ATD</span>
          )}
        </Link>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col py-4 px-2">
            {menuList.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className={`flex items-center gap-4 px-4 py-3 mx-2 rounded-lg transition-all font-medium mb-1 ${
                  pathname === item.link
                    ? 'bg-blue-600 text-white shadow-lg'
                    : isDark
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="text-xl flex-shrink-0">{item.icon}</div>
                {(isExpanded || isMobileOpen) && (
                  <span className="text-base whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout
        <div className={`px-2 py-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 mx-2 rounded-lg transition-all ${
              isDark
                ? 'text-red-400 hover:bg-red-900/20'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <FiLogOut className="text-xl flex-shrink-0" />
            {(isExpanded || isMobileOpen) && (
              <span className="text-base">Logout</span>
            )}
          </button>
        </div> */}
      </div>
    </>
  );
}
