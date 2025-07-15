import React from 'react';
import { Building, AlertTriangle } from 'lucide-react';

const OrganizationDetails = ({ formik, isDark, errors = {} }) => {
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

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const errorLabelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const errorTextClassName = `text-xs mt-1 flex items-center space-x-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  // Helper function to get field error
  const getFieldError = (fieldName) => {
    // Check multiple possible field name variations
    const possibleNames = [
      fieldName,
      fieldName.replace(/([A-Z])/g, '_$1').toLowerCase(),
      fieldName.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(),
      // Additional mappings for organization fields
      fieldName === 'organisationName' ? 'organisation_name' : null,
      fieldName === 'organisationAddress' ? 'organisation_address' : null,
      fieldName === 'officePhone' ? 'office_phone' : null,
      fieldName === 'contactPerson' ? 'contact_person' : null,
      fieldName === 'mobileNo' ? 'mobile_no' : null,
      fieldName === 'hrMail' ? 'hr_mail' : null,
      fieldName === 'officialEmail' ? 'office_mail' : null,
      fieldName === 'grossMonthlySalary' ? 'gross_montly_salary' : null,
      fieldName === 'workSinceMm' ? 'work_since_mm' : null,
      fieldName === 'workSinceYy' ? 'work_since_yy' : null,
      fieldName === 'netHouseHoldIncome' ? 'net_house_hold_income' : null,
      fieldName === 'netMonthlySalary' ? 'net_monthly_salary' : null,
    ].filter(Boolean);
    
    for (const name of possibleNames) {
      if (errors[name]) {
        return errors[name];
      }
    }
    return null;
  };

  // Helper function to check if field has error
  const hasError = (fieldName) => {
    return getFieldError(fieldName) !== null;
  };

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
          {/* Organization Name */}
          <div>
            <label className={hasError('organisationName') ? errorLabelClassName : labelClassName}>
              Name
            </label>
            <input
              type="text"
              name="organisationName"
              value={formik.values.organisationName}
              onChange={formik.handleChange}
              className={hasError('organisationName') ? errorInputClassName : inputClassName}
              placeholder="Enter organization name"
            />
            {hasError('organisationName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('organisationName')}</span>
              </div>
            )}
          </div>

          {/* Organization Address */}
          <div>
            <label className={hasError('organisationAddress') ? errorLabelClassName : labelClassName}>
              Address
            </label>
            <textarea
              name="organisationAddress"
              value={formik.values.organisationAddress}
              onChange={formik.handleChange}
              className={hasError('organisationAddress') ? errorInputClassName : inputClassName}
              placeholder="Enter organization address"
              rows="2"
            />
            {hasError('organisationAddress') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('organisationAddress')}</span>
              </div>
            )}
          </div>

          {/* Office Phone */}
          <div>
            <label className={hasError('officePhone') ? errorLabelClassName : labelClassName}>
              Office Phone
            </label>
            <input
              type="tel"
              name="officePhone"
              value={formik.values.officePhone}
              onChange={formik.handleChange}
              className={hasError('officePhone') ? errorInputClassName : inputClassName}
              placeholder="Enter office phone number"
            />
            {hasError('officePhone') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('officePhone')}</span>
              </div>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label className={hasError('contactPerson') ? errorLabelClassName : labelClassName}>
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formik.values.contactPerson}
              onChange={formik.handleChange}
              className={hasError('contactPerson') ? errorInputClassName : inputClassName}
              placeholder="Enter contact person name"
            />
            {hasError('contactPerson') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('contactPerson')}</span>
              </div>
            )}
          </div>

          {/* Mobile No */}
          <div>
            <label className={hasError('mobileNo') ? errorLabelClassName : labelClassName}>
              Mobile No
            </label>
            <input
              type="tel"
              name="mobileNo"
              value={formik.values.mobileNo}
              onChange={formik.handleChange}
              className={hasError('mobileNo') ? errorInputClassName : inputClassName}
              placeholder="Enter mobile number"
            />
            {hasError('mobileNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('mobileNo')}</span>
              </div>
            )}
          </div>

          {/* HR Mail Id */}
          <div>
            <label className={hasError('hrMail') ? errorLabelClassName : labelClassName}>
              HR Mail Id
            </label>
            <input
              type="email"
              name="hrMail"
              value={formik.values.hrMail}
              onChange={formik.handleChange}
              className={hasError('hrMail') ? errorInputClassName : inputClassName}
              placeholder="Enter HR email address"
            />
            {hasError('hrMail') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('hrMail')}</span>
              </div>
            )}
          </div>

          {/* Website */}
          <div>
            <label className={hasError('website') ? errorLabelClassName : labelClassName}>
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formik.values.website}
              onChange={formik.handleChange}
              className={hasError('website') ? errorInputClassName : inputClassName}
              placeholder="Enter website URL"
            />
            {hasError('website') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('website')}</span>
              </div>
            )}
          </div>

          {/* Official Mail Id */}
          <div>
            <label className={hasError('officialEmail') ? errorLabelClassName : labelClassName}>
              Official Mail Id
            </label>
            <input
              type="email"
              name="officialEmail"
              value={formik.values.officialEmail}
              onChange={formik.handleChange}
              className={hasError('officialEmail') ? errorInputClassName : inputClassName}
              placeholder="Enter official email address"
            />
            {hasError('officialEmail') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('officialEmail')}</span>
              </div>
            )}
          </div>

          {/* Gross Monthly Salary */}
          <div>
            <label className={hasError('grossMonthlySalary') ? errorLabelClassName : labelClassName}>
              Gross Monthly Salary
            </label>
            <input
              type="number"
              name="grossMonthlySalary"
              value={formik.values.grossMonthlySalary}
              onChange={formik.handleChange}
              className={hasError('grossMonthlySalary') ? errorInputClassName : inputClassName}
              placeholder="Enter gross monthly salary"
            />
            {hasError('grossMonthlySalary') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('grossMonthlySalary')}</span>
              </div>
            )}
          </div>

          {/* Working Month */}
          <div>
            <label className={hasError('workSinceMm') ? errorLabelClassName : labelClassName}>
              Working Month
            </label>
            <input
              type="number"
              name="workSinceMm"
              value={formik.values.workSinceMm}
              onChange={formik.handleChange}
              className={hasError('workSinceMm') ? errorInputClassName : inputClassName}
              placeholder="Enter working month"
              min="1"
              max="12"
            />
            {hasError('workSinceMm') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('workSinceMm')}</span>
              </div>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className={hasError('designation') ? errorLabelClassName : labelClassName}>
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formik.values.designation}
              onChange={formik.handleChange}
              className={hasError('designation') ? errorInputClassName : inputClassName}
              placeholder="Enter designation"
            />
            {hasError('designation') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('designation')}</span>
              </div>
            )}
          </div>

          {/* Working Year */}
          <div>
            <label className={hasError('workSinceYy') ? errorLabelClassName : labelClassName}>
              Working Year
            </label>
            <input
              type="number"
              name="workSinceYy"
              value={formik.values.workSinceYy}
              onChange={formik.handleChange}
              className={hasError('workSinceYy') ? errorInputClassName : inputClassName}
              placeholder="Enter working year"
              min="1900"
              max="2100"
            />
            {hasError('workSinceYy') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('workSinceYy')}</span>
              </div>
            )}
          </div>

          {/* Net House Hold Income (Annual) */}
          <div>
            <label className={hasError('netHouseHoldIncome') ? errorLabelClassName : labelClassName}>
              Net House Hold Income (Annual)
            </label>
            <input
              type="number"
              name="netHouseHoldIncome"
              value={formik.values.netHouseHoldIncome}
              onChange={formik.handleChange}
              className={hasError('netHouseHoldIncome') ? errorInputClassName : inputClassName}
              placeholder="Enter net house hold income"
            />
            {hasError('netHouseHoldIncome') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('netHouseHoldIncome')}</span>
              </div>
            )}
          </div>

          {/* Net Monthly Salary */}
          <div>
            <label className={hasError('netMonthlySalary') ? errorLabelClassName : labelClassName}>
              Net Monthly Salary
            </label>
            <input
              type="number"
              name="netMonthlySalary"
              value={formik.values.netMonthlySalary}
              onChange={formik.handleChange}
              className={hasError('netMonthlySalary') ? errorInputClassName : inputClassName}
              placeholder="Enter net monthly salary"
            />
            {hasError('netMonthlySalary') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('netMonthlySalary')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;