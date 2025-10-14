"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, User,Loader } from "lucide-react";
import Pagination from "../Pagination";
import ReferFriendsTableRow from "./ReferFriendsTableRaw";
import { exportToExcel } from "@/components/utils/exportutil";
import { referralAPI,formatReferralForUI } from "@/lib/services/ReferenceServices";
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
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  // const itemsPerPage = 10;
  // const totalPages = Math.ceil(referrals.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const paginatedData = referrals.slice(startIndex, startIndex + itemsPerPage);

  const fetchReferrals = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = { page };
      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await referralAPI.getReferrals(params);
      
      if (response.success) {
        const formattedData = response.data.map(formatReferralForUI);
        setReferrals(formattedData);
        setTotalRecords(response.pagination.total);
        setTotalPages(response.pagination.total_pages);
        setCurrentPage(response.pagination.current_page);
      } else {
        setError("Failed to fetch referrals");
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
      setLoading(true);
      const response = await referralAPI.exportReferrals();
      
      if (response.data.success) {
        const formattedData = response.data.data.map(formatReferralForUI);
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
        
        exportToExcel(exportData, 'refer_friends.csv');
      } else {
        setError("Failed to export data");
      }
    } catch (error) {
      console.error("Export error:", error);
      setError("Error exporting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchReferrals(page, searchQuery);
  };

  return <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-emerald-50/10"}`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-6 items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
              <button 
              onClick={()=> router.back()}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30" : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"}`}>
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
              <button onClick={handleExport} className={`flex cursor-pointer items-center space-x-2 px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:scale-105 ${isDark ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"} shadow-lg hover:shadow-xl`}>
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
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
            {error && <div className="mt-2 text-red-500 text-sm">
                {error}
              </div>}
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
</div>

          {/* Table Container */}
          <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${isDark ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20" : "bg-white border-emerald-300 shadow-emerald-500/10"}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max" style={{ minWidth: "900px" }}>
                <thead className={`border-b-2 ${isDark ? "bg-gray-900 border-emerald-600/50" : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"}`}>
                  <tr>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
}`} style={{ minWidth: "60px" }}>
                      SN
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
}`} style={{ minWidth: "180px" }}>
                      Refer By
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
}`} style={{ minWidth: "150px" }}>
                      Reference Name
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
}`} style={{ minWidth: "200px" }}>
                      Reference Email
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
}`} style={{ minWidth: "150px" }}>
                      Reference Mobile
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold border-r ${isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
}`} style={{ minWidth: "120px" }}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y-2 ${isDark ? "divide-emerald-600/30" : "divide-emerald-200"}`}>
                  {loading ? <tr>
                        <td colSpan="6" className={`px-6 py-12 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          <div className="flex flex-col items-center space-y-3">
                            <Loader className="w-8 h-8 animate-spin" />
                            <p className="text-lg font-medium">Loading...</p>
                          </div>
                        </td>
                      </tr> : referrals.length > 0 ? referrals.map(
                          (referral, index) =>
                            <ReferFriendsTableRow
                              key={referral.id}
                              referral={referral}
                              index={index}
                              startIndex={(currentPage - 1) * itemsPerPage}
                              isDark={isDark}
                            />
                        ) : <tr>
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
                        </tr>}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalRecords > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={totalRecords} itemsPerPage={itemsPerPage} isDark={isDark} />}
          </div>
        </div>
      </div>
    </div>
};

export default ReferFriends;