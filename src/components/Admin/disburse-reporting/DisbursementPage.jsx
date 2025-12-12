"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import AdvancedSearchBar from "../AdvanceSearchBar";
import BankDateFilter from "../BankDateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import DisbursementTable from "./DisbursementTable";
import TransactionDetailsModal from "./TransationDetailsModal";
import DisburseStatusModal from "./DisburseStatus";
import TransferModal from "./TransferModal";
import toast from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import disbursementService from "@/lib/services/disbursementService";
import Swal from "sweetalert2";

const DisbursementPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedBank, setSelectedBank] = useState("all");
  const [filterBy, setFilterBy] = useState("all");

  const [disbursementData, setDisbursementData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [banks, setBanks] = useState([]);

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    disbursementData: null,
  });
  const [transactionStatusModal, setTransactionStatusModal] = useState({
    isOpen: false,
    disbursementData: null,
  });
  const [transferModal, setTransferModal] = useState({
    isOpen: false,
    disbursementData: null,
  });

  const itemsPerPage = 10;
  const searchOptions = [
    { value: "crnno", label: "CRN No" },
    { value: "loan_no", label: "Loan No" },
    { value: "name", label: "Name" },
    { value: "phone", label: "Phone" },
    { value: "email", label: "Email" },
    { value: "disburse_transaction_id", label: "Transaction ID" },
  ];

  useEffect(() => {
    const loadBanks = async () => {
      try {
        const bankList = await disbursementService.getBanks();
        setBanks([{ id: "all", name: "All Banks" }, ...bankList]);
      } catch (error) {
        setBanks([
          { id: "all", name: "All Banks" },
          { id: "IBKL", name: "IDBI Bank" },
          { id: "SBIN", name: "State Bank of India" },
          { id: "HDFC", name: "HDFC Bank" },
          { id: "ICIC", name: "ICICI Bank" },
          { id: "AXIS", name: "Axis Bank" },
        ]);
      }
    };
    loadBanks();
  }, []);

  const buildApiParams = () => {
    const params = {
      per_page: itemsPerPage,
      page: currentPage,
    };

    if (filterBy === "transaction") {
      params.status = "10";
    } else if (filterBy === "not_transaction") {
      params.status = "9";
    }

    if (searchField && searchTerm.trim()) {
      params.search_by = searchField;
      params.search_value = searchTerm.trim();
    }

    if (dateRange.start) {
      params.from_date = dateRange.start;
    }
    if (dateRange.end) {
      params.to_date = dateRange.end;
    }

    if (selectedBank && selectedBank !== "all") {
      params.bank = selectedBank;
    }

    return params;
  };

  const fetchDisbursementData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = buildApiParams();
      const result = await disbursementService.getDisbursementData(params);

      if (result && result.data) {
        setDisbursementData(result.data);
        setTotalCount(result.pagination?.total || result.data.length);
        setTotalPages(result.pagination?.total_pages || 1);

        if (result.data.length === 0) {
          setError("No disbursements found with current filters");
        }
      } else {
        setDisbursementData([]);
        setTotalCount(0);
        setError("No disbursements found");
      }
    } catch (err) {
      setDisbursementData([]);
      setTotalCount(0);
      setError("Failed to fetch disbursements");
      toast.error("Failed to load disbursement data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursementData();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 1) {
      fetchDisbursementData();
    } else {
      setCurrentPage(1);
    }
  }, [searchField, searchTerm, dateRange, selectedBank, filterBy]);

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

  const handleBankDateFilter = (filters) => {
    setDateRange(filters.dateRange || { start: "", end: "" });
    setSelectedBank(filters.selectedBank || "all");
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setSelectedBank("all");
    setFilterBy("all");
    setCurrentPage(1);
  };

  const handleExportToExcel = async () => {
    const result = await Swal.fire({
      title: "Export Disbursements?",
      text: "This will export all disbursements with current filters.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Export!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });

    if (!result.isConfirmed) return;

    try {
      setExporting(true);
      const exportParams = { ...buildApiParams() };
      delete exportParams.per_page;
      delete exportParams.page;

      const response = await disbursementService.exportDisbursement(exportParams);
      
      if (!response || response.length === 0) {
        throw new Error("No data available for export");
      }

      const headers = [
        'User ID', 'CRN No', 'Name', 'Application ID', 'Loan No', 
        'Approved Amount', 'Disburse ID', 'Transaction ID', 
        'Transaction Date', 'Disburse Amount', 'Tenure', 
        'Disburse Date', 'Bank Name', 'Sender Name', 'ATD Branch',
        'Customer Bank', 'Customer Branch', 'Customer Account', 'Customer IFSC'
      ];

      const dataRows = response.map((item) => [
        item.user_id || 'N/A',
        item.crnno || 'N/A',
        item.name || 'N/A',
        item.application_id || 'N/A',
        item.loan_no || 'N/A',
        item.approved_amount || '0.00',
        item.disburse_id || 'N/A',
        item.disburse_transaction_id || 'N/A',
        item.disbursement_transaction_date || 'N/A',
        item.disburse_amount || '0.00',
        item.tenure || 0,
        item.disburse_date || 'N/A',
        item.bank_name || 'N/A',
        item.sender_name || 'N/A',
        item.atd_branch || 'N/A',
        item.customer_bank || 'N/A',
        item.customer_branch || 'N/A',
        item.customer_ac || 'N/A',
        item.customer_ifsc || 'N/A'
      ]);

      const exportData = [headers, ...dataRows];
      exportToExcel(exportData, `disbursements_${new Date().toISOString().split("T")[0]}`);

      await Swal.fire({
        title: "Export Successful!",
        text: `Exported ${dataRows.length} records.`,
        icon: "success",
        confirmButtonColor: "#10b981",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } catch (err) {
      await Swal.fire({
        title: "Export Failed!",
        text: err.message || "Failed to export data.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleGSTExport = async () => {
    const result = await Swal.fire({
      title: "Export Non-Transaction Data?",
      text: "This will export disbursements without transaction details.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Export!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });

    if (!result.isConfirmed) return;

    try {
      setExporting(true);
      const exportParams = { ...buildApiParams() };
      delete exportParams.per_page;
      delete exportParams.page;
      delete exportParams.status;

      const response = await disbursementService.exportNonTransactionDisbursement(exportParams);
      
      if (!response || response.length === 0) {
        throw new Error("No non-transaction data available");
      }

      const headers = [
        'User ID', 'CRN No', 'Name', 'Application ID', 'Loan No', 
        'Approved Amount', 'Disburse ID', 'Transaction ID', 
        'Transaction Date', 'Disburse Amount', 'Tenure', 
        'Disburse Date', 'Bank Name', 'Sender Name', 'ATD Branch',
        'Customer Bank', 'Customer Branch', 'Customer Account', 'Customer IFSC'
      ];

      const dataRows = response.map((item) => [
        item.user_id || 'N/A',
        item.crnno || 'N/A',
        item.name || 'N/A',
        item.application_id || 'N/A',
        item.loan_no || 'N/A',
        item.approved_amount || '0.00',
        item.disburse_id || 'N/A',
        item.disburse_transaction_id || 'N/A',
        item.disbursement_transaction_date || 'N/A',
        item.disburse_amount || '0.00',
        item.tenure || 0,
        item.disburse_date || 'N/A',
        item.bank_name || 'N/A',
        item.sender_name || 'N/A',
        item.atd_branch || 'N/A',
        item.customer_bank || 'N/A',
        item.customer_branch || 'N/A',
        item.customer_ac || 'N/A',
        item.customer_ifsc || 'N/A'
      ]);

      const exportData = [headers, ...dataRows];
      exportToExcel(exportData, `non-transaction-disbursements_${new Date().toISOString().split("T")[0]}`);

      await Swal.fire({
        title: "Export Successful!",
        text: `Exported ${dataRows.length} non-transaction records.`,
        icon: "success",
        confirmButtonColor: "#3b82f6",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } catch (err) {
      await Swal.fire({
        title: "Export Failed!",
        text: err.message || "Failed to export non-transaction data.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setExporting(false);
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
    await disbursementService.updateTransaction(transactionData.disburse_id, transactionData, transactionData);
    toast.success("Transaction updated successfully!");
    fetchDisbursementData();
    handleTransactionModalClose();
  } catch (error) {
    toast.error("Failed to update transaction");
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
      toast.success("Transfer processed successfully!");
      fetchDisbursementData();
      handleTransferModalClose();
    } catch (error) {
      toast.error("Transfer failed");
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
      toast.success("Transaction status checked successfully!");
      handleTransactionStatusModalClose();
    } catch (error) {
      toast.error("Failed to check transaction status");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
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
                <ArrowLeft className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </button>
              <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Disbursement Reporting ({totalCount})
              </h1>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => fetchDisbursementData()}
                disabled={loading}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportToExcel}
                disabled={exporting || disbursementData.length === 0}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                } ${exporting || disbursementData.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Download className={`w-4 h-4 ${exporting ? "animate-spin" : ""}`} />
                <span>{exporting ? "Exporting..." : "Export All"}</span>
              </button>

              <button
                onClick={handleGSTExport}
                disabled={exporting || disbursementData.length === 0}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                } ${exporting || disbursementData.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Download className={`w-4 h-4 ${exporting ? "animate-spin" : ""}`} />
                <span>Non-Transaction</span>
              </button>
            </div>
          </div>

          <BankDateFilter isDark={isDark} onFilterChange={handleBankDateFilter} banks={banks} />

          <div className="mb-6 grid grid-cols-2">
            <AdvancedSearchBar
              searchOptions={searchOptions}
              onSearch={handleAdvancedSearch}
              isDark={isDark}
              placeholder="Search disbursements..."
              buttonText="Search"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Filter By:</span>
              <div className="flex space-x-2">
                {[
                  { id: "all", label: "All" },
                  { id: "transaction", label: "Transaction" },
                  { id: "not_transaction", label: "Not Transaction" },
                ].map((filter) => (
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

            {(searchTerm || dateRange.start || dateRange.end || selectedBank !== "all" || filterBy !== "all") && (
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Showing {disbursementData.length} of {totalCount}
                </span>
                <button
                  onClick={clearAllFilters}
                  className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        <DisbursementTable
          paginatedDisbursementData={disbursementData.map((item, index) => ({
            ...item,
            srNo: (currentPage - 1) * itemsPerPage + index + 1,
          }))}
          filteredDisbursementData={disbursementData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onTransactionClick={handleTransactionModalOpen}
          onTransactionStatusClick={handleTransactionStatusModalOpen}
          onTransferClick={handleTransferModalOpen}
          isLoading={loading}
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