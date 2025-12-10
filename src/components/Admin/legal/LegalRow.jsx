import {
  Calendar,
  Phone,
  Building2,
  CreditCard,
  FileText,
  MapPin,
  Clock,
  User,
  Hash,
  Mail,
  Banknote,
  Receipt,
  Scale,
  AlertCircle,
  CalendarDays,
  Home,
  Briefcase,
  CheckCircle,
  XCircle
} from "lucide-react";

const LegalRow = ({ legal, index, isDark, onCreateNotice, onCriminalCase }) => {
  const getDeliveryStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case "returned back":
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
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

  // Format date to show only date part
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === null) return 'N/A';
    // Remove time part if exists
    return dateString.split(' ')[0];
  };

  // Bounce Logic Explanation:
  // Show bounce details when:
  // 1. bounceDate is not null/N/A AND
  // 2. Either bounceReason is provided OR cheque was bounced
  
  const hasBounceDetails = legal.bounceDate && 
                          legal.bounceDate !== 'N/A' && 
                          legal.bounceDate !== null && 
                          legal.bounceDate !== 'null';

  // Determine if cheque was bounced based on bounceDate
  const isChequeBounced = hasBounceDetails;

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
      {/* S.No - Fixed: Use index + 1 */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {index + 1}
        </span>
      </td>

      {/* Customer Information */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "250px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`font-medium text-sm ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              {legal.customerName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Father: {legal.fatherHusbandName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {legal.mobileNo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Hash className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
              Loan ID: {legal.loanId}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm font-medium ${isDark ? "text-orange-400" : "text-orange-600"}`}>
              CRN: {legal.crnNo}
            </span>
          </div>
        </div>
      </td>

      {/* Current Address */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin className={`w-4 h-4 mt-0.5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <div className="flex-1">
              <p className={`text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Current Address
              </p>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {legal.currentAddress || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </td>

      {/* Permanent Address */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Home className={`w-4 h-4 mt-0.5 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <div className="flex-1">
              <p className={`text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Permanent Address
              </p>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {legal.permanentAddress || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </td>

      {/* Office/Company Address */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Briefcase className={`w-4 h-4 mt-0.5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
            <div className="flex-1">
              <p className={`text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Company Address
              </p>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {legal.companyAddress || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </td>

      {/* Other Address */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin className={`w-4 h-4 mt-0.5 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
            <div className="flex-1">
              <p className={`text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Other Address
              </p>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {legal.otherAddress || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </td>

      {/* Financial Information */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "300px" }}>
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
                ROI: {((legal.roi || 0) * 100).toFixed(3)}%
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Interest: ₹{legal.interest?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Penal Interest: ₹{legal.penalInterest?.toLocaleString()}
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
                Tenure: {legal.tenure} days
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <CreditCard className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Processing: ₹{legal.processingFee?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                GST: ₹{legal.gst?.toLocaleString()}
              </span>
            </div>
          </div>
          {/* Fixed: Total (PF+GST) design */}
          <div className={`flex items-center space-x-2 p-2 rounded-lg ${isDark ? "bg-emerald-900/30 border border-emerald-700/50" : "bg-emerald-50 border border-emerald-200"}`}>
            <span className={`text-sm font-bold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
              Total (PF+GST): ₹{legal.totalPfGst?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`text-sm font-medium ${isDark ? "text-red-300" : "text-red-600"}`}>
              Total: ₹{legal.totalAmount?.toLocaleString()}
            </span>
          </div>
        </div>
      </td>

      {/* Loan Details */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CreditCard className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Approved: ₹{legal.principal?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarDays className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Tenure: {legal.tenure} days
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Banknote className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Disbursed: ₹{legal.disbursementAmount?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Approved: {formatDate(legal.approvedDate)}
            </span>
          </div>
          {/* Fixed: Due date with icon */}
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Due Date: {legal.dueDate || 'N/A'}
            </span>
          </div>
        </div>
      </td>

      {/* ATD Bank Details */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "250px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building2 className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {legal.companyBankName || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              A/C: {legal.companyAccountNo || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              IFSC: {legal.companyIfsc || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Branch: {legal.companyBankBranch || 'N/A'}
            </span>
          </div>
        </div>
      </td>

      {/* Customer Bank Details */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "250px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building2 className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {legal.bankName || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              A/C: {legal.accountNo || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              IFSC: {legal.ifsc || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Branch: {legal.bankBranch || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Type: {legal.accountType || 'N/A'}
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
            <Calendar className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Date: {legal.chequeDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Amount: ₹{legal.chequeAmount?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarDays className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Deposit: {legal.depositDate || 'N/A'}
            </span>
          </div>
          {/* Show cheque status based on bounce */}
          <div className="flex items-center space-x-2">
            {isChequeBounced ? (
              <>
                <XCircle className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-600"}`} />
                <span className={`text-sm ${isDark ? "text-red-300" : "text-red-600"}`}>
                  Cheque Bounced
                </span>
              </>
            ) : (
              <>
                <CheckCircle className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
                <span className={`text-sm ${isDark ? "text-green-300" : "text-green-600"}`}>
                  ✓ Cheque Clear
                </span>
              </>
            )}
          </div>
        </div>
      </td>

      {/* Cheque Return Details - Fixed Logic */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "300px" }}>
        <div className="space-y-2">
          {/* BOUNCE LOGIC: Show bounce details only when bounceDate exists */}
          {isChequeBounced ? (
            <>
              <div className="flex items-center space-x-2">
                <AlertCircle className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-600"}`} />
                <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Bounce Date: {formatDate(legal.bounceDate)}
                </span>
              </div>
              
              {/* Show memo received date if available */}
              {legal.memoReceivedDate && legal.memoReceivedDate !== 'N/A' && (
                <div className="flex items-center space-x-2">
                  <Receipt className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
                  <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Memo Received: {formatDate(legal.memoReceivedDate)}
                  </span>
                </div>
              )}
              
              {/* Show bounce reason if available */}
              {legal.bounceReason && legal.bounceReason !== 'N/A' && (
                <div className="flex items-center space-x-2">
                  <AlertCircle className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-600"}`} />
                  <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Reason: {legal.bounceReason}
                  </span>
                </div>
              )}
              
              {/* Placeholder for missing API fields */}
              <div className="mt-2 pt-2 border-t border-dashed border-gray-300 dark:border-gray-600">
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  *Intimation mail dates to be added
                </p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  *Cheque return memo date to be added
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
              <span className={`text-sm ${isDark ? "text-green-300" : "text-green-600"}`}>
                ✓ No Bounce Recorded
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Important Dates */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "300px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Approved: {formatDate(legal.approvedDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Transaction: {legal.transactionDate || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Last Collection: {legal.lastCollectionDate || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Statement Disbur: {formatDate(legal.statementDisburDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Statement Despatch: {formatDate(legal.statementDespatchDate)}
            </span>
          </div>
        </div>
      </td>

      {/* Legal Status */}
      <td className={`px-4 py-4 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`} style={{ minWidth: "300px" }}>
        <div className="space-y-2">
          {/* Make Delivery Status more prominent */}
          <div className="flex items-center space-x-2 mb-2">
            {legal.deliveryStatus?.toLowerCase() === 'delivered' ? (
              <CheckCircle className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDeliveryStatusColor(legal.deliveryStatus)}`}>
              {legal.deliveryStatus || 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Notice Date: {formatDate(legal.noticeDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Speed Post: {formatDate(legal.legalNoticeSpeedPostDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Speed Post Received: {formatDate(legal.speedpostReceivedDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Scale className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Reply Received: {formatDate(legal.replyReceivedDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Scale className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Case Filed: {formatDate(legal.caseFilledDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Police Station: {legal.policeStation || 'N/A'}
            </span>
          </div>
          {legal.criminalComplaintNo && legal.criminalComplaintNo !== 'N/A' && (
            <div className="flex items-center space-x-2">
              <FileText className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-600"}`} />
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Complaint No: {legal.criminalComplaintNo}
              </span>
            </div>
          )}
          {legal.remarkWithCaseDetails && legal.remarkWithCaseDetails !== 'N/A' && (
            <div className="mt-2">
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Remarks: {legal.remarkWithCaseDetails}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Actions - Added new buttons */}
      <td className="px-4 py-4" style={{ minWidth: "350px" }}>
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
          {/* NEW BUTTONS */}
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isDark
                ? "bg-amber-900/50 hover:bg-amber-800 text-amber-300 border border-amber-700"
                : "bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200"
            }`}
          >
            Arbitration Notice
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isDark
                ? "bg-pink-900/50 hover:bg-pink-800 text-pink-300 border border-pink-700"
                : "bg-pink-100 hover:bg-pink-200 text-pink-700 border border-pink-200"
            }`}
          >
            Arbitration Criminal
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LegalRow;