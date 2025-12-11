'use client';
import React, { useState } from 'react';
import { 
  Save, 
  X, 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  Upload,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

// Validation Schema
const advocateSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .trim(),
  court: Yup.string()
    .required('Court name is required')
    .trim(),
  address: Yup.string()
    .required('Address is required')
    .trim(),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\s,]+$/, 'Please enter valid phone number(s)')
    .trim(),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
  licence_no: Yup.string()
    .required('Licence number is required')
    .trim(),
  letterhead: Yup.mixed()
    .nullable()
});

const AdvocateForm = ({ 
  isDark, 
  onSubmit, 
  initialData = null, 
  isEditMode = false,
  isExpanded = true,
  onToggleExpand 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.letterhead_url || '');

  const initialValues = initialData || {
    name: '',
    court: '',
    address: '',
    phone: '',
    email: '',
    licence_no: '',
    letterhead: null
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid file (JPG, PNG, WebP, PDF)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setFieldValue('letterhead', file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreviewUrl('/pdf-icon.png'); // You can use a PDF icon here
      }
    }
  };

  const removeFile = (setFieldValue) => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFieldValue('letterhead', null);
  };

  const handleSubmit = async (values, { resetForm }) => {
  setIsSubmitting(true);
  setServerError('');
  
  try {
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(values).forEach(key => {
      const value = values[key];
      
      // Skip empty values
      if (!value && value !== 0 && value !== false) return;
      
      // API expects 'letter_head' for file upload
      if (key === 'letterhead' && value instanceof File) {
        formData.append('letter_head', value);
      } else {
        formData.append(key, value);
      }
    });
    
    await onSubmit(formData);
    
    // Reset form for new entries
    if (!isEditMode) {
      resetForm();
      setSelectedFile(null);
      setPreviewUrl('');
    }
    
    toast.success(isEditMode ? 'Advocate updated!' : 'Advocate added!');
    
  } catch (error) {
    let errorMessage = 'Failed to save advocate';
    
    // Extract error from API response
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0]?.[0];
      errorMessage = firstError || error.response.data.message || errorMessage;
    } 
    else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
      isDark
        ? 'bg-gray-800 border-emerald-600/50 shadow-emerald-900/20'
        : 'bg-white border-emerald-300 shadow-emerald-500/10'
    }`}>
      {/* Form Header - Toggle Button */}
      <button
        type="button"
        onClick={onToggleExpand}
        className={`w-full px-6 py-4 flex items-center justify-between border-b transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50 hover:bg-gray-700/50'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 hover:bg-emerald-100'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
            <User className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <div className="text-left">
            <h2 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
              {isEditMode ? 'Edit Advocate' : 'Add New Advocate'}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {isEditMode ? 'Update advocate details' : 'Fill in the advocate details'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        )}
      </button>

      {/* Form Body - Collapsible */}
      {isExpanded && (
        <div className="p-6">
          {/* Server Error Display */}
          {serverError && (
            <div className={`mb-6 p-4 rounded-lg border ${
              isDark 
                ? 'bg-red-900/20 border-red-600/50 text-red-200' 
                : 'bg-red-50 border-red-300 text-red-700'
            }`}>
              <div className="font-medium mb-2">Please fix the following errors:</div>
              <div className="text-sm">{serverError}</div>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={advocateSchema}
            onSubmit={handleSubmit}
            enableReinitialize={isEditMode}
          >
            {({ isSubmitting: formikSubmitting, setFieldValue, values }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                        <User className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <span>Full Name *</span>
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter advocate full name"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400'
                          : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
                      } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="name">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Court Field */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                        <Building className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <span>Court *</span>
                    </label>
                    <Field
                      type="text"
                      name="court"
                      placeholder="e.g., Supreme Court of India"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400'
                          : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
                      } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="court">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Address Field */}
                  <div className="md:col-span-2">
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                        <MapPin className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <span>Address *</span>
                    </label>
                    <Field
                      as="textarea"
                      name="address"
                      placeholder="Enter complete address"
                      rows="3"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400'
                          : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
                      } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none`}
                    />
                    <ErrorMessage name="address">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                        <Phone className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <span>Phone Number(s) *</span>
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      placeholder="e.g., 7011343806, 9999589227"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400'
                          : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
                      } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="phone">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Multiple numbers can be separated by commas
                    </p>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                        <Mail className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <span>Email *</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="advocate@example.com"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400'
                          : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
                      } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="email">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Licence Number Field */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                        <FileText className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <span>Licence Number *</span>
                    </label>
                    <Field
                      type="text"
                      name="licence_no"
                      placeholder="e.g., D-1178/2024"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400'
                          : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
                      } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="licence_no">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Letterhead Upload Field */}
                  <div >
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                        <Upload className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <span>Letterhead (Optional)</span>
                    </label>
                    
                    {/* File Input */}
                    <div className={`border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                      isDark
                        ? 'border-emerald-600/30 bg-gray-800/50 hover:border-emerald-500/50'
                        : 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-400'
                    }`}>
                      <input
                        type="file"
                        id="letterhead"
                        name="letterhead"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                        className="hidden"
                      />
                      
                      <label
                        htmlFor="letterhead"
                        className={`cursor-pointer flex flex-col items-center justify-center p-4 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <div className='flex justify-center items-center gap-2'>
                        <Upload className="w-8 h-8 mb-2 opacity-70" />
                        <div className='flex flex-col'>
                        <span className="text-sm font-medium">
                          {selectedFile || previewUrl ? 'Change File' : 'Click to upload letterhead'}
                        </span>
                        <span className="text-xs mt-1 opacity-70">
                          JPG, PNG, WebP or PDF (Max 5MB)
                        </span>
                        </div>
                        </div>
                      </label>
                      
                      {/* File Preview */}
                      {(selectedFile || previewUrl) && (
                        <div className="mt-4 p-3 rounded-lg bg-gray-700/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5" />
                              <div>
                                <p className="text-sm font-medium">
                                  {selectedFile?.name || 'Uploaded file'}
                                </p>
                                <p className="text-xs opacity-70">
                                  {selectedFile?.type?.startsWith('image/') ? 'Image' : 'PDF'} • {
                                    selectedFile ? 
                                    `${(selectedFile.size / 1024).toFixed(1)} KB` : 
                                    'Uploaded'
                                  }
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(setFieldValue)}
                              className={`p-1 rounded-full ${
                                isDark 
                                  ? 'hover:bg-gray-700 text-gray-300' 
                                  : 'hover:bg-gray-200 text-gray-600'
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Image Preview */}
                          {previewUrl && previewUrl.startsWith('data:image/') && (
                            <div className="mt-3 flex justify-center">
                              <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="max-h-48 rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <ErrorMessage name="letterhead">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                    
                    {/* Existing letterhead in edit mode */}
                    {isEditMode && initialData?.letterhead_url && !selectedFile && (
                      <div className="mt-2">
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Existing letterhead: <a 
                            href={initialData.letterhead_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline"
                          >
                            View current letterhead
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700/50">
                  <button
                    type="button"
                    onClick={onToggleExpand}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <X className="w-4 h-4 inline mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || formikSubmitting}
                    className={`px-6 py-2 rounded-lg text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none flex items-center space-x-2 ${
                      isSubmitting || formikSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isDark
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25'
                    }`}
                  >
                    {isSubmitting || formikSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isEditMode ? 'Update Advocate' : 'Add Advocate'}</span>
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default AdvocateForm;