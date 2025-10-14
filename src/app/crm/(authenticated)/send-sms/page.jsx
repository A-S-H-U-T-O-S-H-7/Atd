'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import SendSMSCard from '@/components/Admin/sms/SmsCard';
import ExportMobileCard from '@/components/Admin/sms/MobileCard';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';

const SMSSendPage = () => {
const { theme } = useThemeStore();
 const isDark = theme === "dark";
   const router = useRouter();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-emerald-50/30'}`}>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
            onClick={()=>router.back()}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? 'hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30'
                  : 'hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200'
              }`}
            >
              <ArrowLeft
                className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
              />
            </button>
            <h1
              className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark
                  ? 'from-emerald-400 to-teal-400'
                  : 'from-gray-800 to-gray-700'
              } bg-clip-text text-transparent`}
            >
              Send SMS
            </h1>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExportMobileCard isDark={isDark} />
          <SendSMSCard isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

export default SMSSendPage;