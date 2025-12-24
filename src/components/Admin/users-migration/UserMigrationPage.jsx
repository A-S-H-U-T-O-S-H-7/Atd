"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import UsersMigrationTable from "./UsersMigrationTable";
import Swal from 'sweetalert2';

// Mock data generator
const generateMockUsers = (count = 50) => {
  const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Raj", "Neha", "Vikram", "Anjali", "Sanjay", "Pooja"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Verma", "Reddy", "Joshi", "Desai", "Mehta", "Nair"];
  const genders = ["Male", "Female", "Other"];
  const organisations = ["TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Google", "Microsoft", "Amazon"];
  const migrationStatuses = ["pending", "migrated"];
  
  const users = [];
  
  for (let i = 1; i <= count; i++) {
    const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const organisation = organisations[Math.floor(Math.random() * organisations.length)];
    const migrationStatus = migrationStatuses[Math.floor(Math.random() * migrationStatuses.length)];
    
    // Generate dates
    const activateDate = new Date();
    activateDate.setDate(activateDate.getDate() - Math.floor(Math.random() * 365));
    
    const blacklistDate = Math.random() > 0.8 ? new Date() : null;
    blacklistDate?.setDate(blacklistDate.getDate() - Math.floor(Math.random() * 30));
    
    // Generate DOB (age between 25-60)
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - (25 + Math.floor(Math.random() * 35)));
    
    users.push({
      id: 1000 + i,
      crnno: `CRN${String(1000 + i).padStart(5, '0')}`,
      accountId: `ACC${String(2000 + i).padStart(5, '0')}`,
      accountActivation: Math.random() > 0.1 ? 1 : 0,
      activateDate: activateDate.toISOString().split('T')[0],
      fname,
      lname,
      dob: dob.toISOString().split('T')[0],
      selfie: Math.random() > 0.3 ? `selfie_${i}.jpg` : null,
      gender,
      fathername: `Mr. ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      phone: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
      email: `${fname.toLowerCase()}.${lname.toLowerCase()}@gmail.com`,
      alt_email: Math.random() > 0.5 ? `${fname.toLowerCase()}.work@company.com` : null,
      pan_no: `ABCDE${Math.floor(Math.random() * 9000) + 1000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      aadhar_no: `${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
      step: Math.floor(Math.random() * 5) + 1,
      isVerified: Math.random() > 0.3 ? 1 : 0,
      blacklist: blacklistDate ? 1 : 0,
      blacklistdate: blacklistDate ? blacklistDate.toISOString().split('T')[0] : null,
      organisation_name: organisation,
      net_monthly_salary: Math.floor(Math.random() * 200000) + 30000,
      admin_id: Math.floor(Math.random() * 10) + 1,
      migration_status: migrationStatus,
      migration_date: migrationStatus === "migrated" ? new Date().toISOString().split('T')[0] : null
    });
  }
  
  return users;
};

const UsersMigration = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Load mock data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update paginated data when page changes
  useEffect(() => {
    if (allUsers.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setUsers(allUsers.slice(startIndex, endIndex));
    }
  }, [currentPage, allUsers]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUsers = generateMockUsers(50);
      setAllUsers(mockUsers);
      setTotalCount(mockUsers.length);
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setUsers(mockUsers.slice(startIndex, endIndex));
    } catch (err) {
      console.error('Error fetching users:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load users. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Migration
  const handleMigration = async (userId) => {
    try {
      const user = allUsers.find(u => u.id === userId);
      if (!user) return;
      
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Migrate User?',
        html: `
          <div class="text-left">
            <p class="mb-2">Are you sure you want to migrate this user?</p>
            <div class="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <p class="text-sm font-semibold">${user.fname} ${user.lname}</p>
              <p class="text-xs">CRN: ${user.crnno}</p>
              <p class="text-xs">Account: ${user.accountId}</p>
            </div>
            <p class="text-xs mt-3 text-yellow-600 dark:text-yellow-400">This action cannot be undone.</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Migrate!',
        cancelButtonText: 'Cancel',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });

      if (!result.isConfirmed) return;

      // Show loading
      Swal.fire({
        title: 'Migrating...',
        text: 'Please wait while we migrate the user.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user status locally
      const updatedUsers = allUsers.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              migration_status: "migrated",
              migration_date: new Date().toISOString().split('T')[0]
            }
          : u
      );
      
      setAllUsers(updatedUsers);
      
      // Update current page data
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setUsers(updatedUsers.slice(startIndex, endIndex));
      
      await Swal.fire({
        title: 'Success!',
        text: 'User migrated successfully.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      
    } catch (error) {
      console.error("Migration error:", error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to migrate user. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    }
  };

  // Handle file view
  const handleFileView = async (fileName, documentCategory) => {
    if (!fileName) {
      alert('No file available');
      return;
    }
    
    // For mock data, just show an alert
    Swal.fire({
      title: 'File Preview',
      html: `
        <div class="text-center">
          <div class="mb-4">
            <svg class="w-16 h-16 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <p class="font-medium">${fileName}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Category: ${documentCategory}</p>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-3">This is a mock file preview. In production, this would open the actual file.</p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#3b82f6',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-emerald-50/30"
      }`}>
        <div className="text-center">
          <RefreshCw className={`w-8 h-8 animate-spin mx-auto mb-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <p className={`text-lg font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Loading users data...
          </p>
        </div>
      </div>
    );
  }

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

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? "bg-emerald-900/30" : "bg-emerald-100"
                }`}>
                  <UserCog className={`w-6 h-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                  } bg-clip-text text-transparent`}>
                    Users Migration
                  </h1>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total Users: {totalCount} | Showing page {currentPage} of {totalPages}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={() => fetchUsers()}
              disabled={loading}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <UsersMigrationTable
          users={users}
          isDark={isDark}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onMigration={handleMigration}
          onFileView={handleFileView}
        />
      </div>
    </div>
  );
};

export default UsersMigration;