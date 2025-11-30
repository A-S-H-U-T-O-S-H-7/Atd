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

const RejectedRow = ({
  application,
  index,
  isDark,
  onLoanEligibilityClick,
  onCheckClick,
  onActionClick,
  onFileView,
  fileLoading,
  loadingFileName,
  onRestoreApplication
}) => {
  // Common cell styles
  const cellBase = "px-2 py-2 text-center border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;

  const formatCurrency = amount => {
    return `${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2
    })}`;
  };

  

  const handleRestore = () => {
  if (onRestoreApplication && application.id) {
    onRestoreApplication(application.id);
  }
};

  // CRITICAL FIX: Create application object with ALL required properties for button components
  const applicationForButtons = {
    ...application,
    // Ensure all required properties exist for button components
    id: application.id,
    name: application.name,
    showActionButton: application.showActionButton !== false,
    showAppraisalButton: application.showAppraisalButton !== false,
    showEligibilityButton: application.showEligibilityButton !== false,
    
    // Properties required by AppraisalReportButton
    isFinalStage: application.isFinalStage || false,
    finalReportStatus: application.finalReportStatus || null,
    hasAppraisalReport: application.hasAppraisalReport || false,
    totl_final_report: application.finalReportStatus, // Some components might use this
    
    // Properties required by ActionButton
    verify: application.verifyStatus || 0,
    report_check: application.reportCheckStatus || 0,
    
    // Properties that might be checked
    isVerified: application.isVerified || false,
    isReportChecked: application.isReportChecked || false,
    
    // Additional properties that might be needed
    userBy: application.verifierName || 'N/A',
    status: application.status || 'Rejected',
    loanStatus: application.loanStatus || 'Rejected'
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

      {/* CRN No */}
      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textAccent}`}>
          {application.crnNo}
        </span>
      </td>

      {/* Account ID */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.accountId}
        </span>
      </td>

      <td className={cellStyle}>
  <div className="flex items-center space-x-2">
    <Calendar className={iconAccent} />
    <span className={`text-sm font-medium ${textSecondary}`}>
      {application.enquiryDate}
    </span>
  </div>
</td>

{/* Complete Date */}
<td className={cellStyle}>
  <div className="flex items-center space-x-2">
    <Calendar className={iconAccent} />
    <span className={`text-sm font-medium ${textSecondary}`}>
      {application.completeDate}
    </span>
  </div>
</td>


      {/* Name */}
      <td className={cellStyle}>
        <span className={`font-medium text-sm ${textPrimary}`}>
          {application.name}
        </span>
      </td>

      {/* Permanent Address */}
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

      {/* Remark */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.remark || "N/A"}
        </span>
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <span
          className={`text-sm font-semibold ${
            isDark ? "text-red-400" : "text-red-600"
          }`}
        >
          {application.loanStatus}
        </span>
      </td>

      {/* User By */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.verifierName || "N/A"}
        </span>
      </td>

      {/* Restore Action */}
      <td className={cellStyle}>
        <button
          onClick={handleRestore}
          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
            isDark
              ? "bg-cyan-900/50 border hover:bg-cyan-800 text-cyan-300"
              : "bg-cyan-100 border hover:bg-cyan-200 text-cyan-700"
          }`}
        >
          Re-Store
        </button>
      </td>

      {/* Appraisal Report */}
      <td className={cellStyle}>
        {applicationForButtons.showAppraisalButton ? (
          <AppraisalReportButton
            enquiry={applicationForButtons}  // FIXED: Use 'enquiry' prop name
            isDark={isDark}
            onFileView={onFileView}
            onCheckClick={onCheckClick}
          />
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )}
      </td>

      {/* Eligibility */}
      <td className={cellStyle}>
        {applicationForButtons.showEligibilityButton ? (
          <EligibilityButton
            enquiry={applicationForButtons}  // FIXED: Use 'enquiry' prop name
            isDark={isDark}
            onLoanEligibilityClick={onLoanEligibilityClick}
          />
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )}
      </td>

      {/* Action */}
      <td className={cellStyle}>
        {applicationForButtons.showActionButton ? (
          <ActionButton
            enquiry={applicationForButtons}  // FIXED: Use 'enquiry' prop name
            isDark={isDark}
            onVerifyClick={onActionClick}  // FIXED: Use 'onVerifyClick' prop name
          />
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )}
      </td>
    </tr>
  );
};

export default RejectedRow;