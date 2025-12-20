"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import SearchBar from "../../SearchBar";
import EmandateTable from "./E-MandateTable";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { EmandateService,formatDepositsForTable } from "@/lib/services/E-mandateService";

const EmandateDepositPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 10;

  // Fetch deposits on component mount
  useEffect(() => {
    fetchDeposits();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
      medium: "Emandate",
      page: currentPage,
      per_page: itemsPerPage,
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter !== "all" && { status: statusFilter })
    };

      const response = await EmandateService.getEmandateDeposits(params);
      
      if (response.success && response.data) {
        const formattedDeposits = formatDepositsForTable(response.data);
        setDeposits(formattedDeposits);
      } else {
        setError("Failed to load deposits");
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
      setError("Failed to load deposits. Please try again.");
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeposit = () => {
    router.push("/crm/e-mandate-management/manage-e-mandate");
  };

  const handleEditClick = (deposit) => {
    router.push(`/crm/e-mandate-management/manage-e-mandate?id=${deposit.id}`);
  };

  // Filter deposits
  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = 
      deposit.loanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.chequeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || deposit.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeposits = filteredDeposits.slice(startIndex, startIndex + itemsPerPage);

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
                Manage E-Mandate Deposit
              </h1>
            </div>
            
            {/* Add Deposit Button */}
            <button
              onClick={handleAddDeposit}
              className={`px-6 py-3 cursor-pointer rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
              } shadow-lg`}
            >
              <Plus size={20} />
              <span>Add Deposit</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by loan no, cheque no, bank name, customer name..."
              />
            </div>

            {/* FIXED: Status filter options to match API values */}
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
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="bounced">Bounced</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl border-2 ${
            isDark 
              ? "bg-red-900/20 border-red-600/50 text-red-200" 
              : "bg-red-50 border-red-300 text-red-700"
          }`}>
            {error}
          </div>
        )}

        {/* Table */}
        <EmandateTable
          paginatedDeposits={deposits}
          filteredDeposits={deposits} 
           totalPages={totalPages} 
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onEditClick={handleEditClick}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default EmandateDepositPage;