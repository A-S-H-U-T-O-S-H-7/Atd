"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import AdvancedSearchBar from "../AdvanceSearchBar";
import ClientHistoryTable from "./ClientHistoryTable";
import ClientViewModal from "./ClientViewModal";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { clientService } from "@/lib/services/ClientHistoryService";

const ClientHistoryPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientHistoryData, setClientHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch client histories on component mount
  useEffect(() => {
    fetchClientHistories();
  }, []);

  const fetchClientHistories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.getClientHistories();
      
      if (response.success) {
        // Transform API data to match your component structure
        const transformedData = response.clients.map((client, index) => ({
          id: client.user_id,
          sn: index + 1,
          name: client.fullname,
          loanNo: "N/A", // This will be populated when viewing details
          fatherName: client.fathername,
          crnNo: client.crnno,
          accountId: client.accountId,
          phone: client.phone,
          email: client.email,
          date: "2025-07-10" // You might need to add this field to your API
        }));
        
        setClientHistoryData(transformedData);
      }
    } catch (err) {
      setError("Failed to fetch client histories");
      console.error("Error fetching client histories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = async (client) => {
  try {
    setLoading(true);
    const response = await clientService.getClientDetails(client.id);
    
    if (response.success) {
      // Transform the detailed client data
      const clientDetails = {
        ...client,
        dob: response.details.dob,
        selfie: response.details.selfie,
        gender: response.details.gender,
        location: response.details.address,
        panNo: response.details.pan_no,
        aadharNo: response.details.aadhar_no,
        // Add loan information if available
        loans: response.loans || [],
        references: response.references || []
      };
      
      setSelectedClient(clientDetails);
      setIsViewModalOpen(true);
    }
  } catch (err) {
    setError("Failed to fetch client details");
    console.error("Error fetching client details:", err);
  } finally {
    setLoading(false); // This will reset the loading state for all buttons
  }
};

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedClient(null);
  };

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'phone', label: 'Phone' },
    { value: 'crnNo', label: 'CRN No' },
    { value: 'loanNo', label: 'Loan No' },
    { value: 'email', label: 'Email' }
  ];

  const itemsPerPage = 10;

  const filteredClientData = clientHistoryData.filter(item => {
    // Advanced search filter
    if (!advancedSearch.field || !advancedSearch.term) return true;
    
    const fieldValue = item[advancedSearch.field]?.toString().toLowerCase() || '';
    return fieldValue.includes(advancedSearch.term.toLowerCase());
  });

  const totalPages = Math.ceil(filteredClientData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClientData = filteredClientData.slice(startIndex, startIndex + itemsPerPage);

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

  if (loading && clientHistoryData.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading client histories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="text-center">
          <p className={`text-lg ${isDark ? "text-red-400" : "text-red-600"}`}>
            {error}
          </p>
          <button
            onClick={fetchClientHistories}
            className={`mt-4 px-4 py-2 rounded-lg ${
              isDark 
                ? "bg-emerald-600 hover:bg-emerald-500" 
                : "bg-emerald-600 hover:bg-emerald-500"
            } text-white transition-colors`}
          >
            Retry
          </button>
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
              <div className="flex items-center space-x-3">
                <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>
                  Client History
                </h1>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <AdvancedSearchBar
                searchOptions={searchOptions}
                onSearch={handleAdvancedSearch}
                placeholder="Search clients..."
                defaultSearchField="name"
              />
            </div>
          </div>

          {/* Total Records */}
          <div className="mb-4">
            <p className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Total Records: {filteredClientData.length}
            </p>
          </div>
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