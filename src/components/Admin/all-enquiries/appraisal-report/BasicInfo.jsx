import React from 'react';
import { FileText } from 'lucide-react';

const BasicInformation = ({ formik, isDark }) => {

   console.log('🔍 BASIC INFO - Formik values:', formik.values);
  console.log('🔍 BASIC INFO - Specific fields:', {
    name: formik.values?.name,
    crnNo: formik.values?.crnNo,
    organizationName: formik.values?.organizationName,
    state: formik.values?.state,
    city: formik.values?.city,
    accountDetails: formik.values?.accountDetails,
    ifscCode: formik.values?.ifscCode,
    loanAccountNo: formik.values?.loanAccountNo
  });
  
  const valueClassName = `text-sm font-medium ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  const labelClassName = `text-xs font-medium mb-1 ${
    isDark ? "text-gray-400" : "text-gray-600"
  }`;

  const fieldClassName = `p-3 rounded-lg border ${
    isDark
      ? "bg-gray-700/50 border-gray-600"
      : "bg-gray-50 border-gray-200"
  }`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Basic Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <div className={fieldClassName}>
              <div className={labelClassName}>Name</div>
              <div className={valueClassName}>{formik.values?.name || 'N/A'}</div>
            </div>
          </div>

          <div>
            <div className={fieldClassName}>
              <div className={labelClassName}>CRN</div>
              <div className={valueClassName}>{formik.values?.crnNo || 'N/A'}</div>
            </div>
          </div>

          <div>
            <div className={fieldClassName}>
              <div className={labelClassName}>Loan A/C No.</div>
              <div className={valueClassName}>{formik.values?.loanAccountNo || 'N/A'}</div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className={fieldClassName}>
              <div className={labelClassName}>Name of Organization</div>
              <div className={valueClassName}>{formik.values?.organizationName || 'N/A'}</div>
            </div>
          </div>

          <div>
            <div className={fieldClassName}>
              <div className={labelClassName}>State</div>
              <div className={valueClassName}>{formik.values?.state || 'N/A'}</div>
            </div>
          </div>

          <div>
            <div className={fieldClassName}>
              <div className={labelClassName}>City</div>
              <div className={valueClassName}>{formik.values?.city || 'N/A'}</div>
            </div>
          </div>
          
    
          <div>
            <div className={fieldClassName}>
              <div className={labelClassName}>IFSC Code</div>
              <div className={valueClassName}>{formik.values?.ifscCode || 'N/A'}</div>
            </div>
          </div>

          <div>
            <div className={fieldClassName}>
              <div className={labelClassName}>Account Details</div>
              <div className={valueClassName}>{formik.values?.accountDetails || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation