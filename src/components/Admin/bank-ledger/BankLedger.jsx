"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import BankLedgerTable from "./BankLedgerTable";
import BankLedgerFilters from "./BankLedgerFilter";
import { useRouter } from "next/navigation";

const BankLedgerPage = () => {
  const { isDark } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    selectedBank: "",
    dateFrom: "",
    dateTo: ""
  });
  const router = useRouter();

  // Sample bank ledger data
  const [ledgerEntries] = useState([
    {
      id: 1,
      date: "2024-01-15",
      particulars: "Opening Balance",
      debit: 50000,
      credit: 0,
      balance: 50000,
      bank: "ICICI Bank-A/C-1738"
    },
    {
      id: 2,
      date: "2024-01-16",
      particulars: "Cash Deposit",
      debit: 0,
      credit: 25000,
      balance: 75000,
      bank: "ICICI Bank-A/C-1738"
    },
    {
      id: 3,
      date: "2024-01-17",
      particulars: "Cheque Payment",
      debit: 15000,
      credit: 0,
      balance: 60000,
      bank: "ICICI Bank-A/C-1738"
    },
    {
      id: 4,
      date: "2024-01-18",
      particulars: "Online Transfer",
      debit: 0,
      credit: 10000,
      balance: 70000,
      bank: "HDFC Bank-A/C-2456"
    },
    {
      id: 5,
      date: "2024-01-19",
      particulars: "Service Charges",
      debit: 500,
      credit: 0,
      balance: 69500,
      bank: "HDFC Bank-A/C-2456"
    },
    {
      id: 6,
      date: "2024-01-20",
      particulars: "Interest Credit",
      debit: 0,
      credit: 2500,
      balance: 72000,
      bank: "SBI Bank-A/C-9871"
    },
    {
      id: 7,
      date: "2024-01-21",
      particulars: "ATM Withdrawal",
      debit: 5000,
      credit: 0,
      balance: 67000,
      bank: "SBI Bank-A/C-9871"
    },
    {
      id: 8,
      date: "2024-01-22",
      particulars: "Salary Credit",
      debit: 0,
      credit: 35000,
      balance: 102000,
      bank: "ICICI Bank-A/C-1738"
    }
  ]);

  // Get unique banks for dropdown
  const availableBanks = [...new Set(ledgerEntries.map(entry => entry.bank))];

  // Filter entries based on selected filters
  const getFilteredEntries = () => {
    let filtered = [...ledgerEntries];

    // Filter by bank
    if (filters.selectedBank) {
      filtered = filtered.filter(entry => entry.bank === filters.selectedBank);
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(entry => new Date(entry.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(entry => new Date(entry.date) <= new Date(filters.dateTo));
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredEntries = getFilteredEntries();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    // Trigger re-filtering when search button is clicked
    setCurrentPage(1);
  };

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
              onClick={()=>router.back()}
               className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-blue-600/30"
                  : "hover:bg-blue-50 bg-blue-50/50 border border-blue-200"
              }`}>
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <div className="flex items-center space-x-3">
                
                <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>
                  Bank Ledger
                </h1>
              </div>
            </div>
          </div>

          {/* Filters */}
          <BankLedgerFilters
            filters={filters}
            availableBanks={availableBanks}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            isDark={isDark}
          />
        </div>

        {/* Bank Ledger Table */}
        <BankLedgerTable
          paginatedEntries={paginatedEntries}
          entries={filteredEntries}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BankLedgerPage;