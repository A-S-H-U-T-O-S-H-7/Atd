'use client';
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import SearchBar from "../SearchBar";
import ComplaintTable from "./ComplaintTable";
import ComplaintDetailModal from "./ComplaintDetails";
import UploadModal from "./UploadModal";
import { exportToExcel } from "@/components/utils/exportutil";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import complaintService from "@/lib/services/ComplaintService";

const ComplaintPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });
  const router = useRouter();

  // Fetch complaints from API
  const fetchComplaints = async (page = 1, search = '', status = '') => {
    setIsLoading(true);
    try {
      const response = await complaintService.getComplaints(page, search, status);
      setComplaints(response.data || []);
      setPagination(response.pagination || {
        total: 0,
        current_page: 1,
        per_page: 10,
        total_pages: 0
      });
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  const handleUploadClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsUploadModalOpen(true);
  };

  const handleDetailClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModalOpen(true);
  };

  const handleFileView = (complaint, docType) => {
    // Find document by type and open URL
    const document = complaint.documents?.find(doc => doc.type === docType);
    if (document?.url) {
      window.open(document.url, '_blank');
    } else {
      toast.error('Document not found');
    }
  };

  const handleUpload = async (complaintId, file, docType) => {
    try {
      await complaintService.uploadDocument(complaintId, file, docType);
      // Refresh complaints after upload
      fetchComplaints(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error('Error in handleUpload:', error);
    }
  };

  const handleComplaintUpdate = async (complaintId, updateData) => {
  // Update complaints list
  setComplaints(prevComplaints =>
    prevComplaints.map(complaint =>
      complaint.id === complaintId
        ? { ...complaint, ...updateData }
        : complaint
    )
  );
  
  // Update selected complaint for instant modal update
  if (selectedComplaint && selectedComplaint.id === complaintId) {
    setSelectedComplaint(prev => ({ ...prev, ...updateData }));
  }
  
  // Refresh from API
  fetchComplaints(currentPage, searchTerm, statusFilter);
};

  const handleExport = (type) => {
    const exportData = complaints.map(complaint => ({
      'SR No': complaint.id,
      'Complaint Date': complaint.complaint_date,
      'Name': complaint.name,
      'Mobile No': complaint.phone,
      'Email': complaint.email,
      'Loan No': complaint.loan_no,
      'Loan Belong To': complaint.loan_belong_to,
      'Status': complaint.status,
      'Complaint Details': complaint.complaint_details,
      'Complaint For': complaint.complaint_for,
      'Assigned To': complaint.complaint_assign_to,
      'Resolution': complaint.resolution_remarks,
      'Close Date': complaint.close_date,
      'Final Remarks': complaint.final_remarks
    }));

    if (type === 'excel') {
      exportToExcel(exportData, 'complaints');
    }
  };

  const handleRefresh = () => {
    fetchComplaints(currentPage, searchTerm, statusFilter);
  };

  // Transform API data to match component expectations
 const transformedComplaints = complaints.map(complaint => ({
  id: complaint.id,
  srNo: complaint.id,
  complaintDate: complaint.complaint_date,
  name: complaint.name,
  mobileNo: complaint.phone,
  email: complaint.email,
  loanNo: complaint.loan_no,
  loanBelongTo: complaint.loan_belong_to,
  status: complaint.status,
  complaintDetails: complaint.complaint_details,
  complaintFor: complaint.complaint_for,
  assignedTo: complaint.complaint_assign_to,
  complaintResolution: complaint.resolution_remarks,
  complaintCloseDate: complaint.close_date,
  finalRemarks: complaint.final_remarks,
  hasComplaintDocs: complaint.documents?.some(doc => doc.type === 'complaint') || false,
  hasResolutionDocs: complaint.documents?.some(doc => doc.type === 'resolution') || false,
  phone: complaint.phone,
  date: complaint.complaint_date,
  documents: complaint.documents || [],
  // Add these fields for proper mapping
  loan_belong_to: complaint.loan_belong_to,
  complaint_date: complaint.complaint_date,
  complaint_details: complaint.complaint_details,
  complaint_assign_to: complaint.complaint_assign_to,
  complaint_for: complaint.complaint_for,
  resolution_remarks: complaint.resolution_remarks,
  close_date: complaint.close_date,
  final_remarks: complaint.final_remarks,
  open_date: complaint.open_date, // Add this for assign date
  loan_no: complaint.loan_no // Add this for loan number
}));

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
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                List Of Complaints
              </h1>
              {isLoading && (
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
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
              <option value="pending">Pending</option>
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <ComplaintTable
          paginatedComplaints={transformedComplaints}
          filteredComplaints={transformedComplaints}
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPage={pagination.per_page}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onUploadClick={handleUploadClick}
          onDetailClick={handleDetailClick}
          onFileView={handleFileView}
          isLoading={isLoading}
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