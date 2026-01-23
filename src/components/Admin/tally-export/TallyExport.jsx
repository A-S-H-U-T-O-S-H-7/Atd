"use client"
import React, { useState } from 'react';
import { ArrowLeft, Download, Calendar } from 'lucide-react';
import ExportDateFilter from '../ExportDateFilter';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { exportTallyDataDirect } from '@/lib/services/TallyExportServices';
import toast from 'react-hot-toast';

const TallyExport = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  const handleDirectExport = async () => {
    if (!dateRange.start || !dateRange.end) {
      toast.error('Select both start and end dates.', { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      setExporting(true);
      
      // Use the direct export function
      const result = await exportTallyDataDirect(dateRange);
      
      toast.success(`File downloaded: ${result.filename}`, { 
        position: "top-right", 
        autoClose: 3000 
      });
      
    } catch (error) {
      toast.error(error.message || 'Failed to export. Try again.', { 
        position: "top-right", 
        autoClose: 3000 
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className={`p-3 rounded-xl hover:scale-105 ${
                  isDark ? "hover:bg-gray-800 bg-gray-800/50 border-emerald-600/30" : "hover:bg-emerald-50 bg-emerald-50/50 border-emerald-200"
                } border transition-all duration-200`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </button>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"} bg-clip-text text-transparent`}>
                Tally Export
              </h1>
            </div>
          </div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          <div className={`rounded-2xl border-2 backdrop-blur-sm ${
            isDark ? "bg-gray-800/50 border-emerald-600/30" : "bg-white/70 border-emerald-200"
          }`}>
            <div className={`border-b-2 p-6 ${isDark ? "border-emerald-600/30" : "border-emerald-200"}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                Direct Excel Export
              </h2>
              
              <div className="mb-6">
                
                
                <ExportDateFilter
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  isDark={isDark}
                />
              </div>
              
              <div className="pt-6">
                <button
                  onClick={handleDirectExport}
                  disabled={!dateRange.start || !dateRange.end || exporting}
                  className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-medium hover:scale-105 shadow-lg w-full transition-all duration-200 ${
                    (!dateRange.start || !dateRange.end || exporting) ? 'opacity-50 cursor-not-allowed' : ''
                  } ${isDark ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"}`}
                >
                  {exporting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-lg">Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      <span className="text-lg">Export Excel File</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default TallyExport;