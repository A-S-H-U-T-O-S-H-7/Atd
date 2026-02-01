import React from "react";
import { Calendar, Mail } from "lucide-react";
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
import CallButton from "../call/CallButton";
import CRNLink from "../CRNLink";
import toast from "react-hot-toast";

const PendingRow = ({
  application,
  index,
  isDark,
  onLoanEligibilityClick,
  onCheckClick,
  onActionClick,
  onFileView,
  fileLoading,
  loadingFileName,
  onSendMail,
  sourcePage = "pending"
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

  const formatCurrency = amount => {
  if (!amount && amount !== 0) return "0";
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return "0";
  return `${numAmount.toLocaleString("en-IN", {
  })}`;
};

  
  // Create application object with proper props for buttons (IMPORTANT FIX)
  const applicationForButtons = {
    ...application,
    // Ensure all required properties exist for button components
    showActionButton: application.showActionButton !== false,
    showAppraisalButton: application.showAppraisalButton !== false,
    showEligibilityButton: application.showEligibilityButton !== false,
    isFinalStage: application.isFinalStage || false,
    finalReportStatus: application.finalReportStatus || null,
    hasAppraisalReport: application.hasAppraisalReport || false
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
          {application.srNo}
        </span>
      </td>

      {/* Call */}
      <td className={cellStyle}>
  <CallButton
    applicant={application}
    isDark={isDark}
    size="small"
    variant="default"
    className="px-6 py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105"
  />
</td>

      {/* Application Source */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.enquirySource || "N/A"}
        </span>
      </td>

      {/* Send Mail */}
<td className={cellStyle}>
  <button
    onClick={() => onSendMail(application)}
    disabled={fileLoading && loadingFileName === `mail_${application.id}`}
    className={`flex items-center space-x-2 text-sm px-3 py-2 font-medium cursor-pointer rounded-md border transition-all duration-200 hover:scale-105 ${
      fileLoading && loadingFileName === `mail_${application.id}`
        ? "opacity-50 cursor-not-allowed"
        : ""
    } ${
      isDark
        ? "bg-cyan-900/50 border-cyan-700 text-cyan-300 hover:bg-cyan-800"
        : "bg-cyan-100 border-cyan-300 text-cyan-700 hover:bg-cyan-200"
    }`}
  >
    <span>
      {fileLoading && loadingFileName === `mail_${application.id}` 
        ? "Sending..." 
        : `Send Mail${application.mailCounter ? ` (${application.mailCounter})` : ''}`
      }
    </span>
  </button>
</td>

      {/* CRN No */}
      <td className={cellStyle}>
      <CRNLink 
        crnNo={application.crnNo} 
        userId={application.userId}
        onSuccess={(data) => {
          toast.success('Profile loaded');
        }}
        onError={(error) => {
          toast.error(error);
        }}
      />
      </td>

      {/* Account ID */}
      {/* <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.accountId}
        </span>
      </td> */}

      {/* Enquiry Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {application.enquiryDate}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className={cellStyle}>
        <span className={`font-medium text-sm ${textPrimary}`}>
          {application.name}
        </span>
      </td>

      {/* Address */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.permanentAddress}
        </span>
      </td>

      {/* State */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.state}
        </span>
      </td>

      {/* City */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.city}
        </span>
      </td>

      {/* Phone No */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.phoneNo}
        </span>
      </td>

      {/* E-mail */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Mail className={iconAccent} />
          <span className={`text-sm ${textSecondary}`}>
            {application.email}
          </span>
        </div>
      </td>

      {/* Applied Loan */}
      <td className={cellStyle}>
        <span className="text-sm font-semibold text-green-500 px-1 py-0.5 rounded">₹</span>
        <span className={`text-sm font-semibold ${isDark ? "text-green-500" : "text-green-700"}`}>
          {application.appliedLoan}
        </span>
      </td>

      {/* Approved Amount */}
      <td className={cellStyle}>
        <div className="flex bg-orange-500 rounded-md p-1 items-center space-x-1">
          <span className="text-xs text-white px-1 py-0.5 rounded">₹</span>
          <span className="text-sm font-medium text-gray-100">
            {formatCurrency(application.approvedAmount)}
          </span>
        </div>
      </td>

      {/* ROI */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.roi}%
        </span>
      </td>

      {/* Tenure */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.tenure} days
        </span>
      </td>

      {/* Loan Term */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.loanTerm}
        </span>
      </td>

      {/* Photo */}
      <td className={cellStyle}>
        <PhotoDocument
          fileName={application.photoFileName}
          hasDoc={application.hasPhoto}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* Pan Card */}
      <td className={cellStyle}>
        <PanCardDocument
          fileName={application.panCardFileName}
          hasDoc={application.hasPanCard}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* Address Proof */}
      <td className={cellStyle}>
        <AddressProofDocument
          fileName={application.addressProofFileName}
          hasDoc={application.hasAddressProof}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* ID Proof */}
      <td className={cellStyle}>
        <IdProofDocument
          fileName={application.idProofFileName}
          hasDoc={application.hasIdProof}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* Salary Proof */}
      <td className={cellStyle}>
        <SalaryProofDocument
          fileName={application.salarySlip1}
          hasDoc={application.hasSalaryProof}
          secondFileName={application.salarySlip2}
          hasSecondDoc={application.hasSecondSalaryProof}
          thirdFileName={application.salarySlip3}
          hasThirdDoc={application.hasThirdSalaryProof}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* Bank Statement */}
      <td className={cellStyle}>
        <BankStatementDocument
          fileName={application.bankStatementFileName}
          hasDoc={application.hasBankStatement}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* Bank Verification Report */}
      <td className={cellStyle}>
        <BankVerificationDocument
          fileName={application.bankVerificationFileName}
          hasDoc={application.hasBankVerificationReport}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* Social Score Report */}
      <td className={cellStyle}>
        <SocialScoreDocument
          fileName={application.socialScoreFileName}
          hasDoc={application.hasSocialScoreReport}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* CIBIL Score Report */}
      <td className={cellStyle}>
        <CibilScoreDocument
          fileName={application.cibilScoreFileName}
          hasDoc={application.hasCibilScoreReport}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* Approval Note */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.approvalNote || "N/A"}
        </span>
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <span
          className={`text-sm font-semibold ${
            isDark ? "text-orange-400" : "text-orange-600"
          }`}
        >
          {application.loanStatus}
        </span>
      </td>

      {/* Action - FIXED PROP NAMES */}
      <td className={cellStyle}>
        <ActionButton
          enquiry={applicationForButtons}      
          isDark={isDark}
          onVerifyClick={onActionClick}
          sourcePage={sourcePage}
        />
      </td>

      {/* Appraisal Report - FIXED PROP NAMES */}
      <td className={cellStyle}>
        <AppraisalReportButton
          enquiry={applicationForButtons}
          isDark={isDark}
          onFileView={onFileView}
          onCheckClick={onCheckClick}
          sourcePage={sourcePage}
        />
      </td>

      {/* Eligibility  */}
      <td className={cellStyle}>
        <EligibilityButton
          enquiry={applicationForButtons}      
          isDark={isDark}
          sourcePage={sourcePage}
        />
      </td>
    </tr>
  );
};

export default PendingRow;