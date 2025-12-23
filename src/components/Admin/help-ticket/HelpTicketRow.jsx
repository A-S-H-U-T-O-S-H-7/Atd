'use client';
import React from 'react';
import { User, Calendar, MessageSquare, Eye } from 'lucide-react';

const TicketRow = ({ ticket, index, isDark, onViewTicket }) => {
  const cellBase = "px-4 py-4 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const iconemerald = `w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`;
  const iconGreen = `w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`;
  const iconPurple = `w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`;

  const normalRowBg = index % 2 === 0
    ? isDark ? "bg-gray-700/30" : "bg-gray-50"
    : "";
  const normalHoverBg = isDark ? "hover:bg-gray-700/50" : "hover:bg-emerald-50/50";

  const getStatusBadge = (status) => {
    const map = {
      'Pending': { color: 'bg-gray-100 text-gray-800', darkColor: 'bg-gray-700 text-gray-300' },
      'Open': { color: 'bg-emerald-100 text-emerald-800', darkColor: 'bg-emerald-700 text-emerald-300' },
      'Process': { color: 'bg-yellow-100 text-yellow-800', darkColor: 'bg-yellow-700 text-yellow-300' },
      'Closed': { color: 'bg-green-100 text-green-800', darkColor: 'bg-green-700 text-green-300' }
    };
    
    const statusInfo = map[status] || map.Pending;
    
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        isDark ? statusInfo.darkColor : statusInfo.color
      }`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const map = {
      'high': { color: 'bg-red-100 text-red-700', darkColor: 'bg-red-700 text-red-300' },
      'medium': { color: 'bg-yellow-100 text-yellow-700', darkColor: 'bg-yellow-700 text-yellow-300' },
      'low': { color: 'bg-green-100 text-green-700', darkColor: 'bg-green-700 text-green-300' }
    };
    
    const priorityInfo = map[priority] || map.medium;
    
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        isDark ? priorityInfo.darkColor : priorityInfo.color
      }`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <tr className={`border-b transition-all duration-200 hover:shadow-lg ${normalRowBg} ${normalHoverBg} ${
      isDark ? "border-emerald-700" : "border-emerald-300"
    }`}>
      
      <td className={`${cellStyle} text-left`}>
        <span className={`font-mono font-bold text-sm ${textPrimary}`}>
          {ticket.ticketId}
        </span>
      </td>

      <td className={`${cellStyle} text-left`}>
        <div className="space-y-1">
          <span className={`font-medium text-sm ${textPrimary} line-clamp-2`}>
            {ticket.subject}
          </span>
        </div>
      </td>

      <td className={`${cellStyle} text-center`}>
        {getPriorityBadge(ticket.priority)}
      </td>

      <td className={`${cellStyle} text-center`}>
        {getStatusBadge(ticket.status)}
      </td>

      <td className={`${cellStyle} text-center`}>
        <span className={`text-sm ${textPrimary}`}>
          {ticket.type?.charAt(0).toUpperCase() + ticket.type?.slice(1)}
        </span>
      </td>

      <td className={`${cellStyle} text-center`}>
        <span className={`text-sm ${textPrimary}`}>
          {ticket.category}
        </span>
      </td>

      <td className={`${cellStyle} text-left`}>
        <div className="flex items-center space-x-2">
          <User className={iconemerald} />
          <span className={`text-sm font-medium ${textPrimary}`}>
            {ticket.createdBy?.name}
          </span>
        </div>
      </td>

      <td className={`${cellStyle} text-left`}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconGreen} />
          <span className={`text-sm ${textSecondary}`}>
            {ticket.createdDate}
          </span>
        </div>
      </td>

      <td className={`${cellStyle} text-center`}>
        <div className="flex items-center justify-center space-x-2">
          <MessageSquare className={iconPurple} />
          <span className={`text-sm font-medium ${textPrimary}`}>
            {ticket.messageCount}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-center">
        <button
          onClick={() => onViewTicket(ticket)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto ${
            isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm">View</span>
        </button>
      </td>
    </tr>
  );
};

export default TicketRow;