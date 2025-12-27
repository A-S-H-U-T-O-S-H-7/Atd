"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import SoaDetails from "./SoaDetails";
import SoaTable from "./SoaTable";
import { exportToExcel } from "@/components/utils/exportutil";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { soaAPI, formatSoaDataForUI } from "@/lib/services/SoaService";

const SoaPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [soaData, setSoaData] = useState(null);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    // Hardcoded application ID 6 for now
    const applicationId = "6";
    fetchSoaData(applicationId);
  }, []);

  const fetchSoaData = async (id) => {
    try {
      setLoading(true);
      const response = await soaAPI.getSoaData(id);
      console.log("API Response:", response); // Debug log
      
      if (response && response.success) {
        const formattedData = formatSoaDataForUI(response);
        console.log("Formatted Data:", formattedData); // Debug log
        
        setSoaData(formattedData);
        setDetails(formattedData.details || []);
        setError(null);
      } else {
        throw new Error(response?.message || "Invalid API response");
      }
    } catch (err) {
      console.error("Error fetching SOA data:", err);
      setError(`Failed to load statement of account data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    if (!details || details.length === 0) {
      alert("No data available to export");
      return;
    }

    const exportData = details.map(item => ({
      'SN': item.sn,
      'Date': item.date,
      'Normal Interest Charged': item.normal_interest_charged,
      'Penal Interest Charged': item.penal_interest_charged,
      'Penality Charged': item.penality_charged,
      'Collection Received': item.collection_received,
      'Principle Adjusted': item.principle_adjusted,
      'Normal Interest Adjusted': item.normal_interest_adjusted,
      'Penal Interest Adjusted': item.penal_interest_adjusted,
      'Penalty Adjusted': item.penalty_adjusted,
      'Principle After Adjusted': item.principle_after_adjusted,
      'Normal Interest After Adjusted': item.normal_interest_after_adjusted,
      'Penal Interest After Adjusted': item.penal_interest_after_adjusted,
      'Penalty After Adjusted': item.penalty_after_adjusted,
      'Total Outstanding Amount': item.total_outstanding_amount
    }));

    if (type === 'excel') {
      exportToExcel(exportData, `statement-of-account-${soaData?.loan_no || 'export'}`);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`w-12 h-12 animate-spin ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <p className={`text-lg font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Loading statement of account...
          </p>
        </div>
      </div>
    );
  }

  if (error || !soaData) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className={`max-w-md p-6 rounded-2xl border-2 ${
          isDark 
            ? "bg-gray-800 border-red-600/50 text-red-400"
            : "bg-white border-red-300 text-red-600"
        }`}>
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="mb-4">{error || "No data available"}</p>
          <div className="flex space-x-3">
            <button
              onClick={() => router.back()}
              className={`px-4 py-2 rounded-lg font-medium ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Go Back
            </button>
            <button
              onClick={() => router.push('/')}
              className={`px-4 py-2 rounded-lg font-medium ${
                isDark
                  ? "bg-emerald-700 hover:bg-emerald-600"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
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
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>
                  Statement of Account
                </h1>
                <p className={`text-sm mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Application ID: 6 | Loan No: {soaData.loan_no} | Customer: {soaData.fullname}
                </p>
              </div>
            </div>
            
            {/* Export Button */}
            <button
              onClick={() => handleExport('excel')}
              disabled={!details || details.length === 0}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                !details || details.length === 0
                  ? isDark
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isDark
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Details Section */}
        <SoaDetails data={soaData} isDark={isDark} />

        {/* Statement Table */}
        <SoaTable 
          details={details} 
          isDark={isDark} 
        />
      </div>
    </div>
  );
};

export default SoaPage;