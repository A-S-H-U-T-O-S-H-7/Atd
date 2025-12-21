'use client';
import React from 'react';
import {
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Tag,
  Eye
} from 'lucide-react';

const TicketRow = ({ ticket, index, isDark, onViewTicket }) => {
  const cellBase = "px-4 py-4 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const iconBlue = `w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`;
  const iconGreen = `w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`;
  const iconOrange = `w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`;
  const iconPurple = `w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`;

  const normalRowBg = index % 2 === 0
    ? isDark ? "bg-gray-700/30" : "bg-gray-50"
    : "";
  const normalHoverBg = isDark ? "hover:bg-gray-700/50" : "hover:bg-blue-50/50";

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      'open': {
        label: 'Open',
        color: isDark ? 'bg-blue-700 text-blue-300' : 'bg-blue-100 text-blue-700',
        icon: <AlertCircle className="w-3 h-3" />
      },
      'in_progress': {
        label: 'In Progress',
        color: isDark ? 'bg-yellow-700 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
        icon: <Clock className="w-3 h-3" />
      },
      'resolved': {
        label: 'Resolved',
        color: isDark ? 'bg-green-700 text-green-300' : 'bg-green-100 text-green-700',
        icon: <CheckCircle className="w-3 h-3" />
      },
      'closed': {
        label: 'Closed',
        color: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
        icon: <CheckCircle className="w-3 h-3" />
      }
    };

    const statusInfo = statusMap[status] || statusMap.open;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.icon}
        <span>{statusInfo.label}</span>
      </span>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'critical': {
        label: 'Critical',
        color: isDark ? 'bg-red-700 text-red-300' : 'bg-red-100 text-red-700',
        icon: <AlertTriangle className="w-3 h-3" />
      },
      'high': {
        label: 'High',
        color: isDark ? 'bg-orange-700 text-orange-300' : 'bg-orange-100 text-orange-700',
        icon: <AlertCircle className="w-3 h-3" />
      },
      'medium': {
        label: 'Medium',
        color: isDark ? 'bg-yellow-700 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
        icon: <Info className="w-3 h-3" />
      },
      'low': {
        label: 'Low',
        color: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
        icon: <Info className="w-3 h-3" />
      }
    };

    const priorityInfo = priorityMap[priority] || priorityMap.medium;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${priorityInfo.color}`}>
        {priorityInfo.icon}
        <span>{priorityInfo.label}</span>
      </span>
    );
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const typeLabel = type?.charAt(0).toUpperCase() + type?.slice(1) || 'Bug';
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        isDark ? 'bg-purple-700 text-purple-300' : 'bg-purple-100 text-purple-700'
      }`}>
        <Tag className="w-3 h-3" />
        <span>{typeLabel}</span>
      </span>
    );
  };

  return (
    <tr className={`border-b transition-all duration-200 hover:shadow-lg ${normalRowBg} ${normalHoverBg} ${
      isDark ? "border-blue-700" : "border-blue-300"
    }`}>
      
      {/* Ticket ID */}
      <td className={`${cellStyle} text-left`}>
        <div className="flex items-center space-x-2">
          <span className={`font-mono font-bold text-sm ${textPrimary}`}>
            {ticket.ticketId}
          </span>
        </div>
      </td>

      {/* Subject */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-1">
          <span className={`font-medium text-sm ${textPrimary} line-clamp-2`}>
            {ticket.subject}
          </span>
          <p className={`text-xs ${textSecondary} line-clamp-2`}>
            {ticket.description?.substring(0, 80)}...
          </p>
        </div>
      </td>

      {/* Priority */}
      <td className={`${cellStyle} text-center`}>
        {getPriorityBadge(ticket.priority)}
      </td>

      {/* Status */}
      <td className={`${cellStyle} text-center`}>
        {getStatusBadge(ticket.status)}
      </td>

      {/* Type */}
      <td className={`${cellStyle} text-center`}>
        {getTypeBadge(ticket.type)}
      </td>

      {/* Created By */}
      <td className={`${cellStyle} text-left`}>
        <div className="flex items-center space-x-2">
          <User className={iconBlue} />
          <div>
            <span className={`text-sm font-medium ${textPrimary}`}>
              {ticket.createdBy?.name}
            </span>
            <p className={`text-xs ${textSecondary}`}>
              {ticket.createdBy?.email}
            </p>
          </div>
        </div>
      </td>

      {/* Created Date */}
      <td className={`${cellStyle} text-left`}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconGreen} />
          <span className={`text-sm ${textSecondary}`}>
            {ticket.createdDate}
          </span>
        </div>
      </td>

      {/* Messages Count */}
      <td className={`${cellStyle} text-center`}>
        <div className="flex items-center justify-center space-x-2">
          <MessageSquare className={iconPurple} />
          <span className={`text-sm font-medium ${textPrimary}`}>
            {ticket.messageCount}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center">
        <button
          onClick={() => onViewTicket(ticket)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto ${
            isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm">View</span>
        </button>
      </td>
    </tr>
  );
};

export default TicketRow;