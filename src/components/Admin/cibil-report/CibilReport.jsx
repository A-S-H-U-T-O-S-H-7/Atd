"use client"
import React, { useState } from 'react';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import FileUpload from './FileUpload';
import ExportDateFilter from '../ExportDateFilter';
import { useAdminAuth } from "@/lib/AdminAuthContext";


const CibilReportPage = () => {
  const { isDark } = useAdminAuth();
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
  
    const handleExport = () => {
      console.log('Exporting CIBIL reports with date range:', dateRange);
    };
  
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
    };
  
    const handleImport = async () => {
      if (selectedFile) {
        setIsUploading(true);
        console.log('Importing file:', selectedFile.name);
        
        setTimeout(() => {
          setIsUploading(false);
          setSelectedFile(null);
        }, 2000);
      }
    };
  
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <button className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
              }`}>
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Cibil Report
              </h1>
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
                Date
              </h2>
              
              <ExportDateFilter
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                isDark={isDark}
              />
              
              <div className="flex  justify-end pt-6">
                <button
                  onClick={handleExport}
                  className={`flex cursor-pointer items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
  
          {/* Upload Section */}
          <div className={`rounded-2xl border-2 backdrop-blur-sm ${
            isDark 
              ? "bg-gray-800/50 border-emerald-600/30" 
              : "bg-white/70 border-emerald-200"
          }`}>
            <div className="p-6">
              <h2 className={`text-lg font-semibold mb-6 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}>
                Upload Cibil
              </h2>
              
              <div className="space-y-6">
                {/* CHANGED: SimpleFileUpload to FileUpload */}
                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  isDark={isDark}
                />
                
                {selectedFile && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleImport}
                      disabled={isUploading}
                      className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Import</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CibilReportPage;