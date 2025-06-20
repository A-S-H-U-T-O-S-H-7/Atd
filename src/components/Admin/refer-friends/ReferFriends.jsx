"use client";
import React, { useState } from "react";
import { ArrowLeft, Download, User } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import Pagination from "../Pagination";
import ReferFriendsTableRow from "./ReferFriendsTableRaw";
import { exportToExcel } from "@/components/utils/exportutil";

const ReferFriends = () => {
  // Mock data based on your screenshot
  const mockReferralData = [
    {
      id: 426945,
      referBy: "Rishiraj Patel",
      referenceName: "Raj",
      referenceEmail: "raj76@gmail.com",
      referenceMobile: "9572160302",
      date: "19-06-2025"
    },
    {
      id: 426944,
      referBy: "Rishiraj Patel",
      referenceName: "Suraj",
      referenceEmail: "suraj45@gmail.com",
      referenceMobile: "9430194051",
      date: "19-06-2025"
    },
    {
      id: 426943,
      referBy: "Rishiraj Patel",
      referenceName: "Ram",
      referenceEmail: "ramhu@gmail.com",
      referenceMobile: "9508300866",
      date: "19-06-2025"
    },
    {
      id: 426942,
      referBy: "Rishiraj Patel",
      referenceName: "Vikash",
      referenceEmail: "vikash776@gmail.com",
      referenceMobile: "9123151430",
      date: "19-06-2025"
    },
    {
      id: 426941,
      referBy: "Rishiraj Patel",
      referenceName: "Aman",
      referenceEmail: "aman76@gmail.com",
      referenceMobile: "6287655197",
      date: "19-06-2025"
    },
    {
      id: 426940,
      referBy: "Rishiraj Patel",
      referenceName: "Rohit Kumar",
      referenceEmail: "rohit@gmail.com",
      referenceMobile: "8765432109",
      date: "19-06-2025"
    },
    {
      id: 426939,
      referBy: "Priya Sharma",
      referenceName: "Anita Singh",
      referenceEmail: "anita@gmail.com",
      referenceMobile: "7654321098",
      date: "18-06-2025"
    },
    {
      id: 426938,
      referBy: "Amit Gupta",
      referenceName: "Deepak Raj",
      referenceEmail: "deepak@gmail.com",
      referenceMobile: "6543210987",
      date: "18-06-2025"
    },
    {
      id: 426937,
      referBy: "Sunita Patel",
      referenceName: "Kavita Devi",
      referenceEmail: "kavita@gmail.com",
      referenceMobile: "5432109876",
      date: "18-06-2025"
    },
    {
      id: 426936,
      referBy: "Ravi Kumar",
      referenceName: "Mukesh Singh",
      referenceEmail: "mukesh@gmail.com",
      referenceMobile: "4321098765",
      date: "17-06-2025"
    },
    
  ];

  const { isDark } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [referrals] = useState(mockReferralData);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(referrals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = referrals.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    const exportData = [
      ['SN', 'Refer By', 'Reference Name', 'Reference Email', 'Reference Mobile', 'Date'],
      ...referrals.map((referral, index) => [
        index + 1,
        referral.referBy,
        referral.referenceName,
        referral.referenceEmail,
        referral.referenceMobile,
        referral.date
      ])
    ];
    
    exportToExcel(exportData, 'refer_friends.csv');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-emerald-50/10"}`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-6 items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
              <button
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </button>
              <h1
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-gray-800 to-gray-700"
                } bg-clip-text text-transparent`}
              >
                Refer Friends
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className={`flex cursor-pointer items-center space-x-2 px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                } shadow-lg hover:shadow-xl`}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Total Records Display */}
          <div className="mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
              isDark 
                ? "bg-gray-800 border border-emerald-600/30" 
                : "bg-white border border-emerald-200"
            } shadow-sm`}>
              <span className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                Total Records - 
              </span>
              <span className={`ml-1 text-sm font-bold ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}>
                {referrals.length}
              </span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div
          className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
              : "bg-white border-emerald-300 shadow-emerald-500/10"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-max" style={{ minWidth: "900px" }}>
              <thead
                className={`border-b-2 ${
                  isDark
                    ? "bg-gray-900 border-emerald-600/50"
                    : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
                }`}
              >
                <tr>
                  <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "60px" }}>
                    SN
                  </th>
                  <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "180px" }}>
                    Refer By
                  </th>
                  <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "150px" }}>
                    Reference Name
                  </th>
                  <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "200px" }}>
                    Reference Email
                  </th>
                  <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "150px" }}>
                    Reference Mobile
                  </th>
                  <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "120px" }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y-2 ${isDark ? "divide-emerald-600/30" : "divide-emerald-200"}`}>
                {paginatedData.length > 0 ? (
                  paginatedData.map((referral, index) => (
                    <ReferFriendsTableRow
                      key={referral.id}
                      referral={referral}
                      index={index}
                      startIndex={startIndex}
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
                        <p className="text-lg font-medium">No referrals found</p>
                        <p className="text-sm">No referral data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {referrals.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={referrals.length}
              itemsPerPage={itemsPerPage}
              isDark={isDark}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferFriends;