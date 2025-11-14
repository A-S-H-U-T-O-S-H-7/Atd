import React from 'react';
import { User, AlertTriangle } from 'lucide-react';

const PersonalDetails = ({ formik, isDark, errors = {}, touched = {} }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`; 

  const errorInputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const errorSelectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const errorLabelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const errorTextClassName = `text-xs mt-1 flex items-center space-x-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  // Simple helper function to check if field has error
  const hasError = (fieldName) => {
    return errors[fieldName] && touched[fieldName];
  };

  const handleNestedChange = (parent, field, value) => {
    formik.setFieldValue(`${parent}.${field}`, value);
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
            <label className={hasError('formNo') ? errorLabelClassName : labelClassName}>
              Form No.
            </label>
            <input
              type="text"
              name="formNo"
              value={formik.values.formNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${hasError('formNo') ? errorInputClassName : inputClassName} bg-gray-50 cursor-not-allowed`}
              placeholder="Auto-generated"
              readOnly
            />
            {hasError('formNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.formNo}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('phoneNo') ? errorLabelClassName : labelClassName}>
              Phone No. <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNo"
              value={formik.values.phoneNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('phoneNo') ? errorInputClassName : inputClassName}
              placeholder="Enter phone number"
            />
            {hasError('phoneNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.phoneNo}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={hasError('name') ? errorLabelClassName : labelClassName}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('name') ? errorInputClassName : inputClassName}
              placeholder="Enter full name"
            />
            {hasError('name') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('firstName') ? errorLabelClassName : labelClassName}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('firstName') ? errorInputClassName : inputClassName}
              placeholder="Enter first name"
            />
            {hasError('firstName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.firstName}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('lastName') ? errorLabelClassName : labelClassName}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('lastName') ? errorInputClassName : inputClassName}
              placeholder="Enter last name"
            />
            {hasError('lastName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.lastName}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={hasError('fatherName') ? errorLabelClassName : labelClassName}>
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fatherName"
              value={formik.values.fatherName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('fatherName') ? errorInputClassName : inputClassName}
              placeholder="Enter father's name"
            />
            {hasError('fatherName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.fatherName}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('email') ? errorLabelClassName : labelClassName}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('email') ? errorInputClassName : inputClassName}
              placeholder="Enter email address"
            />
            {hasError('email') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('gender') ? errorLabelClassName : labelClassName}>
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('gender') ? errorSelectClassName : selectClassName}
            >
              <option value="">--Please Select Gender--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {hasError('gender') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.gender}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={hasError('dob') ? errorLabelClassName : labelClassName}>
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={formik.values.dob.day}
                onChange={(e) => handleNestedChange('dob', 'day', e.target.value)}
                onBlur={formik.handleBlur}
                className={hasError('dob') ? errorSelectClassName : selectClassName}
              >
                <option value="">Day</option>
                {Array.from({length: 31}, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <select
                value={formik.values.dob.month}
                onChange={(e) => handleNestedChange('dob', 'month', e.target.value)}
                onBlur={formik.handleBlur}
                className={hasError('dob') ? errorSelectClassName : selectClassName}
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
                onBlur={formik.handleBlur}
                className={hasError('dob') ? errorSelectClassName : selectClassName}
              >
                <option value="">Year</option>
                {Array.from({length: 70}, (_, i) => {
                  const year = new Date().getFullYear() - 18 - i;
                  return <option key={year} value={year}>{year}</option>
                })}
              </select>
            </div>
            {hasError('dob') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.dob}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;