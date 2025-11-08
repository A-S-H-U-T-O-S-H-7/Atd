"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Calendar, Search, Filter } from "lucide-react";
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

  // Fetch banks list
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

  // Fetch disbursement data
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
      // Fallback to empty data
      setDisbursementData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursementData();
  }, [currentPage, dateRange, selectedBank, filterBy, advancedSearch]);

  // Export handlers
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

  // Modal handlers
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

  // Search and filter handlers
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
              <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Disbursement
              </h1>
            </div>
            
            {/* Export Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleGSTExport}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <Download size={16} />
                <span>Export GST</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bank Date Filter */}
            <BankDateFilter
              dateRange={dateRange}
              selectedBank={selectedBank}
              banks={banks}
              isDark={isDark}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />

            {/* Non-Transaction Export Block */}
            <div className={`rounded-2xl p-4 mb-6 border-2 ${
              isDark
                ? "bg-gray-800 border-blue-600/50"
                : "bg-blue-50 border-blue-300"
            }`}>
              <div className="flex flex-wrap gap-8 items-center justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${
                    isDark ? "text-blue-300" : "text-blue-700"
                  }`}>
                    Non-Transaction Data Export
                  </h3>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Export only non-transaction disbursement data
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 font-medium ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    {banks.map(bank => (
                      <option key={bank.id} value={bank.id}>{bank.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleGSTExport}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    <Download size={16} />
                    <span>Export Non-Transaction</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* Transaction Filter */}
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                      filterBy === filter.id
                        ? isDark
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-500 text-white"
                        : isDark
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Search */}
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

        {/* Table */}
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

      {/* Modals */}
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