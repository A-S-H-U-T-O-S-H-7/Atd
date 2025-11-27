import React from "react";
import { FileText } from "lucide-react";
import Pagination from "../Pagination";
import FollowUpRow from "./FollowUpRow";

const FollowUpTable = ({ 
  paginatedApplications, 
  filteredApplications,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onFileView,
  onActionClick,
  onLoanEligibilityClick,  
  onCheckClick, 
  onReplaceKYCClick,
  fileLoading,
  loadingFileName,
  onStatusUpdate,
    onActivateAccount,
  onOpenStatusModal 
}) => {

  const headerStyle = `px-2 py-3 text-center text-sm font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
  }`;

  // Table headers configuration with their respective widths
  const tableHeaders = [
    { label: "SR. No", width: "100px" },
    { label: "Call", width: "80px" },
    { label: "Enquiry Source", width: "100px" },
    { label: "Account Activation", width: "140px" },
    { label: "CRN No.", width: "80px" },
    { label: "Account ID", width: "100px" },
    { label: "Enquiry Date", width: "160px" },
    { label: "Name", width: "160px" },
    { label: "Current Address", width: "150px" },
    { label: "Current State", width: "110px" },
    { label: "Current City", width: "110px" },
    { label: "Permanent Address", width: "150px" },
    { label: "State", width: "90px" },
    { label: "City", width: "90px" },
    { label: "Phone No.", width: "90px" },
    { label: "E-mail", width: "200px" },
    { label: "Applied Loan", width: "110px" },
    { label: "Loan Amount", width: "110px" },
    { label: "ROI", width: "60px" },
    { label: "Tenure", width: "90px" },
    { label: "Loan Term", width: "90px" },
    { label: "Photo", width: "80px" },
    { label: "Pan Proof", width: "90px" },
    { label: "Address Proof", width: "120px" },
    { label: "ID Proof", width: "90px" },
    { label: "Salary Proof", width: "120px" },
    { label: "Bank Statement", width: "130px" },
    { label: "Bank Verification Report", width: "140px" },
    { label: "Social Score Report", width: "120px" },
    { label: "Cibil Score Report", width: "120px" },
    { label: "Approval Note", width: "110px" },
    { label: "Status", width: "120px" },
    { label: "Action", width: "140px" },
    { label: "Appraisal Report", width: "120px" },
    { label: "Eligibility", width: "120px" },
    { label: "Replace KYC", width: "120px" },
    { label: "BlackList", width: "120px" },
  ];

  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "1500px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                {tableHeaders.map((header, index) => (
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
                <FollowUpRow
                  key={application.id}
                  application={application}
                  index={index}
                  isDark={isDark}
                  onFileView={onFileView}
                  onActionClick={onActionClick}
                  onLoanEligibilityClick={onLoanEligibilityClick}  
                  onCheckClick={onCheckClick}
                  onReplaceKYCClick={onReplaceKYCClick}
                  fileLoading={fileLoading}
                  loadingFileName={loadingFileName}
                  onStatusUpdate={onStatusUpdate}
                  onActivateAccount={onActivateAccount}
                  onOpenStatusModal={onOpenStatusModal} 
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
      </div>
    </>
  );
};

export default FollowUpTable;