'use client';

import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { FaLock } from 'react-icons/fa';

export default function AccessDeniedPage() {
  const router = useRouter();
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';

  return (
    <div
      className={` flex items-center justify-center pt-20 px-4 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div
        className={`max-w-md w-full text-center p-8 rounded-2xl shadow-xl backdrop-blur-sm transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800/90 border border-gray-700'
            : 'bg-white/90 border border-gray-200'
        }`}
      >
        {/* Icon */}
        <div
          className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDark
              ? 'bg-red-900/30 text-red-400'
              : 'bg-red-100 text-red-500'
          }`}
        >
          <FaLock className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1
          className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}
        >
          Access Denied
        </h1>

        {/* Description */}
        <p
          className={`mb-8 text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          You don&apos;t have permission to access this page.
          <br />
          Please contact your administrator if you believe this is an error.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/crm/dashboard')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => {
              if (window.history.length > 1) router.back();
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
