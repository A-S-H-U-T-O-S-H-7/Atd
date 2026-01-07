"use client";
import React, { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import SoaDetails from "./SoaDetails";
import SoaTable from "./SoaTable";
import { exportSoaToExcel } from "@/components/utils/exportsoautil";
import { useRouter, useSearchParams } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { soaAPI, formatSoaDataForUI } from "@/lib/services/SoaService";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

// Content component that uses useSearchParams
const SoaPageContent = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [soaData, setSoaData] = useState(null);
  const [allDetails, setAllDetails] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Infinite scroll configuration
  const itemsPerPage = 20;
  const observerTarget = useRef(null);
  const currentOffsetRef = useRef(0);

  // Get application ID from URL
  const applicationId = searchParams.get("id");

  useEffect(() => {
    if (applicationId) {
      currentOffsetRef.current = 0;
      setAllDetails([]);
      fetchSoaData(applicationId);
    } else {
      setError("No application ID provided in URL");
      setLoading(false);
    }
  }, [applicationId]);

  const fetchSoaData = async (id, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await soaAPI.getSoaData(id, {
        limit: itemsPerPage,
        offset: currentOffsetRef.current
      });
      
      if (response && response.success) {
        const formattedData = formatSoaDataForUI(response);
        
        if (!isLoadMore) {
          // Initial load
          setSoaData(formattedData);
          setAllDetails(formattedData.details || []);
          currentOffsetRef.current = (formattedData.details || []).length;
        } else {
          // Load more
          setAllDetails(prev => [...prev, ...(formattedData.details || [])]);
          currentOffsetRef.current += (formattedData.details || []).length;
        }
        
        // Check if we have more data to load
        setHasMore((formattedData.details || []).length === itemsPerPage);
        setError(null);
      } else {
        throw new Error(response?.message || "Invalid API response");
      }
    } catch (err) {
      console.error("Error fetching SOA data:", err);
      if (!isLoadMore) {
        setError(`Failed to load statement of account data: ${err.message}`);
      }
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading || loadingMore || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchSoaData(applicationId, true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, loadingMore, hasMore, applicationId]);


const handleExport = async () => {
  if (!soaData || !allDetails || allDetails.length === 0) {
    toast.error('No data available to export');
    return;
  }

  const result = await Swal.fire({
    title: 'Export SOA Data?',
    text: `This will export SOA data for ${soaData.fullname} (Loan: ${soaData.loan_no})`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Export Excel',
    cancelButtonText: 'Cancel',
    background: isDark ? "#1f2937" : "#ffffff",
    color: isDark ? "#f9fafb" : "#111827",
  });

  if (!result.isConfirmed) return;

  const toastId = toast.loading('Preparing export...');

  try {
    const transactionData = allDetails.map(item => [
      item.sn,
      item.date,
      item.normal_interest_charged,
      item.penal_interest_charged,
      item.penality_charged,
      item.collection_received,
      item.principle_adjusted,
      item.normal_interest_adjusted,
      item.penal_interest_adjusted,
      item.penalty_adjusted,
      item.principle_after_adjusted,
      item.normal_interest_after_adjusted,
      item.penal_interest_after_adjusted,
      item.penalty_after_adjusted,
      item.total_outstanding_amount
    ]);

    const customerInfo = {
      fullname: soaData.fullname,
      loan_no: soaData.loan_no,
      crnno: soaData.crnno,
      sanction_amount: soaData.sanction_amount,
      disburse_amount: soaData.disburse_amount,
      ledger_balance: soaData.ledger_balance
    };

    exportSoaToExcel(
      transactionData,
      `SOA_${soaData.loan_no}_${soaData.fullname}_${new Date().toISOString().split('T')[0]}`,
      customerInfo
    );

    toast.success('Statement of Account exported successfully!', {
      id: toastId,
      duration: 3000,
    });
    
  } catch (err) {
    console.error('Export error:', err);
    toast.dismiss(toastId);
    toast.error('Failed to export data. Please try again.', {
      duration: 3000,
    });
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
      <div className={" flex flex-col items-center justify-center p-6 "}>
        <div className={`relative max-w-lg w-full p-8 rounded-3xl overflow-hidden shadow-2xl ${
          isDark 
            ? "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-700/50"
            : "bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200/50"
        }`}>
          
          {/* Animated gradient background */}
          <div className={`absolute inset-0 z-0 opacity-10 ${
            isDark 
              ? "bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-gradient-x"
              : "bg-gradient-to-r from-red-400 via-orange-300 to-red-400 animate-gradient-x"
          }`}></div>
          
          <div className="relative z-10">
            {/* Error icon */}
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${
                isDark 
                  ? "bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/30"
                  : "bg-gradient-to-br from-red-100 to-red-50 border border-red-200"
              }`}>
                <div className={`p-3 rounded-full ${
                  isDark 
                    ? "bg-gradient-to-br from-red-700 to-red-800"
                    : "bg-gradient-to-br from-red-500 to-red-600"
                }`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Error title */}
            <h2 className={`text-2xl font-bold text-center mb-3 ${
              isDark 
                ? "text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"
                : "text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600"
            }`}>
              Something Went Wrong
            </h2>
            
            {/* Error message */}
            <div className={`mb-8 p-4 rounded-xl border-l-4 ${
              isDark 
                ? "bg-gray-800/50 border-red-500 text-gray-300"
                : "bg-gray-50 border-red-400 text-gray-700"
            }`}>
              <p className="text-center font-medium">{error || "No data available"}</p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isDark
                    ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-300 shadow-lg hover:shadow-gray-800/50"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 shadow-lg hover:shadow-gray-300/50"
                }`}
              >
                ← Go Back
              </button>
              
              <button
                onClick={() => router.push('/crm/manage-application')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                  isDark
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:shadow-emerald-900/50"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white hover:shadow-emerald-400/50"
                  }`}
              >
                Manage Applications
              </button>
            </div>
            
            {/* Additional help text */}
            <div className={`mt-6 pt-6 border-t text-center text-sm ${
              isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-500"
            }`}>
              <p>If the problem persists, please contact support</p>
            </div>
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
                  Application ID: {applicationId} | Loan No: {soaData.loan_no} | Customer: {soaData.fullname}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleExport('excel')}
              disabled={!allDetails || allDetails.length === 0}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                !allDetails || allDetails.length === 0
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

        <SoaDetails data={soaData} isDark={isDark} />

        <SoaTable 
          details={allDetails} 
          isDark={isDark}
          loadingMore={loadingMore}
          hasMore={hasMore}
          observerRef={observerTarget}
        />
      </div>
    </div>
  );
};

// Main component with Suspense
const SoaPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-emerald-50/30">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
          <p className="text-lg font-medium text-gray-700">
            Loading statement of account...
          </p>
        </div>
      </div>
    }>
      <SoaPageContent />
    </Suspense>
  );
};

export default SoaPage;