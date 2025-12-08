"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Mail, RefreshCw } from "lucide-react";
import AdvancedSearchBar from "../AdvanceSearchBar";
import { exportToExcel } from "@/components/utils/exportutil";
import OverdueApplicantTable from "./OverdueApplicantListTable";
import AdjustmentModal from "../application-modals/AdjustmentModal";
import OverdueAmountModal from "../application-modals/OverdueAmountModal";
import CustomerTransactionDetails from "../CustomerTransactionDetails";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { overdueApplicantService } from "@/lib/services/OverdueApplicantServices";
import Swal from 'sweetalert2';

const OverdueApplicantList = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  
  const [selectedApplicantForAdjustment, setSelectedApplicantForAdjustment] = useState(null);
  const [selectedApplicantForOverdue, setSelectedApplicantForOverdue] = useState(null);
  const [selectedApplicantForLedger, setSelectedApplicantForLedger] = useState(null);
  
  const [overdueApplicants, setOverdueApplicants] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const searchOptions = [
    { value: 'loan_no', label: 'Loan No.' },
    { value: 'crnno', label: 'CRN No.' },
    { value: 'name', label: 'Name' },
    { value: 'phone', label: 'Phone Number' },
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

  const fetchOverdueApplicants = async () => {
    try {
      setLoading(true);
      
      const params = buildApiParams();
      const response = await overdueApplicantService.getOverdueApplicants(params);
      
      if (response && response.data) {
        const formattedApplicants = response.data.map((item, index) => ({
          ...item,
          srNo: (currentPage - 1) * itemsPerPage + index + 1,
          call: true,
          adjustment: "Adjustment",
          demandNotice: "Send Notice",
          sreAssignDate: item.last_collection_date ? formatDate(item.last_collection_date) : "N/A"
        }));
        
        setOverdueApplicants(formattedApplicants);
        setTotalCount(response.pagination?.total || response.data.length);
        setTotalPages(response.pagination?.total_pages || 1);
      } else {
        setOverdueApplicants([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching overdue applicants:", err);
      setOverdueApplicants([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    fetchOverdueApplicants();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 1) {
      fetchOverdueApplicants();
    } else {
      setCurrentPage(1);
    }
  }, [searchField, searchTerm, dateRange]);

  const handleExport = async (type) => {
    if (overdueApplicants.length === 0) {
      Swal.fire({
        title: 'No Data to Export',
        text: 'There is no overdue applicant data to export.',
        icon: 'warning',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      return;
    }

    const result = await Swal.fire({
      title: type === "excel" ? 'Export Overdue Applicants?' : 'Export Overdue Reference?',
      text: `This will export all overdue applicant data with current filters.`,
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
        'SR No', 'Loan No', 'Due Date', 'Name', 'Phone No', 'Email',
        'Balance', 'Overdue Amount', 'UPI Payments', 'Days Overdue',
        'Status', 'Approved Amount', 'ROI (%)', 'Tenure'
      ];

      const dataRows = overdueApplicants.map((item, index) => [
        index + 1,
        item.loanNo,
        item.dueDate,
        item.name,
        item.phoneNo,
        item.email,
        item.balance.toFixed(2),
        item.overdueAmt.toFixed(2),
        item.upiPayments.toFixed(2),
        item.ovedays,
        item.status,
        item.approved_amount.toFixed(2),
        `${(parseFloat(item.roi) * 100).toFixed(1)}%`,
        item.tenure
      ]);

      const exportData = [headers, ...dataRows];
      const filename = type === "excel" 
        ? `overdue-applicants-${new Date().toISOString().split('T')[0]}.csv`
        : `overdue-reference-${new Date().toISOString().split('T')[0]}.csv`;
      
      exportToExcel(exportData, filename);
      
      await Swal.fire({
        title: 'Export Successful!',
        text: 'Overdue applicant data has been exported as CSV.',
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

  const handleAdjustmentClick = (applicant) => {
    setSelectedApplicantForAdjustment(applicant);
    setShowAdjustmentModal(true);
  };

  const handleAdjustmentSubmit = async (adjustmentData) => {
    try {
      console.log("Adjustment submitted:", adjustmentData);
      await Swal.fire({
        title: 'Adjustment Submitted!',
        text: 'Adjustment has been submitted successfully.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      fetchOverdueApplicants();
    } catch (error) {
      console.error("Adjustment error:", error);
      Swal.fire({
        title: 'Adjustment Failed!',
        text: error.message || 'Failed to submit adjustment.',
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

  const handleOverdueAmountClick = (applicant) => {
    setSelectedApplicantForOverdue(applicant);
    setShowOverdueModal(true);
  };

  const handleRenew = (applicant) => {
    console.log("Renewing for:", applicant.name);
    // Add renew logic here
  };

  const handleSendNotice = (applicant) => {
    console.log("Sending notice to:", applicant.name);
    // Add send notice logic here
  };

  const handleView = (applicant) => {
    setSelectedApplicantForLedger(applicant);
    setShowLedgerModal(true);
  };

  const handleChargeICICI = (applicant) => {
    console.log('Charging ICICI for:', applicant.name);
    // Add charge ICICI logic here
  };

  const handleSREAssign = (applicant) => {
    console.log('Assigning SRE for:', applicant.name);
    // Add SRE assign logic here
  };

  const handleBalanceUpdate = (updateData) => {
    console.log('Balance updated:', updateData);
    setShowLedgerModal(false);
    setSelectedApplicantForLedger(null);
  };

  const handleBulkEmail = () => {
    console.log("Sending bulk email to:", "recipients");
    // Add bulk email logic here
  };

  if (loading && overdueApplicants.length === 0) {
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
            Loading overdue applicants...
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
                Overdue Applicants ({totalCount})
              </h1>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => fetchOverdueApplicants()}
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
                onClick={() => handleExport("excel")}
                disabled={exporting || overdueApplicants.length === 0}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } ${exporting || overdueApplicants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Export'}</span>
              </button>
              
              <button
                onClick={() => handleExport("overdue_ref")}
                disabled={exporting || overdueApplicants.length === 0}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } ${exporting || overdueApplicants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Ref. Export'}</span>
              </button>
              
              <button
                onClick={handleBulkEmail}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Bulk Email</span>
              </button>
            </div>
          </div>

          {/* <DateFilter 
            isDark={isDark} 
            onFilterChange={handleDateFilter}
            dateField="duedate"
            showSourceFilter={false}
            buttonLabels={{
              apply: "Apply",
              clear: "Clear"
            }}
          /> */}

          <div className="mb-6">
            <AdvancedSearchBar 
              searchOptions={searchOptions}
              onSearch={handleAdvancedSearch}
              isDark={isDark}
              placeholder="Search overdue applicants..."
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
                    Showing {overdueApplicants.length} of {totalCount}
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

        <OverdueApplicantTable
          paginatedApplicants={overdueApplicants}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onAdjustment={handleAdjustmentClick}
          onRenew={handleRenew}
          onSendNotice={handleSendNotice}
          onOverdueAmountClick={handleOverdueAmountClick}
          onView={handleView}
          onChargeICICI={handleChargeICICI}
          onSREAssign={handleSREAssign}
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