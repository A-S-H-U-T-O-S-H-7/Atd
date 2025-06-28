"use client";
import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import EnquiriesTable from "./EnquiriesTable";
import { exportToExcel } from "@/components/utils/exportutil";
import LoanEligibility from "./LoanEligibility";

// Main All Enquiries Component
const AllEnquiries = () => {
  const { isDark } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showLoanEligibility, setShowLoanEligibility] = useState(false);
  const [selectedEnquiryForEligibility, setSelectedEnquiryForEligibility] = useState(null);

  
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      srNo: 1,
      enquirySource: "Website",
      crnNo: "CRN001234",
      accountId: "ACC001",
      enquiryDate: "2024-06-20",
      enquiryTime: "10:30 AM",
      name: "RAJESH KUMAR SHARMA",
      firstName: "RAJESH",
      lastName: "SHARMA",
      currentAddress: "123 MG Road, Bangalore",
      currentState: "Karnataka",
      currentCity: "Bangalore",
      address: "456 Park Street, Delhi",
      state: "Delhi",
      city: "New Delhi",
      phoneNo: "9876543210",
      email: "rajesh.sharma@gmail.com",
      appliedLoan: "4000",
      loanAmount: "5,00,000",
      roi: "12.5%",
      tenure: "24 months",
      loanTerm: "Short Term",
      hasPhoto: true,
      hasPanCard: true,
      hasAddressProof: true,
      hasIdProof: true,
      hasSalaryProof: false,
      hasBankStatement: true,
      hasBankVerificationReport: true,
      hasSocialScoreReport: false,
      hasCibilScoreReport: true,
      approvalNote: "Pending verification",
      status: "Pending",
      hasAppraisalReport: false,
      eligibility: "Eligible"
    },
    {
      id: 2,
      srNo: 2,
      enquirySource: "Mobile App",
      crnNo: "CRN001235",
      accountId: "ACC002",
      enquiryDate: "2024-06-21",
      enquiryTime: "02:15 PM",
      name: "PRIYA SINGH PATEL",
      firstName: "PRIYA",
      lastName: "PATEL",
      currentAddress: "789 Brigade Road, Bangalore",
      currentState: "Karnataka",
      currentCity: "Bangalore",
      address: "321 Sector 15, Noida",
      state: "Uttar Pradesh",
      city: "Noida",
      phoneNo: "9765432109",
      email: "priya.patel@gmail.com",
      appliedLoan: "10000",
      loanAmount: "25,00,000",
      roi: "8.75%",
      tenure: "240 months",
      loanTerm: "Long Term",
      hasPhoto: true,
      hasPanCard: true,
      hasAddressProof: true,
      hasIdProof: true,
      hasSalaryProof: true,
      hasBankStatement: true,
      hasBankVerificationReport: true,
      hasSocialScoreReport: true,
      hasCibilScoreReport: true,
      approvalNote: "Documents verified",
      status: "Approved",
      hasAppraisalReport: true,
      eligibility: "Eligible"
    },
    {
      id: 3,
      srNo: 3,
      enquirySource: "Branch Visit",
      crnNo: "CRN001236",
      accountId: "ACC003",
      enquiryDate: "2024-06-22",
      enquiryTime: "11:45 AM",
      name: "AMIT VERMA GUPTA",
      firstName: "AMIT",
      lastName: "GUPTA",
      currentAddress: "456 Commercial Street, Mumbai",
      currentState: "Maharashtra",
      currentCity: "Mumbai",
      address: "789 Linking Road, Bandra",
      state: "Maharashtra",
      city: "Mumbai",
      phoneNo: "9654321098",
      email: "amit.gupta@gmail.com",
      appliedLoan: "11000",
      loanAmount: "10,00,000",
      roi: "14.25%",
      tenure: "60 months",
      loanTerm: "Medium Term",
      hasPhoto: false,
      hasPanCard: true,
      hasAddressProof: false,
      hasIdProof: true,
      hasSalaryProof: false,
      hasBankStatement: false,
      hasBankVerificationReport: false,
      hasSocialScoreReport: false,
      hasCibilScoreReport: false,
      approvalNote: "Incomplete documents",
      status: "Rejected",
      hasAppraisalReport: false,
      eligibility: "Not Eligible"
    },
    {
      id: 4,
      srNo: 4,
      enquirySource: "Phone Call",
      crnNo: "CRN001237",
      accountId: "ACC004",
      enquiryDate: "2024-06-23",
      enquiryTime: "09:30 AM",
      name: "SUNITA DEVI YADAV",
      firstName: "SUNITA",
      lastName: "YADAV",
      currentAddress: "321 Anna Salai, Chennai",
      currentState: "Tamil Nadu",
      currentCity: "Chennai",
      address: "654 T Nagar, Chennai",
      state: "Tamil Nadu",
      city: "Chennai",
      phoneNo: "9543210987",
      email: "sunita.yadav@gmail.com",
      appliedLoan: "5000",
      loanAmount: "8,00,000",
      roi: "9.5%",
      tenure: "84 months",
      loanTerm: "Long Term",
      hasPhoto: true,
      hasPanCard: true,
      hasAddressProof: true,
      hasIdProof: true,
      hasSalaryProof: true,
      hasBankStatement: true,
      hasBankVerificationReport: false,
      hasSocialScoreReport: true,
      hasCibilScoreReport: true,
      approvalNote: "Under review",
      status: "Pending",
      hasAppraisalReport: true,
      eligibility: "Eligible"
    },
    {
      id: 5,
      srNo: 5,
      enquirySource: "Website",
      crnNo: "CRN001238",
      accountId: "ACC005",
      enquiryDate: "2024-06-24",
      enquiryTime: "03:20 PM",
      name: "DEEPAK KUMAR SINGH",
      firstName: "DEEPAK",
      lastName: "SINGH",
      currentAddress: "987 Park Street, Kolkata",
      currentState: "West Bengal",
      currentCity: "Kolkata",
      address: "123 Salt Lake, Kolkata",
      state: "West Bengal",
      city: "Kolkata",
      phoneNo: "9432109876",
      email: "deepak.singh@gmail.com",
      appliedLoan: "8000",
      loanAmount: "15,00,000",
      roi: "7.25%",
      tenure: "120 months",
      loanTerm: "Long Term",
      hasPhoto: true,
      hasPanCard: true,
      hasAddressProof: true,
      hasIdProof: true,
      hasSalaryProof: true,
      hasBankStatement: true,
      hasBankVerificationReport: true,
      hasSocialScoreReport: true,
      hasCibilScoreReport: true,
      approvalNote: "Approved with conditions",
      status: "Approved",
      hasAppraisalReport: true,
      eligibility: "Eligible"
    },
    {
      id: 6,
      srNo: 6,
      enquirySource: "Mobile App",
      crnNo: "CRN001239",
      accountId: "ACC006",
      enquiryDate: "2024-06-25",
      enquiryTime: "01:10 PM",
      name: "KAVITA SHARMA MEHTA",
      firstName: "KAVITA",
      lastName: "MEHTA",
      currentAddress: "555 Residency Road, Pune",
      currentState: "Maharashtra",
      currentCity: "Pune",
      address: "777 Koregaon Park, Pune",
      state: "Maharashtra",
      city: "Pune",
      phoneNo: "9321098765",
      email: "kavita.mehta@gmail.com",
      appliedLoan: "15,000",
      loanAmount: "3,00,000",
      roi: "11.75%",
      tenure: "12 months",
      loanTerm: "Short Term",
      hasPhoto: false,
      hasPanCard: true,
      hasAddressProof: true,
      hasIdProof: false,
      hasSalaryProof: false,
      hasBankStatement: true,
      hasBankVerificationReport: false,
      hasSocialScoreReport: false,
      hasCibilScoreReport: true,
      approvalNote: "Photo and ID proof required",
      status: "Pending",
      hasAppraisalReport: false,
      eligibility: "Eligible"
    }
  ]);

  const itemsPerPage = 10;

  const handleUploadClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsUploadModalOpen(true);
  };

  const handleDetailClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDetailModalOpen(true);
  };

  const handleFileView = (enquiry, docType) => {
    // Mock file viewing - replace with actual file URL
    const fileUrl = `https://example.com/documents/${enquiry.id}/${docType}`;
    window.open(fileUrl, '_blank');
  };

  
  
 

  const handleExport = (type) => {
    const exportData = filteredEnquiries.map(enquiry => ({
      'SR No': enquiry.srNo,
      'Enquiry Source': enquiry.enquirySource,
      'CRN No': enquiry.crnNo,
      'Account ID': enquiry.accountId,
      'Enquiry Date': enquiry.enquiryDate,
      'Enquiry Time': enquiry.enquiryTime,
      'Name': enquiry.name,
      'First Name': enquiry.firstName,
      'Last Name': enquiry.lastName,
      'Current Address': enquiry.currentAddress,
      'Current State': enquiry.currentState,
      'Current City': enquiry.currentCity,
      'Address': enquiry.address,
      'State': enquiry.state,
      'City': enquiry.city,
      'Phone No': enquiry.phoneNo,
      'Email': enquiry.email,
      'Applied Loan': enquiry.appliedLoan,
      'Loan Amount': enquiry.loanAmount,
      'ROI': enquiry.roi,
      'Tenure': enquiry.tenure,
      'Loan Term': enquiry.loanTerm,
      'Approval Note': enquiry.approvalNote,
      'Status': enquiry.status,
      'Eligibility': enquiry.eligibility
    }));

    if (type === 'excel') {
      exportToExcel(exportData, 'enquiries');
    } else if (type === 'pdf') {
      exportToPDF(exportData, 'Enquiries Report');
    }
  };

  // Filter enquiries
  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.crnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phoneNo.includes(searchTerm) ||
      enquiry.enquirySource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.appliedLoan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.currentCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.currentState.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || enquiry.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
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
                All Enquiries
              </h1>
            </div>
            
            {/* Export Buttons */}
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

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by name, CRN, email, phone, loan type, city, state..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Follow Up</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <EnquiriesTable
          paginatedEnquiries={paginatedEnquiries}
          filteredEnquiries={filteredEnquiries}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onUploadClick={handleUploadClick}
          onDetailClick={handleDetailClick}
          onFileView={handleFileView}
        />
      </div>
    </div>
  );
};

export default AllEnquiries;