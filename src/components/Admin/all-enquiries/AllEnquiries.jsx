"use client";
import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import EnquiriesTable from "./EnquiriesTable";
import { useRouter } from "next/navigation";
import { exportToExcel } from "@/components/utils/exportutil";

// Main All Enquiries Component
const AllEnquiries = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  

  
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
      grossSalary: "80000", // Added gross salary
      netSalary: "65000",   // Added net salary
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
      eligibility: "Eligible",
      organizationName: "ATD"
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
      grossSalary: "120000", // Added gross salary
      netSalary: "95000",    // Added net salary
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
      'Gross Salary': enquiry.grossSalary,
      'Net Salary': enquiry.netSalary,
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

  const handleLoanEligibilityClick = (enquiry) => {
    // Store the enquiry data in localStorage before navigation
    localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
    router.push(`/crm/all-enquiries/${enquiry.id}/loan-eligibility`);
  };

  const handleVerifyClick = (enquiry) => {
    // Store the enquiry data in localStorage before navigation
    localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
    router.push(`/crm/all-enquiries/${enquiry.id}/application-form`);
  };

  const handleCheckClick = (enquiry) => {
    // Store the enquiry data in localStorage before navigation
    localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
    router.push(`/crm/all-enquiries/${enquiry.id}/appraisal-report`);
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
          onLoanEligibilityClick={handleLoanEligibilityClick}
          onVerifyClick={handleVerifyClick}
          onCheckClick = {handleCheckClick}
        />
      </div>
    </div>
  );
};

export default AllEnquiries;