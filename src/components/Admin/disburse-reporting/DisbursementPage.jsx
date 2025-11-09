"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, ChevronDown, Filter } from "lucide-react";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DisbursementTable from "./DisbursementTable";
import BankDateFilter from "../BankDateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import TransactionDetailsModal from "./TransationDetailsModal";
import DisburseStatusModal from "./DisburseStatus";
import { useRouter } from "next/navigation";
import TransferModal from "./TransferModal";
import toast from "react-hot-toast"; 
import { useThemeStore } from "@/lib/store/useThemeStore";
import disbursementService from "@/lib/services/disbursementService";

const DisbursementPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedBank, setSelectedBank] = useState("all");
  const [filterBy, setFilterBy] = useState("all");
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const [transactionModal, setTransactionModal] = useState({ 
    isOpen: false, 
    disbursementData: null 
  });
  const [transactionStatusModal, setTransactionStatusModal] = useState({ 
    isOpen: false, 
    disbursementData: null 
  });
  const [transferModal, setTransferModal] = useState({ 
    isOpen: false, 
    disbursementData: null 
  });

  const [disbursementData, setDisbursementData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const loadBanks = async () => {
      try {
        const bankList = await disbursementService.getBanks();
        setBanks([{ id: "all", name: "All Banks" }, ...bankList]);
      } catch (error) {
        console.error('Error loading banks:', error);
        setBanks([
          { id: "all", name: "All Banks" },
          { id: "IBKL", name: "IDBI Bank" },
          { id: "SBIN", name: "State Bank of India" },
          { id: "HDFC", name: "HDFC Bank" },
          { id: "ICIC", name: "ICICI Bank" },
          { id: "AXIS", name: "Axis Bank" }
        ]);
      }
    };
    
    loadBanks();
  }, []);

  const fetchDisbursementData = async () => {
    setIsLoading(true);
    try {
      const filters = disbursementService.mapFiltersToAPI({
        dateRange,
        selectedBank,
        filterBy,
        advancedSearch
      });
      
      const result = await disbursementService.getDisbursementData({
        ...filters,
        page: currentPage,
        per_page: 10
      });
      
      setDisbursementData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching disbursement data:', error);
      toast.error('Failed to load disbursement data');
      setDisbursementData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursementData();
  }, [currentPage, dateRange, selectedBank, filterBy, advancedSearch]);

  const handleExport = async (type) => {
    try {
      const filters = disbursementService.mapFiltersToAPI({
        dateRange,
        selectedBank,
        filterBy,
        advancedSearch
      });
      
      const exportData = await disbursementService.exportDisbursement(filters, type);
      exportToExcel(exportData, type === 'gst' ? 'disbursement-gst-data' : 'disbursement-data');
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const handleGSTExport = async () => {
    try {
      const filters = disbursementService.mapFiltersToAPI({
        dateRange,
        selectedBank,
        filterBy: 'not_transaction',
        advancedSearch
      });
      
      const gstData = await disbursementService.exportDisbursement(filters, 'gst');
      exportToExcel(gstData, 'disbursement-gst-export');
      toast.success('GST data exported successfully!');
    } catch (error) {
      console.error('GST export error:', error);
      toast.error('Failed to export GST data');
    }
  };

  const handleTransactionModalOpen = (disbursementData) => {
    setTransactionModal({ isOpen: true, disbursementData });
  };

  const handleTransactionModalClose = () => {
    setTransactionModal({ isOpen: false, disbursementData: null });
  };

  const handleTransactionSubmit = async (transactionData) => {
    try {
      await disbursementService.updateTransaction(
        transactionData.disburse_id,
        transactionData,
        transactionData
      );
      
      toast.success('Transaction updated successfully!');
      fetchDisbursementData();
      handleTransactionModalClose();
    } catch (error) {
      console.error('Transaction update error:', error);
      toast.error('Failed to update transaction');
    }
  };

  const handleTransferModalOpen = (disbursementData) => {
    setTransferModal({ isOpen: true, disbursementData });
  };

  const handleTransferModalClose = () => {
    setTransferModal({ isOpen: false, disbursementData: null });
  };

  const handleTransferSubmit = async (transferData) => {
    try {
      await disbursementService.processTransfer(transferData, transferData);
      toast.success('Transfer processed successfully!');
      fetchDisbursementData();
      handleTransferModalClose();
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Transfer failed. Please try again.');
    }
  };

  const handleTransactionStatusModalOpen = (disbursementData) => {
    setTransactionStatusModal({ isOpen: true, disbursementData });
  };

  const handleTransactionStatusModalClose = () => {
    setTransactionStatusModal({ isOpen: false, disbursementData: null });
  };

  const handleTransactionStatusSubmit = async (statusData) => {
    try {
      await disbursementService.checkTransactionStatus(statusData, statusData);
      toast.success('Transaction status checked successfully!');
      handleTransactionStatusModalClose();
    } catch (error) {
      console.error('Status check error:', error);
      toast.error('Failed to check transaction status');
    }
  };

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
    setSelectedBank(filters.selectedBank);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchDisbursementData();
  };

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
              <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Disbursement Reporting
              </h1>
            </div>
            
            <button
              onClick={() => handleExport('excel')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              <Download size={16} />
              <span>Export Data</span>
            </button>
          </div>

          {/* BOTH FILTERS UNDER ONE DROPDOWN TOGGLE */}
          <div className={`rounded-xl border shadow-sm overflow-hidden transition-all duration-200 mb-6 ${
            isDark ? "bg-gray-800/50 border-blue-600" : "bg-white border-blue-400"
          }`}>
            {/* Toggle Header */}
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`w-full px-4 py-3 flex items-center justify-between transition-colors duration-200 ${
                isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? "bg-emerald-600/20" : "bg-emerald-50"
                }`}>
                  <Filter className={`w-4 h-4 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </div>
                <div className="text-left">
                  <h3 className={`text-base font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-800"
                  }`}>
                    Filters & Export Options
                  </h3>
                  <p className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Date range, bank filter and non-transaction export
                  </p>
                </div>
              </div>
              <div className={`transition-transform duration-200 ${
                isFiltersExpanded ? 'rotate-180' : ''
              }`}>
                <ChevronDown className={`w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`} />
              </div>
            </button>
            
            {/* BOTH FILTERS IN ONE LINE */}
            <div className={`overflow-hidden transition-all  duration-300 ${
              isFiltersExpanded ? 'max-h-[500px]' : 'max-h-0'
            }`}>
              <div className={`px-4 pb-4 pt-2 border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}>
                <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
                  
                  {/* LEFT: Bank Date Filter */}
                  <div className={`rounded-lg p-4 border ${
                    isDark ? "bg-gray-700/30 border-gray-600" : "bg-emerald-50/50 border-emerald-200"
                  }`}>
                    <h4 className={`text-sm font-semibold mb-3 ${
                      isDark ? "text-emerald-400" : "text-emerald-700"
                    }`}>
                      Date & Bank Filter
                    </h4>
                    <BankDateFilter
                      dateRange={dateRange}
                      selectedBank={selectedBank}
                      banks={banks}
                      isDark={isDark}
                      onFilterChange={handleFilterChange}
                      onSearch={handleSearch}
                    />
                  </div>

                  {/* RIGHT: Non-Transaction Export */}
                  <div className={`rounded-lg p-4 border ${
                    isDark ? "bg-gray-700/30 border-gray-600" : "bg-blue-50/50 border-blue-200"
                  }`}>
                    <h4 className={`text-sm font-semibold mb-3 ${
                      isDark ? "text-blue-400" : "text-blue-700"
                    }`}>
                      Export Non-Transaction Data
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}>
                          Select Bank for Export
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                            isDark
                              ? "bg-gray-700/50 border-gray-600 text-white hover:border-blue-500 focus:border-blue-400"
                              : "bg-white border-gray-300 text-gray-900 hover:border-blue-400 focus:border-blue-500"
                          } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                        >
                          {banks.map(bank => (
                            <option key={bank.id} value={bank.id}>{bank.name}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleGSTExport}
                        className={`w-full px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${
                          isDark
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        <Download size={14} />
                        <span>Export Non-Transaction</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Filter By:
              </span>
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'transaction', label: 'Transaction' },
                  { id: 'not_transaction', label: 'Not Transaction' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterBy(filter.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      filterBy === filter.id
                        ? isDark
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-emerald-500 text-white shadow-sm"
                        : isDark
                          ? "bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto">
              <AdvancedSearchBar
                searchOptions={disbursementService.searchOptions}
                onSearch={handleAdvancedSearch}
                placeholder="Search disbursement data..."
                defaultSearchField="loanNo"
              />
            </div>
          </div>
        </div>

        <DisbursementTable
          paginatedDisbursementData={disbursementData}
          filteredDisbursementData={disbursementData}
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPage={pagination.per_page}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onTransactionClick={handleTransactionModalOpen}
          onTransactionStatusClick={handleTransactionStatusModalOpen}
          onTransferClick={handleTransferModalOpen}
          isLoading={isLoading}
        />
      </div>

      <TransferModal
        isOpen={transferModal.isOpen}
        onClose={handleTransferModalClose}
        onSubmit={handleTransferSubmit}
        isDark={isDark}
        disbursementData={transferModal.disbursementData}
      />

      <TransactionDetailsModal
        isOpen={transactionModal.isOpen}
        onClose={handleTransactionModalClose}
        onSubmit={handleTransactionSubmit}
        isDark={isDark}
        disbursementData={transactionModal.disbursementData}
      />

      <DisburseStatusModal
        isOpen={transactionStatusModal.isOpen}
        onClose={handleTransactionStatusModalClose}
        onSubmit={handleTransactionStatusSubmit}
        isDark={isDark}
        customerName={transactionStatusModal.disbursementData?.beneficiaryAcName}
        disbursementData={transactionStatusModal.disbursementData}
      />
    </div>
  );
};

export default DisbursementPage;