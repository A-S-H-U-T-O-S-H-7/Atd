"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Calendar } from "lucide-react";
import CollectionTable from "./CollectionTable";
import DateFilter from "../AgentDateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import AdvancedSearchBar from "../AdvanceSearchBar";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import collectionReportingService from "@/lib/services/CollectionReportingServices";
import Swal from "sweetalert2";

const CollectionPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [currentPage, setCurrentPage] = useState(1);
  const [dueDateSearch, setDueDateSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const [collectionData, setCollectionData] = useState([]);
  const [filteredCollectionData, setFilteredCollectionData] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const itemsPerPage = 10;

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  // Fetch collection data when filters change
  useEffect(() => {
    fetchCollectionData();
  }, [currentPage, selectedAgent, dateRange, advancedSearch, dueDateSearch]);

  const fetchAgents = async () => {
    try {
      const agentsList = await collectionReportingService.getAgents();
      setAgents(agentsList);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setAgents([
        { id: "all", name: "All Agents" },
        { id: "vinu", name: "Vinu" }
      ]);
    }
  };

  const fetchCollectionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = collectionReportingService.mapFiltersToAPI({
        dateRange,
        selectedAgent,
        advancedSearch,
        dueDateSearch,
        page: currentPage,
        per_page: itemsPerPage
      });

      const response = await collectionReportingService.getCollectionData(filters);
      
      setCollectionData(response.data);
      setFilteredCollectionData(response.data);
      
      // Update current page based on API response
      if (response.pagination && response.pagination.current_page !== currentPage) {
        setCurrentPage(response.pagination.current_page);
      }
    } catch (error) {
      console.error("Error fetching collection data:", error);
      setError(error.message || "Failed to fetch collection data");
      setCollectionData([]);
      setFilteredCollectionData([]);
    } finally {
      setLoading(false);
    }
  };

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'loanNo', label: 'Loan No' },
    { value: 'crnNo', label: 'CRN No' },
    { value: 'agent', label: 'Agent' }
  ];

  const totalPages = Math.ceil(filteredCollectionData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCollectionData = filteredCollectionData.slice(startIndex, startIndex + itemsPerPage);

  // Calculate totals for current page data
  const calculateTotals = () => {
    return paginatedCollectionData.reduce((totals, item) => ({
      adminFee: totals.adminFee + (item.adminFee || 0),
      gst: totals.gst + (item.gst || 0),
      sanctionAmount: totals.sanctionAmount + (item.sanctionAmount || 0),
      interest: totals.interest + (item.interest || 0),
      penalty: totals.penalty + (item.penalty || 0),
      gstPenalty: totals.gstPenalty + (item.gstPenalty || 0),
      penalInterest: totals.penalInterest + (item.penalInterest || 0),
      renewalCharge: totals.renewalCharge + (item.renewalCharge || 0),
      bounceCharge: totals.bounceCharge + (item.bounceCharge || 0),
      collectionAmount: totals.collectionAmount + (item.collectionAmount || 0),
      totalAmount: totals.totalAmount + (item.totalAmount || 0)
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

  const handleExport = async () => {
    const result = await Swal.fire({
      title: 'Export Collection Report?',
      text: 'This will export all collection data with current filters.',
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
      setError(null);
      
      const filters = collectionReportingService.mapFiltersToAPI({
        dateRange,
        selectedAgent,
        advancedSearch,
        dueDateSearch
      });

      // Remove pagination parameters for export
      delete filters.per_page;
      delete filters.page;

      const response = await collectionReportingService.exportCollection(filters);
      
      if (response.success) {
        const headers = [
          'Sr. No.', 'Collection Date', 'CRN No', 'Loan No', 'Name', 
          'Admin Fee', 'GST', 'Sanction Amount', 'Disburse Date', 
          'Transaction Date', 'Due Date', 'Interest', 'Penalty', 
          'GST Penalty', 'Penal Interest', 'Renewal Charge', 
          'Bounce Charge', 'Collection Amount', 'Total Amount', 
          'Agent', 'User By'
        ];

        const dataRows = response.data.map((item, index) => [
          index + 1,
          item.collection_date ? new Date(item.collection_date).toLocaleDateString('en-GB') : 'N/A',
          item.crnno || 'N/A',
          item.loan_no || 'N/A',
          item.fullname || 'N/A',
          parseFloat(item.admin_fee) || 0,
          parseFloat(item.gst) || 0,
          parseFloat(item.sanction_amount) || 0,
          item.disburse_date ? new Date(item.disburse_date).toLocaleDateString('en-GB') : 'N/A',
          item.transaction_date ? new Date(item.transaction_date).toLocaleDateString('en-GB') : 'N/A',
          item.due_date ? new Date(item.due_date).toLocaleDateString('en-GB') : 'N/A',
          parseFloat(item.interest) || 0,
          parseFloat(item.penality) || 0,
          parseFloat(item.penal_interest_gst) || 0,
          parseFloat(item.penal_interest) || 0,
          parseFloat(item.renewal_charge) || 0,
          parseFloat(item.bounce_charge) || 0,
          parseFloat(item.collection_amount) || 0,
          parseFloat(item.total_due_amount) || 0,
          item.collection_by || 'N/A',
          item.collection_by || '-'
        ]);

        const exportData = [headers, ...dataRows];
        exportToExcel(exportData, `collection-report-${new Date().toISOString().split('T')[0]}`);
        
        await Swal.fire({
          title: 'Export Successful!',
          text: 'Collection report has been exported to Excel successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });
      } else {
        throw new Error('Failed to export data');
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      await Swal.fire({
        title: 'Export Failed!',
        text: 'Failed to export data. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setExporting(false);
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


  if (loading && collectionData.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading collection data...
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
                }`}>
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Collection Report {filteredCollectionData.length > 0 && `(${filteredCollectionData.length})`}
              </h1>
            </div>
            
            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exporting || filteredCollectionData.length === 0}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                isDark
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              } ${exporting || filteredCollectionData.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Download size={16} />
              <span>{exporting ? "Exporting..." : "Export"}</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-4 rounded-xl border ${
              isDark 
                ? "bg-red-900/50 border-red-700 text-red-300" 
                : "bg-red-50 border-red-300 text-red-700"
            }`}>
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className={`ml-4 ${isDark ? "text-red-400 hover:text-red-300" : "text-red-700 hover:text-red-900"}`}
                >
                  ×
                </button>
              </div>
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
          {filteredCollectionData.length > 0 && (
            <div className="mb-4">
              <p className={`text-lg font-semibold ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}>
                Total Return Amount: ₹{calculateTotals().totalAmount.toFixed(2)}
              </p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Showing {paginatedCollectionData.length} of {filteredCollectionData.length} records
              </p>
            </div>
          )}
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
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CollectionPage;