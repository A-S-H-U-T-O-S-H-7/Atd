"use client";
import React, { useState } from "react";
import { ArrowLeft, Download, Calendar, FileText } from "lucide-react";
import CollectionTable from "./CollectionTable";
import DateFilter from "../AgentDateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import AdvancedSearchBar from "../AdvanceSearchBar";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";


const CollectionPage = () => {
  const { theme } = useThemeStore();
 const isDark = theme === "dark";
  const [currentPage, setCurrentPage] = useState(1);
  const [dueDateSearch, setDueDateSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const router = useRouter();


  // Sample collection data - replace with your actual data
  const [collectionData, setCollectionData] = useState([
    {
      id: 1,
      sn: 1,
      collectionDate: "05-07-2025",
      crnNo: "s16BG436",
      loanNo: "ATDAM35683",
      name: "Swapnil Vijay Sahasrabuddh",
      adminFee: 1980.00,
      gst: 356.00,
      sanctionAmount: 18000.00,
      disburseDate: "11-06-2025",
      transactionDate: "11-06-2025",
      dueDate: "29-06-2025",
      interest: 292.00,
      penalty: 424,
      gstPenalty: 76,
      penalInterest: 637,
      renewalCharge: 0,
      bounceCharge: 0.00,
      collectionAmount: 19566.00,
      totalAmount: 19429.00,
      agent: "vinu",
      userBy: "-"
    },
    {
      id: 2,
      sn: 2,
      collectionDate: "09-06-2025",
      crnNo: "s15BG425",
      loanNo: "ATDAM35641",
      name: "V Srinivasan",
      adminFee: 1319.00,
      gst: 238.00,
      sanctionAmount: 11000.00,
      disburseDate: "09-06-2025",
      transactionDate: "09-06-2025",
      dueDate: "07-07-2025",
      interest: 214.00,
      penalty: 0,
      gstPenalty: 0,
      penalInterest: 0,
      renewalCharge: 0,
      bounceCharge: 0.00,
      collectionAmount: 11214.00,
      totalAmount: 11214.00,
      agent: "vinu",
      userBy: "-"
    },
    {
      id: 3,
      sn: 3,
      collectionDate: "07-06-2025",
      crnNo: "s14BG414",
      loanNo: "ATDAM35602",
      name: "Chet Bahadur",
      adminFee: 1080.00,
      gst: 194.00,
      sanctionAmount: 9000.00,
      disburseDate: "07-06-2025",
      transactionDate: "07-06-2025",
      dueDate: "06-07-2025",
      interest: 181.00,
      penalty: 0,
      gstPenalty: 0,
      penalInterest: 0,
      renewalCharge: 0,
      bounceCharge: 0.00,
      collectionAmount: 9181.00,
      totalAmount: 9181.00,
      agent: "vinu",
      userBy: "-"
    }
  ]);

  // Sample agents - replace with your actual agent data
  const agents = [
    { id: "all", name: "All Agents" },
    { id: "vinu", name: "Vinu" },
    { id: "agent2", name: "Agent 2" },
    { id: "agent3", name: "Agent 3" }
  ];

  const searchOptions = [
  { value: 'name', label: 'Name' },
  { value: 'loanNo', label: 'Loan No' },
  { value: 'crnNo', label: 'CRN No' },
  { value: 'agent', label: 'Agent' }
];

  const itemsPerPage = 10;

  const filteredCollectionData = collectionData.filter(item => {
  // Advanced search filter
  const matchesAdvancedSearch = (() => {
    if (!advancedSearch.field || !advancedSearch.term) return true;
    
    const fieldValue = item[advancedSearch.field]?.toString().toLowerCase() || '';
    return fieldValue.includes(advancedSearch.term.toLowerCase());
  })();

  // Keep your existing filters
  const matchesDueDate = dueDateSearch === "" || item.dueDate.includes(dueDateSearch);
  const matchesAgent = selectedAgent === "all" || item.agent === selectedAgent;
  
  // Date range filtering (keep existing logic)
  const matchesDateRange = (() => {
    if (!dateRange.from && !dateRange.to) return true;
    
    const itemDate = new Date(item.collectionDate.split('-').reverse().join('-'));
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

  return matchesAdvancedSearch && matchesDueDate && matchesAgent && matchesDateRange;
});

  const totalPages = Math.ceil(filteredCollectionData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCollectionData = filteredCollectionData.slice(startIndex, startIndex + itemsPerPage);

  // Calculate totals for current page data
  const calculateTotals = () => {
    return paginatedCollectionData.reduce((totals, item) => ({
      adminFee: totals.adminFee + item.adminFee,
      gst: totals.gst + item.gst,
      sanctionAmount: totals.sanctionAmount + item.sanctionAmount,
      interest: totals.interest + item.interest,
      penalty: totals.penalty + item.penalty,
      gstPenalty: totals.gstPenalty + item.gstPenalty,
      penalInterest: totals.penalInterest + item.penalInterest,
      renewalCharge: totals.renewalCharge + item.renewalCharge,
      bounceCharge: totals.bounceCharge + item.bounceCharge,
      collectionAmount: totals.collectionAmount + item.collectionAmount,
      totalAmount: totals.totalAmount + item.totalAmount
    }), {
      adminFee: 0,
      gst: 0,
      sanctionAmount: 0,
      interest: 0,
      penalty: 0,
      gstPenalty: 0,
      penalInterest: 0,
      renewalCharge: 0,
      bounceCharge: 0,
      collectionAmount: 0,
      totalAmount: 0
    });
  };

  const handleExport = (type) => {
    const exportData = filteredCollectionData.map(item => ({
      'SN': item.sn,
      'Collection Date': item.collectionDate,
      'CRN No': item.crnNo,
      'Loan No': item.loanNo,
      'Name': item.name,
      'Admin Fee': item.adminFee,
      'GST': item.gst,
      'Sanction Amount': item.sanctionAmount,
      'Disburse Date': item.disburseDate,
      'Transaction Date': item.transactionDate,
      'Due Date': item.dueDate,
      'Interest': item.interest,
      'Penalty': item.penalty,
      'GST Penalty': item.gstPenalty,
      'Penal Interest': item.penalInterest,
      'Renewal Charge': item.renewalCharge,
      'Bounce Charge': item.bounceCharge,
      'Collection Amount': item.collectionAmount,
      'Total Amount': item.totalAmount,
      'Agent': item.agent,
      'User By': item.userBy
    }));

    if (type === 'excel') {
      exportToExcel(exportData, 'collection-data');
    }
  };

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };
  const handleSearch = () => {
    setCurrentPage(1); 
  };

  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
    setSelectedAgent(filters.selectedAgent);
    setCurrentPage(1);
  };

  const handleCollectionReportByTransactionDate = () => {
    // Handle collection report by transaction date
    console.log('Collection Report by Transaction Date');
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
              onClick={()=> router.back()}
               className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
              }`}>
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Collection Report
              </h1>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleCollectionReportByTransactionDate}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <FileText size={16} />
                <span>Collection Report By Transaction Date</span>
              </button>
              <button
                onClick={() => handleExport('excel')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Date and Agent Filter */}
          <DateFilter
            dateRange={dateRange}
            selectedAgent={selectedAgent}
            agents={agents}
            isDark={isDark}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <AdvancedSearchBar
  searchOptions={searchOptions}
  onSearch={handleAdvancedSearch}
  placeholder="Search collection data..."
  defaultSearchField="name"
/>
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  value={dueDateSearch}
                  onChange={(e) => setDueDateSearch(e.target.value)}
                  placeholder="Search by due date (DD-MM-YYYY)"
                  className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 font-medium ${
                    isDark
                      ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
                <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </div>
            </div>
          </div>

          {/* Total Return Amount */}
          <div className="mb-4">
            <p className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Total Return Amount: ₹{calculateTotals().totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Table */}
        <CollectionTable
          paginatedCollectionData={paginatedCollectionData}
          filteredCollectionData={filteredCollectionData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          totals={calculateTotals()}
        />
      </div>
    </div>
  );
};

export default CollectionPage;