"use client";
import React, { useState } from "react";
import { ArrowLeft, Download, Calendar, FileText, Building2 } from "lucide-react";
import DateRangeFilter from "../DateRangeFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import AdvancedSearchBar from "../AdvanceSearchBar";
import BusinessLoan5lTable from "./BusinessLoan5lTable";
import BusinessCallModal from "./BusinessCallModal";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";

const BusinessLoanEnquiry5lPage = () => {
const { theme } = useThemeStore();
 const isDark = theme === "dark";
   const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Sample business loan enquiry data - Fixed field names to match table headers
  const [businessLoanData, setBusinessLoanData] = useState([
    {
      id: 76,
      sn: 1,
      action: "Follow Up",
      history: "",
      city: "New Delhi",
      businessType: "Trader",
      creditAmount: "Greater than or equal to 15 Lacs",
      industryMargin: "30%",
      chequeBounce: "Less than or equal to 3", // Fixed: was "chequeBounce"
      itr: "Yes",
      emiLiability: "50000",
      name: "chandrajeet maurya",
      dob: "1/1/1989",
      gender: "Male",
      panNo: "BLSPM8667H",
      aadharNo: "397177557396",
      mobile: "9540119935",
      residentialOwnership: "Owned",
      residentialAddress: "House No-h-901 today homes kings park,Street No-TODAY HOMES KINGS PARK FLAT NO 901 H, SECTOR -OMEGA 1 GRETER NOIDA UP,Locality-SECTOR - OMEGA 1 GRETER NOIDA UP", // Fixed: was "address"
      residentialState: "Uttar Pradesh", // Fixed: was "state"
      residentialCity: "New Delhi", // Added missing field
      residentialPincode: "201308", // Fixed: was "pincode"
      businessName: "sgw engineers",
      businessOwnership: "Owned",
      businessAddress: "House No-www.mitsukimart.com,Street No-TODAY HOMES KINGS PARK FLAT NO 901 H, SECTOR -OMEGA 1 GRETER NOIDA UP,Locality-noida",
      businessState: "Uttar Pradesh",
      businessCity: "Noida",
      businessPincode: "201308",
      date: "2019-12-15"
    },
    {
      id: 75,
      sn: 2,
      action: "Follow Up",
      history: "",
      city: "New Delhi",
      businessType: "Service Provider",
      creditAmount: "Greater than or equal to 10 Lacs",
      industryMargin: "35%",
      chequeBounce: "Less than or equal to 3", // Fixed: was "chequeBounce"
      itr: "Yes",
      emiLiability: "5000",
      name: "Vishal Gautam",
      dob: "1/7/1977",
      gender: "Male",
      panNo: "AHIPG2978E",
      aadharNo: "415337532387",
      mobile: "9560140585",
      residentialOwnership: "Rented",
      residentialAddress: "House No-G 289 a Pratap Vihar,Street No-G 289 A HIG Flats Pratap Vihar,Locality-HIG Flats", // Fixed: was "address"
      residentialState: "Uttar Pradesh", // Fixed: was "state"
      residentialCity: "Ghaziabad", // Added missing field
      residentialPincode: "201009", // Fixed: was "pincode"
      businessName: "Career Ladder",
      businessOwnership: "Rented",
      businessAddress: "House No-F 325 B,Street No-Second,Locality-Pratap Vihar",
      businessState: "Uttar Pradesh",
      businessCity: "Ghaziabad",
      businessPincode: "201009",
      date: "2019-12-14"
    },
    {
      id: 74,
      sn: 3,
      action: "Follow Up",
      history: "",
      city: "Hyderabad",
      businessType: "Manufacturing",
      creditAmount: "Greater than or equal to 25 Lacs",
      industryMargin: "40%",
      chequeBounce: "Less than or equal to 2", // Fixed: was "chequeBounce"
      itr: "Yes",
      emiLiability: "75000",
      name: "Rajesh Kumar",
      dob: "15/3/1985",
      gender: "Male",
      panNo: "BXPK5678M",
      aadharNo: "123456789012",
      mobile: "9876543210",
      residentialOwnership: "Owned",
      residentialAddress: "House No-123 Jubilee Hills,Street No-Road No 36,Locality-Jubilee Hills", // Fixed: was "address"
      residentialState: "Telangana", // Fixed: was "state"
      residentialCity: "Hyderabad", // Added missing field
      residentialPincode: "500033", // Fixed: was "pincode"
      businessName: "Tech Solutions Pvt Ltd",
      businessOwnership: "Owned",
      businessAddress: "Office No-456 Hi-Tech City,Street No-Madhapur,Locality-Hi-Tech City",
      businessState: "Telangana",
      businessCity: "Hyderabad",
      businessPincode: "500081",
      date: "2019-12-13"
    }
  ]);

  const handleFollowUpClick = (customer) => {
  setSelectedCustomer(customer);
  setIsFollowUpModalOpen(true);
};

const handleCloseModal = () => {
  setIsFollowUpModalOpen(false);
  setSelectedCustomer(null);
};

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'panNo', label: 'PAN Number' },
    
  ];

  const itemsPerPage = 10;

  const filteredBusinessLoanData = businessLoanData.filter(item => {
    // Advanced search filter
    const matchesAdvancedSearch = (() => {
      if (!advancedSearch.field || !advancedSearch.term) return true;
      
      const fieldValue = item[advancedSearch.field]?.toString().toLowerCase() || '';
      return fieldValue.includes(advancedSearch.term.toLowerCase());
    })();
    
    // Date range filtering
    const matchesDateRange = (() => {
      if (!dateRange.start && !dateRange.end) return true;
      
      const itemDate = new Date(item.date);
      const fromDate = dateRange.start ? new Date(dateRange.start) : null;
      const toDate = dateRange.end ? new Date(dateRange.end) : null;
      
      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      return true;
    })();

    return matchesAdvancedSearch && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredBusinessLoanData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinessLoanData = filteredBusinessLoanData.slice(startIndex, startIndex + itemsPerPage);

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
    setCurrentPage(1);
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredBusinessLoanData.map(item => ({
      'SN': item.sn,
      'Date': item.date,
      'Action': item.action,
      'History': item.history,
      'City': item.city,
      'Business Type': item.businessType,
      'Credit Amount': item.creditAmount,
      'Industry Margin': item.industryMargin,
      'Check Bounce': item.chequeBounce, // Fixed field name
      'ITR': item.itr,
      'EMI Liability': item.emiLiability,
      'Name': item.name,
      'DOB': item.dob,
      'Gender': item.gender,
      'Pan No': item.panNo,
      'Aadhar No.': item.aadharNo,
      'Mobile': item.mobile,
      'Residential Ownership': item.residentialOwnership,
      'Address': item.residentialAddress, // Fixed field name
      'State': item.residentialState, // Fixed field name
      'City': item.residentialCity, // Fixed field name
      'Pincode': item.residentialPincode, // Fixed field name
      'Business Name': item.businessName,
      'Business Ownership': item.businessOwnership,
      'Business Address': item.businessAddress,
      'Business State': item.businessState,
      'Business City': item.businessCity,
      'Business Pincode': item.businessPincode
    }));

    exportToExcel(dataToExport, 'Business_Loan_Enquiry_Data');
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
              onClick={()=> router.back() }
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
                  Business Loan Enquiry
                </h1>
                <h2 className={`text-lg md:text-xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>(upto 5 lacs)</h2>

              </div>
            </div>
            
            <button
              onClick={handleExportToExcel}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
              } shadow-lg hover:shadow-xl`}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Date Range Filter */}
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
                placeholder="Search business loan enquiries..."
                defaultSearchField="name"
              />
            </div>
          </div>

          {/* Total Records */}
          <div className="mb-4">
            <p className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Total Records: {filteredBusinessLoanData.length}
            </p>
          </div>
        </div>

        {/* Table */}
        <BusinessLoan5lTable
          paginatedBusinessLoan5lData={paginatedBusinessLoanData}
          filteredBusinessLoan5lData={filteredBusinessLoanData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onFollowUpClick={handleFollowUpClick}
        />
      </div>
      <BusinessCallModal
  isOpen={isFollowUpModalOpen}  
  onClose={handleCloseModal}    
  customerData={selectedCustomer}  
  isDark={isDark}
/>
    </div>
  );
};

export default BusinessLoanEnquiry5lPage;