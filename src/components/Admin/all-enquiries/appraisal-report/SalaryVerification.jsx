import React from 'react';
import { DollarSign, Save } from 'lucide-react';

const SalaryVerification = ({ formik, onSectionSave, isDark }) => {
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

  return (
    <div
      className={`rounded-xl mt-8 shadow-lg border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}
    >
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
            Salary Verification
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>Auto Verification:</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formik.values.salaryAutoVerification}
                  onChange={(e) => formik.setFieldValue('salaryAutoVerification', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <select
                  value={formik.values.salaryAutoVerificationStatus}
                  onChange={(e) => formik.setFieldValue('salaryAutoVerificationStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Status</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClassName}>Salary credited in regular interval:</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formik.values.salaryCreditedRegular}
                  onChange={(e) => formik.setFieldValue('salaryCreditedRegular', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <select
                  value={formik.values.salaryCreditedRegularStatus}
                  onChange={(e) => formik.setFieldValue('salaryCreditedRegularStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Status</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClassName}>If Yes:</label>
              <select
                value={formik.values.salaryInterval}
                onChange={(e) => formik.setFieldValue('salaryInterval', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select interval</option>
                <option value="1st">1st</option>
                <option value="5th">5th</option>
                <option value="10th">10th</option>
                <option value="15th">15th</option>
                <option value="20th">20th</option>
                <option value="25th">25th</option>
                <option value="30th">30th</option>
                <option value="Last day">Last day</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>Any Emi debited:</label>
              <select
                value={formik.values.anyEmiDebited}
                onChange={(e) => formik.setFieldValue('anyEmiDebited', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>Is this EMI with bank statement?:</label>
              <select
                value={formik.values.isEmiWithBankStatement}
                onChange={(e) => formik.setFieldValue('isEmiWithBankStatement', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>Is this the salary account of the customer?: 040811800183​33</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formik.values.isSalaryAccount}
                  onChange={(e) => formik.setFieldValue('isSalaryAccount', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <select
                  value={formik.values.isSalaryAccountStatus}
                  onChange={(e) => formik.setFieldValue('isSalaryAccountStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Status</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClassName}>If No (Remark):</label>
              <textarea
                rows="3"
                value={formik.values.salaryAccountRemark}
                onChange={(e) => formik.setFieldValue('salaryAccountRemark', e.target.value)}
                className={textareaClassName}
                placeholder="Enter remark if no"
              />
            </div>

            <div>
              <label className={labelClassName}>If Yes:</label>
              <div className="text-sm text-gray-600 mb-1">75000</div>
              <input
                type="number"
                value={formik.values.salaryAmount}
                onChange={(e) => formik.setFieldValue('salaryAmount', e.target.value)}
                className={inputClassName}
                placeholder="60000"
              />
            </div>
          </div>
        </div>

        {/* Remark Section */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div>
            <label className={labelClassName}>Remark:</label>
            <textarea
              rows="3"
              value={formik.values.salaryVerificationRemark}
              onChange={(e) => formik.setFieldValue('salaryVerificationRemark', e.target.value)}
              className={textareaClassName}
              placeholder="Enter salary verification remarks"
            />
          </div>
        </div>

        {/* Final Report */}
        <div className="mt-4">
          <label className={labelClassName}>Final Report:</label>
          <select
            value={formik.values.salaryVerificationFinalReport}
            onChange={(e) => formik.setFieldValue('salaryVerificationFinalReport', e.target.value)}
            className={selectClassName}
          >
            <option value="">Select final report</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
          </select>
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

export default SalaryVerification;