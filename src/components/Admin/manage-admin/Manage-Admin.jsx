'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Download, RefreshCw, UserPlus, Shield, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { toast } from 'react-hot-toast';
import AdminForm from './AdminForm';
import AdminTable from './AdminTable';
import PermissionsModal from './PermissionsModal';
import { adminService, formatAdminForUI } from '@/lib/services/AdminServices';
import Pagination from '../Pagination';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';

const ManageAdminPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Permissions Modal
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedAdminForPermissions, setSelectedAdminForPermissions] = useState(null);
  const [selectedAdminName, setSelectedAdminName] = useState('');
  
  const [admins, setAdmins] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });

  const itemsPerPage = 10;

  const fetchAdmins = useCallback(async (page = 1, search = "", type = filterType, status = filterStatus) => {
    try {
      setIsLoading(true);
      const response = await adminService.getAdmins({
        page,
        per_page: itemsPerPage,
        search: search.trim()
      });

      if (response.success) {
        let formattedAdmins = response.data.map(formatAdminForUI);
        
        if (type !== 'all') {
          formattedAdmins = formattedAdmins.filter(admin => admin.type === type);
        }
        
        if (status !== 'all') {
          const statusValue = status === '1';
          formattedAdmins = formattedAdmins.filter(admin => 
            admin.isActive === statusValue || admin.isActive?.toString() === status
          );
        }
        
        setAdmins(formattedAdmins);
        setPagination(response.pagination);
        setCurrentPage(response.pagination.current_page);
      } else {
        throw new Error(response.message || "Failed to fetch admins");
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error(err.message || "Failed to load admins");
      setAdmins([]);
      setPagination({
        total: 0,
        current_page: 1,
        per_page: itemsPerPage,
        total_pages: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, [filterType, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmins(1, searchTerm, filterType, filterStatus);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterType, filterStatus, fetchAdmins]);

  useEffect(() => {
    fetchAdmins(currentPage, searchTerm, filterType, filterStatus);
  }, [currentPage, fetchAdmins]);

  const handleSubmitAdmin = async (formData) => {
    try {
      const { user: currentAdmin } = useAdminAuthStore.getState();
      
      if (currentAdmin?.id) {
        formData.append('admin_id', currentAdmin.id);
      }
      
      if (!isEditMode && currentAdmin?.id) {
        formData.append('created_by', currentAdmin.id);
      }
      
      if (isEditMode && selectedAdmin) {
        formData.append('id', selectedAdmin.id);
      }
      
      if (isEditMode && selectedAdmin) {
        await adminService.updateAdmin(selectedAdmin.id, formData);
        toast.success('Admin updated successfully!');
      } else {
        await adminService.addAdmin(formData);
        toast.success('Admin added successfully!');
      }
      
      await fetchAdmins(currentPage, searchTerm, filterType, filterStatus);
      resetForm();
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save admin";
      toast.error(errorMessage);
      throw err;
    }
  };

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

  const handleToggleStatus = async (id) => {
    try {
      const response = await adminService.toggleStatus(id);
      if (response.success) {
        await fetchAdmins(currentPage, searchTerm, filterType, filterStatus);
        toast.success('Status updated successfully!');
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error(err.message || "Failed to update admin status");
    }
  };

  const handleOpenPermissions = (adminId, adminName) => {
    setSelectedAdminForPermissions(adminId);
    setSelectedAdminName(adminName);
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = async (adminId, permissions) => {
    try {
      const response = await adminService.updatePermissions(adminId, permissions);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || "Failed to update permissions");
      }
    } catch (err) {
      console.error("Error saving permissions:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to save permissions";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const resetForm = () => {
    setIsFormExpanded(false);
    setIsEditMode(false);
    setSelectedAdmin(null);
  };

  const toggleForm = () => {
    if (isFormExpanded && isEditMode) {
      resetForm();
    } else {
      setIsFormExpanded(!isFormExpanded);
    }
  };

  

  const handleClearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
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
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-emerald-900/50" : "bg-emerald-100"
                }`}>
                  <Shield className={`w-6 h-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark ? "from-emerald-400 to-emerald-500" : "from-emerald-600 to-emerald-700"
                  } bg-clip-text text-transparent`}>
                    Manage Admins
                  </h1>
                  <p className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total: {pagination.total} admins
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  resetForm();
                  setIsFormExpanded(true);
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                }`}
              >
                <UserPlus size={16} />
                <span>Add Admin</span>
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
                        ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-500'
                        : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-4 py-3 rounded-xl flex items-center space-x-2 ${
                    isDark
                      ? 'bg-gray-800 hover:bg-gray-700 border border-emerald-600/50 text-gray-300'
                      : 'bg-white hover:bg-gray-50 border border-emerald-300 text-gray-700'
                  }`}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
              </div>
            </div>
            
            {showAdvancedFilters && (
              <div className={`mt-4 p-4 rounded-xl border ${
                isDark
                  ? 'bg-gray-800 border-emerald-600/50'
                  : 'bg-white border-emerald-300'
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
                          ? 'bg-gray-700 border-emerald-600/50 text-white'
                          : 'bg-white border-emerald-300 text-gray-900'
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
                          ? 'bg-gray-700 border-emerald-600/50 text-white'
                          : 'bg-white border-emerald-300 text-gray-900'
                      }`}
                    >
                      <option value="all">All Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={handleClearFilters}
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
        <div className="mb-6">
          <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
            isDark
              ? "bg-gray-800 border-emerald-600/50"
              : "bg-white border-emerald-300"
          }`}>
            <AdminTable
              admins={admins}
              isDark={isDark}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onOpenPermissions={handleOpenPermissions}
              isLoading={isLoading}
            />
            
            {!isLoading && admins.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  onPageChange={handlePageChange}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.per_page}
                />
              </div>
            )}
          </div>
        </div>

        <PermissionsModal
          isOpen={showPermissionsModal}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedAdminForPermissions(null);
            setSelectedAdminName('');
          }}
          adminId={selectedAdminForPermissions}
          adminName={selectedAdminName}
          isDark={isDark}
          onSavePermissions={handleSavePermissions}
        />
      </div>
    </div>
  );
};

export default ManageAdminPage;