import React from "react";
import { FileText } from "lucide-react";
import EnquiriesRow from "./EnquiriesRow";
import Pagination from "../Pagination";

const EnquiriesTable = ({ 
  paginatedEnquiries,
  filteredEnquiries,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onUploadClick,
  onDetailClick,
  onFileView,
  onLoanEligibilityClick,
  onVerifyClick ,
  onCheckClick
}) => {
  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "2800px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}>
              <tr>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  SR. No.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "160px" }}>
                  Enquiry Source
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  CRN No
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  Account ID
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "160px" }}>
                  Enquiry Date
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  Enquiry Time
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "200px" }}>
                  Name
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  First Name
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Last Name
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Current Address
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Current State
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Current City
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "150px" }}>
                  Address
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  State
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  City
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  Phone No.
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "200px" }}>
                  E-mail
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Applied Loan
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Loan Amount
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  ROI
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Tenure
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  Loan Term
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "80px" }}>
                  Photo
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Pan Card
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Address Proof
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  ID Proof
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Salary Proof
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "130px" }}>
                  Bank Statement
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "160px" }}>
                  Bank Verification Report
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  Social Score Report
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  Cibil Score Report
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  Approval Note
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Status
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "120px" }}>
                  Action
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "140px" }}>
                  Appraisal Report
                </th>
                <th className={`px-6 py-5 text-left text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-700"
                }`} style={{ minWidth: "100px" }}>
                  Eligibility
                </th>
               
              </tr>
            </thead>
            <tbody>
              {paginatedEnquiries.map((enquiry, index) => (
                <EnquiriesRow
                key={enquiry.id}
                enquiry={enquiry}
                index={index}
                isDark={isDark}
                onUploadClick={onUploadClick}
                onDetailClick={onDetailClick}
                onFileView={onFileView}
                onLoanEligibilityClick={onLoanEligibilityClick}
                onVerifyClick={onVerifyClick}
                onCheckClick={onCheckClick}

              />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedEnquiries.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No enquiries found</p>
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
              totalItems={filteredEnquiries.length}  
              itemsPerPage={itemsPerPage}   
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EnquiriesTable;