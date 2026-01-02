"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateFilter from "../DateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import CreditApprovalTable from "./CreditApprovalTable";
import ChequeModal from "../application-modals/ChequeSubmit";
import SendToCourierModal from "../application-modals/SendToCourierModal";
import CourierPickedModal from "../application-modals/CourierPickedModal";
import OriginalDocumentsModal from "../application-modals/OriginalDocumentsModal";
import DisburseEmandateModal from "../application-modals/DisburseEmandateModal";
import ChangeStatusModal from "../application-modals/StatusModal";
import RefundPDCModal from "../application-modals/RefundPdcModal";
import StatusUpdateModal from "../application-modals/StatusUpdateModal";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { 
  creditApprovalService,
  formatCreditApprovalApplicationForUI,
  fileService
} from "@/lib/services/CreditApprovalServices";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const CreditApprovalPage = () => {
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

  // Modal states
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
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Data states
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  // Status options
  const statusOptions = [
    { value: "Ready To Disbursed", label: "Ready To Disbursed" }
  ];

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
  params.from_approved_date = `${dateRange.start} 00:00:00`;
}
if (dateRange.end) {
  params.to_approved_date = `${dateRange.end} 23:59:59`;
}

    console.log('API Params:', params);
    return params;
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = buildApiParams();
      const response = await creditApprovalService.getApplications(params);
      
      const actualResponse = response?.success ? response : { success: true, data: response, pagination: {} };
      
      if (actualResponse && actualResponse.success) {
        const applicationsData = actualResponse.data || [];
        const formattedApplications = applicationsData.map(formatCreditApprovalApplicationForUI);
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

  // Handle Status Update
  const handleStatusUpdate = async (applicationId, status, remark) => {
    try {
      await creditApprovalService.updateLoanStatus(applicationId, status, remark);
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
    await creditApprovalService.updateBankVerification(application.id);
    
    // Update local state immediately
    setApplications(prev => prev.map(app => 
      app.id === application.id 
        ? { 
            ...app, 
            bankVerification: "verified",
            bankVerifiedRaw: 1  
          }
        : app
    ));
    
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
    await creditApprovalService.updateDisburseApproval(application.id);
    
    // Update local state immediately
    setApplications(prev => prev.map(app => 
      app.id === application.id 
        ? { 
            ...app, 
            disburseApproval: "approved",
            creditApprovalRaw: 1  
          }
        : app
    ));
    
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
      await creditApprovalService.updateChequeNumber(currentApplication.id, newChequeNo);
      
      setApplications(prev => prev.map(app => 
        app.id === currentApplication.id 
          ? { ...app, chequeNo: newChequeNo }
          : app
      ));
      
      await fetchApplications();
      toast.success('Cheque number updated successfully!');
    } catch (error) {
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
      await creditApprovalService.updateOriginalDocuments(
        currentOriginalDocumentsApplication.id, 
        isReceived, 
        receivedDate
      );
      
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
      toast.error('Failed to update documents status');
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
      
      setApplications(prev => prev.map(app => 
        app.id === currentRefundPDCApplication.id 
          ? { ...app, refundPdc: refundStatus }
          : app
      ));
      
      await fetchApplications();
      toast.success('Refund PDC status updated successfully!');
    } catch (error) {
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
      await creditApprovalService.updateStatusChange(currentChangeStatusApplication.id, updateData);
      
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
      await creditApprovalService.updateEmandateStatus(currentDisburseEmandateApplication.id, selectedOption);
      
      setApplications(prev => prev.map(app => 
        app.id === currentDisburseEmandateApplication.id 
          ? { ...app, receivedDisburse: selectedOption }
          : app
      ));
      
      await fetchApplications();
      toast.success('E-mandate status updated successfully!');
    } catch (error) {
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
      await creditApprovalService.updateCourierPicked(
        currentCourierPickedApplication.id, 
        isPicked, 
        pickedDate
      );
      
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
      await creditApprovalService.updateSendToCourier(currentCourierApplication.id, courierDate);
      
      setApplications(prev => prev.map(app => 
        app.id === currentCourierApplication.id 
          ? { ...app, sendToCourier: "Yes", courierDate: courierDate }
          : app
      ));
      
      await fetchApplications();
      toast.success('Courier scheduled successfully!');
    } catch (error) {
      toast.error('Failed to schedule courier');
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
      text: 'This will export all credit approval applications with current filters.',
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
      
      const response = await creditApprovalService.exportApplications(exportParams);
      
      if (response.success) {
        const headers = [
          'Sr. No.', 'Loan No.', 'CRN No.', 'Account ID', 'Name', 'Phone', 'Email', 
          'Current Address', 'Current State', 'Current City', 'Permanent Address', 'State', 'City',
          'Applied Amount', 'Approved Amount', 'Admin Fee', 'ROI (%)', 'Tenure (Days)', 'Loan Term',
          'Loan Status', 'Approval Note', 'Enquiry Type', 'Cheque No', 'Send To Courier', 
          'Courier Picked', 'Original Documents', 'E-mandate Status', 'Bank Verification', 'Disburse Approval'
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
          app.emandateverification || 'No',
          app.bankVerification === "verified" ? "Verified" : "Not Verified",
          app.disburseApproval === "approved" ? "Approved" : "Not Approved"
        ]);

        const exportData = [headers, ...dataRows];
        exportToExcel(exportData, `credit_approval_applications_${new Date().toISOString().split('T')[0]}`);
        
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
      Credit Approval ({totalCount})
    </h1>
  </div>
  
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
              placeholder="Search credit approval applications..."
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
        <CreditApprovalTable
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
          onFileView={handleFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          onBankVerification={handleBankVerification}
          onDisburseApproval={handleDisburseApproval}
          onStatusClick={handleStatusModalOpen}
        />
      </div>

      {/* All Modals */}
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
    </div>
  );
};

export default CreditApprovalPage;