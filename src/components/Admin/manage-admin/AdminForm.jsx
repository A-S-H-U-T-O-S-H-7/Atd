'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Save, X, User, Key, Mail, Phone, Shield, UserCheck, Upload, ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { adminService } from '@/lib/services/AdminServices';

const adminSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  password: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  name: Yup.string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: Yup.string()
    .email('Please enter a valid email address')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  phone: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .matches(/^[0-9+\s()-]*$/, 'Please enter a valid phone number'),
  type: Yup.string()
    .required('Admin type is required')
    .oneOf(['user', 'verifier', 'account', 'manager', 'admin', 'superadmin', 'collection', 'agency']),
  isActive: Yup.string().required('Status is required').oneOf(['1', '0']),
  selfie: Yup.mixed()
    .nullable()
    .test('fileSize', 'File too large', (value) => !value || !(value instanceof File) || value.size <= 5 * 1024 * 1024)
    .test('fileType', 'Unsupported file format', (value) => !value || !(value instanceof File) || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(value.type))
});

const adminTypes = [
  { value: 'user', label: 'User' },
  { value: 'verifier', label: 'Verifier' },
  { value: 'account', label: 'Account' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'collection', label: 'Collection' },
  { value: 'agency', label: 'Agency' }
];

const statusOptions = [
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' }
];

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
  const [previewUrl, setPreviewUrl] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const fileInputRef = useRef(null);

  const getInitialValues = () => {
    if (initialData) {
      return {
        username: initialData.username || '',
        password: '',
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        type: initialData.type || 'user',
        isActive: initialData.isActive ? '1' : '0',
        selfie: null
      };
    }
    return {
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      type: 'user',
      isActive: '1',
      selfie: null
    };
  };

  useEffect(() => {
    if (initialData?.selfieUrl) {
      setPreviewUrl(initialData.selfieUrl);
    } else {
      setPreviewUrl('');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setUsernameAvailable(null);
    setBackendErrors({});
  }, [initialData]);

  useEffect(() => {
    if (!isExpanded) {
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setBackendErrors({});
    }
  }, [isExpanded]);

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: adminSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await handleSubmit(values);
    }
  });

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
      if (response.success) {
        // Clear backend error if username becomes available
        setBackendErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.username;
          return newErrors;
        });
      }
    } catch (error) {
      setUsernameAvailable(false);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG, WebP)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      formik.setFieldValue('selfie', file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    formik.setFieldValue('selfie', null);
    setPreviewUrl('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (isEditMode && initialData?.selfieUrl) {
      setPreviewUrl(initialData.selfieUrl);
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setBackendErrors({});
    
    try {
      const formData = new FormData();
      
      formData.append('username', values.username || '');
      formData.append('name', values.name || '');
      formData.append('type', values.type || 'user');
      formData.append('isActive', values.isActive || '1');
      formData.append('email', values.email || '');
      formData.append('phone', values.phone || '');
      
      // Only append password if it's provided
      if (values.password) {
        formData.append('password', values.password);
      }
      
      if (values.selfie instanceof File) {
        formData.append('selfie', values.selfie);
      }
      
      await onSubmit(formData);
      
      if (!isEditMode) {
        formik.resetForm();
        setPreviewUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setUsernameAvailable(null);
      }
      
    } catch (error) {
      // Handle 422 validation errors
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors || {};
        setBackendErrors(errors);
        
        // Show toast for each error
        Object.values(errors).flat().forEach(errorMessage => {
          toast.error(errorMessage, { duration: 5000 });
        });
      } else {
        toast.error(error.message || 'An error occurred');
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameBlur = (e) => {
    formik.handleBlur(e);
    checkUsername(e.target.value);
  };

  const handleUsernameChange = (e) => {
    formik.handleChange(e);
    if (usernameAvailable !== null) {
      setUsernameAvailable(null);
    }
    // Clear backend error when user starts typing
    if (backendErrors.username) {
      setBackendErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.username;
        return newErrors;
      });
    }
  };

  const handleFieldChange = (e) => {
    formik.handleChange(e);
    // Clear backend error for this field when user starts typing
    const fieldName = e.target.name;
    if (backendErrors[fieldName]) {
      setBackendErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Helper function to get error message for a field
  const getErrorMessage = (fieldName) => {
    const formikError = formik.touched[fieldName] && formik.errors[fieldName];
    const backendError = backendErrors[fieldName]?.[0];
    
    return backendError || formikError;
  };

  const inputClasses = `w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${
    isDark
      ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400'
      : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
  }`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
      isDark
        ? 'bg-gray-800 border-emerald-600/50 shadow-emerald-900/20'
        : 'bg-white border-emerald-300 shadow-emerald-500/10'
    }`}>
      <button
        type="button"
        onClick={onToggleExpand}
        className={`w-full px-6 py-4 flex items-center justify-between border-b transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50 hover:bg-gray-700/50'
            : 'bg-gradient-to-r from-emerald-50 to-emerald-50/80 border-emerald-300 hover:bg-emerald-100'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
            <UserCheck className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
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

      {isExpanded && (
        <div className="p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span>Username *</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameBlur}
                    placeholder="Enter username"
                    className={`${inputClasses} ${getErrorMessage('username') ? 'border-red-500' : ''}`}
                  />
                  {checkingUsername && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {getErrorMessage('username') && (
                  <p className="mt-1 text-xs text-red-500">{getErrorMessage('username')}</p>
                )}
                {!getErrorMessage('username') && usernameAvailable !== null && (
                  <div className="flex items-center mt-1 space-x-1">
                    {usernameAvailable ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-emerald-500">Username is available</span>
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

              {/* Password field - always shown, but optional in edit mode */}
              <div>
                <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                    <Key className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span>
                    Password {!isEditMode ? '* ' : ''}
                    {isEditMode && <span className="text-xs font-normal opacity-70">(Optional)</span>}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={handleFieldChange}
                    onBlur={formik.handleBlur}
                    placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
                    className={`${inputClasses} pr-10 ${getErrorMessage('password') ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {getErrorMessage('password') && (
                  <p className="mt-1 text-xs text-red-500">{getErrorMessage('password')}</p>
                )}
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={handleFieldChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter full name"
                  className={`${inputClasses} ${getErrorMessage('name') ? 'border-red-500' : ''}`}
                />
                {getErrorMessage('name') && (
                  <p className="mt-1 text-xs text-red-500">{getErrorMessage('name')}</p>
                )}
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                    <Mail className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email || ''}
                  onChange={handleFieldChange}
                  onBlur={formik.handleBlur}
                  placeholder="admin@example.com"
                  className={`${inputClasses} ${getErrorMessage('email') ? 'border-red-500' : ''}`}
                />
                {getErrorMessage('email') && (
                  <p className="mt-1 text-xs text-red-500">{getErrorMessage('email')}</p>
                )}
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                    <Phone className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formik.values.phone || ''}
                  onChange={handleFieldChange}
                  onBlur={formik.handleBlur}
                  placeholder="+91 9876543210"
                  className={`${inputClasses} ${getErrorMessage('phone') ? 'border-red-500' : ''}`}
                />
                {getErrorMessage('phone') && (
                  <p className="mt-1 text-xs text-red-500">{getErrorMessage('phone')}</p>
                )}
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                    <Shield className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span>Admin Type *</span>
                </label>
                <select
                  name="type"
                  value={formik.values.type}
                  onChange={handleFieldChange}
                  onBlur={formik.handleBlur}
                  className={`${inputClasses} ${getErrorMessage('type') ? 'border-red-500' : ''}`}
                >
                  {adminTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {getErrorMessage('type') && (
                  <p className="mt-1 text-xs text-red-500">{getErrorMessage('type')}</p>
                )}
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                    <UserCheck className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span>Status *</span>
                </label>
                <select
                  name="isActive"
                  value={formik.values.isActive}
                  onChange={handleFieldChange}
                  onBlur={formik.handleBlur}
                  className={`${inputClasses} ${getErrorMessage('isActive') ? 'border-red-500' : ''}`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {getErrorMessage('isActive') && (
                  <p className="mt-1 text-xs text-red-500">{getErrorMessage('isActive')}</p>
                )}
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                    <Upload className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span>Profile Selfie (Optional)</span>
                </label>
                
                <div className={`border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                  isDark
                    ? 'border-emerald-600/30 bg-gray-800/50 hover:border-emerald-500/50'
                    : 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-400'
                }`}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="selfie"
                    name="selfie"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
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
                          {previewUrl ? 'Change Selfie' : 'Click to upload profile selfie'}
                        </span>
                        <span className="text-xs mt-1 opacity-70">
                          JPG, PNG, WebP (Max 5MB)
                        </span>
                      </div>
                    </div>
                  </label>
                  
                  {previewUrl && (
                    <div className="mt-4 flex flex-col items-center">
                      <div className="relative">
                        <img 
                          src={previewUrl} 
                          alt="Selfie Preview" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={removeFile}
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

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700/50">
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl('');
                  setUsernameAvailable(null);
                  setBackendErrors({});
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  onToggleExpand();
                }}
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
                disabled={isSubmitting || (usernameAvailable === false && !isEditMode)}
                className={`px-6 py-2 rounded-lg text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none flex items-center space-x-2 ${
                  isSubmitting || (usernameAvailable === false && !isEditMode)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDark
                    ? 'bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25'
                }`}
              >
                {isSubmitting ? (
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
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminForm;