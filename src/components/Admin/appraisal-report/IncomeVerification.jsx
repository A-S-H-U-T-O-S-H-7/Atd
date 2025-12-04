import React, { useState, useEffect } from 'react';
import { Save, Users, Plus, Trash2, Home, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { incomeVerificationSchema } from '@/lib/schema/salaryValidationSchemas';

const IncomeVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [localFamilyMembers, setLocalFamilyMembers] = useState([]);
  const [submittingSalary, setSubmittingSalary] = useState(false);
  const [userManuallyChangedFinalReport, setUserManuallyChangedFinalReport] = useState(false);

  // Sync with formik values when component mounts or familyMembers changes from parent
  useEffect(() => {
    if (formik.values.familyMembers && formik.values.familyMembers.length > 0) {
      setLocalFamilyMembers(formik.values.familyMembers);
    }
  }, [formik.values.familyMembers]);

  // Initialize formik values
  useEffect(() => {
    const fields = [
      'organizationSameAsApplied', 'organizationSameAsAppliedStatus', 
      'grossAmountSalary', 'grossAmountSalaryStatus', 'grossSalaryAmount',
      'netAmountSalary', 'netAmountSalaryStatus', 'netSalaryAmount',
      'salaryDate', 'incomeVerificationFinalReport',
      'availabilityOfBasicAmenities', 'availabilityOfOtherAssets', 'primarySourceOfIncome', 'natureOfWork',
      'frequencyOfIncome', 'monthsOfEmployment', 'selfReportedMonthlyIncome', 'averageMonthlyIncome'
    ];
    
    fields.forEach(field => {
      if (formik.values[field] === undefined) {
        formik.setFieldValue(field, '');
      }
    });
  }, []);

  // Handle verified status change for organization, gross salary, and net salary
  const handleVerifiedChange = (field, value) => {
    // Set the verified field
    formik.setFieldValue(field, value);
    
    // Determine corresponding status field
    const statusFieldMap = {
      organizationSameAsApplied: 'organizationSameAsAppliedStatus',
      grossAmountSalary: 'grossAmountSalaryStatus',
      netAmountSalary: 'netAmountSalaryStatus'
    };
    
    const statusField = statusFieldMap[field];
    if (statusField) {
      // Auto-set status based on verified selection
      if (value === 'Yes') {
        formik.setFieldValue(statusField, 'Positive');
      } else if (value === 'No') {
        formik.setFieldValue(statusField, 'Negative');
      } else {
        // If cleared, also clear status
        formik.setFieldValue(statusField, '');
      }
    }
  };

  // Handle final report change - track manual changes
  const handleFinalReportChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('incomeVerificationFinalReport', value);
    setUserManuallyChangedFinalReport(true);
  };

  // Auto-update final report based on verifications and required fields - ONLY if user hasn't manually changed it
  useEffect(() => {
    // If user manually changed final report, don't auto-update
    if (userManuallyChangedFinalReport) {
      return;
    }

    const allCriticalVerified = 
      formik.values.organizationSameAsApplied === 'Yes' &&
      formik.values.organizationSameAsAppliedStatus === 'Positive' &&
      formik.values.grossAmountSalary === 'Yes' &&
      formik.values.grossAmountSalaryStatus === 'Positive' &&
      formik.values.netAmountSalary === 'Yes' &&
      formik.values.netAmountSalaryStatus === 'Positive';

    // Check required fields
    const requiredFieldsFilled = 
      formik.values.salaryDate &&
      formik.values.salaryDate.trim() !== '' &&
      formik.values.monthsOfEmployment &&
      formik.values.monthsOfEmployment.toString().trim() !== '' &&
      formik.values.selfReportedMonthlyIncome &&
      formik.values.selfReportedMonthlyIncome.toString().trim() !== '';

    // Set to Positive if all conditions met
    if (allCriticalVerified && requiredFieldsFilled && formik.values.incomeVerificationFinalReport !== 'Positive') {
      formik.setFieldValue('incomeVerificationFinalReport', 'Positive');
    }

    // Set to Negative if any critical verification is negative
    const hasCriticalNegative = 
      formik.values.organizationSameAsApplied === 'No' ||
      formik.values.organizationSameAsAppliedStatus === 'Negative' ||
      formik.values.grossAmountSalary === 'No' ||
      formik.values.grossAmountSalaryStatus === 'Negative' ||
      formik.values.netAmountSalary === 'No' ||
      formik.values.netAmountSalaryStatus === 'Negative';
      
    if (hasCriticalNegative && formik.values.incomeVerificationFinalReport !== 'Negative') {
      formik.setFieldValue('incomeVerificationFinalReport', 'Negative');
    }
  }, [formik.values, userManuallyChangedFinalReport]);

  // Reset manual change flag when component mounts or when verification fields are cleared
  useEffect(() => {
    // Reset manual change if all verification fields are empty/not set
    const allFieldsEmpty = 
      !formik.values.organizationSameAsApplied &&
      !formik.values.grossAmountSalary &&
      !formik.values.netAmountSalary &&
      !formik.values.salaryDate &&
      !formik.values.monthsOfEmployment &&
      !formik.values.selfReportedMonthlyIncome;
    
    if (allFieldsEmpty) {
      setUserManuallyChangedFinalReport(false);
    }
  }, [formik.values]);

  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-base font-semibold mb-2 ${
    isDark ? "text-emerald-400" : "text-gray-700"
  }`;
  const requiredLabelClassName = `block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"} after:content-['*'] after:ml-0.5 after:text-red-500`;

  const subLabelClassName = `text-sm font-medium mb-2 block ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  const valueClassName = `px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-900"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-700"
      : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  const fieldClassName = `p-4 rounded-lg border transition-all duration-200 ${
    isDark
      ? "bg-gray-800/60 border-gray-600 hover:border-emerald-500/40 shadow-lg"
      : "bg-emerald-50/80 border-emerald-200 hover:border-emerald-300 shadow-sm"
  }`;

  const readOnlyInputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-600 border-gray-500 text-gray-100 cursor-not-allowed"
      : "bg-gray-200 border-gray-300 text-gray-800 cursor-not-allowed"
  }`;

  const familyUnits = ['Self', 'Spouse', 'Father', 'Mother', 'Unmarrid Son', 'Unmarrid Daughter'];
  const natureOfWorkOptions = ['Self-employed', 'Salaried', 'Business', 'Agriculture', 'Professional', 'Other'];

  const addFamilyMember = () => {
    const newMember = { unit: '', natureOfWork: '', contactNo: '', annualIncome: '' };
    const updated = [...localFamilyMembers, newMember];
    setLocalFamilyMembers(updated);
    // Also update formik to keep in sync
    formik.setFieldValue('familyMembers', updated);
  };

  const removeFamilyMember = (index) => {
    const updated = localFamilyMembers.filter((_, i) => i !== index);
    setLocalFamilyMembers(updated);
    // Also update formik to keep in sync
    formik.setFieldValue('familyMembers', updated);
  };

  const updateFamilyMember = (index, field, value) => {
    // Validation for contact number - exactly 10 digits
    if (field === 'contactNo') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      value = digitsOnly.slice(0, 10);
    }
    
    // Validation for annual income - ensure it's a valid number
    if (field === 'annualIncome') {
      // Remove any non-digit characters except decimal point
      const sanitized = value.replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const parts = sanitized.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      } else {
        value = sanitized;
      }
    }
    
    const updated = localFamilyMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    setLocalFamilyMembers(updated);
  };

  const totalAnnualIncome = localFamilyMembers.reduce((total, member) => {
    return total + (parseFloat(member.annualIncome) || 0);
  }, 0);

  const monthsEmployed = parseFloat(formik.values.monthsOfEmployment) || 0;
  const selfReportedIncome = parseFloat(formik.values.selfReportedMonthlyIncome) || 0;
  const averageMonthlyIncome = monthsEmployed > 0 ? (selfReportedIncome * monthsEmployed) / 12 : 0;  

  // Save all data by calling parent's onSectionSave
  const saveAllHouseholdIncomes = async () => {
    try {
      setSubmittingSalary(true);
      
      // Validate using Yup schema
      try {
        await incomeVerificationSchema.validate(formik.values, { abortEarly: true });
      } catch (validationError) {
        const firstError = validationError.errors?.[0] || validationError.message;
        toast.error(firstError);
        return;
      }
      
      // Validate required fields are filled
      if (!formik.values.salaryDate || formik.values.salaryDate.trim() === '') {
        toast.error('Salary date is required');
        return;
      }

      if (!formik.values.monthsOfEmployment || formik.values.monthsOfEmployment.toString().trim() === '') {
        toast.error('Months of employment is required');
        return;
      }

      if (!formik.values.selfReportedMonthlyIncome || formik.values.selfReportedMonthlyIncome.toString().trim() === '') {
        toast.error('Self-reported monthly income is required');
        return;
      }
      
      // Validate contact numbers before saving
      const invalidContacts = localFamilyMembers.filter(member => 
        member.contactNo && member.contactNo.length !== 10
      );
      
      if (invalidContacts.length > 0) {
        toast.error('Contact number must be exactly 10 digits');
        return;
      }
      
      // Update formik with current family members before saving
      await formik.setFieldValue('familyMembers', localFamilyMembers);
      
      // Call parent component's save handler
      if (onSectionSave) {
        await onSectionSave(formik.values, localFamilyMembers);
        toast.success('Income verification saved successfully!');
      }
      
    } catch (error) {
      toast.error('Failed to save income verification data');
    } finally {
      setSubmittingSalary(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-emerald-500/20 shadow-2xl shadow-emerald-900/10"
          : "bg-gradient-to-br from-gray-100 border-emerald-200 shadow-lg shadow-emerald-500/10"
      }`}>
        
        {/* Content */}
        <div className="p-4">
          <div className="space-y-6">
            
            {/* Organization & Salary Details */}
            <div className={`${fieldClassName}`}>
              <label className={labelClassName}>
                <Building className="w-4 h-4 inline text-emerald-400 mr-2" />
                Organization & Salary Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Organization same as applied */}
                <div>
                  <label className={subLabelClassName}>Organization same as applied</label>
                  <div className="flex items-center space-x-2">
                    <select
                      value={formik.values.organizationSameAsApplied || ''}
                      onChange={(e) => handleVerifiedChange('organizationSameAsApplied', e.target.value)}
                      className={selectClassName}
                    >
                      <option value="">Verified</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <select
                      value={formik.values.organizationSameAsAppliedStatus || ''}
                      onChange={(e) => formik.setFieldValue('organizationSameAsAppliedStatus', e.target.value)}
                      className={selectClassName}
                    >
                      <option value="">Status</option>
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                    </select>
                  </div>
                </div>

                {/* Gross Salary */}
                <div>
                  <label className={requiredLabelClassName}>Gross Salary</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="number"
                        value={formik.values.grossSalaryAmount || ''}
                        readOnly
                        className={readOnlyInputClassName}
                        placeholder="₹ Amount"
                      />
                    </div>
                    <div>
                      <select
                        value={formik.values.grossAmountSalary || ''}
                        onChange={(e) => handleVerifiedChange('grossAmountSalary', e.target.value)}
                        className={selectClassName}
                      >
                        <option value="">Verified</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={formik.values.grossAmountSalaryStatus || ''}
                        onChange={(e) => formik.setFieldValue('grossAmountSalaryStatus', e.target.value)}
                        className={selectClassName}
                      >
                        <option value="">Status</option>
                        <option value="Positive">Positive</option>
                        <option value="Negative">Negative</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div>
                  <label className={requiredLabelClassName}>Net Salary</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="number"
                        value={formik.values.netSalaryAmount || ''}
                        readOnly
                        className={readOnlyInputClassName}
                        placeholder="₹ Amount"
                      />
                    </div>
                    <div>
                      <select
                        value={formik.values.netAmountSalary || ''}
                        onChange={(e) => handleVerifiedChange('netAmountSalary', e.target.value)}
                        className={selectClassName}
                      >
                        <option value="">Verified</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={formik.values.netAmountSalaryStatus || ''}
                        onChange={(e) => formik.setFieldValue('netAmountSalaryStatus', e.target.value)}
                        className={selectClassName}
                      >
                        <option value="">Status</option>
                        <option value="Positive">Positive</option>
                        <option value="Negative">Negative</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Date and Net Household Income - Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={requiredLabelClassName}>Salary Date</label>
                <input
                  type="date"
                  value={formik.values.salaryDate || ''}
                  onChange={(e) => formik.setFieldValue('salaryDate', e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={`text-sm font-medium mb-2 block ${isDark ? "text-emerald-300" : "text-gray-700"}`}>
                  <Home className="w-4 h-4 inline mr-1" />
                  Net Household Income
                </label>
                <input
                  type="text"
                  value={formik.values.netHouseHoldIncome ? `₹${parseFloat(formik.values.netHouseHoldIncome).toLocaleString()}` : 'Not set'}
                  readOnly
                  className={`${valueClassName} w-full text-center font-semibold ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </div>
            </div>

            {/* Family Members Income */}
            <div className={`${fieldClassName}`}>
              <div className="flex items-center justify-between mb-4">
                <label className={labelClassName}>
                  <Users className="w-4 h-4 inline mr-2" />
                  Family Members Income <span className={`text-sm font-normal ${isDark ? "text-gray-400" : "text-gray-500"}`}>(Optional)</span>
                </label>
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className={`px-3 py-2 rounded text-sm flex items-center space-x-2 ${
                    isDark 
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="space-y-3">
                {localFamilyMembers.map((member, index) => (
                  <div key={index} className={`p-3 rounded border ${
                    isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-3">
                        <label className={subLabelClassName}>Family Unit</label>
                        <select
                          value={member.unit}
                          onChange={(e) => updateFamilyMember(index, 'unit', e.target.value)}
                          className={selectClassName}
                        >
                          <option value="">Select</option>
                          {familyUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className={subLabelClassName}>Nature of Work</label>
                        <select
                          value={member.natureOfWork}
                          onChange={(e) => updateFamilyMember(index, 'natureOfWork', e.target.value)}
                          className={selectClassName}
                        >
                          <option value="">Select</option>
                          {natureOfWorkOptions.map(nature => (
                            <option key={nature} value={nature}>{nature}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className={subLabelClassName}>Contact No</label>
                        <input
                          type="text"
                          value={member.contactNo}
                          onChange={(e) => updateFamilyMember(index, 'contactNo', e.target.value)}
                          className={inputClassName}
                          placeholder="10 digit number"
                          maxLength={10}
                          pattern="[0-9]{10}"
                        />
                        {member.contactNo && member.contactNo.length !== 10 && (
                          <p className="text-xs text-red-500 mt-1">Must be exactly 10 digits</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className={subLabelClassName}>Annual Income</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={member.annualIncome}
                          onChange={(e) => updateFamilyMember(index, 'annualIncome', e.target.value)}
                          className={inputClassName}
                          placeholder="₹"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(index)}
                          className={`p-2 rounded w-full ${
                            isDark 
                              ? "bg-red-600 hover:bg-red-500 text-white" 
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`mt-4 p-3 rounded border ${
                isDark ? "bg-gray-700 border-gray-600" : "bg-emerald-50 border-emerald-200"
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-base font-semibold ${isDark ? "text-gray-300" : "text-emerald-700"}`}>
                    Total Annual Income (Family)
                  </span>
                  <span className={`text-lg font-bold ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    {totalAnnualIncome > 0 ? `₹${totalAnnualIncome.toLocaleString()}` : 'No family income added'}
                  </span>
                </div>
              </div>
            </div>

            {/* Employment Details Block */}
            <div className={`${fieldClassName}`}>
              <label className={labelClassName}>Employment Details</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={requiredLabelClassName}>Months of employment over last one year</label>
                  <input
                    type="number"
                    value={formik.values.monthsOfEmployment || ''}
                    onChange={(e) => formik.setFieldValue('monthsOfEmployment', e.target.value)}
                    className={inputClassName}
                    placeholder="Enter months"
                    min="1"
                    max="12"
                  />
                </div>

                <div>
                  <label className={requiredLabelClassName}>Self-reported monthly income</label>
                  <input
                    type="number"
                    value={formik.values.selfReportedMonthlyIncome || ''}
                    onChange={(e) => formik.setFieldValue('selfReportedMonthlyIncome', e.target.value)}
                    className={inputClassName}
                    placeholder="₹"
                    min="1"
                  />
                </div>

                <div>
                  <label className={subLabelClassName}>Average monthly income</label>
                  <div className={`p-2 rounded border text-center font-semibold ${
                    isDark ? "bg-gray-700 border-gray-600 text-emerald-400" : "bg-emerald-100 border-emerald-200 text-emerald-700"
                  }`}>
                    ₹{averageMonthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    (Self-reported monthly income × Months of employment ÷ 12)
                  </div>
                </div>
              </div>
            </div>

            {/* Final Report Block */}
            <div className={`${fieldClassName}`}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="w-50">
                  <label className={`text-sm font-semibold mb-2 block ${isDark ? "text-blue-500" : "text-blue-700"}`}>
                    Final Report
                  </label>
                  <select
                    value={formik.values.incomeVerificationFinalReport || ''}
                    onChange={handleFinalReportChange}
                    className={selectClassName}
                  >
                    <option value="">Select Final Report</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                  
                </div>

                <div className="w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={saveAllHouseholdIncomes}
                    disabled={submittingSalary || !formik.values.applicationId}
                    className={buttonClassName}
                  >
                    {submittingSalary ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{submittingSalary ? 'Submitting...' : 'Submit'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeVerification;