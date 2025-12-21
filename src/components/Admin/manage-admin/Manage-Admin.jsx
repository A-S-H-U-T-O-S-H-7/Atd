'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  UserPlus,
  Shield,
  X,
  Filter,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { toast } from 'react-hot-toast';
import AdminForm from './AdminForm';
import AdminTable from './AdminTable';
import { mockAdmins } from '@/lib/schema/adminValidationSchema';

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
  
  // Modal state
  const [permissionModal, setPermissionModal] = useState({
    isOpen: false,
    admin: null
  });
  
  const [admins, setAdmins] = useState([]);
  const itemsPerPage = 10;

  // Mock API simulation
  const simulateAPI = (data, delay = 500) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: data
        });
      }, delay);
    });
  };

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await simulateAPI(mockAdmins);
      
      if (response.success) {
        // Apply filters
        let filtered = [...response.data];
        
        // Search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(admin => 
            admin.name.toLowerCase().includes(term) ||
            admin.email.toLowerCase().includes(term) ||
            admin.username.toLowerCase().includes(term) ||
            admin.phone.includes(term)
          );
        }
        
        // Type filter
        if (filterType !== 'all') {
          filtered = filtered.filter(admin => admin.type === filterType);
        }
        
        // Status filter
        if (filterStatus !== 'all') {
          filtered = filtered.filter(admin => admin.isActive === filterStatus);
        }
        
        setAdmins(filtered);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error("Failed to load admins");
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchAdmins();
  }, [searchTerm, filterType, filterStatus]);

  // Handle add/update admin
  const handleSubmitAdmin = async (formData) => {
    try {
      if (isEditMode && selectedAdmin) {
        // Mock update
        const updatedAdmins = admins.map(admin => 
          admin.id === selectedAdmin.id 
            ? { ...admin, ...Object.fromEntries(formData) }
            : admin
        );
        setAdmins(updatedAdmins);
        toast.success('Admin updated successfully!');
      } else {
        // Mock add
        const newAdmin = {
          id: admins.length + 1,
          ...Object.fromEntries(formData),
          addedBy: 'Current User',
          createdAt: new Date().toISOString(),
          permissions: []
        };
        setAdmins([newAdmin, ...admins]);
        toast.success('Admin added successfully!');
      }
      
      // Reset form
      setIsFormExpanded(false);
      setIsEditMode(false);
      setSelectedAdmin(null);
      
    } catch (err) {
      toast.error(err.message || 'Failed to save admin');
      throw err;
    }
  };

  // Handle edit
  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setIsEditMode(true);
    setIsFormExpanded(true);
  };

  // Handle status toggle
  const handleToggleStatus = async (id) => {
    try {
      const updatedAdmins = admins.map(admin => 
        admin.id === id 
          ? { ...admin, isActive: admin.isActive === 'yes' ? 'no' : 'yes' }
          : admin
      );
      setAdmins(updatedAdmins);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Handle permissions view
  const handleViewPermissions = (admin) => {
    setPermissionModal({ isOpen: true, admin });
  };

  // Close modal
  const closePermissionModal = () => {
    setPermissionModal({ isOpen: false, admin: null });
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

  // Calculate paginated data
  const paginatedAdmins = admins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(admins.length / itemsPerPage);

  // Export to CSV
  const handleExport = () => {
    toast.success('Export started!');
  };

  return (
    <>
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
                  onClick={() => fetchAdmins()}
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
                      placeholder="Search by name, email, username or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                        onChange={(e) => setFilterType(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDark
                            ? 'bg-gray-700 border-purple-600/50 text-white'
                            : 'bg-white border-purple-300 text-gray-900'
                        }`}
                      >
                        <option value="all">All Types</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
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
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDark
                            ? 'bg-gray-700 border-purple-600/50 text-white'
                            : 'bg-white border-purple-300 text-gray-900'
                        }`}
                      >
                        <option value="all">All Status</option>
                        <option value="yes">Active</option>
                        <option value="no">Inactive</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setFilterType('all');
                          setFilterStatus('all');
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
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            isDark={isDark}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onViewPermissions={handleViewPermissions}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Permissions Modal */}
      {permissionModal.isOpen && permissionModal.admin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className={`relative rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Permissions for {permissionModal.admin.name}
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  @{permissionModal.admin.username} • {permissionModal.admin.type}
                </p>
              </div>
              <button
                onClick={closePermissionModal}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {permissionModal.admin.permissions?.map((permission, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-900/50 border-purple-600/30' : 'bg-purple-50 border-purple-200'
                  }`}>
                    <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                      isDark ? 'text-purple-300' : 'text-purple-700'
                    }`}>
                      <Shield className="w-4 h-4" />
                      {permission.page}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {permission.actions?.map((action, actionIdx) => (
                        <span key={actionIdx} className={`px-3 py-1 text-xs rounded-full ${
                          isDark 
                            ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50'
                            : 'bg-purple-100 text-purple-700 border border-purple-300'
                        }`}>
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {(!permissionModal.admin.permissions || permissionModal.admin.permissions.length === 0) && (
                <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No specific permissions set</p>
                  <p className="text-sm mt-1">Default view access only</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={closePermissionModal}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isDark 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageAdminPage;