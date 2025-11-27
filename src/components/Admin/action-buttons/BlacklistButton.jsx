"use client";
import React, { useState } from 'react';
import { Ban, Loader2 } from 'lucide-react';
import blacklistService from '@/lib/services/BlackListService';
import { debugBlacklist } from '@/lib/services/BlackListService';

const BlacklistButton = ({
  applicationId,
  application,
  isDark = false,
  size = 'default',
  variant = 'default',
  showIcon = true,
  onSuccess,
  onError,
  className = '',
  disabled = false,
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(
    blacklistService.isBlacklisted(application || {})
  );

  const handleBlacklist = async () => {
    if (!applicationId || isBlacklisted || disabled) return;

    console.log('🧪 Starting blacklist process...');
    console.log('Application ID:', applicationId);
    console.log('Application object:', application);

    setLoading(true);
    
    try {
      // First, test with the actual service (not debug)
      console.log('🚀 Calling blacklist service...');
      
      const result = await blacklistService.blacklistApplication(applicationId, {
        isDark,
        showConfirmation: true,
        onSuccess: (data) => {
          console.log('✅ Blacklist success in service:', data);
          setIsBlacklisted(true);
          if (onSuccess) onSuccess(data);
        },
        onError: (error, errorMessage) => {
          console.log('❌ Blacklist error in service:', errorMessage);
          if (onError) onError(error, errorMessage);
        }
      });
      
      console.log('🎯 Blacklist completed:', result);
      
    } catch (error) {
      console.error('💥 Final error in button:', error);
      if (onError) onError(error, 'Blacklist process failed');
    } finally {
      setLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1 text-xs',
    default: 'px-4 py-2 text-sm',
    large: 'px-5 py-3 text-base'
  };

  // Variant classes
  const variantClasses = {
    default: isDark 
      ? 'bg-red-900/50 border border-red-700 hover:bg-red-800 text-red-300' 
      : 'bg-red-100 border border-red-200 hover:bg-red-200 text-red-700',
    outline: isDark
      ? 'border border-red-600 hover:bg-red-900/30 text-red-400'
      : 'border border-red-300 hover:bg-red-50 text-red-600',
    solid: 'bg-red-600 hover:bg-red-700 text-white border border-red-600'
  };

  const baseClasses = `rounded font-medium transition-colors duration-200 cursor-pointer flex items-center justify-center space-x-2 ${
    sizeClasses[size]
  } ${variantClasses[variant]} ${
    disabled || isBlacklisted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
  } ${className}`;

  if (isBlacklisted) {
    return (
      <button
        disabled
        className={`${baseClasses} ${
          isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
        }`}
      >
        {showIcon && <Ban className="w-3 h-3" />}
        <span>Blacklisted</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleBlacklist}
      disabled={loading || disabled}
      className={baseClasses}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        showIcon && <Ban className="w-3 h-3" />
      )}
      <span>
        {loading ? 'Processing...' : (children || 'Blacklist')}
      </span>
    </button>
  );
};

export default BlacklistButton;