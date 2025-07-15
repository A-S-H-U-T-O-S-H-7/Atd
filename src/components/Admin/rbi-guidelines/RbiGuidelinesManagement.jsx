"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Download } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import { useRouter } from "next/navigation";
import RbiGuidelinesTable from "./GuidelinesTable";
import Swal from "sweetalert2";
import { exportToExcel } from "@/components/utils/exportutil";
import StatusUpdateModal from "./StatusUpdateModal";
import DocumentUploadModal from "./DocumentUploadModal";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

// Mock data for RBI Guidelines
const mockRbiGuidelines = [
  {
    id: 1,
    guidelineDate: "2023-02-16",
    referenceNo: "Dos.CO.FMG. No. S339/23.08.003/2022-23",
    subject: "Fraudulent letters/emails conveying imposition of monetary penalties purported tobe issued by RBI",
    cautionAdviceNo: "4149",
    remarks: "",
    lastModify: "2025-07-09 15:28:20",
    status: "Pending",
    addedBy: "SANJAY KUMAR",
    uploadDocuments: "Available",
    createdDate: "2025-07-09 15:28:20",
    documents: {
      "rbi-guidelines": "RBI_Guidelines_4149.pdf",
      "resolution": "Resolution_4149.pdf"
    }
  },
  {
    id: 2,
    guidelineDate: "2023-01-18",
    referenceNo: "NA",
    subject: "Information regarding contact details of the NBFC executives",
    cautionAdviceNo: "NA",
    remarks: "Reply given to the RBI",
    lastModify: "2025-07-09 15:26:45",
    status: "Closed",
    addedBy: "SANJAY KUMAR",
    uploadDocuments: "Available",
    createdDate: "2025-07-09 15:20:54",
    documents: {
      "rbi-guidelines": "RBI_Guidelines_4149.pdf",
      "resolution": "Resolution_4149.pdf"
    }
  },
  {
    id: 3,
    guidelineDate: "2023-03-15",
    referenceNo: "Dos.CO.FMG. No. S440/23.08.003/2022-23",
    subject: "Guidelines on Credit Risk Management for Non-Banking Financial Companies",
    cautionAdviceNo: "4150",
    remarks: "Implementation in progress",
    lastModify: "2025-07-09 14:30:15",
    status: "Pending",
    addedBy: "RAJESH SHARMA",
    uploadDocuments: "Available",
    createdDate: "2025-07-09 14:25:10",
    documents: {
      "rbi-guidelines": "RBI_Guidelines_4149.pdf",
      "resolution": "Resolution_4149.pdf"
    }
  },
  {
    id: 4,
    guidelineDate: "2023-04-20",
    referenceNo: "Dos.CO.FMG. No. S551/23.08.003/2022-23",
    subject: "Cyber Security Framework for NBFCs",
    cautionAdviceNo: "4151",
    remarks: "Compliance completed",
    lastModify: "2025-07-09 13:45:30",
    status: "Closed",
    addedBy: "PRIYA PATEL",
    uploadDocuments: "Available",
    createdDate: "2025-07-09 13:40:25"
  },
  {
    id: 5,
    guidelineDate: "2023-05-10",
    referenceNo: "Dos.CO.FMG. No. S662/23.08.003/2022-23",
    subject: "Asset Classification and Provisioning pertaining to Advances",
    cautionAdviceNo: "4152",
    remarks: "Under review",
    lastModify: "2025-07-09 12:15:45",
    status: "Pending",
    addedBy: "AMIT SINGH",
    uploadDocuments: "Available",
    createdDate: "2025-07-09 12:10:20"
  }
];

const RbiGuidelinesPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [guidelines, setGuidelines] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedGuideline, setSelectedGuideline] = useState(null);
const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
const [selectedGuidelineForUpload, setSelectedGuidelineForUpload] = useState(null);

  // Items per page
  const itemsPerPage = 10;

  // Filter and pagination logic
  const getFilteredGuidelines = useCallback(() => {
    let filtered = mockRbiGuidelines;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(guideline => 
        guideline.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guideline.referenceNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(guideline => 
        guideline.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered;
  }, [searchTerm, statusFilter]);

  // status modal handler functions
const handleStatusClick = (guideline) => {
  setSelectedGuideline(guideline);
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
  setSelectedGuideline(null);
};

const handleUpdateStatus = async (guidelineId, newStatus) => {
  try {
    setIsUpdating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await Swal.fire({
      title: "Success!",
      text: "Status updated successfully.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000"
    });
    
    loadGuidelines(false);
  } catch (error) {
    console.error("Update status error:", error);
    await Swal.fire({
      title: "Error!",
      text: "Failed to update status. Please try again.",
      icon: "error",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000"
    });
  } finally {
    setIsUpdating(false);
  }
};

//upload modal handler
const handleUploadDocument = (guideline) => {
  setSelectedGuidelineForUpload(guideline);
  setIsUploadModalOpen(true);
};

const handleCloseUploadModal = () => {
  setIsUploadModalOpen(false);
  setSelectedGuidelineForUpload(null);
};

const handleDocumentUpload = async (guidelineId, fileType, file) => {
  try {
    setIsUpdating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await Swal.fire({
      title: "Success!",
      text: `${fileType} document uploaded successfully.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000"
    });
    
    loadGuidelines(false);
  } catch (error) {
    console.error("Upload error:", error);
    await Swal.fire({
      title: "Error!",
      text: "Failed to upload document. Please try again.",
      icon: "error",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000"
    });
  } finally {
    setIsUpdating(false);
  }
};

const handleViewDocument = async (guidelineId, documentType) => {
  try {
    // Find the guideline to get the document filename
    const guideline = mockRbiGuidelines.find(g => g.id === guidelineId);
    const filename = guideline.documents?.[documentType];
    
    if (filename) {
      // Create Firebase storage reference
      const fileRef = ref(storage, `documents/${filename}`); // adjust path as needed
      const url = await getDownloadURL(fileRef);
      
      // Open in new tab for viewing/downloading
      window.open(url, '_blank');
    }
  } catch (error) {
    console.error("Failed to get document URL:", error);
    // Show error message
    await Swal.fire({
      title: "Error!",
      text: "Failed to load document. Please try again.",
      icon: "error",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000"
    });
  }
};


  const loadGuidelines = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setInitialLoading(true);
      } else {
        setIsUpdating(true);
      }

      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const filteredGuidelines = getFilteredGuidelines();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedGuidelines = filteredGuidelines.slice(startIndex, endIndex);

      setGuidelines(paginatedGuidelines);
      setTotalItems(filteredGuidelines.length);
      setTotalPages(Math.ceil(filteredGuidelines.length / itemsPerPage));

    } catch (err) {
      console.error("Load guidelines error:", err);
      setError("Failed to load RBI guidelines");
      setGuidelines([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setInitialLoading(false);
      setIsUpdating(false);
    }
  }, [currentPage, getFilteredGuidelines]);

  // Initial load
  useEffect(() => {
    loadGuidelines(true);
  }, []);

  // Reload when filters change
  useEffect(() => {
    if (initialLoading) return;
    
    // Reset to page 1 when search or filter changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadGuidelines(false);
    }
  }, [searchTerm, statusFilter]);

  // Reload when page changes
  useEffect(() => {
    if (initialLoading) return;
    loadGuidelines(false);
  }, [currentPage]);

  const handleCreateGuideline = () => {
    router.push("rbi-guidelines/manage-guideline");
  };

  const handleEditGuideline = (guidelineId) => {
    router.push(`rbi-guidelines/manage-guideline?id=${guidelineId}`);
  };

  const handleDeleteGuideline = async (guidelineId, subject) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
      customClass: {
        popup: isDark
          ? "dark-swal rounded-xl border-2 border-emerald-500"
          : "rounded-xl border-2 border-emerald-500"
      }
    });

    if (result.isConfirmed) {
      try {
        setIsUpdating(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        await Swal.fire({
          title: "Deleted!",
          text: "RBI Guideline has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#ffffff" : "#000000"
        });

        loadGuidelines(false);
      } catch (error) {
        console.error("Delete error:", error);
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete guideline. Please try again.",
          icon: "error",
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#ffffff" : "#000000"
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleExport = () => {
    const filteredData = getFilteredGuidelines();
    
    if (filteredData.length === 0) {
      Swal.fire({
        title: "No Data",
        text: "No guidelines found to export.",
        icon: "info",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000"
      });
      return;
    }

    const exportData = [
      [
        "SR. No.",
        "RBI Guideline Date",
        "Reference No.",
        "Subject",
        "Caution advice No",
        "Remarks",
        "Last Modify",
        "Status",
        "Added By",
        "Upload Documents",
        "Created Date"
      ],
      ...filteredData.map((guideline, index) => [
        index + 1,
        guideline.guidelineDate,
        guideline.referenceNo,
        guideline.subject,
        guideline.cautionAdviceNo,
        guideline.remarks,
        guideline.lastModify,
        guideline.status,
        guideline.addedBy,
        guideline.uploadDocuments,
        guideline.createdDate
      ])
    ];

    exportToExcel(exportData, "RBI_Guidelines.csv");
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRetry = () => {
    loadGuidelines(true);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft
                  className={`w-5 h-5 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </button>
              <h1
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark
                    ? "from-emerald-400 to-teal-400"
                    : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}
              >
                List Of RBI Guidelines
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } shadow-lg hover:shadow-xl`}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleCreateGuideline}
                className={`flex cursor-pointer items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                } shadow-lg hover:shadow-xl`}
              >
                <Plus className="w-5 h-5" />
                <span>Add Guideline</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder="Search guidelines by subject or reference number..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Total Records */}
          <div className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Total Records - {totalItems}
          </div>
        </div>

        {/* Initial Loading State */}
        {initialLoading && (
          <div
            className={`text-center py-8 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
            Loading RBI guidelines...
          </div>
        )}

        {/* Error State */}
        {error && !initialLoading && (
          <div
            className={`text-center py-8 ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            <p>{error}</p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Guidelines Table */}
        {!initialLoading && (
          <RbiGuidelinesTable
            guidelines={guidelines}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            totalItems={totalItems}
            isUpdating={isUpdating}
            isDark={isDark}
            error={error}
            onEdit={handleEditGuideline}
            onDelete={handleDeleteGuideline}
            onPageChange={handlePageChange}
            onStatusClick={handleStatusClick}
            onUploadDocument={handleUploadDocument}  
            onViewDocument={handleViewDocument}    
          />
        )}
      </div>

      {/* status modal */}
<StatusUpdateModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  guideline={selectedGuideline}
  isDark={isDark}
  onUpdateStatus={handleUpdateStatus}
/>

 {/* upload modal */}
<DocumentUploadModal
  isOpen={isUploadModalOpen}
  onClose={handleCloseUploadModal}
  guideline={selectedGuidelineForUpload}
  isDark={isDark}
  onUploadDocument={handleDocumentUpload}
/>
    </div>
  );
};

export default RbiGuidelinesPage;