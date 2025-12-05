import React from "react";
import { Calendar, Mail, Edit, CheckCircle, X, Edit2 } from "lucide-react";

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

const SanctionRow = ({
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
  onReplaceKYCClick,
  onActionClick,
  onStatusClick,
  onFileView,
  fileLoading,
  loadingFileName
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

  

  // Validation logic for loan status modal
  const canOpenLoanStatusModal = () => {
    // Use raw values if available, otherwise fallback to formatted strings
    const sendCourierValue = application.sendToCourierRaw !== undefined 
      ? application.sendToCourierRaw === 1 
      : application.sendToCourier === "Yes";
    
    const courierPickedValue = application.courierPickedRaw !== undefined
      ? application.courierPickedRaw === 1
      : application.courierPicked === "Yes";
    
    const originalDocsValue = application.originalDocumentsRaw !== undefined
      ? application.originalDocumentsRaw === "Yes"
      : application.originalDocuments === "Yes";
    
    const emandateValue = application.emandateVerificationRaw !== undefined
      ? (application.emandateVerificationRaw === 1 || application.emandateVerificationRaw === "1")
      : (application.emandateStatus === "1" || application.emandateStatus === 1 || application.receivedDisburse === "Yes");

    // Condition 1: All courier and document fields are complete
    const allCourierFieldsComplete = sendCourierValue && courierPickedValue && originalDocsValue;

    // Condition 2: E-mandate is verified
    const emandateVerified = emandateValue;

    // Block condition: All fields are incomplete (inverse check)
    const allFieldsIncomplete = !sendCourierValue && !courierPickedValue && !originalDocsValue && !emandateValue;

    // Allow if condition 1 OR condition 2 is true, AND not all fields are incomplete
    return (allCourierFieldsComplete || emandateVerified) && !allFieldsIncomplete;
  };

  const handleLoanStatusClick = () => {
    if (canOpenLoanStatusModal()) {
      onStatusClick(application);
    }
    // No action if validation fails - button appears disabled
  };

  // Common cell styles
  const cellBase = "px-2 py-4 border-r";
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
        userId={application.user_id || application.user_Id}
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

      {/* Approved Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {application.approvedDate}
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

      {/* Send To Courier */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          {application.sendToCourier === "Yes" ? (
            <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Yes</span>
            </span>
          ) : (
            <button
              onClick={() => onCourierModalOpen(application)}
              className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
            >
              <span>No</span>
            </button>
          )}
        </div>
      </td>

      {/* Courier Picked */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          {application.courierPicked === "Yes" ? (
            <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Yes</span>
            </span>
          ) : (
            <button
              onClick={() => onCourierPickedModalOpen(application)}
              className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
            >
              <span>No</span>
            </button>
          )}
        </div>
      </td>

      {/* Original Documents */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center">
          {application.originalDocuments === "Yes" ? (
            <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Yes</span>
            </span>
          ) : (
            <button
              onClick={() => onOriginalDocumentsModalOpen(application)}
              className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
            >
              <span>No</span>
            </button>
          )}
        </div>
      </td>

     {/* Disburse Behalf of E-mandate */}
<td className={cellStyle}>
  <div className="flex items-center justify-center">
    {application.receivedDisburse === "Yes" ? (
      <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
        <CheckCircle className="w-3 h-3" />
        <span>Yes</span>
      </span>
    ) : application.enachDetails?.status === "Success" ? (
      <button
        onClick={() => onDisburseEmandateModalOpen(application)}
        className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
        title="Click to verify disbursement"
      >
        <span>Verify</span>
      </button>
    ) : (
      <div className="relative group">
        <button
          disabled
          className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-gray-400 to-gray-600 text-gray-300 cursor-not-allowed flex items-center space-x-1 opacity-60"
        >
          <span>Pending</span>
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
          <div className={`px-2 py-1 text-xs rounded ${
            isDark ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-white"
          } whitespace-nowrap`}>
            Waiting for ICICI Emandate Success
          </div>
        </div>
      </div>
    )}
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

      {/* Sanction Mail */}
<td className={cellStyle}>
  <div className="flex items-center justify-center">
    {application.sanctionMail === "Sent" ? (
      <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
        <CheckCircle className="w-3 h-3" />
        <span>Sent</span>
      </span>
    ) : (
      <button
        
        className="px-4 py-1 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
        title="Send sanction letter via email"
      >
        <Mail className="w-4 h-4" />
        <span>Send Mail</span>
      </button>
    )}
  </div>
</td>

      {/* ICICI Emandate Status */}
<td className={cellStyle}>
  {(() => {
    let enachAccount = null;
    let customerAccount = null;
    
    if (application.enachDetails?.details) {
      const enachMatch = application.enachDetails.details.match(/enach_ac_no:\s*(\d+)/);
      if (enachMatch) {
        enachAccount = enachMatch[1];
      }
      
      // Extract customer_ac_no from enach_details
      const customerMatch = application.enachDetails.details.match(/customer_ac_no:\s*(\d+)/);
      if (customerMatch) {
        customerAccount = customerMatch[1];
      }
    }
    
    // Check if E-Nach Account and Customer Account match
    const accountsMatch = enachAccount && customerAccount && enachAccount === customerAccount;
    
    const isPending = !application.enachDetails?.status || application.enachDetails?.status === "Pending";
    const isSuccess = application.enachDetails?.status === "Success";
    
    return (
      <div className={`flex flex-col p-2.5 rounded-lg min-w-[200px] space-y-1.5 ${
        isDark 
          ? "bg-gray-800/50 border border-gray-700/50" 
          : "bg-gray-50 border border-gray-200"
      }`}>
        
        {/* Status with Badge */}
        <div className="flex items-center space-x-1.5">
          <div className={`flex items-center justify-center w-4 h-4 rounded-full ${
            application.enachDetails?.status === "Success" 
              ? "bg-green-500 text-white" 
              : application.enachDetails?.status === "Failed"
              ? "bg-red-500 text-white"
              : "bg-yellow-500 text-white"
          }`}>
            {application.enachDetails?.status === "Success" 
              ? "✓"
              : application.enachDetails?.status === "Failed"
              ? "✕"
              : "⋯"
            }
          </div>
          <span className={`text-sm font-semibold ${
            application.enachDetails?.status === "Success" 
              ? isDark ? "text-green-400" : "text-green-700"
              : application.enachDetails?.status === "Failed"
              ? isDark ? "text-red-400" : "text-red-700"
              : isDark ? "text-yellow-400" : "text-yellow-700"
          }`}>
            {application.enachDetails?.status || "Pending"}
          </span>
        </div>
        
        {/* Date and Time */}
        {application.enachDetails?.date && (
          <div className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            <div className="font-medium">{application.enachDetails.date}</div>
            {application.enachDetails?.time && (
              <div className={isDark ? "text-gray-400" : "text-gray-500"}>
                {application.enachDetails.time}
              </div>
            )}
          </div>
        )}
        
        {/* Account Numbers - Only show if not pending and status is Success */}
        {!isPending && isSuccess && (
          <div className="space-y-1.5 pt-1">
            
            {/* E-Nach Account Number - NO TICK/CROSS */}
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>E-Nach Ac.:</span>
              <span className={`text-xs font-mono font-semibold ${
                isDark ? "text-blue-300" : "text-blue-600"
              }`}>
                {enachAccount || "N/A"}
              </span>
            </div>
            
            {/* Customer Account Number - COMPARE WITH E-NACH ACCOUNT */}
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>Cust. Ac.:</span>
              <div className="flex items-center space-x-1.5">
                <span className={`text-xs font-mono font-semibold ${
                  isDark ? "text-amber-300" : "text-amber-600"
                }`}>
                  {customerAccount || "N/A"}
                </span>
                {/* Compare Customer Account with E-Nach Account */}
                {enachAccount && customerAccount && (
                  <div className={`flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0 ${
                    accountsMatch ? "bg-green-500" : "bg-red-500"
                  }`}>
                    <span className="text-white text-[10px] font-bold">
                      {accountsMatch ? "✓" : "✕"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Customer Name - Only show if not pending */}
        {!isPending && (
          <div className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            <span className="font-medium">{application.name || "N/A"}</span>
          </div>
        )}
        
      </div>
    );
  })()}
</td>
   
      {/* Loan Status */}
      <td className={cellStyle}>
        <button
          onClick={handleLoanStatusClick}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${
            canOpenLoanStatusModal()
              ? "hover:scale-105 cursor-pointer"
              : "opacity-60 cursor-not-allowed"
          } ${
            isDark 
              ? "bg-orange-900/50 text-orange-300 border border-orange-700 hover:bg-orange-800" 
              : "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200"
          }`}
          title={canOpenLoanStatusModal() ? "Click to update loan status" : "Complete required fields to update status"}
        >
          {application.loanStatus}
        </button>
      </td>

      {/* Change Status */}
      <td className={cellStyle}>
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

export default SanctionRow;