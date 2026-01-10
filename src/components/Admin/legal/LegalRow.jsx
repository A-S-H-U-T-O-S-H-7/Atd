import React from "react";
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
  CheckCircle,
  XCircle,
  ExternalLink,
  Smartphone,
  Landmark,
  Percent,
} from "lucide-react";

const LegalRow = ({ legal, index, isDark, onCreateNotice, onCriminalCase, onShowCriminalStatus, onArbitrationCriminal,onArbitrationNotice, onShowAddress, onEdit }) => {
  
  // Common CSS classes for better optimization
  const commonClasses = {
    // Field/Label styles
    fieldLabel: isDark 
      ? "text-xs text-gray-400" 
      : "text-xs text-gray-500",
    
    // Value styles
    valueText: isDark 
      ? "text-sm text-gray-300"  
      : "text-sm text-gray-600",
    
    // Important value styles (for amounts, IDs, etc)
    importantValue: isDark 
      ? "text-sm font-medium text-gray-200" 
      : "text-sm font-medium text-gray-700",
    
    // Special values (emerald for loan ID, orange for CRN, etc)
    specialValue: (type) => {
      switch(type) {
        case 'loanId':
          return isDark ? "text-emerald-400" : "text-emerald-600";
        case 'crnNo':
          return isDark ? "text-orange-400" : "text-orange-600";
        case 'amount':
          return isDark ? "text-green-400" : "text-green-600";
        case 'important':
          return isDark ? "text-gray-200" : "text-gray-700";
        default:
          return isDark ? "text-gray-300" : "text-gray-600";
      }
    },
    
    // Container styles
    cellBorder: isDark 
      ? "border-r border-gray-600" 
      : "border-r border-gray-800/20",
    
    // Icon colors
    icon: {
      blue: isDark ? "text-blue-400" : "text-blue-600",
      green: isDark ? "text-green-400" : "text-green-600",
      red: isDark ? "text-red-400" : "text-red-600",
      orange: isDark ? "text-orange-400" : "text-orange-600",
      purple: isDark ? "text-purple-400" : "text-purple-600",
      emerald: isDark ? "text-emerald-400" : "text-emerald-600",
      yellow: isDark ? "text-yellow-400" : "text-yellow-600",
    }
  };

  // Get background color based on medium - Fixed to be more visible
  const getMediumColor = (medium) => {
    const lowerMedium = medium?.toLowerCase() || '';
    if (lowerMedium.includes('emandate') || lowerMedium.includes('e-mandate')) {
      return isDark
        ? "bg-emerald-900/80 hover:bg-emerald-900/70 border-r-4 border-emerald-500"
        : "bg-emerald-100 hover:bg-emerald-200 border-r-4 border-emerald-400";
    } else if (lowerMedium.includes('cheque')) {
      return isDark
        ? "bg-blue-900/20 hover:bg-blue-900/30 border-r-4 border-blue-500"
        : "bg-blue-100 hover:bg-blue-200 border-r-4 border-blue-400";
    } else {
      return isDark
        ? "bg-purple-900/20 hover:bg-purple-900/30 border-r-4 border-purple-500"
        : "bg-purple-50 hover:bg-purple-100 border-r-4 border-purple-400";
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case "returned back":
      case "returned":
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

  const getCriminalCaseStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "filed":
      case "completed":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "dismissed":
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMediumIcon = (medium) => {
    const lowerMedium = medium?.toLowerCase() || '';
    if (lowerMedium.includes('emandate') || lowerMedium.includes('e-mandate')) {
      return <Smartphone className="w-4 h-4" />;
    } else if (lowerMedium.includes('cheque')) {
      return <Landmark className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getMediumTextColor = (medium) => {
    const lowerMedium = medium?.toLowerCase() || '';
    if (lowerMedium.includes('emandate') || lowerMedium.includes('e-mandate')) {
      return isDark ? "text-emerald-300" : "text-emerald-700";
    } else if (lowerMedium.includes('cheque')) {
      return isDark ? "text-blue-300" : "text-blue-700";
    }
    return isDark ? "text-purple-300" : "text-purple-700";
  };

  const getBounceReasonColor = (reason) => {
    if (!reason || reason === 'N/A') return '';
    
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('insufficient') || lowerReason.includes('fund')) {
      return isDark ? "text-red-400 font-semibold" : "text-red-600 font-semibold";
    }
    if (lowerReason.includes('stop') || lowerReason.includes('payment')) {
      return isDark ? "text-orange-400 font-semibold" : "text-orange-600 font-semibold";
    }
    if (lowerReason.includes('account') || lowerReason.includes('closed')) {
      return isDark ? "text-purple-400 font-semibold" : "text-purple-600 font-semibold";
    }
    return isDark ? "text-yellow-400 font-semibold" : "text-yellow-600 font-semibold";
  };
  
  const hasBounceDetails = legal.bounceDate && 
                          legal.bounceDate !== 'N/A' && 
                          legal.bounceDate !== null && 
                          legal.bounceDate !== 'null';

  const isChequeBounced = hasBounceDetails;

  const primaryAddress = legal.addresses && legal.addresses.length > 0 
    ? legal.addresses[0].address 
    : legal.currentAddress || legal.permanentAddress || legal.companyAddress || 'N/A';

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${getMediumColor(legal.medium)} ${
        isDark
          ? "border-emerald-700/30 hover:bg-gray-700/30"
          : "border-emerald-700/30 hover:bg-blue-50/30"
      }`}
    >
      {/* S.No */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`}>
        <span className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {index + 1}
        </span>
      </td>

      {/* Medium Column - NEW */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "80px" }}>
        <div className="flex flex-col items-center justify-center space-y-2">
          {getMediumIcon(legal.medium)}
          <span className={`text-sm font-bold ${getMediumTextColor(legal.medium)}`}>
            {legal.medium || 'N/A'}
          </span>
        </div> 
      </td>

      {/* Customer Information - Restored to original font styles */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "220px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`font-medium text-sm ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              {legal.customerName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Father: {legal.fatherHusbandName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {legal.mobileNo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Hash className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm font-medium ${commonClasses.specialValue('loanId')}`}>
              Loan ID: {legal.loanId}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm font-medium ${commonClasses.specialValue('crnNo')}`}>
              CRN: {legal.crnNo}
            </span>
          </div>
        </div>
      </td>

      {/* Address */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "300px" }}>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <MapPin className={`w-4 h-4 mt-0.5 ${commonClasses.icon.blue}`} />
            <div className="flex-1">
              <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Address
              </p>
              <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"} line-clamp-2`}>
                {primaryAddress}
              </p>
              {legal.addresses && legal.addresses.length > 0 && (
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  +{legal.addresses.length - 1} more address{legal.addresses.length - 1 !== 1 ? 'es' : ''}
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => onShowAddress(legal)}
            className={`w-full px-3 py-2 text-sm rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              isDark
                ? "bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 border border-blue-700/50"
                : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
            }`}
          >
            <ExternalLink className="w-3 h-3" />
            <span>Show Address</span>
          </button>
        </div>
      </td>

      

      {/* Loan Details */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "320px" }}>
  <div className="space-y-3">
    {/* Row 1: Approved Amount & Approved Date */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium ${commonClasses.fieldLabel}`}>Approved:</span>
        <span className={`text-sm font-medium ${commonClasses.specialValue('amount')}`}>
          ₹{legal.approvedAmount?.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium ${commonClasses.fieldLabel}`}>Aprv. Date:</span>
        <span className={`text-sm ${commonClasses.valueText}`}>
          {legal.approvedDate || 'N/A'}
        </span>
      </div>
    </div>

    {/* Row 2: Tenure & ROI */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${commonClasses.fieldLabel}`}>Tenure:</span>
        <span className={`text-sm ${commonClasses.valueText}`}>
          {legal.tenure || 'N/A'} days
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${commonClasses.fieldLabel}`}>ROI:</span>
        <span className={`text-sm ${commonClasses.valueText}`}>
          {legal.roi || 'N/A'}%
        </span>
      </div>
    </div>

    {/* Row 3: Disbursed & Due Date */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${commonClasses.fieldLabel}`}>Disbursed:</span>
        <span className={`text-sm font-medium ${commonClasses.specialValue('amount')}`}>
          ₹{legal.disbursementAmount?.toLocaleString() || '0'}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${commonClasses.fieldLabel}`}>Due Date:</span>
        <span className={`text-sm ${commonClasses.valueText}`}>
          {legal.dueDate || 'N/A'}
        </span>
      </div>
    </div>

    {/* Row 4: Processing Fee & GST */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${commonClasses.fieldLabel}`}>Processing Fee:</span>
        <span className={`text-sm ${commonClasses.valueText}`}>
          ₹{legal.processingFee?.toLocaleString() || '0'}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${commonClasses.fieldLabel}`}>GST:</span>
        <span className={`text-sm ${commonClasses.valueText}`}>
          ₹{legal.gst?.toLocaleString() || '0'}
        </span>
      </div>
    </div>

    {/* Row 5: Total (PF+GST) - Full width */}
    <div className={`pt-2 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
          Total (PF+GST):
        </span>
        <span className={`text-sm font-bold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
          ₹{legal.totalPfGst?.toLocaleString() || '0'}
        </span>
      </div>
    </div>
  </div>
</td>

      {/* ATD Bank Details */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building2 className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm font-medium ${commonClasses.specialValue('important')}`}>
              {legal.companyBankName || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${commonClasses.valueText}`}>
              A/C: {legal.companyAccountNo || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${commonClasses.valueText}`}>
              IFSC: {legal.companyIfsc || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${commonClasses.valueText}`}>
              Branch: {legal.companyBankBranch || 'N/A'}
            </span>
          </div>
        </div>
      </td>

      {/* Customer Bank Details */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "200px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building2 className={`w-4 h-4 ${commonClasses.icon.green}`} />
            <span className={`text-sm font-medium ${commonClasses.specialValue('important')}`}>
              {legal.bankName || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${commonClasses.valueText}`}>
              A/C: {legal.accountNo || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${commonClasses.valueText}`}>
              IFSC: {legal.ifsc || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${commonClasses.valueText}`}>
              Branch: {legal.bankBranch || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${commonClasses.valueText}`}>
              Type: {legal.accountType || 'N/A'}
            </span>
          </div>
        </div>
      </td>

      {/* Cheque Details */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "220px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm font-medium ${commonClasses.specialValue('important')}`}>
              Cheque: {legal.chequeNo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Date: {legal.chequeDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className={`w-4 h-4 ${commonClasses.icon.green}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Amount: ₹{legal.chequeAmount?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarDays className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Deposit: {legal.depositDate || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {isChequeBounced ? (
              <>
                <XCircle className={`w-4 h-4 ${commonClasses.icon.red}`} />
                <span className={`text-sm ${isDark ? "text-red-300" : "text-red-600"}`}>
                  Cheque Bounced
                </span>
              </>
            ) : (
              <>
                <CheckCircle className={`w-4 h-4 ${commonClasses.icon.green}`} />
                <span className={`text-sm ${isDark ? "text-green-300" : "text-green-600"}`}>
                  ✓ Cheque Clear
                </span>
              </>
            )}
          </div>
        </div>
      </td>

      {/* Financial Information */}
<td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "170px" }}>
  <div className="space-y-2">
    {/* Principal */}
    <div className="flex items-center space-x-2">
      <CreditCard className={`w-4 h-4 ${commonClasses.icon.green}`} />
      <span className={`text-sm font-medium ${commonClasses.specialValue('important')}`}>
        Principal: ₹{legal.principal?.toLocaleString()}
      </span>
    </div>
    
    {/* Interest - stacked below */}
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${commonClasses.valueText}`}>
        Interest: ₹{legal.interest?.toLocaleString()}
      </span>
    </div>
    
    {/* Penal Interest - stacked below */}
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${commonClasses.valueText}`}>
        Penal Interest: ₹{legal.penalInterest?.toLocaleString()}
      </span>
    </div>
    
    {/* Penalty - stacked below */}
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${commonClasses.valueText}`}>
        Penalty: ₹{legal.penalty?.toLocaleString()}
      </span>
    </div>
    
    {/* Bounce Charge - stacked below */}
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${commonClasses.valueText}`}>
        Bounce Charge: ₹{legal.bounceCharge?.toLocaleString()}
      </span>
    </div>
    
    {/* Total - with top margin */}
    <div className="flex items-center space-x-2 pt-1 mt-1 border-t border-gray-200 dark:border-gray-700">
      <span className={`text-sm font-medium ${isDark ? "text-red-300" : "text-red-600"}`}>
        Total: ₹{legal.totalAmount?.toLocaleString()}
      </span>
    </div>
  </div>
</td>

      {/* Cheque Return Details */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "280px" }}>
        <div className="space-y-2">
          {isChequeBounced ? (
            <>
              <div className="flex items-center space-x-2">
                <AlertCircle className={`w-4 h-4 ${commonClasses.icon.red}`} />
                <span className={`text-sm font-medium ${commonClasses.specialValue('important')}`}>
                  Bounce Date: {legal.bounceDate}
                </span>
              </div>
              
              {legal.memoReceivedDate && legal.memoReceivedDate !== 'N/A' && (
                <div className="flex items-center space-x-2">
                  <Receipt className={`w-4 h-4 ${commonClasses.icon.orange}`} />
                  <span className={`text-sm ${commonClasses.valueText}`}>
                    Memo Received: {legal.memoReceivedDate}
                  </span>
                </div>
              )}
              
              {legal.intimationMailDespatch && legal.intimationMailDespatch !== 'N/A' && (
                <div className="flex items-center space-x-2">
                  <Mail className={`w-4 h-4 ${commonClasses.icon.blue}`} />
                  <span className={`text-sm ${commonClasses.valueText}`}>
                    Intimation Dispatch: {legal.intimationMailDespatch}
                  </span>
                </div>
              )}
              
              {legal.intimationMailDeliver && legal.intimationMailDeliver !== 'N/A' && (
                <div className="flex items-center space-x-2">
                  <Mail className={`w-4 h-4 ${commonClasses.icon.green}`} />
                  <span className={`text-sm ${commonClasses.valueText}`}>
                    Intimation Deliver: {legal.intimationMailDeliver}
                  </span>
                </div>
              )}
              
              {legal.chequeReturnMemo && legal.chequeReturnMemo !== 'N/A' && (
                <div className="flex items-center space-x-2">
                  <FileText className={`w-4 h-4 ${commonClasses.icon.purple}`} />
                  <span className={`text-sm ${commonClasses.valueText}`}>
                    Return Memo: {legal.chequeReturnMemo}
                  </span>
                </div>
              )}
              
              {legal.bounceReason && legal.bounceReason !== 'N/A' && (
                <div className="flex items-start space-x-2 mt-2">
                  <AlertCircle className={`w-4 h-4 mt-0.5 ${commonClasses.icon.red}`} />
                  <div>
                    <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Reason for Bounce:
                    </span>
                    <span className={`text-sm ml-1 mt-0.5 ${getBounceReasonColor(legal.bounceReason)}`}>
                      {legal.bounceReason}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className={`w-4 h-4 ${commonClasses.icon.green}`} />
              <span className={`text-sm ${isDark ? "text-green-300" : "text-green-600"}`}>
                ✓ No Bounce Recorded
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Important Dates */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "260px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Approved: {legal.approvedDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Transaction: {legal.transactionDate || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Last Collection: {legal.lastCollectionDate || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Loan Agreement: {legal.loanAgreementDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Loan Application: {legal.loanApplicationDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Board Resolution: {legal.boardResolutionDate}
            </span>
          </div>
        </div>
      </td>

      {/* Legal Notice Status */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "250px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            {legal.deliveryStatus?.toLowerCase() === 'delivered' ? (
              <CheckCircle className={`w-5 h-5 ${commonClasses.icon.green}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${commonClasses.icon.orange}`} />
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDeliveryStatusColor(legal.deliveryStatus)}`}>
              {legal.deliveryStatus || 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <FileText className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Notice Date: {legal.noticeDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Speed Post: {legal.legalNoticeSpeedPostDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${commonClasses.valueText}`}>
              Speed Post Received: {legal.speedpostReceivedDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Scale className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Reply Received: {legal.replyReceivedDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Scale className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Case Filed: {legal.caseFilledDate}
            </span>
          </div>
          {legal.remarkWithCaseDetails && legal.remarkWithCaseDetails !== 'N/A' && (
            <div className="mt-2">
              <span className={`text-sm ${commonClasses.valueText}`}>
                Remarks: {legal.remarkWithCaseDetails}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Criminal Case Status */}
      <td className={`px-2 py-4 ${commonClasses.cellBorder}`} style={{ minWidth: "250px" }}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            {legal.criminalCaseStatus?.toLowerCase() === 'filed' ? (
              <CheckCircle className={`w-5 h-5 ${commonClasses.icon.green}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${commonClasses.icon.yellow}`} />
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCriminalCaseStatusColor(legal.criminalCaseStatus)}`}>
              {legal.criminalCaseStatus || 'Pending'}
            </span>
          </div>
          
          {legal.criminalComplaintNo && legal.criminalComplaintNo !== 'N/A' && (
            <div className="flex items-center space-x-2">
              <FileText className={`w-4 h-4 ${commonClasses.icon.red}`} />
              <span className={`text-sm ${commonClasses.valueText}`}>
                Complaint No: {legal.criminalComplaintNo}
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Building2 className={`w-4 h-4 ${commonClasses.icon.blue}`} />
            <span className={`text-sm ${commonClasses.valueText}`}>
              Police Station: {legal.policeStation || 'N/A'}
            </span>
          </div>
          
          <button
            onClick={() => onShowCriminalStatus(legal)}
            className={`w-full px-3 py-2 mt-2 text-sm rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              isDark
                ? "bg-purple-900/30 hover:bg-purple-800/40 text-purple-300 border border-purple-700/50"
                : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
            }`}
          >
            <Scale className="w-3 h-3" />
            <span>Show Criminal Status</span>
          </button>
        </div>
      </td>

      {/* Actions */}
      <td className="px-2 py-4" style={{ minWidth: "350px" }}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onEdit(legal)} 
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
            Create Notice (138)
          </button>
          <button
            onClick={() => onCriminalCase(legal)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isDark
                ? "bg-purple-900/50 hover:bg-purple-800 text-purple-300 border border-purple-700"
                : "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200"
            }`}
          >
            Criminal Case (138)
          </button>
          <button
      onClick={() => onArbitrationNotice && onArbitrationNotice(legal)}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
        isDark
          ? "bg-amber-900/50 hover:bg-amber-800 text-amber-300 border border-amber-700"
          : "bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200"
      }`}
    >
      Create Arbitration Notice
    </button>
          <button
      onClick={() => onArbitrationCriminal && onArbitrationCriminal(legal)}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
        isDark
          ? "bg-pink-900/50 hover:bg-pink-800 text-pink-300 border border-pink-700"
          : "bg-pink-100 hover:bg-pink-200 text-pink-700 border border-pink-200"
      }`}
    >
      Create Arbitration Criminal
    </button>
        </div>
      </td>
    </tr>
  );
};

export default LegalRow;