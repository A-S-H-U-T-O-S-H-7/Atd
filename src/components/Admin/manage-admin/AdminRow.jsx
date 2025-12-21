'use client';
import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  UserCheck, 
  Calendar,
  Edit2,
  Power,
  CheckCircle,
  XCircle,
  Eye,
  Key
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminRow = ({ admin, index, isDark, onEdit, onToggleStatus, onViewPermissions }) => {
  const isActive = admin.isActive === 'yes';

  const cellBase = "px-4 py-4 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const iconBlue = `w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`;
  const iconPurple = `w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`;
  const iconGreen = `w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`;
  const iconOrange = `w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`;
  const iconYellow = `w-4 h-4 ${isDark ? "text-yellow-400" : "text-yellow-600"}`;

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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(admin);
      toast.success('Edit mode enabled');
    }
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
        await onToggleStatus(admin.id);
        toast.success(`Admin ${action}d successfully!`);
      } catch (error) {
        toast.error(`Failed to ${action} admin. Please try again.`);
        console.error('Error toggling admin status:', error);
      }
    }
  };

  const handleViewPermissions = () => {
    if (onViewPermissions) {
      onViewPermissions(admin);
    }
  };

  const handleResetPassword = () => {
    Swal.fire({
      title: 'Reset Password',
      html: `Send password reset link to <strong>${admin.email}</strong>?`,
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
        toast.success('Password reset link sent!');
      }
    });
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
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDark ? 'bg-purple-900/50' : 'bg-purple-100'
            }`}>
              <User className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-medium text-sm ${textPrimary}`}>{admin.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  admin.type === 'Super Admin'
                    ? isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                    : isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  {admin.type}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className={iconBlue} />
                <span className={`text-xs ${textSecondary}`}>{admin.email}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <User className={iconBlue} />
                <span className={`text-xs ${textSecondary}`}>@{admin.username}</span>
              </div>
            </div>
          </div>
        </div>
      </td>

      {/* Contact & IDs */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Phone className={iconOrange} />
            <span className={`text-sm ${textSecondary}`}>{admin.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className={iconPurple} />
            <span className={`text-xs ${textSecondary}`}>Role: {admin.roleId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className={iconGreen} />
            <span className={`text-xs ${textSecondary}`}>Provider: {admin.providerId}</span>
          </div>
        </div>
      </td>

      {/* Added Details */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <User className={iconBlue} />
            <span className={`text-sm ${textSecondary}`}>{admin.addedBy}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className={iconBlue} />
            <span className={`text-sm ${textSecondary}`}>{formatDate(admin.createdAt)}</span>
          </div>
        </div>
      </td>

      {/* Permissions Summary */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className={iconPurple} />
            <span className={`text-sm font-medium ${textPrimary}`}>Access Pages</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {admin.permissions?.slice(0, 4).map((perm, idx) => (
              <span key={idx} className={`px-2 py-1 text-xs rounded-full ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}>
                {perm.page}
              </span>
            ))}
            {admin.permissions?.length > 4 && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                +{admin.permissions.length - 4} more
              </span>
            )}
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
          
          <button
            onClick={handleViewPermissions}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-purple-900/50 hover:bg-purple-800 text-purple-300"
                : "bg-purple-100 hover:bg-purple-200 text-purple-700"
            }`}
            title="View Permissions"
          >
            <Eye className="w-4 h-4" />
          </button>
          
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
          
          <button
            onClick={handleToggleStatus}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer ${
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

export default AdminRow;