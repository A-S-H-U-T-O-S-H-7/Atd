'use client';
import React, { useState } from 'react';
import {
  X,
  Send,
  Paperclip,
  FileText,
  Image as ImageIcon,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ticketSchema, priorityOptions, typeOptions, categoryOptions } from '@/lib/schema/ticketSchema';
import { toast } from 'react-hot-toast';

const TicketForm = ({ isDark, onSubmit, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef(null);

  const initialValues = {
    subject: '',
    description: '',
    priority: 'medium',
    type: 'bug',
    category: 'other',
    attachments: []
  };

  // Handle file selection
  const handleFileSelect = (e, setFieldValue) => {
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
    
    if (typeValidFiles.length + attachments.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }
    
    const newAttachments = [...attachments, ...typeValidFiles];
    setAttachments(newAttachments);
    setFieldValue('attachments', newAttachments);
  };

  // Remove attachment
  const removeAttachment = (index, setFieldValue) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    setFieldValue('attachments', newAttachments);
  };

  // Get file icon
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-4 h-4" />;
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

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    
    try {
      // Prepare form data with files
      const formData = new FormData();
      
      // Add text fields
      Object.keys(values).forEach(key => {
        if (key !== 'attachments') {
          formData.append(key, values[key]);
        }
      });
      
      // Add files
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
      
      await onSubmit(formData);
      resetForm();
      setAttachments([]);
      
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Create New Ticket
            </h2>
            <p className={`text-sm mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Describe your issue or request
            </p>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <Formik
            initialValues={initialValues}
            validationSchema={ticketSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">
                {/* Subject */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Subject *
                  </label>
                  <Field
                    type="text"
                    name="subject"
                    placeholder="Brief summary of the issue"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                  />
                  <ErrorMessage name="subject">
                    {msg => (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {msg}
                      </p>
                    )}
                  </ErrorMessage>
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Detailed description of the issue or request..."
                    rows="6"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 resize-none ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                  />
                  <ErrorMessage name="description">
                    {msg => (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {msg}
                      </p>
                    )}
                  </ErrorMessage>
                </div>

                {/* Priority & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Priority *
                    </label>
                    <Field
                      as="select"
                      name="priority"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="priority">
                      {msg => (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Type *
                    </label>
                    <Field
                      as="select"
                      name="type"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                    >
                      {typeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="type">
                      {msg => (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Category *
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category">
                    {msg => (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {msg}
                      </p>
                    )}
                  </ErrorMessage>
                </div>

                {/* Attachments */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Attachments (Optional)
                  </label>
                  
                  <div className={`border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                    isDark
                      ? 'border-gray-600/30 bg-gray-700/30 hover:border-blue-500/50'
                      : 'border-gray-300 bg-gray-50/50 hover:border-blue-400'
                  }`}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileSelect(e, setFieldValue)}
                      multiple
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.txt,.zip"
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full py-4 flex flex-col items-center justify-center ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <Paperclip className="w-8 h-8 mb-2 opacity-70" />
                      <div className="text-center">
                        <span className="text-sm font-medium">
                          Click to attach files
                        </span>
                        <p className="text-xs mt-1 opacity-70">
                          Max 5 files, 5MB each
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(file)}
                            <div>
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {file.name}
                              </p>
                              <p className="text-xs opacity-75">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index, setFieldValue)}
                            className={`p-1 rounded-full ${
                              isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                            }`}
                          >
                            <XCircle className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700/50">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-lg text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none flex items-center space-x-2 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isDark
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 focus:ring-blue-500/50 shadow-lg shadow-blue-500/25'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 focus:ring-blue-500/50 shadow-lg shadow-blue-500/25'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Create Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;