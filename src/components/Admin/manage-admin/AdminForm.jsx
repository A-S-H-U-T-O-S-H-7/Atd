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
  Settings
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-hot-toast';
import { adminSchema } from '@/lib/schema/adminValidationSchema';

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.photo || '');
  const [permissions, setPermissions] = useState(
    initialData?.permissions || [
      { page: 'Dashboard', actions: ['view'] },
      { page: 'Users', actions: ['view'] },
      { page: 'Reports', actions: ['view'] },
      { page: 'Settings', actions: ['view'] }
    ]
  );

  const initialValues = initialData || {
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: '',
    type: 'Admin',
    roleId: '',
    providerId: '',
    isActive: 'yes',
    photo: null,
    permissions: permissions
  };

  const adminTypes = ['Super Admin', 'Admin'];
  const statusOptions = [
    { value: 'yes', label: 'Active' },
    { value: 'no', label: 'Inactive' }
  ];

  const availablePages = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'users', name: 'Users' },
    { id: 'admins', name: 'Admins' },
    { id: 'reports', name: 'Reports' },
    { id: 'settings', name: 'Settings' },
    { id: 'billing', name: 'Billing' },
    { id: 'analytics', name: 'Analytics' }
  ];

  const availableActions = [
    { id: 'view', name: 'View' },
    { id: 'add', name: 'Add' },
    { id: 'edit', name: 'Edit' },
    { id: 'delete', name: 'Delete' },
    { id: 'export', name: 'Export' },
    { id: 'approve', name: 'Approve' }
  ];

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
      setFieldValue('photo', file);
      
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
    setFieldValue('photo', null);
  };

  const handlePermissionChange = (pageIndex, action, checked) => {
    const newPermissions = [...permissions];
    if (checked) {
      if (!newPermissions[pageIndex].actions.includes(action)) {
        newPermissions[pageIndex].actions.push(action);
      }
    } else {
      newPermissions[pageIndex].actions = newPermissions[pageIndex].actions.filter(a => a !== action);
    }
    setPermissions(newPermissions);
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(values).forEach(key => {
        if (key === 'photo' && values[key] instanceof File) {
          formData.append(key, values[key]);
        } else if (key === 'permissions') {
          formData.append(key, JSON.stringify(permissions));
        } else if (key !== 'confirmPassword') {
          formData.append(key, values[key]);
        }
      });

      await onSubmit(formData);
      
      if (!isEditMode) {
        resetForm();
        setSelectedFile(null);
        setPreviewUrl('');
        setPermissions([
          { page: 'Dashboard', actions: ['view'] },
          { page: 'Users', actions: ['view'] },
          { page: 'Reports', actions: ['view'] },
          { page: 'Settings', actions: ['view'] }
        ]);
      }
      
      toast.success(isEditMode ? 'Admin updated!' : 'Admin added!');
      
    } catch (error) {
      toast.error(error.message || 'Failed to save admin');
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
              {isEditMode ? 'Update admin details and permissions' : 'Fill in the admin details and set permissions'}
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
            {({ isSubmitting: formikSubmitting, setFieldValue, values }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <User className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Username *</span>
                    </label>
                    <Field
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 hover:border-purple-500 focus:border-purple-400'
                          : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 hover:border-purple-400 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="username">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Password */}
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

                  {/* Confirm Password */}
                  {!isEditMode && (
                    <div>
                      <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                        isDark ? 'text-gray-100' : 'text-gray-700'
                      }`}>
                        <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                          <Key className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <span>Confirm Password *</span>
                      </label>
                      <div className="relative">
                        <Field
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm password"
                          className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium pr-10 ${
                            isDark
                              ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 hover:border-purple-500 focus:border-purple-400'
                              : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 hover:border-purple-400 focus:border-purple-500'
                          } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword">
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

                  {/* Email */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <Mail className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Email *</span>
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

                  {/* Phone */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <Phone className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Phone Number *</span>
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
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="type">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Role ID */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <Shield className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Role ID *</span>
                    </label>
                    <Field
                      type="text"
                      name="roleId"
                      placeholder="Enter role ID"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 hover:border-purple-500 focus:border-purple-400'
                          : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 hover:border-purple-400 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="roleId">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Provider ID */}
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <User className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Provider ID *</span>
                    </label>
                    <Field
                      type="text"
                      name="providerId"
                      placeholder="Enter provider ID"
                      className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                        isDark
                          ? 'bg-gray-800 border-purple-600/50 text-white placeholder-gray-400 hover:border-purple-500 focus:border-purple-400'
                          : 'bg-white border-purple-300 text-gray-900 placeholder-gray-500 hover:border-purple-400 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                    />
                    <ErrorMessage name="providerId">
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

                  {/* Photo Upload */}
                  <div className="md:col-span-2">
                    <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <Upload className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span>Profile Photo (Optional)</span>
                    </label>
                    
                    <div className={`border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                      isDark
                        ? 'border-purple-600/30 bg-gray-800/50 hover:border-purple-500/50'
                        : 'border-purple-300 bg-purple-50/50 hover:border-purple-400'
                    }`}>
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                        className="hidden"
                      />
                      
                      <label
                        htmlFor="photo"
                        className={`cursor-pointer flex flex-col items-center justify-center p-4 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <div className='flex justify-center items-center gap-2'>
                          <Upload className="w-8 h-8 mb-2 opacity-70" />
                          <div className='flex flex-col'>
                            <span className="text-sm font-medium">
                              {selectedFile || previewUrl ? 'Change Photo' : 'Click to upload profile photo'}
                            </span>
                            <span className="text-xs mt-1 opacity-70">
                              JPG, PNG, WebP (Max 5MB)
                            </span>
                          </div>
                        </div>
                      </label>
                      
                      {/* Photo Preview */}
                      {(selectedFile || previewUrl) && (
                        <div className="mt-4 flex flex-col items-center">
                          <div className="relative">
                            <img 
                              src={previewUrl} 
                              alt="Profile Preview" 
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
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center space-x-2 mb-4">
                    <Settings className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h3 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                      Page Permissions
                    </h3>
                  </div>
                  
                  <div className={`rounded-lg border ${
                    isDark ? 'border-purple-600/30 bg-gray-800/50' : 'border-purple-300 bg-purple-50/50'
                  } p-4`}>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max">
                        <thead>
                          <tr className={`border-b ${
                            isDark ? 'border-purple-600/20' : 'border-purple-300/50'
                          }`}>
                            <th className={`py-3 px-4 text-left font-semibold ${
                              isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>Page</th>
                            {availableActions.map(action => (
                              <th key={action.id} className={`py-3 px-2 text-center font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                              }`}>{action.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {availablePages.map((page, pageIndex) => {
                            const currentPerm = permissions.find(p => p.page === page.name) || { actions: [] };
                            return (
                              <tr key={page.id} className={`border-b ${
                                isDark ? 'border-purple-600/10' : 'border-purple-300/20'
                              }`}>
                                <td className={`py-3 px-4 ${
                                  isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>{page.name}</td>
                                {availableActions.map(action => (
                                  <td key={action.id} className="py-3 px-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={currentPerm.actions.includes(action.id)}
                                      onChange={(e) => handlePermissionChange(
                                        permissions.findIndex(p => p.page === page.name),
                                        action.id,
                                        e.target.checked
                                      )}
                                      className={`w-5 h-5 rounded cursor-pointer ${
                                        isDark
                                          ? 'bg-gray-700 border-purple-500 text-purple-500'
                                          : 'bg-white border-purple-400 text-purple-600'
                                      }`}
                                    />
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => {
                          const allPermissions = availablePages.map(page => ({
                            page: page.name,
                            actions: availableActions.map(a => a.id)
                          }));
                          setPermissions(allPermissions);
                        }}
                        className={`px-3 py-1.5 text-sm rounded-lg ${
                          isDark
                            ? 'bg-purple-900/50 hover:bg-purple-800 text-purple-300'
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                        }`}
                      >
                        Select All
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const resetPermissions = availablePages.map(page => ({
                            page: page.name,
                            actions: ['view']
                          }));
                          setPermissions(resetPermissions);
                        }}
                        className={`px-3 py-1.5 text-sm rounded-lg ${
                          isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Reset to View Only
                      </button>
                    </div>
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
                    disabled={isSubmitting || formikSubmitting}
                    className={`px-6 py-2 rounded-lg text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none flex items-center space-x-2 ${
                      isSubmitting || formikSubmitting
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