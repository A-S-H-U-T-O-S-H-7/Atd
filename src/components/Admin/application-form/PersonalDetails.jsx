import React from 'react';
import { User, AlertCircle } from 'lucide-react';

const PersonalDetails = ({ formik, isDark, errors = {} }) => {
  const getInputClassName = (fieldName) => {
    const hasError = errors[fieldName] || formik.errors[fieldName];
    return `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
      hasError
        ? isDark
          ? "bg-gray-700 border-red-500 text-white focus:border-red-400"
          : "bg-red-50 border-red-500 text-gray-900 focus:border-red-400"
        : isDark
          ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
    } focus:ring-2 ${
      hasError 
        ? "focus:ring-red-500/20" 
        : "focus:ring-emerald-500/20"
    } focus:outline-none`;
  };

  const getSelectClassName = (fieldName) => {
    const hasError = errors[fieldName] || formik.errors[fieldName];
    return `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
      hasError
        ? isDark
          ? "bg-gray-700 border-red-500 text-white focus:border-red-400"
          : "bg-red-50 border-red-500 text-gray-900 focus:border-red-400"
        : isDark
          ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
    } focus:ring-2 ${
      hasError 
        ? "focus:ring-red-500/20" 
        : "focus:ring-emerald-500/20"
    } focus:outline-none`;
  };

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const handleNestedChange = (parent, field, value) => {
    formik.setFieldValue(`${parent}.${field}`, value);
  };

  const renderFieldError = (fieldName) => {
    const error = errors[fieldName] || formik.errors[fieldName];
    if (!error) return null;

    return (
      <div className="flex items-center space-x-1 mt-1">
        <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
        <span className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
          {error}
        </span>
      </div>
    );
  };

  const renderDobError = () => {
    const dobError = errors.dob || formik.errors.dob;
    if (!dobError) return null;

    return (
      <div className="flex items-center space-x-1 mt-1">
        <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
        <span className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
          {dobError}
        </span>
      </div>
    );
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <User className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Personal Details
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>Form No.</label>
            <input
              type="text"
              name="formNo"
              value={formik.values.formNo}
              onChange={formik.handleChange}
              className={getInputClassName('formNo')}
              placeholder="Auto-generated"
            />
            {renderFieldError('formNo')}
          </div>

          <div>
            <label className={labelClassName}>Phone No. <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phoneNo"
              value={formik.values.phoneNo}
              onChange={formik.handleChange}
              className={getInputClassName('phoneNo')}
              placeholder="Enter phone number"
            />
            {renderFieldError('phoneNo')}
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className={getInputClassName('name')}
              placeholder="Enter full name"
            />
            {renderFieldError('name')}
          </div>

          <div>
            <label className={labelClassName}>First Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              className={getInputClassName('firstName')}
              placeholder="Enter first name"
            />
            {renderFieldError('firstName')}
          </div>

          <div>
            <label className={labelClassName}>Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              className={getInputClassName('lastName')}
              placeholder="Enter last name"
            />
            {renderFieldError('lastName')}
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>Father's Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fatherName"
              value={formik.values.fatherName}
              onChange={formik.handleChange}
              className={getInputClassName('fatherName')}
              placeholder="Enter father's name"
            />
            {renderFieldError('fatherName')}
          </div>

          <div>
            <label className={labelClassName}>Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className={getInputClassName('email')}
              placeholder="Enter email address"
            />
            {renderFieldError('email')}
          </div>

          <div>
            <label className={labelClassName}>Gender <span className="text-red-500">*</span></label>
            <select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              className={getSelectClassName('gender')}
            >
              <option value="">--Please Select Gender--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {renderFieldError('gender')}
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>Date of Birth <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={formik.values.dob.day}
                onChange={(e) => handleNestedChange('dob', 'day', e.target.value)}
                className={getSelectClassName('dob')}
              >
                <option value="">Day</option>
                {Array.from({length: 31}, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <select
                value={formik.values.dob.month}
                onChange={(e) => handleNestedChange('dob', 'month', e.target.value)}
                className={getSelectClassName('dob')}
              >
                <option value="">Month</option>
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
              <select
                value={formik.values.dob.year}
                onChange={(e) => handleNestedChange('dob', 'year', e.target.value)}
                className={getSelectClassName('dob')}
              >
                <option value="">Year</option>
                {Array.from({length: 70}, (_, i) => {
                  const year = new Date().getFullYear() - 18 - i;
                  return <option key={year} value={year}>{year}</option>
                })}
              </select>
            </div>
            {renderDobError()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;