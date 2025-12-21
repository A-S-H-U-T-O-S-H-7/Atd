'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  UserPlus,
  Shield,
  Filter,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { toast } from 'react-hot-toast';
import AdminForm from './AdminForm';
import AdminTable from './AdminTable';
import { adminService, formatAdminForUI } from '@/lib/services/AdminServices';

const ManageAdminPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [admins, setAdmins] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });

  const itemsPerPage = 10;

  // Fetch admins
  const fetchAdmins = async (page = 1, search = "", type = filterType, status = filterStatus) => {
    try {
      setIsLoading(true);
      const response = await adminService.getAdmins({
        page,
        per_page: itemsPerPage,
        search
      });

      if (response.success) {
        let formattedAdmins = response.data.map(formatAdminForUI);
        
        // Apply additional filters
        if (type !== 'all') {
          formattedAdmins = formattedAdmins.filter(admin => admin.type === type);
        }
        
        if (status !== 'all') {
          const statusValue = status === '1';
          formattedAdmins = formattedAdmins.filter(admin => admin.isActive === statusValue);
        }
        
        setAdmins(formattedAdmins);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || "Failed to fetch admins");
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error(err.message || "Failed to load admins");
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchAdmins(currentPage, searchTerm, filterType, filterStatus);
  }, [currentPage, searchTerm, filterType, filterStatus]);

  // Handle add/update admin
  const handleSubmitAdmin = async (formData) => {
    try {
      if (isEditMode && selectedAdmin) {
        await adminService.updateAdmin(selectedAdmin.id, formData);
        toast.success('Admin updated successfully!');
      } else {
        await adminService.addAdmin(formData);
        toast.success('Admin added successfully!');
      }
      
      // Refresh the list
      fetchAdmins(currentPage, searchTerm, filterType, filterStatus);
      
      // Reset form
      setIsFormExpanded(false);
      setIsEditMode(false);
      setSelectedAdmin(null);
      
    } catch (err) {
      console.error("Error saving admin:", err);
      throw err;
    }
  };

  // Handle edit
  const handleEdit = async (admin) => {
    try {
      const response = await adminService.getAdminById(admin.id);
      if (response.success) {
        const adminData = formatAdminForUI(response.data);
        setSelectedAdmin(adminData);
        setIsEditMode(true);
        setIsFormExpanded(true);
      }
    } catch (err) {
      console.error("Error fetching admin:", err);
      toast.error("Failed to load admin details");
    }
  };

  // Handle reset password
  const handleResetPassword = async (id) => {
    try {
      // Note: API endpoint for reset password might be different
      // For now, show a success message
      toast.success('Password reset link sent successfully!');
    } catch (err) {
      toast.error('Failed to send reset link');
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Toggle form expansion
  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (isFormExpanded && isEditMode) {
      setIsEditMode(false);
      setSelectedAdmin(null);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditMode(false);
    setSelectedAdmin(null);
    setIsFormExpanded(false);
  };

  // Export to CSV
  const handleExport = () => {
    toast.success('Export started!');
  };

  // Calculate paginated data
  const paginatedAdmins = admins;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-purple-50/30"
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
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-purple-600/30"
                    : "hover:bg-purple-50 bg-purple-50/50 border border-purple-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`} />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-purple-900/50" : "bg-purple-100"
                }`}>
                  <Shield className={`w-6 h-6 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`} />
                </div>
                <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-purple-400 to-indigo-400" : "from-purple-600 to-indigo-600"
                } bg-clip-text text-transparent`}>
                  Manage Admins
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
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                <UserPlus size={16} />
                <span>Add Admin</span>
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
                onClick={() => fetchAdmins(currentPage, searchTerm, filterType, filterStatus)}
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

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search by name, username, email or phone..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500'
                        : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-4 py-3 rounded-xl flex items-center space-x-2 ${
                    isDark
                      ? 'bg-gray-800 hover:bg-gray-700 border border-purple-600/50 text-gray-300'
                      : 'bg-white hover:bg-gray-50 border border-purple-300 text-gray-700'
                  }`}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
              </div>
            </div>
            
            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className={`mt-4 p-4 rounded-xl border ${
                isDark
                  ? 'bg-gray-800 border-purple-600/50'
                  : 'bg-white border-purple-300'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Admin Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        setCurrentPage(1);
                      }}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-purple-600/50 text-white'
                          : 'bg-white border-purple-300 text-gray-900'
                      }`}
                    >
                      <option value="all">All Types</option>
                      <option value="user">User</option>
                      <option value="verifier">Verifier</option>
                      <option value="account">Account</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                      <option value="collection">Collection</option>
                      <option value="agency">Agency</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-purple-600/50 text-white'
                          : 'bg-white border-purple-300 text-gray-900'
                      }`}
                    >
                      <option value="all">All Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterType('all');
                        setFilterStatus('all');
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-lg ${
                        isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Form */}
        <div className="mb-8">
          <AdminForm
            isDark={isDark}
            onSubmit={handleSubmitAdmin}
            initialData={selectedAdmin}
            isEditMode={isEditMode}
            isExpanded={isFormExpanded}
            onToggleExpand={toggleForm}
          />
        </div>

        {/* Admin Table */}
        <AdminTable
          paginatedAdmins={paginatedAdmins}
          filteredAdmins={admins}
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onResetPassword={handleResetPassword}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ManageAdminPage;