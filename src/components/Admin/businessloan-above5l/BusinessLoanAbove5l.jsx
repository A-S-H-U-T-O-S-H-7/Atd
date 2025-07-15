"use client";
import React, { useState } from "react";
import { ArrowLeft, Download, Calendar, FileText, Building2 } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import DateRangeFilter from "../DateRangeFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import AdvancedSearchBar from "../AdvanceSearchBar";
import BusinessLoan5l1crTable from "./BusinessLoanAbove5lTable";
import BusinessCallModal from "../businessloan-upto5l/BusinessCallModal";
import { useRouter } from "next/navigation";

const BusinessLoanEnquiry5l1crPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Sample business loan enquiry data (5l-1cr)
  const [businessLoan5l1crData, setBusinessLoan5l1crData] = useState([
    {
      id: 86,
      sn: 1,
      action: "Follow Up",
      history: "",
      city: "Kolkata",
      businessType: "Retailer",
      creditAmount: "5-10 Lacs",
      industryMargin: "25%",
      chequeBounce: "Less than or equal to 2",
      itr: "Yes",
      emiLiability: "65000",
      name: "Ratna naskar",
      dob: "25/10/1978",
      gender: "Female",
      panNo: "BKDPN3903R",
      aadharNo: "742867982212",
      mobile: "9330045031",
      residentialOwnership: "Owned",
      residentialAddress: "House No-n0003,Street No-Vil Ikadarat post r k pally PS Sonarpur,Locality-150 Sonarpur",
      residentialState: "WEST BENGAL",
      residentialCity: "Kolkata",
      residentialPincode: "700150",
      businessName: "Stationary house",
      businessOwnership: "Owned",
      businessAddress: "House No-n0003,Street No-Vil Ikadarat post r k pally PS Sonarpur,Locality-Sonarpur",
      businessState: "WEST BENGAL",
      businessCity: "Kolkata",
      businessPincode: "700150",
      date: "2020-04-13"
    },
    {
      id: 85,
      sn: 2,
      action: "Follow Up",
      history: "",
      city: "Delhi",
      businessType: "Trader",
      creditAmount: "5-10 Lacs",
      industryMargin: "30%",
      chequeBounce: "Less than or equal to 1",
      itr: "Yes",
      emiLiability: "45000",
      name: "Nishant Bakshi",
      dob: "29/9/1985",
      gender: "Male",
      panNo: "APRPB3730Q",
      aadharNo: "616876845982",
      mobile: "8920761441",
      residentialOwnership: "Owned",
      residentialAddress: "House No-190,Street No-Mayfield Garden,Locality-Sector-50",
      residentialState: "Haryana",
      residentialCity: "Gurgaon",
      residentialPincode: "122018",
      businessName: "NNYB Retail OPC Pvt. Ltd",
      businessOwnership: "Rented",
      businessAddress: "House No-CG-21,Street No-Biotech Arcadia,Locality-South city-2",
      businessState: "Haryana",
      businessCity: "Gurgaon",
      businessPincode: "122001",
      date: "2019-12-17"
    },
    {
      id: 84,
      sn: 3,
      action: "Follow Up",
      history: "",
      city: "Kolkata",
      businessType: "Retailer",
      creditAmount: "5-10 Lacs",
      industryMargin: "28%",
      chequeBounce: "Less than or equal to 3",
      itr: "Yes",
      emiLiability: "55000",
      name: "Avijit Das",
      dob: "23/6/1985",
      gender: "Male",
      panNo: "BGNPD6515M",
      aadharNo: "409649927649",
      mobile: "9051286402",
      residentialOwnership: "Owned",
      residentialAddress: "House No-4/107,Street No-4/107 Jatin Das nagar Belgharia,Locality-Mission road",
      residentialState: "Westbengal",
      residentialCity: "Kolkata",
      residentialPincode: "700056",
      businessName: "Dashbhander",
      businessOwnership: "Owned",
      businessAddress: "House No-4/107,Street No-4/107 Jatin Das nagar Belgharia,Locality-Belgharia",
      businessState: "Westbengal",
      businessCity: "Kolkata",
      businessPincode: "700056",
      date: "2019-12-14"
    },
    {
      id: 83,
      sn: 4,
      action: "Follow Up",
      history: "",
      city: "Ludhiana",
      businessType: "Manufacturing",
      creditAmount: "10-15 Lacs",
      industryMargin: "35%",
      chequeBounce: "Less than or equal to 2",
      itr: "Yes",
      emiLiability: "85000",
      name: "Vansh beta knitwears",
      dob: "15/8/1980",
      gender: "Male",
      panNo: "EGBPK1400F",
      aadharNo: "498508203630",
      mobile: "9877547321",
      residentialOwnership: "Rented",
      residentialAddress: "House No-6838/39,Street No-07,Locality-Circular road",
      residentialState: "Punjab",
      residentialCity: "Ludhiana",
      residentialPincode: "141008",
      businessName: "Vansh beta knitwears",
      businessOwnership: "Rented",
      businessAddress: "House No-B111/145,Street No-Circular road,Locality-Industrial area",
      businessState: "Punjab",
      businessCity: "Ludhiana",
      businessPincode: "141001",
      date: "2019-10-18"
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
    { value: 'businessName', label: 'Business Name' },
    { value: 'city', label: 'City' }
  ];

  const itemsPerPage = 10;

  const filteredBusinessLoan5l1crData = businessLoan5l1crData.filter(item => {
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

  const totalPages = Math.ceil(filteredBusinessLoan5l1crData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinessLoan5l1crData = filteredBusinessLoan5l1crData.slice(startIndex, startIndex + itemsPerPage);

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
    setCurrentPage(1);
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredBusinessLoan5l1crData.map(item => ({
      'SN': item.sn,
      'Date': item.date,
      'Action': item.action,
      'History': item.history,
      'City': item.city,
      'Business Type': item.businessType,
      'Credit Amount': item.creditAmount,
      'Industry Margin': item.industryMargin,
      'Check Bounce': item.chequeBounce,
      'ITR': item.itr,
      'EMI Liability': item.emiLiability,
      'Name': item.name,
      'DOB': item.dob,
      'Gender': item.gender,
      'Pan No': item.panNo,
      'Aadhar No.': item.aadharNo,
      'Mobile': item.mobile,
      'Residential Ownership': item.residentialOwnership,
      'Residential Address': item.residentialAddress,
      'Residential State': item.residentialState,
      'Residential City': item.residentialCity,
      'Residential Pincode': item.residentialPincode,
      'Business Name': item.businessName,
      'Business Ownership': item.businessOwnership,
      'Business Address': item.businessAddress,
      'Business State': item.businessState,
      'Business City': item.businessCity,
      'Business Pincode': item.businessPincode
    }));

    exportToExcel(dataToExport, 'Business_Loan_Enquiry_5l_1cr_Data');
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
                  Business Loan Enquiry
                </h1>
                <h2 className={`text-lg md:text-xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>(between 5l-1cr)</h2>
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
              Total Records: {filteredBusinessLoan5l1crData.length}
            </p>
          </div>
        </div>

        {/* Table */}
        <BusinessLoan5l1crTable
          paginatedBusinessLoan5l1crData={paginatedBusinessLoan5l1crData}
          filteredBusinessLoan5l1crData={filteredBusinessLoan5l1crData}
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

export default BusinessLoanEnquiry5l1crPage;