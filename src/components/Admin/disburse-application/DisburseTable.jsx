import React from "react";
import { FileText } from "lucide-react";
import Pagination from "../Pagination";
import DisburseRow from "./DisburseRow";

const DisburseTable = ({ 
    paginatedApplications, 
    filteredApplications,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onCall,
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
   onDocumentStatusClick 
   
}) => {

    const headerStyle = `px-6 py-5 text-left text-sm font-bold ${
    isDark ? "text-gray-100" : "text-gray-700"
  }`;

  // Table headers configuration with their respective widths
  const tableHeaders = [
    { label: "SR. No", width: "100px" },
    { label: "Call", width: "100px" },
    { label: "Loan No.", width: "120px" },
    { label: "CRN No.", width: "140px" },
    { label: "Account ID", width: "140px" },

    { label: "Approved Date", width: "160px" },

    { label: "Name", width: "200px" },
    { label: "Current Address", width: "180px" },
    { label: "Current State", width: "140px" },
    { label: "Current City", width: "120px" },
    { label: "Permanent Address", width: "180px" },
    { label: "State", width: "100px" },
    { label: "City", width: "100px" },
    { label: "Phone No.", width: "140px" },
    { label: "E-mail", width: "200px" },

    { label: "Amount Approved", width: "120px" },
    { label: "Admin Fee", width: "140px" },
    { label: "ROI", width: "80px" },
    { label: "Tenure", width: "100px" },

    { label: "Photo", width: "80px" },
    { label: "Pan Proof", width: "100px" },
    { label: "Address Proof", width: "120px" },
    { label: "ID Proof", width: "100px" },
    { label: "Salary Proof", width: "120px" },
    { label: "Bank Statement", width: "130px" },
    { label: "Video KYC", width: "100px" },
    { label: "Approval Note", width: "180px" },
    { label: "Enquiry Source", width: "140px" },
    { label: "Bank Verification Report", width: "180px" },
    { label: "Social Score Report", width: "160px" },
    { label: "Cibil Score Report", width: "160px" },
    { label: "NACH Form", width: "120px" },
    { label: "PDC", width: "80px" },
    { label: "Agreement", width: "120px" },

    { label: "Cheque No.", width: "120px" },
    { label: "Send To Courier", width: "140px" },
    { label: "Courier Picked", width: "140px" },
    { label: "Original Documents Received", width: "120px" },
    { label: "Disburse Behalf of E-mandate", width: "120px" },
    { label: "Loan Term", width: "120px" },
    { label: "Disbursal Account", width: "160px" },
    { label: "Customer A/c Verified", width: "180px" },
    { label: "Sanction Letter", width: "140px" },
    { label: "Emandate Status", width: "100px" },
    { label: "ICICI Emandate Status", width: "180px" },

    { label: "Ready For Approve", width: "180px" },
    { label: "Bank A/c Verification", width: "180px" },
    { label: "Disburse Approval", width: "160px" },

    // { label: "Disburse", width: "100px" },

    { label: "Loan Status", width: "120px" },
    { label: "Change Status", width: "200px" },
    { label: "Action", width: "140px" },
    { label: "Sanction Mail", width: "140px" },

    { label: "Remarks", width: "120px" },
    { label: "Document Status", width: "210px" },
    { label: "Appraisal Report", width: "160px" },
    { label: "Eligibility", width: "120px" },
    { label: "Replace KYC", width: "160px" },
  ];

  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "6000px" }}>
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
                <DisburseRow
                  key={application.id}
                  application={application}
                  index={index}
                  isDark={isDark}
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
                  onCall={onCall}
                  onDocumentStatusClick={onDocumentStatusClick}

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
          <div className="mt-8">
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

export default DisburseTable;