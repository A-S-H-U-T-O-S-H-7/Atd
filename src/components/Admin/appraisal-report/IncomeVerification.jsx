import React, { useState, useEffect } from 'react';
import { DollarSign, Save, Users, Plus, Trash2, Home, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';
import salaryService from '@/lib/services/appraisal/salaryService';

const IncomeVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [familyMembers, setFamilyMembers] = useState([
    { unit: 'Unmarrid Son', natureOfWork: 'Self-employed', contactNo: '', annualIncome: '' }
  ]);
  const [submittingSalary, setSubmittingSalary] = useState(false);

  // Initialize formik values
  useEffect(() => {
    const fields = [
      'organizationSameAsApplied', 'organizationSameAsAppliedStatus', 
      'grossAmountSalary', 'grossAmountSalaryStatus', 
      'netAmountSalary', 'netAmountSalaryStatus', 'salaryDate',
      'availabilityOfBasicAmenities', 'availabilityOfOtherAssets', 'primarySourceOfIncome', 'natureOfWork',
      'frequencyOfIncome', 'monthsOfEmployment', 'selfReportedMonthlyIncome', 'averageMonthlyIncome', 'incomeVerificationFinalReport'
    ];
    
    fields.forEach(field => {
      if (formik.values[field] === undefined) {
        formik.setFieldValue(field, '');
      }
    });
  }, []);

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

  const familyUnits = ['Self', 'Spouse', 'Father', 'Mother', 'Unmarrid Son', 'Unmarrid Daughter'];
  const natureOfWorkOptions = ['Self-employed', 'Salaried', 'Business', 'Agriculture', 'Professional', 'Other'];

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { unit: '', natureOfWork: '', contactNo: '', annualIncome: '' }]);
  };

  const removeFamilyMember = (index) => {
    const updated = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updated);
  };

  const updateFamilyMember = (index, field, value) => {
    const updated = familyMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    setFamilyMembers(updated);
  };

  const totalAnnualIncome = familyMembers.reduce((total, member) => {
    return total + (parseFloat(member.annualIncome) || 0);
  }, 0);

  const monthsEmployed = parseFloat(formik.values.monthsOfEmployment) || 0;
  const selfReportedIncome = parseFloat(formik.values.selfReportedMonthlyIncome) || 0;
  const averageMonthlyIncome = monthsEmployed > 0 ? (selfReportedIncome * monthsEmployed) / 12 : 0;

  // No remark handling here - remarks are handled in SalarySlipVerification component
  

  // Save all family members' household income
  const saveAllHouseholdIncomes = async () => {
    try {
      setSubmittingSalary(true);
      
      // Validate application ID first
      if (!formik.values.applicationId || isNaN(parseInt(formik.values.applicationId))) {
        toast.error('Invalid application ID. Please refresh the page.');
        return;
      }
      
      // Filter out empty family members
      const validMembers = familyMembers.filter(member => 
        member.unit && member.annualIncome && parseFloat(member.annualIncome) > 0
      );
      
      // Save household income for each valid family member (if any)
      if (validMembers.length > 0) {
        // Save each family member individually
        const savePromises = validMembers.map(async (member) => {
          const householdData = {
            application_id: parseInt(formik.values.applicationId),
            house_holder_family: member.unit,
            nature_of_work: member.natureOfWork || 'Self-employed',
            contact_no: member.contactNo || '',
            annual_income: parseFloat(member.annualIncome) || 0
          };
          
          return await salaryService.addHouseholdIncome(householdData);
        });
        
        await Promise.all(savePromises);
      }
      
      // Now save the salary verification data
      const salaryVerificationData = {
        application_id: parseInt(formik.values.applicationId),
        organization_applied: formik.values.organizationSameAsApplied || '',
        organization_applied_status: formik.values.organizationSameAsAppliedStatus || '',
        gross_amount_salary: formik.values.grossAmountSalary && formik.values.grossAmountSalary.trim() !== '' ? 'Yes' : 'No',
        gross_amount_salary_status: formik.values.grossAmountSalaryStatus || '',
        net_amount_salary: formik.values.netAmountSalary && formik.values.netAmountSalary.trim() !== '' ? 'Yes' : 'No',
        net_amount_salary_status: formik.values.netAmountSalaryStatus || '',
        monthly_salary_date: formik.values.salaryDate && formik.values.salaryDate.trim() !== '' ? formik.values.salaryDate : null,
        avail_amenities: formik.values.availabilityOfBasicAmenities || '',
        ava_assets: formik.values.availabilityOfOtherAssets || '',
        primary_income: formik.values.primarySourceOfIncome || '',
        nature_of_work: formik.values.natureOfWork || '',
        frequency_income: formik.values.frequencyOfIncome || '',
        month_employment_last_one_year: formik.values.monthsOfEmployment ? formik.values.monthsOfEmployment.toString() : '0',
        self_reported_monthly_income: parseFloat(formik.values.selfReportedMonthlyIncome) || 0,
        average_monthly_income: parseFloat(averageMonthlyIncome) || 0,
        salaryslip_final_report: formik.values.incomeVerificationFinalReport || ''
      };
      
      await salaryService.saveSalaryVerification(salaryVerificationData);
      
      // Success message
      toast.success('Income verification completed successfully!');
    } catch (error) {
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || 'Validation failed. Please check all required fields.';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to save income verification');
      }
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
                      onChange={(e) => formik.setFieldValue('organizationSameAsApplied', e.target.value)}
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
                  <label className={subLabelClassName}>Gross Salary</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={formik.values.grossAmountSalary || ''}
                      onChange={(e) => formik.setFieldValue('grossAmountSalary', e.target.value)}
                      className={inputClassName}
                      placeholder="₹"
                    />
                    <select
                      value={formik.values.grossAmountSalary ? 'Yes' : ''}
                      onChange={(e) => {
                        // This is auto-set based on whether value exists
                      }}
                      className={selectClassName}
                    >
                      <option value="">Verified</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
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

                {/* Net Salary */}
                <div>
                  <label className={subLabelClassName}>Net Salary</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={formik.values.netAmountSalary || ''}
                      onChange={(e) => formik.setFieldValue('netAmountSalary', e.target.value)}
                      className={inputClassName}
                      placeholder="₹"
                    />
                    <select
                      value={formik.values.netAmountSalary ? 'Yes' : ''}
                      onChange={(e) => {
                        // This is auto-set based on whether value exists
                      }}
                      className={selectClassName}
                    >
                      <option value="">Verified</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
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

            {/* Salary Date and Net Household Income - Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`text-sm font-medium mb-2 block ${isDark ? "text-emerald-300" : "text-gray-700"}`}>
                  Salary Date
                </label>
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
                {familyMembers.map((member, index) => (
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
                          placeholder="Contact number"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className={subLabelClassName}>Annual Income</label>
                        <input
                          type="number"
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

            {/* Basic Information Block */}
            <div className={`${fieldClassName}`}>
              <label className={labelClassName}>Basic Information</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className={subLabelClassName}>Basic Amenities</label>
                  <select
                    value={formik.values.availabilityOfBasicAmenities || ''}
                    onChange={(e) => formik.setFieldValue('availabilityOfBasicAmenities', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Select</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Toilet">Toilet</option>
                    <option value="Sewage">Sewage</option>
                    <option value="LPG Connection">LPG Connection</option>
                  </select>
                </div>

                <div>
                  <label className={subLabelClassName}>Other Assets</label>
                  <select
                    value={formik.values.availabilityOfOtherAssets || ''}
                    onChange={(e) => formik.setFieldValue('availabilityOfOtherAssets', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Select</option>
                    <option value="Land">Land</option>
                    <option value="Livestock">Livestock</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Electronic Item">Electronic Item</option>
                  </select>
                </div>

                <div>
                  <label className={subLabelClassName}>Primary Income Source</label>
                  <select
                    value={formik.values.primarySourceOfIncome || ''}
                    onChange={(e) => formik.setFieldValue('primarySourceOfIncome', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Select</option>
                    <option value="Agriculture & Allied Activities">Agriculture & Allied Activities</option>
                    <option value="Trading">Trading</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Services">Services</option>
                  </select>
                </div>

                <div>
                  <label className={subLabelClassName}>Nature of Work</label>
                  <select
                    value={formik.values.natureOfWork || ''}
                    onChange={(e) => formik.setFieldValue('natureOfWork', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Select</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Regular">Regular</option>
                    <option value="Sessional">Sessional</option>
                  </select>
                </div>

                <div>
                  <label className={subLabelClassName}>Frequency of Income</label>
                  <select
                    value={formik.values.frequencyOfIncome || ''}
                    onChange={(e) => formik.setFieldValue('frequencyOfIncome', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Select</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Employment Details Block */}
            <div className={`${fieldClassName}`}>
              <label className={labelClassName}>Employment Details</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={subLabelClassName}>Months of employment over last one year</label>
                  <input
                    type="number"
                    value={formik.values.monthsOfEmployment || ''}
                    onChange={(e) => formik.setFieldValue('monthsOfEmployment', e.target.value)}
                    className={inputClassName}
                    placeholder="Enter months"
                    min="0"
                    max="12"
                  />
                </div>

                <div>
                  <label className={subLabelClassName}>Self-reported monthly income</label>
                  <input
                    type="number"
                    value={formik.values.selfReportedMonthlyIncome || ''}
                    onChange={(e) => formik.setFieldValue('selfReportedMonthlyIncome', e.target.value)}
                    className={inputClassName}
                    placeholder="₹"
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
                <div className=" w-50">
                  <label className={`text-sm font-semibold mb-2 block ${isDark ? "text-blue-500" : "text-blue-700"}`}>
                    Final Report
                  </label>
                  <select
                    value={formik.values.incomeVerificationFinalReport || ''}
                    onChange={(e) => formik.setFieldValue('incomeVerificationFinalReport', e.target.value)}
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