import React from 'react';
import { Building } from 'lucide-react';

const OrganizationDetails = ({ formik, isDark }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
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
          <Building className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Organization Details
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>Name</label>
            <input
              type="text"
              name="organisationName"
              value={formik.values.organisationName}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter organization name"
            />
          </div>

          <div>
            <label className={labelClassName}>Address</label>
            <textarea
              name="organisationAddress"
              value={formik.values.organisationAddress}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter organization address"
              rows="2"
            />
          </div>

          <div>
            <label className={labelClassName}>Office Phone</label>
            <input
              type="tel"
              name="officePhone"
              value={formik.values.officePhone}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter office phone number"
            />
          </div>

          <div>
            <label className={labelClassName}>Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formik.values.contactPerson}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter contact person name"
            />
          </div>

          <div>
            <label className={labelClassName}>Mobile No</label>
            <input
              type="tel"
              name="mobileNo"
              value={formik.values.mobileNo}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter mobile number"
            />
          </div>

          <div>
            <label className={labelClassName}>HR Mail Id</label>
            <input
              type="email"
              name="hrMail"
              value={formik.values.hrMail}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter HR email address"
            />
          </div>

          <div>
            <label className={labelClassName}>Website</label>
            <input
              type="url"
              name="website"
              value={formik.values.website}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter website URL"
            />
          </div>

          <div>
            <label className={labelClassName}>Official Mail Id</label>
            <input
              type="email"
              name="officialEmail"
              value={formik.values.officialEmail}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter official email address"
            />
          </div>

          <div>
            <label className={labelClassName}>Gross Monthly Salary</label>
            <input
              type="number"
              name="grossMonthlySalary"
              value={formik.values.grossMonthlySalary}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter gross monthly salary"
            />
          </div>

          <div>
            <label className={labelClassName}>Working Month</label>
            <input
              type="number"
              name="workSinceMm"
              value={formik.values.workSinceMm}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter working month"
            />
          </div>

          <div>
            <label className={labelClassName}>Designation</label>
            <input
              type="text"
              name="designation"
              value={formik.values.designation}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter designation"
            />
          </div>

          <div>
            <label className={labelClassName}>Working Year</label>
            <input
              type="number"
              name="workSinceYy"
              value={formik.values.workSinceYy}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter working year"
            />
          </div>

          <div>
            <label className={labelClassName}>Net House Hold Income (Annual)</label>
            <input
              type="number"
              name="netHouseHoldIncome"
              value={formik.values.netHouseHoldIncome}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter net house hold income"
            />
          </div>

          <div>
            <label className={labelClassName}>Net Monthly Salary</label>
            <input
              type="number"
              name="netMonthlySalary"
              value={formik.values.netMonthlySalary}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter net monthly salary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;