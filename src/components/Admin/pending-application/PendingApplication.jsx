"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import AdvancedSearchBar from "../AdvanceSearchBar";
import { exportToExcel } from "@/components/utils/exportutil";
import DateRangeFilter from "../DateRangeFilter";
import PendingTable from "./PendingTable";
import CallDetailsModal from "../CallDetailsModal";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { pendingApplicationAPI, formatApplicationForUI } from "@/lib/services/PendingApplicationServices";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';
import Swal from 'sweetalert2';

const PendingApplication = () => { 
  
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loanStatusFilter, setLoanStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [loadingFileName, setLoadingFileName] = useState('');

  // Advanced Search States
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  
  // Data states
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const SearchOptions = [
    { value: 'accountId', label: 'Account ID' },
    { value: 'crnno', label: 'CRN No.' },
    { value: 'name', label: 'Name' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'email', label: 'Email' },
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

  //  email send
const handleSendMail = async (application) => {
    if (!application?.id) {
        await Swal.fire({
            title: 'Error!',
            text: 'Invalid application data',
            icon: 'error',
            confirmButtonColor: '#ef4444',
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#f9fafb' : '#111827',
        });
        return;
    }

    setFileLoading(true);
    setLoadingFileName(`mail_${application.id}`);

    try {
        const result = await Swal.fire({
            title: 'Send Email?',
            text: `Send pending email to ${application.name}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Send!',
            cancelButtonText: 'Cancel',
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#f9fafb' : '#111827',
        });

        if (!result.isConfirmed) {
            return;
        }

        // Try the main endpoint first
        const response = await pendingApplicationAPI.sendPendingEmail(application.id);
        
        if (response && response.success) {
            await Swal.fire({
                title: 'Email Sent!',
                text: response.message || 'Pending email sent successfully.',
                icon: 'success',
                confirmButtonColor: '#10b981',
                background: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#f9fafb' : '#111827',
            });
            
            // Refresh the applications to update mail counter
            fetchApplications(true);
        } else {
            // If API fails, show a fallback message
            await Swal.fire({
                title: 'Email Feature',
                text: 'Email functionality is currently being configured. Please check back later.',
                icon: 'info',
                confirmButtonColor: '#3b82f6',
                background: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#f9fafb' : '#111827',
            });
        }
    } catch (err) {
        console.error("Email sending error:", err);
        await Swal.fire({
            title: 'Email Feature',
            text: 'Email functionality is currently being configured. Please check back later.',
            icon: 'info',
            confirmButtonColor: '#3b82f6',
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#f9fafb' : '#111827',
        });
    } finally {
        setFileLoading(false);
        setLoadingFileName('');
    }
};



// Call this in your fetchApplications after setting applications
const fetchApplications = async (isAutoRefresh = false) => {
    try {
        if (isAutoRefresh) {
            setIsAutoRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);
        
        const params = buildApiParams();
        
        const response = await pendingApplicationAPI.getPendingApplications(params);
         
        const actualResponse = response?.success ? response : { success: true, data: response, pagination: {} };
        
        if (actualResponse && actualResponse.success && actualResponse.data) {
            
            const formattedApplications = actualResponse.data.map(formatApplicationForUI);          
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

  // Export to Excel with API integration
  const handleExportToExcel = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Export Applications?',
      text: 'This will export all pending applications with current filters.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Export!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
      customClass: {
        popup: isDark ? 'bg-gray-800' : 'bg-white',
        title: isDark ? 'text-white' : 'text-gray-900',
        htmlContainer: isDark ? 'text-gray-300' : 'text-gray-700',
      }
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
      
      const response = await pendingApplicationAPI.exportPendingApplications(exportParams);
      
      if (response.success) {
        const headers = [
          'Sr. No.', 'Account ID', 'CRN No.', 'Name', 'Phone', 'Email', 
          'Gender', 'DOB', 'City', 'State', 'Pincode', 
          'Applied Amount', 'Approved Amount', 'ROI (%)', 'Tenure (Days)', 
          'Loan Status', 'Approval Note', 'Enquiry Type'
        ];

        const dataRows = response.data.map((app, index) => [
          index + 1,
          app.accountId,
          app.crnno,
          app.name,
          app.phone,
          app.email || 'N/A',
          app.gender,
          app.dob,
          app.city,
          app.state,
          app.pincode,
          app.applied_amount,
          app.approved_amount,
          `${(parseFloat(app.roi) * 100).toFixed(2)}%`,
          app.tenure,
          getLoanStatusText(app.loan_status),
          app.approval_note,
          app.enquiry_type || 'N/A'
        ]);

        const exportData = [headers, ...dataRows];
        exportToExcel(exportData, `pending_applications_${new Date().toISOString().split('T')[0]}`);
        
        await Swal.fire({
          title: 'Export Successful!',
          text: 'Applications have been exported to Excel successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f9fafb' : '#111827',
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
        background: isDark ? '#1f2937' : '#ffffff',
        color: isDark ? '#f9fafb' : '#111827',
      });
    } finally {
      setExporting(false);
    }
  };

  // Helper function for loan status
  const getLoanStatusText = (status) => {
    switch (Number(status)) {
      case 0: return "Pending";
      case 1: return "In Progress";
      case 2: return "Approved";
      case 3: return "Rejected";
      case 4: return "Disbursed";
      default: return "Pending";
    }
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
      const folderMappings = {
        'bank_statement': 'bank-statement',
        'aadhar_proof': 'idproof', 
        'address_proof': 'address',
        'pan_proof': 'pan',
        'selfie': 'photo',
        'salary_slip': 'first_salaryslip',
        'second_salary_slip': 'second_salaryslip', 
        'third_salary_slip': 'third_salaryslip',
        'bank_verif_report': 'reports',
        'social_score_report': 'reports',
        'cibil_score_report': 'reports',
      };

      const folder = folderMappings[documentCategory];
      
      if (!folder) {
        alert('Document type not configured');
        return;
      }
      
      const filePath = `${folder}/${fileName}`;

      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      
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

  // Clear all filters
  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setStatusFilter("all");
    setLoanStatusFilter("all");
    setDateFilter({ start: "", end: "" });
    setCurrentPage(1);
  };

  // Client-side filtering for status - FIXED: Case-insensitive comparison
  const filteredApplications = applications.filter(app => {
   
    
    // Convert to lowercase for comparison
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

  // Navigation handlers
  const handleLoanEligibilityClick = (application) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(application));
    router.push(`/crm/loan-eligibility/${application.id}`);
  };

  const handleCheckClick = (application) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(application));
    router.push(`/crm/appraisal-report/${application.id}`);
  };

  const handleActionClick = (application) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(application));
    router.push(`/crm/application-form/${application.id}`);
  };

  const handleCall = (applicant) => {
    setSelectedApplicant(applicant);
    setShowCallModal(true);
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
                Pending Applications ({totalCount})
              </h1>
          </div>
          <div className="flex items-center space-x-3">
  {/* Export Button */}
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

          {/* Search Filters */}
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
        <PendingTable
          paginatedApplications={paginatedApplications}
          filteredApplications={filteredApplications}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onActionClick={handleActionClick}
          loading={loading}
          onLoanEligibilityClick={handleLoanEligibilityClick}  
          onCheckClick={handleCheckClick}
          onCall={handleCall}
          onFileView={handleFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          onSendMail={handleSendMail}
        />
      </div>

      <CallDetailsModal 
        isOpen={showCallModal} 
        onClose={() => {
          setShowCallModal(false);
          setSelectedApplicant(null);
        }} 
        data={selectedApplicant} 
        isDark={isDark}  
      />
    </div>
  );
};

export default PendingApplication;