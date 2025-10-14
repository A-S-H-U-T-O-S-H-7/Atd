import React from 'react';
import { DollarSign, Save, Users, Plus, Trash2, Home, Briefcase, Calendar } from 'lucide-react';

const IncomeVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-semibold mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  const relationOptions = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'];
  const workNatureOptions = ['Self-employed', 'Salaried', 'Business', 'Freelancer', 'Retired', 'Student', 'Housewife', 'Other'];
  const yesNoOptions = ['Yes', 'No'];
  const positiveNegativeOptions = ['Positive', 'Negative'];
  const amenityOptions = ['Electricity', 'Water Supply', 'Gas Connection', 'Internet', 'None'];
  const assetOptions = ['Land', 'Vehicle', 'House', 'Gold', 'Savings', 'None'];
  const incomeSourceOptions = ['Trading', 'Business', 'Salary', 'Investment', 'Agriculture', 'Other'];
  const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

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

  // Calculate average monthly income
  React.useEffect(() => {
    const selfReported = parseFloat(formik.values.selfReportedMonthlyIncome) || 0;
    const months = parseFloat(formik.values.monthsOfEmployment) || 0;
    const average = (selfReported * months) / 12;
    formik.setFieldValue('averageMonthlyIncome', isNaN(average) ? '' : average.toFixed(2));
  }, [formik.values.selfReportedMonthlyIncome, formik.values.monthsOfEmployment]);

  return (
    <div className={`rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/30 shadow-emerald-900/10 hover:shadow-emerald-900/20"
        : "bg-white border-emerald-200 shadow-emerald-500/5 hover:shadow-emerald-500/10"
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? "border-gray-700 bg-gray-800/80" : "border-gray-100 bg-emerald-50/50"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Income Verification
            </h3>
          </div>
          <button
            type="button"
            onClick={onSectionSave}
            disabled={saving}
            className={buttonClassName}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Basic Income Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            {/* Organization Verification */}
            <div>
              <label className={labelClassName}>
                <Briefcase className="w-4 h-4 inline mr-1" />
                Organization Verification
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formik.values.organizationSameAsApplied}
                  onChange={(e) => formik.setFieldValue('organizationSameAsApplied', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Verified?</option>
                  {yesNoOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={formik.values.organizationSameAsAppliedStatus}
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

            {/* Gross Salary */}
            <div>
              <label className={labelClassName}>Gross Salary</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={formik.values.grossAmountSalary}
                  onChange={(e) => formik.setFieldValue('grossAmountSalary', e.target.value)}
                  className={inputClassName}
                  placeholder="Amount"
                />
                <select
                  value={formik.values.grossAmountSalaryVerified}
                  onChange={(e) => formik.setFieldValue('grossAmountSalaryVerified', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Verified?</option>
                  {yesNoOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={formik.values.grossAmountSalaryStatus}
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

          <div className="space-y-4">
            {/* Net Salary */}
            <div>
              <label className={labelClassName}>Net Salary</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={formik.values.netAmountSalary}
                  onChange={(e) => formik.setFieldValue('netAmountSalary', e.target.value)}
                  className={inputClassName}
                  placeholder="Amount"
                />
                <select
                  value={formik.values.netAmountSalaryVerified}
                  onChange={(e) => formik.setFieldValue('netAmountSalaryVerified', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Verified?</option>
                  {yesNoOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={formik.values.netAmountSalaryStatus}
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

            {/* Salary Date & Household Income */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClassName}>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Salary Date
                </label>
                <input
                  type="date"
                  value={formik.values.salaryDate}
                  onChange={(e) => formik.setFieldValue('salaryDate', e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>Net Household Income</label>
                <input
                  type="number"
                  value={formik.values.netHouseHoldIncome}
                  onChange={(e) => formik.setFieldValue('netHouseHoldIncome', e.target.value)}
                  className={inputClassName}
                  placeholder="Amount"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Family Members Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className={`font-semibold flex items-center space-x-2 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
              <Users className="w-4 h-4" />
              <span>Family Members Income</span>
            </h4>
            <button
              type="button"
              onClick={addFamilyMember}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Family Members Grid */}
          <div className="space-y-3">
            {(formik.values.familyMembers || []).map((member, index) => (
              <div key={index} className={`p-4 rounded-lg border transition-all duration-200 ${
                isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h5 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Family Member #{index + 1}
                  </h5>
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className={`p-1 rounded ${
                      isDark 
                        ? "hover:bg-gray-600 text-gray-400" 
                        : "hover:bg-gray-200 text-gray-500"
                    } transition-colors`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className={labelClassName}>Relation</label>
                    <select
                      value={member.individualFamilyUnit}
                      onChange={(e) => updateFamilyMember(index, 'individualFamilyUnit', e.target.value)}
                      className={selectClassName}
                    >
                      <option value="">Select Relation</option>
                      {relationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClassName}>Nature of Work</label>
                    <select
                      value={member.natureOfWork}
                      onChange={(e) => updateFamilyMember(index, 'natureOfWork', e.target.value)}
                      className={selectClassName}
                    >
                      <option value="">Select Work Type</option>
                      {workNatureOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClassName}>Contact No.</label>
                    <input
                      type="tel"
                      value={member.contactNo}
                      onChange={(e) => updateFamilyMember(index, 'contactNo', e.target.value)}
                      className={inputClassName}
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>Annual Income (₹)</label>
                    <input
                      type="number"
                      value={member.annualIncome}
                      onChange={(e) => updateFamilyMember(index, 'annualIncome', e.target.value)}
                      className={inputClassName}
                      placeholder="Annual income"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Household Income */}
          {formik.values.familyMembers && formik.values.familyMembers.length > 0 && (
            <div className={`mt-3 p-3 rounded-lg border ${
              isDark ? "bg-gray-700/30 border-emerald-600/50" : "bg-emerald-50 border-emerald-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  Total Household Income
                </span>
                <span className={`text-lg font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  ₹{formik.values.totalHouseHoldIncome?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Additional Income Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>
                <Home className="w-4 h-4 inline mr-1" />
                Basic Amenities
              </label>
              <select
                value={formik.values.availabilityOfBasicAmenities}
                onChange={(e) => formik.setFieldValue('availabilityOfBasicAmenities', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Amenities</option>
                {amenityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>Primary Income Source</label>
              <select
                value={formik.values.primarySourceOfIncome}
                onChange={(e) => formik.setFieldValue('primarySourceOfIncome', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Source</option>
                {incomeSourceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>Frequency of Income</label>
              <select
                value={formik.values.frequencyOfIncome}
                onChange={(e) => formik.setFieldValue('frequencyOfIncome', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Frequency</option>
                {frequencyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClassName}>Other Assets</label>
              <select
                value={formik.values.availabilityOfOtherAssets}
                onChange={(e) => formik.setFieldValue('availabilityOfOtherAssets', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Assets</option>
                {assetOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>Nature of Work</label>
              <select
                value={formik.values.natureOfWork}
                onChange={(e) => formik.setFieldValue('natureOfWork', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Work Nature</option>
                {workNatureOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClassName}>Employment Months</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={formik.values.monthsOfEmployment}
                  onChange={(e) => formik.setFieldValue('monthsOfEmployment', e.target.value)}
                  className={inputClassName}
                  placeholder="0-12"
                />
              </div>
              <div>
                <label className={labelClassName}>Self-reported Income</label>
                <input
                  type="number"
                  value={formik.values.selfReportedMonthlyIncome}
                  onChange={(e) => formik.setFieldValue('selfReportedMonthlyIncome', e.target.value)}
                  className={inputClassName}
                  placeholder="Monthly"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Income */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className={labelClassName}>Average Monthly Income (Calculated)</label>
            <input
              type="number"
              value={formik.values.averageMonthlyIncome}
              readOnly
              className={`${inputClassName} bg-gray-100 text-gray-600 cursor-not-allowed`}
              placeholder="Auto-calculated"
            />
            <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              (Self-reported × Months) ÷ 12
            </div>
          </div>

          <div>
            <label className={labelClassName}>Final Report</label>
            <select
              value={formik.values.incomeVerificationFinalReport}
              onChange={(e) => formik.setFieldValue('incomeVerificationFinalReport', e.target.value)}
              className={selectClassName}
            >
              <option value="">Select Final Report</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className={labelClassName}>Remarks</label>
          <textarea
            rows="3"
            value={formik.values.incomeVerificationRemark}
            onChange={(e) => formik.setFieldValue('incomeVerificationRemark', e.target.value)}
            className={textareaClassName}
            placeholder="Enter income verification remarks and observations..."
          />
        </div>
      </div>
    </div>
  );
};

export default IncomeVerification;