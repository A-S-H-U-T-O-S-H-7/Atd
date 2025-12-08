"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateFilter from "../DateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import CollectionTable from "./CollectionTable";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { collectionReportingService } from "@/lib/services/CollectionReportingServices";
import Swal from 'sweetalert2';

const CollectionPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  const [collectionData, setCollectionData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [agents, setAgents] = useState([]);

  const itemsPerPage = 10;

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'loan_no', label: 'Loan No' },
    { value: 'crnno', label: 'CRN No' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' }
  ];

  useEffect(() => {
    fetchAgents();
  }, []);

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

  const buildApiParams = () => {
    const params = {
      per_page: itemsPerPage,
      page: currentPage,
    };

    if (searchField && searchTerm.trim()) {
      params.search_by = searchField;
      params.search_value = searchTerm.trim();
    }

    if (dateRange.start) params.from_date = dateRange.start;
    if (dateRange.end) params.to_date = dateRange.end;

    return params;
  };

  const fetchCollectionData = async () => {
    try {
      setLoading(true);
      
      const params = buildApiParams();
      const response = await collectionReportingService.getCollectionData(params);
      
      if (response && response.data) {
        const formattedCollections = response.data.map((item, index) => ({
          ...item,
          sn: (currentPage - 1) * itemsPerPage + index + 1
        }));
        
        setCollectionData(formattedCollections);
        setTotalCount(response.pagination?.total || response.data.length);
        setTotalPages(response.pagination?.total_pages || 1);
      } else {
        setCollectionData([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching collection data:", err);
      setCollectionData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionData();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 1) {
      fetchCollectionData();
    } else {
      setCurrentPage(1);
    }
  }, [searchField, searchTerm, dateRange]);

  const handleExport = async () => {
    if (collectionData.length === 0) {
      Swal.fire({
        title: 'No Data to Export',
        text: 'There is no collection data to export.',
        icon: 'warning',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Export Collection Data?',
      text: 'This will export all collection data with current filters.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Export CSV',
      cancelButtonText: 'Cancel',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });

    if (!result.isConfirmed) return;

    try {
      setExporting(true);
      
      const headers = [
        'SN', 'Collection Date', 'CRN No', 'Loan No', 'Name', 
        'Admin Fee', 'GST', 'Sanction Amount', 'Disburse Date', 
        'Transaction Date', 'Due Date', 'Interest', 'Penalty', 
        'GST Penalty', 'Penal Interest', 'Renewal Charge', 
        'Bounce Charge', 'Collection Amount', 'Total Amount', 
        'Agent', 'User By'
      ];

      const dataRows = collectionData.map((item, index) => [
        index + 1,
        item.collectionDate,
        item.crnNo,
        item.loanNo,
        item.name,
        item.adminFee,
        item.gst,
        item.sanctionAmount,
        item.disburseDate,
        item.transactionDate,
        item.dueDate,
        item.interest,
        item.penalty,
        item.gstPenalty,
        item.penalInterest,
        item.renewalCharge,
        item.bounceCharge,
        item.collectionAmount,
        item.totalAmount,
        item.agent,
        item.userBy
      ]);

      const exportData = [headers, ...dataRows];
      exportToExcel(exportData, `collection-export-${new Date().toISOString().split('T')[0]}.csv`);
      
      await Swal.fire({
        title: 'Export Successful!',
        text: 'Collection data has been exported as CSV.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } catch (err) {
      console.error("Export error:", err);
      Swal.fire({
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

  const handleAdvancedSearch = ({ field, term }) => {
    if (!field || !term.trim()) {
      setSearchField("");
      setSearchTerm("");
      return;
    }
    
    setSearchField(field);
    setSearchTerm(term.trim());
    setCurrentPage(1);
  };

  const handleDateFilter = (filters) => {
    setDateRange(filters.dateRange || { start: "", end: "" });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  const calculateTotals = () => {
    return collectionData.reduce((totals, item) => ({
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

  if (loading && collectionData.length === 0) {
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
                Collection ({totalCount})
              </h1>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => fetchCollectionData()}
                disabled={loading}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={handleExport}
                disabled={exporting || collectionData.length === 0}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } ${exporting || collectionData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          <DateFilter 
            isDark={isDark} 
            onFilterChange={handleDateFilter}
            dateField="collection_date"
            showSourceFilter={false}
            buttonLabels={{
              apply: "Apply",
              clear: "Clear"
            }}
          />

          <div className="mb-6">
            <AdvancedSearchBar 
              searchOptions={searchOptions}
              onSearch={handleAdvancedSearch}
              isDark={isDark}
              placeholder="Search collection..."
              buttonText="Search"
            />
          </div>

          {(searchTerm || dateRange.start || dateRange.end) && (
            <div className={`mb-4 p-4 rounded-lg border ${
              isDark ? "bg-gray-800/50 border-emerald-600/30" : "bg-emerald-50/50 border-emerald-200"
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    Active Filters:
                  </span>
                  {searchTerm && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {searchOptions.find(opt => opt.value === searchField)?.label}: {searchTerm}
                    </span>
                  )}
                  {dateRange.start && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      From: {new Date(dateRange.start).toLocaleDateString('en-GB')}
                    </span>
                  )}
                  {dateRange.end && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      To: {new Date(dateRange.end).toLocaleDateString('en-GB')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Showing {collectionData.length} of {totalCount}
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isDark 
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <CollectionTable
          paginatedCollectionData={collectionData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          totals={calculateTotals()}
          loading={loading}
          totalItems={totalCount}
        />
      </div>
    </div>
  );
};

export default CollectionPage;