"use client";
import React, { useState } from 'react';
import { ArrowLeft, Download, Upload, RefreshCw, FileText, Info } from 'lucide-react';
import FileUpload from './FileUpload';
import ExportDateFilter from '../ExportDateFilter';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { cibilExportAPI, formatCibilExportForCSV, createCibilExportCSV, downloadCSV } from '@/lib/services/CibilExportServices';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CibilReportPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
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

    // Validate date range
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    if (startDate > endDate) {
      toast.error('Start date cannot be after end date.', {
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
      
      const response = await cibilExportAPI.getCibilExportData(params);
      
      if (response && response.success) {
        const data = response.data || [];
        setExportData(data);
        
        const count = response.count || data.length;
        
        if (count === 0) {
          toast('No CIBIL records found for the selected date range.', {
            icon: 'ℹ️',
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.success(`Fetched ${count} CIBIL records successfully!`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else {
        throw new Error(response?.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error("Error fetching CIBIL export:", error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch CIBIL export data. Please try again.';
      toast.error(errorMessage, {
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
      
      const formattedData = formatCibilExportForCSV(exportData);
      
      if (formattedData.length === 0) {
        throw new Error('No valid data to export');
      }
      
      const csvContent = createCibilExportCSV(formattedData);
      
      const start = dateRange.start.replace(/-/g, '');
      const end = dateRange.end.replace(/-/g, '');
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const filename = `cibil-export-${start}-${end}-${timestamp}.csv`;
      
      const success = downloadCSV(csvContent, filename);
      
      if (success) {
        toast.success('CIBIL export downloaded successfully!', {
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      toast.error('Please select a valid Excel or CSV file.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const response = await cibilExportAPI.importCibilCSV(selectedFile);
      
      if (response && response.success) {
        const updatedCount = response.updated_count || 0;
        const notFound = response.not_found || [];
        
        let message = `CIBIL CSV imported successfully! ${updatedCount} records updated.`;
        if (notFound.length > 0) {
          message += ` ${notFound.length} records not found.`;
        }
        
        toast.success(message, {
          position: "top-right",
          autoClose: 4000,
        });
        
        setSelectedFile(null);
      } else {
        throw new Error(response?.message || 'Import failed');
      }
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to import CIBIL CSV. Please try again.';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearData = () => {
    setExportData(null);
    setDateRange({ start: '', end: '' });
    
    toast('Data cleared. Select new date range to fetch.', {
      icon: 'ℹ️',
      position: "top-right",
      autoClose: 3000,
    });
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    toast('File removed. You can select another file.', {
      icon: '🗑️',
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
                aria-label="Go back"
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>
                  CIBIL Report
                </h1>
                <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Export and import CIBIL reports
                </p>
              </div>
            </div>
            
            {exportData && (
              <button
                onClick={clearData}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto ${
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
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
          {/* Export Section */}
          <div className={`rounded-2xl border-2 backdrop-blur-sm ${
            isDark 
              ? "bg-gray-800/50 border-emerald-600/30" 
              : "bg-white/70 border-emerald-200"
          }`}>
            <div className={`border-b-2 p-4 sm:p-6 ${
              isDark ? "border-emerald-600/30" : "border-emerald-200"
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Download className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                <h2 className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  Export CIBIL Data
                </h2>
              </div>
              
              <div className="mb-4">
                <ExportDateFilter
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  isDark={isDark}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleFetchData}
                  disabled={!dateRange.start || !dateRange.end || loading}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="whitespace-nowrap">Fetching...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span className="whitespace-nowrap">Fetch Data</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleExport}
                  disabled={!exportData || exportData.length === 0 || exporting}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                  }`}
                >
                  {exporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="whitespace-nowrap">Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span className="whitespace-nowrap">Export CSV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Data Preview Section */}
            {exportData && (
              <div className={`p-4 sm:p-6 ${
                isDark ? "border-t border-emerald-600/30" : "border-t border-emerald-200"
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <h2 className={`text-lg font-semibold ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Data Preview
                  </h2>
                </div>
                
                <div className={`rounded-xl p-4 mb-4 ${
                  isDark ? "bg-gray-700/50" : "bg-emerald-50/50"
                }`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Date Range
                      </p>
                      <p className={`text-base font-bold ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}>
                        {dateRange.start} to {dateRange.end}
                      </p>
                    </div>
                    
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Total Records
                      </p>
                      <p className={`text-base font-bold ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}>
                        {exportData.length} records
                      </p>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <p className={`text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Customers
                      </p>
                      <p className={`text-sm line-clamp-2 ${
                        isDark ? "text-gray-200" : "text-gray-700"
                      }`}>
                        {exportData.map(item => item.consumer_name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-start gap-2 text-sm p-3 rounded-lg ${
                  isDark ? "bg-gray-800/30 text-gray-400" : "bg-emerald-100 text-gray-600"
                }`}>
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Ready to export. Click "Export CSV" to download the file with 64 columns.</p>
                </div>
              </div>
            )}
          </div>
  
          {/* Upload Section */}
          <div className={`rounded-2xl border-2 backdrop-blur-sm ${
            isDark 
              ? "bg-gray-800/50 border-emerald-600/30" 
              : "bg-white/70 border-emerald-200"
          }`}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <Upload className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                <h2 className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  Import CIBIL CSV
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="mb-4">
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    isDark={isDark}
                    onRemoveFile={removeSelectedFile}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <div className={`text-xs sm:text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    <p>Supports: .csv, .xlsx, .xls (Max 10MB)</p>
                  </div>
                  
                  {selectedFile && (
                    <button
                      onClick={handleImport}
                      disabled={isUploading}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        isDark
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="whitespace-nowrap">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span className="whitespace-nowrap">Import CSV</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section for Mobile */}
        <div className="mt-8 lg:hidden">
          <div className={`rounded-xl p-4 ${
            isDark ? "bg-gray-800/30 border border-emerald-600/30" : "bg-emerald-50 border border-emerald-200"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Info className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              <h3 className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                Quick Tips
              </h3>
            </div>
            <ul className={`text-sm space-y-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                <span>Export: Select date range → Fetch → Export CSV</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                <span>Import: Select CSV file → Import</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                <span>CSV exports contain 64 columns including all CIBIL fields</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CibilReportPage;