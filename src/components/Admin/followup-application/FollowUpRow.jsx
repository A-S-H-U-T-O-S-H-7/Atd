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

const FollowUpRow = ({
  application,
  index,
  isDark,
  onLoanEligibilityClick,
  onCheckClick,
  onReplaceKYCClick,
  onCall,
  onActionClick,
  onFileView,
  fileLoading,
  loadingFileName,
  onStatusUpdate,
  onBlacklist,
  onActivateAccount,
  onOpenStatusModal // Add this prop
}) => {
  // Common cell styles
  const cellBase = "px-6 py-4 border-r";
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

  const handleCall = () => {
    onCall(application);
  };

  const handleActivateAccount = () => {
    if (onActivateAccount && application.id) {
      onActivateAccount(application.id);
    }
  };

  const handleBlacklist = () => {
    if (onBlacklist && application.id) {
      onBlacklist(application.id);
    }
  };

  // ADD THIS FUNCTION
  const handleOpenStatusModal = () => {
    if (onOpenStatusModal) {
      onOpenStatusModal(application);
    }
  };

  // CRITICAL: Create application object with ALL required properties for button components
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
    totl_final_report: application.finalReportStatus,
    
    // Properties required by ActionButton
    verify: application.verifyStatus || 0,
    report_check: application.reportCheckStatus || 0,
    
    // Properties that might be checked
    isVerified: application.isVerified || false,
    isReportChecked: application.isReportChecked || false,
    
    // Additional properties that might be needed
    status: application.status || 'Follow Up',
    loanStatus: application.loanStatus || 'Follow Up'
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
        <button
          onClick={handleCall}
          className={`px-6 cursor-pointer py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-blue-900/50 text-blue-300 border-blue-700 hover:bg-blue-800"
              : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
          }`}
        >
          call
        </button>
      </td>

      {/* Application Source */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.enquirySource || "N/A"}
        </span>
      </td>

      {/* Account Activation */}
      <td className={cellStyle}>
        <button
          onClick={handleActivateAccount}
          disabled={application.accountActivation}
          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
            application.accountActivation
              ? "bg-green-100 text-green-800 cursor-not-allowed"
              : isDark
                ? "bg-orange-900/50 border hover:bg-orange-800 text-orange-300"
                : "bg-orange-100 border hover:bg-orange-200 text-orange-700"
          }`}
        >
          {application.accountActivation ? "Activated" : "Activate"}
        </button>
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

      {/* Current Address */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.currentAddress}
        </span>
      </td>

      {/* Current State */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.currentState}
        </span>
      </td>

      {/* Current City */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.currentCity}
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

      {/* Status  */}
      <td className={cellStyle}>
        <button
          onClick={handleOpenStatusModal}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 cursor-pointer ${
            isDark
              ? "bg-gradient-to-r from-rose-100 via-rose-200 to-rose-300 border border-red-700 hover:bg-rose-800 text-rose-900"
              : "bg-gradient-to-r from-rose-100 via-rose-200 to-rose-300 border border-red-200 hover:bg-rose-200 text-rose-700"
          }`}
        >
          {application.loanStatus}
        </button>
      </td>

      {/* Action */}
      <td className={cellStyle}>
        {applicationForButtons.showActionButton ? (
          <ActionButton
            enquiry={applicationForButtons}
            isDark={isDark}
            onVerifyClick={onActionClick}
          />
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )}
      </td>

      {/* Appraisal Report */}
      <td className={cellStyle}>
        {applicationForButtons.showAppraisalButton ? (
          <AppraisalReportButton
            enquiry={applicationForButtons}
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
            enquiry={applicationForButtons}
            isDark={isDark}
            onLoanEligibilityClick={onLoanEligibilityClick}
          />
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )}
      </td>

      {/* Replace KYC */}
      <td className={cellStyle}>
        <button
          onClick={() => onReplaceKYCClick(application)}
          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
            isDark
              ? "bg-purple-900/50 border hover:bg-purple-800 text-purple-300"
              : "bg-purple-100 border hover:bg-purple-200 text-purple-700"
          }`}
        >
          Replace KYC
        </button>
      </td>

      {/* BlackList */}
      <td className={cellStyle}>
        <button
          onClick={handleBlacklist}
          disabled={application.isBlacklisted}
          className={`px-3 py-1 cursor-pointer rounded text-sm font-medium transition-colors duration-200 ${
            application.isBlacklisted
              ? "bg-red-100 text-red-800 cursor-not-allowed"
              : isDark
                ? "bg-red-900/50 border hover:bg-red-800 text-red-300"
                : "bg-red-100 border hover:bg-red-200 text-red-700"
          }`}
        >
          {application.isBlacklisted ? "Blacklisted" : "BlackList"}
        </button>
      </td>
    </tr>
  );
};

export default FollowUpRow;