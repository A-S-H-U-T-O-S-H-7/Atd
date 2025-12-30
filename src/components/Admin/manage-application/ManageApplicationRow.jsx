import React, { useState } from "react";
import { Calendar, Mail, Edit, CheckCircle,RefreshCw, X, FileText, Eye } from "lucide-react";
import { manageApplicationService } from "@/lib/services/ManageApplicationServices";
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { useRouter } from "next/navigation";

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
import { FaFilePdf } from "react-icons/fa";
import ReplaceKYCButton from "../action-buttons/ReplaceKYCButton";

const ApplicationRow = ({
  application,
  index,
  isDark,
  visibleHeaders,
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
  onCall,
  onActionClick,
  onDocumentStatusClick,
  onFileView,
  fileLoading,
  loadingFileName,
  onReadyForApprove,
  onBankVerification,
  onDisburseApproval,
  onCollectionClick,
  onNOCModalOpen,
  onRenewalClick,
}) => {

  const router = useRouter();
  const { hasPermission } = useAdminAuthStore();
  const [nocLoading, setNocLoading] = useState(false);

  
  const handleChequeClick = () => {
    onChequeModalOpen(application, application.chequeNo || "");
  };

  const formatCurrency = amount => {
    if (!amount && amount !== 0) return "0";
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "0";
    return `${numAmount.toLocaleString("en-IN", {})}`;
  };

  // Check loan status
  const isLoanClosed = application.loanStatusId === 13;
  const isRenewalLoan = application.loanStatusId === 18;

  // Common cell styles
  const cellBase = "px-2 py-4 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;

  // Get row styling based on loan status and theme
  const getRowClasses = () => {
    const baseClasses = "border-b transition-all duration-200 hover:shadow-lg";
    
    if (isLoanClosed) {
      // Deep orange for closed loans in light mode, lighter in dark mode
      if (isDark) {
        return `${baseClasses} bg-gradient-to-r from-orange-900/40 via-orange-800/30 to-orange-900/40 border-orange-700/30 hover:bg-gradient-to-r hover:from-orange-900/50 hover:via-orange-800/40 hover:to-orange-900/50 shadow-orange-900/10`;
      } else {
        return `${baseClasses} bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 border-orange-300 hover:bg-gradient-to-r hover:from-orange-200 hover:via-orange-100 hover:to-orange-200 shadow-orange-100`;
      }
    } else if (isRenewalLoan) {
      // Blue shade for renewal loans (status 18) - using blue-900/10 in light, blue-900/20 in dark
      if (isDark) {
        return `${baseClasses} bg-gradient-to-r from-blue-900/20 via-blue-900/15 to-blue-900/20 border-blue-800/30 hover:bg-gradient-to-r hover:from-blue-900/25 hover:via-blue-900/20 hover:to-blue-900/25 shadow-blue-900/10`;
      } else {
        return `${baseClasses} bg-gradient-to-r from-blue-50 via-blue-50/80 to-blue-50 border-blue-200 hover:bg-gradient-to-r hover:from-blue-100 hover:via-blue-50 hover:to-blue-100 shadow-blue-100`;
      }
    } else {
      // Normal row styling
      const hoverEffect = isDark 
        ? "border-emerald-700 hover:bg-gray-700/50" 
        : "border-emerald-300 hover:bg-emerald-50/50";
      
      const alternatingBg = index % 2 === 0 
        ? (isDark ? "bg-gray-700/30" : "bg-gray-50")
        : "";
      
      return `${baseClasses} ${hoverEffect} ${alternatingBg}`;
    }
  };

  // Create a map of header label to render function
  const renderCell = (headerLabel) => {
    const cellMap = {
      "SR. No": () => (
        <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {application.srNo}
        </span>
      ),
      "Call": () => (
        <CallButton
          applicant={application}
          isDark={isDark}
          size="small"
          variant="default"
          className="px-6 py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105"
        />
      ),
      "Collection": () => {
  if (!hasPermission('collection')) {
    return (
      <div className="flex items-center justify-center">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          --
        </span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center">
      {application.loanStatusId === 11 && (
        <button
          onClick={() => onCollectionClick && onCollectionClick(application, 'normal')}
          className={`px-4 py-1 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
          title="Collection"
        >
          Collection
        </button>
      )}
      
      
      {application.loanStatusId === 19 && (
        <button
          onClick={() => onCollectionClick && onCollectionClick(application, 'emi')}
          className={`px-4 py-1 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
          title="EMI Collection"
        >
          Emi-collection
        </button>
      )}
      {application.loanStatusId === 13 && (
        <div className={`border-2 rounded-md px-2 py-1 ${isDark ? 'border-orange-400 bg-orange-900/30' : 'border-orange-500 bg-orange-100'}`}>
          <CheckCircle className={`w-5 h-5 ${isDark ? 'text-orange-300' : 'text-orange-600'}`} />
        </div>
      )}
      {![11, 12, 13, 18, 19].includes(application.loanStatusId) && (
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>-</span>
      )}
    </div>
  );
},

"Renewal": () => {
  if (!hasPermission('collection')) {
    return (
      <div className="flex items-center justify-center">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          --
        </span>
      </div>
    );
  }

  const isLoanClosed = application.loanStatusId === 13;
  
  const showRenewalButton = [18, 11, 12, 19].includes(application.loanStatusId); 

  if (isLoanClosed) {
    return (
      <div className="flex items-center justify-center">
        <div className={`border-2 rounded-md px-2 py-1 ${isDark ? 'border-purple-400 bg-purple-900/30' : 'border-purple-500 bg-purple-100'}`}>
          <CheckCircle className={`w-5 h-5 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
        </div>
      </div>
    );
  }

  if (!showRenewalButton) {
    return (
      <div className="flex items-center justify-center">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>-</span>
      </div>
    );
  }

  // Show renewal button for eligible statuses
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => onRenewalClick && onRenewalClick(application)}
        className={`px-4 py-1 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
        title="Renew Loan"
      >
        Renewal
      </button>
    </div>
  );
},
      "Loan No.": () => (
    <button
      onClick={() => router.push(`/crm/statement-of-account?id=${application.id}`)}
      className={`text-sm underline cursor-pointer transition-colors duration-200 ${
        isDark
          ? "text-emerald-400 hover:text-emerald-300"
          : "text-emerald-600 hover:text-emerald-800"
      }`}
    >
      {application.loanNo}
    </button>
  ),
      "CRN No.": () => (
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
      ),
      "Approved Date": () => (
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {application.approvedDate || 'N/A'}
          </span>
        </div>
      ),
      "Disburse Date": () => (
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {application.disburseDate}
          </span>
        </div>
      ),
      "Due Date": () => (
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {application.dueDate}
          </span>
        </div>
      ),
      "Name": () => (
        <span className={`font-medium text-sm ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {application.name}
        </span>
      ),
      "Current Address": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.currentAddress}
        </span>
      ),
      "Current State": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.currentState}
        </span>
      ),
      "Current City": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.currentCity}
        </span>
      ),
      "Permanent Address": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.permanentAddress}
        </span>
      ),
      "State": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.state}
        </span>
      ),
      "City": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.city}
        </span>
      ),
      "Phone No.": () => (
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {application.phoneNo}
          </span>
        </div>
      ),
      "E-mail": () => (
        <div className="flex items-center space-x-2">
          <Mail className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {application.email}
          </span>
        </div>
      ),
      "Applied Amount": () => (
        <div className={`px-2 rounded-md ${isLoanClosed ? 
          (isDark ? "bg-blue-900/40 text-blue-200 border border-blue-700/50" : "bg-blue-100 text-blue-800 border border-blue-300") 
          : isRenewalLoan ?
          (isDark ? "bg-blue-900/30 text-blue-200 border border-blue-700/40" : "bg-blue-100 text-blue-800 border border-blue-300")
          : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"}`}>
          <span className={`text-sm font-semibold`}>
            {formatCurrency(application.appliedAmount)}
          </span>
        </div>
      ),
      "Amount Approved": () => (
        <div className={`px-2 rounded-md ${isLoanClosed ? 
          (isDark ? "bg-orange-900/40 text-orange-200 border border-orange-700/50" : "bg-orange-100 text-orange-800 border border-orange-300") 
          : isRenewalLoan ?
          (isDark ? "bg-blue-900/30 text-blue-200 border border-blue-700/40" : "bg-blue-100 text-blue-800 border border-blue-300")
          : "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300"}`}>
          <span className={`text-sm font-semibold`}>
            {formatCurrency(application.approvedAmount)}
          </span>
        </div>
      ),
      "Admin Fee": () => (
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {formatCurrency(application.adminFee)}
          </span>
          <span className={`text-xs ${isDark ? "text-emerald-300" : "text-emerald-600 font-semibold"}`}>
            ({application.processPercent || 0}%)
          </span>
        </div>
      ),
      "ROI": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.roi}%
        </span>
      ),
      "Tenure": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.tenure} days
        </span>
      ),
      "Photo": () => (
        <PhotoDocument
          fileName={application.photoFileName}
          hasDoc={application.hasPhoto}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "Pan Proof": () => (
        <PanCardDocument
          fileName={application.panCardFileName}
          hasDoc={application.hasPanCard}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "Address Proof": () => (
        <AddressProofDocument
          fileName={application.addressProofFileName}
          hasDoc={application.hasAddressProof}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "ID Proof": () => (
        <IdProofDocument
          fileName={application.idProofFileName}
          hasDoc={application.hasIdProof}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "Salary Proof": () => (
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
      ),
      "Bank Statement": () => (
        <BankStatementDocument
          fileName={application.bankStatementFileName}
          hasDoc={application.hasBankStatement}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "Video KYC": () => (
        <VideoKYCDocument
          fileName={application.videoKycFileName}
          hasDoc={application.hasVideoKyc}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "Approval Note": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.approvalNote || "N/A"}
        </span>
      ),
      "Enquiry Source": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.enquirySource || "N/A"}
        </span>
      ),
      "Bank Verification Report": () => (
        <BankVerificationDocument
          fileName={application.bankVerificationFileName}
          hasDoc={application.hasBankVerificationReport}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "Social Score Report": () => (
        <SocialScoreDocument
          fileName={application.socialScoreFileName}
          hasDoc={application.hasSocialScoreReport}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "Cibil Score Report": () => (
        <CibilScoreDocument
          fileName={application.cibilScoreFileName}
          hasDoc={application.hasCibilScoreReport}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "NACH Form": () => (
        <NachFormDocument
          fileName={application.nachFormFileName}
          hasDoc={application.hasNachForm}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "PDC": () => (
        <PDCDocument
          fileName={application.pdcFileName}
          hasDoc={application.hasPdc}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "Agreement": () => ( 
        <AgreementDocument
          fileName={application.agreementFileName}
          hasDoc={application.hasAgreement}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "Cheque No.": () => {
  if (!hasPermission('check_no')) {
    return (
      <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
        {application.chequeNo ? (
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-md text-xs font-medium ${
              isDark ? "bg-gray-900/50 text-gray-300 border border-gray-700" : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}>
              {application.chequeNo}
            </span>
            <div className="p-1 rounded-md">
              <Edit className={`w-4 h-4 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
            </div>
          </div>
        ) : (
          <div className={`px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r ${
            isDark ? "from-gray-700 to-gray-800 text-gray-400" : "from-gray-300 to-gray-400 text-gray-500"
          }`}>
            Cheque
          </div>
        )}
      </div>
    );
  }

  return (
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
  );
},
      "Send To Courier": () => (
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
      ),
      "Courier Picked": () => (
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
      ),
      "Original Documents Received": () => (
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
      ),
      "Disburse Behalf of E-mandate": () => (
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
      ),
      "Loan Term": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.loanTerm}
        </span>
      ),
      "Disbursal Account": () => (
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.disbursalAccount}
        </span>
      ),
      "Customer A/c Verified": () => (
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
      ),
      "Sanction Letter": () => (
        <SanctionLetterDocument
          fileName={application.sanctionLetterFileName}
          hasDoc={application.sanctionLetter}
          onFileView={onFileView}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
          isDark={isDark}
        />
      ),
      "ICICI Emandate Status": () => {
        let enachAccount = null;
        let customerAccount = null;
        
        if (application.enachDetails?.details) {
          const enachMatch = application.enachDetails.details.match(/enach_ac_no:\s*(\d+)/);
          if (enachMatch) {
            enachAccount = enachMatch[1];
          }
          
          const customerMatch = application.enachDetails.details.match(/customer_ac_no:\s*(\d+)/);
          if (customerMatch) {
            customerAccount = customerMatch[1];
          }
        }
        
        const accountsMatch = enachAccount && customerAccount && enachAccount === customerAccount;
        const isPending = !application.enachDetails?.status || application.enachDetails?.status === "Pending";
        const isSuccess = application.enachDetails?.status === "Success";
        
        return (
          <div className={`flex flex-col p-2.5 rounded-lg min-w-[200px] space-y-1.5 ${
            isDark 
              ? "bg-gray-800/50 border border-gray-700/50" 
              : "bg-gray-50 border border-gray-200"
          }`}>
            
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
            
            {!isPending && isSuccess && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>E-Nach Ac.:</span>
                  <span className={`text-xs font-mono font-semibold ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}>
                    {enachAccount || "N/A"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>Cust. Ac.:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-xs font-mono font-semibold ${
                      isDark ? "text-amber-300" : "text-amber-600"
                    }`}>
                      {customerAccount || "N/A"}
                    </span>
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
            
            {!isPending && (
              <div className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                <span className="font-medium">{application.name || "N/A"}</span>
              </div>
            )}
          </div>
        );
      },
      "Bank A/c Verification": () => {
        const handleBankVerificationClick = () => {
          if (application.bankVerification === "not_verified") {
            onBankVerification(application);
          }
        };
        
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={handleBankVerificationClick}
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
        );
      },
      "Disburse Approval": () => {
        const handleDisburseApprovalClick = () => {
          if (application.disburseApproval === "not_approved") {
            onDisburseApproval(application);
          }
        };
        
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={handleDisburseApprovalClick}
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
        );
      },
      "Disburse": () => (
        <div className={`border-2 rounded-md px-1 py-1 text-center ${
          isLoanClosed ? 
          (isDark ? 'border-emerald-400 text-center bg-emerald-900/30' : 'border-emerald-500 text-center bg-emerald-100') 
          : isRenewalLoan ?
          (isDark ? 'border-blue-400 bg-blue-900/30' : 'border-blue-500 bg-blue-100')
          : 'border-green-500 bg-green-500'}`}>
          <CheckCircle className={`w-5 h-5 ${
            isLoanClosed ? 
            (isDark ? 'text-emerald-300' : 'text-emerald-600') 
            : isRenewalLoan ?
            (isDark ? 'text-blue-300' : 'text-blue-600')
            : 'text-white'}`} />
        </div>
      ),
      "Action": () => (
  <ActionButton
    enquiry={application}
    isDark={isDark}
    onVerifyClick={onActionClick} 
    className="w-full flex justify-center"
  />
),

      "Remarks": () => (
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
      ),    
      "NOC": () => {
  if (!hasPermission('noc')) {
    return (
      <div className="flex flex-col items-center justify-center space-y-1">
        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>--</span>
      </div>
    );
  }

  const hasNOC = application.nocIssued === "issued";
  
  const handleNOCPDFView = async () => {
    try {
      // Use local state for NOC loading
      setNocLoading(true);
      
      // Fetch NOC PDF URL from API
      const response = await manageApplicationService.getNOCPDF(application.id);
      
      if (response.success && response.data.base64) {
        // Convert base64 to blob
        const binaryString = atob(response.data.base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { 
          type: response.data.mime_type || 'application/pdf' 
        });
        const url = URL.createObjectURL(blob);
        
        // Open in new tab
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          toast.error('Popup blocked! Please allow popups for this site.');
          URL.revokeObjectURL(url);
        }
      } else {
        toast.error('Failed to load NOC PDF');
      }
    } catch (error) {
      console.error('Error loading NOC PDF:', error);
      toast.error('Failed to load NOC PDF');
    } finally {
      setNocLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      {hasNOC ? (
        <div className="flex flex-col items-center space-y-1">
          {/* Status button with PDF icon */}
          <div className="flex items-center space-x-2">
            <div className={`px-4 py-0.5 rounded-md text-sm font-medium bg-gradient-to-r ${
              isDark
                ? "from-emerald-700 to-emerald-800 text-emerald-100 border border-emerald-600"
                : "from-emerald-200 to-emerald-300 text-emerald-800 border border-emerald-400"
            } flex items-center space-x-1`}>
              <CheckCircle className="w-4 h-4" />
              <span>Issued</span>
            </div>
            
            {/* PDF icon - Check permission for viewing too */}
            {hasPermission('noc') && (
              <button
                onClick={handleNOCPDFView}
                disabled={nocLoading}
                className={`p-1 rounded transition-colors ${
                  nocLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } ${isDark ? "text-red-400 bg-red-50" : "text-red-500 bg-red-200"}`}
                title="View NOC PDF"
              >
                {nocLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FaFilePdf className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          
          {/* NOC Date */}
          {application.nocDate && (
            <div className="flex items-center space-x-1">
              <Calendar className={`w-3 h-3 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-xs ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                {new Date(application.nocDate).toLocaleDateString('en-GB')}
              </span>
            </div>
          )}
        </div>
      ) : (
        application.loanStatusId === 13 ? (
          <button
            onClick={() => onNOCModalOpen && onNOCModalOpen(application)}
            className={`px-6 py-1 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r ${
              isDark
                ? "from-cyan-500 to-cyan-600 hover:from-cyan-700 hover:to-cyan-800 text-white"
                : "from-cyan-400 to-cyan-500 hover:from-cyan-600 hover:to-cyan-700 text-white"
            } shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1`}
            title="Generate NOC"
          >
            <FileText className="w-4 h-4" />
            <span>NOC</span>
          </button>
        ) : (
          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>--</span>
        )
      )}
    </div>
  );
},
      "Refund PDC": () => {
  if (!hasPermission('refund_pdc')) {
    return (
      <div className="flex flex-col items-center justify-center space-y-1">
        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>--</span>
      </div>
    );
  }

  const isRefunded = application.refundPdc === "Yes";
  const isCancelled = application.refundPdc === "Cancel";
  
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      {isRefunded || isCancelled ? (
        <div className="flex flex-col items-center space-y-1">
          {/* Status button - User can see status even if they can't update */}
          <div className={`px-4 py-1 rounded-md text-sm font-medium ${
            isRefunded
              ? isDark
                ? "bg-green-900/50 text-green-300 border border-green-700"
                : "bg-green-100 text-green-800 border border-green-200"
              : isDark
                ? "bg-red-900/50 text-red-300 border border-red-700"
                : "bg-red-100 text-red-800 border border-red-200"
          } flex items-center space-x-1`}>
            <CheckCircle className="w-4 h-4" />
            <span>{isRefunded ? "Refunded" : "Cancelled"}</span>
          </div>
          
          {/* Status date */}
          {application.pdcDate && (
            <div className="flex items-center space-x-1">
              <Calendar className={`w-3 h-3 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-xs ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                {application.pdcDate ? new Date(application.pdcDate).toLocaleDateString('en-GB') : ''}
              </span>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => onRefundPDCClick && onRefundPDCClick(application)}
          className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 ${
            application.refundPdc === "Yes"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
              : application.refundPdc === "Cancel"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          } shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1`}
          title="Update Refund PDC Status"
        >
          <FileText className="w-4 h-4" />
          <span>
            {application.refundPdc || "Update"}
          </span>
        </button>
      )}
    </div>
  );
},

      "Appraisal Report": () => (
  <AppraisalReportButton
    enquiry={application}
    isDark={isDark}
    onFileView={onFileView}
    onCheckClick={onCheckClick}
    className="w-full flex justify-center"
  />
),

"Eligibility": () => (
  <EligibilityButton
    enquiry={application}
    isDark={isDark}
    onLoanEligibilityClick={onLoanEligibilityClick}
    className="w-full flex justify-center"
  />
),

"Replace KYC": () => (
  <ReplaceKYCButton
    application={application}
    isDark={isDark}
    onReplaceKYCClick={onReplaceKYCClick}
  />
),
      "Settled": () => {
  if (application.settled === 1) {
    return (
      <div className="flex items-center justify-center">
        <span className={`px-3 py-1 rounded-md text-sm font-semibold flex items-center space-x-1 ${
          isDark 
            ? "bg-green-900/50 text-green-300 border border-green-700"
            : "bg-green-100 text-green-700 border border-green-200"
        }`}>
          <CheckCircle className="w-4 h-4" />
          <span>Loan Settled</span>
        </span>
      </div>
    );
  } else {
    return (
      <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>--</span>
    );
  }
},
    };

    if (cellMap[headerLabel]) {
      return cellMap[headerLabel]();
    }
    
    // Default cell if not found
    return (
      <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {application[headerLabel] || "N/A"}
      </span>
    );
  };

  return (
    <tr className={getRowClasses()}>
      {visibleHeaders.map((header, idx) => (
        <td key={idx} className={cellStyle}>
          {renderCell(header.label)}
        </td>
      ))}
    </tr>
  );
};

export default ApplicationRow;