'use client';
import React from 'react';
import { 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Calendar,
  Edit2,
  Power,
  CheckCircle,
  XCircle,
  File
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { RxFileText } from 'react-icons/rx';

const AdvocateRow = ({ advocate, index, isDark, onEdit, onToggleStatus, onViewLetterhead }) => {
  const isActive = advocate.isActive === true || advocate.isActive === 1;

  const cellBase = "px-4 py-4 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const iconBlue = `w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`;
  const iconGreen = `w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`;
  const iconPurple = `w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`;
  const iconOrange = `w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`;
  const iconYellow = `w-4 h-4 ${isDark ? "text-yellow-400" : "text-yellow-600"}`;

  const normalRowBg = index % 2 === 0
    ? isDark ? "bg-gray-700/30" : "bg-gray-50"
    : "";
  const normalHoverBg = isDark ? "hover:bg-gray-700/50" : "hover:bg-emerald-50/50";

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
      onEdit(advocate);
      toast.success('Edit mode enabled');
    }
  };

  const handleToggleStatus = async () => {
    if (!onToggleStatus || !advocate.id) return;
    
    const action = isActive ? 'deactivate' : 'activate';
    const actionText = isActive ? 'Deactivate' : 'Activate';
    const advocateName = advocate.name || 'this advocate';
    
    const result = await Swal.fire({
      title: `${actionText} Advocate`,
      html: `Are you sure you want to ${action} <strong>${advocateName}</strong>?`,
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
        await onToggleStatus(advocate.id);
        toast.success(`Advocate ${action}d successfully!`);
      } catch (error) {
        toast.error(`Failed to ${action} advocate. Please try again.`);
        console.error('Error toggling advocate status:', error);
      }
    }
  };

  const handleViewLetterhead = () => {
    if (advocate.letterheadUrl) {
      onViewLetterhead(advocate.letterheadUrl);
    } else {
      toast.info('No letterhead file available');
    }
  };

  return (
    <tr className={`border-b transition-all duration-200 hover:shadow-lg ${normalRowBg} ${normalHoverBg} ${
      isDark ? "border-emerald-700" : "border-emerald-300"
    }`}>
      
      {/* S.No */}
      <td className={`${cellStyle} text-left`}>
        <span className={`font-medium ${textPrimary}`}>{index + 1}</span>
      </td>

      {/* Name and Email */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className={iconBlue} />
            <span className={`font-medium text-sm ${textPrimary}`}>{advocate.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className={iconBlue} />
            <span className={`text-sm ${textSecondary}`}>{advocate.email}</span>
          </div>
        </div>
      </td>

      {/* Court */}
      <td className={`${cellStyle} text-left`}>
        <div className="flex items-start space-x-2">
          <Building className={iconGreen} />
          <span className={`text-sm ${textSecondary}`}>{advocate.court}</span>
        </div>
      </td>

      {/* Address */}
      <td className={`${cellStyle} text-left`}>
        <div className="flex items-start space-x-2">
          <MapPin className={iconPurple} />
          <div className="flex-1">
            <p className={`text-sm ${textSecondary}`}>
              {advocate.address && advocate.address.length > 100 
                ? `${advocate.address.substring(0, 100)}...` 
                : advocate.address || 'N/A'}
            </p>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className={`${cellStyle} text-left`}>
        {advocate.phone ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Phone className={iconOrange} />
              <span className={`text-sm font-medium ${textSecondary}`}>
                {advocate.phone.split(',')[0].trim()}
              </span>
            </div>
            
            {advocate.phone.split(',').length > 1 && (
              <div className="pl-6 space-y-1">
                {advocate.phone.split(',').slice(1, 3).map((phoneNumber, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className={`text-sm ${textSecondary}`}>{phoneNumber.trim()}</span>
                  </div>
                ))}
                
                {advocate.phone.split(',').length > 3 && (
                  <div className="text-xs italic mt-1">
                    +{advocate.phone.split(',').length - 3} more numbers
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Phone className={iconOrange} />
            <span className={`text-sm ${textSecondary}`}>N/A</span>
          </div>
        )}
      </td>

      {/* Licence No */}
      <td className={`${cellStyle} text-left`}>
        <div className="flex items-center space-x-2">
          <FileText className={iconYellow} />
          <span className={`text-sm font-medium ${textSecondary}`}>{advocate.licenceNo}</span>
        </div>
      </td>

      {/* Letterhead */}
      <td className={`${cellStyle} text-center`}>
        <div className="flex justify-center">
          {advocate.letterheadUrl ? (
            <button
              onClick={handleViewLetterhead}
              className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 flex items-center justify-center ${
                isDark
                  ? "bg-purple-900/30 hover:bg-purple-800/50 text-purple-300 border border-purple-700/50"
                  : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
              }`}
              title="View Letterhead"
            >
              <RxFileText className="w-4 h-4 mr-1" />
              <span className="text-xs">View</span>
            </button>
          ) : (
            <div className={`p-2 rounded-lg ${isDark ? "bg-gray-800/50" : "bg-gray-100"}`}>
              <span className={`text-xs ${textSecondary} italic`}>No file</span>
            </div>
          )}
        </div>
      </td>

      {/* Added By & Date */}
      <td className={`border-r ${cellBorder} text-center`}>
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <User className={iconBlue} />
            <span className={`text-xs ${textSecondary}`}>By: {advocate.addedBy}</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Calendar className={iconBlue} />
            <span className={`text-xs ${textSecondary}`}>{formatDate(advocate.createdAt)}</span>
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
            title="Edit Advocate"
          >
            <Edit2 className="w-4 h-4" />
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

export default AdvocateRow;