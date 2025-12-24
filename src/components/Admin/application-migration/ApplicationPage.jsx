"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import ApplicationMigrationTable from "./ApplicationTable";
import Swal from 'sweetalert2';

// Mock data generator for applications
const generateMockApplications = (count = 50) => {
  const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Raj", "Neha", "Vikram", "Anjali", "Sanjay", "Pooja"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Verma", "Reddy", "Joshi", "Desai", "Mehta", "Nair"];
  const loanStatuses = ["Sanctioned", "Approved", "Pending", "Rejected", "Disbursed"];
  const enquiryTypes = ["Online", "Branch", "Referral", "Agent", "Website"];
  const migrationStatuses = ["pending", "migrated"];
  
  const applications = [];
  
  for (let i = 1; i <= count; i++) {
    const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
    const loanStatus = loanStatuses[Math.floor(Math.random() * loanStatuses.length)];
    const enquiryType = enquiryTypes[Math.floor(Math.random() * enquiryTypes.length)];
    const migrationStatus = migrationStatuses[Math.floor(Math.random() * migrationStatuses.length)];
    
    // Generate dates
    const approvedDate = new Date();
    approvedDate.setDate(approvedDate.getDate() - Math.floor(Math.random() * 365));
    
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 400));
    
    const statusDate = new Date();
    statusDate.setDate(statusDate.getDate() - Math.floor(Math.random() * 30));
    
    // Generate amounts
    const appliedAmount = Math.floor(Math.random() * 1000000) + 50000;
    const approvedAmount = Math.floor(appliedAmount * (0.7 + Math.random() * 0.3)); // 70-100% of applied
    
    applications.push({
      id: 5000 + i,
      loan_no: `LN${String(5000 + i).padStart(6, '0')}`,
      crnno: `CRN${String(1000 + i).padStart(5, '0')}`,
      name: `${fname} ${lname}`,
      applied_amount: appliedAmount,
      approved_amount: approvedAmount,
      roi: (Math.random() * 5 + 8).toFixed(2), // 8-13% ROI
      tenure: [30, 60, 90, 180, 365][Math.floor(Math.random() * 5)],
      loan_term: Math.random() > 0.5 ? "One Time Payment" : "Monthly",
      loan_status: loanStatus,
      approval_note: loanStatus === "Sanctioned" ? "Application approved by manager" : 
                     loanStatus === "Rejected" ? "Insufficient documentation" : 
                     "Under review",
      enquiry_type: enquiryType,
      verify: Math.random() > 0.3 ? 1 : 0,
      report_check: Math.random() > 0.5 ? 1 : 0,
      profile_percent: Math.floor(Math.random() * 100),
      approved_date: approvedDate.toISOString().split('T')[0],
      created_at: createdDate.toISOString().split('T')[0],
      status_date: statusDate.toISOString().split('T')[0],
      emi_amount: loanStatus === "Disbursed" ? Math.floor(approvedAmount * 0.05) : 0,
      emi_no: loanStatus === "Disbursed" ? Math.floor(Math.random() * 12) + 1 : 0,
      totl_final_report: Math.random() > 0.5 ? "Recommended" : "Under Review",
      accountId: `ACC${String(2000 + i).padStart(5, '0')}`,
      admin_id: Math.floor(Math.random() * 10) + 1,
      migration_status: migrationStatus,
      migration_date: migrationStatus === "migrated" ? new Date().toISOString().split('T')[0] : null
    });
  }
  
  return applications;
};

const ApplicationMigration = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Data states
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Load mock data on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Update paginated data when page changes
  useEffect(() => {
    if (allApplications.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setApplications(allApplications.slice(startIndex, endIndex));
    }
  }, [currentPage, allApplications]);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockApplications = generateMockApplications(50);
      setAllApplications(mockApplications);
      setTotalCount(mockApplications.length);
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setApplications(mockApplications.slice(startIndex, endIndex));
    } catch (err) {
      console.error('Error fetching applications:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load applications. Please try again.',
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
  const handleMigration = async (applicationId) => {
    try {
      const application = allApplications.find(app => app.id === applicationId);
      if (!application) return;
      
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Migrate Application?',
        html: `
          <div class="text-left">
            <p class="mb-2">Are you sure you want to migrate this application?</p>
            <div class="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <p class="text-sm font-semibold">${application.loan_no} - ${application.name}</p>
              <p class="text-xs">CRN: ${application.crnno}</p>
              <p class="text-xs">Status: ${application.loan_status}</p>
              <p class="text-xs">Amount: ₹${application.approved_amount?.toLocaleString() || '0'}</p>
            </div>
            <p class="text-xs mt-3 text-yellow-600 dark:text-yellow-400">Migration will transfer all application data to the new system.</p>
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
        text: 'Please wait while we migrate the application.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update application status locally
      const updatedApplications = allApplications.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              migration_status: "migrated",
              migration_date: new Date().toISOString().split('T')[0],
              migration_remark: "Migrated to new system on " + new Date().toLocaleDateString()
            }
          : app
      );
      
      setAllApplications(updatedApplications);
      
      // Update current page data
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setApplications(updatedApplications.slice(startIndex, endIndex));
      
      await Swal.fire({
        title: 'Success!',
        text: 'Application migrated successfully.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      
    } catch (error) {
      console.error("Migration error:", error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to migrate application. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    }
  };

  if (loading && applications.length === 0) {
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
            Loading applications...
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
                  <FileText className={`w-6 h-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                  } bg-clip-text text-transparent`}>
                    Application Migration
                  </h1>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total Applications: {totalCount} | Showing page {currentPage} of {totalPages}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={() => fetchApplications()}
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
        <ApplicationMigrationTable
          applications={applications}
          isDark={isDark}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onMigration={handleMigration}
        />
      </div>
    </div>
  );
};

export default ApplicationMigration;