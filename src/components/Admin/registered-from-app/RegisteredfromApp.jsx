"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import RegisteredAppTable from "./RegisteredAppTable";
import DateFilter from "../AgentDateFilter";
import AdvancedSearchBar from "../AdvanceSearchBar";
import { useRouter } from "next/navigation";

const RegisteredFromAppPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadDateSearch, setDownloadDateSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });

  // Sample downloaded app data
  const [downloadedAppData, setDownloadedAppData] = useState([
    {
      id: 458745,
      sn: 1,
      name: "Sunil Kumar",
      email: "kingsunilkumar340@gmail.com",
      phone: "9549431207",
      location: "Karauli",
      downloadDate: "08-07-2025",
      activeInactive: "--",
      date: "--"
    },
    {
      id: 458744,
      sn: 2,
      name: "Amanaram Dewasi",
      email: "amanaram294@gmail.com",
      phone: "8690746677",
      location: "Pali",
      downloadDate: "08-07-2025",
      activeInactive: "--",
      date: "--"
    },
    {
      id: 458743,
      sn: 3,
      name: "Abhishek Prajapati",
      email: "praja123abhi@gmail.com",
      phone: "9909842205",
      location: "Sabarkantha",
      downloadDate: "08-07-2025",
      activeInactive: "--",
      date: "--"
    },
    {
      id: 458742,
      sn: 4,
      name: "Surendra Alia",
      email: "mr.surendrakumaralia@gmail.com",
      phone: "7413003321",
      location: "Jaipur",
      downloadDate: "08-07-2025",
      activeInactive: "--",
      date: "--"
    },
    {
      id: 458741,
      sn: 5,
      name: "Nikhil Kumar",
      email: "9716970059nk@gmail.com",
      phone: "8860339049",
      location: "West Delhi",
      downloadDate: "08-07-2025",
      activeInactive: "--",
      date: "--"
    },
    {
      id: 458740,
      sn: 6,
      name: "KAJU DOM",
      email: "kajubadhakor@gmail.com",
      phone: "9614811099",
      location: "Bardhama",
      downloadDate: "08-07-2025",
      activeInactive: "--",
      date: "--"
    },
    {
      id: 458739,
      sn: 7,
      name: "ananda Sahoo",
      email: "anandasahoo1801@gmail.com",
      phone: "9668450908",
      location: "Cuttack",
      downloadDate: "08-07-2025",
      activeInactive: "--",
      date: "--"
    },
    {
      id: 458738,
      sn: 8,
      name: "Hussein Hussein",
      email: "husseinhussein0717@gmail.com",
      phone: "7994737423",
      location: "Allahabad",
      downloadDate: "08-07-2025",
      activeInactive: "--",
      date: "--"
    }
  ]);

  // Sample agents - replace with your actual agent data
  const agents = [
    { id: "all", name: "All Agents" },
    { id: "agent1", name: "Agent 1" },
    { id: "agent2", name: "Agent 2" },
    { id: "agent3", name: "Agent 3" }
  ];

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'location', label: 'Location' }
  ];

  const itemsPerPage = 10;

  const filteredDownloadedAppData = downloadedAppData.filter(item => {
    // Advanced search filter
    const matchesAdvancedSearch = (() => {
      if (!advancedSearch.field || !advancedSearch.term) return true;
      
      const fieldValue = item[advancedSearch.field]?.toString().toLowerCase() || '';
      return fieldValue.includes(advancedSearch.term.toLowerCase());
    })();

    // Download date filter
    const matchesDownloadDate = downloadDateSearch === "" || item.downloadDate.includes(downloadDateSearch);
    
    // Date range filtering
    const matchesDateRange = (() => {
      if (!dateRange.from && !dateRange.to) return true;
      
      const itemDate = new Date(item.downloadDate.split('-').reverse().join('-'));
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      
      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      return true;
    })();

    return matchesAdvancedSearch && matchesDownloadDate && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredDownloadedAppData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDownloadedAppData = filteredDownloadedAppData.slice(startIndex, startIndex + itemsPerPage);

  
  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1); 
  };

  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
    setCurrentPage(1);
  };

  const handleAppUsageReport = () => {
    // Handle app usage report
    console.log('App Usage Report');
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
                  Registered From App
                </h1>
              </div>
            </div>
            
            
          </div>

          {/* Date Filter */}
          <DateFilter
            dateRange={dateRange}
            selectedAgent={selectedAgent}
            agents={agents}
            isDark={isDark}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            hideAgentFilter={true}
          />

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <AdvancedSearchBar
                searchOptions={searchOptions}
                onSearch={handleAdvancedSearch}
                placeholder="Search downloaded app data..."
                defaultSearchField="name"
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
        <RegisteredAppTable
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

export default RegisteredFromAppPage;