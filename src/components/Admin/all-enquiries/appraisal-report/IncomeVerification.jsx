import React from 'react';
import { DollarSign, Save, Plus, X } from 'lucide-react';

const IncomeVerification = ({ formik, onSectionSave, isDark }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  // Add new family member
  const addFamilyMember = () => {
    const newMember = {
      individualFamilyUnit: '',
      natureOfWork: '',
      contactNo: '',
      annualIncome: ''
    };
    const currentMembers = formik.values.familyMembers || [];
    formik.setFieldValue('familyMembers', [...currentMembers, newMember]);
  };

  // Remove family member
  const removeFamilyMember = (index) => {
    const currentMembers = formik.values.familyMembers || [];
    const updatedMembers = currentMembers.filter((_, i) => i !== index);
    formik.setFieldValue('familyMembers', updatedMembers);
  };

  // Update family member field
  const updateFamilyMember = (index, field, value) => {
    const currentMembers = formik.values.familyMembers || [];
    const updatedMembers = [...currentMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    formik.setFieldValue('familyMembers', updatedMembers);
    
    // Calculate total household income
    const totalIncome = updatedMembers.reduce((sum, member) => {
      return sum + (parseFloat(member.annualIncome) || 0);
    }, 0);
    formik.setFieldValue('totalHouseHoldIncome', totalIncome);
  };

  const relationOptions = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'];
  const workNatureOptions = ['Self-employed', 'Salaried', 'Business', 'Freelancer', 'Retired', 'Student', 'Housewife', 'Other'];
  const yesNoOptions = ['Yes', 'No'];
  const positiveNegativeOptions = ['Positive', 'Negative'];
  const amenityOptions = ['Electricity', 'Water Supply', 'Gas Connection', 'Internet', 'None'];
  const assetOptions = ['Land', 'Vehicle', 'House', 'Gold', 'Savings', 'None'];
  const incomeSourceOptions = ['Trading', 'Business', 'Salary', 'Investment', 'Agriculture', 'Other'];
  const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  return (
    <div className={`rounded-xl mt-8 shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Income Verification
          </h3>
        </div>

        <div className="space-y-6">
          {/* Basic Income Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Organization same as applied:</label>
              <div className="flex space-x-2">
                <select
                  value={formik.values.organizationSameAsApplied || ''}
                  onChange={(e) => formik.setFieldValue('organizationSameAsApplied', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select</option>
                  {yesNoOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={formik.values.organizationSameAsAppliedStatus || ''}
                  onChange={(e) => formik.setFieldValue('organizationSameAsAppliedStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Status</option>
                  {positiveNegativeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClassName}>Gross Amount Salary:</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formik.values.grossAmountSalary || ''}
                  onChange={(e) => formik.setFieldValue('grossAmountSalary', e.target.value)}
                  className={inputClassName}
                  placeholder="Enter gross salary"
                />
                <select
                  value={formik.values.grossAmountSalaryVerified || ''}
                  onChange={(e) => formik.setFieldValue('grossAmountSalaryVerified', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select</option>
                  {yesNoOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={formik.values.grossAmountSalaryStatus || ''}
                  onChange={(e) => formik.setFieldValue('grossAmountSalaryStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Status</option>
                  {positiveNegativeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Net Amount Salary:</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formik.values.netAmountSalary || ''}
                  onChange={(e) => formik.setFieldValue('netAmountSalary', e.target.value)}
                  className={inputClassName}
                  placeholder="Enter net salary"
                />
                <select
                  value={formik.values.netAmountSalaryVerified || ''}
                  onChange={(e) => formik.setFieldValue('netAmountSalaryVerified', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select</option>
                  {yesNoOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={formik.values.netAmountSalaryStatus || ''}
                  onChange={(e) => formik.setFieldValue('netAmountSalaryStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Status</option>
                  {positiveNegativeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClassName}>Salary Date:</label>
              <input
                type="date"
                value={formik.values.salaryDate || ''}
                onChange={(e) => formik.setFieldValue('salaryDate', e.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label className={labelClassName}>Net House Hold Income: {formik.values.netHouseHoldIncome || '0'}</label>
            <input
              type="number"
              value={formik.values.netHouseHoldIncome || ''}
              onChange={(e) => formik.setFieldValue('netHouseHoldIncome', e.target.value)}
              className={inputClassName}
              placeholder="Enter net household income"
            />
          </div>

          {/* Family Members Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Family Members Income Details
              </h4>
              <button
                type="button"
                onClick={addFamilyMember}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            {/* Family Members Table */}
            {(formik.values.familyMembers || []).map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label className={`${labelClassName} text-xs`}>Individual Family Unit</label>
                  <select
                    value={member.individualFamilyUnit || ''}
                    onChange={(e) => updateFamilyMember(index, 'individualFamilyUnit', e.target.value)}
                    className={`${selectClassName} text-xs py-1`}
                  >
                    <option value="">Select</option>
                    {relationOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`${labelClassName} text-xs`}>Nature Of Work</label>
                  <select
                    value={member.natureOfWork || ''}
                    onChange={(e) => updateFamilyMember(index, 'natureOfWork', e.target.value)}
                    className={`${selectClassName} text-xs py-1`}
                  >
                    <option value="">Select</option>
                    {workNatureOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`${labelClassName} text-xs`}>Contact No.</label>
                  <input
                    type="tel"
                    value={member.contactNo || ''}
                    onChange={(e) => updateFamilyMember(index, 'contactNo', e.target.value)}
                    className={`${inputClassName} text-xs py-1`}
                    placeholder="Contact number"
                  />
                </div>
                <div>
                  <label className={`${labelClassName} text-xs`}>Annual Income</label>
                  <input
                    type="number"
                    value={member.annualIncome || ''}
                    onChange={(e) => updateFamilyMember(index, 'annualIncome', e.target.value)}
                    className={`${inputClassName} text-xs py-1`}
                    placeholder="Annual income"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-3">
              <label className={labelClassName}>Total House Hold Income: {formik.values.totalHouseHoldIncome || '0'}</label>
            </div>
          </div>

          {/* Additional Income Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Availability of basic amenities:</label>
              <select
                value={formik.values.availabilityOfBasicAmenities || ''}
                onChange={(e) => formik.setFieldValue('availabilityOfBasicAmenities', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select amenity</option>
                {amenityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>Availability of other assets:</label>
              <select
                value={formik.values.availabilityOfOtherAssets || ''}
                onChange={(e) => formik.setFieldValue('availabilityOfOtherAssets', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select asset</option>
                {assetOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Primary source of income:</label>
              <select
                value={formik.values.primarySourceOfIncome || ''}
                onChange={(e) => formik.setFieldValue('primarySourceOfIncome', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select source</option>
                {incomeSourceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>Nature of work:</label>
              <select
                value={formik.values.natureOfWork || ''}
                onChange={(e) => formik.setFieldValue('natureOfWork', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select work nature</option>
                {workNatureOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClassName}>Frequency of income:</label>
              <select
                value={formik.values.frequencyOfIncome || ''}
                onChange={(e) => formik.setFieldValue('frequencyOfIncome', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select frequency</option>
                {frequencyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>Months of employment over last one year:</label>
              <input
                type="number"
                min="0"
                max="12"
                value={formik.values.monthsOfEmployment || ''}
                onChange={(e) => formik.setFieldValue('monthsOfEmployment', e.target.value)}
                className={inputClassName}
                placeholder="Enter months"
              />
            </div>

            <div>
              <label className={labelClassName}>Self-reported monthly income:</label>
              <input
                type="number"
                value={formik.values.selfReportedMonthlyIncome || ''}
                onChange={(e) => formik.setFieldValue('selfReportedMonthlyIncome', e.target.value)}
                className={inputClassName}
                placeholder="Enter monthly income"
              />
            </div>
          </div>

          <div>
            <label className={labelClassName}>
              Average monthly income (Self-reported monthly income X Months of employment over last one year/12):
            </label>
            <input
              type="number"
              value={formik.values.averageMonthlyIncome || ''}
              onChange={(e) => formik.setFieldValue('averageMonthlyIncome', e.target.value)}
              className={inputClassName}
              placeholder="Calculated automatically"
              readOnly
            />
          </div>

          {/* Remark */}
          <div>
            <label className={labelClassName}>Remark:</label>
            <textarea
              rows="3"
              value={formik.values.incomeVerificationRemark || ''}
              onChange={(e) => formik.setFieldValue('incomeVerificationRemark', e.target.value)}
              className={textareaClassName}
              placeholder="Enter income verification remarks"
            />
          </div>

          {/* Final Report */}
          <div>
          <div>
            <label  className={labelClassName}>Final Report:</label>
            <select value={formik.values.socialScoreFinalReport} onChange={e => formik.setFieldValue("socialScoreFinalReport", e.target.value)} className={selectClassName}>
              <option value="">Select Final Report</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="m-4 pt-4 flex justify-end border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onSectionSave}
          className="px-6 py-2 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white rounded-md font-medium transition-all duration-200 flex space-x-2 text-sm"
        >
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default IncomeVerification;