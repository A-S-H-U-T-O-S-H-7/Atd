import React from 'react';
import { Heart } from 'lucide-react';
import { useAdminAuth } from '@/lib/AdminAuthContext';

const Footer = () => {
      const {isDark } = useAdminAuth();
    
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-2 px-4 border-t transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-700 text-gray-300' 
        : 'bg-gray-100 border-emerald-400 text-gray-600'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Made with love section */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Made with
            </span>
            <Heart 
              className="w-4 h-4 text-red-500 fill-current animate-pulse" 
              aria-label="love"
            />
            <span className={`text-sm font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              by Ashutosh
            </span>
          </div>
          
          {/* Copyright section */}
          <div className={`text-xs ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            © {currentYear} All Time Data. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;