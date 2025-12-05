"use client";
import React, { useState } from "react";
import { Building } from "lucide-react";

const BankDateFilter = ({
  isDark,
  onFilterChange,
  banks,
  buttonLabels = {
    apply: "Apply",
    clear: "Clear",
  },
  dateField = "disburse_date", // Add this prop
}) => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedBank, setSelectedBank] = useState("all");
  const [isApplying, setIsApplying] = useState(false);

  const currentDate = new Date().toISOString().split("T")[0];

  const handleDateChange = (type, value) => {
    const newDateRange = { ...dateRange };
    if (type === "start") {
      newDateRange.start = value;
      if (value && dateRange.end && new Date(value) > new Date(dateRange.end)) {
        newDateRange.end = "";
      }
    } else {
      if (value) {
        const endDate = new Date(value);
        const today = new Date(currentDate);
        if (dateRange.start && endDate < new Date(dateRange.start)) {
          return;
        }
        if (endDate > today) {
          return;
        }
      }
      newDateRange.end = value;
    }
    setDateRange(newDateRange);
  };

  const handleBankChange = (value) => {
    setSelectedBank(value);
  };

  const handleApplyFilter = async () => {
    if (!onFilterChange) return;

    setIsApplying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      onFilterChange({
        dateRange,
        selectedBank,
        dateField, // Pass the date field
      });
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearFilter = () => {
    const clearedDateRange = { start: "", end: "" };
    const clearedBank = "all";
    setDateRange(clearedDateRange);
    setSelectedBank(clearedBank);
    if (onFilterChange) {
      onFilterChange({
        dateRange: clearedDateRange,
        selectedBank: clearedBank,
        dateField,
      });
    }
  };

  const isApplyEnabled = !isApplying && (dateRange.start !== "" || dateRange.end !== "" || selectedBank !== "all");

  return (
    <div
      className={`border rounded-lg p-6 mb-6 transition-colors duration-300 ${
        isDark ? "border-emerald-600/30 bg-gray-800/50" : "border-emerald-200 bg-emerald-50/30"
      }`}
      role="region"
      aria-label="Date and Bank Filters"
    >
      <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 items-end`}>
        <div className="md:col-span-1">
          <label
            htmlFor="from-date"
            className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            From Date
          </label>
          <input
            id="from-date"
            type="date"
            value={dateRange.start}
            max={currentDate}
            onChange={(e) => handleDateChange("start", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-1 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isApplying}
          />
        </div>

        <div className="md:col-span-1">
          <label
            htmlFor="to-date"
            className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            To Date
          </label>
          <input
            id="to-date"
            type="date"
            value={dateRange.end}
            min={dateRange.start || undefined}
            max={currentDate}
            onChange={(e) => handleDateChange("end", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-1 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isApplying}
          />
        </div>

        <div className="md:col-span-1">
          <label
            htmlFor="bank-filter"
            className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              <span>Bank</span>
            </div>
          </label>
          <select
            id="bank-filter"
            value={selectedBank}
            onChange={(e) => handleBankChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
            } focus:ring-1 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isApplying}
          >
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <button
            onClick={handleApplyFilter}
            disabled={!isApplyEnabled}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              isApplying
                ? "animate-pulse bg-gray-400 text-white"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
            } shadow-lg hover:shadow-xl disabled:shadow-none`}
          >
            {isApplying ? "Applying..." : buttonLabels.apply}
          </button>
        </div>

        <div className="md:col-span-1">
          <button
            onClick={handleClearFilter}
            disabled={isApplying || !isApplyEnabled}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
            } shadow-lg hover:shadow-xl disabled:shadow-none`}
          >
            {buttonLabels.clear}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDateFilter;