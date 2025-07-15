import { FileText, Calendar, Mail, X } from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const ReturnedRow = ({
  application,
  index,
  isDark,
  onLoanEligibilityClick,
  onCheckClick,
  onActionClick,
}) => {
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
    setShowCallModal(true);
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

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${isDark
        ? "border-emerald-700 hover:bg-gray-700/50"
        : "border-emerald-300 hover:bg-emerald-50/50"} ${index % 2 === 0
        ? isDark ? "bg-gray-700/30" : "bg-gray-50"
        : ""}`}
    >
      {/* SR No */}
      <td className="px-6 py-4">
        <span
          className={`font-medium ${isDark
            ? "text-gray-100"
            : "text-gray-900"}`}
        >
          {application.srNo}
        </span>
      </td>

      

      {/* Form No */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.formNo || "N/A"}
        </span>
      </td>

      

      {/* CRN No */}
      <td className="px-6 py-4">
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {application.crnNo}
        </span>
      </td>

      {/* Account ID */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.accountId}
        </span>
      </td>

      {/* Enquiry Date */}
      <td className="px-6 py-4">
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
            {application.enquiryDate}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className="px-6 py-4">
        <span
          className={`font-medium text-sm ${isDark
            ? "text-gray-100"
            : "text-gray-900"}`}
        >
          {application.name}
        </span>
      </td>


      {/* Address */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.permanentAddress}
        </span>
      </td>

      {/* State */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.state}
        </span>
      </td>

      {/* City */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.city}
        </span>
      </td>

      {/* Phone No */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            {application.phoneNo}
          </span>
        </div>
      </td>

      {/* E-mail */}
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
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

      {/* ROI */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.roi}%
        </span>
      </td>

      {/* Tenure */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.tenure} days
        </span>
      </td>

      {/* Loan Term */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.loanTerm}
        </span>
      </td>

      {/* Photo */}
      <td className="px-6 py-4">
        <DocumentIcon
          hasFile={application.hasPhoto}
          fileName={application.photoFileName}
          fileType="photo"
          title="View Photo"
        />
      </td>

      {/* Pan Card */}
      <td className="px-6 py-4">
        <DocumentIcon
          hasFile={application.hasPanCard}
          fileName={application.panCardFileName}
          fileType="pancard"
          title="View Pan Card"
        />
      </td>

      {/* Address Proof */}
      <td className="px-6 py-4">
        <DocumentIcon
          hasFile={application.hasAddressProof}
          fileName={application.addressProofFileName}
          fileType="addressproof"
          title="View Address Proof"
        />
      </td>

      {/* ID Proof */}
      <td className="px-6 py-4">
        <DocumentIcon
          hasFile={application.hasIdProof}
          fileName={application.idProofFileName}
          fileType="idproof"
          title="View ID Proof"
        />
      </td>

      {/* Salary Proof - Multiple Files */}
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
        <DocumentIcon
          hasFile={application.hasBankStatement}
          fileName={application.bankStatementFileName}
          fileType="bankstatement"
          title="View Bank Statement"
        />
      </td>


      {/* Remark */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.remark || "N/A"}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-orange-400"
            : "text-orange-600"}`}
        >
          {application.loanStatus}
        </span>
      </td>

     
      {/* Appraisal Report */}
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
        <button
          onClick={() => onLoanEligibilityClick(application)}
          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${isDark
            ? "bg-teal-900/50 border hover:bg-teal-800 text-teal-300"
            : "bg-teal-100 border hover:bg-teal-200 text-teal-700"}`}
        >
          Eligibility
        </button>
      </td>


      {/* Action */}
      <td className="px-6 py-4">
        <button
          onClick={() => onActionClick(application)}
          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${isDark
            ? "bg-blue-900/50 border hover:bg-blue-800 text-blue-300"
            : "bg-blue-100 border hover:bg-blue-200 text-blue-700"}`}
        >
          Verify
        </button>
      </td> 
    </tr>
  );
};

export default ReturnedRow;
