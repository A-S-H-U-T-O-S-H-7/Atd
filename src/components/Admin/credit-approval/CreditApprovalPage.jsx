"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import AdvancedSearchBar from "../AdvanceSearchBar";
import { mockApplicationsData } from "@/lib/MockApplicationData";
import ChequeModal from "../application-modals/ChequeSubmit";
import SendToCourierModal from "../application-modals/SendToCourierModal";
import CourierPickedModal from "../application-modals/CourierPickedModal";
import OriginalDocumentsModal from "../application-modals/OriginalDocumentsModal";
import DisburseEmandateModal from "../application-modals/DisburseEmandateModal";
import ChangeStatusModal from "../application-modals/StatusModal";
import CreditApprovalTable from "./CreditApprovalTable";
import RefundPDCModal from "../application-modals/RefundPdcModal";
import CallDetailsModal from "../CallDetailsModal";
import { useThemeStore } from "@/lib/store/useThemeStore";

 
const CreditApprovalPage = () => {
  const { theme } = useThemeStore();
    const isDark = theme === "dark";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loanStatusFilter, setLoanStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [chequeModalOpen, setChequeModalOpen] = useState(false);
const [currentApplication, setCurrentApplication] = useState(null);
const [currentChequeNo, setCurrentChequeNo] = useState('');
const [courierModalOpen, setCourierModalOpen] = useState(false);
const [currentCourierApplication, setCurrentCourierApplication] = useState(null);
const [courierPickedModalOpen, setCourierPickedModalOpen] = useState(false);
const [currentCourierPickedApplication, setCurrentCourierPickedApplication] = useState(null);
const [originalDocumentsModalOpen, setOriginalDocumentsModalOpen] = useState(false);
const [currentOriginalDocumentsApplication, setCurrentOriginalDocumentsApplication] = useState(null);

const [disburseEmandateModalOpen, setDisburseEmandateModalOpen] = useState(false);
const [currentDisburseEmandateApplication, setCurrentDisburseEmandateApplication] = useState(null);
const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
const [currentChangeStatusApplication, setCurrentChangeStatusApplication] = useState(null);

const [refundPDCModalOpen, setRefundPDCModalOpen] = useState(false);
const [currentRefundPDCApplication, setCurrentRefundPDCApplication] = useState(null);
const [showCallModal, setShowCallModal] = useState(false);
      const [selectedApplicant, setSelectedApplicant] = useState(null);

const handleChequeModalOpen = (application, chequeNumber) => {
  setCurrentApplication(application);
  setCurrentChequeNo(chequeNumber);
  setChequeModalOpen(true);
};

const handleChequeModalClose = () => {
  setChequeModalOpen(false);
  setCurrentApplication(null);
  setCurrentChequeNo('');
};

const handleChequeSubmit = async (newChequeNo) => {
  try {
    // Your API call here
    console.log('Cheque number saved:', newChequeNo);
    // Update the application data if needed
  } catch (error) {
    console.error('Error saving cheque number:', error);
    throw error;
  }
};

const handleOriginalDocumentsModalOpen = (application) => {
  setCurrentOriginalDocumentsApplication(application);
  setOriginalDocumentsModalOpen(true);
};

const handleOriginalDocumentsModalClose = () => {
  setOriginalDocumentsModalOpen(false);
  setCurrentOriginalDocumentsApplication(null);
};

const handleOriginalDocumentsSubmit = async (receivedDate) => {
  try {
    // Your API call here to save original documents received date
    console.log('Original documents received date saved:', receivedDate);
    
    // Update the application data
    setApplications(prev => 
      prev.map(app => 
        app.id === currentOriginalDocumentsApplication.id 
          ? { ...app, originalDocuments: 'Yes', originalDocumentsDate: receivedDate }
          : app
      )
    );
  } catch (error) {
    console.error('Error saving original documents received date:', error);
    throw error;
  }
};


const handleRefundPDCModalOpen = (application) => {
  setCurrentRefundPDCApplication(application);
  setRefundPDCModalOpen(true);
};

const handleRefundPDCModalClose = () => {
  setRefundPDCModalOpen(false);
  setCurrentRefundPDCApplication(null);
};

const handleRefundPDCSubmit = async (refundStatus) => {
  try {
    console.log('Refund PDC status saved:', refundStatus);
    
    // Update the application data
    setApplications(prev => 
      prev.map(app => 
        app.id === currentRefundPDCApplication.id 
          ? { ...app, refundPdc: refundStatus }
          : app
      )
    );
  } catch (error) {
    console.error('Error saving refund PDC status:', error);
    throw error;
  }
};

// Add these handlers with your existing handlers
const handleChangeStatusModalOpen = (application) => {
  setCurrentChangeStatusApplication(application);
  setChangeStatusModalOpen(true);
};

const handleChangeStatusModalClose = () => {
  setChangeStatusModalOpen(false);
  setCurrentChangeStatusApplication(null);
};

const handleChangeStatusSubmit = async (updateData) => {
  try {
    // Your API call here to save the status changes
    console.log('Status changes saved:', updateData);
    
    // Update the application data
    setApplications(prev => 
      prev.map(app => 
        app.id === currentChangeStatusApplication.id 
          ? { 
              ...app, 
              ...(updateData.courierPickedDate && { courierPickedDate: updateData.courierPickedDate }),
              ...(updateData.originalDocumentsReceived && { originalDocumentsReceived: updateData.originalDocumentsReceived })
            }
          : app
      )
    );
  } catch (error) {
    console.error('Error saving status changes:', error);
    throw error;
  }
};
// Add these handlers with your existing ones
const handleDisburseEmandateModalOpen = (application) => {
  setCurrentDisburseEmandateApplication(application);
  setDisburseEmandateModalOpen(true);
};

const handleDisburseEmandateModalClose = () => {
  setDisburseEmandateModalOpen(false);
  setCurrentDisburseEmandateApplication(null);
};

const handleDisburseEmandateSubmit = async (selectedOption) => {
  try {
    // Your API call here to save disburse e-mandate option
    console.log('Disburse e-mandate option saved:', selectedOption);
    
    // Update the application data
    setApplications(prev => 
      prev.map(app => 
        app.id === currentDisburseEmandateApplication.id 
          ? { ...app, receivedDisburse: selectedOption }
          : app
      )
    );
  } catch (error) {
    console.error('Error saving disburse e-mandate option:', error);
    throw error;
  }
};

const handleCourierPickedModalOpen = (application) => {
  setCurrentCourierPickedApplication(application);
  setCourierPickedModalOpen(true);
};

const handleCourierPickedModalClose = () => {
  setCourierPickedModalOpen(false);
  setCurrentCourierPickedApplication(null);
};

const handleCourierPickedSubmit = async (pickedDate) => {
  try {
    // Your API call here to save courier picked date
    console.log('Courier picked date saved:', pickedDate);
    
    // Update the application data
    setApplications(prev => 
      prev.map(app => 
        app.id === currentCourierPickedApplication.id 
          ? { ...app, courierPicked: 'Yes', courierPickedDate: pickedDate }
          : app
      )
    );
  } catch (error) {
    console.error('Error saving courier picked date:', error);
    throw error;
  }
};

// Add courier modal handlers
const handleCourierModalOpen = (application) => {
  setCurrentCourierApplication(application);
  setCourierModalOpen(true);
};

const handleCourierModalClose = () => {
  setCourierModalOpen(false);
  setCurrentCourierApplication(null);
};

const handleCourierSubmit = async (courierDate) => {
  try {
    // Your API call here to save courier date
    console.log('Courier date saved:', courierDate);
    
    // Update the application data
    setApplications(prev => 
      prev.map(app => 
        app.id === currentCourierApplication.id 
          ? { ...app, sendToCourier: 'Yes', courierDate: courierDate }
          : app
      )
    );
  } catch (error) {
    console.error('Error saving courier date:', error);
    throw error;
  }
};

const handleLoanEligibilityClick = (application) => {
  localStorage.setItem('selectedEnquiry', JSON.stringify(application));
  router.push(`/crm/loan-eligibility/${application.id}`);
};

const handleCheckClick = (application) => {
  localStorage.setItem('selectedEnquiry', JSON.stringify(application));
  router.push(`/crm/appraisal-report/${application.id}`);
};

const handleReplaceKYCClick = (application) => {
  localStorage.setItem('selectedEnquiry', JSON.stringify(application));
  router.push(`/crm/replace-kyc/${application.id}`);
};
const handleActionClick = (application) => {
    localStorage.setItem('selectedEnquiry', JSON.stringify(application));
    router.push(`/crm/application-form/${application.id}`);
  };

  const handleCall = (applicant) => {
  setSelectedApplicant(applicant);
  setShowCallModal(true);
};


  // Advanced Search States
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  

  // Data states
  const [applications, setApplications] = useState(mockApplicationsData);
  const [totalCount, setTotalCount] = useState(mockApplicationsData.length);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const SearchOptions = [
    { value: 'loanNo', label: 'Loan No.' },
    { value: 'crnNo', label: 'CRN No.' },
    { value: 'accountId', label: 'Account ID' },
    { value: 'name', label: 'Name' },
    { value: 'phoneNo', label: 'Phone Number' },
    { value: 'email', label: 'Email' },
    { value: 'appliedAmount', label: 'Applied Amount' },
    { value: 'approvedAmount', label: 'Approved Amount' },
  ];

  // Simulate data fetching
  const fetchApplications = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setIsAutoRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter applications based on search and date filters
      let filteredData = [...mockApplicationsData];
      
      // Apply search filter
      if (searchField && searchTerm) {
        filteredData = filteredData.filter(app => {
          const fieldValue = app[searchField]?.toString().toLowerCase() || "";
          return fieldValue.includes(searchTerm.toLowerCase());
        });
      }
      
     
      
      setApplications(filteredData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
      setIsAutoRefreshing(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchApplications();
  }, [searchField, searchTerm,]);

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchApplications(true);
      }
    }, 60000); // 1 minute
  
    return () => clearInterval(interval);
  }, [searchField, searchTerm,]);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchApplications(true);
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle Advanced Search
  const handleAdvancedSearch = ({ field, term }) => {
    setSearchField(field);
    setSearchTerm(term);
    setCurrentPage(1);
  };

  

  // Clear all filters
  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setStatusFilter("all");
    setLoanStatusFilter("all");
    setCurrentPage(1);
  };

  // Client-side filtering
  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === "all" || 
      app.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesLoanStatus = loanStatusFilter === "all" || 
      app.loanStatus.toLowerCase() === loanStatusFilter.toLowerCase();
    return matchesStatus && matchesLoanStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex).map((app, index) => ({
    ...app,
    srNo: startIndex + index + 1
  }));


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
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Credit Approval ({totalCount})
              </h1>
            </div>
            
            
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-800 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

          

          {/* Search and Status Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <AdvancedSearchBar 
                searchOptions={SearchOptions}
                onSearch={handleAdvancedSearch}
                isDark={isDark}
              />
            </div>

           
          </div>

          {/* Filter Summary */}
          {(searchTerm   || statusFilter !== "all" || loanStatusFilter !== "all") && (
            <div className={`mb-4 p-4 rounded-lg border ${
              isDark ? "bg-gray-800/50 border-emerald-600/30" : "bg-emerald-50/50 border-emerald-200"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    Active Filters:
                  </span>
                  {searchTerm && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {SearchOptions.find(opt => opt.value === searchField)?.label}: {searchTerm}
                    </span>
                  )}
                  
                  {statusFilter !== "all" && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      Status: {statusFilter}
                    </span>
                  )}
                  {loanStatusFilter !== "all" && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      Loan Status: {loanStatusFilter}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Showing {filteredApplications.length} of {totalCount} applications
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className={`text-sm px-3 py-1 rounded-md ${
                      isDark 
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <CreditApprovalTable
  paginatedApplications={paginatedApplications}
  filteredApplications={filteredApplications}
  currentPage={currentPage}
  totalPages={Math.ceil(filteredApplications.length / itemsPerPage)}
  itemsPerPage={itemsPerPage}
  isDark={isDark}
  onPageChange={setCurrentPage}
  onActionClick={handleActionClick}
  loading={loading}
  onChequeModalOpen={handleChequeModalOpen}
  onCourierModalOpen={handleCourierModalOpen}
  onCourierPickedModalOpen={handleCourierPickedModalOpen}
  onOriginalDocumentsModalOpen={handleOriginalDocumentsModalOpen}  
  onDisburseEmandateModalOpen={handleDisburseEmandateModalOpen}
  onChangeStatusClick={handleChangeStatusModalOpen} 
  onRefundPDCClick={handleRefundPDCModalOpen}
  onLoanEligibilityClick={handleLoanEligibilityClick}  
  onCheckClick={handleCheckClick}
  onReplaceKYCClick={handleReplaceKYCClick}  
            onCall={handleCall}   
 
/>
      </div>
<CallDetailsModal isOpen={showCallModal} onClose={() => {
          setShowCallModal(false);
          setSelectedApplicant(null);
        }} data={selectedApplicant} isDark={isDark}  />


      {currentRefundPDCApplication && (
  <RefundPDCModal
    isOpen={refundPDCModalOpen}
    onClose={handleRefundPDCModalClose}
    onSubmit={handleRefundPDCSubmit}
    isDark={isDark}
    customerName={currentRefundPDCApplication.name}
    loanNo={currentRefundPDCApplication.loanNo}
  />
)}
      {currentApplication && (
  <ChequeModal
    isOpen={chequeModalOpen}
    onClose={handleChequeModalClose}
    onSubmit={handleChequeSubmit}
    isDark={isDark}
    initialChequeNo={currentChequeNo}
    customerName={currentApplication.name}
    isEdit={!!currentChequeNo}
  />
)}

{currentCourierApplication && (
  <SendToCourierModal
    isOpen={courierModalOpen}
    onClose={handleCourierModalClose}
    onSubmit={handleCourierSubmit}
    isDark={isDark}
    customerName={currentCourierApplication.name}
    loanNo={currentCourierApplication.loanNo}
  />
)}

{currentCourierPickedApplication && (
  <CourierPickedModal
    isOpen={courierPickedModalOpen}
    onClose={handleCourierPickedModalClose}
    onSubmit={handleCourierPickedSubmit}
    isDark={isDark}
    customerName={currentCourierPickedApplication.name}
    loanNo={currentCourierPickedApplication.loanNo}
  />
)}
{currentOriginalDocumentsApplication && (
  <OriginalDocumentsModal
    isOpen={originalDocumentsModalOpen}
    onClose={handleOriginalDocumentsModalClose}
    onSubmit={handleOriginalDocumentsSubmit}
    isDark={isDark}
    customerName={currentOriginalDocumentsApplication.name}
    loanNo={currentOriginalDocumentsApplication.loanNo}
  />
)}
{currentDisburseEmandateApplication && (
  <DisburseEmandateModal
    isOpen={disburseEmandateModalOpen}
    onClose={handleDisburseEmandateModalClose}
    onSubmit={handleDisburseEmandateSubmit}
    isDark={isDark}
    customerName={currentDisburseEmandateApplication.name}
    loanNo={currentDisburseEmandateApplication.loanNo}
  />
)}

{currentChangeStatusApplication && (
  <ChangeStatusModal
    isOpen={changeStatusModalOpen}
    onClose={handleChangeStatusModalClose}
    onSubmit={handleChangeStatusSubmit}
    isDark={isDark}
    customerName={currentChangeStatusApplication.name}
    loanNo={currentChangeStatusApplication.loanNo}
  />
)}


    </div>
  );
};

export default CreditApprovalPage;