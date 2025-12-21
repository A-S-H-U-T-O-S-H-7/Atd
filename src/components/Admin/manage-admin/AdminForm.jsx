'use client';
import React, { useState } from 'react';
import { 
  Save, 
  X, 
  User, 
  Key, 
  Mail, 
  Phone, 
  Shield, 
  UserCheck,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-hot-toast';
import { adminSchema,adminTypes, statusOptions } from '@/lib/schema/adminValidationSchema';
import { adminService } from '@/lib/services/AdminServices';

const AdminForm = ({ 
  isDark, 
  onSubmit, 
  initialData = null, 
  isEditMode = false,
  isExpanded = true,
  onToggleExpand 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.selfieUrl || '');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const initialValues = initialData || {
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    type: 'user',
    isActive: '1',
    selfie: null
  };

  // Check username availability
  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    if (isEditMode && username === initialData?.username) {
      setUsernameAvailable(true);
      return;
    }
    
    setCheckingUsername(true);
    try {
      const response = await adminService.checkUsername(username);
      setUsernameAvailable(response.success);
    } catch (error) {
      setUsernameAvailable(false);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG, WebP)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setFieldValue('selfie', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (setFieldValue) => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFieldValue('selfie', null);
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(values).forEach(key => {
        if (key === 'selfie' && values[key] instanceof File) {
          formData.append(key, values[key]);
        } else if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
          formData.append(key, values[key]);
        }
      });

      await onSubmit(formData);
      
      if (!isEditMode) {
        resetForm();
        setSelectedFile(null);
        setPreviewUrl('');
        setUsernameAvailable(null);
      }
      
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
      isDark
        ? 'bg-gray-800 border-purple-600/50 shadow-purple-900/20'
        : 'bg-white border-purple-300 shadow-purple-500/10'
    }`}>
      {/* Form Header */}
      <button
        type="button"
        onClick={onToggleExpand}
        className={`w-full px-6 py-4 flex items-center justify-between border-b transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-purple-600/50 hover:bg-gray-700/50'
            : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 hover:bg-purple-100'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
            <UserCheck className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="text-left">
            <h2 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
              {isEditMode ? 'Edit Admin' : 'Add New Admin'}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {isEditMode ? 'Update admin details' : 'Fill in the admin details'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        )}
      </button>

      {/* Form Body */}
      {isExpanded && (
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={adminSchema}
            onSubmit={handleSubmit}
            enableReinitialize={isEditMode}
          >
            {({ isSubmitting: formikSubmitting, setFieldValue, values, setFieldTouched }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username with availability check */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <User className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Username *</span>
                    </label>
                    <div className="relative">
                      <Field
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        onBlur={(e) => {
                          setFieldTouched('username', true);
                          checkUsername(e.target.value);
                        }}
                        onChange={(e) => {
                          setFieldValue('username', e.target.value);
                          if (usernameAvailable !== null) {
                            setUsernameAvailable(null);
                          }
                        }}
                        className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                          isDark
                            ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 hover:border-purple-500 focus:border-purple-400'
                            : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 hover:border-purple-400 focus:border-purple-500'
                        } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                      />
                      {checkingUsername && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <ErrorMessage name="username">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                    {usernameAvailable !== null && (
                      <div className="flex items-center mt-1 space-x-1">
                        {usernameAvailable ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-500">Username is available</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-500">Username is already taken</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Password (only for add mode) */}
                  {!isEditMode && (
                    <div>
                      <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                        isDark ? 'text-gray-100' : 'text-gray-700'
                      }`}>
                        <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                          <Key className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <span>Password *</span>
                      </label>
                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter password"
                          className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium pr-10 ${
                            isDark
                              ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 hover:border-purple-500 focus:border-purple-400'
                              : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 hover:border-purple-400 focus:border-purple-500'
                          } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <ErrorMessage name="password">
                        {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                      </ErrorMessage>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <User className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Full Name *</span>
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter full name"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 hover:border-purple-500 focus:border-purple-400'
                          : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 hover:border-purple-400 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="name">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Email  */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <Mail className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Email (Optional)</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="admin@example.com"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 hover:border-purple-500 focus:border-purple-400'
                          : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 hover:border-purple-400 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="email">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Phone  */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <Phone className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Phone Number (Optional)</span>
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      placeholder="+91 9876543210"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 hover:border-purple-500 focus:border-purple-400'
                          : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 hover:border-purple-400 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="phone">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Admin Type */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <Shield className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Admin Type *</span>
                    </label>
                    <Field
                      as="select"
                      name="type"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-purple-600/50 text-white hover:border-purple-500 focus:border-purple-400'
                          : 'bg-white border-purple-300 text-gray-900 hover:border-purple-400 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                    >
                      <option value="">Select Type</option>
                      {adminTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="type">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Status */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <UserCheck className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Status *</span>
                    </label>
                    <Field
                      as="select"
                      name="isActive"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-purple-600/50 text-white hover:border-purple-500 focus:border-purple-400'
                          : 'bg-white border-purple-300 text-gray-900 hover:border-purple-400 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="isActive">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Selfie Upload */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <Upload className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Profile Selfie (Optional)</span>
                    </label>
                    
                    <div className={`border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                      isDark
                        ? 'border-purple-600/30 bg-gray-800/50 hover:border-purple-500/50'
                        : 'border-purple-300 bg-purple-50/50 hover:border-purple-400'
                    }`}>
                      <input
                        type="file"
                        id="selfie"
                        name="selfie"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                        className="hidden"
                      />
                      
                      <label
                        htmlFor="selfie"
                        className={`cursor-pointer flex flex-col items-center justify-center p-4 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <div className='flex justify-center items-center gap-2'>
                          <Upload className="w-8 h-8 mb-2 opacity-70" />
                          <div className='flex flex-col'>
                            <span className="text-sm font-medium">
                              {selectedFile || previewUrl ? 'Change Selfie' : 'Click to upload profile selfie'}
                            </span>
                            <span className="text-xs mt-1 opacity-70">
                              JPG, PNG, WebP (Max 5MB)
                            </span>
                          </div>
                        </div>
                      </label>
                      
                      {/* Selfie Preview */}
                      {(selectedFile || previewUrl) && (
                        <div className="mt-4 flex flex-col items-center">
                          <div className="relative">
                            <img 
                              src={previewUrl} 
                              alt="Selfie Preview" 
                              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(setFieldValue)}
                              className={`absolute -top-2 -right-2 p-1 rounded-full ${
                                isDark 
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Existing selfie in edit mode */}
                    {isEditMode && initialData?.selfieUrl && !selectedFile && (
                      <div className="mt-2">
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Existing selfie: <a 
                            href={initialData.selfieUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            View current selfie
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700/50">
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
                    disabled={isSubmitting || formikSubmitting || (usernameAvailable === false && !isEditMode)}
                    className={`px-6 py-2 rounded-lg text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none flex items-center space-x-2 ${
                      isSubmitting || formikSubmitting || (usernameAvailable === false && !isEditMode)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isDark
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:ring-purple-500/50 shadow-lg shadow-purple-500/25'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:ring-purple-500/50 shadow-lg shadow-purple-500/25'
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
                        <span>{isEditMode ? 'Update Admin' : 'Add Admin'}</span>
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

export default AdminForm;