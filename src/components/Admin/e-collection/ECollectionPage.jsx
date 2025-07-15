"use client";
import React, { useState } from "react";
import { ArrowLeft} from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import ECollectionTable from "./ECollectionTable";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateRangeFilter from "../DateRangeFilter";
import { useRouter } from "next/navigation";

const ECollectionPage = () => {
  const { isDark } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const router = useRouter();

  // Sample E-collection data based on the screenshot
  const [eCollectionData, setECollectionData] = useState([
    {
      id: 1,
      sn: 1,
      collectionDate: "31/05/2025",
      crnNo: "S10CP992",
      loanNo: "ATDAM34574",
      name: "Sachin Kashyap",
      transactionMode: "UPI",
      transactionUTR: "293657641750",
      transactionRemarks: "Payment from PhonePe",
      clientAcNo: "02530500539",
      collectionAmount: 25519,
      payerName: "SACHIN KASHYAP",
      payerAcNo: "92401003283768",
      payerBankIFSC: "UTIB0000007",
      bankTransactionNo: "U25SV2949995",
      status: "Updated"
    },
    {
      id: 2,
      sn: 2,
      collectionDate: "24/05/2025",
      crnNo: "S29BV263",
      loanNo: "ATDAM34269",
      name: "Satyam Kashyap",
      transactionMode: "UPI",
      transactionUTR: "551089839335",
      transactionRemarks: "UPI",
      clientAcNo: "02530500539",
      collectionAmount: 33663,
      payerName: "SATYAM KASHYAP",
      payerAcNo: "107001511211",
      payerBankIFSC: "ICIC0001070",
      bankTransactionNo: "U25SO2788643",
      status: "Updated"
    },
    {
      id: 3,
      sn: 3,
      collectionDate: "09/05/2025",
      crnNo: "R27BA348",
      loanNo: "ATDAM34121",
      name: "Ravindra Kancharla",
      transactionMode: "UPI",
      transactionUTR: "891289391051",
      transactionRemarks: "Payment from PhonePe",
      clientAcNo: "02530500539",
      collectionAmount: 20000,
      payerName: "KANCHARLA RAVINDRA",
      payerAcNo: "448401000031",
      payerBankIFSC: "ICIC0004484",
      bankTransactionNo: "U25592461532",
      status: "Updated"
    },
    {
      id: 4,
      sn: 4,
      collectionDate: "15/05/2025",
      crnNo: "S15BG425",
      loanNo: "ATDAM35641",
      name: "Rajesh Kumar",
      transactionMode: "IMPS",
      transactionUTR: "512345678901",
      transactionRemarks: "Online Payment",
      clientAcNo: "02530500539",
      collectionAmount: 15000,
      payerName: "RAJESH KUMAR",
      payerAcNo: "123456789012",
      payerBankIFSC: "SBIN0001234",
      bankTransactionNo: "M25AB1234567",
      status: "Updated"
    },
    {
      id: 5,
      sn: 5,
      collectionDate: "20/05/2025",
      crnNo: "T20MN567",
      loanNo: "ATDAM34890",
      name: "Priya Sharma",
      transactionMode: "NEFT",
      transactionUTR: "789012345678",
      transactionRemarks: "Bank Transfer",
      clientAcNo: "02530500539",
      collectionAmount: 42000,
      payerName: "PRIYA SHARMA",
      payerAcNo: "987654321098",
      payerBankIFSC: "HDFC0001234",
      bankTransactionNo: "N25CD7890123",
      status: "Updated"
    }
  ]);

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'loanNo', label: 'Loan No' },
    { value: 'crnNo', label: 'CRN No' },
    { value: 'transactionUTR', label: 'Transaction UTR' },
    { value: 'payerName', label: 'Payer Name' },
    { value: 'payerAcNo', label: 'Payer A/C No' },
    { value: 'bankTransactionNo', label: 'Bank Transaction No' }
  ];

  const itemsPerPage = 10;

  const filteredECollectionData = eCollectionData.filter(item => {
    // Advanced search filter
    const matchesAdvancedSearch = (() => {
      if (!advancedSearch.field || !advancedSearch.term) return true;
      const fieldValue = item[advancedSearch.field]?.toString().toLowerCase() || '';
      return fieldValue.includes(advancedSearch.term.toLowerCase());
    })();

    // General search filter
    const matchesSearch = searchTerm === "" || 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Date range filtering
    const matchesDateRange = (() => {
      if (!dateRange.from && !dateRange.to) return true;
      
      const itemDate = new Date(item.collectionDate.split('/').reverse().join('-'));
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

    return matchesAdvancedSearch && matchesSearch && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredECollectionData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedECollectionData = filteredECollectionData.slice(startIndex, startIndex + itemsPerPage);

  // Calculate total amount for filtered data
  const totalAmount = filteredECollectionData.reduce((sum, item) => sum + item.collectionAmount, 0);

  

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
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
              onClick={()=> router.back()}
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
                E-Collection Report
              </h1>
            </div>
            
            
          </div>

          {/* Date Filter */}
          <DateRangeFilter 
            isDark={isDark} 
            onFilterChange={handleFilterChange}
          />

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <AdvancedSearchBar
                searchOptions={searchOptions}
                onSearch={handleAdvancedSearch}
                placeholder="Search e-collection data..."
                defaultSearchField="name"
              />
            </div>

            
          </div>

          {/* Total Amount */}
          <div className="mb-4">
            <p className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Total Amount: ₹{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <ECollectionTable
          paginatedECollectionData={paginatedECollectionData}
          filteredECollectionData={filteredECollectionData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ECollectionPage;