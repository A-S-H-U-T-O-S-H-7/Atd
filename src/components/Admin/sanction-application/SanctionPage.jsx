"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateRangeFilter from "../DateRangeFilter";
import SanctionTable from "./SanctionTable";

import CallDetailsModal from "../CallDetailsModal";

import ChequeModal from "../application-modals/ChequeSubmit";
import SendToCourierModal from "../application-modals/SendToCourierModal";
import CourierPickedModal from "../application-modals/CourierPickedModal";
import OriginalDocumentsModal from "../application-modals/OriginalDocumentsModal";
import DisburseEmandateModal from "../application-modals/DisburseEmandateModal";
import ChangeStatusModal from "../application-modals/StatusModal";
import RefundPDCModal from "../application-modals/RefundPdcModal";

import { useThemeStore } from "@/lib/store/useThemeStore";
import { 
  sanctionApplicationAPI,
  formatSanctionApplicationForUI,
  fileService,
  sanctionService
} from "@/lib/services/SanctionApplicationServices";
import { exportToExcel } from "@/components/utils/exportutil";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";
import StatusUpdateModal from "../StatusUpdateModal";

const SanctionPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loanStatusFilter, setLoanStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [loadingFileName, setLoadingFileName] = useState('');

  // Modal states
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [chequeModalOpen, setChequeModalOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [currentChequeNo, setCurrentChequeNo] = useState('');
  const [courierModalOpen, setCourierModalOpen] = useState(false);
  const [currentCourierApplication, setCurrentCourierApplication] = useState(null);
  const [courierPickedModalOpen, setCourierPickedModalOpen] = useState(false);
  const [currentCourierPickedApplication, setCurrentCourierPickedApplication] = useState(null);
  const [originalDocumentsModalOpen, setOriginalDocumentsModalOpen] = useState(false);
  const [currentOriginalDocumentsApplication, setCurrentOriginalDocumentsApplication] = useState(null);
  const [disburseEmandateModalOpen, setDisburseEmandateModalOpen] = useState(false);
  const [currentDisburseEmandateApplication, setCurrentDisburseEmandateApplication] = useState(null);
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [currentChangeStatusApplication, setCurrentChangeStatusApplication] = useState(null);
  const [refundPDCModalOpen, setRefundPDCModalOpen] = useState(false);
  const [currentRefundPDCApplication, setCurrentRefundPDCApplication] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
const [currentStatusApplication, setCurrentStatusApplication] = useState(null);


  // Search and filter states
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  
  // Data states
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const SearchOptions = [
    { value: 'loanNo', label: 'Loan No.' },
    { value: 'crnNo', label: 'CRN No.' },
    { value: 'accountId', label: 'Account ID' },
    { value: 'name', label: 'Name' },
    { value: 'phoneNo', label: 'Phone Number' },
    { value: 'email', label: 'Email' },
    { value: 'appliedAmount', label: 'Applied Amount' },
    { value: 'approvedAmount', label: 'Approved Amount' },
  ];

  // Build API parameters
  const buildApiParams = () => {
    const params = {
      per_page: itemsPerPage,
      page: currentPage,
    };

    // Add search parameters
    if (searchField && searchTerm) {
      params.search_by = searchField;
      params.search_value = searchTerm;
    }

    // Add date filters
    if (dateFilter.start) {
      params.from_date = dateFilter.start;
    }
    if (dateFilter.end) {
      params.to_date = dateFilter.end;
    }

    return params;
  };

  // Fetch applications
  const fetchApplications = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setIsAutoRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const params = buildApiParams();
      const response = await sanctionApplicationAPI.getSanctionApplications(params);
      
      const actualResponse = response?.success ? response : { success: true, data: response, pagination: {} };
      
      if (actualResponse && actualResponse.success && actualResponse.data) {
        const formattedApplications = actualResponse.data.map(formatSanctionApplicationForUI);
        setApplications(formattedApplications);
        setTotalCount(actualResponse.pagination?.total || actualResponse.data.length);
        setTotalPages(actualResponse.pagination?.total_pages || 1);
      } else {
        console.error("❌ Invalid API Response structure:", actualResponse);
        setError("Failed to fetch applications - Invalid response");
      }
    } catch (err) {
      console.error("❌ Error details:", err);
      setError("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
      setIsAutoRefreshing(false);
    }
  };

  const statusOptions = [
  { value: "Ready To Verify", label: "Ready To Verify" }
];

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchApplications();
  }, [currentPage, searchField, searchTerm, dateFilter]);

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchApplications(true);
      }
    }, 60000); // 1 minute
  
    return () => clearInterval(interval);
  }, [currentPage, searchField, searchTerm, dateFilter]);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchApplications(true);
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentPage, searchField, searchTerm, dateFilter]);

  // Modal handlers
  const handleChequeModalOpen = (application, chequeNumber) => {
    setCurrentApplication(application);
    setCurrentChequeNo(chequeNumber);
    setChequeModalOpen(true);
  };

  const handleChequeModalClose = () => {
    setChequeModalOpen(false);
    setCurrentApplication(null);
    setCurrentChequeNo('');
  };

const handleChequeSubmit = async (newChequeNo) => {
  try {
    await sanctionService.updateChequeNumber(currentApplication.id, newChequeNo);
    
    // Update UI immediately
    setApplications(prev => prev.map(app => 
      app.id === currentApplication.id 
        ? { ...app, chequeNo: newChequeNo }
        : app
    ));
    
    // Also refresh from server
    fetchApplications();
  } catch (error) {
    toast.error('Failed to update cheque number');
    throw error;
  }
};

const handleCourierSubmit = async (courierDate) => {
  try {
    await sanctionService.updateSendToCourier(currentCourierApplication.id, courierDate);
    fetchApplications();
  } catch (error) {
    toast.error('Failed to schedule courier');
    throw error;
  }
};

const handleCourierPickedSubmit = async (isPicked, pickedDate) => {
  try {
    await sanctionService.updateCourierPicked(
      currentCourierPickedApplication.id, 
      isPicked, 
      pickedDate
    );
    fetchApplications();
  } catch (error) {
    toast.error('Failed to update courier status');
    throw error;
  }
};

// Update original documents handler
const handleOriginalDocumentsSubmit = async (isReceived, receivedDate) => {
  try {
    await sanctionService.updateOriginalDocuments(
      currentOriginalDocumentsApplication.id, 
      isReceived, 
      receivedDate
    );
    fetchApplications();
  } catch (error) {
    toast.error('Failed to update documents status');
    throw error;
  }
};

const handleDisburseEmandateSubmit = async (selectedOption) => {
  try {
    await sanctionService.updateEmandateStatus(
      currentDisburseEmandateApplication.id, 
      selectedOption
    );
    
    // Update UI immediately for better UX
    setApplications(prev => prev.map(app => 
      app.id === currentDisburseEmandateApplication.id 
        ? { ...app, receivedDisburse: selectedOption }
        : app
    ));
    
    // Refresh from server to sync
    await fetchApplications();
    
    toast.success(`E-mandate status updated to "${selectedOption}" successfully!`);
  } catch (error) {
    toast.error('Failed to update e-mandate status');
    throw error;
  }
};

// Update status change handler
const handleChangeStatusSubmit = async (updateData) => {
  try {
    await sanctionService.updateStatusChange(
      currentChangeStatusApplication.id, 
      updateData
    );
    fetchApplications();
  } catch (error) {
    toast.error('Failed to update status');
    throw error;
  }
};

const handleStatusUpdate = async (applicationId, status, remark) => {
  try {
    await sanctionService.updateLoanStatus(applicationId, status, remark);
    fetchApplications();
  } catch (error) {
    toast.error('Failed to update loan status');
    throw error;
  }
};

const handleStatusModalOpen = (application) => {
  setCurrentStatusApplication(application);
  setStatusModalOpen(true);
};

const handleStatusModalClose = () => {
  setStatusModalOpen(false);
  setCurrentStatusApplication(null);
};

  const handleOriginalDocumentsModalOpen = (application) => {
    setCurrentOriginalDocumentsApplication(application);
    setOriginalDocumentsModalOpen(true);
  };

  const handleOriginalDocumentsModalClose = () => {
    setOriginalDocumentsModalOpen(false);
    setCurrentOriginalDocumentsApplication(null);
  };

  const handleRefundPDCModalOpen = (application) => {
    setCurrentRefundPDCApplication(application);
    setRefundPDCModalOpen(true);
  };

  const handleRefundPDCModalClose = () => {
    setRefundPDCModalOpen(false);
    setCurrentRefundPDCApplication(null);
  };

  const handleRefundPDCSubmit = async (refundStatus) => {
    try {
      // Implement refund PDC API call here
      console.log('Refund PDC status saved:', refundStatus);
      fetchApplications();
      Swal.fire({
        title: 'Success!',
        text: 'Refund PDC status updated successfully',
        icon: 'success',
        confirmButtonColor: '#10b981',
      });
    } catch (error) {
      console.error('Error saving refund PDC status:', error);
      throw error;
    }
  };

  const handleChangeStatusModalOpen = (application) => {
    setCurrentChangeStatusApplication(application);
    setChangeStatusModalOpen(true);
  };

  const handleChangeStatusModalClose = () => {
    setChangeStatusModalOpen(false);
    setCurrentChangeStatusApplication(null);
  };


  const handleDisburseEmandateModalOpen = (application) => {
    setCurrentDisburseEmandateApplication(application);
    setDisburseEmandateModalOpen(true);
  };

  const handleDisburseEmandateModalClose = () => {
    setDisburseEmandateModalOpen(false);
    setCurrentDisburseEmandateApplication(null);
  };

  const handleCourierPickedModalOpen = (application) => {
    setCurrentCourierPickedApplication(application);
    setCourierPickedModalOpen(true);
  };

  const handleCourierPickedModalClose = () => {
    setCourierPickedModalOpen(false);
    setCurrentCourierPickedApplication(null);
  };


  const handleCourierModalOpen = (application) => {
    setCurrentCourierApplication(application);
    setCourierModalOpen(true);
  };

  const handleCourierModalClose = () => {
    setCourierModalOpen(false);
    setCurrentCourierApplication(null);
  };

  

  // Navigation handlers
  const handleLoanEligibilityClick = (application) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(application));
    router.push(`/crm/loan-eligibility/${application.id}`);
  };

  const handleCheckClick = (application) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(application));
    router.push(`/crm/appraisal-report/${application.id}`);
  };

  const handleReplaceKYCClick = (application) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(application));
    router.push(`/crm/replace-kyc/${application.id}`);
  };

  const handleActionClick = (application) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(application));
    router.push(`/crm/application-form/${application.id}`);
  };

  const handleCall = (applicant) => {
    setSelectedApplicant(applicant);
    setShowCallModal(true);
  };

  // Handle file view
  const handleFileView = async (fileName, documentCategory) => {
    if (!fileName) {
      alert('No file available');
      return;
    }
    
    setFileLoading(true);
    setLoadingFileName(fileName);
    
    try {
      const url = await fileService.viewFile(fileName, documentCategory);
      
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        alert('Popup blocked! Please allow popups for this site.');
      }
    } catch (error) {
      console.error("Failed to load file:", error);
      alert(`Failed to load file: ${fileName}. Please check if file exists.`);
    } finally {
      setFileLoading(false);
      setLoadingFileName('');
    }
  };

  // Handle Advanced Search
  const handleAdvancedSearch = ({ field, term }) => {
    setSearchField(field);
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handle Date Filter Change
  const handleDateFilterChange = (filterData) => {
    setDateFilter(filterData.dateRange);
    setCurrentPage(1);
  };

  // Export to Excel
  const handleExportToExcel = async () => {
    const result = await Swal.fire({
      title: 'Export Applications?',
      text: 'This will export all sanction applications with current filters.',
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
      
      // Build export params without pagination
      const exportParams = { ...buildApiParams() };
      delete exportParams.per_page;
      delete exportParams.page;
      
      const response = await sanctionApplicationAPI.exportSanctionApplications(exportParams);
      
      if (response.success) {
        const headers = [
          'Sr. No.', 'Loan No.', 'CRN No.', 'Account ID', 'Name', 'Phone', 'Email', 
          'Current Address', 'Current State', 'Current City', 'Permanent Address', 'State', 'City',
          'Applied Amount', 'Approved Amount', 'Admin Fee', 'ROI (%)', 'Tenure (Days)', 'Loan Term',
          'Loan Status', 'Approval Note', 'Enquiry Type', 'Cheque No', 'Send To Courier', 
          'Courier Picked', 'Original Documents', 'E-mandate Status'
        ];

        const dataRows = response.data.map((app, index) => [
          index + 1,
          app.loanNo,
          app.crnNo,
          app.accountId,
          app.name,
          app.phoneNo,
          app.email || 'N/A',
          app.currentAddress,
          app.currentState,
          app.currentCity,
          app.permanentAddress,
          app.state,
          app.city,
          app.applied_amount,
          app.approved_amount,
          app.admin_fee || '0.00',
          `${(parseFloat(app.roi) * 100).toFixed(2)}%`,
          app.tenure,
          app.loan_term === 4 ? "One Time Payment" : "Daily",
          app.loanStatus,
          app.approval_note,
          app.enquiry_type || 'N/A',
          app.cheque_no || 'N/A',
          app.send_courier === 1 ? "Yes" : "No",
          app.courier_picked === 1 ? "Yes" : "No",
          app.original_documents === 1 ? "Yes" : "No",
          app.emandateverification || 'No'
        ]);

        const exportData = [headers, ...dataRows];
        exportToExcel(exportData, `sanction_applications_${new Date().toISOString().split('T')[0]}`);
        
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
      console.error("Export error:", err);
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

  // Clear all filters
  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setStatusFilter("all");
    setLoanStatusFilter("all");
    setDateFilter({ start: "", end: "" });
    setCurrentPage(1);
  };

  // Client-side filtering
  const filteredApplications = applications.filter(app => {
    const appStatus = (app.status || '').toLowerCase().trim();
    const appLoanStatus = (app.loanStatus || '').toLowerCase().trim();
    const filterStatus = statusFilter.toLowerCase().trim();
    const filterLoanStatus = loanStatusFilter.toLowerCase().trim();
    
    const matchesStatus = statusFilter === "all" || appStatus === filterStatus;
    const matchesLoanStatus = loanStatusFilter === "all" || appLoanStatus === filterLoanStatus;
    
    return matchesStatus && matchesLoanStatus;
  });

  // Pagination
  const paginatedApplications = filteredApplications.map((app, index) => ({
    ...app,
    srNo: (currentPage - 1) * itemsPerPage + index + 1
  }));

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
                Sanction Application ({totalCount})
              </h1>
            </div>
            
            <button
              onClick={handleExportToExcel}
              disabled={exporting || applications.length === 0}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                exporting || applications.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg"
              } ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {exporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {exporting ? "Exporting..." : "Export"}
              </span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-800 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

          {/* Date Filter */}
          <DateRangeFilter 
            isDark={isDark}
            onFilterChange={handleDateFilterChange}
            showSourceFilter={false}
          />

          {/* Search and Status Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <AdvancedSearchBar 
                searchOptions={SearchOptions}
                onSearch={handleAdvancedSearch}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Filter Summary */}
          {(searchTerm || dateFilter.start || dateFilter.end || statusFilter !== "all" || loanStatusFilter !== "all") && (
            <div className={`mb-4 p-4 rounded-lg border ${
              isDark ? "bg-gray-800/50 border-emerald-600/30" : "bg-emerald-50/50 border-emerald-200"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    Active Filters:
                  </span>
                  {searchTerm && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {SearchOptions.find(opt => opt.value === searchField)?.label}: {searchTerm}
                    </span>
                  )}
                  {dateFilter.start && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      From: {dateFilter.start}
                    </span>
                  )}
                  {dateFilter.end && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      To: {dateFilter.end}
                    </span>
                  )}
                  {statusFilter !== "all" && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      Status: {statusFilter}
                    </span>
                  )}
                  {loanStatusFilter !== "all" && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      Loan Status: {loanStatusFilter}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Showing {filteredApplications.length} of {totalCount} applications
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className={`text-sm px-3 py-1 rounded-md ${
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
        <SanctionTable
          paginatedApplications={paginatedApplications}
          filteredApplications={filteredApplications}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onActionClick={handleActionClick}
          loading={loading}
          onChequeModalOpen={handleChequeModalOpen}
          onCourierModalOpen={handleCourierModalOpen}
          onCourierPickedModalOpen={handleCourierPickedModalOpen}
          onOriginalDocumentsModalOpen={handleOriginalDocumentsModalOpen}
          onDisburseEmandateModalOpen={handleDisburseEmandateModalOpen}
          onChangeStatusClick={handleChangeStatusModalOpen}
          onRefundPDCClick={handleRefundPDCModalOpen}
          onLoanEligibilityClick={handleLoanEligibilityClick}
          onCheckClick={handleCheckClick}
          onReplaceKYCClick={handleReplaceKYCClick}
          onCall={handleCall}
          onFileView={handleFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          onStatusClick={handleStatusModalOpen}
        />
      </div>

      {/* Modals */}
      <CallDetailsModal 
        isOpen={showCallModal} 
        onClose={() => {
          setShowCallModal(false);
          setSelectedApplicant(null);
        }} 
        data={selectedApplicant} 
        isDark={isDark}  
      />

      {currentRefundPDCApplication && (
        <RefundPDCModal
          isOpen={refundPDCModalOpen}
          onClose={handleRefundPDCModalClose}
          onSubmit={handleRefundPDCSubmit}
          isDark={isDark}
          customerName={currentRefundPDCApplication.name}
          loanNo={currentRefundPDCApplication.loanNo}
        />
      )}

      {currentApplication && (
        <ChequeModal
          isOpen={chequeModalOpen}
          onClose={handleChequeModalClose}
          onSubmit={handleChequeSubmit}
          isDark={isDark}
          initialChequeNo={currentChequeNo}
          customerName={currentApplication.name}
          isEdit={!!currentChequeNo}
        />
      )}

      {currentCourierApplication && (
        <SendToCourierModal
          isOpen={courierModalOpen}
          onClose={handleCourierModalClose}
          onSubmit={handleCourierSubmit}
          isDark={isDark}
          customerName={currentCourierApplication.name}
          loanNo={currentCourierApplication.loanNo}
        />
      )}

      {currentCourierPickedApplication && (
        <CourierPickedModal
          isOpen={courierPickedModalOpen}
          onClose={handleCourierPickedModalClose}
          onSubmit={handleCourierPickedSubmit}
          isDark={isDark}
          customerName={currentCourierPickedApplication.name}
          loanNo={currentCourierPickedApplication.loanNo}
        />
      )}

      {currentOriginalDocumentsApplication && (
        <OriginalDocumentsModal
          isOpen={originalDocumentsModalOpen}
          onClose={handleOriginalDocumentsModalClose}
          onSubmit={handleOriginalDocumentsSubmit}
          isDark={isDark}
          customerName={currentOriginalDocumentsApplication.name}
          loanNo={currentOriginalDocumentsApplication.loanNo}
        />
      )}

      {currentDisburseEmandateApplication && (
        <DisburseEmandateModal
          isOpen={disburseEmandateModalOpen}
          onClose={handleDisburseEmandateModalClose}
          onSubmit={handleDisburseEmandateSubmit}
          isDark={isDark}
          customerName={currentDisburseEmandateApplication.name}
          loanNo={currentDisburseEmandateApplication.loanNo}
        />
      )}

      {currentChangeStatusApplication && (
        <ChangeStatusModal
          isOpen={changeStatusModalOpen}
          onClose={handleChangeStatusModalClose}
          onSubmit={handleChangeStatusSubmit}
          isDark={isDark}
          customerName={currentChangeStatusApplication.name}
          loanNo={currentChangeStatusApplication.loanNo}
        />
      )}

      {currentStatusApplication && (
  <StatusUpdateModal
    isOpen={statusModalOpen}
    onClose={handleStatusModalClose}
    application={currentStatusApplication}
    statusOptions={statusOptions}
    onStatusUpdate={handleStatusUpdate}
    isDark={isDark}
  />
)}
    </div>
  );
};

export default SanctionPage;