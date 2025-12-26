'use client';
import React from 'react';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { Lock } from 'lucide-react';

const PermissionWrapper = ({ 
  permissionKey, 
  children, 
  showTooltip = true,
  tooltipText = "No permission"
}) => {
  const { hasPermission } = useAdminAuthStore();
  
  if (hasPermission(permissionKey)) {
    return children;
  }
  
  return (
    <div className="relative group">
      {/* Disabled content */}
      <div className="opacity-40 cursor-not-allowed pointer-events-none">
        {children}
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {tooltipText}
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default PermissionWrapper;