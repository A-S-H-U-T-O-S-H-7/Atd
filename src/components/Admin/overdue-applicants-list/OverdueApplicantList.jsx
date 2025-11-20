"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Mail } from "lucide-react";
import AdvancedSearchBar from "../AdvanceSearchBar";
import OverdueApplicantTable from "./OverdueApplicantListTable";
import { exportToExcel } from "@/components/utils/exportutil";
import AdjustmentModal from "../application-modals/AdjustmentModal";
import OverdueAmountModal from "../application-modals/OverdueAmountModal";
import CustomerTransactionDetails from "../CustomerTransactionDetails";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { overdueApplicantService } from "@/lib/services/OverdueApplicantServices";

// Main Overdue Applicant Management Component
const OverdueApplicantList = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Now configurable
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Modal states
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
 
  const SearchOptions = [
    { value: 'loan_no', label: 'Loan No.' },
    { value: 'fullname', label: 'Name' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'email', label: 'Email' },
    { value: 'duedate', label: 'Due Date' },
  ];
  
  // Selected applicant states
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedApplicantForAdjustment, setSelectedApplicantForAdjustment] = useState(null);
  const [selectedApplicantForOverdue, setSelectedApplicantForOverdue] = useState(null);
  const [selectedApplicantForLedger, setSelectedApplicantForLedger] = useState(null);

  const [overdueApplicants, setOverdueApplicants] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });

  // Fetch overdue applicants
  const fetchOverdueApplicants = async (page = 1, searchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        per_page: itemsPerPage,
        ...searchParams
      };

      // Map search field to API field names if needed
      if (searchField && searchTerm) {
        params.search_by = searchField;
        params.search_value = searchTerm;
      }

      const response = await overdueApplicantService.getOverdueApplicants(params);
      
      if (response.success) {
        // Transform API data to match your UI structure
        const transformedData = response.data.map((applicant, index) => ({
          id: applicant.application_id,
          srNo: (page - 1) * itemsPerPage + index + 1,
          call: true,
          loanNo: applicant.loan_no,
          dueDate: formatDate(applicant.duedate),
          name: applicant.fullname,
          phoneNo: applicant.phone,
          email: applicant.email,
          adjustment: "Adjustment",
          balance: parseFloat(applicant.ledger_balance),
          overdueAmt: parseFloat(applicant.overdue_details?.overdue?.total_due || applicant.ledger_balance),
          upiPayments: parseFloat(applicant.total_collection),
          demandNotice: "Send Notice",
          status: applicant.ovedays > 0 ? "Overdue" : "Adjustment",
          sreAssignDate: applicant.last_collection_date ? formatDate(applicant.last_collection_date) : "N/A",
          // API specific fields
          application_id: applicant.application_id,
          overdue_details: applicant.overdue_details,
          ovedays: applicant.ovedays,
          approved_amount: parseFloat(applicant.approved_amount),
          roi: parseFloat(applicant.roi),
          tenure: applicant.tenure
        }));

        setOverdueApplicants(transformedData);
        setPagination(response.pagination);
        setCurrentPage(response.pagination.current_page);
      }
    } catch (err) {
      console.error("Error fetching overdue applicants:", err);
      setError("Failed to fetch overdue applicants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  };

  // Initial load
  useEffect(() => {
    fetchOverdueApplicants();
  }, [itemsPerPage]);

  // Handle search
  const handleAdvancedSearch = ({ field, term }) => {
    setSearchField(field);
    setSearchTerm(term);
    setCurrentPage(1);
    fetchOverdueApplicants(1, {
      search_by: field,
      search_value: term
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOverdueApplicants(page, {
      search_by: searchField,
      search_value: searchTerm
    });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAdjustmentClick = (applicant) => {
    setSelectedApplicantForAdjustment(applicant);
    setShowAdjustmentModal(true);
  };

  const handleAdjustmentSubmit = (adjustmentData) => {
    console.log("Adjustment submitted:", adjustmentData);
    setShowAdjustmentModal(false);
    setSelectedApplicantForAdjustment(null);
  };

  const handleOverdueAmountClick = (applicant) => {
    setSelectedApplicantForOverdue(applicant);
    setShowOverdueModal(true);
  };

  const handleRenew = (applicant) => {
    console.log("Renewing for:", applicant.name);
    // Add your renew logic here
  };

  const handleSendNotice = (applicant) => {
    console.log("Sending notice to:", applicant.name);
    // Add your send notice logic here
  };

  const handleView = (applicant) => {
    console.log('Viewing details for:', applicant.name);
    setSelectedApplicantForLedger(applicant);
    setShowLedgerModal(true);
  };

  const handleChargeICICI = (applicant) => {
    console.log('Charging ICICI for:', applicant.name);
    // Add your charge ICICI logic here
  };

  const handleSREAssign = (applicant) => {
    console.log('Assigning SRE for:', applicant.name);
    // Add your SRE assign logic here
  };

  const handleBalanceUpdate = (updateData) => {
    console.log('Balance updated:', updateData);
    // Add your balance update logic here
    setShowLedgerModal(false);
    setSelectedApplicantForLedger(null);
  };

  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", "recipients");
    // Add your bulk email logic here
  };

  const handleExport = async (type) => {
    try {
      setLoading(true);
      const response = await overdueApplicantService.exportOverdueApplicants({
        search_by: searchField,
        search_value: searchTerm
      });

      if (response.success) {
        const exportData = response.data.map(applicant => ({
          "SR No": applicant.application_id,
          "Loan No": applicant.loan_no,
          "Due Date": formatDate(applicant.duedate),
          "Name": applicant.fullname,
          "Phone No": applicant.phone,
          "Email": applicant.email,
          "Balance": parseFloat(applicant.ledger_balance),
          "Overdue Amount": parseFloat(applicant.overdue_details?.overdue?.total_due || applicant.ledger_balance),
          "UPI Payments": parseFloat(applicant.total_collection),
          "Status": applicant.ovedays > 0 ? "Overdue" : "Adjustment",
          "Approved Amount": parseFloat(applicant.approved_amount),
          "ROI": `${(parseFloat(applicant.roi) * 100).toFixed(1)}%`,
          "Days Overdue": applicant.ovedays
        }));

        if (type === "excel") {
          exportToExcel(exportData, "overdue_applicants");
        } else if (type === "overdue_ref") {
          exportToExcel(exportData, "overdue_reference_export");
        }
      }
    } catch (err) {
      console.error("Error exporting data:", err);
      setError("Failed to export data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic for local filtering (if still needed)
  const filteredApplicants = overdueApplicants.filter(applicant => {
    const matchesStatus = statusFilter === "all" || 
      applicant.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesStatus;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark
        ? "bg-gray-900"
        : "bg-emerald-50/30"}`}
    >
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"}`}
              >
                <ArrowLeft
                  className={`w-5 h-5 ${isDark
                    ? "text-emerald-400"
                    : "text-emerald-600"}`}
                />
              </button>
              <h1
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${isDark
                  ? "from-emerald-400 to-teal-400"
                  : "from-emerald-600 to-teal-600"} bg-clip-text text-transparent`}
              >
                Overdue Applicants
              </h1>
            </div>

            {/* Export Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport("excel")}
                disabled={loading}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${isDark
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Download size={16} />
                <span>{loading ? "Exporting..." : "Export"}</span>
              </button>

              <button
                onClick={() => handleExport("overdue_ref")}
                disabled={loading}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Download size={16} />
                <span>{loading ? "Exporting..." : "Overdue Ref. Export"}</span>
              </button>

              <button
                onClick={() => handleBulkEmail()}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${isDark
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"}`}
              >
                <Mail size={16} />
                <span>Send Bulk Email</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <AdvancedSearchBar 
                searchOptions={SearchOptions}
                onSearch={handleAdvancedSearch}
                isDark={isDark}
              />
            </div>
            
            {/* Items Per Page Dropdown */}
            <div className="flex items-center space-x-2">
              <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Show:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  isDark 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-3 rounded-lg ${isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700"}`}>
              {error}
            </div>
          )}

          {/* Total Records Display */}
          <div
            className={`mb-4 px-4 py-2 rounded-lg ${isDark
              ? "bg-gray-800/50 text-emerald-400"
              : "bg-emerald-50 text-emerald-700"}`}
          >
            <span className="font-semibold">
              Total Records: {pagination.total}
              {loading && " (Loading...)"}
            </span>
          </div>
        </div>

        {/* Table */}
        <OverdueApplicantTable
          paginatedApplicants={filteredApplicants}
          filteredApplicants={filteredApplicants}
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={handlePageChange}
          onAdjustment={handleAdjustmentClick}
          onRenew={handleRenew}
          onSendNotice={handleSendNotice}
          onOverdueAmountClick={handleOverdueAmountClick}
          onView={handleView}
          onChargeICICI={handleChargeICICI}
          onSREAssign={handleSREAssign}
          loading={loading}
        />
      </div>

      {/* All Modals */}
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

      <OverdueAmountModal
        isOpen={showOverdueModal}
        onClose={() => {
          setShowOverdueModal(false);
          setSelectedApplicantForOverdue(null);
        }}
        applicant={selectedApplicantForOverdue}
        isDark={isDark}
      />

      <CustomerTransactionDetails
        isOpen={showLedgerModal}
        onClose={() => {
          setShowLedgerModal(false);
          setSelectedApplicantForLedger(null);
        }}
        data={selectedApplicantForLedger}
        isDark={isDark}
        onUpdateBalance={handleBalanceUpdate}
      />
    </div>
  );
};

export default OverdueApplicantList;