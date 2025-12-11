// app/crm/bank/components/BankRow.jsx
'use client';
import React from 'react';
import { 
  Building2, 
  MapPin, 
  CreditCard, 
  Hash, 
  User, 
  Phone, 
  Mail,
  Calendar,
  Edit2,
  Power,
  CheckCircle,
  XCircle,
  Briefcase,
  Key,
  Lock,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const BankRow = ({
  bank,
  index,
  isDark,
  onEdit,
  onToggleStatus,
  onViewDetails
}) => {
  // Check if bank is active
  const isActive = bank.isActive === true || bank.isActive === 1;
  
  // Common cell styles
  const cellBase = "px-2 py-4 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";
  const textSuccess = isDark ? "text-green-400" : "text-green-600";
  const textWarning = isDark ? "text-yellow-400" : "text-yellow-600";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;
  const iconSuccess = `w-4 h-4 ${textSuccess}`;
  const iconWarning = `w-4 h-4 ${textWarning}`;

  // Row background styles
  const normalRowBg = index % 2 === 0
    ? isDark ? "bg-gray-700/30" : "bg-gray-50"
    : "";

  const normalHoverBg = isDark
    ? "hover:bg-gray-700/50"
    : "hover:bg-emerald-50/50";

  // Format currency
  const formatCurrency = amount => {
    if (!amount && amount !== 0) return "0";
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "0";
    return numAmount.toLocaleString("en-IN");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Handle edit button click
  const handleEdit = () => {
    if (onEdit) {
      onEdit(bank);
      toast.success('Edit mode enabled');
    }
  };

  // Handle status toggle
const handleToggleStatus = async () => {
  if (!onToggleStatus || !bank.id) return;
  
  const action = isActive ? 'deactivate' : 'activate';
  const actionText = isActive ? 'Deactivate' : 'Activate';
  const bankName = bank.bank || bank.name || 'this bank account';
  
  // Show confirmation dialog
  const result = await Swal.fire({
    title: `${actionText} Bank Account`,
    html: `Are you sure you want to ${action} <strong>${bankName}</strong>?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: isActive ? '#dc2626' : '#059669',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Yes, ${actionText}!`,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    background: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f9fafb' : '#111827',
    customClass: {
      popup: isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900',
      title: 'text-lg font-semibold',
      htmlContainer: isDark ? 'text-gray-300' : 'text-gray-700',
      confirmButton: 'px-4 py-2 rounded-lg font-medium',
      cancelButton: 'px-4 py-2 rounded-lg font-medium'
    }
  });
  
  // If user confirmed
  if (result.isConfirmed) {
    try {
      // Call the toggle status function
      await onToggleStatus(bank.id);
      
      // Show success toast (default styling)
      toast.success(`Bank account ${action}d successfully!`);
      
    } catch (error) {
      // Show error toast (default styling)
      toast.error(`Failed to ${action} bank account. Please try again.`);
      console.error('Error toggling bank status:', error);
    }
  }
};

  // Get usage badge color
const getUsageBadgeColor = (usage) => {
  if (!usage) {
    return isDark
      ? "bg-gray-700 text-gray-300 border-gray-600"
      : "bg-gray-100 text-gray-800 border-gray-200";
  }
  
  switch (usage) {
    case 'disbursement':
      return isDark
        ? "bg-blue-900/50 text-blue-300 border-blue-700"
        : "bg-blue-100 text-blue-800 border-blue-200";
    case 'collection':
      return isDark
        ? "bg-purple-900/50 text-purple-300 border-purple-700"
        : "bg-purple-100 text-purple-800 border-purple-200";
    case 'cheque':
      return isDark
        ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
        : "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return isDark
        ? "bg-gray-700 text-gray-300 border-gray-600"
        : "bg-gray-100 text-gray-800 border-gray-200";
  }
};

  

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${normalRowBg} ${normalHoverBg} ${
        isDark
          ? "border-emerald-700"
          : "border-emerald-300"
      }`}
    >
      {/* S.No */}
      <td className={`${cellStyle} text-left`}>
        <span className={`font-medium ${textPrimary}`}>
          {index + 1}
        </span>
      </td>

      {/* Bank Details */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building2 className={iconAccent} />
            <span className={`font-medium text-sm ${textPrimary}`}>
              {bank.bank}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className={iconWarning} />
            <span className={`text-sm ${textSecondary}`}>
              {bank.branchName}
            </span>
          </div>
        </div>
      </td>

      {/* Account Details */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CreditCard className={iconWarning} />
            <span className={`text-sm font-medium ${textSecondary}`}>
              {bank.accountNo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Hash className={iconAccent} />
            <span className={`text-sm ${textSecondary}`}>
              IFSC: {bank.ifscCode}
            </span>
          </div>
        </div>
      </td>

      {/* Account Name & Type */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className={iconAccent} />
            <span className={`text-sm font-medium ${textSecondary}`}>
              {bank.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className={iconWarning} />
            <span className={`text-sm ${textSecondary}`}>
              {bank.accountType}
            </span>
          </div>
        </div>
      </td>

      {/* Contact Details */}
      <td className={`${cellStyle} text-left`}>
  <div className="space-y-2">
    {bank.contactPerson ? (
      <div className="flex items-center space-x-2">
        <User className={iconSuccess} />
        <span className={`text-sm ${textSecondary}`}>
          {bank.contactPerson}
        </span>
      </div>
    ) : null}
    
    {bank.phone ? (
      <div className="flex items-center space-x-2">
        <Phone className={iconSuccess} />
        <span className={`text-sm ${textSecondary}`}>
          {bank.phone}
        </span>
      </div>
    ) : null}
    
    {bank.email ? (
      <div className="flex items-center space-x-2">
        <Mail className={iconAccent} />
        <span className={`text-sm ${textSecondary}`}>
          {bank.email}
        </span>
      </div>
    ) : null}
    
    {!bank.contactPerson && !bank.phone && !bank.email && (
      <span className={`text-xs ${textSecondary} italic`}>No contact info</span>
    )}
  </div>
</td>

      {/* Amount */}
      <td className={`${cellStyle} text-left`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${textSecondary}`}>
            ₹{formatCurrency(bank.amount)}
          </span>
        </div>
      </td>

      {/* Usage */}
      <td className={`${cellStyle} text-left`}>
  {bank.usesFor ? (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUsageBadgeColor(bank.usesFor)}`}>
      {bank.usesFor.charAt(0).toUpperCase() + bank.usesFor.slice(1)}
    </span>
  ) : (
    <span className={`text-xs ${textSecondary} italic`}>Not specified</span>
  )}
</td>
     

    <td className={`border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"} text-center`}>
     <div className="space-y-1">    
    <div className="flex items-center justify-center space-x-2">
      <User className={iconAccent} />
      <span className={`text-xs ${textSecondary}`}>
        By: {bank.addedBy}
      </span>
    </div>

    <div className="flex items-center justify-center space-x-2">
      <Calendar className={iconAccent} />
      <span className={`text-xs ${textSecondary}`}>
        {formatDate(bank.createdAt)}
      </span>
    </div>

  </div>
</td>

      {/* Status */}
      <td className={`text-center ${isDark ? "border-gray-600/80" : "border-gray-300/90"} border-r `}>
  <div
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
      isActive
        ? isDark
          ? "bg-green-900/40 text-green-300 border-green-700"
          : "bg-green-100 text-green-700 border-green-300"
        : isDark
          ? "bg-red-900/40 text-red-300 border-red-700"
          : "bg-red-100 text-red-700 border-red-300"
    }`}
  >
    {isActive ? (
      <>
        <CheckCircle className="w-3 h-3" />
        <span>Active</span>
      </>
    ) : (
      <>
        <XCircle className="w-3 h-3" />
        <span>Inactive</span>
      </>
    )}
  </div>
</td>


      {/* Actions - Center aligned */}
      <td className={`${cellStyle} text-center`}>
        <div className="flex items-center justify-center space-x-2">
          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-blue-900/50 hover:bg-blue-800 text-blue-300"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700"
            }`}
            title="Edit Bank Account"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          {/* Status Toggle Button */}
          <button
            onClick={handleToggleStatus}
            className={`p-2 cursor-pointer rounded-lg transition-all duration-200 hover:scale-105 ${
              isActive
                ? isDark
                  ? "bg-red-900/50 hover:bg-red-800 text-red-300"
                  : "bg-red-100 hover:bg-red-200 text-red-700"
                : isDark
                  ? "bg-green-900/50 hover:bg-green-800 text-green-300"
                  : "bg-green-100 hover:bg-green-200 text-green-700"
            }`}
            title={isActive ? "Deactivate" : "Activate"}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BankRow;