import React from "react";
import {
  Calendar,
  Clock,
    X,FileCheck
} from "lucide-react";
import { IoDocumentAttach } from "react-icons/io5";

const EnquiriesRow = ({
  enquiry,
  index,
  isDark,
  onFileView
}) => {
  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case "pending":
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const DocumentIcon = ({ hasDoc, onClick, title }) => (
    <div className="flex items-center justify-center">
      {hasDoc ? (
        <button
          onClick={onClick}
          className="p-2 rounded-lg transition-colors duration-200 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 cursor-pointer"
          title={title}
        >
          <IoDocumentAttach className="text-lg" />
        </button>
      ) : (
        <div
          className="p-1 rounded-lg bg-red-100 text-red-600"
          title="Document Missing"
        >
          <X size={16} />
        </div>
      )}
    </div>
  );

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${isDark
        ? "border-emerald-700 hover:bg-gray-700/50"
        : "border-emerald-300 hover:bg-emerald-50/50"} ${index % 2 === 0
        ? isDark ? "bg-gray-700/30" : "bg-gray-50"
        : ""}`}
    >
      {/* SR No */}
      <td className="px-6 py-4">
        <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {enquiry.srNo}
        </span>
      </td>

      {/* Enquiry Source */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.enquirySource}
        </span>
      </td>

      {/* CRN No */}
      <td className="px-6 py-4">
        <span className={`text-sm font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
          {enquiry.crnNo}
        </span>
      </td>

      {/* Account ID */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.accountId}
        </span>
      </td>

      {/* Enquiry Date */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {enquiry.enquiryDate}
          </span>
        </div>
      </td>

      {/* Enquiry Time */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {enquiry.enquiryTime}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className="px-6 py-4">
        <span className={`font-medium text-sm ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {enquiry.name}
        </span>
      </td>

      {/* First Name */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.firstName}
        </span>
      </td>

      {/* Last Name */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.lastName}
        </span>
      </td>

      {/* Current Address */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.currentAddress}
        </span>
      </td>

      {/* Current State */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.currentState}
        </span>
      </td>

      {/* Current City */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.currentCity}
        </span>
      </td>

      {/* Address */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.address}
        </span>
      </td>

      {/* State */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.state}
        </span>
      </td>

      {/* City */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.city}
        </span>
      </td>

      {/* Phone No */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {enquiry.phoneNo}
          </span>
        </div>
      </td>

      {/* E-mail */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {enquiry.email}
          </span>
        </div>
      </td>

      {/* Applied Loan */}
      <td className="px-6 py-4">
      <span className="text-sm font-semibold text-green-500  px-1 py-0.5 rounded">₹</span>
        <span className={`text-sm font-semibold ${isDark ? "text-green-500" : "text-green-700"}`}>
          {enquiry.appliedLoan}
        </span>
      </td>

      {/* Loan Amount */}
      <td className="px-6 py-4">
        <div className="flex bg-orange-500 rounded-md p-1 items-center space-x-1">
          <span className="text-xs  text-white px-1 py-0.5 rounded">₹</span>
          <span className={`text-sm  font-medium ${isDark ? "text-gray-100" : "text-gray-100"}`}>
            {enquiry.loanAmount}
          </span>
        </div>
      </td>

      {/* ROI */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.roi}
        </span>
      </td>

      {/* Tenure */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.tenure}
        </span>
      </td>

      {/* Loan Term */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.loanTerm}
        </span>
      </td>

      {/* Photo */}
      <td className="px-6 py-4">
        <FileCheck
          hasDoc={enquiry.hasPhoto}
          onClick={() => onFileView(enquiry, "photo")}
          title="View Photo"
        />
      </td>

      {/* Pan Card */}
      <td className="px-6 py-4">
        <FileCheck
          hasDoc={enquiry.hasPanCard}
          onClick={() => onFileView(enquiry, "pancard")}
          title="View Pan Card"
        />
      </td>

      {/* Address Proof */}
      <td className="px-6 py-4">
        <FileCheck
          hasDoc={enquiry.hasAddressProof}
          onClick={() => onFileView(enquiry, "addressproof")}
          title="View Address Proof"
        />
      </td>

      {/* ID Proof */}
      <td className="px-6 py-4">
        <FileCheck
          hasDoc={enquiry.hasIdProof}
          onClick={() => onFileView(enquiry, "idproof")}
          title="View ID Proof"
        />
      </td>

      {/* Salary Proof */}
      <td className="px-6 py-4">
        <FileCheck 
          hasDoc={enquiry.hasSalaryProof}
          onClick={() => onFileView(enquiry, "salaryproof")}
          title="View Salary Proof"
        />
      </td>

      {/* Bank Statement */}
      <td className="px-6 py-4">
        <FileCheck
          hasDoc={enquiry.hasBankStatement}
          onClick={() => onFileView(enquiry, "bankstatement")}
          title="View Bank Statement"
        />
      </td>

      {/* Bank Verification Report */}
      <td className="px-6 py-4">
        <FileCheck
          hasDoc={enquiry.hasBankVerificationReport}
          onClick={() => onFileView(enquiry, "bankverification")}
          title="View Bank Verification Report"
        />
      </td>

      {/* Social Score Report */}
      <td className="px-6 py-4">
        <FileCheck 
          hasDoc={enquiry.hasSocialScoreReport}
          onClick={() => onFileView(enquiry, "socialscore")}
          title="View Social Score Report"
        />
      </td>

      {/* CIBIL Score Report */}
      <td className="px-6 text-blue-600 py-4">
        <FileCheck
          hasDoc={enquiry.hasCibilScoreReport}
          onClick={() => onFileView(enquiry, "cibilscore")}
          title="View CIBIL Score Report"
        />
      </td>

      {/* Approval Note */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {enquiry.approvalNote}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(enquiry.status)}`}>
          {enquiry.status}
        </span>
      </td>

      {/* Action */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
              isDark
                ? "bg-blue-800/50 border hover:bg-blue-800 text-blue-200"
                : "bg-blue-200 border hover:bg-blue-200 text-blue-800"
            }`}
          >
            Verify
          </button>
         
          
        </div>
      </td>

      {/* Appraisal Report */}
      <td className="px-6 py-4">
      <button
            className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
              isDark
                ? "bg-pink-900/50 border hover:bg-pink-800 text-pink-300"
                : "bg-pink-100 border hover:bg-pink-200 text-pink-700"
            }`}
          >
            Check
          </button>
      </td>

      {/* Eligibility */}
      <td className="px-6 py-4">
      <button
            className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
              isDark
                ? "bg-teal-900/50 border hover:bg-teal-800 text-teal-300"
                : "bg-teal-100 border hover:bg-teal-200 text-teal-700"
            }`}
          >
            Eligibility
          </button>
      </td>
      
    </tr>
  );
};

export default EnquiriesRow;