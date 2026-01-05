import React from "react";
import { FileText } from "lucide-react";
import Pagination from "../Pagination";
import SanctionRow from "./SanctionRow";

const SanctionTable = ({ 
    paginatedApplications, 
    filteredApplications,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onCall,
  onFileView, 
  onVerifyClick,
  onChequeModalOpen,
  onCourierModalOpen,
  onCourierPickedModalOpen,
  onOriginalDocumentsModalOpen,
  onDisburseEmandateModalOpen,
  onChangeStatusClick,
  onRemarksClick,
  onRefundPDCClick,
  fileLoading,
  loadingFileName,
  onStatusClick,
}) => {

    const headerStyle = `px-2 py-3 text-center text-sm font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/80" : "text-gray-700 border-gray-300/80"
  }`;

  // Table headers configuration with their respective widths
  const tableHeaders = [
    { label: "SR. No", width: "100px" },
    { label: "Call", width: "70px" },
    { label: "Loan No.", width: "90px" },
    { label: "CRN No.", width: "90px" },
    { label: "Approved Date", width: "80px" },
    
    { label: "Name", width: "160px" },
    { label: "Current Address", width: "150px" },
    { label: "Current State", width: "110px" },
    { label: "Current City", width: "110px" },
    { label: "Permanent Address", width: "150px" },
    { label: "State", width: "100px" },
    { label: "City", width: "90px" },
    { label: "Phone No.", width: "100px" },
    { label: "E-mail", width: "200px" },

    { label: "Amount Approved", width: "120px" },
    { label: "Admin Fee", width: "70px" },
    { label: "ROI", width: "60px" },
    { label: "Tenure", width: "80px" },
   
    { label: "Photo", width: "80px" },
    { label: "Pan Proof", width: "90px" },
    { label: "Address Proof", width: "120px" },
    { label: "ID Proof", width: "80px" },
    { label: "Salary Proof", width: "120px" },
    { label: "Bank Statement", width: "130px" },
    { label: "Second Bank Statement", width: "60px" },
    { label: "Video KYC", width: "100px" },

    { label: "Approval Note", width: "140px" }, 
    { label: "Enquiry Source", width: "100px" },
    { label: "Bank Verification Report", width: "140px" },
    { label: "Bank Fraud Report", width: "100px" },
    { label: "Social Score Report", width: "120px" },
    { label: "Cibil Score Report", width: "120px" },
    { label: "NACH ", width: "120px" },
    { label: "PDC", width: "80px" },
    { label: "Agreement", width: "120px" },
    { label: "Cheque No.", width: "120px" },
    { label: "Send To Courier", width: "140px" },
    { label: "Courier Picked", width: "140px" },
    { label: "Original Documents Received", width: "120px" },
    { label: "Disburse Behalf of E-mandate", width: "120px" },
    { label: "Loan Term", width: "90px" },
    { label: "Customer A/c Verified", width: "120px" },
    { label: "Sanction Letter", width: "140px" },
    { label: "Sanction Mail", width: "140px" },
    { label: "ICICI Emandate Status", width: "180px" },
    
    { label: "Loan Status", width: "100px" },
    { label: "Change Status", width: "170px" },
    { label: "Action", width: "140px" },
    
    { label: "Appraisal Report", width: "120px" },
    { label: "Eligibility", width: "60px" },
    { label: "Replace KYC", width: "120px" },
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
                <SanctionRow
                  key={application.id}
                  application={application}
                  index={index}
                  isDark={isDark}
                  onFileView={onFileView}
                  onChequeModalOpen={onChequeModalOpen}
                  onCourierModalOpen={onCourierModalOpen}
                  onCourierPickedModalOpen={onCourierPickedModalOpen}
                  onOriginalDocumentsModalOpen={onOriginalDocumentsModalOpen}
                  onDisburseEmandateModalOpen={onDisburseEmandateModalOpen}
                  onChangeStatusClick={onChangeStatusClick}
                  onRemarksClick={onRemarksClick}
                  onRefundPDCClick={onRefundPDCClick}
                  onStatusClick={onStatusClick}
                  fileLoading={fileLoading}
                  loadingFileName={loadingFileName}
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

export default SanctionTable;