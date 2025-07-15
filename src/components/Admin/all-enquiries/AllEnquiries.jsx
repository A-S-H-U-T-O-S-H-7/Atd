"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import EnquiriesTable from "./EnquiriesTable";
import { useRouter } from "next/navigation";
import { exportToExcel } from "@/components/utils/exportutil";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateFilter from "../DateFilter";
import { enquiryAPI, formatEnquiryForUI } from "@/lib/api";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

const AllEnquiries = () => {
  const { isDark } = useAdminAuth();
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

  // Fetch enquiries from API
  const fetchEnquiries = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setIsAutoRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
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

      const response = await enquiryAPI.getAllEnquiries(params);
      
      if (response.data.success) {
        const formattedEnquiries = response.data.data.map(formatEnquiryForUI);
        setEnquiries(formattedEnquiries);
        setTotalCount(response.data.pagination.total);
        setTotalPages(response.data.pagination.total_pages);
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
  }, [currentPage, searchField, searchTerm,dateRange]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchEnquiries();
      }
    }, 60000); // 1min
  
    return () => clearInterval(interval);
  }, [currentPage, searchField, searchTerm,dateRange]);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchEnquiries(true);
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  

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

  // Clear all filters
  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setSourceFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Client-side status filtering (since API doesn't support status filter)
  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesStatus = statusFilter === "all" || 
    enquiry.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesStatus;
  }).map((enquiry, index) => ({
    ...enquiry,
    srNo: (currentPage - 1) * itemsPerPage + index + 1 
  }));

  const handleExport = async (type) => {
  if (type === 'excel') {
    try {
      setExporting(true);
      const response = await enquiryAPI.exportEnquiries();
      
      if (response.data.success) {
        const headers = [
          'CRN No', 'Account ID', 'Name', 'Date of Birth', 'Gender', 
          'Phone', 'Email', 'City', 'State', 'Company Name', 
          'Net Salary', 'Applied Amount', 'Account No', 'IFSC Code', 
          'ROI', 'Tenure (Days)', 'Approval Note', 'Remark', 'Created Date'
        ];

        // Create data rows
        const dataRows = response.data.data.map(enquiry => [
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
          new Date(enquiry.created_at).toLocaleDateString('en-GB')
        ]);

        // Combine headers and data
        const exportData = [headers, ...dataRows];

        exportToExcel(exportData, 'all-enquiries');
      } else {
        setError("Failed to export data. Please try again.");
      }
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export data. Please try again.");
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

  const handleFileView = async (enquiry, fileName) => {
    if (!fileName) return;
    
    try {
      const fileRef = ref(storage, `documents/${fileName}`);
      const url = await getDownloadURL(fileRef);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Failed to get file URL:", error);
      alert("Failed to load file");
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
              <button className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
              }`}>
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
              <option value="1">Pending</option>
              <option value="2">Approved</option>
              <option value="3">Rejected</option>
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