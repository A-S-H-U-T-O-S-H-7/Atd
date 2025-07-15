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

      {/* Disburse Behalf of E-mandate*/}
      <td className={cellStyle}>
        
          {application.receivedDisburse}
        
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




// /////////////////////////////////////////////////////////////////////////////////
const handleCallSubmit = (callData) => {
    // Handle call submission logic
    console.log('Call submitted:', callData);
  };

  const handleCall = (application) => {
    setShowCallModal(true);
  }
  <div>
<div>

{/* SR No */}
<td className="px-6 py-4">
<span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
  {application.srNo}
</span>
</td>

{/* Call */}
<td className="px-6 py-4">
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

{/* Loan No. */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.loanNo}
</span>
</td>



{/* CRN No */}
<td className="px-6 py-4">
<span className={`text-sm font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
  {application.crnNo}
</span>
</td>

{/* Account ID */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.accountId}
</span>
</td>

{/* application Date */}
<td className="px-6 py-4">
<div className="flex items-center space-x-2">
  <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
  {application.approvedDate}
  </span>
</div>
</td>

{/* Disburse Date */}
<td className="px-6 py-4">
<div className="flex items-center space-x-2">
  <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
  {application.disburseDate}
  </span>
</div>
</td>
{/* Due Date */}
<td className="px-6 py-4">
<div className="flex items-center space-x-2">
  <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
  {application.dueDate}
  </span>
</div>
</td>

{/* application Time
<td className="px-6 py-4">
<div className="flex items-center space-x-2">
  <Clock className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
  <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
    {application.applicationTime}
  </span>
</div>
</td> */}

{/* Name */}
<td className="px-6 py-4">
<span className={`font-medium text-sm ${isDark ? "text-gray-100" : "text-gray-900"}`}>
  {application.name}
</span>
</td>



{/* Current Address */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.currentAddress}
</span>
</td>

{/* Current State */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.currentState}
</span>
</td>

{/* Current City */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.currentCity}
</span>
</td>

{/* Address */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.permanentAddress}
</span>
</td>

{/* State */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.state}
</span>
</td>

{/* City */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.city}
</span>
</td>

{/* Phone No */}
<td className="px-6 py-4">
<div className="flex items-center space-x-2">
  <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
    {application.phoneNo}
  </span>
</div>
</td>

{/* E-mail */}
<td className="px-6 py-4">
<div className="flex items-center space-x-2">
            <Mail className={`w-4 h-4 text-emerald-400 flex-shrink-0`} />
            <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
    {application.email}
  </span>
</div>
</td>

{/* Applied Amount */}
<td className="px-6 py-4">
<span className={`text-sm font-semibold ${isDark ? "text-green-500" : "text-green-700"}`}>
  {formatCurrency(application.appliedAmount)}
</span>
</td>

{/* Approved Amount */}
<td className="px-6 py-4">
<div className="bg-gradient-to-r px-2 py-1 rounded-md from-orange-100 to-orange-200 text-orange-800 border border-orange-300">
  <span className={`text-sm  font-semibold ${isDark ? "text-orange-900" : "text-orange-800"}`}>
  {formatCurrency(application.approvedAmount)}
  </span>
</div>
</td>

{/* Admin Fee */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
{formatCurrency(application.adminFee)}
</span>
</td>

{/* ROI */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.roi}%
</span>
</td>

{/* Tenure */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
  {application.tenure} days
</span>
</td>

{/* Renewal Sanction Date */}
<td className="px-6 py-4">
<div className="flex items-center space-x-2">
  <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
  {application.renewalSanctionDate}
  </span>
</div>
</td>

{/* Renewal Tenure*/}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
{application.renewalTenure || '-'}
</span>
</td>

{/* Renewal Maturity Date*/}
<td className="px-6 py-4">
<div className="flex items-center space-x-2">
  <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
  {application.renewalMaturityDate}
  </span>
</div>
</td>

{/* Renewal Outstanding Balance */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
{application.renewalOutstandingBalance || '-'}
</span>
</td>

{/* Renewal Remarks */}
<td className="px-6 py-4">
<span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
{application.renewalRemarks || '-'}
</span>
</td>
{/* Renewal Sanction Letter */}
<td className="px-6 py-4">
        <SanctionLetterIcon 
          hasFile={application.renewalSanctionLetter} 
          fileName={application.renewalSanctionLetter}
          title="Renewal Sanction Letter" 
        />
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

      {/* Video KYC */}
      <td className="px-6 py-4">
        <VideoKycIcon
          hasFile={application.hasVideoKyc}
          fileName={application.videoKycFileName}
          title="View Video KYC"
        />
      </td>

      {/* Approval Note */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.approvalNote || "N/A"}
        </span>
      </td>

      {/* Application Source */}
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {application.enquirySource || "N/A"}
        </span>
      </td>

      {/* Bank Verification Report */}
      <td className="px-6 py-4">
        <DocumentIcon
          hasFile={application.hasBankVerificationReport}
          fileName={application.bankVerificationFileName}
          fileType="bankstatement"
          title="View Bank Verification Report"
        />
      </td>

      {/* Social Score Report */}
      <td className="px-6 py-4">
        <DocumentIcon 
          hasFile={application.hasSocialScoreReport}
          fileName={application.socialScoreFileName}
          fileType="cibil"
          title="View Social Score Report"
        />
      </td>

      {/* CIBIL Score Report */}
      <td className="px-6 py-4">
        <DocumentIcon
          hasFile={application.hasCibilScoreReport}
          fileName={application.cibilScoreFileName}
          fileType="cibil"
          title="View CIBIL Score Report"
        />
      </td>

      {/* NACH Form */}
      <td className="px-6 py-4">
        <NachPdcCell
          hasNach={application.hasNachForm}
          hasNachFile={application.hasNachForm}
          nachFileName={application.nachFormFileName}
         
        />
      </td>

      {/*  PDC */}
      <td className="px-6 py-4">
        <NachPdcCell
         
          hasPdc={application.hasPdc}
          hasPdcFile={application.hasPdc}
          pdcFileName={application.pdcFileName}
        />
      </td>

      {/* Agreement */}
      <td className="px-6 py-4">
        <DocumentIcon
          hasFile={application.hasAgreement}
          fileName={application.agreementFileName}
          fileType="agreement"
          title="View Agreement"
        />
      </td>
       {/* Cheque */}
       <td className="px-6 py-4">
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
      <td className="px-6 py-4">
  <div className="flex items-center justify-center">
    {application.sendToCourier === 'Yes' ? (
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
<td className="px-6 py-4">
  <div className="flex items-center justify-center">
    {application.courierPicked === 'Yes' ? (
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
<td className="px-6 py-4">
  <div className="flex items-center justify-center">
    {application.originalDocuments === 'Yes' ? (
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
<td className="px-6 py-4">
  <div className="flex items-center justify-center">
    {application.receivedDisburse === 'Yes' ? (
      <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
        <CheckCircle className="w-3 h-3" />
        <span>Yes</span>
      </span>
    ) : application.receivedDisburse === 'No' ? (
      <button
        onClick={() => onDisburseEmandateModalOpen(application)}
        className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
      >
        <span>No</span>
      </button>
    ) : (
      <button
        onClick={() => onDisburseEmandateModalOpen(application)}
        className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
      >
        <span>Verify</span>
      </button>
    )}
  </div>
</td>

{/* Loan Term */}
<td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {application.loanTerm}
        </span>
      </td>

      {/* Disbursal Account */}
<td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {application.disbursalAccount}
        </span>
      </td>

      {/* Customer A/c Verified */}
<td className="px-6 py-4">
  <div className="flex items-center justify-center">
    {application.customerAcVerified === 'Yes' ? (
      <span className="px-3 py-1 rounded-2xl text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center space-x-1">
        <CheckCircle className="w-3 h-3" />
        <span>Yes</span>
      </span>
    ) : (
      <button
        className="px-3 py-1  rounded-2xl text-xs font-medium transition-all duration-200 bg-gradient-to-r from-red-400 to-red-600  text-white shadow-lg  transform  flex items-center space-x-1"
      >
      <X className="w-3 h-3" />
        <span>No</span>
      </button>
    )}
  </div>
</td>
{/* Sanction Letter */}
<td className="px-6 py-4">
        <PdfIcon hasFile={application.sanctionLetter} fileName={application.sanctionLetterFileName} fileType="sanctionletter" title="View Sanction Letter PDF" />
      </td>

      {/* Emandate Status */}
      <td className="px-6 py-4">
        <span className={`text-sm font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
          {application.emandateStatus}
        </span>
      </td>

      {/* ICICI Emandate Status */}
      <td className="px-6 py-4">
        <span className={`text-sm font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
          {application.iciciEmandateStatus}
        </span>
      </td>

      {/* Loan Status */}
      <td className="px-6 py-4">
      <span className={`text-sm font-semibold ${isDark ? "text-orange-400" : "text-orange-600"}`}>

          {application.loanStatus}
          </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </td>

      {/* Change Status */}
<td className="px-6 py-4">
  <div className="flex items-center justify-center">
    <button
      onClick={() => onChangeStatusClick(application, 'change-status')}
      className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
      title="Change Status"
    >
      <Edit2 className="w-4 h-4" />
      <span>Change Status</span>
    </button>
  </div>
</td>

{/* Action */}
<td className="px-6 py-4">
  <div className="flex items-center justify-center">
    <button
      onClick={() => onActionClick(application, 'edit')}
      className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
      title="Edit Application"
    >
      <Edit className="w-4 h-4" />
      <span>Edit</span>
    </button>
  </div>
</td>

{/* Remarks */}
<td className="px-6 py-4">
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

{/* Refund PDC - Add this after the Remarks column */}
<td className="px-6 py-4">
  <div className="flex items-center justify-center">
    <button
      onClick={() => onRefundPDCClick(application)}
      className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 ${
        application.refundPdc === 'Yes'
          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
          : application.refundPdc === 'Cancel'
          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
      } shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1`}
      title="Update Refund PDC Status"
    >
      <FileText className="w-4 h-4" />
      <span>{application.refundPdc || 'Update'}</span>
    </button>
  </div>
</td>

{/* Appraisal Report */}
<td className="px-6 py-4">
  {application.finalReportStatus === "Recommended" ? (
    <button
      onClick={() => onFileView(application, application.finalReportFile)}
      className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs"
    >
      Recomended
    </button>
  ) : application.isFinalStage ? (
    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">
      Locked
    </span>
  ) : (
    <button
      onClick={() => onCheckClick(application)}
      className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
        isDark
          ? "bg-pink-900/50 border hover:bg-pink-800 text-pink-300"
          : "bg-pink-100 border hover:bg-pink-200 text-pink-700"
      }`}
    >
      Check
    </button>
  )}
</td>

      {/* Eligibility */}
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
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
      {/* Settled */}
      <td className="px-6 py-4">
        
          {application.settled || '-'}
        
      </td>

</div>

<div>
{/* Status */}
<td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </td>

      {/* Action */}
<td className="px-6 py-4">
  <div className="flex items-center space-x-2">
    {application.isFinalStage ? (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs">
        Final Stage
      </span>
    ) : (
      <button
        onClick={() => onVerifyClick(application)}
        className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
          isDark
            ? "bg-blue-800/50 border hover:bg-blue-800 text-blue-200"
            : "bg-blue-200 border hover:bg-blue-200 text-blue-800"
        }`}
      >
        Verify
      </button>
    )}
  </div>
</td>

{/* Appraisal Report */}
<td className="px-6 py-4">
  {application.finalReportStatus === "Recommended" ? (
    <button
      onClick={() => onFileView(application, application.finalReportFile)}
      className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs"
    >
      Recomended
    </button>
  ) : application.isFinalStage ? (
    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">
      Locked
    </span>
  ) : (
    <button
      onClick={() => onCheckClick(application)}
      className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${
        isDark
          ? "bg-pink-900/50 border hover:bg-pink-800 text-pink-300"
          : "bg-pink-100 border hover:bg-pink-200 text-pink-700"
      }`}
    >
      Check
    </button>
  )}
</td>

      {/* Eligibility */}
      <td className="px-6 py-4">
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
      
</div>

</div>