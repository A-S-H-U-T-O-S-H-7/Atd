"use client";
import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import SearchBar from "../SearchBar";
import ComplaintTable from "./ComplaintTable";
import ComplaintDetailModal from "./ComplaintDetails";
import UploadModal from "./UploadModal";
import { exportToExcel } from "@/components/utils/exportutil";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";

// Main Complaint Management Component
const ComplaintPage = () => {
const { theme } = useThemeStore();
 const isDark = theme === "dark";
   const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const router = useRouter()
  
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      srNo: 1,
      complaintDate: "20-06-2025",
      name: "DHANANJANEYA NAIDU YARAMALANAYUNI",
      mobileNo: "9986959379",
      email: "dhanayaramala@gmail.com",
      loanNo: "ATDAM33604",
      loanBelongTo: "Atmoney/",
      status: "Close",
      complaintDetails: "I sincerely apologize for the delay in repaying my loan. The delay happened due to a serious health emergency with my mother. I expect to receive my salary by the end of this month. I am also trying to arrange funds through other sources. However, I am committed to clearing this loan at the earliest.",
      complaintFor: "Other",
      assignedTo: "Kisan Sahoo",
      complaintAssignDate: "20/06/2025",
      complaintResolution: "Dear Sir, Greetings from ATD Money!! We received your mail for the allegation to our employee however we denied the allegation as mentioned by you in trail mail. This is to inform you that we never harass or threaten our customers. We do only follow up calls to our customers.You can take action if you are getting such types of calls. Also please send us if you have any recordings so that we will take appropriate action. As per our bank we can extend your EMI for next month if you pay some amount as discussed.",
      complaintCloseDate: "20/06/2025",
      finalRemarks: "",
      hasComplaintDocs: true,
      hasResolutionDocs: true,
      phone: "9986959379",
      date: "20-06-2025"
    },
    {
      id: 2,
      srNo: 2,
      complaintDate: "18-06-2025",
      name: "RAJESH KUMAR SHARMA",
      mobileNo: "9876543210",
      email: "rajesh.sharma@gmail.com",
      loanNo: "ATDAM33605",
      loanBelongTo: "Atmoney/",
      status: "Open",
      complaintDetails: "The interest rate charged is higher than what was initially discussed. I was told it would be 12% per annum but I'm being charged 18%. This is misleading and I request immediate correction of the interest rate as per the initial agreement.",
      complaintFor: "Interest Rate Issue",
      assignedTo: "Priya Singh",
      complaintAssignDate: "18/06/2025",
      complaintResolution: "",
      complaintCloseDate: "",
      finalRemarks: "",
      hasComplaintDocs: false,
      hasResolutionDocs: false,
      phone: "9876543210",
      date: "18-06-2025"
    },
    {
      id: 3,
      srNo: 3,
      complaintDate: "15-06-2025",
      name: "SUNITA DEVI PATEL",
      mobileNo: "8765432109",
      email: "sunita.patel@gmail.com",
      loanNo: "ATDAM33606",
      loanBelongTo: "Atmoney/",
      status: "Open",
      complaintDetails: "I have been receiving harassment calls from your collection team at odd hours including late night and early morning. This is causing distress to my family. Please ensure your team follows proper collection practices and calls only during appropriate hours.",
      complaintFor: "Collection Harassment",
      assignedTo: "Amit Verma",
      complaintAssignDate: "15/06/2025",
      complaintResolution: "",
      complaintCloseDate: "",
      finalRemarks: "",
      hasComplaintDocs: true,
      hasResolutionDocs: false,
      phone: "8765432109",
      date: "15-06-2025"
    },
    
  ]);

  const itemsPerPage = 10;

  const handleUploadClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsUploadModalOpen(true);
  };

  const handleDetailClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModalOpen(true);
  };

  const handleFileView = (complaint, docType) => {
    // Mock file viewing - replace with actual file URL
    const fileUrl = `https://example.com/documents/${complaint.id}/${docType}`;
    window.open(fileUrl, '_blank');
  };

  const handleUpload = (complaintId, file, docType) => {
    // Handle file upload logic here
    console.log('Uploading file:', file, 'for complaint:', complaintId, 'type:', docType);
  };

  const handleComplaintUpdate = (complaintId, updateData) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintId
          ? { ...complaint, ...updateData }
          : complaint
      )
    );
  };

  const handleExport = (type) => {
    const exportData = filteredComplaints.map(complaint => ({
      'SR No': complaint.srNo,
      'Complaint Date': complaint.complaintDate,
      'Name': complaint.name,
      'Mobile No': complaint.mobileNo,
      'Email': complaint.email,
      'Loan No': complaint.loanNo,
      'Status': complaint.status,
      'Complaint Details': complaint.complaintDetails,
      'Assigned To': complaint.assignedTo,
      'Resolution': complaint.complaintResolution
    }));

    if (type === 'excel') {
      exportToExcel(exportData, 'complaints');
    } else if (type === 'pdf') {
      exportToPDF(exportData, 'Complaints Report');
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.loanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complaintDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.mobileNo.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || complaint.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

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
                List Of Complaints
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
                placeholder="Search complaints, names, loan numbers..."
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
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <ComplaintTable
          paginatedComplaints={paginatedComplaints}
          filteredComplaints={filteredComplaints}
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

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        complaint={selectedComplaint}
        onUpload={handleUpload}
        isDark={isDark}
      />

      <ComplaintDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        complaint={selectedComplaint}
        onUpdate={handleComplaintUpdate}
        isDark={isDark}
      />
    </div>
  );
};

export default ComplaintPage;