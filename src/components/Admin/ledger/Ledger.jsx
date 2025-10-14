"use client";
import React, { useState } from "react";
import { ArrowLeft, Download, Calendar } from "lucide-react";
import SearchBar from "../SearchBar";
import LedgerTable from "./LedgerTable";
import DateFilter from "../AgentDateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import CallDetailsModal from "../CallDetailsModal";
import CustomerTransactionDetails from "../CustomerTransactionDetails";
import AdjustmentModal from "../AdjustmentModal";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";

const LedgerPage = () => {
  const { theme } = useThemeStore();
 const isDark = theme === "dark";
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dueDateSearch, setDueDateSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransactionData, setSelectedTransactionData] = useState(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
const [selectedApplicantForAdjustment, setSelectedApplicantForAdjustment] = useState(null);
  

  // Sample ledger data - replace with your actual data
  const [ledgerData, setLedgerData] = useState([
    {
      id: 1,
      sn: 1,
      call: "Call",
      loanNo: "ATDAM35807",
      disburseDate: "24-06-2025",
      dueDate: "28-07-2025",
      name: "Abhi Shukla",
      address: "Al Huda Model School, Triveni Nagar-2, VTC: Nirala Nagar, PO: Nirala Nagar",
      phoneNo: "8527547671",
      email: "travelwithabhi999@gmail.com",
      balance: "8188"
    },
    {
      id: 2,
      sn: 2,
      call: "Call",
      loanNo: "ATDAM35805",
      disburseDate: "24-06-2025",
      dueDate: "24-07-2025",
      name: "Manmeet singh Bhogal",
      address: "Mukherjee Park, Tilak Nagar",
      phoneNo: "8800238764",
      email: "miit.manmeet@gmail.com",
      balance: "28582"
    },
    {
      id: 3,
      sn: 3,
      call: "Call",
      loanNo: "ATDAM35803",
      disburseDate: "23-06-2025",
      dueDate: "25-07-2025",
      name: "Rajesh Kumar Sharma",
      address: "Defence Colony, New Delhi",
      phoneNo: "9876543210",
      email: "rajesh.sharma@gmail.com",
      balance: "15000"
    },
    {
      id: 4,
      sn: 4,
      call: "Call",
      loanNo: "ATDAM35801",
      disburseDate: "22-06-2025",
      dueDate: "26-07-2025",
      name: "Priya Singh",
      address: "Sector 15, Noida",
      phoneNo: "9988776655",
      email: "priya.singh@gmail.com",
      balance: "12500"
    },
    {
      id: 5,
      sn: 5,
      call: "Call",
      loanNo: "ATDAM35799",
      disburseDate: "21-06-2025",
      dueDate: "27-07-2025",
      name: "Amit Verma",
      address: "Lajpat Nagar, Delhi",
      phoneNo: "9123456789",
      email: "amit.verma@gmail.com",
      balance: "20000"
    }
  ]);

  // Sample agents - replace with your actual agent data
  const agents = [
    { id: "all", name: "All Agents" },
    { id: "agent1", name: "Agent 1" },
    { id: "agent2", name: "Agent 2" },
    { id: "agent3", name: "Agent 3" }
  ];

  const itemsPerPage = 10;

  // Filter ledger data
  const filteredLedgerData = ledgerData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNo.includes(searchTerm) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDueDate = dueDateSearch === "" || item.dueDate.includes(dueDateSearch);
    
    const matchesAgent = selectedAgent === "all"; // Add your agent filtering logic here

    // Date range filtering
    const matchesDateRange = (() => {
      if (!dateRange.from && !dateRange.to) return true;
      
      const itemDate = new Date(item.disburseDate.split('-').reverse().join('-'));
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      
      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      return true;
    })();

    return matchesSearch && matchesDueDate && matchesAgent && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredLedgerData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLedgerData = filteredLedgerData.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = (type) => {
    const exportData = filteredLedgerData.map(item => ({
      'SN': item.sn,
      'Call': item.call,
      'Loan No.': item.loanNo,
      'Disburse Date': item.disburseDate,
      'Due Date': item.dueDate,
      'Name': item.name,
      'Address': item.address,
      'Phone No.': item.phoneNo,
      'Email': item.email,
      'Balance': item.balance
    }));

    if (type === 'excel') {
      exportToExcel(exportData, 'ledger-data');
    }
  };

  const handleCall = (applicant) => {
  setSelectedApplicant(applicant);
  setShowCallModal(true);
};

const handleViewTransaction = (item) => { 
  setSelectedTransactionData(item); 
  setShowTransactionModal(true); 
}

const handleBalanceUpdate = (updateData) => {
    // Handle balance update logic
    console.log('Balance updated:', updateData);
  };

  const handleAdjustmentClick = (applicant) => {
  setSelectedApplicantForAdjustment(applicant);
  setShowAdjustmentModal(true);
};

const handleAdjustmentSubmit = (adjustmentData) => {
  console.log("Adjustment submitted:", adjustmentData);
  setShowAdjustmentModal(false);
  setSelectedApplicantForAdjustment(null);
};

  const handleSearch = () => {
    setCurrentPage(1); 
  };

  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
    setSelectedAgent(filters.selectedAgent);
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
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Ledger
              </h1>
            </div>
            
            {/* Export Button */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('excel')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div> 
          </div>

          {/* Date and Agent Filter */}
          <DateFilter
            dateRange={dateRange}
            selectedAgent={selectedAgent}
            agents={agents}
            isDark={isDark}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by name, loan number, email, phone..."
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  value={dueDateSearch}
                  onChange={(e) => setDueDateSearch(e.target.value)}
                  placeholder="Search by due date (DD-MM-YYYY)"
                  className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 font-medium ${
                    isDark
                      ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
                <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <LedgerTable
          paginatedLedgerData={paginatedLedgerData}
          filteredLedgerData={filteredLedgerData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
        onCall={handleCall} 
        onViewTransaction={handleViewTransaction} 
        onAdjustment={handleAdjustmentClick} 
 
        />
      </div> 

      <AdjustmentModal
  isOpen={showAdjustmentModal}
  onClose={() => {
    setShowAdjustmentModal(false);
    setSelectedApplicantForAdjustment(null);
  }}
  applicant={selectedApplicantForAdjustment}
  isDark={isDark}
  onSubmit={handleAdjustmentSubmit}
/>

      <CallDetailsModal 
      isOpen={showCallModal} 
      onClose={() => {
          setShowCallModal(false);
          setSelectedApplicant(null);
        }} data={selectedApplicant} isDark={isDark}  />

        <CustomerTransactionDetails
  isOpen={showTransactionModal}
  onClose={() => setShowTransactionModal(false)}
  data={selectedTransactionData}
  isDark={isDark}
  onUpdateBalance={handleBalanceUpdate}
/>

    </div>
  );
};

export default LedgerPage;