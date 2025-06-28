"use client";
import React, { useState } from "react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchFilter from "./SearchFilter";
import ProfitLossSummary from "./ProfitLoassSummery";

const ProfitLossPage = () => {
  const { isDark } = useAdminAuth();
  const [selectedMonth, setSelectedMonth] = useState("--Select Month--");
  const [selectedYear, setSelectedYear] = useState("--Select Year--");

  // Sample data - replace with your actual data
  const profitLossData = {
    processFee: {
      actual: 717103.00,
      total: 846181.00,
      gst: 129078.00
    },
    penalty: {
      actual: 50424.00,
      total: 59500.00,
      gst: 9076.00
    },
    interest: 169573.00,
    penalInterest: 524040.00,
    totalIncome: 1461140.00,
    totalExpenses: 0.00,
    profitLoss: 1461140.00
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", selectedMonth, selectedYear);
    // You can add API call here to fetch filtered data
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${
            isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
          } bg-clip-text text-transparent mb-2`}>
            Profit and Loss Statement
          </h1>
          <p className={`text-lg ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            Track your business performance and financial health
          </p>
        </div>

        {/* Search Filter Component */}
        <SearchFilter
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onSearch={handleSearch}
          isDark={isDark}
        />

        {/* Profit Loss Summary Component */}
        <ProfitLossSummary
          data={profitLossData}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default ProfitLossPage;