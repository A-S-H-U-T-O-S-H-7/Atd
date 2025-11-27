"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle, ArrowLeft, CheckCircle, CreditCard, Download, Scale } from "lucide-react";
import SearchBar from "../SearchBar";
import LegalTable from "./LegalTable";
import { exportToExcel } from "@/components/utils/exportutil";
import { useRouter } from "next/navigation";
import CreateNoticeModal from "./CreateNoticeModal";
import CreateCriminalCaseModal from "./CriminalCaseModal";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { legalService, formatLegalCaseForUI } from "@/lib/services/LegalService";

// Main Legal Management Component
const LegalPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isCreateNoticeModalOpen, setIsCreateNoticeModalOpen] = useState(false);
  const [isCriminalCaseModalOpen, setIsCriminalCaseModalOpen] = useState(false);
  const [selectedLegal, setSelectedLegal] = useState(null);
  
  const [legals, setLegals] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });

  const itemsPerPage = 10;

  // Fetch legal cases
  const fetchLegalCases = async (page = 1, search = "") => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await legalService.getLegalCases({
        page,
        per_page: itemsPerPage,
        search
      });

      if (response.success) {
        const formattedLegals = response.data.map(formatLegalCaseForUI);
        setLegals(formattedLegals);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || "Failed to fetch legal cases");
      }
    } catch (err) {
      console.error("Error fetching legal cases:", err);
      setError(err.message || "Failed to load legal cases");
      setLegals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLegalCases(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleExport = async (type) => {
    try {
      const exportData = filteredLegals.map(legal => ({
        'S.No': legal.sNo,
        'Customer Name': legal.customerName,
        'Mobile No': legal.mobileNo,
        'Loan ID': legal.loanId,
        'CRN No': legal.crnNo,
        'Principal': legal.principal,
        'Interest': legal.interest,
        'Total Amount': legal.totalAmount,
        'Bank Name': legal.bankName,
        'IFSC': legal.ifsc,
        'Sanction Date': legal.sanctionDate,
        'Disbursement Date': legal.disbursementDate,
        'Police Station': legal.policeStation,
        'Delivery Status': legal.deliveryStatus
      }));

      if (type === 'excel') {
        exportToExcel(exportData, 'legal-cases');
      }
    } catch (err) {
      console.error("Error exporting data:", err);
      setError("Failed to export data");
    }
  };

  const handleCreateNotice = (legal) => {
    setSelectedLegal(legal);
    setIsCreateNoticeModalOpen(true);
  };

  const handleCriminalCase = (legal) => {
    setSelectedLegal(legal);
    setIsCriminalCaseModalOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter legals based on search term (client-side filtering as fallback)
  const filteredLegals = legals.filter(legal => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      legal.customerName.toLowerCase().includes(searchLower) ||
      legal.mobileNo.includes(searchTerm) ||
      legal.loanId.toLowerCase().includes(searchLower) ||
      legal.crnNo.toLowerCase().includes(searchLower) ||
      legal.ifsc.toLowerCase().includes(searchLower) ||
      legal.bankName.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = pagination.total_pages || Math.ceil(filteredLegals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLegals = filteredLegals.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-blue-50/30"
      }`}>
        <div className={`p-8 rounded-xl ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading legal cases...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-blue-50/30"
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
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-blue-600/30"
                    : "hover:bg-blue-50 bg-blue-50/50 border border-blue-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <div className="flex items-center space-x-3">
                <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>
                  Legal Cases Management
                </h1>
              </div>
            </div>
            
            {/* Export Button */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('excel')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-4 rounded-xl border ${
              isDark 
                ? "bg-red-900/20 border-red-700 text-red-300" 
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              <div className="flex items-center space-x-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder="Search by Customer Name, Mobile No, Loan ID, CRN No, IFSC..."
              />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-blue-600/50"
                : "bg-white border-blue-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-blue-900/50" : "bg-blue-100"
                }`}>
                  <Scale className={`w-6 h-6 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {pagination.total || filteredLegals.length}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total Cases
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-green-600/50"
                : "bg-white border-green-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-green-900/50" : "bg-green-100"
                }`}>
                  <CheckCircle className={`w-6 h-6 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {filteredLegals.filter(legal => legal.deliveryStatus?.toLowerCase() === 'delivered').length}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Delivered
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-orange-600/50"
                : "bg-white border-orange-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-orange-900/50" : "bg-orange-100"
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {filteredLegals.filter(legal => legal.deliveryStatus?.toLowerCase() === 'not delivered').length}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Not Delivered
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-purple-600/50"
                : "bg-white border-purple-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-purple-900/50" : "bg-purple-100"
                }`}>
                  <CreditCard className={`w-6 h-6 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    ₹{filteredLegals.reduce((sum, legal) => sum + (legal.totalAmount || 0), 0).toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total Amount
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Table */}
        <LegalTable
          paginatedLegals={paginatedLegals}
          filteredLegals={filteredLegals}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={handlePageChange}
          onCreateNotice={handleCreateNotice}    
          onCriminalCase={handleCriminalCase}
          isLoading={isLoading}
        />
      </div>

      {/* Modals */}
      <CreateNoticeModal
        isOpen={isCreateNoticeModalOpen}
        onClose={() => setIsCreateNoticeModalOpen(false)}
        legal={selectedLegal}
        isDark={isDark}
        onSuccess={() => fetchLegalCases(currentPage, searchTerm)}
      />
      <CreateCriminalCaseModal
        isOpen={isCriminalCaseModalOpen}
        onClose={() => setIsCriminalCaseModalOpen(false)}
        legal={selectedLegal}
        isDark={isDark}
        onSuccess={() => fetchLegalCases(currentPage, searchTerm)}
      />
    </div>
  );
};

export default LegalPage;