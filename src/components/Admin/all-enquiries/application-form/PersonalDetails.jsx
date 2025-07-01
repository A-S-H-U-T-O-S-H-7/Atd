import React from 'react';
import { User } from 'lucide-react';

const PersonalDetails = ({ formik, isDark }) => {
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

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

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
            <label className={labelClassName}>Form No.</label>
            <input
              type="text"
              name="formNo"
              value={formik.values.formNo}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Auto-generated"
            />
          </div>

          <div>
            <label className={labelClassName}>Phone No.</label>
            <input
              type="tel"
              name="phoneNo"
              value={formik.values.phoneNo}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter phone number"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className={labelClassName}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className={labelClassName}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter last name"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>Father's Name</label>
            <input
              type="text"
              name="fatherName"
              value={formik.values.fatherName}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter father's name"
            />
          </div>

          <div>
            <label className={labelClassName}>Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className={labelClassName}>Gender</label>
            <select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              className={selectClassName}
            >
              <option value="">--Please Select Gender--</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>Date of Birth</label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={formik.values.dob.day}
                onChange={(e) => handleNestedChange('dob', 'day', e.target.value)}
                className={selectClassName}
              >
                <option value="">Day</option>
                {Array.from({length: 31}, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <select
                value={formik.values.dob.month}
                onChange={(e) => handleNestedChange('dob', 'month', e.target.value)}
                className={selectClassName}
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
                className={selectClassName}
              >
                <option value="">Year</option>
                {Array.from({length: 80}, (_, i) => {
                  const year = new Date().getFullYear() - 18 - i;
                  return <option key={year} value={year}>{year}</option>
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;