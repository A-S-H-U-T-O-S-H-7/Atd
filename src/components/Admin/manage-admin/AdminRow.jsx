// components/admin/AdminRow.jsx
'use client';
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  UserCheck, 
  Calendar,
  Edit2,
  Key,
  CheckCircle,
  XCircle,
  Power,
  Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminRow = ({ admin, index, isDark, onEdit, onResetPassword, onToggleStatus, onOpenPermissions }) => {
  const isActive = admin.isActive === true || admin.isActive === 1;
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const cellBase = "px-4 py-4 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const iconBlue = `w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`;
  const iconPurple = `w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`;
  const iconGreen = `w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`;
  const iconOrange = `w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`;

  const normalRowBg = index % 2 === 0
    ? isDark ? "bg-gray-700/30" : "bg-gray-50"
    : "";
  const normalHoverBg = isDark ? "hover:bg-gray-700/50" : "hover:bg-purple-50/50";

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

  const getTypeLabel = (type) => {
    const typeMap = {
      'user': 'User',
      'verifier': 'Verifier',
      'account': 'Account',
      'manager': 'Manager',
      'admin': 'Admin',
      'superadmin': 'Super Admin',
      'collection': 'Collection',
      'agency': 'Agency'
    };
    return typeMap[type] || type;
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(admin);
      toast.success('Edit mode enabled');
    }
  };

  const handleResetPassword = () => {
    if (!onResetPassword || !admin.id) return;
    
    Swal.fire({
      title: 'Reset Password',
      html: `Send password reset link to <strong>${admin.email || admin.username}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Send Reset Link',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
      customClass: {
        popup: isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onResetPassword(admin.id);
      }
    });
  };

  const handleToggleStatus = async () => {
    if (!onToggleStatus || !admin.id) return;
    
    const action = isActive ? 'deactivate' : 'activate';
    const actionText = isActive ? 'Deactivate' : 'Activate';
    const adminName = admin.name || 'this admin';
    
    const result = await Swal.fire({
      title: `${actionText} Admin`,
      html: `Are you sure you want to ${action} <strong>${adminName}</strong>?`,
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
    
    if (result.isConfirmed) {
      try {
        setIsTogglingStatus(true);
        await onToggleStatus(admin.id);
        toast.success(`Admin ${actionText}d successfully!`);
      } catch (error) {
        toast.error(`Failed to ${actionText} admin. Please try again.`);
        console.error('Error toggling admin status:', error);
      } finally {
        setIsTogglingStatus(false);
      }
    }
  };

  const handleOpenPermissions = () => {
    if (onOpenPermissions) {
      onOpenPermissions(admin.id, admin.name);
    }
  };

  return (
    <tr className={`border-b transition-all duration-200 hover:shadow-lg ${normalRowBg} ${normalHoverBg} ${
      isDark ? "border-purple-700" : "border-purple-300"
    }`}>
      
      {/* S.No */}
      <td className={`${cellStyle} text-left`}>
        <span className={`font-medium ${textPrimary}`}>{index + 1}</span>
      </td>

      {/* Admin Details */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            {admin.selfieUrl ? (
              <div className="flex-shrink-0">
                <img 
                  src={admin.selfieUrl} 
                  alt={admin.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-300"
                />
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-purple-900/50' : 'bg-purple-100'
              }`}>
                <User className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`font-medium text-sm ${textPrimary} truncate`}>{admin.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                  admin.type === 'superadmin'
                    ? isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                    : admin.type === 'admin'
                    ? isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                    : isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  {getTypeLabel(admin.type)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-xs ${textSecondary}`}>@{admin.username}</span>
              </div>
              {admin.email && (
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${textSecondary} truncate`}>{admin.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className={`${cellStyle} text-left`}>
        {admin.phone ? (
          <div className="flex items-center space-x-2">
            <Phone className={iconOrange} />
            <span className={`text-sm ${textSecondary}`}>{admin.phone}</span>
          </div>
        ) : (
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>N/A</span>
        )}
      </td>

      {/* Added Details */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <User className={iconBlue} />
            <span className={`text-sm ${textSecondary}`}>{admin.createdBy}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className={iconBlue} />
            <span className={`text-sm ${textSecondary}`}>{formatDate(admin.createdAt)}</span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className={`text-center ${cellBorder} border-r`}>
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
          isActive
            ? isDark
              ? "bg-green-900/40 text-green-300 border-green-700"
              : "bg-green-100 text-green-700 border-green-300"
            : isDark
              ? "bg-red-900/40 text-red-300 border-red-700"
              : "bg-red-100 text-red-700 border-red-300"
        }`}>
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

      {/* Actions */}
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
            title="Edit Admin"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          {/* Reset Password Button */}
          <button
            onClick={handleResetPassword}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-yellow-900/50 hover:bg-yellow-800 text-yellow-300"
                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
            }`}
            title="Reset Password"
          >
            <Key className="w-4 h-4" />
          </button>
          
          {/* Status Toggle Button */}
          <button
            onClick={handleToggleStatus}
            disabled={isTogglingStatus}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isTogglingStatus
                ? 'opacity-50 cursor-not-allowed'
                : ''
            } ${
              isActive
                ? isDark
                  ? "bg-red-900/50 hover:bg-red-800 text-red-300"
                  : "bg-red-100 hover:bg-red-200 text-red-700"
                : isDark
                  ? "bg-green-900/50 hover:bg-green-800 text-green-300"
                  : "bg-green-100 hover:bg-green-200 text-green-700"
            }`}
            title={isActive ? "Deactivate Admin" : "Activate Admin"}
          >
            {isTogglingStatus ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Power className="w-4 h-4" />
            )}
          </button>
          
          {/* Permissions Button with Gradient  */}
      <button
        onClick={handleOpenPermissions}
        className="px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25"
        title="Manage Permissions"
      >
        <Lock className="w-4 h-4" />
        <span className="text-xs font-medium">Permissions</span>
      </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminRow;