"use client"
import React, { useState } from 'react';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import ExportDateFilter from '../ExportDateFilter';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { tallyExportAPI, exportTallyDataToExcel } from '@/lib/services/TallyExportServices';
import toast from 'react-hot-toast';

const TallyExport = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState(null);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  const handleFetchData = async () => {
    if (!dateRange.start || !dateRange.end) {
      toast.error('Select both start and end dates.', { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);
      const params = { from_date: dateRange.start, to_date: dateRange.end };
      const response = await tallyExportAPI.getTallyExportData(params);
      
      if (response?.success) {
        const data = response.data || [];
        setExportData(data);
        const totalEntries = data.reduce((total, group) => total + (group?.length || 0), 0);
        toast.success(`Fetched ${totalEntries} tally entries!`, { position: "top-right", autoClose: 3000 });
      } else {
        throw new Error(response?.message || 'Failed to fetch data');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch data. Try again.', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!exportData || exportData.length === 0) {
      toast.error('Fetch data first before exporting.', { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      setExporting(true);
      const result = exportTallyDataToExcel(exportData, dateRange);
      toast.success(`Exported ${result.count} entries to: ${result.filename}`, { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error.message || 'Failed to export. Try again.', { position: "top-right", autoClose: 3000 });
    } finally {
      setExporting(false);
    }
  };

  const clearData = () => {
    setExportData(null);
    setDateRange({ start: '', end: '' });
    toast.success('Data cleared. Select new date range.', { position: "top-right", autoClose: 3000 });
  };

  const totalEntries = exportData ? exportData.reduce((total, group) => total + (group?.length || 0), 0) : 0;

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
            
            {exportData && (
              <button
                onClick={clearData}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear Data</span>
              </button>
            )}
          </div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          <div className={`rounded-2xl border-2 backdrop-blur-sm mb-6 ${
            isDark ? "bg-gray-800/50 border-emerald-600/30" : "bg-white/70 border-emerald-200"
          }`}>
            <div className={`border-b-2 p-6 ${isDark ? "border-emerald-600/30" : "border-emerald-200"}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                Date Range Selection
              </h2>
              
              <ExportDateFilter
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                isDark={isDark}
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
                <button
                  onClick={handleFetchData}
                  disabled={!dateRange.start || !dateRange.end || loading}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium hover:scale-105 shadow-lg w-full sm:w-auto transition-all duration-200 ${
                    (!dateRange.start || !dateRange.end || loading) ? 'opacity-50 cursor-not-allowed' : ''
                  } ${isDark ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20" : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"}`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Fetch Data</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleExport}
                  disabled={!exportData || exportData.length === 0 || exporting}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium hover:scale-105 shadow-lg w-full sm:w-auto transition-all duration-200 ${
                    (!exportData || exportData.length === 0 || exporting) ? 'opacity-50 cursor-not-allowed' : ''
                  } ${isDark ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"}`}
                >
                  {exporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export Excel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {exportData && (
              <div className={`p-6 ${isDark ? "border-t border-emerald-600/30" : "border-t border-emerald-200"}`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  Data Preview
                </h2>
                
                <div className={`rounded-lg p-4 mb-4 ${isDark ? "bg-gray-700/50" : "bg-emerald-50/50"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Date Range:
                      </p>
                      <p className={`text-lg font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        {dateRange.start} to {dateRange.end}
                      </p>
                    </div>
                    
                    <div>
                      <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Total Entries:
                      </p>
                      <p className={`text-lg font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        {totalEntries} entries
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <p>Ready to export. Click "Export Excel" to download the file.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TallyExport;