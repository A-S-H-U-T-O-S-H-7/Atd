import {Calendar,Building} from "lucide-react";

const DisbursementRow = ({ item, index, isDark,onNewLoanClick,onUpdateClick,
  onTransactionClick,  onTransactionStatusClick,onTransferClick

 }) => {  

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case 'pending':
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'failed':
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      default:
        return isDark
          ? "bg-blue-900/50 text-blue-300 border-blue-700"
          : "bg-blue-100 text-blue-800 border-blue-200";
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
            ? "bg-gray-700/80" 
            : "bg-gray-50"
          : ""
      }`}
    >
      {/* SN */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          isDark
            ? " text-white"
            : " text-black"
        }`}>
          {item.sn}
        </div>
      </td>

      {/* Loan No */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            {item.loanNo}
          </span>
        </div>
      </td>

      {/* Disburse Date */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.disburseDate}
          </span>
        </div>
      </td>

      {/* CRN No */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <div className="flex items-center space-x-2">
                   <span className={`text-sm font-medium ${
            isDark ? "text-blue-500" : "text-blue-800"
          }`}>
            {item.crnNo}
          </span>
        </div>
      </td>

      {/* Tran. Ref. No */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          {item.tranRefNo}
        </span>
      </td>

      {/* Tran. Date */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.tranDate}
          </span>
        </div>
      </td>

      {/* Sanctioned Amount */}
<td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold px-2 py-1 rounded ${
            isDark ? "bg-orange-900/50 text-orange-300" : "bg-orange-100 text-orange-800"
          }`}>
            {formatCurrency(item.sanctionedAmount)}
          </span>
        </div>
      </td>

      {/* Disbursed Amount */}
          <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold px-2 py-1 rounded ${
            isDark ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800"
          }`}>
            {formatCurrency(item.disbursedAmount)}
          </span>
        </div>
      </td>

      {/* Sender a/c no */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <div className="flex items-center space-x-2">
          <Building className={`w-4 h-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.senderAcNo}
          </span>
        </div>
      </td>

      {/* Sender name */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <div className="flex items-center space-x-2">
         
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.senderName}
          </span>
        </div>
      </td>

      {/* Transaction */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <button
          onClick={() => handleTransaction(item)}
          className={`px-3 py-2 cursor-pointer rounded-md text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-blue-900/50 text-blue-300 border-blue-700 hover:bg-blue-800"
              : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
          }`}
        >
          Transaction
        </button>
      </td>

      {/* Transaction */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <button
          onClick={() => handleTransfer(item)}
          className={`px-3 py-2 cursor-pointer rounded-md text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-indigo-900/50 text-indigo-300 border-indigo-700 hover:bg-indigo-800"
              : "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200"
          }`}
        >
          Transfer
        </button>
      </td>

      {/* ICICI Transaction Status */}
<td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
  <button
    onClick={() => handleTransactionStatus(item)}
    className={`px-3 py-2 cursor-pointer rounded-md text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
      isDark
        ? "bg-orange-900/50 text-orange-300 border-orange-700 hover:bg-orange-800"
        : "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
    }`}
  >
    Check Status
  </button>
</td>

      {/* Beneficiary Bank IFSC Code */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          {item.beneficiaryBankIFSC}
        </span>
      </td>

      {/* Beneficiary a/c type */}
<td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>      <span className={`text-sm font-semibold ${
          isDark ? "text-teal-400" : "text-teal-600"
        }`}>
          {item.beneficiaryAcType}
        </span>
      </td>

      {/* Beneficiary a/c no */}
<td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
          <span className={`text-sm font-medium ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          {item.beneficiaryAcNo}
        </span>
      </td>

      {/* Beneficiary a/c name */}
<td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
          <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
            {item.beneficiaryAcName}
          </span>
        </div>
      </td>

      {/* Send to Rec */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <span className={`text-sm font-medium ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          {item.sendToRec}
        </span>
      </td>

      {/* New Loan */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-gray-600/80" : "border-gray-300/90"
}`}>
        <button
          onClick={() => handleNewLoan(item)}
          className={`px-3 cursor-pointer py-2 rounded-md text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-sky-900/50 text-sky-300 border-sky-700 hover:bg-sky-800"
              : "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200"
          }`}
        >
          New Loan
        </button>
      </td>

      {/* Action */}
      <td className={`px-6 py-4 border-r ${
  isDark ? "border-transparent" : "border-transparent"
}`}>
      <button
  onClick={() => handleUpdate(item)}
  className={`px-3 py-2 cursor-pointer rounded-md text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
    isDark
      ? "bg-pink-900/50 text-pink-300 border-pink-700 hover:bg-pink-800"
      : "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200"
  }`}
>
  Update
</button>
</td>

      
    </tr>
  );
};

export default DisbursementRow;