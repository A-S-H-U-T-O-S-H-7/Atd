import {
  Calendar,
  Phone,
  Building2,
  CreditCard,
  FileText,
  MapPin,
  Clock,
  User,
  Hash
} from "lucide-react";

const LegalRow = ({ legal, index, isDark, onCreateNotice, onCriminalCase }) => {
  const getDeliveryStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case "not delivered":
        return isDark
          ? "bg-orange-900/50 text-orange-300 border-orange-700"
          : "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-blue-50/50"
      } ${
        index % 2 === 0
          ? isDark
            ? "bg-gray-700/30"
            : "bg-gray-50"
          : ""
      }`}
    >
      {/* S.No */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span
          className={`font-medium ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {legal.sNo}
        </span>
      </td>

      {/* Customer Information */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "280px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User
              className={`w-4 h-4 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <span
              className={`font-medium text-sm ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {legal.customerName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone
              className={`w-4 h-4 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {legal.mobileNo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Hash
              className={`w-4 h-4 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              {legal.loanId}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText
              className={`w-4 h-4 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isDark ? "text-orange-400" : "text-orange-600"
              }`}
            >
              {legal.crnNo}
            </span>
          </div>
          {/* Father/Husband Name */}
          <div className="flex items-center space-x-2">
            <User className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              F/H: {legal.fatherHusbandName}
            </span>
          </div>
        </div>
      </td>

      {/* Address Information */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "300px" }}>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin
              className={`w-4 h-4 mt-0.5 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Current: {legal.currentAddress}
              </p>
              {legal.otherAddress && (
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Other: {legal.otherAddress}
                </p>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Financial Information - Enhanced */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "380px" }}>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <CreditCard className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Principal: ₹{legal.principal?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Interest: ₹{legal.interest?.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Penalty: ₹{legal.penalty?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Processing: ₹{legal.processingFee?.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                GST: ₹{legal.gst?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                EMI: ₹{legal.emi?.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"}`}>
              Total: ₹{legal.totalAmount?.toLocaleString()}
            </span>
          </div>
        </div>
      </td>

      {/* Bank Information */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building2
              className={`w-4 h-4 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {legal.bankName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              IFSC: {legal.ifsc}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              A/C: {legal.accountNo}
            </span>
          </div>
        </div>
      </td>

      {/* Loan Details */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Sanctioned: ₹{legal.sanctionedAmount?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Tenure: {legal.tenure} days
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Disbursed: ₹{legal.disbursementAmount?.toLocaleString()}
            </span>
          </div>
        </div>
      </td>

      {/* Cheque Details */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "250px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Cheque: {legal.chequeNo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Date: {legal.chequeDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Amount: ₹{legal.chequeAmount?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Bounce: {legal.chequeBounceDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Reason: {legal.bounceReason}
            </span>
          </div>
        </div>
      </td>

      {/* Important Dates */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar
              className={`w-4 h-4 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Close: {legal.closeDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock
              className={`w-4 h-4 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Sanction: {legal.sanctionDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Disbursement: {legal.disbursementDate}
            </span>
          </div>
        </div>
      </td>

      {/* Legal Status */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "280px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Notice U/S 138: {legal.notice138Date}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Reply Received: {legal.replyReceivedDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Case Filed: {legal.caseFiledDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Police Station: {legal.policeStation}
            </span>
          </div>
          {legal.deliveryStatus && (
            <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getDeliveryStatusColor(legal.deliveryStatus)}`}>
              {legal.deliveryStatus}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4" style={{ minWidth: "300px" }}>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isDark
                ? "bg-blue-900/50 hover:bg-blue-800 text-blue-300 border border-blue-700"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200"
            }`}
          >
            Edit
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isDark
                ? "bg-red-900/50 hover:bg-red-800 text-red-300 border border-red-700"
                : "bg-red-100 hover:bg-red-200 text-red-700 border border-red-200"
            }`}
          >
            Send Notice
          </button>
          <button
            onClick={() => onCreateNotice(legal)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isDark
                ? "bg-green-900/50 hover:bg-green-800 text-green-300 border border-green-700"
                : "bg-green-100 hover:bg-green-200 text-green-700 border border-green-200"
            }`}
          >
            Create Notice
          </button>
          <button
            onClick={() => onCriminalCase(legal)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isDark
                ? "bg-purple-900/50 hover:bg-purple-800 text-purple-300 border border-purple-700"
                : "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200"
            }`}
          >
            Criminal Case
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LegalRow;