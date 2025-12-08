"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateFilter from "../DateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import LedgerTable from "./LedgerTable";
import CustomerTransactionDetails from "../CustomerTransactionDetails";
import AdjustmentModal from "../application-modals/AdjustmentModal";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { ledgerAPI, formatLedgerDataForUI, adjustmentService } from "@/lib/services/LedgerServices";
import Swal from 'sweetalert2';

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
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedApplicantForAdjustment, setSelectedApplicantForAdjustment] = useState(null);
  
  const [ledgerData, setLedgerData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'loan_no', label: 'Loan No' },
    { value: 'phone', label: 'Phone' },
    { value: 'crnno', label: 'CRN No' },
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
      const response = await ledgerAPI.getLedgerData(params);
      
      // FOLLOW COMPLETE PAGE PATTERN
      const actualResponse = response?.success ? response : { success: true, data: response, pagination: {} };
      
      if (actualResponse && actualResponse.success) {
        const ledgersData = actualResponse.ledgers || actualResponse.data || [];
        const formattedLedgers = ledgersData.map(formatLedgerDataForUI);
        setLedgerData(formattedLedgers.map((item, index) => ({
          ...item,
          sn: (currentPage - 1) * itemsPerPage + index + 1
        })));
        
        setTotalCount(actualResponse.pagination?.total || ledgersData.length);
        setTotalPages(actualResponse.pagination?.total_pages || 1);
      } else {
        setLedgerData([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching ledger data:", err);
      setLedgerData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
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

    const result = await Swal.fire({
      title: 'Export Ledger Data?',
      text: 'This will export all ledger data with current filters.',
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
        'SN', 'Loan No', 'Due Date', 'Name', 'CRN No', 
        'Balance', 'Overdue Amount', 'Settled', 'Phone', 'Email', 'Address'
      ];

      const dataRows = ledgerData.map((item, index) => [
        index + 1,
        item.loanNo,
        item.dueDate,
        item.name,
        item.crnno,
        item.balance,
        item.over_due,
        item.settled ? 'Yes' : 'No',
        item.phone,
        item.email,
        item.address
      ]);

      const exportData = [headers, ...dataRows];
      exportToExcel(exportData, `ledger-export-${new Date().toISOString().split('T')[0]}.csv`);
      
      await Swal.fire({
        title: 'Export Successful!',
        text: 'Ledger data has been exported as CSV.',
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
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load transaction details.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustmentClick = (applicant) => {
    setSelectedApplicantForAdjustment(applicant);
    setShowAdjustmentModal(true);
  };

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
                Ledger ({totalCount})
              </h1>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => fetchLedgerData()}
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
                disabled={exporting || ledgerData.length === 0}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } ${exporting || ledgerData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          <DateFilter 
            isDark={isDark} 
            onFilterChange={handleDateFilter}
            dateField="due_date"
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
              placeholder="Search ledger..."
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

        <LedgerTable
          paginatedLedgerData={ledgerData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onViewTransaction={handleViewTransaction}
          onAdjustment={handleAdjustmentClick}
          loading={loading}
          totalItems={totalCount}
        />
      </div>

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
      />
    </div>
  );
};

export default LedgerPage;