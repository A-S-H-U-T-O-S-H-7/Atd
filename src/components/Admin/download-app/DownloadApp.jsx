"use client";
import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import DownloadedAppTable from "./DownloadAppTable";
import DateRangeFilter from "../DateRangeFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import AdvancedSearchBar from "../AdvanceSearchBar";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";

const DownloadedAppPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });

  // Sample downloaded app data
  const [downloadedAppData, setDownloadedAppData] = useState([
    {
      id: 458745,
      sn: 1,
      phone: "9549431207",
      downloadDate: "08-07-2025",
      downloadTime: "10:30 AM"
    },
    {
      id: 458744,
      sn: 2,
      phone: "8690746677",
      downloadDate: "08-07-2025",
      downloadTime: "11:15 AM"
    },
    {
      id: 458743,
      sn: 3,
      phone: "9909842205",
      downloadDate: "08-07-2025",
      downloadTime: "12:45 PM"
    },
    {
      id: 458742,
      sn: 4,
      phone: "7413003321",
      downloadDate: "08-07-2025",
      downloadTime: "02:20 PM"
    },
    {
      id: 458741,
      sn: 5,
      phone: "8860339049",
      downloadDate: "08-07-2025",
      downloadTime: "03:30 PM"
    },
    {
      id: 458740,
      sn: 6,
      phone: "9614811099",
      downloadDate: "08-07-2025",
      downloadTime: "04:15 PM"
    },
    {
      id: 458739,
      sn: 7,
      phone: "9668450908",
      downloadDate: "08-07-2025",
      downloadTime: "05:00 PM"
    },
    {
      id: 458738,
      sn: 8,
      phone: "7994737423",
      downloadDate: "08-07-2025",
      downloadTime: "06:30 PM"
    }
  ]);

  const searchOptions = [
    { value: 'phone', label: 'Mobile Number' }
  ];

  const itemsPerPage = 10;

  const filteredDownloadedAppData = downloadedAppData.filter(item => {
    // Advanced search filter (only mobile number)
    const matchesAdvancedSearch = (() => {
      if (!advancedSearch.field || !advancedSearch.term) return true;
      
      const fieldValue = item[advancedSearch.field]?.toString().toLowerCase() || '';
      return fieldValue.includes(advancedSearch.term.toLowerCase());
    })();
    
    // Date range filtering
    const matchesDateRange = (() => {
      if (!dateRange.start && !dateRange.end) return true;
      
      const itemDate = new Date(item.downloadDate.split('-').reverse().join('-'));
      const fromDate = dateRange.start ? new Date(dateRange.start) : null;
      const toDate = dateRange.end ? new Date(dateRange.end) : null;
      
      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      return true;
    })();

    return matchesAdvancedSearch && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredDownloadedAppData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDownloadedAppData = filteredDownloadedAppData.slice(startIndex, startIndex + itemsPerPage);

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
    setCurrentPage(1);
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredDownloadedAppData.map(item => ({
      'SN': item.sn,
      'Mobile Number': item.phone,
      'Download Date': item.downloadDate,
      'Download Time': item.downloadTime
    }));

    exportToExcel(dataToExport, 'Downloaded_App_Data');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
              onClick={()=>router.back()}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
              }`}>
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <div className="flex items-center space-x-3">
                
                <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>
                  Downloaded App Data
                </h1>
              </div>
            </div>
            
            <button
              onClick={handleExportToExcel}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
              } shadow-lg hover:shadow-xl`}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Date Range Filter */}
          <DateRangeFilter
            isDark={isDark}
            onFilterChange={handleFilterChange}
          />

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <AdvancedSearchBar
                searchOptions={searchOptions}
                onSearch={handleAdvancedSearch}
                placeholder="Search by mobile number..."
                defaultSearchField="phone"
              />
            </div>
          </div>

          {/* Total Records */}
          <div className="mb-4">
            <p className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Total Records: {filteredDownloadedAppData.length}
            </p>
          </div>
        </div>

        {/* Table */}
        <DownloadedAppTable
          paginatedDownloadedAppData={paginatedDownloadedAppData}
          filteredDownloadedAppData={filteredDownloadedAppData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DownloadedAppPage;