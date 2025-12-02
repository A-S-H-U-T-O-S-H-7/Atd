import React from "react";
import { Calendar, Mail, Clock, Edit } from "lucide-react";
import PhotoDocument from "../documents/PhotoDocument";
import PanCardDocument from "../documents/PanCardDocument";
import AddressProofDocument from "../documents/AddressProofDocument";
import IdProofDocument from "../documents/IdProofDocument";
import SalaryProofDocument from "../documents/SalaryProofDocument";
import BankStatementDocument from "../documents/BankStatementDocument";
import BankVerificationDocument from "../documents/BankVerificationDocument";
import SocialScoreDocument from "../documents/SocialScoreDocument";
import CibilScoreDocument from "../documents/CibilScoreDocument";
import PDCDocument from "../documents/PDCDocument";
import AgreementDocument from "../documents/AgreementDocument";
import AppraisalReportButton from "../action-buttons/AppraisalReportButton";
import EligibilityButton from "../action-buttons/EligibilityButton";
import ActionButton from "../action-buttons/ActionButton";
import CallButton from "../call/CallButton";
import CRNLink from "../CRNLink";
import toast from "react-hot-toast";

const InProgressRow = ({
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
  onOpenStatusModal 
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

 

  const handleOpenStatusModal = () => {
    if (onOpenStatusModal) {
      onOpenStatusModal(application);
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

      {/* PDC */}
      <td className={cellStyle}>
        <PDCDocument
          fileName={application.pdcFileName}
          hasDoc={application.hasPdc}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </td>

      {/* Agreement */}
      <td className={cellStyle}>
        <AgreementDocument
          fileName={application.agreementFileName}
          hasDoc={application.hasAgreement}
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

      {/* Loan Status - UPDATED TO BE CLICKABLE */}
      <td className={cellStyle}>
        <button
          onClick={handleOpenStatusModal}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 cursor-pointer ${
            isDark
              ? "bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300 border border-cyan-700 hover:bg-cyan-800 text-cyan-900"
              : "bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300 border border-cyan-700 hover:bg-cyan-200 text-cyan-700"
          }`}
        >
          {application.loanStatus}
        </button>
      </td>

      {/* Action */}
      <td className={cellStyle}>
  <ActionButton
    enquiry={application}
    isDark={isDark}
    onVerifyClick={onActionClick} 
    className="w-full flex justify-center"
  />
</td>

      {/* Appraisal Report */}
      <td className={cellStyle}>
  <AppraisalReportButton
    enquiry={application}
    isDark={isDark}
    onFileView={onFileView}
    onCheckClick={onCheckClick}
    className="w-full flex justify-center"
  />
</td>

      {/* Eligibility */}
<td className={cellStyle}>
  <EligibilityButton
    enquiry={application}
    isDark={isDark}
    onLoanEligibilityClick={onLoanEligibilityClick}
    className="w-full flex justify-center"
  />
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
    </tr>
  );
};

export default InProgressRow;