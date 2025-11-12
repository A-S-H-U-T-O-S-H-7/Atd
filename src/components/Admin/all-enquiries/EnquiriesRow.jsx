import React from "react";
import {Calendar,Clock} from "lucide-react";
import PhotoDocument from "../documents/PhotoDocument";
import PanCardDocument from "../documents/PanCardDocument";
import AddressProofDocument from "../documents/AddressProofDocument";
import IdProofDocument from "../documents/IdProofDocument";
import SalaryProofDocument from "../documents/SalaryProofDocument";
import BankStatementDocument from "../documents/BankStatementDocument";
import BankVerificationDocument from "../documents/BankVerificationDocument";
import SocialScoreDocument from "../documents/SocialScoreDocument";
import CibilScoreDocument from "../documents/CibilScoreDocument";
import ActionButton from "../action-buttons/ActionButton";
import AppraisalReportButton from "../action-buttons/AppraisalReportButton";
import EligibilityButton from "../action-buttons/EligibilityButton";

const EnquiriesRow = ({
  enquiry,
  index,
  isDark,
  onFileView,
  onLoanEligibilityClick,
  onVerifyClick,
  onCheckClick,

}) => {
  // Common cell styles
  const cellBase = "px-2 py-4 text-center border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;
  
  const getStatusColor = status => {
  const statusLower = status.toLowerCase();
  
  switch (statusLower) {
    case "pending":
      return isDark
        ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
        : "bg-yellow-100 text-yellow-800 border-yellow-200";
    
    case "completed":
    case "approved":
    case "sanction":
    case "ready to verify":
    case "ready to disbursed":
    case "disbursed":
      return isDark
        ? "bg-green-900/50 text-green-300 border-green-700"
        : "bg-green-100 text-green-800 border-green-200";
    
    case "rejected":
    case "cancelled":
    case "closed by admin":
      return isDark
        ? "bg-red-900/50 text-red-300 border-red-700"
        : "bg-red-100 text-red-800 border-red-200";
    
    case "follow up":
    case "processing":
      return isDark
        ? "bg-blue-900/50 text-blue-300 border-blue-700"
        : "bg-blue-100 text-blue-800 border-blue-200";
    
    case "transaction":
    case "collection":
    case "re-collection":
      return isDark
        ? "bg-purple-900/50 text-purple-300 border-purple-700"
        : "bg-purple-100 text-purple-800 border-purple-200";
    
    case "closed":
    case "defaulter":
    case "return":
      return isDark
        ? "bg-orange-900/50 text-orange-300 border-orange-700"
        : "bg-orange-100 text-orange-800 border-orange-200";
    
    case "renewal":
    case "emi":
      return isDark
        ? "bg-indigo-900/50 text-indigo-300 border-indigo-700"
        : "bg-indigo-100 text-indigo-800 border-indigo-200";
    
    default:
      return isDark
        ? "bg-gray-700 text-gray-300 border-gray-600"
        : "bg-gray-100 text-gray-800 border-gray-200";
  }
};

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-emerald-50/50"
      } ${
        index % 2 === 0
          ? isDark ? "bg-gray-700/30" : "bg-gray-50"
          : ""
      }`}
    >
      {/* SR No */}
      <td className={cellStyle}>
        <span className={`font-medium ${textPrimary}`}>
          {enquiry.srNo}
        </span>
      </td>

      {/* Enquiry Source */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.enquirySource}
        </span>
      </td>

      {/* CRN No */}
      <td className={cellStyle}> 
        <span className={`text-sm font-semibold ${textAccent}`}>
          {enquiry.crnNo}
        </span>
      </td>

      {/* Account ID */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.accountId}
        </span>
      </td>

      {/* Enquiry Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {enquiry.enquiryDate}
          </span>
        </div>
      </td>

      {/* Enquiry Time */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Clock className={iconAccent} />
          <span className={`text-sm ${textSecondary}`}>
            {enquiry.enquiryTime}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className={cellStyle}>
        <span className={`font-medium text-sm ${textPrimary}`}>
          {enquiry.name}
        </span>
      </td>

      {/* First Name */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.firstName}
        </span>
      </td>

      {/* Last Name */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.lastName}
        </span>
      </td>

      {/* Current Address */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.currentAddress}
        </span>
      </td>

      {/* Current State */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.currentState}
        </span>
      </td>

      {/* Current City */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.currentCity}
        </span>
      </td>

      {/* Address */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.address}
        </span>
      </td>

      {/* State */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.state}
        </span>
      </td>

      {/* City */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.city}
        </span>
      </td>

      {/* Phone No */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.phoneNo}
        </span>
      </td>

      {/* E-mail */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.email}
        </span>
      </td>

      {/* Applied Loan */}
      <td className={cellStyle}>
        <span className="text-sm font-semibold text-green-500 px-1 py-0.5 rounded">₹</span>
        <span className={`text-sm font-semibold ${isDark ? "text-green-500" : "text-green-700"}`}>
          {enquiry.appliedLoan}
        </span>
      </td>

      {/* Loan Amount */}
      <td className={cellStyle}>
        <div className="flex bg-orange-500 rounded-md p-1 items-center space-x-1">
          <span className="text-xs text-white px-1 py-0.5 rounded">₹</span>
          <span className="text-sm font-medium text-gray-100">
            {enquiry.loanAmount}
          </span>
        </div>
      </td>

      {/* ROI */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.roi}
        </span>
      </td>

      {/* Tenure */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.tenure}
        </span>
      </td>

      {/* Loan Term */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.loanTerm}
        </span>
      </td>

      {/* Photo */}
      <td className={cellStyle}>
        <PhotoDocument 
          fileName={enquiry.selfie} 
          hasDoc={enquiry.hasPhoto}
          onFileView={onFileView}
        />
      </td>

      {/* Pan Card */}
      <td className={cellStyle}>
        <PanCardDocument 
          fileName={enquiry.pan_proof}
          hasDoc={enquiry.hasPanCard}
          onFileView={onFileView}
         
        />
      </td>

      {/* Address Proof */}
      <td className={cellStyle}>
        <AddressProofDocument 
          fileName={enquiry.address_proof}
          hasDoc={enquiry.hasAddressProof}
          onFileView={onFileView}
         
        />
      </td>

      {/* ID Proof */}
      <td className={cellStyle}>
        <IdProofDocument 
          fileName={enquiry.aadhar_proof}
          hasDoc={enquiry.hasIdProof}
          onFileView={onFileView}
         
        />
      </td>

      {/* Salary Proof */}
      <td className={cellStyle}>
        <SalaryProofDocument 
          fileName={enquiry.salary_slip}
          hasDoc={enquiry.hasSalaryProof}
          secondFileName={enquiry.second_salary_slip}
          hasSecondDoc={enquiry.hasSecondSalaryProof}
          thirdFileName={enquiry.third_salary_slip}
          hasThirdDoc={enquiry.hasThirdSalaryProof}
          onFileView={onFileView}
        />
      </td>

      {/* Bank Statement */}
      <td className={cellStyle}>
        <BankStatementDocument 
          fileName={enquiry.bank_statement}
          hasDoc={enquiry.hasBankStatement}
          onFileView={onFileView}
         
        />
      </td>

      {/* Bank Verification Report */}
      <td className={cellStyle}>
        <BankVerificationDocument 
          fileName={enquiry.bank_verif_report}
          hasDoc={enquiry.hasBankVerificationReport}
          onFileView={onFileView}
         
        />
      </td>

      {/* Social Score Report */}
      <td className={cellStyle}>
        <SocialScoreDocument 
          fileName={enquiry.social_score_report}
          hasDoc={enquiry.hasSocialScoreReport}
          onFileView={onFileView}
          
        />
      </td>

      {/* CIBIL Score Report */}
      <td className={cellStyle}>
        <CibilScoreDocument 
          fileName={enquiry.cibil_score_report}
          hasDoc={enquiry.hasCibilScoreReport}
          onFileView={onFileView}
          
        />
      </td>

      {/* Approval Note */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.approvalNote}
        </span>
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(enquiry.status)}`}>
          {enquiry.status}
        </span>
      </td>

      {/* Action */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <ActionButton 
            enquiry={enquiry}
            isDark={isDark}
            onVerifyClick={onVerifyClick}
          />
        </div>
      </td>

      {/* Appraisal Report */}
      <td className={cellStyle}>
  <AppraisalReportButton 
    enquiry={enquiry}
    isDark={isDark}
    onFileView={onFileView}
    onCheckClick={onCheckClick}
  />
</td>

      {/* Eligibility - Last column, no border-r */}
      <td className={cellBase}>
        <EligibilityButton 
          enquiry={enquiry}
          isDark={isDark}
          onLoanEligibilityClick={onLoanEligibilityClick}
        />
      </td>
    </tr>
  );
};

export default EnquiriesRow;