'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Paperclip,
  User,
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  CheckCircle,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Edit2,
  Share2,
  Copy,
  MessageSquare,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/lib/schema/ticketSchema';

const TicketDetailsModal = ({
  ticket,
  isDark,
  onClose,
  onUpdateStatus,
  onAssign,
  onAddMessage
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const actionsRef = useRef(null);

  // Color configurations with enhanced gradients
  const colorConfig = {
    status: {
      open: { 
        light: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200',
        dark: 'bg-gradient-to-r from-blue-700/80 to-blue-600/80 text-blue-100 border border-blue-500' 
      },
      in_progress: { 
        light: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200',
        dark: 'bg-gradient-to-r from-yellow-700/80 to-yellow-600/80 text-yellow-100 border border-yellow-500' 
      },
      resolved: { 
        light: 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200',
        dark: 'bg-gradient-to-r from-green-700/80 to-green-600/80 text-green-100 border border-green-500' 
      },
      closed: { 
        light: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200',
        dark: 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-gray-100 border border-gray-500' 
      }
    },
    priority: {
      critical: { 
        light: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200',
        dark: 'bg-gradient-to-r from-red-700/80 to-red-600/80 text-red-100 border border-red-500' 
      },
      high: { 
        light: 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-200',
        dark: 'bg-gradient-to-r from-orange-700/80 to-orange-600/80 text-orange-100 border border-orange-500' 
      },
      medium: { 
        light: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200',
        dark: 'bg-gradient-to-r from-yellow-700/80 to-yellow-600/80 text-yellow-100 border border-yellow-500' 
      },
      low: { 
        light: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200',
        dark: 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-gray-100 border border-gray-500' 
      }
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close actions dropdown if clicked outside
      if (showActions && actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }

      // Close modal if clicked outside
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Escape key handler
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showActions) {
          setShowActions(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showActions, onClose]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size (5MB max)
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== files.length) {
      toast.error('Some files exceed 5MB limit');
    }
    
    // Validate file types
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/zip'
    ];
    
    const typeValidFiles = validFiles.filter(file => allowedTypes.includes(file.type));
    
    if (typeValidFiles.length !== validFiles.length) {
      toast.error('Some files have unsupported formats');
    }
    
    setAttachments(prev => [...prev, ...typeValidFiles]);
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Get file icon with enhanced colors
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4 text-purple-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return <FileText className="w-4 h-4 text-blue-500" />;
    } else if (file.type === 'application/zip') {
      return <FileText className="w-4 h-4 text-yellow-500" />;
    } else if (file.type === 'text/plain') {
      return <FileText className="w-4 h-4 text-gray-500" />;
    } else {
      return <FileText className="w-4 h-4" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle message submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) {
      toast.error('Please enter a message or attach a file');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In real app, you would have current user
      const user = {
        id: 1,
        name: 'Current User',
        email: 'user@example.com'
      };
      
      const messageAttachments = attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file) // In real app, this would be server URL
      }));
      
      await onAddMessage(ticket.id, {
        user,
        message: message.trim(),
        attachments: messageAttachments
      });
      
      // Clear form
      setMessage('');
      setAttachments([]);
      
    } catch (err) {
      // Error already handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Get status color with enhanced styling
  const getStatusColor = (status) => {
    const colors = isDark ? colorConfig.status[status].dark : colorConfig.status[status].light;
    return `${colors} shadow-sm`;
  };

  // Get status label
  const getStatusLabel = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get priority color with enhanced styling
  const getPriorityColor = (priority) => {
    const colors = isDark ? colorConfig.priority[priority].dark : colorConfig.priority[priority].light;
    return `${colors} shadow-sm`;
  };

  // Get priority label
  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Handle status update
  const handleUpdateStatus = async (status) => {
    try {
      await onUpdateStatus(ticket.id, status);
      setShowActions(false);
    } catch (error) {
      // Error handled by parent
    }
  };

  // Handle assignment toggle
  const handleAssignToggle = async () => {
    try {
      await onAssign(ticket.id, ticket.assignedTo ? null : 2); // Toggle assignment
      setShowActions(false);
    } catch (error) {
      // Error handled by parent
    }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={`rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border border-gray-700' 
            : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex rounded-2xl items-center justify-between p-6 border-b ${
          isDark 
            ? 'border-gray-700 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950' 
            : 'border-gray-200 bg-gradient-to-r from-white via-gray-50 to-gray-100'
        }`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className={`text-xl font-bold truncate ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {ticket.subject}
              </h2>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)} <span>{getStatusLabel(ticket.status)}</span>
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getPriorityColor(ticket.priority)}`}>
                <Tag className="w-3 h-3" /> {getPriorityLabel(ticket.priority)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-1">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>ID:</span>
                <span className={`font-mono font-medium ${
                  isDark ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  {ticket.ticketId}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`} />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Created: {formatDate(ticket.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`} />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {ticket.messages?.length || 0} messages
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Status Actions */}
            <div className="relative" ref={actionsRef}>
              <button
                onClick={() => setShowActions(!showActions)}
                className={`p-2 rounded-lg transition-all duration-150 ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showActions && (
                <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="py-1">
                    <div className={`px-3 py-2 text-xs font-semibold ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Change Status
                    </div>
                    <button
                      onClick={() => handleUpdateStatus('open')}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors ${
                        isDark 
                          ? 'hover:bg-blue-600/20 text-gray-300' 
                          : 'hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                      Mark as Open
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('in_progress')}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors ${
                        isDark 
                          ? 'hover:bg-yellow-600/20 text-gray-300' 
                          : 'hover:bg-yellow-50 text-gray-700'
                      }`}
                    >
                      <Clock className="w-4 h-4 text-yellow-500" />
                      Mark as In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('resolved')}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors ${
                        isDark 
                          ? 'hover:bg-green-600/20 text-gray-300' 
                          : 'hover:bg-green-50 text-gray-700'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Mark as Resolved
                    </button>
                    <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <button
                        onClick={handleAssignToggle}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors ${
                          isDark 
                            ? 'hover:bg-purple-600/20 text-gray-300' 
                            : 'hover:bg-purple-50 text-gray-700'
                        }`}
                      >
                        <User className="w-4 h-4 text-purple-500" />
                        {ticket.assignedTo ? 'Unassign Ticket' : 'Assign to Me'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all duration-150 ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Ticket Details */}
          <div className={`w-full rounded-2xl md:w-1/3 border-r ${
            isDark 
              ? 'border-gray-700 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950' 
              : 'border-gray-200 bg-gradient-to-b from-white via-gray-50 to-gray-100'
          } flex flex-col`}>
            <div className="p-6  overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className={`text-sm font-medium mb-3 tracking-wide ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    TICKET DETAILS
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`text-xs font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Description
                      </label>
                      <div className={`mt-1 p-3 rounded-lg ${
                        isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {ticket.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-xs font-medium ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Type
                        </label>
                        <div className={`mt-1 px-3 py-2 rounded-lg ${
                          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                        }`}>
                          <p className={`text-sm font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {ticket.type?.charAt(0).toUpperCase() + ticket.type?.slice(1)}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label className={`text-xs font-medium ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Category
                        </label>
                        <div className={`mt-1 px-3 py-2 rounded-lg ${
                          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                        }`}>
                          <p className={`text-sm font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {ticket.category?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className={`text-xs font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Created By
                      </label>
                      <div className={`flex items-center gap-2 mt-1 p-2 rounded-lg ${
                        isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {ticket.createdBy?.name}
                          </p>
                          <p className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {ticket.createdBy?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {ticket.assignedTo && (
                      <div>
                        <label className={`text-xs font-medium ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Assigned To
                        </label>
                        <div className={`flex items-center gap-2 mt-1 p-2 rounded-lg ${
                          isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDark ? 'bg-blue-700/20' : 'bg-blue-100'
                          }`}>
                            <User className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {ticket.assignedTo.name}
                            </p>
                            <p className={`text-xs ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {ticket.assignedTo.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Original Attachments */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <div>
                        <label className={`text-xs font-medium ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Attachments ({ticket.attachments.length})
                        </label>
                        <div className="mt-2 space-y-2">
                          {ticket.attachments.map((file, index) => (
                            <div key={index} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                              isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                              <div className="flex items-center gap-2">
                                {getFileIcon(file)}
                                <span className="text-sm truncate">{file.name}</span>
                              </div>
                              <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Activity Log */}
                <div>
                  <h3 className={`text-sm font-medium mb-3 tracking-wide ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ACTIVITY LOG
                  </h3>
                  
                  <div className="space-y-3">
                    {ticket.messages
                      .filter(msg => msg.type !== 'message')
                      .map((activity, index) => (
                        <div key={index} className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          isDark 
                            ? 'bg-gradient-to-r from-gray-700/30 to-gray-800/30 hover:from-gray-700/50 hover:to-gray-800/50' 
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200'
                        }`}>
                          <div className={`mt-1 w-2 h-2 rounded-full ${
                            activity.type === 'status_change' ? 'bg-blue-500' :
                            activity.type === 'assignment' ? 'bg-green-500' :
                            'bg-gray-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className={`text-sm ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {activity.message}
                            </p>
                            <p className={`text-xs mt-1 ${
                              isDark ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat/Messages */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto rounded-md p-6 ${
              isDark 
                ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
                : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'
            }`}>
              {ticket.messages.filter(msg => msg.type === 'message').length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className={`p-4 rounded-full mb-4 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <MessageSquare className={`w-16 h-16 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <p className={`text-lg font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No messages yet
                  </p>
                  <p className={`text-sm mt-1 ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Start the conversation by sending a message
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {ticket.messages
                    .filter(msg => msg.type === 'message')
                    .map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${msg.user.id === 1 ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          msg.user.id === 1
                            ? isDark 
                              ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg' 
                              : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'
                            : isDark 
                              ? 'bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg' 
                              : 'bg-gradient-to-br from-gray-200 to-gray-300 shadow-lg'
                        }`}>
                          <User className={`w-5 h-5 ${
                            msg.user.id === 1
                              ? 'text-white'
                              : isDark 
                                ? 'text-gray-300' 
                                : 'text-gray-600'
                          }`} />
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex-1 max-w-[70%] ${
                          msg.user.id === 1 ? 'items-end' : ''
                        }`}>
                          <div className={`rounded-2xl p-4 transition-all shadow-md ${
                            msg.user.id === 1
                              ? isDark
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                              : isDark
                                ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 rounded-bl-none'
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-bl-none'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            
                            {/* Message Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {msg.attachments.map((file, fileIndex) => (
                                  <div
                                    key={fileIndex}
                                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                                      msg.user.id === 1
                                        ? isDark
                                          ? 'bg-blue-700/50 hover:bg-blue-700/70'
                                          : 'bg-blue-400/20 hover:bg-blue-400/30'
                                        : isDark
                                          ? 'bg-gray-600/50 hover:bg-gray-600/70'
                                          : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                  >
                                    {getFileIcon(file)}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{file.name}</p>
                                      <p className="text-xs opacity-75">
                                        {formatFileSize(file.size)}
                                      </p>
                                    </div>
                                    <button className="opacity-75 hover:opacity-100 transition-opacity">
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Message Info */}
                          <div className={`flex items-center gap-2 mt-2 ${
                            msg.user.id === 1 ? 'justify-end' : ''
                          }`}>
                            <span className={`text-xs ${
                              isDark ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {msg.user.name}
                            </span>
                            <span className={`text-xs ${
                              isDark ? 'text-gray-600' : 'text-gray-500'
                            }`}>
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className={`p-6 border-t rounded-2xl ${
              isDark 
                ? 'border-gray-700 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950' 
                : 'border-gray-200 bg-gradient-to-r from-white via-gray-50 to-gray-100'
            }`}>
              {/* Selected Attachments */}
              {attachments.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Attachments ({attachments.length})
                    </span>
                    <button
                      onClick={() => setAttachments([])}
                      className={`text-xs transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:text-gray-300' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          isDark 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate max-w-[150px]">
                            {file.name}
                          </p>
                          <p className="text-xs opacity-75">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className={`p-1 rounded-full transition-colors ${
                            isDark 
                              ? 'hover:bg-gray-600' 
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Form */}
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows="3"
                    className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.txt,.zip"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-3 rounded-xl transition-all duration-150 ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    title="Attach files"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading || (!message.trim() && attachments.length === 0)}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all duration-150 ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isDark
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                    title="Send message"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
              
              {/* Help text */}
              <p className={`text-xs mt-3 ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Max file size: 5MB. Supported formats: Images, PDF, Word, Text, ZIP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;