import React from 'react';
import { FileText, User, Phone, Building, CreditCard } from 'lucide-react';

const BasicInformation = ({ formik, isDark }) => {
  const fieldClassName = `p-3 rounded-lg border transition-all duration-200 ${
    isDark
      ? "bg-gray-700/50 border-gray-600 hover:border-emerald-500/50"
      : "bg-gray-50 border-gray-200 hover:border-emerald-300"
  }`;

  const labelClassName = `text-xs font-semibold mb-1 flex items-center space-x-1 ${
    isDark ? "text-gray-300" : "text-gray-600"
  }`;

  const valueClassName = `text-sm font-medium mt-1 ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  const IconWrapper = ({ icon: Icon, className = "" }) => (
    <Icon className={`w-3 h-3 ${className}`} />
  );

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
        <div className="flex items-center space-x-2">
          <FileText className={`w-5 h-5 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Basic Information
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Name */}
          <div className={fieldClassName}>
            <div className={labelClassName}>
              <IconWrapper icon={User} />
              <span>Full Name</span>
            </div>
            <div className={valueClassName}>
              {formik.values?.name || 'Not available'}
            </div>
          </div>

          {/* CRN */}
          <div className={fieldClassName}>
            <div className={labelClassName}>
              <IconWrapper icon={CreditCard} />
              <span>CRN Number</span>
            </div>
            <div className={valueClassName}>
              {formik.values?.crnNo || 'Not available'}
            </div>
          </div>

          {/* Organization */}
          <div className="md:col-span-2">
            <div className={fieldClassName}>
              <div className={labelClassName}>
                <IconWrapper icon={Building} />
                <span>Organization</span>
              </div>
              <div className={valueClassName}>
                {formik.values?.organizationName || 'Not available'}
              </div>
            </div>
          </div>

          {/* Loan Account */}
          <div className={fieldClassName}>
            <div className={labelClassName}>
              <IconWrapper icon={FileText} />
              <span>Loan Account No.</span>
            </div>
            <div className={valueClassName}>
              {formik.values?.loanAccountNo || 'Not available'}
            </div>
          </div>

          {/* Phone */}
          <div className={fieldClassName}>
            <div className={labelClassName}>
              <IconWrapper icon={Phone} />
              <span>Phone Number</span>
            </div>
            <div className={valueClassName}>
              {formik.values?.phoneNo || 'Not available'}
            </div>
          </div>

          {/* Father Name */}
          <div className={fieldClassName}>
            <div className={labelClassName}>
              <IconWrapper icon={User} />
              <span>Father's Name</span>
            </div>
            <div className={valueClassName}>
              {formik.values?.fatherName || 'Not available'}
            </div>
          </div>

          {/* IFSC Code */}
          <div className={fieldClassName}>
            <div className={labelClassName}>
              <IconWrapper icon={CreditCard} />
              <span>IFSC Code</span>
            </div>
            <div className={valueClassName}>
              {formik.values?.ifscCode || 'Not available'}
            </div>
          </div>

          {/* Account Details */}
          <div className={fieldClassName}>
            <div className={labelClassName}>
              <IconWrapper icon={CreditCard} />
              <span>Account Number</span>
            </div>
            <div className={valueClassName}>
              {formik.values?.accountDetails || 'Not available'}
            </div>
          </div>
        </div>

        {/* Document Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {/* PAN */}
          <div className={fieldClassName}>
            <div className={labelClassName}>
              <IconWrapper icon={CreditCard} />
              <span>PAN Number</span>
            </div>
            <div className={valueClassName}>
              {formik.values?.panNo || 'Not available'}
            </div>
          </div>

          {/* Aadhar */}
          <div className={fieldClassName}>
            <div className={labelClassName}>
              <IconWrapper icon={CreditCard} />
              <span>Aadhar Number</span>
            </div>
            <div className={valueClassName}>
              {formik.values?.aadharNo || 'Not available'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;