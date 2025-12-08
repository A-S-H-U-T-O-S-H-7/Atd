'use client';
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  AlertCircle, 
  X, 
  FileText, 
  File,
  Image,
  FileType
} from 'lucide-react';
import ComplaintFormFields from './ComplaintsFormFields';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { complaintService } from '@/lib/services/ComplaintService';
import { toast } from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const complaintSchema = Yup.object().shape({
  loanAcNo: Yup.string()
    .required('Loan account number is required')
    .trim(),
  complaintDate: Yup.date()
    .required('Complaint date is required'),
  customerName: Yup.string()
    .required('Customer name is required')
    .trim()
    .min(2, 'Name must be at least 2 characters'),
  mobileNo: Yup.string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .trim(),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
  loanProvider: Yup.string()
    .required('Loan provider is required'),
  complaintDetails: Yup.string()
    .trim().nullable(),
  complaintFiles: Yup.array().nullable()
});

const AddComplaintPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const router = useRouter();

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Handle file selection
  const handleFileSelect = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    
    // Check each file size
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    
    // Add to selected files
    const updatedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(updatedFiles);
    setFieldValue('complaintFiles', updatedFiles);
    
    // Reset file input
    e.target.value = null;
  };

  // Remove file from selection
  const removeFile = (index, setFieldValue) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFieldValue('complaintFiles', updatedFiles);
  };

  // Clear all files
  const clearAllFiles = (setFieldValue) => {
    setSelectedFiles([]);
    setFieldValue('complaintFiles', []);
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(values).forEach(key => {
        if (key !== 'complaintFiles' && values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });
      
      // Append files if exist
      selectedFiles.forEach((file, index) => {
        formData.append(`complaintFiles`, file);
      });
      
      // Call the service to add complaint
      await complaintService.addComplaint(formData);
      
      // Reset form after successful submission
      resetForm();
      setSelectedFiles([]);
      
      // Show success message
      toast.success('Complaint added successfully!');
      
      // Redirect to manage complaints page
      router.push('/crm/complaints/manage-complaints');
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to add complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialValues = {
    loanAcNo: '',
    complaintDate: getCurrentDate(),
    customerName: '',
    mobileNo: '',
    email: '',
    loanProvider: 'AtdMoney',
    complaintDetails: '',
    complaintFiles: []
  };

  // File Icon component using Lucide
  const FileIcon = ({ file, isDark }) => {
    const extension = file.name.split('.').pop().toLowerCase();
    const iconProps = {
      className: `w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`,
      size: 16
    };

    // Return appropriate icon based on file type
    switch (extension) {
      case 'pdf':
        return <FileText {...iconProps} className={`${iconProps.className} ${isDark ? 'text-red-400' : 'text-red-500'}`} />;
      case 'doc':
      case 'docx':
        return <FileType {...iconProps} className={`${iconProps.className} ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <Image {...iconProps} className={`${iconProps.className} ${isDark ? 'text-green-400' : 'text-green-500'}`} />;
      default:
        return <File {...iconProps} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-3 md:px-54 md:py-3 md:pt-10">
        {/* Header */}
        <div className="mb-5 md:mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft
                  className={`w-4 h-4 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </button>
              <div className="flex items-center space-x-3">
                <h1
                  className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${
                    isDark
                      ? "from-emerald-400 to-teal-400"
                      : "from-gray-800 to-black"
                  } bg-clip-text text-transparent`}
                >
                  Add Complaint
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={complaintSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              {/* Main Form Container */}
              <div
                className={`rounded-xl shadow-xl border overflow-hidden ${
                  isDark
                    ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
                    : "bg-white border-emerald-300 shadow-emerald-500/10"
                }`}
              >
                <div
                  className={`px-4 py-3 border-b ${
                    isDark
                      ? "bg-gradient-to-r from-gray-900 to-gray-900 border-emerald-600/50"
                      : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
                  }`}
                >
                  <h2
                    className={`text-base font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}
                  >
                    Complaint Details
                  </h2>
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Fill in the details to register a new complaint
                  </p>
                </div>

                <div className="p-4">
                  <div className="space-y-6">
                    {/* Form Fields */}
                    <ComplaintFormFields
                      isDark={isDark}
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />

                    {/* Complaint Details and Attachment in one row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Complaint Details */}
                      <div>
                        <label
                          className={`flex items-center space-x-2 text-xs font-bold mb-1 ${
                            isDark ? "text-gray-100" : "text-gray-700"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-md ${
                              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
                            }`}
                          >
                            <AlertCircle
                              className={`w-3 h-3 ${
                                isDark ? "text-emerald-400" : "text-emerald-600"
                              }`}
                            />
                          </div>
                          <span>Complaint Details</span>
                          <span className="text-xs font-normal text-gray-500">(Optional)</span>
                        </label>
                        <textarea
                          name="complaintDetails"
                          placeholder="Enter complaint details"
                          value={values.complaintDetails || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          rows={8}
                          className={`w-full px-3 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                            isDark
                              ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
                              : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
                          } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none`}
                        />
                        {errors.complaintDetails && touched.complaintDetails && (
                          <p className="mt-1 text-xs text-red-500">{errors.complaintDetails}</p>
                        )}
                      </div>

                      {/* File Upload Section */}
                      <div>
                        <label
                          className={`flex items-center space-x-2 text-xs font-bold mb-1 ${
                            isDark ? "text-gray-100" : "text-gray-700"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-md ${
                              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
                            }`}
                          >
                            <Upload
                              className={`w-3 h-3 ${
                                isDark ? "text-emerald-400" : "text-emerald-600"
                              }`}
                            />
                          </div>
                          <span>Complaint Attachments</span>
                          <span className="text-xs font-normal text-gray-500">(Optional)</span>
                        </label>
                        
                        {/* File Upload Area */}
                        <label
                          htmlFor="file-upload"
                          className={`block px-4 py-6 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 hover:border-solid ${
                            isDark
                              ? "border-emerald-600/50 hover:border-emerald-500 bg-gray-800/50"
                              : "border-emerald-300 hover:border-emerald-400 bg-gray-50"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Upload
                              className={`w-8 h-8 ${
                                isDark ? "text-emerald-400" : "text-emerald-600"
                              }`}
                            />
                            <div className="text-center">
                              <span
                                className={`block text-sm font-medium ${
                                  isDark ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                Drop files here or click to upload
                              </span>
                              <span
                                className={`block text-xs mt-1 ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                PDF, DOC, JPG, PNG (Max 5MB each)
                              </span>
                            </div>
                            <button
                              type="button"
                              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                                isDark
                                  ? "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50"
                                  : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                              }`}
                            >
                              Browse Files
                            </button>
                          </div>
                        </label>
                        <input
                          type="file"
                          name="complaintFiles"
                          className="hidden"
                          multiple
                          onChange={(e) => handleFileSelect(e, setFieldValue)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.svg"
                          id="file-upload"
                        />
                        
                        {/* Selected Files List */}
                        {selectedFiles.length > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                Selected Files ({selectedFiles.length})
                              </p>
                              <button
                                type="button"
                                onClick={() => clearAllFiles(setFieldValue)}
                                className={`text-xs px-2 py-1 rounded transition-colors ${
                                  isDark
                                    ? "text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                    : "text-red-600 hover:text-red-700 hover:bg-red-100"
                                }`}
                              >
                                Clear All
                              </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {selectedFiles.map((file, index) => (
                                <div
                                  key={`${file.name}-${index}`}
                                  className={`flex items-center justify-between px-3 py-2 rounded-lg group ${
                                    isDark ? "bg-gray-800/70 hover:bg-gray-800" : "bg-gray-100 hover:bg-gray-200"
                                  } transition-colors`}
                                >
                                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <FileIcon file={file} isDark={isDark} />
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-xs font-medium truncate ${
                                          isDark ? "text-gray-300" : "text-gray-700"
                                        }`}
                                        title={file.name}
                                      >
                                        {file.name}
                                      </p>
                                      <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                        {(file.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index, setFieldValue)}
                                    className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                                      isDark
                                        ? "hover:bg-red-900/50 text-red-400 hover:text-red-300"
                                        : "hover:bg-red-100 text-red-600 hover:text-red-700"
                                    }`}
                                    title="Remove file"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className={`mt-3 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          Upload supporting documents if any (optional)
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-700/50">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-lg text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none flex items-center space-x-2 ${
                          isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : isDark
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25"
                            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25"
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
                            <span>Submit Complaint</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddComplaintPage;