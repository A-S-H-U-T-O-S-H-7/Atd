import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useAdminAuth } from '@/lib/AdminAuthContext';

const LoanEligibility = ({ enquiry, onBack }) => {
  const { isDark } = useAdminAuth();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    applicantName: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Applicant name is required'),
    grossSalary: Yup.number()
      .min(0, 'Gross salary must be positive')
      .required('Gross salary is required'),
    netSalary: Yup.number()
      .min(0, 'Net salary must be positive')
      .required('Net salary is required'),
    totalExitingEMI: Yup.number()
      .min(0, 'EMI must be positive or zero')
      .required('Total existing EMI is required'),
    maximumLimit: Yup.number()
      .min(0, 'Maximum limit must be positive')
      .required('Maximum limit is required'),
    finalRecommended: Yup.number()
      .min(0, 'Final recommended amount must be positive')
      .required('Final recommended amount is required')
      .test('within-range', 'Amount should be between 20% and 30% of balance', function(value) {
        const { balance } = this.parent;
        if (!balance || !value) return true; // Skip validation if balance or value is empty
        const min20Percent = balance * 0.20;
        const max30Percent = balance * 0.30;
        return value >= min20Percent && value <= max30Percent;
      }),
  });

  // Initial form values
  const initialValues = {
    applicantName: enquiry?.name || '',
    grossSalary: enquiry?.grossSalary || '',
    netSalary: enquiry?.netSalary || '',
    totalExitingEMI: '',
    maximumLimit: '',
    balance: '',
    min20PercentOfBalance: '',
    max30PercentOfBalance: '',
    finalRecommended: ''
  };

  // Calculate balance and percentages
  const calculateDependentFields = (values) => {
    const grossSalary = parseFloat(values.grossSalary) || 0;
    const totalEMI = parseFloat(values.totalExitingEMI) || 0;
    const balance = grossSalary - totalEMI;
    
    return {
      balance: balance > 0 ? balance : 0,
      min20PercentOfBalance: balance > 0 ? balance * 0.20 : 0,
      max30PercentOfBalance: balance > 0 ? balance * 0.30 : 0
    };
  };

  const handleApprove = (values) => {
    console.log('Approved with recommended amount:', values.finalRecommended);
    console.log('All form values:', values);
    // API call to update enquiry status
    // updateEnquiryStatus(enquiry.id, 'approved', values.finalRecommended);
    onBack();
  };

  const handleReject = () => {
    console.log('Loan application rejected');
    // API call to update enquiry status
    // updateEnquiryStatus(enquiry.id, 'rejected');
    onBack();
  };

  // Custom Field component for better styling
  const CustomField = ({ 
    name, 
    label, 
    type = "number", 
    placeholder, 
    readOnly = false, 
    helpText,
    values,
    setFieldValue 
  }) => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        isDark ? "text-gray-200" : "text-gray-700"
      }`}>
        {label}:
      </label>
      <Field name={name}>
        {({ field, meta }) => (
          <>
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              readOnly={readOnly}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                readOnly
                  ? isDark
                    ? "bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                  : isDark
                    ? `bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400 ${
                        meta.touched && meta.error ? 'border-red-500' : ''
                      }`
                    : `bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500 ${
                        meta.touched && meta.error ? 'border-red-500' : ''
                      }`
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
              onChange={(e) => {
                field.onChange(e);
                // Auto-calculate dependent fields when gross salary or EMI changes
                if (name === 'grossSalary' || name === 'totalExitingEMI') {
                  const newValues = { ...values, [name]: e.target.value };
                  const calculated = calculateDependentFields(newValues);
                  setFieldValue('balance', calculated.balance.toString());
                  setFieldValue('min20PercentOfBalance', calculated.min20PercentOfBalance.toString());
                  setFieldValue('max30PercentOfBalance', calculated.max30PercentOfBalance.toString());
                }
              }}
            />
            {helpText && (
              <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {helpText}
              </p>
            )}
            <ErrorMessage name={name}>
              {msg => <div className="text-red-500 text-sm mt-1">{msg}</div>}
            </ErrorMessage>
          </>
        )}
      </Field>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-4 md:p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleApprove}
          enableReinitialize={true}
        >
          {({ values, setFieldValue, isValid, dirty }) => (
            <Form>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <button 
                      type="button"
                      onClick={onBack}
                      className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                        isDark
                          ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                          : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                      }`}
                    >
                      <ArrowLeft className={`w-5 h-5 ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`} />
                    </button>
                    <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                      isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                    } bg-clip-text text-transparent`}>
                      Loan Eligibility of {values.applicantName || 'Applicant'}
                    </h1>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleReject}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <X size={18} />
                      <span>Reject</span>
                    </button>
                    <div className={`px-4 py-2 rounded-lg font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      OR
                    </div>
                    <button
                      type="submit"
                      disabled={!isValid || !dirty}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl ${
                        isValid && dirty
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <Check size={18} />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Eligibility Form */}
              <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
                  : "bg-white border-emerald-300 shadow-emerald-500/10"
              }`}>
                <div className="p-8">
                  <h2 className={`text-xl font-semibold mb-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    Eligibility Calculation
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <CustomField
                        name="applicantName"
                        label="Applicant Name"
                        type="text"
                        placeholder="Enter applicant name"
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      <CustomField
                        name="grossSalary"
                        label="Gross Salary (₹)"
                        placeholder="Enter gross salary"
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      <CustomField
                        name="netSalary"
                        label="Net Salary (₹)"
                        placeholder="Enter net salary"
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      <CustomField
                        name="totalExitingEMI"
                        label="Total Existing EMI (₹)"
                        placeholder="Enter total existing EMI"
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      <CustomField
                        name="maximumLimit"
                        label="Maximum Limit (₹)"
                        placeholder="Enter maximum limit"
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      <CustomField
                        name="finalRecommended"
                        label="Final Recommended (₹)"
                        placeholder="Enter final recommended amount"
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <CustomField
                        name="balance"
                        label="Balance (₹)"
                        placeholder="Auto-calculated or manual entry"
                        helpText="Auto-calculated: Gross Salary - Total EMI"
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      <CustomField
                        name="min20PercentOfBalance"
                        label="Min 20% of Balance (₹)"
                        placeholder="Auto-calculated"
                        helpText="Auto-calculated: 20% of Balance"
                        readOnly={true}
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      <CustomField
                        name="max30PercentOfBalance"
                        label="Max 30% of Balance (₹)"
                        placeholder="Auto-calculated"
                        helpText="Auto-calculated: 30% of Balance"
                        readOnly={true}
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      {/* Form Status Indicator
                      <div className={`p-4 rounded-xl ${
                        isDark ? "bg-gray-700" : "bg-gray-50"
                      }`}>
                        <h3 className={`text-sm font-medium mb-2 ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}>
                          Form Status
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            isValid ? "bg-green-500" : "bg-red-500"
                          }`}></div>
                          <span className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {isValid ? "Form is valid" : "Please fix validation errors"}
                          </span>
                        </div>
                      </div> */}
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

export default LoanEligibility;