"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import AdvancedSearchBar from "../AdvanceSearchBar";
import ClientHistoryTable from "./ClientHistoryTable";
import ClientViewModal from "./ClientViewModal";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { clientService } from "@/lib/services/ClientHistoryService";
import Swal from 'sweetalert2';
import { useAdminAuthStore } from "@/lib/store/authAdminStore";

const ClientHistoryPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientHistoryData, setClientHistoryData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  // Search Options
  const SearchOptions = [
    { value: 'accountId', label: 'Account ID' },
    { value: 'crnNo', label: 'CRN No' },
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
    if (searchField && searchTerm.trim()) {
      params.search_by = searchField;
      params.search_value = searchTerm.trim();
    }

    console.log('API Params:', params);
    return params;
  };

  // Fetch client histories
const fetchClientHistories = async () => {
  try {
    console.log("🟡 START: fetchClientHistories called");
    setLoading(true);
    setError(null);
    
    const params = buildApiParams();
    console.log("📤 API Params:", params);
    
    // DEBUG: Log the API call details
    console.log("🌐 Making API call to: /crm/clients/histories");
    console.log("🔐 Token status:", useAdminAuthStore.getState().getToken() ? "Token exists" : "NO TOKEN!");
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("API request timeout after 15s")), 15000)
    );
    
    try {
      const apiCall = clientService.getClientHistories(params);
      const response = await Promise.race([apiCall, timeoutPromise]);
      
      console.log("✅ API Response received:", response);
      console.log("📊 Response type:", typeof response);
      console.log("🔍 Response keys:", Object.keys(response || {}));
      
      // Handle different response structures
      if (response && typeof response === 'object') {
        if (response.success !== undefined) {
          if (response.success) {
            if (response.clients && Array.isArray(response.clients)) {
              console.log(`📋 Found ${response.clients.length} clients`);
              
              // Transform API data
              const transformedData = response.clients.map((client, index) => {
                return {
                  id: client.user_id || client.id || `client-${index}`,
                  sn: index + 1,
                  name: client.fullname || client.name || "Unknown",
                  loanNo: client.loan_no || "N/A",
                  fatherName: client.fathername || client.father_name || "N/A",
                  crnNo: client.crnno || client.crn || "N/A",
                  accountId: client.accountId || client.account_id || "N/A",
                  phone: client.phone || client.phone_number || "N/A",
                  email: client.email || client.email_address || "N/A",
                  date: client.created_at || client.date || "2025-07-10"
                };
              });
              
              
              setClientHistoryData(transformedData);
              setTotalCount(response.clients.length);
              setTotalPages(Math.ceil(response.clients.length / itemsPerPage));
            } else {
              console.error("❌ No clients array in response:", response);
              setError("No client data found in response");
              setClientHistoryData([]);
            }
          } else {
            console.error("❌ API returned success: false", response);
            setError(response.message || "Failed to fetch client histories");
            setClientHistoryData([]);
          }
        } 
        // If response is directly an array
        else if (Array.isArray(response)) {
          
          const transformedData = response.map((client, index) => ({
            id: client.user_id || client.id || `client-${index}`,
            sn: index + 1,
            name: client.fullname || client.name || "Unknown",
            loanNo: client.loan_no || "N/A",
            fatherName: client.fathername || client.father_name || "N/A",
            crnNo: client.crnno || client.crn || "N/A",
            accountId: client.accountId || client.account_id || "N/A",
            phone: client.phone || client.phone_number || "N/A",
            email: client.email || client.email_address || "N/A",
            date: client.created_at || client.date || "2025-07-10"
          }));
          
          setClientHistoryData(transformedData);
          setTotalCount(response.length);
          setTotalPages(Math.ceil(response.length / itemsPerPage));
        }
        // Unknown structure
        else {
          console.error("❌ Unexpected response structure:", response);
          setError("Unexpected data format from server");
          setClientHistoryData([]);
        }
      } else {
        console.error("❌ Invalid response:", response);
        setError("Invalid response from server");
        setClientHistoryData([]);
      }
      
    } catch (apiError) {
      console.error("❌ API Call Error:", apiError);
      console.error("❌ Error details:", {
        message: apiError.message,
        response: apiError.response,
        status: apiError.response?.status,
        data: apiError.response?.data
      });
      
      if (apiError.response) {
        switch (apiError.response.status) {
          case 401:
            setError("Authentication failed. Please login again.");
            // Auto logout handled by interceptor
            break;
          case 404:
            setError("API endpoint not found. Please contact support.");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError(`Server error (${apiError.response.status}): ${apiError.response.data?.message || 'Unknown error'}`);
        }
      } else if (apiError.message.includes("timeout")) {
        setError("Request timeout. Please check your connection.");
      } else if (apiError.message.includes("Network Error")) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Failed to fetch client histories. Please try again.");
      }
    }
    
  } catch (err) {
    console.error("❌ Unexpected error in fetchClientHistories:", err);
    console.error("❌ Stack trace:", err.stack);
    setError("An unexpected error occurred. Please refresh the page.");
  } finally {
    setLoading(false);
  }
};

  // Load data when filters or page changes
  useEffect(() => {
    fetchClientHistories();
  }, [currentPage]);

  // Handle search changes
  useEffect(() => {
    if (currentPage === 1) {
      fetchClientHistories();
    } else {
      setCurrentPage(1);
    }
  }, [searchField, searchTerm]);

  const handleViewClick = async (client) => {
  try {
    setLoading(true);
    const response = await clientService.getClientDetails(client.id);
    
    if (response.success) {
      const clientDetails = {
        ...client,
        dob: response.details.dob,
        selfie: response.details.selfie,
        gender: response.details.gender,
        location: response.details.address || response.details.current_address,
        panNo: response.details.pan_no,
        aadharNo: response.details.aadhar_no,
        loans: response.loans || [],
        references: response.references || [],  
        verified_references: response.verified_references || []  
      };
      
      setSelectedClient(clientDetails);
      setIsViewModalOpen(true);
    }
  } catch (err) {
    setError("Failed to fetch client details");
    console.error("Error fetching client details:", err);
  } finally {
    setLoading(false);
  }
};
  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedClient(null);
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

  // Clear all filters
  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  

  // Filter data for display
  const filteredClientData = clientHistoryData.filter(item => {
    if (!searchField || !searchTerm.trim()) return true;
    
    const fieldValue = item[searchField]?.toString().toLowerCase() || '';
    return fieldValue.includes(searchTerm.toLowerCase());
  });

  // Pagination
  const paginatedClientData = filteredClientData.map((client, index) => ({
    ...client,
    srNo: (currentPage - 1) * itemsPerPage + index + 1
  }));

  if (loading && clientHistoryData.length === 0) {
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
            Loading client histories...
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
      Client History ({totalCount})
    </h1>
  </div>
  
  <div className="flex gap-2 w-full sm:w-auto">
    <button
      onClick={() => fetchClientHistories()}
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
    
   
  </div>
</div>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-4 rounded-lg border ${
              isDark ? "bg-red-900/20 border-red-700 text-red-300" : "bg-red-100 border-red-400 text-red-700"
            }`}>
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className={`ml-2 ${isDark ? "text-red-400 hover:text-red-300" : "text-red-800 hover:text-red-900"}`}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-6 md:grid md:grid-cols-2">
            <AdvancedSearchBar 
              searchOptions={SearchOptions}
              onSearch={handleAdvancedSearch}
              isDark={isDark}
              placeholder="Search client history..."
              buttonText="Search"
            />
          </div>

          {/* Filter Summary */}
          {searchTerm && (
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
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Showing {filteredClientData.length} of {totalCount}
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
        <ClientHistoryTable
          paginatedClientData={paginatedClientData}
          filteredClientData={filteredClientData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onViewClick={handleViewClick}
          loading={loading}
        />
      </div>

      {/* View Modal */}
      <ClientViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
        clientData={selectedClient}
        isDark={isDark}
        loading={loading}
      />
    </div>
  );
};

export default ClientHistoryPage;