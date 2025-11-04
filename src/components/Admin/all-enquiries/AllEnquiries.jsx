"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import EnquiriesTable from "./EnquiriesTable";
import { exportToExcel } from "@/components/utils/exportutil";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateFilter from "../DateFilter";
import { enquiryAPI, formatEnquiryForUI } from "@/lib/services/AllEnquiriesServices";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';
import { useThemeStore } from "@/lib/store/useThemeStore";
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";


const AllEnquiries = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
 
  // Advanced Search States
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Date Filter States
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sourceFilter, setSourceFilter] = useState("all");

  // Data states
  const [enquiries, setEnquiries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const SearchOptions = [
    { value: 'applied_amount', label: 'Loan Amount' },
    { value: 'crnno', label: 'CRN No' },
    { value: 'fname', label: 'Name' },
    { value: 'phone', label: 'Phone Number' },
  ];

  // Build API parameters correctly
  const buildApiParams = () => {
    const params = {
      per_page: itemsPerPage,
      page: currentPage,
    };

    // Add search parameters - FIXED: Use correct parameter names
    if (searchField && searchTerm) {
      params.search_by = searchField;
      params.search_value = searchTerm;
    }

    // Add status filter - FIXED: Send to API instead of client-side filtering
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    // Add date filters - FIXED: Use correct parameter names
    if (dateRange.start) {
      params.from_date = dateRange.start;
    }
    if (dateRange.end) {
      params.to_date = dateRange.end;
    }

    // Add source filter - FIXED: Include source filter
    if (sourceFilter !== "all") {
      params.source_by = sourceFilter;
    }

    return params;
  };

  // Fetch enquiries from API
  const fetchEnquiries = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setIsAutoRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const params = buildApiParams();
      const response = await enquiryAPI.getAllEnquiries(params);
      
      if (response.success) {
        const formattedEnquiries = response.data.map(formatEnquiryForUI);
        setEnquiries(formattedEnquiries);
        setTotalCount(response.pagination?.total || response.data.length);
        setTotalPages(response.pagination?.total_pages || 1);
      } else {
        setError("Failed to fetch enquiries");
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError("Failed to fetch enquiries. Please try again.");
    } finally {
      setLoading(false);
      setIsAutoRefreshing(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchEnquiries();
  }, [currentPage, searchField, searchTerm, dateRange, statusFilter, sourceFilter]);

  // Auto-refresh implementations (keep as is)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchEnquiries();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentPage, searchField, searchTerm, dateRange, statusFilter, sourceFilter]);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchEnquiries(true);
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentPage, searchField, searchTerm, dateRange, statusFilter, sourceFilter]);

  // Handle Advanced Search
  const handleAdvancedSearch = ({ field, term }) => {
    setSearchField(field);
    setSearchTerm(term);
    setCurrentPage(1); 
  };

  // Handle Date Filter - FIXED: Include source filter
  const handleDateFilter = (filters) => {
    setDateRange(filters.dateRange);
    setSourceFilter(filters.source || "all");
    setCurrentPage(1); 
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setSourceFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // FIXED: Remove client-side status filtering since it's now handled by API
  const filteredEnquiries = enquiries.map((enquiry, index) => ({
    ...enquiry,
    srNo: (currentPage - 1) * itemsPerPage + index + 1 
  }));

 const handleExport = async (type) => {
  if (type === 'excel') {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Export Enquiries?',
      text: 'This will export all enquiries with current filters .',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981', // Emerald color
      cancelButtonColor: '#6b7280', // Gray color
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

    // If user cancels, return early
    if (!result.isConfirmed) {
      return;
    }

    try {
      setExporting(true);
      
      // Build export params with same filters but without pagination
      const exportParams = { ...buildApiParams() };
      delete exportParams.per_page;
      delete exportParams.page;
      
      const response = await enquiryAPI.exportEnquiries(exportParams);
      
      if (response.success) {
        const headers = [
          'CRN No', 'Account ID', 'Name', 'Date of Birth', 'Gender', 
          'Phone', 'Email', 'City', 'State', 'Company Name', 
          'Net Salary', 'Applied Amount', 'Account No', 'IFSC Code', 
          'ROI', 'Tenure (Days)', 'Approval Note', 'Remark', 'Created Date', 'Enquiry Type'
        ];

        // Create data rows
        const dataRows = response.data.map(enquiry => [
          enquiry.crnno,
          enquiry.accountId,
          enquiry.name,
          enquiry.dob,
          enquiry.gender,
          enquiry.phone,
          enquiry.email || 'N/A',
          enquiry.city,
          enquiry.state,
          enquiry.company_name,
          enquiry.net_salary,
          enquiry.applied_amount,
          enquiry.account_no || 'N/A',
          enquiry.ifsc_code || 'N/A',
          `${(parseFloat(enquiry.roi) * 100).toFixed(2)}%`,
          enquiry.tenure,
          enquiry.approval_note,
          enquiry.remark || 'N/A',
          new Date(enquiry.created_at).toLocaleDateString('en-GB'),
          enquiry.enquiry_type || 'N/A'
        ]);

        // Combine headers and data
        const exportData = [headers, ...dataRows];

        exportToExcel(exportData, 'all-enquiries');
        
        // Show success message
        await Swal.fire({
          title: 'Export Successful!',
          text: 'Enquiries have been exported to Excel successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f9fafb' : '#111827',
        });
      } else {
        setError("Failed to export data. Please try again.");
        // Show error message
        await Swal.fire({
          title: 'Export Failed!',
          text: 'Failed to export data. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f9fafb' : '#111827',
        });
      }
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export data. Please try again.");
      
      // Show error message
      await Swal.fire({
        title: 'Export Error!',
        text: 'Failed to export data. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? '#1f2937' : '#ffffff',
        color: isDark ? '#f9fafb' : '#111827',
      });
    } finally {
      setExporting(false);
    }
  }
};


  const handleUploadClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsUploadModalOpen(true);
  };

  const handleDetailClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDetailModalOpen(true);
  };

 const handleFileView = async (fileName, documentCategory, enquiry = null) => {
  console.log('File viewing started:', { fileName, documentCategory, enquiry });
  
  // Firebase file handling for document types
  if (!fileName) {
    alert('No file available');
    return;
  }

  try {
    // Define folder mappings
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

    // Get the correct folder
    const folder = folderMappings[documentCategory];
    
    if (!folder) {
      console.error('No folder mapping found for:', documentCategory);
      alert('Document type not configured');
      return;
    }
    
    // Construct the full file path
    const filePath = `${folder}/${fileName}`;
    
    console.log('Loading from Firebase path:', filePath);

    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);
    
    // Open in new tab
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      alert('Popup blocked! Please allow popups for this site.');
    }
  } catch (error) {
    console.error("Failed to load file:", error);
    alert(`Failed to load file: ${fileName}. Please check if file exists.`);
  }
};

  const handleLoanEligibilityClick = (enquiry) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
    router.push(`/crm/loan-eligibility/${enquiry.id}`);
  };

  const handleVerifyClick = (enquiry) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
    router.push(`/crm/application-form/${enquiry.id}`);
  };

  const handleCheckClick = (enquiry) => {
  localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
  router.push(`/crm/appraisal-report/${enquiry.id}`);
};

  if (loading && enquiries.length === 0) {
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
            Loading enquiries...
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
                className={`p-3 cursor-pointer rounded-xl transition-all duration-200 hover:scale-105 ${
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
                All Enquiries ({totalCount})
              </h1>
            </div>
            
            {/* Export and Refresh */}
            <div className="flex space-x-2">
              <button
                onClick={() => fetchEnquiries()}
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
                className={`px-4 py-2 cursor-pointer rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
  {/* Use global status IDs */}
  <option value="1">Pending</option>
  <option value="2">Completed</option>
  <option value="3">Rejected</option>
  <option value="4">Follow Up</option>
  <option value="5">Processing</option>
  {/* Add other status options as needed */}
</select>
          </div>

          {/* Filter Summary */}
          {(searchTerm || dateRange.start || dateRange.end || sourceFilter !== "all" || statusFilter !== "all") && (
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
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Showing {filteredEnquiries.length} of {totalCount} enquiries
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
        <EnquiriesTable
          paginatedEnquiries={filteredEnquiries}
          filteredEnquiries={filteredEnquiries}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onUploadClick={handleUploadClick}
          onDetailClick={handleDetailClick}
          onFileView={handleFileView}
          onLoanEligibilityClick={handleLoanEligibilityClick}
          onVerifyClick={handleVerifyClick}
          onCheckClick={handleCheckClick}
          loading={loading}
         
        />
      </div>
      
    </div>
  );
};

export default AllEnquiries;