"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, User, Loader } from "lucide-react";
import Pagination from "../Pagination";
import ReferFriendsTableRow from "./ReferFriendsTableRaw";
import { exportToExcel } from "@/components/utils/exportutil";
import { referralAPI, formatReferralForUI } from "@/lib/services/ReferenceServices";
import SearchBar from "../SearchBar";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";

const ReferFriends = () => { 
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  const fetchReferrals = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = { page };
      if (search.trim()) {
        params.search = search.trim();
      }

      const result = await referralAPI.getReferrals(params);
      
      if (result.success) {
        const formattedData = result.data.map(formatReferralForUI);
        setReferrals(formattedData);
        setTotalRecords(result.pagination.total);
        setTotalPages(result.pagination.total_pages);
        setCurrentPage(result.pagination.current_page);
      } else {
        setError(result.message || "Failed to fetch referrals");
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      setError("Error loading referrals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals(1, searchQuery);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchReferrals(1, searchQuery);
    }, 500);
  
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);
      
      const result = await referralAPI.exportReferrals(searchQuery);
      
      if (result.success) {
        const formattedData = result.data.map(formatReferralForUI);
        
        if (formattedData.length === 0) {
          setError("No data to export");
          setExporting(false);
          return;
        }
        
        // Create export data
        const exportData = [
          ['SN', 'Refer By', 'Reference Name', 'Reference Email', 'Reference Mobile', 'Date', 'CRN No'],
          ...formattedData.map((referral, index) => [
            index + 1,
            referral.referBy,
            referral.referenceName,
            referral.referenceEmail,
            referral.referenceMobile,
            referral.date,
            referral.senderCrnNo
          ])
        ];
        
        // Generate filename
        let filename = 'refer_friends';
        if (searchQuery) {
          filename += `_${searchQuery.replace(/\s+/g, '_')}`;
        }
        filename += '.xls';
        
        exportToExcel(exportData, filename);
        
        // Show success message
        setError(`✅ Exported ${formattedData.length} records successfully!`);
        
      } else {
        setError(result.message || "Failed to export data");
      }
    } catch (error) {
      console.error("Export error:", error);
      setError("Error exporting data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handlePageChange = (page) => {
    fetchReferrals(page, searchQuery);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-emerald-50/10"}`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-6 items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
              <button 
                onClick={()=> router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30" : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"}`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </button>
              <h1
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${isDark
                  ? "from-emerald-400 to-teal-400"
                  : "from-gray-800 to-gray-700"} bg-clip-text text-transparent`}
              >
                Refer Friends
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button 
                onClick={handleExport}
                disabled={exporting || loading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:scale-105 ${isDark ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"} shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {exporting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </>
                )}
              </button> */}
            </div>
          </div>

          {/* Total Records Display */}
          <div className="mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg ${isDark ? "bg-gray-800 border border-emerald-600/30" : "bg-white border border-emerald-200"} shadow-sm`}>
              <span
                className={`text-sm font-medium ${isDark
                  ? "text-gray-300"
                  : "text-gray-600"}`}
              >
                Total Records -
              </span>
              <span className={`ml-1 text-sm font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                {loading ? "..." : totalRecords}
              </span>
            </div>
            
            {/* Search Info */}
            {searchQuery && (
              <div className="inline-flex items-center ml-4 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm">
                Search: "{searchQuery}"
              </div>
            )}
            
            {/* Error/Success Messages */}
            {error && (
              <div className={`mt-2 p-3 rounded-lg ${error.includes("✅") 
                ? isDark ? "bg-green-900/30 border border-green-500/50" : "bg-green-50 border border-green-200"
                : isDark ? "bg-red-900/30 border border-red-500/50" : "bg-red-50 border border-red-200"}`}>
                <p className={`text-sm ${error.includes("✅") 
                  ? isDark ? "text-green-300" : "text-green-700"
                  : isDark ? "text-red-300" : "text-red-700"}`}>
                  {error}
                </p>
              </div>
            )}
          </div>
          
          {/* Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search by name or CRN..."
                isDark={isDark} 
              />
            </div>
            {/* <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} flex items-center`}>
              {searchQuery ? (
                <span>
                  Export will include only records matching your search
                </span>
              ) : (
                <span>
                  Export will include all records
                </span>
              )}
            </div> */}
          </div>

          {/* Table Container */}
          <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${isDark ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20" : "bg-white border-emerald-300 shadow-emerald-500/10"}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max" style={{ minWidth: "900px" }}>
                <thead className={`border-b-2 ${isDark ? "bg-gray-900 border-emerald-600/50" : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"}`}>
                  <tr>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`} style={{ minWidth: "60px" }}>
                      SN
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`} style={{ minWidth: "180px" }}>
                      Refer By
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`} style={{ minWidth: "150px" }}>
                      Reference Name
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`} style={{ minWidth: "200px" }}>
                      Reference Email
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`} style={{ minWidth: "150px" }}>
                      Reference Mobile
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"}`} style={{ minWidth: "120px" }}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y-2 ${isDark ? "divide-emerald-600/30" : "divide-emerald-200"}`}>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className={`px-6 py-12 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <div className="flex flex-col items-center space-y-3">
                          <Loader className="w-8 h-8 animate-spin" />
                          <p className="text-lg font-medium">Loading...</p>
                        </div>
                      </td>
                    </tr>
                  ) : referrals.length > 0 ? (
                    referrals.map((referral, index) => (
                      <ReferFriendsTableRow
                        key={referral.id}
                        referral={referral}
                        index={index}
                        startIndex={(currentPage - 1) * itemsPerPage}
                        isDark={isDark}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={`px-6 py-12 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <div className="flex flex-col items-center space-y-3">
                          <div className={`p-4 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                            <User className={`w-8 h-8 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                          </div>
                          <p className="text-lg font-medium">
                            No referrals found
                          </p>
                          <p className="text-sm">
                            {searchQuery ? "No referrals match your search" : "No referral data available"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalRecords > 0 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
                totalItems={totalRecords} 
                itemsPerPage={itemsPerPage} 
                isDark={isDark} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferFriends;