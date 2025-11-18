"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Calendar, RefreshCw } from "lucide-react";
import SearchBar from "../SearchBar";
import LedgerTable from "./LedgerTable";
import DateFilter from "../AgentDateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import CustomerTransactionDetails from "../CustomerTransactionDetails";
import AdjustmentModal from "../application-modals/AdjustmentModal";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { 
  ledgerAPI, 
  formatLedgerDataForUI,
  adjustmentService 
} from "@/lib/services/LedgerServices";
import Swal from 'sweetalert2';

const LedgerPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dueDateSearch, setDueDateSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransactionData, setSelectedTransactionData] = useState(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedApplicantForAdjustment, setSelectedApplicantForAdjustment] = useState(null);

  // Data states
  const [ledgerData, setLedgerData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });

  // Sample agents - replace with your actual agent data
  const agents = [
    { id: "all", name: "All Agents" },
    { id: "agent1", name: "Agent 1" },
    { id: "agent2", name: "Agent 2" },
    { id: "agent3", name: "Agent 3" }
  ];

  const itemsPerPage = 10;

  // Build API parameters
const buildApiParams = () => {
  const params = {
    per_page: itemsPerPage,
    page: currentPage,
  };

  // Add search parameters
  if (searchTerm) {
    params.search_by = "name,loan_no,email,phone,address";
    params.search_value = searchTerm;
  }

  // Add date filters
  if (dateRange.from) {
    params.from_date = dateRange.from;
  }
  if (dateRange.to) {
    params.to_date = dateRange.to;
  }

  // Add due date search
  if (dueDateSearch) {
    params.due_date = dueDateSearch;
  }

  // Add agent filter if needed
  if (selectedAgent !== "all") {
    params.agent_id = selectedAgent;
  }

  return params;
};

  // Fetch ledger data
  const fetchLedgerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = buildApiParams();
      const response = await ledgerAPI.getLedgerData(params);
      
      if (response && response.success && response.ledgers) {
        const formattedLedgers = response.ledgers.map((ledger, index) => ({
          ...formatLedgerDataForUI(ledger),
          sn: (currentPage - 1) * itemsPerPage + index + 1
        }));
        
        setLedgerData(formattedLedgers);
        setPagination(response.pagination || {
          total: response.ledgers.length,
          current_page: 1,
          per_page: itemsPerPage,
          total_pages: Math.ceil(response.ledgers.length / itemsPerPage)
        });
      } else {
        console.error("❌ Invalid API Response structure:", response);
        setError("Failed to fetch ledger data - Invalid response");
      }
    } catch (err) {
      console.error("❌ Error fetching ledger data:", err);
      setError("Failed to fetch ledger data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchLedgerData();
  }, [currentPage, searchTerm, dueDateSearch, dateRange]);

  // Filter ledger data (client-side filtering for additional features)
  const filteredLedgerData = ledgerData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNo.includes(searchTerm) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDueDate = dueDateSearch === "" || item.dueDate.includes(dueDateSearch);
    
    const matchesAgent = selectedAgent === "all";

    // Date range filtering (already done by API, but keeping for client-side consistency)
    const matchesDateRange = (() => {
      if (!dateRange.from && !dateRange.to) return true;
      
      const itemDate = new Date(item.disburseDate.split('-').reverse().join('-'));
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

    return matchesSearch && matchesDueDate && matchesAgent && matchesDateRange;
  });

  const totalPages = pagination.total_pages;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLedgerData = filteredLedgerData.slice(startIndex, startIndex + itemsPerPage);

  // Handle export
const handleExport = async (type) => {
  const result = await Swal.fire({
    title: 'Export Ledger Data?',
    text: 'This will export all ledger data with current filters.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, Export!',
    cancelButtonText: 'Cancel',
    background: isDark ? "#1f2937" : "#ffffff",
    color: isDark ? "#f9fafb" : "#111827",
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    setExporting(true);
    
    // Build export params from current filters
    const exportParams = { ...buildApiParams() };
    
    // Remove pagination parameters for export
    delete exportParams.per_page;
    delete exportParams.page;
    
    // Ensure proper parameter names for export API
    const formattedParams = {
      search_by: exportParams.search_by,
      search_value: exportParams.search_value,
      from_date: exportParams.from_date,
      to_date: exportParams.to_date,
      due_date: exportParams.due_date
    };

    // Clean up undefined/null parameters
    Object.keys(formattedParams).forEach(key => {
      if (formattedParams[key] === undefined || formattedParams[key] === null || formattedParams[key] === '') {
        delete formattedParams[key];
      }
    });

    await exportService.downloadLedgerExport(
      formattedParams, 
      `ledger-export-${new Date().toISOString().split('T')[0]}.xlsx`
    );
    
    await Swal.fire({
      title: 'Export Successful!',
      text: 'Ledger data has been exported successfully.',
      icon: 'success',
      confirmButtonColor: '#10b981',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });
  } catch (err) {
    console.error("Export error:", err);
    await Swal.fire({
      title: 'Export Failed!',
      text: err.message || 'Failed to export data. Please try again.',
      icon: 'error',
      confirmButtonColor: '#ef4444',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });
  } finally {
    setExporting(false);
  }
};

  

  // Handle view transaction
  const handleViewTransaction = async (item) => { 
    try {
      setLoading(true);
      const response = await ledgerAPI.getLedgerDetails(item.application_id);
      
      if (response && response.status) {
        setSelectedTransactionData({
          ...item,
          ledgerDetails: response
        });
        setShowTransactionModal(true);
      } else {
        throw new Error("Failed to fetch transaction details");
      }
    } catch (err) {
      console.error("Error fetching transaction details:", err);
      setError("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  // Handle balance update
  const handleBalanceUpdate = (updateData) => {
    console.log('Balance updated:', updateData);
    // You can implement balance update logic here if needed
  };

  // Handle adjustment click
  const handleAdjustmentClick = (applicant) => {
    setSelectedApplicantForAdjustment(applicant);
    setShowAdjustmentModal(true);
  };

  // Handle adjustment submit
  const handleAdjustmentSubmit = async (adjustmentData) => {
    try {
      const result = await adjustmentService.submitAdjustment(
        adjustmentData.applicant.application_id, 
        adjustmentData
      );
      
      if (result.success) {
        await Swal.fire({
          title: 'Adjustment Successful!',
          text: result.message || 'Adjustment has been submitted successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });
        
        // Refresh ledger data
        fetchLedgerData();
      } else {
        throw new Error(result.message || 'Adjustment failed');
      }
    } catch (error) {
      console.error("Adjustment error:", error);
      await Swal.fire({
        title: 'Adjustment Failed!',
        text: error.message || 'Failed to submit adjustment. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setShowAdjustmentModal(false);
      setSelectedApplicantForAdjustment(null);
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchLedgerData();
  };

  // Handle filter change
  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
    setSelectedAgent(filters.selectedAgent);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setDueDateSearch("");
    setDateRange({ from: "", to: "" });
    setSelectedAgent("all");
    setCurrentPage(1);
  };

  if (loading && ledgerData.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="text-center">
          <RefreshCw className={`w-8 h-8 animate-spin mx-auto mb-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <p className={`text-lg font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Loading ledger data...
          </p>
        </div>
      </div>
    );
  }

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
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Ledger ({pagination.total})
              </h1>
            </div>
            
            {/* Export Button */}
<div className="flex space-x-2">
  <button
    onClick={() => handleExport('excel')}
    disabled={exporting || ledgerData.length === 0}
    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
      exporting || ledgerData.length === 0
        ? "opacity-50 cursor-not-allowed"
        : "hover:shadow-lg"
    } ${
      isDark
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-green-500 hover:bg-green-600 text-white"
    }`}
  >
    {exporting ? (
      <RefreshCw className="w-4 h-4 animate-spin" />
    ) : (
      <Download size={16} />
    )}
    <span>{exporting ? "Exporting..." : "Export"}</span>
  </button>
</div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-800 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

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
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by name, loan number, email, phone..."
                onSearch={handleSearch}
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  value={dueDateSearch}
                  onChange={(e) => setDueDateSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

          {/* Filter Summary */}
          {(searchTerm || dueDateSearch || dateRange.from || dateRange.to || selectedAgent !== "all") && (
            <div className={`mb-4 p-4 rounded-lg border ${
              isDark ? "bg-gray-800/50 border-emerald-600/30" : "bg-emerald-50/50 border-emerald-200"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    Active Filters:
                  </span>
                  {searchTerm && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      Search: {searchTerm}
                    </span>
                  )}
                  {dueDateSearch && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      Due Date: {dueDateSearch}
                    </span>
                  )}
                  {dateRange.from && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      From: {dateRange.from}
                    </span>
                  )}
                  {dateRange.to && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      To: {dateRange.to}
                    </span>
                  )}
                  {selectedAgent !== "all" && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      Agent: {agents.find(a => a.id === selectedAgent)?.name}
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllFilters}
                  className={`text-sm px-3 py-1 rounded-md ${
                    isDark 
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <LedgerTable
          paginatedLedgerData={paginatedLedgerData}
          filteredLedgerData={filteredLedgerData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onViewTransaction={handleViewTransaction}
          onAdjustment={handleAdjustmentClick}
          loading={loading}
          totalItems={pagination.total}
        />
      </div>

      {/* Modals */}
      <AdjustmentModal
        isOpen={showAdjustmentModal}
        onClose={() => {
          setShowAdjustmentModal(false);
          setSelectedApplicantForAdjustment(null);
        }}
        applicant={selectedApplicantForAdjustment}
        isDark={isDark}
        onSubmit={handleAdjustmentSubmit}
      />

      <CustomerTransactionDetails
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        data={selectedTransactionData}
        isDark={isDark}
        onUpdateBalance={handleBalanceUpdate}
      />
    </div>
  );
};

export default LedgerPage;