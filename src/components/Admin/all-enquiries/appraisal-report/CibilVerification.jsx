import React from 'react';
import { CreditCard, Save } from 'lucide-react';

const CibilVerification = ({ formik, onSectionSave, isDark }) => {
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
    <div className={`rounded-xl mt-8 shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            CIBIL Verification Link
          </h3>
        </div>

        {/* Static Information Display */}
        <div className={`p-4 rounded-lg mb-4 ${
          isDark ? "bg-gray-700/50" : "bg-gray-100"
        }`}>
          <div className="text-sm space-y-1">
            <p><strong>Name:</strong> Harikiran B M</p>
            <p><strong>Mobile:</strong> 7259298095</p>
            <p><strong>Address:</strong> Roshni Manor Mig-1, Khb Colony Opp Govt Boys Hostel Bidadi VTC: Bidadi PO: Bidadi</p>
            <p><strong>State:</strong> Karnataka, <strong>City:</strong> Ramanagara, <strong>Pincode:</strong> 562109</p>
            <p><strong>PAN No:</strong> ANJPH8452R, <strong>DoB:</strong> 9-1-1993</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClassName}>Score (&gt;500):</label>
              <input
                type="text"
                value={formik.values.cibilScore || ''}
                onChange={(e) => formik.setFieldValue('cibilScore', e.target.value)}
                className={inputClassName}
                placeholder="746"
              />
            </div>
            <div>
              <label className={labelClassName}>Score Status:</label>
              <select
                value={formik.values.cibilScoreStatus || ''}
                onChange={(e) => formik.setFieldValue('cibilScoreStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>Total No of Active Loan:</label>
              <input
                type="text"
                value={formik.values.totalActiveLoans || ''}
                onChange={(e) => formik.setFieldValue('totalActiveLoans', e.target.value)}
                className={inputClassName}
                placeholder="2"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClassName}>Active Loan Status:</label>
              <select
                value={formik.values.activeLoanStatus || ''}
                onChange={(e) => formik.setFieldValue('activeLoanStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>Total No of Closed Loan:</label>
              <input
                type="text"
                value={formik.values.totalClosedLoans || ''}
                onChange={(e) => formik.setFieldValue('totalClosedLoans', e.target.value)}
                className={inputClassName}
                placeholder="1"
              />
            </div>
            <div>
              <label className={labelClassName}>Closed Loan Status:</label>
              <select
                value={formik.values.closedLoanStatus || ''}
                onChange={(e) => formik.setFieldValue('closedLoanStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>No of Write off/settled:</label>
              <input
                type="text"
                value={formik.values.writeOffSettled || ''}
                onChange={(e) => formik.setFieldValue('writeOffSettled', e.target.value)}
                className={inputClassName}
                placeholder="00"
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClassName}>Write Off Status:</label>
              <select
                value={formik.values.writeOffStatus || ''}
                onChange={(e) => formik.setFieldValue('writeOffStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>No of Overdue:</label>
              <input
                type="text"
                value={formik.values.noOfOverdue || ''}
                onChange={(e) => formik.setFieldValue('noOfOverdue', e.target.value)}
                className={inputClassName}
                placeholder="1"
              />
            </div>
            <div>
              <label className={labelClassName}>Overdue Status:</label>
              <select
                value={formik.values.overdueStatus || ''}
                onChange={(e) => formik.setFieldValue('overdueStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>Total EMI As Per Cibil:</label>
              <input
                type="text"
                value={formik.values.totalEmiAsCibil || ''}
                onChange={(e) => formik.setFieldValue('totalEmiAsCibil', e.target.value)}
                className={inputClassName}
                placeholder="60000"
              />
            </div>
          </div>

          {/* DPD Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClassName}>DPD:</label>
              <select
                value={formik.values.dpd || ''}
                onChange={(e) => formik.setFieldValue('dpd', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select DPD</option>
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>DPD Status:</label>
              <select
                value={formik.values.dpdStatus || ''}
                onChange={(e) => formik.setFieldValue('dpdStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>EMI Status:</label>
              <select
                value={formik.values.emiStatus || ''}
                onChange={(e) => formik.setFieldValue('emiStatus', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className={labelClassName}>Comment:</label>
            <textarea
              rows="3"
              value={formik.values.cibilComment || ''}
              onChange={(e) => formik.setFieldValue('cibilComment', e.target.value)}
              className={textareaClassName}
              placeholder="Enter comment"
            />
          </div>

          {/* Remark */}
          <div>
            <label className={labelClassName}>Remark:</label>
            <textarea
              rows="3"
              value={formik.values.cibilRemark || ''}
              onChange={(e) => formik.setFieldValue('cibilRemark', e.target.value)}
              className={textareaClassName}
              placeholder="Enter remark"
            />
          </div>

          {/* Final Report */}
          <div>
            <label className={labelClassName}>Final Report:</label>
            <select
              value={formik.values.cibilFinalReport || ''}
              onChange={(e) => formik.setFieldValue('cibilFinalReport', e.target.value)}
              className={selectClassName}
            >
              <option value="">Select Final Report</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
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

export default CibilVerification;