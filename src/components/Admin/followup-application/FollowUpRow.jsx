import React from "react";
import { Calendar, Mail, Ban } from "lucide-react";
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
import CRNLink from "../CRNLink";
import CallButton from "../call/CallButton";
import toast from "react-hot-toast";
import BlacklistButton from "../action-buttons/BlacklistButton";
import ReplaceKYCButton from "../action-buttons/ReplaceKYCButton";
import SecondBankStatementDocument from "../documents/SecondBankStatementDocument";
import BankFraudReportDocument from "../documents/BankFraudReportDocument";

const FollowUpRow = ({
  application,
  index,
  isDark,
  onFileView,
  fileLoading,
  loadingFileName,
  onStatusUpdate,
  onActivateAccount,
  onOpenStatusModal 
}) => {
  // Check if user is blacklisted
  const isBlacklisted = application.blacklist === 1 || application.isBlacklisted === true;
  
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

  // Blacklisted row styles
  const blacklistedRowBg = isDark 
    ? "bg-red-950/20 border-l-4 border-l-red-500" 
    : "bg-red-300/80 border-l-4 border-l-red-500";
  
  const blacklistedHoverBg = isDark
    ? "hover:bg-red-900/30"
    : "hover:bg-red-400/90";

  const normalRowBg = index % 2 === 0
    ? isDark ? "bg-gray-700/30" : "bg-gray-50"
    : "";

  const normalHoverBg = isDark
    ? "hover:bg-gray-700/50"
    : "hover:bg-emerald-50/50";

  const formatCurrency = amount => {
  if (!amount && amount !== 0) return "0";
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return "0";
  return `${numAmount.toLocaleString("en-IN", {
  })}`;
};

  
  const handleActivateAccount = () => {
    if (onActivateAccount && application.id) {
      onActivateAccount(application.id);
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
        isBlacklisted 
          ? `${blacklistedRowBg} ${blacklistedHoverBg}`
          : `${normalRowBg} ${normalHoverBg}`
      } ${
        isDark
          ? "border-emerald-700"
          : "border-emerald-300"
      }`}
    >
      {/* SR No */} 
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-1">
          {isBlacklisted && (
            <Ban className={`w-7 h-7 ${isDark ? "text-red-500" : "text-red-500"}`} />
          )}
          <span className={`font-medium ${textPrimary}`}>
            {application.srNo}
          </span>
        </div>
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
      {/*second Bank Statement */}
      <td className={cellStyle}>
      <SecondBankStatementDocument
      fileName={application.secondBankStatementFileName}
      hasDoc={application.hasSecondBankStatement}
      onFileView={onFileView}
      fileLoading={fileLoading}
      loadingFileName={loadingFileName}
      isDark={isDark}
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
      {/* Bank Fraud Report */}
      <td className={cellStyle}>
      <BankFraudReportDocument
            fileName={application.bankFraudReportFileName}
            hasDoc={application.hasBankFraudReport}
            onFileView={onFileView}
            fileLoading={fileLoading}
            loadingFileName={loadingFileName}
            isDark={isDark}
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
          />
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )}
      </td>

      {/* Replace KYC */}
      <td className={cellStyle}>
  <ReplaceKYCButton
    application={application}
    isDark={isDark}
  />
</td>

      {/* BlackList */}
      <td className={cellStyle}>
        <BlacklistButton
          userId={application.userId}
          application={application}
          isDark={isDark}
        />
      </td>
    </tr>
  );
};

export default FollowUpRow;