// app/crm/advocate/components/AdvocateForm.jsx
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
    .trim()
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

  const initialValues = initialData || {
    name: '',
    court: '',
    address: '',
    phone: '',
    email: '',
    licence_no: ''
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      if (!isEditMode) {
        resetForm();
      }
      toast.success(isEditMode ? 'Advocate updated successfully!' : 'Advocate added successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save advocate');
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
          <Formik
            initialValues={initialValues}
            validationSchema={advocateSchema}
            onSubmit={handleSubmit}
            enableReinitialize={isEditMode}
          >
            {({ isSubmitting: formikSubmitting }) => (
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