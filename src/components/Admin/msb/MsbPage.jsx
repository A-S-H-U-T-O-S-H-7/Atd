"use client";
import React, { useState } from "react";
import {  ArrowLeft, Download, User, } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import Pagination from "../Pagination";
import AccountTableRow from "./MsbTableRaw";
import DateFilter from "../DateFilter";
import { exportToExcel } from "@/components/utils/exportutil";

const CreateMSBAccountAccount = () => {

     // Mock data for demonstration
const mockAccountData = [
    {
      id: 318471,
      enquirySource: "New Android",
      crnNo: "",
      accountId: "",
      enquiryDate: "18-06-2025",
      enquiryTime: "07:30:00 PM",
      name: "Sanjay Sharma",
      address: "",
      state: "Punjab",
      city: "Jalandhar",
      phoneNo: "9876543210",
      email: "sanjay@example.com"
    },
    {
      id: 318470,
      enquirySource: "New Android",
      crnNo: "A12CH284",
      accountId: "ATDFSLA12CH284Jun2025",
      enquiryDate: "18-06-2025",
      enquiryTime: "07:26:42 PM",
      name: "Ajith Kumar",
      address: "Ravi Krishna arts Sree kurumbakavu tattamangalam",
      state: "Kerala",
      city: "Palakkad",
      phoneNo: "9123456789",
      email: "ajith@example.com"
    },
    {
      id: 318469,
      enquirySource: "New Android",
      crnNo: "R31HD229",
      accountId: "ATDFSLR31HD229Jun2025",
      enquiryDate: "18-06-2025",
      enquiryTime: "07:24:54 PM",
      name: "Raju Kumar",
      address: "Balidhi bokaro Kurmidhi bazar",
      state: "Jharkhand",
      city: "Bokaro",
      phoneNo: "8765432109",
      email: "raju@example.com"
    },
    {
      id: 318468,
      enquirySource: "New Android",
      crnNo: "M25NK156",
      accountId: "ATDFSLM25NK156Jun2025",
      enquiryDate: "18-06-2025",
      enquiryTime: "07:19:43 PM",
      name: "Manjunath Kumar",
      address: "Andaman Street, Nicobar",
      state: "Andaman",
      city: "Nicobar",
      phoneNo: "7654321098",
      email: "manjunath@example.com"
    },
    {
      id: 318467,
      enquirySource: "Web Portal",
      crnNo: "S18PK445",
      accountId: "ATDFSLS18PK445Jun2025",
      enquiryDate: "18-06-2025",
      enquiryTime: "07:15:20 PM",
      name: "Sunita Patel",
      address: "MG Road, Commercial Complex",
      state: "Gujarat",
      city: "Ahmedabad",
      phoneNo: "6543210987",
      email: "sunita@example.com"
    }
  ];
  
     const { isDark } = useAdminAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(mockAccountData);
    const [accounts, setAccounts] = useState(mockAccountData);

   
    const itemsPerPage = 10;
  
    const handleFilterChange = (filters) => {
      let filtered = accounts;
  
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(account =>
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.crnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.phoneNo.includes(searchTerm)
        );
      }
  
      // Apply source filter
      if (filters.source !== "all") {
        filtered = filtered.filter(account => account.enquirySource === filters.source);
      }
  
      // Apply date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        filtered = filtered.filter(account => {
          const accountDate = new Date(account.enquiryDate.split('-').reverse().join('-'));
          const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
          const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
  
          if (startDate && endDate) {
            return accountDate >= startDate && accountDate <= endDate;
          } else if (startDate) {
            return accountDate >= startDate;
          } else if (endDate) {
            return accountDate <= endDate;
          }
          return true;
        });
      }
  
      setFilteredData(filtered);
      setCurrentPage(1);
    };
  
    const handleSearchChange = (term) => {
      setSearchTerm(term);
      handleFilterChange({ dateRange: { start: "", end: "" }, source: "all" });
    };
  
    const handleExport = () => {
      const exportData = [
        ['SN', 'Enquiry Source', 'CRN No.', 'Account ID', 'Enquiry Date', 'Enquiry Time', 'Name', 'Address', 'State', 'City', 'Phone No.', 'Email'],
        ...filteredData.map((account, index) => [
          index + 1,
          account.enquirySource,
          account.crnNo || '',
          account.accountId || '',
          account.enquiryDate,
          account.enquiryTime,
          account.name,
          account.address || '',
          account.state,
          account.city,
          account.phoneNo,
          account.email
        ])
      ];
      
      exportToExcel(exportData, 'msb_accounts_enquiry.csv');
    };
  
    const handleCreateAccount = (account) => {
      alert(`Creating MSB Account for: ${account.name}`);
      // Implement account creation logic here
    };
  
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-emerald-50/10"}`}>
        <div className="p-0 md:p-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-6 items-center justify-between mb-10">
              <div className="flex  items-center space-x-4">
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
                  Create MSB Account
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleExport}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:scale-105 ${
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
  
            {/* Date Filter */}
            <DateFilter isDark={isDark} onFilterChange={handleFilterChange} />
  
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder="Search by name, CRN, account ID, email, or phone..."
                isDark={isDark}
              />
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
              <table className="w-full min-w-max" style={{ minWidth: "1400px" }}>
                <thead
                  className={`border-b-2 ${
                    isDark
                      ? "bg-gray-900  border-emerald-600/50"
                      : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
                  }`}
                >
                  <tr>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "60px" }}>
                      SN
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "150px" }}>
                      Action
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "170px" }}>
                      Enquiry Source
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "120px" }}>
                      CRN No.
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "200px" }}>
                      Account ID
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "170px" }}>
                      Enquiry Date
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "150px" }}>
                      Enquiry Time
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "150px" }}>
                      Name
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "200px" }}>
                      Address
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "100px" }}>
                      State
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "100px" }}>
                      City
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "130px" }}>
                      Phone No.
                    </th>
                    <th className={`px-6 py-5 text-left text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`} style={{ minWidth: "240px" }}>
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y-2 ${isDark ? "divide-emerald-600/30" : "divide-emerald-200"}`}>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((account, index) => (
                      <AccountTableRow
                        key={account.id}
                        account={account}
                        index={index}
                        startIndex={startIndex}
                        isDark={isDark}
                        onCreateAccount={handleCreateAccount}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className={`px-6 py-12 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <div className="flex flex-col items-center space-y-3">
                          <div className={`p-4 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                            <User className={`w-8 h-8 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                          </div>
                          <p className="text-lg font-medium">No accounts found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
  
            {/* Pagination */}
            {filteredData.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                isDark={isDark}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  export default CreateMSBAccountAccount;