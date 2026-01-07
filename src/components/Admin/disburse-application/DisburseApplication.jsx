"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateFilter from "../DateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import DisburseTable from "./DisburseTable";
import DisbursementModal from "../application-modals/DisbursementModal";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { 
  disburseApprovalService,
  formatDisburseApprovalApplicationForUI,
  disburseFileService
} from "@/lib/services/DisburseApprovalServices";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const DisburseApplication = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [loadingFileName, setLoadingFileName] = useState('');

  // Modal state - only DisbursementModal is needed
  const [disbursementModalOpen, setDisbursementModalOpen] = useState(false);
  const [currentDisbursementApplication, setCurrentDisbursementApplication] = useState(null);

  // Search and filter states
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Data states
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  // Search Options
  const SearchOptions = [
    { value: 'loan_no', label: 'Loan No' },
    { value: 'crnno', label: 'CRN No' },
    { value: 'name', label: 'Name' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'email', label: 'Email' },
    { value: 'city', label: 'City' },
    { value: 'state', label: 'State' },
  ];

  // Build API parameters
  const buildApiParams = () => {
    const params = {
      per_page: itemsPerPage,
      page: currentPage,
    };

    // Add search parameters
    if (searchField && searchTerm.trim()) {
      params.search_by = searchField;
      params.search_value = searchTerm.trim();
    }

    // Add date filters
    if (dateRange.start) {
      params.from_date = dateRange.start;
    }
    if (dateRange.end) {
      params.to_date = dateRange.end;
    }

    return params;
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = buildApiParams();
      const response = await disburseApprovalService.getApplications(params);
      
      const actualResponse = response?.success ? response : { success: true, data: response, pagination: {} };
      
      if (actualResponse && actualResponse.success) {
        const applicationsData = actualResponse.data || [];
        const formattedApplications = applicationsData.map(formatDisburseApprovalApplicationForUI);
        setApplications(formattedApplications);
        setTotalCount(actualResponse.pagination?.total || applicationsData.length);
        setTotalPages(actualResponse.pagination?.total_pages || 1);
        
        if (applicationsData.length === 0) {
          setError("No applications found with current filters");
        }
      } else {
        setApplications([]);
        setTotalCount(0);
        setError("No applications found");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setApplications([]);
      setTotalCount(0);
      setError("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load data when filters or page changes
  useEffect(() => {
    fetchApplications();
  }, [currentPage]);

  // Handle search and date filter changes
  useEffect(() => {
    if (currentPage === 1) {
      fetchApplications();
    } else {
      setCurrentPage(1);
    }
  }, [searchField, searchTerm, dateRange]);

  // Bank Verification Handler
  const handleBankVerification = async (application) => {
    if (application.bankVerification === "verified") {
      toast.success('Bank verification already completed!');
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Bank Verification?',
      text: `Are you sure you want to verify bank account for ${application.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Verify!',
      cancelButtonText: 'Cancel',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });

    if (!result.isConfirmed) return;

    try {
      await disburseApprovalService.updateBankVerification(application.id);
      await fetchApplications();
      
      await Swal.fire({
        title: 'Verified!',
        text: 'Bank verification completed successfully!',
        icon: 'success',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } catch (error) {
      console.error('Error updating bank verification:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to update bank verification',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    }
  };

  // Disburse Approval Handler
  const handleDisburseApproval = async (application) => {
    if (application.disburseApproval === "approved") {
      toast.success('Disburse approval already completed!');
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Disburse Approval?',
      text: `Are you sure you want to approve disbursement for ${application.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Cancel',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });

    if (!result.isConfirmed) return;

    try {
      await disburseApprovalService.updateDisburseApproval(application.id);
      await fetchApplications();
      
      await Swal.fire({
        title: 'Approved!',
        text: 'Disburse approval completed successfully!',
        icon: 'success',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } catch (error) {
      console.error('Error updating disburse approval:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to update disburse approval',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    }
  };

  // Disbursement modal handlers
  const handleDisbursementModalOpen = (application) => {
    setCurrentDisbursementApplication(application);
    setDisbursementModalOpen(true);
  };

  const handleDisbursementModalClose = () => {
    setDisbursementModalOpen(false);
    setCurrentDisbursementApplication(null);
  };

  const handleDisbursementSubmit = async (applicationId, formData) => {
    try {
      await disburseApprovalService.submitDisbursement(applicationId, formData);
      await fetchApplications();
      toast.success('Disbursement processed successfully!');
    } catch (error) {
      toast.error('Failed to process disbursement');
      throw error;
    }
  };

  // Handle Advanced Search
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

  // Handle Date Filter
  const handleDateFilter = (filters) => {
    setDateRange(filters.dateRange || { start: "", end: "" });
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  // Export to Excel
  const handleExportToExcel = async () => {
    const result = await Swal.fire({
      title: 'Export Applications?',
      text: 'This will export all disburse applications with current filters.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Export!',
      cancelButtonText: 'Cancel',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });

    if (!result.isConfirmed) return;

    try {
      setExporting(true);
      
      const exportParams = { ...buildApiParams() };
      delete exportParams.per_page;
      delete exportParams.page;
      
      const response = await disburseApprovalService.exportApplications(exportParams);
      
      if (response.success) {
        const headers = [
          'Sr. No.', 'Loan No.', 'CRN No.', 'Account ID', 'Approved Date', 'Disburse Date', 'Due Date',
          'Name', 'Current Address', 'Current State', 'Current City', 'Phone', 'Email', 
          'Applied Amount', 'Approved Amount', 'Admin Fee', 'ROI (%)', 'Tenure (Days)',
          'Loan Status', 'Status', 'Created At'
        ];

        const dataRows = response.data.map((app, index) => [
          index + 1,
          app.loanNo,
          app.crnNo,
          app.accountId,
          app.approvedDate,
          app.disburseDate,
          app.dueDate,
          app.name,
          app.currentAddress,
          app.currentState,
          app.currentCity,
          app.phoneNo,
          app.email,
          app.applied_amount,
          app.approved_amount,
          app.admin_fee || '0.00',
          `${(parseFloat(app.roi) * 100).toFixed(2)}%`,
          app.tenure,
          app.loanStatus,
          app.status,
          app.createdAt
        ]);

        const exportData = [headers, ...dataRows];
        exportToExcel(exportData, `disburse_applications_${new Date().toISOString().split('T')[0]}`);
        
        await Swal.fire({
          title: 'Export Successful!',
          text: 'Applications have been exported to Excel successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });
      } else {
        throw new Error("Failed to export data");
      }
    } catch (err) {
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

  // Handle file view (still needed for any document viewing)
  const handleFileView = async (fileName, documentCategory) => {
    if (!fileName) {
      alert('No file available');
      return;
    }
    
    setFileLoading(true);
    setLoadingFileName(fileName);
    
    try {
      const url = await disburseFileService.viewFile(fileName, documentCategory);
      
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        alert('Popup blocked! Please allow popups for this site.');
      }
    } catch (error) {
      alert(`Failed to load file: ${fileName}. Please check if file exists.`);
    } finally {
      setFileLoading(false);
      setLoadingFileName('');
    }
  };

  if (loading && applications.length === 0) {
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
            Loading applications...
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
  {/* Left section - Back button and title */}
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
    <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${
      isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
    } bg-clip-text text-transparent`}>
      Disburse Applications <span className="hidden xs:inline">Applications</span> ({totalCount})
    </h1>
  </div>
  
  {/* Right section - Export and Refresh buttons */}
  <div className="flex gap-2 w-full sm:w-auto">
    <button
      onClick={() => fetchApplications()}
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
      onClick={handleExportToExcel}
      disabled={exporting || applications.length === 0}
      className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
        isDark
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-green-500 hover:bg-green-600 text-white"
      } ${exporting || applications.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${exporting ? 'animate-spin' : ''}`} />
      <span className="text-xs sm:text-sm">
        {exporting ? 'Exporting...' : 'Export'}
      </span>
    </button>
  </div>
</div>

          {/* Date Filter */}
          <DateFilter 
            isDark={isDark} 
            onFilterChange={handleDateFilter}
            dateField="enquiry_date"
            showSourceFilter={false}
            buttonLabels={{
              apply: "Apply",
              clear: "Clear"
            }}
          />

          {/* Search and Filters */}
          <div className="mb-6 md:grid md:grid-cols-2">
            <AdvancedSearchBar 
              searchOptions={SearchOptions}
              onSearch={handleAdvancedSearch}
              isDark={isDark}
              placeholder="Search disburse applications..."
              buttonText="Search"
            />
          </div>

          {/* Filter Summary */}
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
                      {SearchOptions.find(opt => opt.value === searchField)?.label}: {searchTerm}
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
                    Showing {applications.length} of {totalCount}
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

        {/* Table */}
        <DisburseTable
          paginatedApplications={applications.map((app, index) => ({
            ...app,
            srNo: (currentPage - 1) * itemsPerPage + index + 1
          }))}
          filteredApplications={applications}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onBankVerification={handleBankVerification}
          onDisburseApproval={handleDisburseApproval}
          onStatusClick={handleDisbursementModalOpen}
        />
      </div>

      {/* Only DisbursementModal remains */}
      {currentDisbursementApplication && (
        <DisbursementModal
          isOpen={disbursementModalOpen}
          onClose={handleDisbursementModalClose}
          application={currentDisbursementApplication}
          onDisbursementSubmit={handleDisbursementSubmit}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default DisburseApplication;