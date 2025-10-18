import React from 'react';
import { User, CreditCard, Building, MapPin, House } from 'lucide-react';

const BasicInformation = ({ formik, isDark }) => {
  // Enhanced field styling with better visibility
  const fieldClassName = `p-3 rounded-lg border transition-all duration-200 ${
    isDark
      ? "bg-gray-800/60 border-gray-600 hover:border-emerald-500/40 shadow-lg"
      : "bg-emerald-50/80 border-emerald-200 hover:border-emerald-300 shadow-sm"
  }`;

  const labelClassName = `text-xs font-semibold mb-1 flex items-center space-x-2 ${
    isDark ? "text-gray-300" : "text-emerald-700"
  }`;

  const valueClassName = `text-sm font-medium truncate ${
    isDark ? "text-white" : "text-gray-800"
  }`;

  const unavailableClassName = `text-xs italic ${
    isDark ? "text-gray-400" : "text-gray-500"
  }`;

  // Icon wrapper component
  const IconWrapper = ({ icon: Icon, className = "" }) => (
    <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"} ${className}`} />
  );

  // Format account details properly
  const formatAccountDetails = (accountNo, bankName, branchName) => {
    const accountNumber = accountNo || 'N/A';
    const bank = bankName || 'N/A';
    const branch = branchName || 'N/A';
    
    return `${accountNumber}, ${bank}, ${branch}`;
  };

  // Get data with N/A fallback
  const getFieldValue = (value) => value || 'N/A';

  const data = {
    name: getFieldValue(formik.values?.name),
    crnNo: getFieldValue(formik.values?.crnNo),
    organizationName: getFieldValue(formik.values?.organizationName),
    loanAccountNo: getFieldValue(formik.values?.loanAccountNo),
    state: getFieldValue(formik.values?.state),
    city: getFieldValue(formik.values?.city),
    ifscCode: getFieldValue(formik.values?.ifscCode),
    accountNumber: getFieldValue(formik.values?.accountNumber),
    bankName: getFieldValue(formik.values?.bankName),
    branchName: getFieldValue(formik.values?.branchName),
  };

  // Format complete account details
  const completeAccountDetails = formatAccountDetails(
    data.accountNumber,
    data.bankName,
    data.branchName
  );

  return (
    <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-emerald-500/20 shadow-2xl shadow-emerald-900/10"
        : "bg-gradient-to-br from-gray-100  border-emerald-200 shadow-lg shadow-emerald-500/10"
    }`}>
      {/* Enhanced Header */}
      <div className={`p-4 border-b ${
        isDark 
          ? "border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900" 
          : "border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100"
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"
          }`}>
            <User className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${
              isDark ? "text-emerald-400" : "text-emerald-700"
            }`}>
              Basic Information
            </h3>
            
          </div>
        </div>
      </div>

      {/* Enhanced Content Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Name */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={User} />
              <span>Full Name</span>
            </div>
            <div className={valueClassName} title={data.name}>
              {data.name}
            </div>
          </div>

          {/* CRN */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={CreditCard} />
              <span>CRN Number</span>
            </div>
            <div className={valueClassName} title={data.crnNo}>
              {data.crnNo}
            </div>
          </div>

          {/* Organization */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={Building} />
              <span>Organization</span>
            </div>
            <div className={valueClassName} title={data.organizationName}>
              {data.organizationName}
            </div>
          </div>

          {/* Loan Account */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={CreditCard} />
              <span>Loan Account No.</span>
            </div>
            <div className={data.loanAccountNo === 'N/A' ? unavailableClassName : valueClassName}>
              {data.loanAccountNo}
            </div>
          </div>

          {/* State */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={MapPin} />
              <span>State</span>
            </div>
            <div className={valueClassName} title={data.state}>
              {data.state}
            </div>
          </div>

          {/* City */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={MapPin} />
              <span>City</span>
            </div>
            <div className={valueClassName} title={data.city}>
              {data.city}
            </div>
          </div>

          {/* IFSC Code */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={House} />
              <span>IFSC Code</span>
            </div>
            <div className={valueClassName} title={data.ifscCode}>
              {data.ifscCode}
            </div>
          </div>

          {/* Account Details */}
<div className={`${fieldClassName} group hover:scale-[1.02] lg:col-span-1`}>
  <div className={labelClassName}>
    <IconWrapper icon={CreditCard} />
    <span>Account Details</span>
  </div>
  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
    <div className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
      {data.accountNumber}
    </div>
    <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>•</span>
    <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
      {data.bankName}
    </div>
    <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>•</span>
    <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
      {data.branchName}
    </div>
  </div>
</div>

        </div>

        
        
      </div>
    </div>
  );
};

export default BasicInformation;