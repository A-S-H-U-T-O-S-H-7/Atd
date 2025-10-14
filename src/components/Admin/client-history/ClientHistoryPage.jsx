"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import AdvancedSearchBar from "../AdvanceSearchBar";
import ClientHistoryTable from "./ClientHistoryTable";
import ClientViewModal from "./ClientViewModal";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";

const ClientHistoryPage = () => {
const { theme } = useThemeStore();
 const isDark = theme === "dark";
   const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Sample client history data
  const [clientHistoryData, setClientHistoryData] = useState([
    {
      id: 3284,
      sn: 1,
      name: "Anuj Pratap Singh",
      loanNo: "ATDAM36428",
      fatherName: "Narendra Pratap Singh",
      crnNo: "A25DI906",
      accountId: "ATDFSLA25DI906Jul2025",
      phone: "9540047906",
      email: "anuj.niet2010@gmail.com",
      date: "2025-07-10"
    },
    {
      id: 3283,
      sn: 2,
      name: "Sarfaraj Hossain",
      loanNo: "ATDAM36417",
      fatherName: "Sajjad Hossain",
      crnNo: "S30AN841",
      accountId: "ATDFSLS30AN841",
      phone: "8910713841",
      email: "sarfarajhossain94@gmail.com",
      date: "2025-07-09"
    },
    {
      id: 3282,
      sn: 3,
      name: "Arun Patidar",
      loanNo: "ATDAM36399",
      fatherName: "Ganesh patidar",
      crnNo: "A17CY565",
      accountId: "ATDFSLA17CY565",
      phone: "9826911565",
      email: "patidararun29@gmail.com",
      date: "2025-07-08"
    },
    {
      id: 3281,
      sn: 4,
      name: "Vijay Nag H",
      loanNo: "ATDAM36390",
      fatherName: "Hamsaraju",
      crnNo: "V27AY971",
      accountId: "ATDFSLV27AY971",
      phone: "7483028971",
      email: "vijayviju502@gmail.com",
      date: "2025-07-07"
    },
    {
      id: 3280,
      sn: 5,
      name: "Jithin K H",
      loanNo: "ATDAM36378",
      fatherName: "Harikumar",
      crnNo: "J8AM306",
      accountId: "ATDFSLJ8AM306",
      phone: "9544409341",
      email: "jithinndr@gmail.com",
      date: "2025-07-06"
    },
    {
      id: 3279,
      sn: 6,
      name: "Amey Chandrakant Sakpal",
      loanNo: "ATDAM36340",
      fatherName: "Chandrakant Shankar Sakpal",
      crnNo: "A14CC430",
      accountId: "ATDFSLA14CC430",
      phone: "9702251430",
      email: "amey88@gmail.com",
      date: "2025-07-05"
    },
    {
      id: 3278,
      sn: 7,
      name: "Matam Ravisankar",
      loanNo: "ATDAM36329",
      fatherName: "Matam Maheswaraiah",
      crnNo: "M30EL042",
      accountId: "ATDFSLM30EL042",
      phone: "8919193042",
      email: "smartravi207@gmail.com",
      date: "2025-07-04"
    }
  ]);

  const handleViewClick = (client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedClient(null);
  };

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'phone', label: 'Phone' },
    { value: 'crnNo', label: 'CRN No' },
    { value: 'loanNo', label: 'Loan No' },
    { value: 'email', label: 'Email' }
  ];

  const itemsPerPage = 10;

  const filteredClientData = clientHistoryData.filter(item => {
    // Advanced search filter
    if (!advancedSearch.field || !advancedSearch.term) return true;
    
    const fieldValue = item[advancedSearch.field]?.toString().toLowerCase() || '';
    return fieldValue.includes(advancedSearch.term.toLowerCase());
  });

  const totalPages = Math.ceil(filteredClientData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClientData = filteredClientData.slice(startIndex, startIndex + itemsPerPage);

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

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
              onClick={()=>router.back()}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
              }`}>
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <div className="flex items-center space-x-3">
                <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>
                  Client History
                </h1>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <AdvancedSearchBar
                searchOptions={searchOptions}
                onSearch={handleAdvancedSearch}
                placeholder="Search clients..."
                defaultSearchField="name"
              />
            </div>
          </div>

          {/* Total Records */}
          <div className="mb-4">
            <p className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Total Records: {filteredClientData.length}
            </p>
          </div>
        </div>

        {/* Table */}
        <ClientHistoryTable
          paginatedClientData={paginatedClientData}
          filteredClientData={filteredClientData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onViewClick={handleViewClick}
        />
      </div>
      <ClientViewModal/>

      {/* View Modal */}
      <ClientViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
        clientData={selectedClient}
        isDark={isDark}
      />
    </div>
  );
};

export default ClientHistoryPage;