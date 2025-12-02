import React from "react";
import { Calendar, Mail, Edit, CheckCircle, X, Edit2, FileText } from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa";

// Import reusable document components
import PhotoDocument from "../documents/PhotoDocument";
import PanCardDocument from "../documents/PanCardDocument";
import AddressProofDocument from "../documents/AddressProofDocument";
import IdProofDocument from "../documents/IdProofDocument";
import SalaryProofDocument from "../documents/SalaryProofDocument";
import BankStatementDocument from "../documents/BankStatementDocument";
import BankVerificationDocument from "../documents/BankVerificationDocument";
import SocialScoreDocument from "../documents/SocialScoreDocument";
import CibilScoreDocument from "../documents/CibilScoreDocument";
import VideoKYCDocument from "../documents/VideoKYCDocument";
import NachFormDocument from "../documents/NachFormDocument";
import PDCDocument from "../documents/PDCDocument";
import AgreementDocument from "../documents/AgreementDocument";
import SanctionLetterDocument from "../documents/SanctionLetterDocument";
import AppraisalReportButton from "../action-buttons/AppraisalReportButton";
import EligibilityButton from "../action-buttons/EligibilityButton";
import ActionButton from "../action-buttons/ActionButton";
import CallButton from "../call/CallButton";
import CRNLink from "../CRNLink";
import toast from "react-hot-toast";

const DisburseRow = ({
  application,
  index,
  isDark,
  onLoanEligibilityClick,
  onCheckClick,
  onChequeModalOpen,
  onCourierModalOpen,
  onCourierPickedModalOpen,
  onOriginalDocumentsModalOpen,
  onDisburseEmandateModalOpen,
  onChangeStatusClick,
  onRemarksClick,
  onRefundPDCClick,
  onReplaceKYCClick,
  onActionClick,
  onDocumentStatusClick,
  onFileView,
  fileLoading,
  loadingFileName,
  onBankVerification,
  onDisburseApproval,
  onStatusClick
}) => {
  const handleChequeClick = () => {
    onChequeModalOpen(application, application.chequeNo || "");
  };

  const formatCurrency = amount => {
  if (!amount && amount !== 0) return "0";
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return "0";
  return `${numAmount.toLocaleString("en-IN", {
  })}`;
};  

  // Bank verification handler
  const handleBankVerificationClick = () => {
    if (application.bankVerification === "not_verified" && onBankVerification) {
      onBankVerification(application);
    }
  };

  // Disburse approval handler
  const handleDisburseApprovalClick = () => {
    if (application.disburseApproval === "not_approved" && onDisburseApproval) {
      onDisburseApproval(application);
    }
  };

  // Common cell styles
  const cellBase = "px-2 py-3 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;

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

      {/* Loan No. */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.loanNo}
        </span>
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
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.accountId}
        </span>
      </td>

      {/* Approved Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {application.approvedDate}
          </span>
        </div>
      </td>

      {/* Disburse Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {application.disburseDate}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {application.dueDate}
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
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${textSecondary}`}>
            {application.phoneNo}
          </span>
        </div>
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

      {/* Applied Amount */}
      <td className={cellStyle}>
        <div className="bg-gradient-to-r px-2 rounded-md from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
          <span className={`text-sm font-semibold`}>
            {formatCurrency(application.appliedAmount)}
          </span>
        </div>
      </td>

      {/* Approved Amount */}
      <td className={cellStyle}>
        <div className="bg-gradient-to-r px-2 rounded-md from-orange-100 to-orange-200 text-orange-800 border border-orange-300">
          <span className={`text-sm font-semibold`}>
            {formatCurrency(application.approvedAmount)}
          </span>
        </div>
      </td>

      {/* Admin Fee */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {formatCurrency(application.adminFee)}
        </span>
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

      {/* Photo */}
      <td className={cellStyle}>
        <PhotoDocument
          fileName={application.photoFileName}
          hasDoc={application.hasPhoto}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
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
          isDark={isDark}
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
          isDark={isDark}
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
          isDark={isDark}
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
          isDark={isDark}
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
          isDark={isDark}
        />
      </td>

      {/* Video KYC */}
      <td className={cellStyle}>
        <VideoKYCDocument
          fileName={application.videoKycFileName}
          hasDoc={application.hasVideoKyc}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      </td>

      {/* Approval Note */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.approvalNote || "N/A"}
        </span>
      </td>

      {/* Application Source */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.enquirySource || "N/A"}
        </span>
      </td>

      {/* Bank Verification Report */}
      <td className={cellStyle}>
        <BankVerificationDocument
          fileName={application.bankVerificationFileName}
          hasDoc={application.hasBankVerificationReport}
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
          isDark={isDark}
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
          isDark={isDark}
        />
      </td>

      {/* NACH Form */}
      <td className={cellStyle}>
        <NachFormDocument
          fileName={application.nachFormFileName}
          hasDoc={application.hasNachForm}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
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
          isDark={isDark}
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
          isDark={isDark}
        />
      </td>

      {/* Cheque */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          {application.chequeNo ? (
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  isDark
                    ? "bg-green-900/50 text-green-300 border border-green-700"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}
              >
                {application.chequeNo}
              </span>
              <button
                onClick={handleChequeClick}
                className={`p-1 cursor-pointer rounded-md transition-colors duration-200 ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400 hover:text-emerald-400"
                    : "hover:bg-gray-100 text-gray-500 hover:text-emerald-600"
                }`}
                title="Edit cheque number"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleChequeClick}
              className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r ${
                isDark
                  ? "from-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-xl"
                  : "from-red-400 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl"
              } transform hover:scale-105`}
            >
              Cheque
            </button>
          )}
        </div>
      </td>

      {/* Send To Courier - READ ONLY */}
<td className={cellStyle}>
  <div className="flex items-center justify-center">
    <span className={`px-3 py-1 rounded-2xl text-xs font-semibold flex items-center space-x-1 ${
      application.sendToCourier === "Yes" 
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
        : "bg-gradient-to-r from-red-400 to-red-600 text-white"
    }`}>
      {application.sendToCourier === "Yes" ? (
        <>
          <CheckCircle className="w-3 h-3" />
          <span>Yes</span>
        </>
      ) : (
        <>
          <X className="w-3 h-3" />
          <span>No</span>
        </>
      )}
    </span>
  </div>
</td>

{/* Courier Picked - READ ONLY */}
<td className={cellStyle}>
  <div className="flex items-center justify-center">
    <span className={`px-3 py-1 rounded-2xl text-xs font-semibold flex items-center space-x-1 ${
      application.courierPicked === "Yes" 
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
        : "bg-gradient-to-r from-red-400 to-red-600 text-white"
    }`}>
      {application.courierPicked === "Yes" ? (
        <>
          <CheckCircle className="w-3 h-3" />
          <span>Yes</span>
        </>
      ) : (
        <>
          <X className="w-3 h-3" />
          <span>No</span>
        </>
      )}
    </span>
  </div>
</td>

{/* Original Documents Received - READ ONLY */}
<td className={cellStyle}>
  <div className="flex items-center justify-center">
    <span className={`px-3 py-1 rounded-2xl text-xs font-semibold flex items-center space-x-1 ${
      application.originalDocuments === "Yes" 
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
        : "bg-gradient-to-r from-red-400 to-red-600 text-white"
    }`}>
      {application.originalDocuments === "Yes" ? (
        <>
          <CheckCircle className="w-3 h-3" />
          <span>Yes</span>
        </>
      ) : (
        <>
          <X className="w-3 h-3" />
          <span>No</span>
        </>
      )}
    </span>
  </div>
</td>

{/* Disburse Behalf of E-mandate - READ ONLY */}
<td className={cellStyle}>
  <div className="flex items-center justify-center">
    <span className={`px-3 py-1 rounded-2xl text-xs font-semibold flex items-center space-x-1 ${
      application.receivedDisburse === "Yes" 
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
        : "bg-gradient-to-r from-red-400 to-red-600 text-white"
    }`}>
      {application.receivedDisburse === "Yes" ? (
        <>
          <CheckCircle className="w-3 h-3" />
          <span>Yes</span>
        </>
      ) : (
        <>
          <X className="w-3 h-3" />
          <span>No</span>
        </>
      )}
    </span>
  </div>
</td>

      {/* Loan Term */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.loanTerm}
        </span>
      </td>

      {/* Customer A/c Verified */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          {application.customerAcVerified === "Yes" ? (
            <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Yes</span>
            </span>
          ) : (
            <button className="px-3 py-1 rounded-2xl text-xs font-medium transition-all duration-200 bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg transform flex items-center space-x-1">
              <X className="w-3 h-3" />
              <span>No</span>
            </button>
          )}
        </div>
      </td>

      {/* Sanction Letter */}
      <td className={cellStyle}>
        <SanctionLetterDocument
          fileName={application.sanctionLetterFileName}
          hasDoc={application.sanctionLetter}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      </td>

      {/* Emandate Status */}
      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textAccent}`}>
          {application.emandateStatus}
        </span>
      </td>

      {/* ICICI Emandate Status */}
      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textAccent}`}>
          {application.iciciEmandateStatus}
        </span>
      </td>

      {/* Bank A/c Verification */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          <button
            onClick={handleBankVerificationClick}
            disabled={application.bankVerification === "verified"}
            className={`px-3 py-1 border rounded-md text-xs font-medium flex items-center justify-center space-x-1 transition-colors duration-200 ${
              application.bankVerification === "not_verified"
                ? "bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                : "bg-green-100 text-green-600 cursor-default"
            }`}
          >
            {application.bankVerification === "not_verified" ? (
              <span>Not Verified</span>
            ) : (
              <>
                <CheckCircle size={14} />
                <span>Verified</span>
              </>
            )}
          </button>
        </div>
      </td>

      {/* Disburse Approval */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          <button
            onClick={handleDisburseApprovalClick}
            disabled={application.disburseApproval === "approved"}
            className={`px-3 py-1 border rounded-md text-xs font-medium flex items-center justify-center space-x-1 transition-colors duration-200 ${
              application.disburseApproval === "not_approved"
                ? "bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                : "bg-green-100 text-green-600 cursor-default"
            }`}
          >
            {application.disburseApproval === "not_approved" ? (
              <span>Not Approved</span>
            ) : (
              <>
                <CheckCircle size={14} />
                <span>Approved</span>
              </>
            )}
          </button>
        </div>
      </td>

      {/* Loan Status */}
<td className={cellStyle}>
  <button
    onClick={() => onStatusClick(application)}
    className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
      isDark 
        ? "bg-gradient-to-r from-cyan-100 to-cyan-300 text-cyan-800 border border-cyan-700 hover:bg-cyan-800" 
        : "bg-gradient-to-r from-cyan-200 to-cyan-300 text-cyan-800 border border-cyan-400 hover:bg-cyan-200"
    }`}
    title="Click to update loan status"
  >
    Disburse
  </button>
</td>

      {/* Change Status */}
      {/* <td className={cellStyle}>
        <div className="flex items-center justify-center">
          <button
            onClick={() => onChangeStatusClick(application)}
            className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
            title="Change Status"
          >
            <Edit2 className="w-4 h-4" />
            <span>Change Status</span>
          </button>
        </div>
      </td> */}

      {/* Sanction Mail */}
      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${
          isDark ? "text-orange-400" : "text-orange-600"
        }`}>
          {application.sanctionMail}
        </span>
      </td>

      {/* Remarks */}
      <td className={cellStyle}>
        <button
          onClick={() => onRemarksClick(application)}
          className={`text-sm underline cursor-pointer transition-colors duration-200 ${
            isDark
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          View Remarks
        </button>
      </td>

      {/* Document Status */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          <button
            onClick={() => onDocumentStatusClick(application)}
            className={`px-4 py-1 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
              isDark 
                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white" 
                : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
            } shadow-lg hover:shadow-xl flex items-center space-x-1`}
            title="Check Document Status"
          >
            <FileText className="w-4 h-4" />
            <span>Check Status</span>
          </button>
        </div>
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

export default DisburseRow;