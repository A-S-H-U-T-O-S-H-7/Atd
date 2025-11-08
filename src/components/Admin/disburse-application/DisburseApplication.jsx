"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw, Filter } from "lucide-react";
import DisburseTable from "./DisburseTable";
import { useRouter } from "next/navigation";
import { exportToExcel } from "@/components/utils/exportutil";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateFilter from "../DateFilter";
import { mockApplicationsData } from "@/lib/MockApplicationData";
import ChequeModal from "../application-modals/ChequeSubmit";
import SendToCourierModal from "../application-modals/SendToCourierModal";
import CourierPickedModal from "../application-modals/CourierPickedModal";
import OriginalDocumentsModal from "../application-modals/OriginalDocumentsModal";
import DisburseEmandateModal from "../application-modals/DisburseEmandateModal";
import ChangeStatusModal from "../application-modals/StatusModal";
import RemarksModal from "../application-modals/RemarkModal";
import RefundPDCModal from "../application-modals/RefundPdcModal";
import CallDetailsModal from "../CallDetailsModal";
import DocumentVerificationModal from "../application-modals/DocumentVerificationStatusModal";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { 
  disburseApprovalService,
  formatDisburseApprovalApplicationForUI,
  disburseFileService
} from "@/lib/services/DisburseApprovalServices";
import toast from 'react-hot-toast';
import Swal from "sweetalert2";

const DisburseApplication = () => {
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
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [currentRemarksApplication, setCurrentRemarksApplication] = useState(null);
  const [refundPDCModalOpen, setRefundPDCModalOpen] = useState(false);
  const [currentRefundPDCApplication, setCurrentRefundPDCApplication] = useState(null);
  const [documentVerificationModalOpen, setDocumentVerificationModalOpen] = useState(false);
  const [currentDocumentApplication, setCurrentDocumentApplication] = useState(null);

  // Search and filter states
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sourceFilter, setSourceFilter] = useState("all");

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
    if (dateRange.start) {
      params.from_date = dateRange.start;
    }
    if (dateRange.end) {
      params.to_date = dateRange.end;
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
      const response = await disburseApprovalService.getApplications(params);
      
      const actualResponse = response?.success ? response : { success: true, data: response, pagination: {} };
      
      if (actualResponse && actualResponse.success && actualResponse.data) {
        const formattedApplications = actualResponse.data.map(formatDisburseApprovalApplicationForUI);
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

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchApplications();
  }, [currentPage, searchField, searchTerm, dateRange]);

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchApplications(true);
      }
    }, 60000); // 1 minute
  
    return () => clearInterval(interval);
  }, [currentPage, searchField, searchTerm, dateRange]);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchApplications(true);
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentPage, searchField, searchTerm, dateRange]);

  // Bank Verification Handler
  const handleBankVerification = async (application) => {
    try {
      await disburseApprovalService.updateBankVerification(application.id);
      
      // Update UI immediately
      setApplications(prev => prev.map(app => 
        app.id === application.id 
          ? { ...app, bankVerification: "verified" }
          : app
      ));
      
      toast.success('Bank verification completed successfully!');
    } catch (error) {
      console.error('Error updating bank verification:', error);
      toast.error('Failed to update bank verification');
    }
  };

  // Disburse Approval Handler
  const handleDisburseApproval = async (application) => {
    try {
      await disburseApprovalService.updateDisburseApproval(application.id);
      
      // Update UI immediately
      setApplications(prev => prev.map(app => 
        app.id === application.id 
          ? { ...app, disburseApproval: "approved" }
          : app
      ));
      
      toast.success('Disburse approval completed successfully!');
    } catch (error) {
      console.error('Error updating disburse approval:', error);
      toast.error('Failed to update disburse approval');
    }
  };

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
      await disburseApprovalService.updateChequeNumber(currentApplication.id, newChequeNo);
      
      // Update UI immediately
      setApplications(prev => prev.map(app => 
        app.id === currentApplication.id 
          ? { ...app, chequeNo: newChequeNo }
          : app
      ));
      
      await fetchApplications();
      toast.success('Cheque number updated successfully!');
    } catch (error) {
      console.error('Error saving cheque number:', error);
      toast.error('Failed to update cheque number');
      throw error;
    }
  };

  const handleOriginalDocumentsModalOpen = (application) => {
    setCurrentOriginalDocumentsApplication(application);
    setOriginalDocumentsModalOpen(true);
  };

  const handleOriginalDocumentsModalClose = () => {
    setOriginalDocumentsModalOpen(false);
    setCurrentOriginalDocumentsApplication(null);
  };

  const handleOriginalDocumentsSubmit = async (isReceived, receivedDate) => {
    try {
      await disburseApprovalService.updateOriginalDocuments(
        currentOriginalDocumentsApplication.id, 
        isReceived, 
        receivedDate
      );
      
      // Update UI immediately
      setApplications(prev => prev.map(app => 
        app.id === currentOriginalDocumentsApplication.id 
          ? { 
              ...app, 
              originalDocuments: isReceived ? "Yes" : "No",
              ...(isReceived && { originalDocumentsDate: receivedDate })
            }
          : app
      ));
      
      await fetchApplications();
      toast.success(isReceived ? 'Original documents received!' : 'Documents status updated!');
    } catch (error) {
      console.error('Error saving original documents status:', error);
      toast.error('Failed to update documents status');
      throw error;
    }
  };

  const handleRemarksModalOpen = (application) => {
    setCurrentRemarksApplication(application);
    setRemarksModalOpen(true);
  };

  const handleRemarksModalClose = () => {
    setRemarksModalOpen(false);
    setCurrentRemarksApplication(null);
  };

  const handleRemarksSubmit = async (remarks) => {
    try {
      await disburseApprovalService.updateRemarks(currentRemarksApplication.id, remarks);
      
      await fetchApplications();
      toast.success('Remarks updated successfully!');
    } catch (error) {
      console.error('Error saving remarks:', error);
      toast.error('Failed to update remarks');
      throw error;
    }
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
      console.log('Refund PDC status saved:', refundStatus);
      
      // Update UI immediately
      setApplications(prev => prev.map(app => 
        app.id === currentRefundPDCApplication.id 
          ? { ...app, refundPdc: refundStatus }
          : app
      ));
      
      await fetchApplications();
      toast.success('Refund PDC status updated successfully!');
    } catch (error) {
      console.error('Error saving refund PDC status:', error);
      toast.error('Failed to update refund PDC status');
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

  const handleChangeStatusSubmit = async (updateData) => {
    try {
      await disburseApprovalService.updateStatusChange(currentChangeStatusApplication.id, updateData);
      
      // Update UI immediately based on changes
      setApplications(prev => prev.map(app => 
        app.id === currentChangeStatusApplication.id 
          ? { 
              ...app, 
              ...(updateData.courierPickedDate && { 
                courierPicked: "Yes", 
                courierPickedDate: updateData.courierPickedDate 
              }),
              ...(updateData.originalDocumentsReceived && { 
                originalDocuments: updateData.originalDocumentsReceived === "yes" ? "Yes" : "No" 
              })
            }
          : app
      ));
      
      await fetchApplications();
      toast.success('Status updated successfully!');
    } catch (error) {
      console.error('Error saving status changes:', error);
      toast.error('Failed to update status');
      throw error;
    }
  };

  const handleDisburseEmandateModalOpen = (application) => {
    setCurrentDisburseEmandateApplication(application);
    setDisburseEmandateModalOpen(true);
  };

  const handleDisburseEmandateModalClose = () => {
    setDisburseEmandateModalOpen(false);
    setCurrentDisburseEmandateApplication(null);
  };

  const handleDisburseEmandateSubmit = async (selectedOption) => {
    try {
      await disburseApprovalService.updateEmandateStatus(currentDisburseEmandateApplication.id, selectedOption);
      
      // Update UI immediately
      setApplications(prev => prev.map(app => 
        app.id === currentDisburseEmandateApplication.id 
          ? { ...app, receivedDisburse: selectedOption }
          : app
      ));
      
      await fetchApplications();
      toast.success('E-mandate status updated successfully!');
    } catch (error) {
      console.error('Error saving disburse e-mandate option:', error);
      toast.error('Failed to update e-mandate status');
      throw error;
    }
  };

  const handleCourierPickedModalOpen = (application) => {
    setCurrentCourierPickedApplication(application);
    setCourierPickedModalOpen(true);
  };

  const handleCourierPickedModalClose = () => {
    setCourierPickedModalOpen(false);
    setCurrentCourierPickedApplication(null);
  };

  const handleCourierPickedSubmit = async (isPicked, pickedDate) => {
    try {
      await disburseApprovalService.updateCourierPicked(
        currentCourierPickedApplication.id, 
        isPicked, 
        pickedDate
      );
      
      // Update UI immediately
      setApplications(prev => prev.map(app => 
        app.id === currentCourierPickedApplication.id 
          ? { 
              ...app, 
              courierPicked: isPicked ? "Yes" : "No",
              ...(isPicked && { courierPickedDate: pickedDate })
            }
          : app
      ));
      
      await fetchApplications();
      toast.success(isPicked ? 'Courier pickup recorded!' : 'Courier status updated!');
    } catch (error) {
      console.error('Error saving courier picked status:', error);
      toast.error('Failed to update courier status');
      throw error;
    }
  };

  const handleCourierModalOpen = (application) => {
    setCurrentCourierApplication(application);
    setCourierModalOpen(true);
  };

  const handleCourierModalClose = () => {
    setCourierModalOpen(false);
    setCurrentCourierApplication(null);
  };

  const handleCourierSubmit = async (courierDate) => {
    try {
      await disburseApprovalService.updateSendToCourier(currentCourierApplication.id, courierDate);
      
      // Update UI immediately
      setApplications(prev => prev.map(app => 
        app.id === currentCourierApplication.id 
          ? { ...app, sendToCourier: "Yes", courierDate: courierDate }
          : app
      ));
      
      await fetchApplications();
      toast.success('Courier scheduled successfully!');
    } catch (error) {
      console.error('Error saving courier date:', error);
      toast.error('Failed to schedule courier');
      throw error;
    }
  };

  // Document verification handlers
  const handleDocumentVerificationModalOpen = (application) => {
    setCurrentDocumentApplication(application);
    setDocumentVerificationModalOpen(true);
  };

  const handleDocumentVerificationModalClose = () => {
    setDocumentVerificationModalOpen(false);
    setCurrentDocumentApplication(null);
  };

  const handleDocumentVerify = (application, documentId) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(application));
    router.push(`/crm/application-form/${application.id}`);
    setDocumentVerificationModalOpen(false);
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
      const url = await disburseFileService.viewFile(fileName, documentCategory);
      
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

  // Handle Date Filter
  const handleDateFilter = (filters) => {
    setDateRange(filters.dateRange);
    setSourceFilter(filters.source);
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = async (type) => {
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

    if (!result.isConfirmed) {
      return;
    }

    try {
      setExporting(true);
      
      // Build export params without pagination
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
    setDateRange({ start: "", end: "" });
    setSourceFilter("all");
    setStatusFilter("all");
    setLoanStatusFilter("all");
    setCurrentPage(1);
  };

  // Client-side filtering
  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === "all" || 
      app.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesLoanStatus = loanStatusFilter === "all" || 
      app.loanStatus.toLowerCase() === loanStatusFilter.toLowerCase();
    return matchesStatus && matchesLoanStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex).map((app, index) => ({
    ...app,
    srNo: startIndex + index + 1
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
                Disburse Applications ({totalCount})
              </h1>
            </div>
            
            {/* Export and Refresh */}
            <div className="flex space-x-2">
              <button
                onClick={() => fetchApplications()}
                disabled={loading}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={() => handleExport('excel')}
                disabled={exporting}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <Download className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Export'}</span>
              </button>
            </div>
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
          <DateFilter 
            isDark={isDark} 
            onFilterChange={handleDateFilter}
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={loanStatusFilter}
              onChange={(e) => setLoanStatusFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Loan Status</option>
              <option value="disbursed">Disbursed</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Filter Summary */}
          {(searchTerm || dateRange.start || dateRange.end || sourceFilter !== "all" || statusFilter !== "all" || loanStatusFilter !== "all") && (
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
                  {dateRange.start && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      From: {dateRange.start}
                    </span>
                  )}
                  {dateRange.end && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      To: {dateRange.end}
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
        <DisburseTable
          paginatedApplications={paginatedApplications}
          filteredApplications={filteredApplications}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredApplications.length / itemsPerPage)}
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
          onRemarksClick={handleRemarksModalOpen}
          onRefundPDCClick={handleRefundPDCModalOpen}
          onLoanEligibilityClick={handleLoanEligibilityClick}  
          onCheckClick={handleCheckClick}
          onReplaceKYCClick={handleReplaceKYCClick} 
          onCall={handleCall}  
          onDocumentStatusClick={handleDocumentVerificationModalOpen}
          onFileView={handleFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          onBankVerification={handleBankVerification}
          onDisburseApproval={handleDisburseApproval}
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

      {currentDocumentApplication && (
        <DocumentVerificationModal
          isOpen={documentVerificationModalOpen}
          onClose={handleDocumentVerificationModalClose}
          onVerify={handleDocumentVerify}
          isDark={isDark}
          application={currentDocumentApplication}
        />
      )}

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

      {currentRemarksApplication && (
        <RemarksModal
          isOpen={remarksModalOpen}
          onClose={handleRemarksModalClose}
          onSubmit={handleRemarksSubmit}
          isDark={isDark}
          customerName={currentRemarksApplication.name}
          loanNo={currentRemarksApplication.loanNo}
          application={currentRemarksApplication}
        />
      )}
    </div>
  );
};

export default DisburseApplication;