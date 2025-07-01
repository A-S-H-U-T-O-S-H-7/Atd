import React from 'react';
import { FileText, Save, Upload } from 'lucide-react';

const SalarySlipVerification = ({ formik, onSectionSave, isDark }) => {
  const textareaClassName = `w-full  px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-sm font-medium mb-2 ${
    isDark ? "text-blue-400" : "text-blue-600"
  }`;

  const buttonClassName = `p-2 rounded-lg transition-all duration-200 ${
    isDark
      ? "bg-gray-700 hover:bg-gray-600 border border-gray-600"
      : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
  }`;

  const salarySlipItems = [
    { icon: '📄', color: 'text-blue-500' },
    { icon: '📄', color: 'text-blue-500' },
    { icon: '📄', color: 'text-blue-500' },
    { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-900' },
    { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-900' },
    { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-900' },
    { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-900' },
    { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-900' },
    { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-900' },
    { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-900' },
    { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-900' },
    { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-900' }
  ];

  return (
    <div
      className={`rounded-xl mt-8 shadow-lg border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
          : "bg-white border-emerald-300 shadow-emerald-500/10"
      }`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <h3 className={`text-lg font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
              Salary Slip Verification
            </h3>
          </div>
          
          {/* Salary Slip Icons */}
          <div className="flex items-center space-x-1">
            {salarySlipItems.map((item, index) => (
              <div
                key={index}
                className={`w-8 h-10 flex items-center justify-center rounded text-xs ${
                  item.bg || 'bg-blue-100'
                } ${item.color} border border-gray-300`}
              >
                {item.icon}
              </div>
            ))}
          </div>
        </div>

        {/* 9rd Salary Slip Badge */}
        <div className="flex justify-end mb-4">
          <span className={`px-3 py-1 rounded text-xs font-medium ${
            isDark ? "bg-gray-700 text-white" : "bg-gray-800 text-white"
          }`}>
            9rd Salary Slip
          </span>
        </div>

        {/* Remark Section */}
        <div>
          <label className={labelClassName}>Remark:</label>
          <textarea
            rows="4"
            value={formik.values.salarySlipRemark}
            onChange={(e) => formik.setFieldValue('salarySlipRemark', e.target.value)}
            className={textareaClassName}
            placeholder="29 Sep 2023 - 73,997.00 ----------
31 Oct 2023 - 73,997.00 ------------
30 Nov 2023 - 1,72,998.00 ----------"
            defaultValue="29 Sep 2023 - 73,997.00 ----------
31 Oct 2023 - 73,997.00 ------------
30 Nov 2023 - 1,72,998.00 ----------"
          />
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

export default SalarySlipVerification;