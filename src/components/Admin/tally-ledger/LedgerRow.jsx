import { useState } from "react";
import {
  Calendar,
  MapPin,
  CreditCard,
  Eye,
} from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
import CallDetailsModal from "../CallDetailsModal";
import CustomerTransactionDetails from "../CustomerTransactionDetails";


const LedgerRow = ({ item, index, isDark }) => {

    const [showCallModal, setShowCallModal] = useState(false);
     const [showLedgerModal, setShowLedgerModal] = useState(false);

    const handleView = (item) => {
  setShowLedgerModal(true);
};

const handleCall = (item) => {
  setShowCallModal(true);
}
const handleDownloadPDF = (item) => {
    // Add your PDF download logic here
    console.log('Download PDF for:', item);
  };

  const handleCallSubmit = (callData) => {
    // Handle call submission logic
    console.log('Call submitted:', callData);
  };
  
  const handleBalanceUpdate = (updateData) => {
    // Handle balance update logic
    console.log('Balance updated:', updateData);
  };
  

  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate.split('-').reverse().join('-'));
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', days: Math.abs(diffDays), color: 'red' };
    } else if (diffDays <= 7) {
      return { status: 'warning', days: diffDays, color: 'yellow' };
    } else {
      return { status: 'normal', days: diffDays, color: 'green' };
    }
  };

  const dueDateStatus = getDueDateStatus(item.dueDate);

  const getDueDateColor = (status) => {
    switch (status) {
      case 'overdue':
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      case 'warning':
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
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
      {/* SN */}
      <td className="px-6 py-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          isDark
            ? "bg-emerald-900/50 text-emerald-300"
            : "bg-emerald-100 text-emerald-700"
        }`}>
          {item.sn}
        </div>
      </td>

      {/* Call */}
      <td className="px-6 py-4">
        <button
        onClick={handleCall}
          className={`px-3 cursor-pointer py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
            isDark
              ? "bg-blue-900/50 text-blue-300 border-blue-700 hover:bg-blue-800"
              : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
          }`}
        >
          {item.call}
        </button>
      </td>

      {/* Loan No */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <CreditCard className={`w-4 h-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            {item.loanNo}
          </span>
        </div>
      </td>

      {/* Disburse Date */}
      <td className="px-6 py-4">
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

      {/* Due Date */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <span className={`text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}>
              {item.dueDate}
            </span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getDueDateColor(dueDateStatus.status)}`}>
            {dueDateStatus.status === 'overdue' 
              ? `${dueDateStatus.days} days overdue`
              : dueDateStatus.status === 'warning'
              ? `${dueDateStatus.days} days left`
              : 'On track'
            }
          </span>
        </div>
      </td>

      {/* Name */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          
          <div>
            <p className={`text-sm font-semibold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              {item.name}
            </p>
          </div>
        </div>
      </td>

      {/* Address */}
      <td className="px-6 py-4">
        <div className="flex items-start space-x-2">
          <MapPin className={`w-4 h-4 mt-1 flex-shrink-0 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <span className={`text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
          } leading-relaxed`}>
            {item.address}
          </span>
        </div>
      </td>

      {/* Phone No */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          
        <p className={`text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}>
              {item.phoneNo}
            </p>
            
         
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
        <p className={`text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}>
              {item.email}
            </p>    
          
        </div>
      </td>

      {/* Balance */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          
          <span className={`text-sm font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            ₹{parseInt(item.balance).toLocaleString()}
          </span>
        </div>
      </td>
      {/* Action */}
<td className="px-6 py-4">
  <div className="flex items-center space-x-2">
    <button
      onClick={() => handleView(item)}
      className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
        isDark
          ? "bg-blue-900/50 text-blue-300 border border-blue-700 hover:bg-blue-800"
          : "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200"
      }`}
      title="View Details"
    >
      <Eye className="w-4 h-4" />
    </button>
    <button
  onClick={() => handleDownloadPDF(item)}
  className={`p-2 cursor-pointer rounded-md transition-all duration-200 hover:scale-105 flex items-center justify-center shadow-sm ${
    isDark
      ? "bg-red-800/80 text-white hover:bg-red-700 border border-red-700"
      : "bg-red-500/10 text-red-700 hover:bg-red-100 border border-red-300"
  }`}
  title="Download PDF"
>
  <FaFilePdf className="w-5 h-5" />
</button>

  </div>
</td>

<CallDetailsModal
  isOpen={showCallModal}
  onClose={() => setShowCallModal(false)}
  data={item}
  isDark={isDark}
  onSubmit={handleCallSubmit}
/>

<CustomerTransactionDetails
  isOpen={showLedgerModal}
  onClose={() => setShowLedgerModal(false)}
  data={item}
  isDark={isDark}
  onUpdateBalance={handleBalanceUpdate}
/>
    </tr>
  );
};

export default LedgerRow;