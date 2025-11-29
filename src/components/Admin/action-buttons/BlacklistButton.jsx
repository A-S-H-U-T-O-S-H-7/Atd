"use client";
import React, { useState } from 'react';
import { Ban, Loader2, CheckCircle2 } from 'lucide-react';
import blacklistService from '@/lib/services/BlackListService';

const BlacklistButton = ({
  userId,
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
    if (!userId || isBlacklisted || disabled) {
      return;
    }

    setLoading(true);
    
    try {
      await blacklistService.blacklistApplication(userId, {
        isDark,
        showConfirmation: true,
        onSuccess: (data) => {
          setIsBlacklisted(true);
          if (onSuccess) onSuccess(data);
        },
        onError: (error, errorMessage) => {
          if (onError) onError(error, errorMessage);
        }
      });
    } catch (error) {
      if (onError) onError(error, 'Blacklist process failed');
    } finally {
      setLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    default: 'px-2 py-1 text-sm',
    large: 'px-5 py-3 text-base'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-4 h-4'
  };

  // Variant classes for active state
  const variantClasses = {
    default: isDark 
      ? 'bg-gradient-to-r from-rose-200 to-red-300 border border-red-600 hover:bg-red-300 text-red-800' 
      : 'bg-gradient-to-r from-rose-100 to-red-200 border border-red-600 hover:bg-red-300 text-red-600',

    outline: isDark
      ? 'border border-red-500 hover:bg-red-900/40 text-red-300'
      : 'border border-red-500 hover:bg-red-50 text-red-600',
    solid: 'bg-red-600 hover:bg-red-700 text-white border border-red-600'
  };

  // Variant classes for blacklisted state
  const blacklistedVariantClasses = {
    default: isDark 
      ? 'bg-gradient-to-r from-red-500 to-red-600 border border-red-600 text-red-100' 
      : 'bg-gradient-to-r from-red-500 to-red-600 border border-red-600 text-red-100',
    outline: isDark
      ? 'border border-gray-500 bg-red-800/50 text-gray-400'
      : 'border border-gray-400 bg-red-100 text-gray-600',
    solid: 'bg-gray-500 border border-gray-500 text-white'
  };

  const baseClasses = `rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
    sizeClasses[size]
  } ${className}`;

  const activeClasses = `${baseClasses} ${
    variantClasses[variant]
  } ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md active:scale-95'
  }`;

  const blacklistedClasses = `${baseClasses} ${
    blacklistedVariantClasses[variant]
  } cursor-default opacity-100`;

  if (isBlacklisted) {
    return (
      <button
        disabled
        className={blacklistedClasses}
      >
        {showIcon && <CheckCircle2 className={`${iconSizes[size]} flex-shrink-0`} />}
        <span className="font-semibold">Blacklisted</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleBlacklist}
      disabled={loading || disabled}
      className={activeClasses}
    >
      {loading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin flex-shrink-0`} />
      ) : (
        showIcon && <Ban className={`${iconSizes[size]} flex-shrink-0`} />
      )}
      <span className="font-semibold">
        {loading ? 'Processing...' : (children || 'Blacklist')}
      </span>
    </button>
  );
};

export default BlacklistButton;