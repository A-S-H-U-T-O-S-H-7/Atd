import React, { useState } from "react";
import { 
  FileText, 
  ChevronDown, 
  ChevronRight,
  User,
  File,
  DollarSign,
  Settings,
  Grid,
  IndianRupee
} from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import Pagination from "../Pagination";
import ApplicationRow from "./ManageApplicationRow";
import { motion, AnimatePresence } from "framer-motion";

const ManageApplicationTable = ({ 
  paginatedApplications, 
  filteredApplications,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onFileView,
  onActionClick,
  onChequeModalOpen,
  onCourierModalOpen,
  onCourierPickedModalOpen,
  onOriginalDocumentsModalOpen,
  onDisburseEmandateModalOpen,
  onChangeStatusClick,
  onRemarksClick,
  onRefundPDCClick,
  onLoanEligibilityClick,  
  onCheckClick, 
  onReplaceKYCClick, 
  onDocumentStatusClick,
  fileLoading,
  loadingFileName,
  onReadyForApprove,
  onBankVerification,
  onDisburseApproval,
  onCollectionClick,
  onNOCModalOpen,
}) => {

  // State for collapsed sections
  const [collapsedSections, setCollapsedSections] = useState({
    personalInfo: true,
    loanDetails: true,
    documents: true,
    otherDetails: true
  });

  // Toggle section function
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Define column groups with metadata
  const columnGroups = {
    fixed: [
      { label: "SR. No", width: "90px" },
      { label: "Call", width: "20px" },
      { label: "Collection", width: "90px" },
      { label: "Name", width: "150px" },
      { label: "Loan No.", width: "80px" },
      { label: "CRN No.", width: "60px" },
      { label: "Approved Date", width: "100px" },
      { label: "Disburse Date", width: "120px" },
      { label: "Due Date", width: "120px" },

    ],
    personalInfo: [
      { label: "Current Address", width: "150px" },
      { label: "Current State", width: "80px" },
      { label: "Current City", width: "100px" },
      { label: "Permanent Address", width: "180px" },
      { label: "State", width: "80px" },
      { label: "City", width: "80px" },
      { label: "Phone No.", width: "100px" },
      { label: "E-mail", width: "200px" },
    ],
    loanDetails: [
      { label: "Applied Amount", width: "90px" },
      { label: "Amount Approved", width: "90px" },
      { label: "Admin Fee", width: "60px" },
      { label: "ROI", width: "50px" },
      { label: "Tenure", width: "70px" },
    ],
    documents: [
      { label: "Photo", width: "40px" },
      { label: "Pan Proof", width: "40px" },
      { label: "Address Proof", width: "40px" },
      { label: "ID Proof", width: "40px" },
      { label: "Salary Proof", width: "120px" },
      { label: "Bank Statement", width: "60px" },
      { label: "Video KYC", width: "80px" },
      { label: "Approval Note", width: "140px" },
      { label: "Enquiry Source", width: "80px" },
      { label: "Bank Verification Report", width: "100px" },
      { label: "Social Score Report", width: "80px" },
      { label: "Cibil Score Report", width: "80px" },
      { label: "NACH Form", width: "80px" },
      { label: "PDC", width: "80px" },
      { label: "Agreement", width: "80px" },
    ],
    otherDetails: [
      { label: "Cheque No.", width: "80px" },
      { label: "Send To Courier", width: "80px" },
      { label: "Courier Picked", width: "80px" },
      { label: "Original Documents Received", width: "80px" },
      { label: "Disburse Behalf of E-mandate", width: "130px" },
      { label: "Loan Term", width: "150px" },
      { label: "Disbursal Account", width: "160px" },
      { label: "Customer A/c Verified", width: "120px" },
      { label: "Sanction Letter", width: "80px" },
      { label: "ICICI Emandate Status", width: "180px" },
      { label: "Bank A/c Verification", width: "80px" },
      { label: "Disburse Approval", width: "60px" },
      { label: "Disburse", width: "100px" },
    ],
    actions: [
      { label: "Action", width: "140px" },
      { label: "Remarks", width: "120px" },
      { label: "Document Status", width: "160px" },
      { label: "NOC", width: "120px" },
      { label: "Refund PDC", width: "120px" },
      { label: "Appraisal Report", width: "120px" },
      { label: "Eligibility", width: "120px" },
      { label: "Replace KYC", width: "120px" },
      { label: "Settled", width: "100px" },
    ]
  };

  // Get all visible headers
  const getVisibleHeaders = () => {
    return [
      ...columnGroups.fixed,
      ...(!collapsedSections.personalInfo ? columnGroups.personalInfo : []),
      ...(!collapsedSections.loanDetails ? columnGroups.loanDetails : []),
      ...(!collapsedSections.documents ? columnGroups.documents : []),
      ...(!collapsedSections.otherDetails ? columnGroups.otherDetails : []),
      ...columnGroups.actions
    ];
  };

  const headerStyle = `px-2 py-3 text-center text-sm font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
  }`;

  // Expand all / Collapse all
  const expandAll = () => {
    setCollapsedSections({
      personalInfo: false,
      loanDetails: false,
      documents: false,
      otherDetails: false
    });
  };

  const collapseAll = () => {
    setCollapsedSections({
      personalInfo: true,
      loanDetails: true,
      documents: true,
      otherDetails: true
    });
  };

  return (
    <>
    {/* Loan Status Color Indicators */}
    <div className={`flex justify-end items-center gap-6 mb-4 px-3   ${
      isDark ? "bg-gray-900 " : "bg-gray-50/80 "
    }`}>
      {/* Closed Loans Indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-5 h-5 rounded-sm ${
          isDark ? "bg-orange-900/60 border border-orange-700/50" : "bg-orange-100 border border-orange-300"
        }`}></div>
        <span className={`text-xs font-medium tracking-wide ${
          isDark ? "text-orange-200" : "text-orange-700"
        }`}>
          Closed
        </span>
      </div>
      
      {/* Renewal Loans Indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-5 h-5 rounded-sm ${
          isDark ? "bg-blue-900/50 border border-blue-700/40" : "bg-blue-50 border border-blue-300"
        }`}></div>
        <span className={`text-xs font-medium tracking-wide ${
          isDark ? "text-blue-200" : "text-blue-700"
        }`}>
          Renewal
        </span>
      </div>
       </div>

      {/* Minimal Compact Controls - Integrated with table */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          
          {/* Column Group Controls */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isDark ? "bg-gray-800/50" : "bg-gray-100"
          }`}>
            <Grid className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
            <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Column Groups:
            </span>
          </div>

          {/* Personal Info Toggle */}
          <button
            onClick={() => toggleSection('personalInfo')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
              collapsedSections.personalInfo
                ? isDark 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : isDark
                  ? "bg-emerald-700/30 hover:bg-emerald-700/40 text-emerald-300 border border-emerald-500/30"
                  : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal</span>
            {collapsedSections.personalInfo ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          
          {/* Loan Details Toggle */}
          <button
            onClick={() => toggleSection('loanDetails')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
              collapsedSections.loanDetails
                ? isDark 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : isDark
                  ? "bg-amber-700/30 hover:bg-amber-700/40 text-amber-300 border border-amber-500/30"
                  : "bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300"
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />


            <span>Loan</span>
            {collapsedSections.loanDetails ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Documents Toggle */}
          <button
            onClick={() => toggleSection('documents')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
              collapsedSections.documents
                ? isDark 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : isDark
                  ? "bg-purple-700/30 hover:bg-purple-700/40 text-purple-300 border border-purple-500/30"
                  : "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300"
            }`}
          >
            <File className="w-3.5 h-3.5" />
            <span>Documents</span>
            {collapsedSections.documents ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Other Details Toggle */}
          <button
            onClick={() => toggleSection('otherDetails')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
              collapsedSections.otherDetails
                ? isDark 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : isDark
                  ? "bg-blue-700/30 hover:bg-blue-700/40 text-blue-300 border border-blue-500/30"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Details</span>
            {collapsedSections.otherDetails ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              isDark 
                ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              isDark 
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Collapse All
          </button>
        </div>
      </div>

      

      {/* Animated Table */}
      <motion.div
        key={JSON.stringify(collapsedSections)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "200px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                {getVisibleHeaders().map((header, index) => (
                  <th 
                    key={index}
                    className={headerStyle}
                    style={{ minWidth: header.width }}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedApplications.map((application, index) => (
                <ApplicationRow
                  key={application.id}
                  application={application}
                  index={index}
                  isDark={isDark}
                  visibleHeaders={getVisibleHeaders()}
                  onFileView={onFileView}
                  onActionClick={onActionClick}
                  onChequeModalOpen={onChequeModalOpen}
                  onCourierModalOpen={onCourierModalOpen}
                  onCourierPickedModalOpen={onCourierPickedModalOpen}
                  onOriginalDocumentsModalOpen={onOriginalDocumentsModalOpen}
                  onDisburseEmandateModalOpen={onDisburseEmandateModalOpen}
                  onChangeStatusClick={onChangeStatusClick}
                  onRemarksClick={onRemarksClick}
                  onRefundPDCClick={onRefundPDCClick}
                  onLoanEligibilityClick={onLoanEligibilityClick}  
                  onCheckClick={onCheckClick}
                  onReplaceKYCClick = {onReplaceKYCClick}
                  
                  onDocumentStatusClick={onDocumentStatusClick}
                  fileLoading={fileLoading}
                  loadingFileName={loadingFileName}
                  onReadyForApprove={onReadyForApprove}
                  onBankVerification={onBankVerification}
                  onDisburseApproval={onDisburseApproval}
                  onCollectionClick={onCollectionClick}
                  onNOCModalOpen = {onNOCModalOpen}
                  />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedApplications.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No applications found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
        
        {totalPages > 0 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={filteredApplications.length}  
              itemsPerPage={itemsPerPage}   
            />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ManageApplicationTable;