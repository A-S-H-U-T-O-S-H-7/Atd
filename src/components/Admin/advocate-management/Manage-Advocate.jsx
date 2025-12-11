// app/crm/advocate/manage/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  UserPlus,
  Scale,
  X
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { toast } from 'react-hot-toast';
import AdvancedSearchBar from '../AdvanceSearchBar';
import AdvocateForm from './AdvocateForm';
import AdvocateTable from './AdvocateTable';
import { advocateService, formatAdvocateForUI } from '@/lib/services/AdvocateServices';

const ManageAdvocatePage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  
  // Modal state
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    url: null
  });
  
  const [advocates, setAdvocates] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });

  const itemsPerPage = 10;
  const editId = searchParams.get('edit');

  // Fetch advocates
  const fetchAdvocates = async (page = 1, search = "") => {
    try {
      setIsLoading(true);
      const response = await advocateService.getAdvocates({
        page,
        per_page: itemsPerPage,
        search
      });

      if (response.success) {
        const formattedAdvocates = response.data.map(formatAdvocateForUI);
        setAdvocates(formattedAdvocates);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || "Failed to fetch advocates");
      }
    } catch (err) {
      console.error("Error fetching advocates:", err);
      toast.error(err.message || "Failed to load advocates");
      setAdvocates([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit mode from URL
  useEffect(() => {
    if (editId) {
      handleEdit(editId);
    }
  }, [editId]);

  // Fetch data on mount and when page/search changes
  useEffect(() => {
    fetchAdvocates(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle add/update advocate
  const handleSubmitAdvocate = async (values) => {
    try {
      if (isEditMode && selectedAdvocate) {
        await advocateService.updateAdvocate(selectedAdvocate.id, values);
      } else {
        await advocateService.addAdvocate(values);
      }
      
      fetchAdvocates(currentPage, searchTerm);
      
      // Reset form
      setIsFormExpanded(false);
      setIsEditMode(false);
      setSelectedAdvocate(null);
      
      // Clear edit param from URL
      if (editId) {
        router.replace('/crm/advocate/manage');
      }
    } catch (err) {
      throw err;
    }
  };

  // Handle edit
  const handleEdit = async (advocateOrId) => {
    try {
      let advocateData;
      
      if (typeof advocateOrId === 'string' || typeof advocateOrId === 'number') {
        // Fetch from API
        const response = await advocateService.getAdvocateById(advocateOrId);
        if (response.success) {
          advocateData = response.data;
        } else {
          throw new Error("Failed to fetch advocate details");
        }
      } else {
        // Use provided advocate object
        advocateData = {
          name: advocateOrId.name,
          court: advocateOrId.court,
          address: advocateOrId.address,
          phone: advocateOrId.phone,
          email: advocateOrId.email,
          licence_no: advocateOrId.licenceNo,
          letterhead: advocateOrId.letterheadUrl 
        };
      }

      setSelectedAdvocate({
        id: typeof advocateOrId === 'object' ? advocateOrId.id : advocateOrId,
        ...advocateData
      });
      setIsEditMode(true);
      setIsFormExpanded(true);
    } catch (err) {
      console.error("Error fetching advocate:", err);
      toast.error("Failed to load advocate details");
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id) => {
    try {
      await advocateService.toggleStatus(id);
      fetchAdvocates(currentPage, searchTerm);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // Handle letterhead preview
  const handleViewLetterhead = (url) => {
    if (!url) {
      toast.info('No letterhead file available');
      return;
    }
    setPreviewModal({ isOpen: true, url });
  };

  // Close modal
  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, url: null });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Toggle form expansion
  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (isFormExpanded && isEditMode) {
      setIsEditMode(false);
      setSelectedAdvocate(null);
      if (editId) {
        router.replace('/crm/advocate/manage');
      }
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditMode(false);
    setSelectedAdvocate(null);
    setIsFormExpanded(false);
    if (editId) {
      router.replace('/crm/advocate/manage');
    }
  };

  return (
    <>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-blue-50/30"
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
                      ? "hover:bg-gray-800 bg-gray-800/50 border border-blue-600/30"
                      : "hover:bg-blue-50 bg-blue-50/50 border border-blue-200"
                  }`}
                >
                  <ArrowLeft className={`w-5 h-5 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </button>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${
                    isDark ? "bg-emerald-900/50" : "bg-emerald-100"
                  }`}>
                    <Scale className={`w-6 h-6 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                  </div>
                  <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                  } bg-clip-text text-transparent`}>
                    Manage Advocates
                  </h1>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (isEditMode) cancelEdit();
                    setIsFormExpanded(true);
                  }}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <UserPlus size={16} />
                  <span>Add Advocate</span>
                </button>
                
                <button
                  onClick={() => fetchAdvocates(currentPage, searchTerm)}
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
              </div>
            </div>

          </div>

          {/* Advocate Form */}
          <div className="mb-8">
            <AdvocateForm
              isDark={isDark}
              onSubmit={handleSubmitAdvocate}
              initialData={selectedAdvocate}
              isEditMode={isEditMode}
              isExpanded={isFormExpanded}
              onToggleExpand={toggleForm}
            />
          </div>

          {/* Advocate Table */}
          <AdvocateTable
            paginatedAdvocates={advocates}
            filteredAdvocates={advocates}
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            itemsPerPage={itemsPerPage}
            isDark={isDark}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onViewLetterhead={handleViewLetterhead}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Preview Modal - Rendered at root level */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className={`relative rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Letterhead Preview
              </h3>
              <button
                onClick={closePreviewModal}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-auto max-h-[70vh]">
              {previewModal.url && (
                previewModal.url.includes('.pdf') ? (
                  <iframe 
                    src={previewModal.url} 
                    className="w-full h-[60vh] rounded-lg border"
                    title="PDF Preview"
                  />
                ) : (
                  <img 
                    src={previewModal.url} 
                    alt="Letterhead" 
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                  />
                )
              )}
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <a
                href={previewModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-lg font-medium ${
                  isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Open in New Tab
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageAdvocatePage;