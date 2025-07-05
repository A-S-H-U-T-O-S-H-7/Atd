import React from "react";
import { FileText, Edit, Eye, CheckCircle, XCircle, Clock, AlertCircle, Phone, DollarSign, Calendar, MapPin, Mail, User } from "lucide-react";

const ApplicationRow = ({ 
  application, 
  index, 
  isDark, 
  onFileView, 
  onActionClick 
}) => {
  const rowStyle = `border-b transition-all duration-300  hover:shadow-lg ${
    isDark
      ? "bg-gray-800/50 hover:bg-gray-700/80 border-gray-600"
      : "bg-white hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-blue-50/30 border-gray-200"
  } ${index % 2 === 0 ? (isDark ? "bg-gray-700/20" : "bg-gray-50/50") : ""}`;

  const cellStyle = `px-4 py-3 text-sm ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { color: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300', icon: CheckCircle },
      'Pending': { color: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300', icon: Clock },
      'Inactive': { color: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300', icon: XCircle },
      'Disbursed': { color: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300', icon: CheckCircle },
      'Collection': { color: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300', icon: AlertCircle },
      'Closed': { color: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300', icon: XCircle }
    };

    const config = statusConfig[status] || { color: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300', icon: AlertCircle };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${config.color}`}>
        <Icon className="w-3 h-3 mr-1.5" />
        {status}
      </span>
    );
  };

  const getVerificationIcon = (hasDocument) => {
    return hasDocument ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleFileClick = (fileName) => {
    if (fileName && onFileView) {
      onFileView(application, fileName);
    }
  };

  const DocumentIcon = ({ hasFile, fileName, title }) => (
    <div className="flex items-center justify-center">
      {hasFile ? (
        <button
          onClick={() => handleFileClick(fileName)}
          className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
            isDark
              ? 'bg-indigo-900/50 hover:bg-indigo-800/70 text-indigo-300 border border-indigo-700'
              : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-200'
          } shadow-sm hover:shadow-md`}
          title={title || "View Document"}
        >
          <FileText className="w-4 h-4" />
        </button>
      ) : (
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'
        } border border-red-300`} title="Document Missing">
          <XCircle className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  const ActionButton = ({ onClick, bgColor, hoverColor, icon: Icon, title }) => (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg ${bgColor} ${hoverColor} text-white transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const InfoBadge = ({ children, variant = "default" }) => {
    const variants = {
      default: isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700",
      orange: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300",
      green: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",
      red: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
      blue: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300",
      purple: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300",
      yellow: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium shadow-sm ${variants[variant]}`}>
        {children}
      </span>
    );
  };

  return (
    <tr className={rowStyle}>
      {/* SR No */}
      <td className="px-6 py-4">
        <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {application.srNo}
        </span>
      </td>

      {/* Call */}
            <td className="px-6 py-4">
              <button
              // onClick={handleCall}
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
                  isDark
                    ? "bg-blue-900/50 hover:bg-blue-800 text-blue-300 border border-blue-700"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200"
                }`}
              >
                <Phone size={14} />
                <span>Call</span>
              </button>
            </td>

      {/* Loan No. */}
      <td className={`${cellStyle} font-semibold`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
            {application.loanNo}
          </span>
        </div>
      </td>

      {/* CRN No. */}
      <td className={cellStyle}>
        <span className={`font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}>
          {application.crnNo}
        </span>
      </td>

      {/* Account ID */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.accountId}
        </span>
      </td>

      {/* Approved Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{formatDate(application.approvedDate)}</span>
        </div>
      </td>

      {/* Disburse Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{formatDate(application.disburseDate)}</span>
        </div>
      </td>

      {/* Due Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{formatDate(application.dueDate)}</span>
        </div>
      </td>

      {/* Name */}
      <td className={`${cellStyle} font-semibold`}>
        <div className="flex items-center space-x-2">
          <span className={`${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {application.name}
          </span>
        </div>
      </td>

      {/* Current Address */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <div className="max-w-[160px] truncate" title={application.currentAddress}>
            {application.currentAddress}
          </div>
        </div>
      </td>

      {/* Current State */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.currentState}
        </InfoBadge>
      </td>

      {/* Current City */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.currentCity}
        </InfoBadge>
      </td>

      {/* Permanent Address */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <MapPin className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"} flex-shrink-0`} />
          <div className="max-w-[160px] truncate" title={application.permanentAddress}>
            {application.permanentAddress}
          </div>
        </div>
      </td>

      {/* State */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.state}
        </InfoBadge>
      </td>

      {/* City */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.city}
        </InfoBadge>
      </td>

      {/* Phone No. */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Phone className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
          <span className="text-sm font-medium">{application.phoneNo}</span>
        </div>
      </td>

      {/* Email */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Mail className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"} flex-shrink-0`} />
          <div className="max-w-[180px] truncate" title={application.email}>
            {application.email}
          </div>
        </div>
      </td>

      {/* Password */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          <span className="font-mono text-xs">
            {application.password}
          </span>
        </InfoBadge>
      </td>

      {/* Applied Amount */}
      <td className={`${cellStyle} font-semibold text-right`}>
        <div className="flex items-center justify-end space-x-1">
          <DollarSign className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
          <span className={`${isDark ? "text-green-400" : "text-green-600"}`}>
            {formatCurrency(application.appliedAmount)}
          </span>
        </div>
      </td>

      {/* Approved Amount */}
      <td className={`${cellStyle} font-semibold text-right`}>
        <InfoBadge variant="orange">
          <DollarSign className="w-3 h-3 mr-1" />
          {formatCurrency(application.approvedAmount)}
        </InfoBadge>
      </td>

      {/* Admin Fee */}
      <td className={`${cellStyle} text-right`}>
        <InfoBadge variant="blue">
          {application.adminFee}
        </InfoBadge>
      </td>

      {/* ROI */}
      <td className={`${cellStyle} text-right`}>
        <InfoBadge variant="purple">
          {application.roi}%
        </InfoBadge>
      </td>

      {/* Tenure */}
      <td className={`${cellStyle} text-right`}>
        <InfoBadge variant="yellow">
          {application.tenure}
        </InfoBadge>
      </td>

      {/* Renewal Sanction Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          <span className="text-sm">{formatDate(application.renewalSanctionDate)}</span>
        </div>
      </td>

      {/* Renewal Tenure */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.renewalTenure || '-'}
        </InfoBadge>
      </td>

      {/* Renewal Maturity Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
          <span className="text-sm">{formatDate(application.renewalMaturityDate)}</span>
        </div>
      </td>

      {/* Renewal Outstanding Balance */}
      <td className={cellStyle}>
        <InfoBadge variant="red">
          {application.renewalOutstandingBalance || '-'}
        </InfoBadge>
      </td>

      {/* Renewal Remarks */}
      <td className={cellStyle}>
        <span className="text-sm italic">
          {application.renewalRemarks || '-'}
        </span>
      </td>

      {/* Renewal Sanction Letter */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.renewalSanctionLetter} fileName="renewal-sanction-letter" title="Renewal Sanction Letter" />
      </td>

      {/* Photo */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasPhoto} fileName="photo" title="Photo" />
      </td>

      {/* Pan Proof */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasPanProof} fileName="pan-proof" title="PAN Proof" />
      </td>

      {/* Address Proof */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasAddressProof} fileName="address-proof" title="Address Proof" />
      </td>

      {/* ID Proof */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasIdProof} fileName="id-proof" title="ID Proof" />
      </td>

      {/* Salary Proof */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasSalaryProof} fileName="salary-proof" title="Salary Proof" />
      </td>

      {/* Bank Statement */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasBankStatement} fileName="bank-statement" title="Bank Statement" />
      </td>

      {/* Video KYC */}
      <td className={cellStyle}>
        <ActionButton
          onClick={() => onActionClick(application, 'video-kyc')}
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
          hoverColor="hover:from-green-600 hover:to-green-700"
          icon={Eye}
          title="Video KYC"
        />
      </td>

      {/* Approval Note */}
      <td className={cellStyle}>
        <InfoBadge variant="blue">
          {application.approvalNote}
        </InfoBadge>
      </td>

      {/* Enquiry Source */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.enquirySource}
        </InfoBadge>
      </td>

      {/* Bank Verification Report */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasBankVerificationReport} fileName="bank-verification-report" title="Bank Verification Report" />
      </td>

      {/* Social Score Report */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasSocialScoreReport} fileName="social-score-report" title="Social Score Report" />
      </td>

      {/* Cibil Score Report */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasCibilScoreReport} fileName="cibil-score-report" title="CIBIL Score Report" />
      </td>

      {/* NACH Form */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasNachForm} fileName="nach-form" title="NACH Form" />
      </td>

      {/* PDC */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasPdc} fileName="pdc" title="PDC" />
      </td>

      {/* Agreement */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.hasAgreement} fileName="agreement" title="Agreement" />
      </td>

      {/* Cheque No. */}
      <td className={cellStyle}>
        <InfoBadge variant="red">
          {application.chequeNo}
        </InfoBadge>
      </td>

      {/* Send To Courier */}
      <td className={cellStyle}>
        <InfoBadge variant="red">
          {application.sendToCourier}
        </InfoBadge>
      </td>

      {/* Courier Picked */}
      <td className={cellStyle}>
        <InfoBadge variant="red">
          {application.courierPicked}
        </InfoBadge>
      </td>

      {/* Original Documents */}
      <td className={cellStyle}>
        <InfoBadge variant="red">
          {application.originalDocuments}
        </InfoBadge>
      </td>

      {/* Received Disburse */}
      <td className={cellStyle}>
        <InfoBadge variant="green">
          {application.receivedDisburse}
        </InfoBadge>
      </td>

      {/* Behalf of E-mandate */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.behalfOfEmandate}
        </InfoBadge>
      </td>

      {/* Loan Term */}
      <td className={cellStyle}>
        <InfoBadge variant="blue">
          {application.loanTerm}
        </InfoBadge>
      </td>

      {/* Disbursal Account */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.disbursalAccount}
        </InfoBadge>
      </td>

      {/* Customer A/c Verified */}
      <td className={cellStyle}>
        <InfoBadge variant="green">
          {application.customerAcVerified}
        </InfoBadge>
      </td>

      {/* Sanction Letter */}
      <td className={cellStyle}>
        <DocumentIcon hasFile={application.sanctionLetter} fileName="sanction-letter" title="Sanction Letter" />
      </td>

      {/* Emandate Status */}
      <td className={cellStyle}>
        <InfoBadge variant="red">
          {application.emandateStatus}
        </InfoBadge>
      </td>

      {/* ICICI Emandate Status */}
      <td className={cellStyle}>
        <InfoBadge variant="green">
          {application.iciciEmandateStatus}
        </InfoBadge>
      </td>

      {/* Ready For Approve */}
      <td className={cellStyle}>
        <InfoBadge variant="green">
          {application.readyForApprove}
        </InfoBadge>
      </td>

      {/* Bank A/c Verification */}
      <td className={cellStyle}>
        <InfoBadge variant="green">
          {application.bankAcVerification}
        </InfoBadge>
      </td>

      {/* Disburse Approval */}
      <td className={cellStyle}>
        <InfoBadge variant="green">
          {application.disburseApproval}
        </InfoBadge>
      </td>

      {/* Disburse */}
      <td className={cellStyle}>
        <span className={`text-lg font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
          {application.disburse}
        </span>
      </td>

      {/* Collection */}
      <td className={cellStyle}>
        <InfoBadge variant="purple">
          {application.collection}
        </InfoBadge>
      </td>

      {/* Loan Status */}
      <td className={cellStyle}>
        <InfoBadge variant="orange">
          {application.loanStatus}
        </InfoBadge>
      </td>

      {/* Change Status */}
      <td className={cellStyle}>
        <ActionButton
          onClick={() => onActionClick(application, 'change-status')}
          bgColor="bg-gradient-to-r from-yellow-500 to-yellow-600"
          hoverColor="hover:from-yellow-600 hover:to-yellow-700"
          icon={Edit}
          title="Change Status"
        />
      </td>

      {/* Action */}
      <td className={cellStyle}>
        <ActionButton
          onClick={() => onActionClick(application, 'edit')}
          bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
          hoverColor="hover:from-blue-600 hover:to-blue-700"
          icon={Edit}
          title="Edit Application"
        />
      </td>

      {/* Remarks */}
      <td className={cellStyle}>
        <button
          onClick={() => onActionClick(application, 'remarks')}
          className={`text-sm underline transition-colors duration-200 ${
            isDark 
              ? "text-blue-400 hover:text-blue-300" 
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {application.remarks}
        </button>
      </td>

      {/* Document Status */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.documentStatus}
        </InfoBadge>
      </td>

      {/* NOC */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.noc}
        </InfoBadge>
      </td>

      {/* Refund PDC */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.refundPdc}
        </InfoBadge>
      </td>

      {/* Appraisal Report */}
      <td className={cellStyle}>
        <InfoBadge variant="orange">
          {application.appraisalReport}
        </InfoBadge>
      </td>

      {/* Eligibility */}
      <td className={cellStyle}>
        <button
          onClick={() => onActionClick(application, 'eligibility')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
            isDark
              ? "bg-teal-900/50 hover:bg-teal-800/70 text-teal-300 border border-teal-700"
              : "bg-teal-100 hover:bg-teal-200 text-teal-700 border border-teal-200"
          } shadow-sm hover:shadow-md`}
        >
          Check Eligibility
        </button>
      </td>

      {/* Replace KYC */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.replaceKyc || '-'}
        </InfoBadge>
      </td>

      {/* Settled */}
      <td className={cellStyle}>
        <InfoBadge variant="default">
          {application.settled || '-'}
        </InfoBadge>
      </td>
    </tr>
  );
};

export default ApplicationRow;