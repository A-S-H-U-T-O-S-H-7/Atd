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

  // Ensure application has the required properties for button components
  const applicationWithDefaults = {
    ...application,
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

      {/* Loan No */}
      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textAccent}`}>
          {application.loanNo}
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

      {/* Loan Status */}
      <td className={cellStyle}>
        <span
          className={`text-sm font-semibold ${
            isDark ? "text-orange-400" : "text-orange-600"
          }`}
        >
          {application.loanStatus}
        </span>
      </td>

      {/* Action */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          <button
            onClick={() => onActionClick(application)}
            className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
            title="Edit Application"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>
      </td>

      {/* Appraisal Report */}
      <td className={cellStyle}>
        {applicationWithDefaults.finalReportStatus === "Recommended"
          ? <button
              onClick={() => onFileView(application.finalReportFile, "reports")}
              className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs"
            >
              Recommended
            </button>
          : applicationWithDefaults.isFinalStage
            ? <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                Locked
              </span>
            : <button
                onClick={() => onCheckClick(application)}
                className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
                  isDark
                    ? "bg-pink-900/50 border hover:bg-pink-800 text-pink-300"
                    : "bg-pink-100 border hover:bg-pink-200 text-pink-700"
                }`}
              >
                Check
              </button>}
      </td>

      {/* Eligibility */}
      <td className={cellStyle}>
        <button
          onClick={() => onLoanEligibilityClick(application)}
          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
            isDark
              ? "bg-teal-900/50 border hover:bg-teal-800 text-teal-300"
              : "bg-teal-100 border hover:bg-teal-200 text-teal-700"
          }`}
        >
          Eligibility
        </button>
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