"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Download } from "lucide-react";
import SearchBar from "../SearchBar";
import { useRouter } from "next/navigation";
import RbiGuidelinesTable from "./GuidelinesTable";
import Swal from "sweetalert2";
import { exportToExcel } from "@/components/utils/exportutil";
import StatusUpdateModal from "./StatusUpdateModal";
import DocumentUploadModal from "./DocumentUploadModal";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { rbiGuidelineService, formatGuidelineForUI } from "@/lib/services/RBIGuidelineService";
import { toast } from 'react-hot-toast';

const RbiGuidelinesPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
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

  const itemsPerPage = 10;

  const loadGuidelines = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setInitialLoading(true);
      } else {
        setIsUpdating(true);
      }

      setError(null);

      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter })
      };

      const response = await rbiGuidelineService.getGuidelines(params);
      
      if (response.success || response.data?.status) {
        const data = response.data?.data || response.data || [];
        const formattedGuidelines = data.map(formatGuidelineForUI);
        setGuidelines(formattedGuidelines);
        setTotalItems(response.pagination?.total || response.data?.pagination?.total || formattedGuidelines.length);
        setTotalPages(response.pagination?.total_pages || response.data?.pagination?.total_pages || 1);
      } else {
        throw new Error(response.message || 'Failed to load guidelines');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to load RBI guidelines";
      setError(errorMessage);
      toast.error(errorMessage);
      setGuidelines([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setInitialLoading(false);
      setIsUpdating(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    loadGuidelines(true);
  }, []);

  useEffect(() => {
    if (initialLoading) return;
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadGuidelines(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (initialLoading) return;
    loadGuidelines(false);
  }, [currentPage]);

  const handleStatusClick = (guideline) => {
    setSelectedGuideline(guideline);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGuideline(null);
  };

 const handleUpdateStatus = async (guidelineId, newStatus, finalRemark) => {
  try {
    setIsUpdating(true);
    
    // Call the service with proper parameters
    const response = await rbiGuidelineService.updateStatus(guidelineId, newStatus, finalRemark);
    
    // Consistent success checking - based on your API response
    if (response.data?.status === true) {
      toast.success(response.data?.message || 'Status updated successfully');
      await loadGuidelines(false);
      // Close modal only after successful update
      handleCloseModal();
    } else {
      throw new Error(response.data?.message || 'Failed to update status');
    }
  } catch (error) {
    console.error('Status update error:', error);
    
    // Enhanced error logging
    console.error('Full error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Consistent error message extraction
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "Failed to update status";
    
    toast.error(errorMessage);
    
  } finally {
    setIsUpdating(false);
  }
};

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
      
      const response = await rbiGuidelineService.uploadDocument(guidelineId, fileType, file);
      
      const isSuccess = response.data?.status || response.status;
      
      if (isSuccess) {
        toast.success('Document uploaded successfully');
        await loadGuidelines(false);
      } else {
        throw new Error(response.data?.message || response.message || 'Failed to upload document');
      }
    } catch (error) {
      let errorMessage = "Failed to upload document";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDocument = async (guidelineId, documentType) => {
    try {
      const guideline = guidelines.find(g => g.id === guidelineId);
      
      if (!guideline || !guideline.documents || !Array.isArray(guideline.documents)) {
        toast.error('Document not found');
        return;
      }
      
      const document = guideline.documents.find(doc => doc.document_type === documentType);
      
      if (document && document.document_url) {
        window.open(document.document_url, '_blank');
      } else {
        toast.error('Document not available');
      }
    } catch (error) {
      toast.error('Failed to load document');
    }
  };

  const handleCreateGuideline = () => {
    router.push("rbi-guidelines/manage-guideline");
  };

  const handleEditGuideline = (guidelineId) => {
    router.push(`rbi-guidelines/manage-guideline?id=${guidelineId}`);
  };

  const handleDeleteGuideline = async (guidelineId, subject) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete guideline: ${subject}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      try {
        setIsUpdating(true);
        
        try {
          const response = await rbiGuidelineService.deleteGuideline(guidelineId);
          
          if (response.data?.status || response.status) {
            toast.success('Guideline deleted successfully');
            await loadGuidelines(false);
            return;
          }
        } catch (deleteError) {
          // Fallback to status update
        }
        
        await rbiGuidelineService.updateStatus(guidelineId, 'Deleted');
        toast.success('Guideline deleted successfully');
        await loadGuidelines(false);
        
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete guideline";
        toast.error(errorMessage);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleExport = () => {
    if (guidelines.length === 0) {
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
        "Advice No",
        "Remarks",
        "Last Modify",
        "Status",
        "Added By",
        "Created Date"
      ],
      ...guidelines.map((guideline, index) => [
        index + 1,
        guideline.guidelineDate,
        guideline.referenceNo,
        guideline.subject,
        guideline.cautionAdviceNo,
        guideline.remarks || "-",
        guideline.lastModify,
        guideline.status,
        guideline.addedBy,
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="p-0 md:p-4">
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
                <ArrowLeft className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
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
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Total Records - {totalItems}
          </div>
        </div>

        {initialLoading && (
          <div className={`text-center py-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
            Loading RBI guidelines...
          </div>
        )}

        {error && !initialLoading && (
          <div className={`text-center py-8 ${isDark ? "text-red-400" : "text-red-600"}`}>
            <p>{error}</p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

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

      <StatusUpdateModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  guideline={selectedGuideline}
  isDark={isDark}
  onUpdateStatus={handleUpdateStatus}
  isUpdating={isUpdating} 
  />

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