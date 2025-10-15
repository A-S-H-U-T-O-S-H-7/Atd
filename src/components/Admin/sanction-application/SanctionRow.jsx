import {
  FileText,
  Edit,
  CheckCircle,
  Calendar,
  Mail,
  X,
  Play,
  Edit2
} from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useState } from "react";
import Swal from 'sweetalert2';


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
  onCall,
  onActionClick
}) => {
  const [chequeNumber, setChequeNumber] = useState(application.chequeNo || "");
    const [readyForApprove, setReadyForApprove] = useState(application.readyForApprove || "pending");

    const handleReadyForApprove = () => {
      if (readyForApprove === "pending") {
        Swal.fire({
          title: 'Ready for Approve',
          text: 'Are you sure you want to change the status?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#10b981',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Ready to Verify',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            setReadyForApprove("ready_to_verify");
          }
        });
      }
    };

  const handleChequeClick = () => {
    onChequeModalOpen(application, chequeNumber);
  };

  const formatCurrency = amount => {
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2
    })}`;
  };

  const handleCallSubmit = callData => {
    // Handle call submission logic
    console.log("Call submitted:", callData);
  };

  const handleCall = application => {
    onCall(true);
  };

  // Handle file opening with Firebase
  const handleFileClick = async (fileName, fileType) => {
    if (!fileName) return;

    try {
      const fileRef = ref(storage, `${fileType}/${fileName}`);
      const url = await getDownloadURL(fileRef);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to get file URL:", error);
      alert("Failed to load file");
    }
  };

  const DocumentIcon = ({ hasFile, fileName, fileType, title, isDisabled }) =>
    <div className="flex items-center justify-center">
      {hasFile
        ? <button
            onClick={() => handleFileClick(fileName, fileType)}
            disabled={isDisabled}
            className={`p-2 rounded-lg transition-colors duration-200 ${isDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 cursor-pointer"}`}
            title={title}
          >
            <FileText className="text-lg" />
          </button>
        : <div
            className="p-1 rounded-lg bg-red-100 text-red-600"
            title="Document Missing"
          >
            <X size={16} />
          </div>}
    </div>;

  const VideoKycIcon = ({ hasFile, fileName, title }) =>
    <div className="flex items-center justify-center">
      {hasFile
        ? <button
            onClick={() => handleFileClick(fileName, "videokyc")}
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 cursor-pointer transition-colors duration-200"
            title={title}
          >
            <Play className="text-lg" />
          </button>
        : <div
            className="p-1 rounded-lg bg-red-100 text-red-600"
            title="Video KYC Missing"
          >
            <X size={16} />
          </div>}
    </div>;

  const SanctionLetterIcon = ({ hasFile, fileName, title }) =>
    <div className="flex items-center justify-center">
      {hasFile
        ? <button
            onClick={() => handleFileClick(fileName, "sanctionletter")}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer transition-colors duration-200"
            title={title}
          >
            <FileText className="text-lg" />
          </button>
        : <div
            className="p-1 rounded-lg bg-red-100 text-red-600"
            title="Sanction Letter Missing"
          >
            <X size={16} />
          </div>}
    </div>;

  const PdfIcon = ({ hasFile, fileName, fileType, title, isDisabled }) =>
    <div className="flex items-center justify-center">
      {hasFile
        ? <button
            onClick={() => handleFileClick(fileName, fileType)}
            disabled={isDisabled}
            className={`p-1 rounded-lg transition-colors duration-200 ${isDisabled
              ? " text-gray-400 cursor-not-allowed"
              : "  text-red-500 cursor-pointer"}`}
            title={title}
          >
            <FaRegFilePdf size={25} />
          </button>
        : <div
            className="p-1 rounded-lg bg-red-100 text-red-600"
            title="Document Missing"
          >
            <X size={16} />
          </div>}
    </div>;

  const NachPdcCell = ({
    hasNach,
    hasNachFile,
    nachFileName,
    hasPdc,
    hasPdcFile,
    pdcFileName
  }) =>
    <div className="flex items-center justify-center">
      {hasNach && hasNachFile
        ? <button
            onClick={() => handleFileClick(nachFileName, "agreement")}
            className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer transition-colors duration-200"
            title="View NACH Form"
          >
            <FileText className="text-lg" />
          </button>
        : hasPdc && hasPdcFile
          ? <button
              onClick={() => handleFileClick(pdcFileName, "agreement")}
              className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer transition-colors duration-200"
              title="View PDC"
            >
              <FileText className="text-lg" />
            </button>
          : <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
              Behalf of E-Mandate
            </span>}
    </div>;

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${isDark
        ? "border-emerald-700 hover:bg-gray-700/50"
        : "border-emerald-300 hover:bg-emerald-50/50"} ${index % 2 === 0
        ? isDark ? "bg-gray-700/30" : "bg-gray-50"
        : ""}`}
    >
      {/* SR No */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-medium ${isDark
            ? "text-gray-100"
            : "text-gray-900"}`}
        >
          {application.srNo}
        </span>
      </td>

      {/* Call */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <button
          onClick={handleCall}
          className={`px-6 cursor-pointer py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105 ${isDark
            ? "bg-blue-900/50 text-blue-300 border-blue-700 hover:bg-blue-800"
            : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"}`}
        >
          call
        </button>
      </td>

      {/* Loan No. */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.loanNo}
        </span>
      </td>

      {/* CRN No */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {application.crnNo}
        </span>
      </td>

      {/* Account ID */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.accountId}
        </span>
      </td>

      {/* application Date */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Calendar
            className={`w-4 h-4 ${isDark
              ? "text-emerald-400"
              : "text-emerald-600"}`}
          />
          <span
            className={`text-sm font-medium ${isDark
              ? "text-gray-200"
              : "text-gray-800"}`}
          >
            {application.approvedDate}
          </span>
        </div>
      </td>

     

      {/* Name */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-medium text-sm ${isDark
            ? "text-gray-100"
            : "text-gray-900"}`}
        >
          {application.name}
        </span>
      </td>

      {/* Current Address */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.currentAddress}
        </span>
      </td>

      {/* Current State */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.currentState}
        </span>
      </td>

      {/* Current City */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.currentCity}
        </span>
      </td>

      {/* Address */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.permanentAddress}
        </span>
      </td>

      {/* State */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.state}
        </span>
      </td>

      {/* City */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.city}
        </span>
      </td>

      {/* Phone No */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            {application.phoneNo}
          </span>
        </div>
      </td>

      {/* E-mail */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-2">
          <Mail className={`w-4 h-4 text-emerald-400 flex-shrink-0`} />
          <span
            className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            {application.email}
          </span>
        </div>
      </td>

      {/* Approved Amount */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="bg-gradient-to-r px-2 py-1 rounded-md from-orange-100 to-orange-200 text-orange-800 border border-orange-300">
          <span
            className={`text-sm  font-semibold ${isDark
              ? "text-orange-900"
              : "text-orange-800"}`}
          >
            {formatCurrency(application.approvedAmount)}
          </span>
        </div>
      </td>

      {/* Admin Fee */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {formatCurrency(application.adminFee)}
        </span>
      </td>

      {/* ROI */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.roi}%
        </span>
      </td>

      {/* Tenure */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.tenure} days
        </span>
      </td>

      {/* Photo */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <DocumentIcon
          hasFile={application.hasPhoto}
          fileName={application.photoFileName}
          fileType="photo"
          title="View Photo"
        />
      </td>

      {/* Pan Card */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <DocumentIcon
          hasFile={application.hasPanCard}
          fileName={application.panCardFileName}
          fileType="pancard"
          title="View Pan Card"
        />
      </td>

      {/* Address Proof */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <DocumentIcon
          hasFile={application.hasAddressProof}
          fileName={application.addressProofFileName}
          fileType="addressproof"
          title="View Address Proof"
        />
      </td>

      {/* ID Proof */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <DocumentIcon
          hasFile={application.hasIdProof}
          fileName={application.idProofFileName}
          fileType="idproof"
          title="View ID Proof"
        />
      </td>

      {/* Salary Proof - Multiple Files */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex space-x-2">
          <DocumentIcon
            hasFile={application.hasSalaryProof}
            fileName={application.salarySlip1}
            fileType="salary"
            title="View First Salary Slip"
          />
          <DocumentIcon
            hasFile={application.hasSecondSalaryProof}
            fileName={application.salarySlip2}
            fileType="salary"
            title="View Second Salary Slip"
          />
          <DocumentIcon
            hasFile={application.hasThirdSalaryProof}
            fileName={application.salarySlip3}
            fileType="salary"
            title="View Third Salary Slip"
          />
        </div>
      </td>

      {/* Bank Statement */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <DocumentIcon
          hasFile={application.hasBankStatement}
          fileName={application.bankStatementFileName}
          fileType="bankstatement"
          title="View Bank Statement"
        />
      </td>

      {/* Video KYC */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <VideoKycIcon
          hasFile={application.hasVideoKyc}
          fileName={application.videoKycFileName}
          title="View Video KYC"
        />
      </td>

      {/* Approval Note */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.approvalNote || "N/A"}
        </span>
      </td>

      {/* Application Source */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.enquirySource || "N/A"}
        </span>
      </td>

      {/* Bank Verification Report */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <DocumentIcon
          hasFile={application.hasBankVerificationReport}
          fileName={application.bankVerificationFileName}
          fileType="bankstatement"
          title="View Bank Verification Report"
        />
      </td>

      {/* Social Score Report */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <DocumentIcon
          hasFile={application.hasSocialScoreReport}
          fileName={application.socialScoreFileName}
          fileType="cibil"
          title="View Social Score Report"
        />
      </td>

      {/* CIBIL Score Report */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <DocumentIcon
          hasFile={application.hasCibilScoreReport}
          fileName={application.cibilScoreFileName}
          fileType="cibil"
          title="View CIBIL Score Report"
        />
      </td>

      {/* NACH Form */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <NachPdcCell
          hasNach={application.hasNachForm}
          hasNachFile={application.hasNachForm}
          nachFileName={application.nachFormFileName}
        />
      </td>

      {/*  PDC */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <NachPdcCell
          hasPdc={application.hasPdc}
          hasPdcFile={application.hasPdc}
          pdcFileName={application.pdcFileName}
        />
      </td>

      {/* Agreement */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <DocumentIcon
          hasFile={application.hasAgreement}
          fileName={application.agreementFileName}
          fileType="agreement"
          title="View Agreement"
        />
      </td>
      {/* Cheque */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex  items-center space-x-2">
          {chequeNumber
            ? <div className="flex  items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium ${isDark
                    ? "bg-green-900/50 text-green-300 border border-green-700"
                    : "bg-green-100 text-green-800 border border-green-200"}`}
                >
                  {chequeNumber}
                </span>
                <button
                  onClick={handleChequeClick}
                  className={`p-1 cursor-pointer rounded-md transition-colors duration-200 ${isDark
                    ? "hover:bg-gray-700 text-gray-400 hover:text-emerald-400"
                    : "hover:bg-gray-100 text-gray-500 hover:text-emerald-600"}`}
                  title="Edit cheque number"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            : <button
                onClick={handleChequeClick}
                className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r ${isDark
                  ? "from-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-xl"
                  : "from-red-400 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl"} transform hover:scale-105`}
              >
                Cheque
              </button>}
        </div>
      </td>

      {/* Send To Courier */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center justify-center">
          {application.sendToCourier === "Yes"
            ? <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Yes</span>
              </span>
            : <button
                onClick={() => onCourierModalOpen(application)}
                className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
              >
                <span>No</span>
              </button>}
        </div>
      </td>

      {/* Courier Picked */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center justify-center">
          {application.courierPicked === "Yes"
            ? <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Yes</span>
              </span>
            : <button
                onClick={() => onCourierPickedModalOpen(application)}
                className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
              >
                <span>No</span>
              </button>}
        </div>
      </td>

      {/* Original Documents */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center justify-center">
          {application.originalDocuments === "Yes"
            ? <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Yes</span>
              </span>
            : <button
                onClick={() => onOriginalDocumentsModalOpen(application)}
                className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
              >
                <span>No</span>
              </button>}
        </div>
      </td>

      {/* Disburse Behalf of E-mandate */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center justify-center">
          {application.receivedDisburse === "Yes"
            ? <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Yes</span>
              </span>
            : application.receivedDisburse === "No"
              ? <button
                  onClick={() => onDisburseEmandateModalOpen(application)}
                  className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
                >
                  <span>No</span>
                </button>
              : <button
                  onClick={() => onDisburseEmandateModalOpen(application)}
                  className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
                >
                  <span>Verify</span>
                </button>}
        </div>
      </td>

      {/* Loan Term */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.loanTerm}
        </span>
      </td>

      {/* Disbursal Account */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.disbursalAccount}
        </span>
      </td>

      {/* Customer A/c Verified */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center justify-center">
          {application.customerAcVerified === "Yes"
            ? <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Yes</span>
              </span>
            : <button className="px-3 py-1  rounded-2xl text-xs font-medium transition-all duration-200 bg-gradient-to-r from-red-400 to-red-600  text-white shadow-lg  transform  flex items-center space-x-1">
                <X className="w-3 h-3" />
                <span>No</span>
              </button>}
        </div>
      </td>
      {/* Sanction Letter */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <PdfIcon
          hasFile={application.sanctionLetter}
          fileName={application.sanctionLetterFileName}
          fileType="sanctionletter"
          title="View Sanction Letter PDF"
        />
      </td>

      {/* Emandate Status */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {application.emandateStatus}
        </span>
      </td>

      {/* ICICI Emandate Status */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {application.iciciEmandateStatus}
        </span>
      </td>

       {/* Ready For Approve Column */}
      <td className={`px-6 py-4 text-center border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
      <button
        onClick={handleReadyForApprove}
        className={`px-3 py-1 border rounded-md text-xs font-medium flex items-center justify-center space-x-1 transition-colors duration-200 ${
          readyForApprove === "pending"
            ? "bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
            : "bg-green-100 text-green-600 cursor-default"
        }`}
      >
        {readyForApprove === "pending" ? (
          <span>Pending</span>
        ) : (
          <>
            <CheckCircle size={14} />
            <span>Ready to Verify</span>
          </>
        )}
      </button>
    </td>

      {/* Loan Status */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-orange-400"
            : "text-orange-600"}`}
        >
          {application.loanStatus}
        </span>
      </td>

      {/* Change Status */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center justify-center">
          <button
            onClick={() => onChangeStatusClick(application, "change-status")}
            className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
            title="Change Status"
          >
            <Edit2 className="w-4 h-4" />
            <span>Change Status</span>
          </button>
        </div>
      </td>

      {/* Action */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
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
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        {application.finalReportStatus === "Recommended"
          ? <button
              onClick={() =>
                onFileView(application, application.finalReportFile)}
              className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs"
            >
              Recomended
            </button>
          : application.isFinalStage
            ? <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                Locked
              </span>
            : <button
                onClick={() => onCheckClick(application)}
                className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${isDark
                  ? "bg-pink-900/50 border hover:bg-pink-800 text-pink-300"
                  : "bg-pink-100 border hover:bg-pink-200 text-pink-700"}`}
              >
                Check
              </button>}
      </td>

      {/* Eligibility */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <button
          onClick={() => onLoanEligibilityClick(application)}
          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${isDark
            ? "bg-teal-900/50 border hover:bg-teal-800 text-teal-300"
            : "bg-teal-100 border hover:bg-teal-200 text-teal-700"}`}
        >
          Eligibility
        </button>
      </td>

      {/* Replace KYC */}
      <td className={`px-6 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <button
          onClick={() => onReplaceKYCClick(application)}
          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${isDark
            ? "bg-purple-900/50 border hover:bg-purple-800 text-purple-300"
            : "bg-purple-100 border hover:bg-purple-200 text-purple-700"}`}
        >
          Replace KYC
        </button>
      </td>
    </tr>
  );
};

export default SanctionRow;
