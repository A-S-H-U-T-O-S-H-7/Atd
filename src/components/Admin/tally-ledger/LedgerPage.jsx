"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateFilter from "../DateFilter";
import LedgerTable from "./LedgerTable";
import TallyTransactionDetails from "../TallyTransactionDetails";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { tallyLedgerAPI, formatTallyLedgerDataForUI, adjustmentService, pdfService } from "@/lib/services/TallyLedgerServices";
import { exportDataToExcel, formatLedgerDataForExport, generateExportFilename } from "@/components/utils/tallyledgerExport";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const LedgerPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransactionData, setSelectedTransactionData] = useState(null);
  
  const [ledgerData, setLedgerData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'loan_no', label: 'Loan No' },
    { value: 'phone', label: 'Phone' },
    { value: 'crnno', label: 'CRN No' },
    { value: 'email', label: 'Email' }
  ];

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

  const fetchLedgerData = async () => {
    try {
      setLoading(true);
      
      const params = buildApiParams();
      const response = await tallyLedgerAPI.getTallyLedgerData(params);
      
      if (response && response.success) {
        const ledgersData = response.ledgers || [];
        const formattedLedgers = ledgersData.map((ledger, index) => 
          formatTallyLedgerDataForUI(ledger, index, currentPage, itemsPerPage)
        );
        
        setLedgerData(formattedLedgers);
        setTotalCount(response.pagination?.total || ledgersData.length);
        setTotalPages(response.pagination?.total_pages || 1);
      } else {
        setLedgerData([]);
        setTotalCount(0);
        setTotalPages(0);
        
        toast.error(response?.message || "Failed to fetch ledger data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error fetching tally ledger data:", err);
      setLedgerData([]);
      setTotalCount(0);
      setTotalPages(0);
      
      toast.error("Failed to load ledger data. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (ledgerData.length === 0) {
      Swal.fire({
        title: 'No Data to Export',
        text: 'There is no ledger data to export.',
        icon: 'warning',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      return;
    }

    setExporting(true);
    
    try {
      // Format ledger data for export
      const exportData = formatLedgerDataForExport(ledgerData);
      
      // Generate filename
      const filename = generateExportFilename('tally-ledger');
      
      // Use reusable export function
      await exportDataToExcel(exportData, filename, isDark, {
        title: 'Export Tally Ledger Data?',
        message: 'This will export all tally ledger data with current filters.'
      });
      
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleViewTransaction = async (item) => { 
    try {
      setSelectedTransactionData(item);
      setShowTransactionModal(true);
    } catch (err) {
      console.error("Error loading transaction details:", err);
      toast.error("Failed to load transaction details", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleBalanceUpdate = async (updateData) => {
    try {
      if (!selectedTransactionData?.application_id) {
        toast.error('Application ID not found', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const result = await adjustmentService.submitAdjustment(
        selectedTransactionData.application_id,
        updateData
      );
      
      if (result.success) {
        toast.success(result.message || 'Adjustment has been submitted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Refresh data
        fetchLedgerData();
        setShowTransactionModal(false);
      } else {
        toast.error(result.message || 'Adjustment failed. Please try again.', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Adjustment error:", error);
      toast.error(error.message || 'Failed to submit adjustment. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
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

  const handleDownloadPDF = async (applicationId, action, applicantData) => {
    try {
      if (action === 'download') {
        await pdfService.downloadPDF(applicationId, applicantData); 
        
        toast.success('Ledger statement downloaded successfully', {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (action === 'print') {
        await pdfService.printPDF(applicationId, applicantData); 
        
        toast.info('Ledger statement opened for printing', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("PDF error:", error);
      toast.error(error.message || 'Failed to process PDF. Please try again.', {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  useEffect(() => {
    fetchLedgerData();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 1) {
      fetchLedgerData();
    } else {
      setCurrentPage(1);
    }
  }, [searchField, searchTerm, dateRange]);

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
            Loading tally ledger data...
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => router.back()}
                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r truncate ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Tally Ledger ({totalCount})
              </h1>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => fetchLedgerData()}
                disabled={loading}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-xs sm:text-sm">Refresh</span>
              </button>
              
              <button
                onClick={handleExport}
                disabled={exporting || ledgerData.length === 0}
                className={`px-3 sm:px-4 py-2 rounded-lg l font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } ${exporting || ledgerData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${exporting ? 'animate-spin' : ''}`} />
                <span className="text-xs sm:text-sm">{exporting ? 'Exporting...' : 'Export'}</span>
              </button>
            </div>
          </div>

          {/* Date Filter - Using your reusable component */}
          <div className="mb-6">
            <DateFilter 
              isDark={isDark} 
              onFilterChange={handleDateFilter}
              dateField="transaction_date"
              showSourceFilter={false}
              allowFutureDates={true}
              buttonLabels={{
                apply: "Apply",
                clear: "Clear"
              }}
            />
          </div>

          {/* Advanced Search - Using your reusable component */}
          <div className="mb-6 md:grid md:grid-cols-2">
            <AdvancedSearchBar 
              searchOptions={searchOptions}
              onSearch={handleAdvancedSearch}
              isDark={isDark}
              placeholder="Search tally ledger..."
              buttonText="Search"
            />
          </div>

          {/* Active Filters */}
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
                    Showing {ledgerData.length} of {totalCount}
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

        {/* Table Component */}
        <LedgerTable
          paginatedLedgerData={ledgerData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onViewTransaction={handleViewTransaction}
          onDownloadPDF={handleDownloadPDF}
          loading={loading}
          totalItems={totalCount}
        />
      </div>

      {/* Transaction Details Modal with showOtherCharges=true */}
      <TallyTransactionDetails
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        data={selectedTransactionData}
        isDark={isDark}
        onUpdateBalance={handleBalanceUpdate}
        showOtherCharges={true} 
      />
    </div>
  );
};

export default LedgerPage;