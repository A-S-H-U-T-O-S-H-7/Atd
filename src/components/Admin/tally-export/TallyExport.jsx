"use client"
import React, { useState } from 'react';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import ExportDateFilter from '../ExportDateFilter';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { tallyExportAPI, formatTallyExportForCSV, createTallyExportCSV, downloadCSV } from '@/lib/services/TallyExportServices';
import Swal from 'sweetalert2';
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
    toast.error('Please select both start and end dates.', {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  try {
    setLoading(true);
    
    const params = {
      from_date: dateRange.start,
      to_date: dateRange.end
    };
    
    
    const response = await tallyExportAPI.getTallyExportData(params);
    
    if (response && response.success) {
      const data = response.data || [];
      setExportData(data);
      
      // Count total entries
      const totalEntries = data.reduce((total, group) => total + (group?.length || 0), 0);
      
      toast.success(`Fetched ${totalEntries} tally entries successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      throw new Error(response?.message || 'Failed to fetch data');
    }
  } catch (error) {
    console.error("Error fetching tally export:", error);
    
    toast.error(error.message || 'Failed to fetch tally export data. Please try again.', {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    setLoading(false);
  }
};

  const handleExport = async () => {
  if (!exportData || exportData.length === 0) {
    toast.error('Please fetch data first before exporting.', {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  try {
    setExporting(true);
    
    // Format data for CSV
    const formattedData = formatTallyExportForCSV(exportData);
    
    if (formattedData.length === 0) {
      throw new Error('No valid data to export');
    }
    
    // Create CSV content
    const csvContent = createTallyExportCSV(formattedData);
    
    // Generate filename with date range
    const start = dateRange.start.replace(/-/g, '');
    const end = dateRange.end.replace(/-/g, '');
    const filename = `tally-export-${start}-to-${end}.csv`;
    
    // Download CSV
    const success = downloadCSV(csvContent, filename);
    
    if (success) {
      toast.success('Tally export downloaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      throw new Error('Failed to download CSV');
    }
  } catch (error) {
    console.error("Export error:", error);
    toast.error(error.message || 'Failed to export data. Please try again.', {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    setExporting(false);
  }
};

  const clearData = () => {
    setExportData(null);
    setDateRange({ start: '', end: '' });
    toast.success('Data cleared. Select new date range to fetch.', {
  position: "top-right",
  autoClose: 3000,
});
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Tally Export
              </h1>
            </div>
            
            {exportData && (
              <button
                onClick={clearData}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear Data</span>
              </button>
            )}
          </div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          {/* Date Filter Section */}
          <div className={`rounded-2xl border-2 backdrop-blur-sm mb-6 ${
            isDark 
              ? "bg-gray-800/50 border-emerald-600/30" 
              : "bg-white/70 border-emerald-200"
          }`}>
            <div className={`border-b-2 p-6 ${
              isDark ? "border-emerald-600/30" : "border-emerald-200"
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}>
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
                  className={`flex cursor-pointer items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg w-full sm:w-auto ${
                    (!dateRange.start || !dateRange.end || loading)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
                  }`}
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
                  className={`flex cursor-pointer items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg w-full sm:w-auto ${
                    (!exportData || exportData.length === 0 || exporting)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                  }`}
                >
                  {exporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Data Preview Section */}
            {exportData && (
              <div className={`p-6 ${
                isDark ? "border-t border-emerald-600/30" : "border-t border-emerald-200"
              }`}>
                <h2 className={`text-lg font-semibold mb-4 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  Data Preview
                </h2>
                
                <div className={`rounded-lg p-4 mb-4 ${
                  isDark ? "bg-gray-700/50" : "bg-emerald-50/50"
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Date Range:
                      </p>
                      <p className={`text-lg font-bold ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}>
                        {dateRange.start} to {dateRange.end}
                      </p>
                    </div>
                    
                    <div>
                      <p className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Total Entries:
                      </p>
                      <p className={`text-lg font-bold ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}>
                        {exportData.reduce((total, group) => total + (group?.length || 0), 0)} entries
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <p className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Loan Accounts:
                      </p>
                      <p className={`text-sm ${
                        isDark ? "text-gray-200" : "text-gray-700"
                      }`}>
                        {Array.from(new Set(exportData.flatMap(group => 
                          group.map(entry => entry.invoice_number).filter(Boolean)
                        ))).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  <p>Ready to export. Click "Export CSV" to download the file.</p>
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