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

      {/* Call */}
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.loanNo}
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

      {/* application Date */}
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
            {application.approvedDate}
          </span>
        </div>
      </td>

      {/* Disburse Date */}
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
            {application.disburseDate}
          </span>
        </div>
      </td>
      {/* Due Date */}
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
            {application.dueDate}
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

      {/* Current Address */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.currentAddress}
        </span>
      </td>

      {/* Current State */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.currentState}
        </span>
      </td>

      {/* Current City */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.currentCity}
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

      {/* Admin Fee */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {formatCurrency(application.adminFee)}
        </span>
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

      {/* Renewal Sanction Date */}
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
            {application.renewalSanctionDate}
          </span>
        </div>
      </td>

      {/* Renewal Tenure*/}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.renewalTenure || "-"}
        </span>
      </td>

      {/* Renewal Maturity Date*/}
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
            {application.renewalMaturityDate}
          </span>
        </div>
      </td>

      {/* Renewal Outstanding Balance */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.renewalOutstandingBalance || "-"}
        </span>
      </td>

      {/* Renewal Remarks */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.renewalRemarks || "-"}
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
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.approvalNote || "N/A"}
        </span>
      </td>

      {/* Application Source */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
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
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.loanTerm}
        </span>
      </td>

      {/* Disbursal Account */}
      <td className="px-6 py-4">
        <span
          className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {application.disbursalAccount}
        </span>
      </td>

      {/* Customer A/c Verified */}
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
        <PdfIcon
          hasFile={application.sanctionLetter}
          fileName={application.sanctionLetterFileName}
          fileType="sanctionletter"
          title="View Sanction Letter PDF"
        />
      </td>

      {/* Emandate Status */}
      <td className="px-6 py-4">
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {application.emandateStatus}
        </span>
      </td>

      {/* ICICI Emandate Status */}
      <td className="px-6 py-4">
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-emerald-400"
            : "text-emerald-600"}`}
        >
          {application.iciciEmandateStatus}
        </span>
      </td>

      {/* Loan Status */}
      <td className="px-6 py-4">
        <span
          className={`text-sm font-semibold ${isDark
            ? "text-orange-400"
            : "text-orange-600"}`}
        >
          {application.loanStatus}
        </span>
      </td>

      {/* Change Status */}
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
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

      {/* Remarks */}
      <td className="px-6 py-4">
        <button
          onClick={() => onRemarksClick(application)}
          className={`text-sm underline cursor-pointer transition-colors duration-200 ${isDark
            ? "text-blue-400 hover:text-blue-300"
            : "text-blue-600 hover:text-blue-800"}`}
        >
          View Remarks
        </button>
      </td>

      {/* Refund PDC */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center">
          <button
            onClick={() => onRefundPDCClick(application)}
            className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 ${application.refundPdc ===
            "Yes"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
              : application.refundPdc === "Cancel"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"} shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1`}
            title="Update Refund PDC Status"
          >
            <FileText className="w-4 h-4" />
            <span>
              {application.refundPdc || "Update"}
            </span>
          </button>
        </div>
      </td>

      {/* Document Status  */}
       <td className="px-6 py-4">
        <div className="flex items-center justify-center">
          <button
            onClick={() => onDocumentStatusClick(application)}
            className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
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

      {/* Replace KYC */}
      <td className="px-6 py-4">
        <button
          onClick={() => onReplaceKYCClick(application)}
          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 ${isDark
            ? "bg-purple-900/50 border hover:bg-purple-800 text-purple-300"
            : "bg-purple-100 border hover:bg-purple-200 text-purple-700"}`}
        >
          Replace KYC
        </button>
      </td>
      {/* Settled */} 
      <td className="px-6 py-4">
        {application.settled || "-"}
      </td>

       
   </tr>

     { label: "SR. No", width: "100px" },
        { label: "Call", width: "100px" },
        { label: "Loan No.", width: "120px" },
        { label: "CRN No.", width: "140px" },
        { label: "Account ID", width: "140px" },
        { label: "Approved Date", width: "160px" },
        { label: "Disburse Date", width: "160px" },
        { label: "Due Date", width: "160px" },
        { label: "Name", width: "200px" },
        { label: "Current Address", width: "180px" },
        { label: "Current State", width: "140px" },
        { label: "Current City", width: "120px" },
        { label: "Permanent Address", width: "180px" },
        { label: "State", width: "100px" },
        { label: "City", width: "100px" },
        { label: "Phone No.", width: "140px" },
        { label: "E-mail", width: "200px" },
        { label: "Amount Approved", width: "120px" },
        { label: "Admin Fee", width: "140px" },
        { label: "ROI", width: "80px" },
        { label: "Tenure", width: "100px" },
        { label: "Renewal Sanction Date", width: "160px" },
        { label: "Renewal Tenure", width: "140px" },
        { label: "Renewal Maturity Date", width: "160px" },
        { label: "Renewal Outstanding Balance", width: "180px" },
        { label: "Renewal Remarks", width: "140px" },
        { label: "Renewal Sanction Letter", width: "160px" },
        { label: "Photo", width: "80px" },
        { label: "Pan Proof", width: "100px" },
        { label: "Address Proof", width: "120px" },
        { label: "ID Proof", width: "100px" },
        { label: "Salary Proof", width: "120px" },
        { label: "Bank Statement", width: "130px" },
        { label: "Video KYC", width: "100px" },
        { label: "Approval Note", width: "180px" },
        { label: "Enquiry Source", width: "140px" },
        { label: "Bank Verification Report", width: "180px" },
        { label: "Social Score Report", width: "160px" },
        { label: "Cibil Score Report", width: "160px" },
        { label: "NACH Form", width: "120px" },
        { label: "PDC", width: "80px" },
        { label: "Agreement", width: "120px" },
        { label: "Cheque No.", width: "120px" },
        { label: "Send To Courier", width: "140px" },
        { label: "Courier Picked", width: "140px" },
        { label: "Original Documents Received", width: "120px" },
        { label: "Disburse Behalf of E-mandate", width: "120px" },
        { label: "Loan Term", width: "120px" },
        { label: "Disbursal Account", width: "160px" },
        { label: "Customer A/c Verified", width: "180px" },
        { label: "Sanction Letter", width: "140px" },
        { label: "Emandate Status", width: "100px" },
        { label: "ICICI Emandate Status", width: "180px" },
        
    
    
    
    
        { label: "Loan Status", width: "120px" },
        { label: "Change Status", width: "200px" },
        { label: "Action", width: "140px" },
        { label: "Remarks", width: "120px" },
        
    
        { label: "Refund PDC", width: "120px" },
                    { label: "Document Status", width: "160px" },

        { label: "Appraisal Report", width: "160px" },

        { label: "Eligibility", width: "120px" },
        { label: "Replace KYC", width: "160px" },
        { label: "Settled", width: "100px" },


        { label: "Ready For Approve", width: "160px" },
    { label: "Bank A/c Verification", width: "180px" },
    { label: "Disburse Approval", width: "160px" },
    { label: "Disburse", width: "100px" },
    { label: "Collection", width: "120px" },

           {currentRefundPDCApplication && (
  <RefundPDCModal
    isOpen={refundPDCModalOpen}
    onClose={handleRefundPDCModalClose}
    onSubmit={handleRefundPDCSubmit}
    isDark={isDark}
    customerName={currentRefundPDCApplication.name}
    loanNo={currentRefundPDCApplication.loanNo}
  />
)}

{currentDocumentApplication && (
  <DocumentVerificationModal
    isOpen={documentVerificationModalOpen}
    onClose={handleDocumentVerificationModalClose}
    onVerify={handleDocumentVerify}
    isDark={isDark}
    application={currentDocumentApplication}
  />
)}

 {currentApplication && (
  <ChequeModal
    isOpen={chequeModalOpen}
    onClose={handleChequeModalClose}
    onSubmit={handleChequeSubmit}
    isDark={isDark}
    initialChequeNo={currentChequeNo}
    customerName={currentApplication.name}
    isEdit={!!currentChequeNo}
  />
)}

{currentCourierApplication && (
  <SendToCourierModal
    isOpen={courierModalOpen}
    onClose={handleCourierModalClose}
    onSubmit={handleCourierSubmit}
    isDark={isDark}
    customerName={currentCourierApplication.name}
    loanNo={currentCourierApplication.loanNo}
  />
)}

{currentCourierPickedApplication && (
  <CourierPickedModal
    isOpen={courierPickedModalOpen}
    onClose={handleCourierPickedModalClose}
    onSubmit={handleCourierPickedSubmit}
    isDark={isDark}
    customerName={currentCourierPickedApplication.name}
    loanNo={currentCourierPickedApplication.loanNo}
  />
)}
{currentOriginalDocumentsApplication && (
  <OriginalDocumentsModal
    isOpen={originalDocumentsModalOpen}
    onClose={handleOriginalDocumentsModalClose}
    onSubmit={handleOriginalDocumentsSubmit}
    isDark={isDark}
    customerName={currentOriginalDocumentsApplication.name}
    loanNo={currentOriginalDocumentsApplication.loanNo}
  />
)}
{currentDisburseEmandateApplication && (
  <DisburseEmandateModal
    isOpen={disburseEmandateModalOpen}
    onClose={handleDisburseEmandateModalClose}
    onSubmit={handleDisburseEmandateSubmit}
    isDark={isDark}
    customerName={currentDisburseEmandateApplication.name}
    loanNo={currentDisburseEmandateApplication.loanNo}
  />
)}

{currentChangeStatusApplication && (
  <ChangeStatusModal
    isOpen={changeStatusModalOpen}
    onClose={handleChangeStatusModalClose}
    onSubmit={handleChangeStatusSubmit}
    isDark={isDark}
    customerName={currentChangeStatusApplication.name}
    loanNo={currentChangeStatusApplication.loanNo}
  />
)}

{currentRemarksApplication && (
  <RemarksModal
    isOpen={remarksModalOpen}
    onClose={handleRemarksModalClose}
    isDark={isDark}
    customerName={currentRemarksApplication.name}
    loanNo={currentRemarksApplication.loanNo}
    application={currentRemarksApplication}
  />
)}

<CallDetailsModal isOpen={showCallModal} onClose={() => {
          setShowCallModal(false);
          setSelectedApplicant(null);
        }} data={selectedApplicant} isDark={isDark}  />

        ///////

        ////////////////////Appraisal Report API///////////////////////
1 - Appraisal Edit API: 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/edit/12
METHOD=>GET
REQUEST PAYLOAD=
No nned

HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Appraisal report data fetched successfully.",
    "application": {
        "user_id": 17,
        "crnno": "S01AM126",
        "accountId": "ATDFSLS01AM126JUNE2025",
        "fname": "Satyendra",
        "lname": "Kumar Vishwakarma",
        "dob": "1988-08-01",
        "gender": "Male",
        "fathername": "Parashuram Sharma",
        "phone": "9569584126",
        "email": "satyendra.alltimedata@gmail.com",
        "alt_email": null,
        "pan_no": "AMLPV5184B",
        "aadhar_no": "420464959649",
        "ref_name": "Kisan",
        "ref_address": "Noida sector 10",
        "ref_mobile": "9569584126",
        "ref_email": "Ki@gmail.com",
        "ref_relation": "Friend",
        "earn_points": 0,
        "redeem_points": 0,
        "application_id": 12,
        "loan_no": null,
        "applied_amount": "17000.00",
        "approved_amount": "5000.00",
        "roi": "0.067",
        "tenure": 105,
        "loan_term": 4,
        "dw_collection": null,
        "emi_collection": null,
        "grace_period": 3,
        "process_fee": null,
        "approved_date": null,
        "address_id": 12,
        "approval_note": "NEW CUSTOMER",
        "bank_name": "ICICI Bank",
        "branch_name": "LUDHIANAFEROZE GANDHI MARKET CIBD",
        "account_type": "SAVING",
        "account_no": "222222222222",
        "ifsc_code": "ICIC0000017",
        "bankVerif": 0,
        "organisation_name": "Atd money",
        "organisation_address": "Noida sec10",
        "office_phone": "9971734401",
        "contact_person": "Bsb",
        "mobile_no": "9971734401",
        "website": "https://www.atdmoney.com",
        "hr_mail": "Kisan@gmail.com",
        "designation": "Developer",
        "work_since_mm": "3",
        "work_since_yy": "2018",
        "gross_monthly_salary": "55000.00",
        "net_monthly_salary": "55000.00",
        "net_house_hold_income": "100000.00",
        "official_email": "kisan@atdmoney.com",
        "existing_emi": "0.00",
        "maxlimit": "10000.00"
    },
    "appraisal": {
        "applicationId": 12,
        "id": 1,
        "application_id": 12,
        "personal_phone": "Yes",
        "phone_status": "Positive",
        "personal_pan": "Yes",
        "pan_status": "Positive",
        "personal_aadhar": "Yes",
        "aadhar_status": null,
        "personal_ref_name": "Yes",
        "personal_ref_mobile": "Yes",
        "personal_ref_email": "Yes",
        "personal_ref_relation": "Yes",
        "PerRemark": "Ok this in actual customer",
        "personal_final_report": "Positive",
        "personal_verified": null,
        "organization_applied": "Yes",
        "organization_applied_status": "Positive",
        "gross_amount_salary": "Yes",
        "gross_amount_salary_status": "Positive",
        "net_amount_salary": "Yes",
        "net_amount_salary_status": "Positive",
        "SalaryRemark": "Salary transfer on time",
        "salaryslip_final_report": "Positive",
        "salslip_verified": null,
        "online_verification": "Yes",
        "online_verification_status": "Positive",
        "company_phone": "Yes",
        "company_phone_status": "Positive",
        "company_mobile": "Yes",
        "company_mobile_status": "Positive",
        "website_status": null,
        "contact_status": "Yes",
        "hr_mail": "Yes",
        "hr_mail_status": "Positive",
        "hr_email_sent": null,
        "OrganizationRemark": "I have check company ok",
        "organization_final_report": "Positive",
        "organization_verified": null,
        "auto_verification": "Yes",
        "auto_verification_status": "Positive",
        "is_salary_account": "Yes",
        "is_salary_account_status": "Positive",
        "regural_interval": "Yes",
        "regural_interval_status": "Positive",
        "salary_date": "2025-06-02",
        "salary_remark": null,
        "avail_amenities": "Electricity",
        "ava_assets": "Land",
        "primary_income": "Agriculture & allied activities",
        "nature_of_work": "Self-employed",
        "frequency_income": "Daily",
        "month_employment_last_one_year": "56",
        "self_reported_monthly_income": "50000",
        "average_monthly_income": "562554",
        "monthly_salary_date": "04-07-2025",
        "emi_debit": "No",
        "emi_amount": "5000",
        "emi_with_bank_statement": "Yes",
        "BankRemark": "Ok bank statement",
        "bankstatement_final_report": "Positive",
        "bankstatement_verified": null,
        "social_score": "500",
        "social_score_status": "Positive",
        "social_score_suggestion": "Recommended",
        "SocialRemark": "Good",
        "socialscore_final_report": "Positive",
        "social_score_verified": null,
        "cibil_score": "785",
        "score_status": "Positive",
        "total_active_amount": "5000",
        "total_active_amount_status": "Positive",
        "total_closed_amount": "6000",
        "total_closed_amount_status": "Positive",
        "write_off_settled": "5000",
        "write_off_settled_status": "Positive",
        "overdue": "50000",
        "overdue_status": "Positive",
        "total_emi_cibil": "10000",
        "comment": "Ok",
        "dpd": "Nil",
        "dpd_status": "Positive",
        "CibilRemark": "OK",
        "cibil_final_report": "Positive",
        "cibil_score_verified": null,
        "alternate_no1": "9569584126",
        "alternate_no2": "9971734401",
        "admin_id": 68,
        "created_at": "2025-07-03T10:48:40.000000Z",
        "updated_at": "2025-07-03T12:35:12.000000Z",
        "verified_by": "Satyendra Vishwakarma"
    }
}

2 - Appraisal Update Father name and customer addresses API: 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/personal
METHOD=>POST
REQUEST PAYLOAD=
{
    "user_id":17,
    "address_id":12,
    "father_name":"Parashuram Sharma",
    "current_address":"Vill& Post-Bikapur,Dist-Ghazipur, UP ",
    "permanent_address":"Vill& Post-Bikapur,Dist-Ghazipur, UP "
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Personal verification data updated successfully."
}

3 - Personal Remarks API: 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/personal/remark
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "remarks":"Ok this in actual customer"
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Personal remark saved successfully."
}

4 - Alternate Number First API: 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/personal/mobile/first
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "alternate_no1":"9569584126"
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Alternate No saved successfully."
}

5 - Alternate Number Second API: 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/personal/mobile/second
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "alternate_no2":"9971734401"
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Alternate No saved successfully."
}

6 - Additional Reference API: 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/personal/reference
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "crnno":"S01AM126",
    "add_ref_name_1":"Kisan",
    "add_ref_email_1":"kisan@atdmoney.com",
    "add_ref_phone_1":9971734401,
    "add_ref_relation_1":"Friends",
    "add_ref_verify_1":true,
    "add_ref_name_2":"Kisan",
    "add_ref_email_2":"kisan@atdmoney.com",
    "add_ref_phone_2":9971734401,
    "add_ref_relation_2":"Friends",
    "add_ref_verify_2":true,
     "add_ref_name_3":"Kisan",
    "add_ref_email_3":"kisan@atdmoney.com",
    "add_ref_phone_3":9971734401,
    "add_ref_relation_3":"Friends",
    "add_ref_verify_3":true,
    "add_ref_name_4":"Kisan",
    "add_ref_email_4":"kisan@atdmoney.com",
    "add_ref_phone_4":9971734401,
    "add_ref_relation_4":"Friends",
    "add_ref_verify_4":true,
     "add_ref_name_5":"Kisan",
    "add_ref_email_5":"kisan@atdmoney.com",
    "add_ref_phone_5":9971734401,
    "add_ref_relation_5":"Friends",
    "add_ref_verify_5":true
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Additional references saved successfully."
}

7 - Personal Final Verification API: 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/personal/final-verification
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "personal_phone":"Yes",
    "phone_status":"Positive",
    "personal_pan":"Yes",
    "pan_status":"Positive",
    "personal_aadhar":"Yes",
    "aadhar_status":"Positive",
    "personal_ref_name":"Yes",
    "personal_ref_mobile":"Yes",
    "personal_ref_email":"Yes",
    "personal_ref_relation":"Yes",
    "personal_final_report":"Positive"
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Personal verification saved successfully."
}

8 - Salary Remarks API: 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/salary/remarks
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "remarks":"Salary transfer on time"
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Salary remark saved successfully."
}

9 - House Hold Income : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/add/house-hold-income
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "house_holder_family":"Mother",
    "nature_of_work":"Salaried",
    "contact_no":"9569584126",
    "annual_income":100000
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Household income saved successfully.",
    "data": {
        "application_id": 12,
        "house_holder_family": "Mother",
        "nature_of_work": "Salaried",
        "contact_no": "9569584126",
        "annual_income": 100000,
        "updated_at": "2025-07-04T05:28:03.000000Z",
        "created_at": "2025-07-04T05:28:03.000000Z",
        "id": 2
    }
}

10 - Salary Verification : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/salary/verification
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "organization_applied":"Yes",
    "organization_applied_status":"Positive",
    "gross_amount_salary":"Yes",
    "gross_amount_salary_status":"Positive",
    "net_amount_salary":"Yes",
    "net_amount_salary_status":"Positive",
    "monthly_salary_date":"04-07-2025",
    "avail_amenities":"Electricity",
    "ava_assets":"Land",
    "primary_income":"Agriculture & allied activities",
    "nature_of_work":"Self-employed",
    "frequency_income":"Daily",
    "month_employment_last_one_year":"56",
    "self_reported_monthly_income":50000,
    "average_monthly_income":562554,
    "salaryslip_final_report":"Positive"

}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Salary verification saved successfully."
}

11 - Organization Remarks : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/organisation/remarks
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "remarks":"I have check company ok"
}

HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Salary remark saved successfully."
}

12 - Organization Verification : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/organisation/verification
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "online_verification":"Yes",
    "online_verification_status":"Positive",
    "company_phone":"Yes",
    "company_phone_status":"Positive",
    "company_mobile":"Yes",
    "company_mobile_status":"Positive",
    "contact_status":"Yes",
    "hr_mail":"Yes",
    "hr_mail_status":"Positive",
    "organization_final_report":"Positive"
}

HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Organization verification saved successfully."
}


13 - Bank Remarks : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/bank/statement/remarks
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "remarks":"Ok bank statement"
}

HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Bank statement remark saved successfully."
}

14 - Bank Verification : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/bank/statement/verification
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "auto_verification":"Yes",
    "auto_verification_status":"Positive",
    "is_salary_account":"Yes",
    "is_salary_account_status":"Positive",
    "regural_interval":"Yes",
    "regural_interval_status":"Positive",
    "salary_date":"2025-06-02",
    "salary_remark":"ok",
    "emi_debit":"No",
    "emi_amount":5000,
    "emi_with_bank_statement":"Yes",
    "bankstatement_final_report":"Positive"
}

HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Bank Statement verification saved successfully."
}


15 - Social Remarks : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/social/remarks
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "remarks":"Good"
}

HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Social remark saved successfully."
}


16 - Social Verification : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/social/verification
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "social_score":500,
    "social_score_status":"Positive",
    "social_score_suggestion":"Recommended",
    "socialscore_final_report":"Positive"
}

HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Social verification saved successfully."
}

17- Cibil Remarks : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/cibil/remarks
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "remarks":"OK"
}

HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Cibil remark saved successfully."
}


18- Cibil Verification : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/cibil/verification
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "cibil_score":785,
    "score_status":"Positive",
    "total_active_amount":5000,
    "total_active_amount_status":"Positive",
    "total_closed_amount":6000,
    "total_closed_amount_status":"Positive",
    "write_off_settled":5000,
    "write_off_settled_status":"Positive",
    "overdue":50000,
    "overdue_status":"Positive",
    "total_emi_cibil":10000,
    "comment":"Ok",
    "dpd":"Nil",
    "dpd_status":"Positive",
    "cibil_final_report":"Positive"
}

HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Cibil verification saved successfully."
}



19- Final Verification : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/final-verification
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "total_final_report":"Recommended"
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>
{
    "success": true,
    "message": "Final verification report saved successfully."
}


20- Rejected Case : 
=======================
URL=>https://api.atdmoney.in/api/crm/appraisal/reject
METHOD=>POST
REQUEST PAYLOAD=
{
    "application_id":12,
    "remark":"Due to resignation"
}
HEADER=>{
Accept:"application/json",
"Authorization":"Bearer Token"
}


RESPONCE BODY=>{
    "success": true,
    "message": "Loan application rejected successfully."
}