import React from "react";
import { Calendar, Building, CheckCircle } from "lucide-react";
import { useAdminAuthStore } from "@/lib/store/authAdminStore";

const DisbursementRow = ({ 
  item, 
  index, 
  isDark,
  onNewLoanClick,
  onUpdateClick,
  onTransactionClick,  
  onTransactionStatusClick,
  onTransferClick
}) => {
  
  const { hasPermission } = useAdminAuthStore();

  const handleTransaction = (item) => {
    onTransactionClick(item);
  };

  const handleTransfer = (item) => {
    onTransferClick(item);
  };

  const handleNewLoan = (item) => {
    onNewLoanClick(item.beneficiaryAcName, item.loanNo);
  };

  const handleUpdate = (item) => {
    onUpdateClick(item); 
  };

  const handleTransactionStatus = (item) => {
    onTransactionStatusClick(item);
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
      // Handle different date formats
      let date;
      
      if (dateString.includes('-')) {
        if (dateString.split('-')[0].length === 4) {
          const [year, month, day] = dateString.split('-');
          date = new Date(`${year}-${month}-${day}`);
        } else {
          const [day, month, year] = dateString.split('-');
          date = new Date(`${year}-${month}-${day}`);
        }
      } else if (dateString.includes('/')) {
        // Handle MM/DD/YYYY or DD/MM/YYYY format
        const parts = dateString.split('/');
        if (parts[0].length === 4) {
          // YYYY/MM/DD
          date = new Date(dateString.replace(/\//g, '-'));
        } else if (parts[2].length === 4) {
          
          const [day, month, year] = parts;
          date = new Date(`${year}-${month}-${day}`);
        }
      } else {
        // Try parsing directly
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; 
      }
      
      // Format to DD-MM-YYYY
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Common cell styles
  const cellBase = "px-2 py-3 text-center border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "border-emerald-700 hover:bg-gray-700/50"
          : "border-emerald-300 hover:bg-emerald-50/50"
      } ${
        index % 2 === 0
          ? isDark ? "bg-gray-700/30" : "bg-gray-50"
          : ""
      }`}
    >
      {/* SN */}
      <td className={cellStyle}>
        <span className={`font-medium ${textPrimary}`}>
          {item.sn}
        </span>
      </td>

      {/* Loan No */}
      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textAccent}`}>
          {item.loanNo}
        </span>
      </td>
      
      {/* Beneficiary a/c name */}
      <td className={cellStyle}>
        <span className={`text-sm font-medium ${textPrimary}`}>
          {item.beneficiaryAcName}
        </span>
      </td>

      {/* Disburse Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {formatDate(item.disburseDate)}
          </span>
        </div>
      </td>

      {/* CRN No */}
      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${
          isDark ? "text-blue-400" : "text-blue-600"
        }`}>
          {item.crnNo}
        </span>
      </td>

      {/* Tran. Ref. No */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {item.tranRefNo}
        </span>
      </td>

      {/* Tran. Date */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {formatDate(item.tranDate)}
          </span>
        </div>
      </td>

      {/* Sanctioned Amount */}
      <td className={cellStyle}>
        <div className="bg-gradient-to-r px-2 rounded-md from-orange-100 to-orange-200 text-orange-800 border border-orange-300">
          <span className="text-sm font-semibold">
            {formatCurrency(item.sanctionedAmount)}
          </span>
        </div>
      </td>

      {/* Disbursed Amount */}
      <td className={cellStyle}>
        <div className="bg-gradient-to-r px-2 rounded-md from-green-100 to-green-200 text-green-800 border border-green-300">
          <span className="text-sm font-semibold">
            {formatCurrency(item.disbursedAmount)}
          </span>
        </div>
      </td>

      {/* Sender a/c no */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          <Building className={iconAccent} />
          <span className={`text-sm ${textSecondary}`}>
            {item.senderAcNo}
          </span>
        </div>
      </td>

      {/* Sender name */}
      <td className={cellStyle}>
        <span className={`text-sm font-medium ${textPrimary}`}>
          {item.senderName}
        </span>
      </td>

      {/* Transaction */}
<td className={cellStyle}>
  <div className="relative group">
    {item.tranRefNo && item.tranRefNo !== 'N/A' ? (
      <div className="flex items-center justify-center">
        <CheckCircle className="w-6 h-6 text-green-500" />
      </div>
    ) : !hasPermission('transaction') ? (
      <div className="opacity-50 cursor-not-allowed pointer-events-none">
        <button
          className={`px-6 py-2 rounded-md text-sm font-semibold border transition-all duration-200 ${
            isDark
              ? "bg-gray-900/50 text-gray-300 border-gray-700"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          Transaction
        </button>
      </div>
    ) : (
      <button
        onClick={() => handleTransaction(item)}
        className={`px-6 cursor-pointer py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105 ${
          isDark
            ? "bg-blue-900/50 text-blue-300 border-blue-700 hover:bg-blue-800"
            : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
        }`}
      >
        Transaction
      </button>
    )}
    
    {!hasPermission('transaction') && (!item.tranRefNo || item.tranRefNo === 'N/A') && (
      <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          No permission for transaction
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    )}
  </div>
</td>
      {/* ICICI Transaction */}
      <td className={cellStyle}>
  <div className="relative group">
    {item.tranRefNo && item.tranRefNo !== 'N/A' ? (
      <div className="flex items-center justify-center">
        <CheckCircle className="w-6 h-6 text-green-500" />
      </div>
    ) : !hasPermission('transaction') ? (
      <div className="opacity-50 cursor-not-allowed pointer-events-none">
        <button
          className={`px-6 py-2 rounded-md text-sm font-semibold border transition-all duration-200 ${
            isDark
              ? "bg-gray-900/50 text-gray-300 border-gray-700"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          Transfer
        </button>
      </div>
    ) : (
      <button
        onClick={() => handleTransfer(item)}
        className={`px-6 cursor-pointer py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105 ${
          isDark
            ? "bg-indigo-900/50 text-indigo-300 border-indigo-700 hover:bg-indigo-800"
            : "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200"
        }`}
      >
        Transfer
      </button>
    )}
    
    {!hasPermission('transaction') && (!item.tranRefNo || item.tranRefNo === 'N/A') && (
      <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          No permission for transfer
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    )}
  </div>
</td>

      {/* ICICI Transaction Status */}
      <td className={cellStyle}>
        <button
          onClick={() => handleTransactionStatus(item)}
          className={`px-6 cursor-pointer py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-orange-900/50 text-orange-300 border-orange-700 hover:bg-orange-800"
              : "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
          }`}
        >
          Check Status
        </button>
      </td>

      {/* Beneficiary Bank IFSC Code */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {item.beneficiaryBankIFSC}
        </span>
      </td>

      {/* Beneficiary a/c type */}
      {/* <td className={cellStyle}>
        <span className={`text-sm font-semibold ${
          isDark ? "text-teal-400" : "text-teal-600"
        }`}>
          {item.beneficiaryAcType}
        </span>
      </td> */}

      {/* Beneficiary a/c no */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {item.beneficiaryAcNo}
        </span>
      </td>

      {/* Send to Rec */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {item.sendToRec}
        </span>
      </td>
    </tr>
  );
};

export default DisbursementRow;