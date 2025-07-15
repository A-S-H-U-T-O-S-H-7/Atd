"use client";
import React, { useState } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import HelpTicketTable from "./HelpTicketTable";
import AdvancedSearchBar from "../AdvanceSearchBar";
import ReplyModal from "./ReplyModal";
import SummaryModal from "./SummaryModal";
import { useRouter } from "next/navigation";

const HelpTicketPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Sample help ticket data
  const [helpTicketData, setHelpTicketData] = useState([
    {
      id: 1,
      issueDate: "2019-01-19",
      ticketId: "ATD7672",
      subject: "Development of Android and Ios APP",
      message: "hi",
      user: "Manoranjan",
      status: "Closed"
    },
    {
      id: 2,
      issueDate: "2019-02-02",
      ticketId: "ATD4145",
      subject: "Development of Android and Ios APP",
      message: "test",
      user: "Manoranjan",
      status: "Open"
    },
    {
      id: 3,
      issueDate: "2020-12-30",
      ticketId: "ATD4962",
      subject: "hello",
      message: "test",
      user: "Abhishek",
      status: "Open"
    },
    {
      id: 4,
      issueDate: "2021-01-03",
      ticketId: "ATD8616",
      subject: "Reward Point",
      message: "what about reward point",
      user: "Manoranjan",
      status: "Open"
    },
    {
      id: 5,
      issueDate: "2024-06-17",
      ticketId: "ATD5996",
      subject: "Manage Inquiry",
      message: "Why total leads are not showing",
      user: "Kisan",
      status: "Open"
    },
    {
      id: 6,
      issueDate: "2024-07-10",
      ticketId: "ATD7890",
      subject: "Login Issues",
      message: "Unable to login to the system",
      user: "Rahul",
      status: "Open"
    },
    {
      id: 7,
      issueDate: "2024-07-09",
      ticketId: "ATD7891",
      subject: "Payment Gateway",
      message: "Payment not processing correctly",
      user: "Priya",
      status: "Closed"
    },
    {
      id: 8,
      issueDate: "2024-07-08",
      ticketId: "ATD7892",
      subject: "User Interface",
      message: "UI elements not displaying properly",
      user: "Amit",
      status: "Open"
    }
  ]);

  const searchOptions = [
    { value: 'ticketId', label: 'Ticket ID' },
    { value: 'user', label: 'User Name' }
  ];

  const itemsPerPage = 10;

  const filteredHelpTicketData = helpTicketData.filter(item => {
    // Advanced search filter
    const matchesAdvancedSearch = (() => {
      if (!advancedSearch.field || !advancedSearch.term) return true;
      
      const fieldValue = item[advancedSearch.field]?.toString().toLowerCase() || '';
      return fieldValue.includes(advancedSearch.term.toLowerCase());
    })();
    
    return matchesAdvancedSearch;
  });

  const totalPages = Math.ceil(filteredHelpTicketData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHelpTicketData = filteredHelpTicketData.slice(startIndex, startIndex + itemsPerPage);

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

  const handleReplyClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsReplyModalOpen(true);
  };

  const handleSummaryClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsSummaryModalOpen(true);
  };

  const handleReplySubmit = (replyText) => {
    console.log("Reply submitted:", replyText);
    // Here you would typically send the reply to your backend
    setIsReplyModalOpen(false);
    setSelectedTicket(null);
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
              onClick={() => router.back()} 
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
                  Help Ticket 
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
                placeholder="Search by ticket ID or user name..."
                defaultSearchField="ticketId"
              />
            </div>
          </div>

          {/* Total Records */}
          <div className="mb-4">
            <p className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Total Records: {filteredHelpTicketData.length}
            </p>
          </div>
        </div>

        {/* Table */}
        <HelpTicketTable
          paginatedHelpTicketData={paginatedHelpTicketData}
          filteredHelpTicketData={filteredHelpTicketData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onReplyClick={handleReplyClick}
          onSummaryClick={handleSummaryClick}
        />
      </div>

      {/* Reply Modal */}
      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        ticket={selectedTicket}
        onSubmit={handleReplySubmit}
        isDark={isDark}
      />

      {/* Summary Modal */}
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        ticket={selectedTicket}
        isDark={isDark}
      />
    </div>
  );
};

export default HelpTicketPage;