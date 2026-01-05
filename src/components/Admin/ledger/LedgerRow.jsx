"use client";
import { Calendar, CreditCard, Eye, CheckCircle, RefreshCw } from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
import CallButton from "../call/CallButton";
import Swal from "sweetalert2";
import toast from "react-hot-toast"; 
import { useAdminAuthStore } from '@/lib/store/authAdminStore'; 
import { useRouter } from "next/navigation";

const LedgerRow = ({ item, index, isDark, onViewTransaction, onAdjustment, onDownloadPDF, onSettle,onRenewal}) => {
  const { hasPermission } = useAdminAuthStore();
  const router = useRouter();  
  
  const cellBase = "px-2 py-4 text-center border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  
  const iconAccent = `w-4 h-4 ${textAccent}`;

  const formatBalance = (balance) => {
    const amount = parseFloat(balance || 0);
    return `₹${amount.toLocaleString()}`;
  };

  const formatOverdue = (overdue) => {
    const amount = parseFloat(overdue || 0);
    return `₹${amount.toLocaleString()}`;
  };

  const handlePDFClick = () => {
    Swal.fire({
      title: 'Ledger Statement',
      text: 'What would you like to do with the ledger statement?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Download PDF',
      denyButtonText: 'Print',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10b981',
      denyButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    }).then((result) => {
      if (result.isConfirmed) {
        onDownloadPDF(item.application_id, 'download', item);
      } else if (result.isDenied) {
        onDownloadPDF(item.application_id, 'print', item); 
      }
    });
  };

  const handleSettleClick = () => {
  Swal.fire({
    title: 'Settle Loan Account?',
    text: 'Are you sure you want to settle this loan account?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, Settle Account',
    cancelButtonText: 'No',
    background: isDark ? "#1f2937" : "#ffffff",
    color: isDark ? "#f9fafb" : "#111827",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await onSettle(item);
        toast.success('Loan account settled successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        toast.error(error.message || 'Failed to settle account. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  });
};
  
  // Check conditions for buttons
  const balance = parseFloat(item.balance || 0);
  const isAdjustmentDisabled = balance <= 0;

  // Check if it should show Renewal or Adjustment
  const isRenewal = item.loan_status === 18;
  
  // Settle button conditions
  const isAlreadySettled = item.settled === 1;
  const isSettleEnabled = item.passed_days > 3 && !isAlreadySettled;
  
  // Permission checks
  const hasAdjustmentPermission = hasPermission('adjustment');
  const hasSettlePermission = hasPermission('settle');
  const hasRenewalPermission = hasPermission('adjustment');

  const handleRenewalClick = () => {
    if (onRenewal) {
      onRenewal(item);
    }
  };

  const handleAdjustmentClick = () => {
    if (!isAdjustmentDisabled && onAdjustment) {
      onAdjustment(item);
    }
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-emerald-50/50"
      } ${
        index % 2 === 0
          ? isDark 
            ? "bg-gray-700/30" 
            : "bg-gray-50"
          : ""
      }`}
    >
      <td className={cellStyle}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          isDark
            ? "bg-emerald-900/50 text-emerald-300"
            : "bg-emerald-100 text-emerald-700"
        }`}>
          {item.sn}
        </div>
      </td>

      <td className={cellStyle}>
        <CallButton
          applicant={item}
          isDark={isDark}
          size="small"
          variant="default"
          className="px-2 py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105"
        />
      </td>

      <td className={cellStyle}>
  <button
    onClick={() => {
      if (item.dueDate && item.dueDate !== 'N/A' && item.dueDate !== null ) {
        router.push(`/crm/statement-of-account?id=${item.application_id}`);
      }
    }}
    className={`flex items-center justify-center space-x-2 text-sm transition-colors duration-200 ${
      item.dueDate && item.dueDate !== 'N/A' 
        ? 'underline cursor-pointer' 
        : 'no-underline cursor-default'
    } ${
      item.dueDate && item.dueDate !== 'N/A'
        ? (isDark
            ? "text-emerald-400 hover:text-emerald-300"
            : "text-emerald-600 hover:text-emerald-800")
        : (isDark
            ? "text-gray-400"
            : "text-gray-500")
    }`}
    disabled={!(item.dueDate && item.dueDate !== 'N/A')}
  >
    <CreditCard className="w-4 h-4" />
    <span className="font-semibold">
      {item.loanNo}
    </span>
  </button>
</td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {item.dueDate || 'N/A'}
          </span>
        </div>
      </td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-3">
          <div>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {item.name}
            </p>
            {item.crnno && (
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                CRN: {item.crnno}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* ADJUSTMENT COLUMN */}
      <td className={cellStyle}>
        <div className="relative group flex justify-center">
          {isRenewal ? (
            // RENEWAL BUTTON
            !hasRenewalPermission ? (
              <div className="opacity-50 cursor-not-allowed pointer-events-none">
                <button
                  className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all duration-200 flex items-center gap-1 ${
                    isDark
                      ? "bg-gray-900/50 text-gray-300 border-gray-700"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  Renewal
                </button>
              </div>
            ) : (
              <button
                onClick={handleRenewalClick}
                className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all duration-200 flex items-center gap-1 ${
                  isDark
                    ? "bg-blue-900/50 text-blue-300 border-blue-700 hover:bg-blue-800 hover:scale-105"
                    : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:scale-105"
                }`}
                title="Renew loan account"
              >
                <RefreshCw className="w-3 h-3" />
                Renewal
              </button>
            )
          ) : (
            // ADJUSTMENT BUTTON
            !hasAdjustmentPermission ? (
              <div className="opacity-50 cursor-not-allowed pointer-events-none">
                <button
                  className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all duration-200 ${
                    isDark
                      ? "bg-gray-900/50 text-gray-300 border-gray-700"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  Adjustment
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdjustmentClick}
                disabled={isAdjustmentDisabled}
                className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all duration-200 ${
                  isAdjustmentDisabled
                    ? isDark
                      ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed opacity-60"
                      : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed opacity-60"
                    : isDark
                      ? "bg-pink-900/50 text-pink-300 border-pink-700 hover:bg-pink-800 hover:scale-105"
                      : "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200 hover:scale-105"
                }`}
                title={isAdjustmentDisabled ? "Adjustment disabled when balance ≤ ₹0" : "Make adjustment"}
              >
                Adjustment
              </button>
            )
          )}
          
          {/* Tooltip for no permission */}
          {(!hasAdjustmentPermission || !hasRenewalPermission) && (
            <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
              <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                No permission for {isRenewal ? 'renewal' : 'adjustment'}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      </td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-sm font-bold ${
            balance < 0 
              ? isDark ? "text-green-400" : "text-green-600"
              : isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            {formatBalance(item.balance)}
          </span>
        </div>
      </td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-sm font-bold ${
            isDark ? "text-red-400" : "text-red-600"
          }`}>
            {formatOverdue(item.over_due)}
          </span>
        </div>
      </td>

      {/* SETTLED COLUMN */}
      <td className={cellStyle}>
        {isAlreadySettled ? (
          <div className="flex items-center justify-center space-x-2">
            <span className={`text-sm font-bold ${
              isDark ? "text-green-400" : "text-green-600"
            }`}>
              Yes
            </span>
          </div>
        ) : (
          <div className="relative group flex justify-center">
            {!hasSettlePermission ? (
              <div className="opacity-50 cursor-not-allowed pointer-events-none">
                <button
                  className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-1 w-full ${
                    isDark
                      ? "bg-gray-900/50 text-gray-300 border-gray-700"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  <CheckCircle className="w-3 h-3" />
                  Settle
                </button>
              </div>
            ) : (
              <button
                onClick={handleSettleClick} 
                disabled={!isSettleEnabled}
                className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-1 w-full ${
                  !isSettleEnabled
                    ? isDark
                      ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed opacity-60"
                      : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed opacity-60"
                    : isDark
                      ? "bg-green-900/50 text-green-300 border-green-700 hover:bg-green-800 hover:scale-105"
                      : "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:scale-105"
                }`}
                title={
                  isAlreadySettled 
                    ? "Already settled"
                    : !isSettleEnabled 
                      ? "Settle available after 3 days" 
                      : "Settle loan account"
                }
              >
                <CheckCircle className="w-3 h-3" />
                Settle
              </button>
            )}
            
            {!hasSettlePermission && (
              <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  No permission to settle
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        )}
      </td>

      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onViewTransaction(item)}  
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-blue-900/50 text-blue-300 border border-blue-700 hover:bg-blue-800"
                : "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200"
            }`}
            title="View Transaction Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={handlePDFClick}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-red-900/50 text-red-300 border border-red-700 hover:bg-red-800"
                : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
            }`}
            title="Download/Print Ledger Statement"
          >
            <FaFilePdf className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LedgerRow;