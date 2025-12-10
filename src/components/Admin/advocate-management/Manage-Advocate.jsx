// app/crm/advocate/manage/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  UserPlus,
  Scale
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { toast } from 'react-hot-toast';
import AdvancedSearchBar from '../AdvanceSearchBar';
import AdvocateForm from './AdvocateForm';
import AdvocateTable from './AdvocateTable';
import { advocateService, formatAdvocateForUI } from '@/lib/services/AdvocateServices';
import { exportToExcel } from '@/components/utils/exportutil';

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
      
      // Refresh the list
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
      throw new Error(err.message || "Failed to save advocate");
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
          licence_no: advocateOrId.licenceNo
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
      toast.success("Status updated successfully");
      fetchAdvocates(currentPage, searchTerm);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // Handle export
  const handleExport = () => {
    const exportData = advocates.map(advocate => ({
      'S.No': advocate.id,
      'Name': advocate.name,
      'Email': advocate.email,
      'Court': advocate.court,
      'Address': advocate.address,
      'Phone': advocate.phone,
      'Licence No': advocate.licenceNo,
      'Status': advocate.isActive ? 'Active' : 'Inactive',
      'Added By': advocate.addedBy,
      'Created At': advocate.createdAt
    }));

    exportToExcel(exportData, 'advocates-list');
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
                onClick={handleExport}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <Download size={16} />
                <span>Export</span>
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

          {/* Search Bar */}
          <div className="mb-6">
            
          </div>

          {/* Statistics Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-emerald-600/50"
                : "bg-white border-emerald-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-emerald-900/50" : "bg-emerald-100"
                }`}>
                  <Scale className={`w-6 h-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {pagination.total || advocates.length}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total Advocates
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-green-600/50"
                : "bg-white border-green-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-green-900/50" : "bg-green-100"
                }`}>
                  <Scale className={`w-6 h-6 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {advocates.filter(a => a.isActive).length}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Active Advocates
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-red-600/50"
                : "bg-white border-red-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-red-900/50" : "bg-red-100"
                }`}>
                  <Scale className={`w-6 h-6 ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {advocates.filter(a => !a.isActive).length}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Inactive Advocates
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-purple-600/50"
                : "bg-white border-purple-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-purple-900/50" : "bg-purple-100"
                }`}>
                  <Scale className={`w-6 h-6 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {pagination.total_pages || 1}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total Pages
                  </p>
                </div>
              </div>
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
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ManageAdvocatePage;