'use client';
import React, { useState } from 'react';
import { 
  Save, 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  User,
  Key,
  Lock,
  Hash,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Briefcase,
  IndianRupee
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

// Validation Schema
const bankSchema = Yup.object().shape({
  bank: Yup.string()
    .required('Bank name is required')
    .trim(),
  branch_name: Yup.string()
    .required('Branch name is required')
    .trim(),
  account_no: Yup.string()
    .required('Account number is required')
    .matches(/^\d{9,18}$/, 'Account number must be 9-18 digits')
    .trim(),
  ifsc_code: Yup.string()
    .required('IFSC code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
    .trim(),
  account_type: Yup.string()
    .required('Account type is required')
    .oneOf(['Savings', 'Current', 'CC', 'OD'], 'Invalid account type'),
  name: Yup.string()
    .required('Account name is required')
    .trim(),
  contact_person: Yup.string()
    .nullable()
    .trim(),
  phone: Yup.string()
    .nullable()
    .matches(/^$|^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .max(10, 'Phone number cannot exceed 10 digits')
    .trim(),
  email: Yup.string()
    .nullable()
    .email('Please enter a valid email address')
    .trim(),
  amount: Yup.number()
    .nullable()
    .min(0, 'Amount cannot be negative')
    .typeError('Amount must be a number'),
  apikey: Yup.string()
    .nullable()
    .trim(),
  passCode: Yup.string()
    .nullable()
    .trim(),
  bcID: Yup.string()
    .nullable()
    .trim(),
  uses_for: Yup.string()
    .required('Usage is required')
    .oneOf(['disbursement', 'collection', 'cheque'], 'Select valid usage')
});


// Reusable Input Styles
const getInputStyles = (isDark, hasError = false) => {
  const baseStyles = "w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-none";
  
  if (hasError) {
    return `${baseStyles} ${
      isDark
        ? 'bg-gray-800 border-red-500 text-white placeholder-gray-400'
        : 'bg-white border-red-500 text-gray-900 placeholder-gray-500'
    }`;
  }
  
  return `${baseStyles} ${
    isDark
      ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400'
      : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500'
  }`;
};

// Reusable Label Component
const FormLabel = ({ icon: Icon, label, isDark, optional = false }) => (
  <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
    isDark ? 'text-gray-100' : 'text-gray-700'
  }`}>
    <div className={`p-1.5 rounded-md ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
      <Icon className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
    </div>
    <span>{label}</span>
    {optional && <span className="text-xs font-normal text-gray-500">(Optional)</span>}
  </label>
);

// Phone input handler to restrict to 10 digits
const PhoneInput = ({ field, form, ...props }) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    form.setFieldValue(field.name, value);
  };

  return (
    <input
      {...field}
      {...props}
      type="text"
      onChange={handleChange}
      maxLength={10}
    />
  );
};

// Amount input handler to prevent negative values
const AmountInput = ({ field, form, ...props }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      form.setFieldValue(field.name, value === '' ? '' : parseFloat(value));
    }
  };

  return (
    <input
      {...field}
      {...props}
      type="number"
      onChange={handleChange}
      min="0"
      step="any"
    />
  );
};

const BankForm = ({ 
  isDark, 
  onSubmit, 
  initialData = null, 
  isEditMode = false,
  isExpanded = true,
  onToggleExpand 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const initialValues = initialData || {
    bank: '',
    branch_name: '',
    account_no: '',
    ifsc_code: '',
    account_type: 'Current',
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    amount: '',
    apikey: '',
    passCode: '',
    bcID: '',
    uses_for: 'collection'
  };

 const handleSubmit = async (values, { resetForm }) => {
  setIsSubmitting(true);
  setServerError('');
  
  try {
    await onSubmit(values);
    if (!isEditMode) {
      resetForm();
    }
    toast.success(isEditMode ? 'Bank updated successfully!' : 'Bank added successfully!');
  } catch (error) {
    let errorMessage = 'Failed to save bank';
    
    if (error.response) {
      const errorData = error.response.data || {};
      
      if (error.response.status === 422 && errorData.errors) {
        const errors = errorData.errors;
        const firstError = Object.values(errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } 
      // Custom API error message
      else if (errorData.message) {
        errorMessage = errorData.message;
      }
      else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      // Fallback to status text
      else if (error.response.statusText) {
        errorMessage = error.response.statusText;
      }
    } 
    else if (error.data) {
      const errorData = error.data;
      
      if (errorData.errors) {
        const errors = errorData.errors;
        const firstError = Object.values(errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } 
      else if (errorData.message) {
        errorMessage = errorData.message;
      }
    }
    else if (error.message) {
      errorMessage = error.message;
    }
    
    setServerError(errorMessage);
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
            <Building2 className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <div className="text-left">
            <h2 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
              {isEditMode ? 'Edit Bank Account' : 'Add New Bank Account'}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {isEditMode ? 'Update bank account details' : 'Fill in the bank account details'}
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
          {/* Server Error Display */}
          {serverError && (
            <div className={`mb-6 p-4 rounded-lg border ${
              isDark 
                ? 'bg-red-900/20 border-red-600/50 text-red-200' 
                : 'bg-red-50 border-red-300 text-red-700'
            }`}>
              <p className="font-medium">{serverError}</p>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={bankSchema}
            onSubmit={handleSubmit}
            enableReinitialize={isEditMode}
          >
            {({ isSubmitting: formikSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bank Name Field */}
                  <div>
                    <FormLabel icon={Building2} label="Bank Name *" isDark={isDark} />
                    <Field
                      type="text"
                      name="bank"
                      placeholder="e.g., HDFC, ICICI, SBI"
                      className={getInputStyles(isDark, errors.bank && touched.bank)}
                    />
                    <ErrorMessage name="bank">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Branch Name Field */}
                  <div>
                    <FormLabel icon={MapPin} label="Branch Name *" isDark={isDark} />
                    <Field
                      type="text"
                      name="branch_name"
                      placeholder="e.g., Noida Sector 62"
                      className={getInputStyles(isDark, errors.branch_name && touched.branch_name)}
                    />
                    <ErrorMessage name="branch_name">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Account Number Field */}
                  <div>
                    <FormLabel icon={CreditCard} label="Account Number *" isDark={isDark} />
                    <Field
                      type="text"
                      name="account_no"
                      placeholder="12-18 digit account number"
                      className={getInputStyles(isDark, errors.account_no && touched.account_no)}
                    />
                    <ErrorMessage name="account_no">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* IFSC Code Field */}
                  <div>
                    <FormLabel icon={Hash} label="IFSC Code *" isDark={isDark} />
                    <Field
                      type="text"
                      name="ifsc_code"
                      placeholder="e.g., HDFC0001234"
                      className={getInputStyles(isDark, errors.ifsc_code && touched.ifsc_code)}
                    />
                    <ErrorMessage name="ifsc_code">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Account Type Field */}
                  <div>
                    <FormLabel icon={Briefcase} label="Account Type *" isDark={isDark} />
                    <Field
                      as="select"
                      name="account_type"
                      className={getInputStyles(isDark, errors.account_type && touched.account_type)}
                    >
                      <option value="">Select Account Type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                      <option value="CC">Cash Credit (CC)</option>
                      <option value="OD">Overdraft (OD)</option>
                    </Field>
                    <ErrorMessage name="account_type">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Account Name Field */}
                  <div>
                    <FormLabel icon={User} label="Account Name *" isDark={isDark} />
                    <Field
                      type="text"
                      name="name"
                      placeholder="e.g., Main Collection Account"
                      className={getInputStyles(isDark, errors.name && touched.name)}
                    />
                    <ErrorMessage name="name">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Contact Person Field */}
                  <div>
                    <FormLabel icon={User} label="Contact Person" isDark={isDark} optional />
                    <Field
                      type="text"
                      name="contact_person"
                      placeholder="e.g., Rajesh Kumar"
                      className={getInputStyles(isDark, errors.contact_person && touched.contact_person)}
                    />
                    <ErrorMessage name="contact_person">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <FormLabel icon={Phone} label="Phone Number" isDark={isDark} optional />
                    <Field
                      name="phone"
                      component={PhoneInput}
                      placeholder="10-digit mobile number"
                      className={getInputStyles(isDark, errors.phone && touched.phone)}
                    />
                    <ErrorMessage name="phone">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Email Field */}
                  <div>
                    <FormLabel icon={Mail} label="Email" isDark={isDark} optional />
                    <Field
                      type="email"
                      name="email"
                      placeholder="contact@example.com"
                      className={getInputStyles(isDark, errors.email && touched.email)}
                    />
                    <ErrorMessage name="email">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Amount Field */}
                  <div>
                    <FormLabel icon={IndianRupee} label="Amount" isDark={isDark} optional />
                    <Field
                      name="amount"
                      component={AmountInput}
                      placeholder="e.g., 200000"
                      className={getInputStyles(isDark, errors.amount && touched.amount)}
                    />
                    <ErrorMessage name="amount">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Usage For Field */}
                  <div>
  <FormLabel icon={Briefcase} label="Usage For *" isDark={isDark} />
  <Field
    as="select"
    name="uses_for"
    className={getInputStyles(isDark, errors.uses_for && touched.uses_for)}
  >
    <option value="">Select Usage</option>
    <option value="disbursement">Disbursement</option>
    <option value="collection">Collection</option>
    <option value="cheque">Cheque</option>
  </Field>
  <ErrorMessage name="uses_for">
    {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
  </ErrorMessage>
</div>

                  {/* API Key Field */}
                  <div>
                    <FormLabel icon={Key} label="API Key" isDark={isDark} optional />
                    <Field
                      type="text"
                      name="apikey"
                      placeholder="API key for integration"
                      className={getInputStyles(isDark)}
                    />
                  </div>

                  {/* PassCode Field */}
                  <div>
                    <FormLabel icon={Lock} label="Pass Code" isDark={isDark} optional />
                    <Field
                      type="text"
                      name="passCode"
                      placeholder="Pass code for authentication"
                      className={getInputStyles(isDark)}
                    />
                  </div>

                  {/* BC ID Field */}
                  <div>
                    <FormLabel icon={Hash} label="BC ID" isDark={isDark} optional />
                    <Field
                      type="text"
                      name="bcID"
                      placeholder="Business Correspondent ID"
                      className={getInputStyles(isDark)}
                    />
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
                        <span>{isEditMode ? 'Update Bank Account' : 'Add Bank Account'}</span>
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

export default BankForm;