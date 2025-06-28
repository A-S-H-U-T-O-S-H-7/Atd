import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, Users } from 'lucide-react';

const BasicDetails = ({ userData = {}, isDark = false, onDataChange }) => {
  const [formData, setFormData] = useState({
    formNo: userData.formNo || '',
    name: userData.name || 'Manjunath Manjunath T',
    firstName: userData.firstName || 'Manjunath',
    lastName: userData.lastName || 'Manjunath T',
    fatherName: userData.fatherName || '',
    dobDay: userData.dobDay || '',
    dobMonth: userData.dobMonth || '',
    dobYear: userData.dobYear || '',
    gender: userData.gender || '',
    phoneNo: userData.phoneNo || '9538080375',
    email: userData.email || 'tmmanjunath209@gmail.com',
    amountApproved: userData.amountApproved || '',
    amountApplied: userData.amountApplied || '3000',
    loanTerm: userData.loanTerm || '',
    roi: userData.roi || '0.067',
    tenure: userData.tenure || '90'
  });

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const loanTerms = ['6 months', '12 months', '18 months', '24 months', '36 months'];
  const roiOptions = ['0.067', '0.075', '0.083', '0.092', '0.100'];

  return (
    <div className={`transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${
            isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
          } bg-clip-text text-transparent flex items-center gap-3`}>
            <User className={`w-6 h-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            Basic Details
          </h2>
        </div>

        {/* Form Container */}
        <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}>
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Form Number */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Form No. :
                  </label>
                  <input
                    type="text"
                    value={formData.formNo}
                    onChange={(e) => handleInputChange('formNo', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter form number"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Name :
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                {/* First Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    First Name :
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Last Name :
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                {/* Father's Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Father's Name :
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter father's name"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    <Calendar className="inline w-4 h-4 mr-1" />
                    DOB :
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={formData.dobDay}
                      onChange={(e) => handleInputChange('dobDay', e.target.value)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    >
                      <option value="">Day</option>
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <select
                      value={formData.dobMonth}
                      onChange={(e) => handleInputChange('dobMonth', e.target.value)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    >
                      <option value="">Month</option>
                      {months.map((month, index) => (
                        <option key={month} value={index + 1}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={formData.dobYear}
                      onChange={(e) => handleInputChange('dobYear', e.target.value)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    >
                      <option value="">Year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    <Users className="inline w-4 h-4 mr-1" />
                    Gender :
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    <option value="">--Please Select Gender--</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Phone Number */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    <Phone className="inline w-4 h-4 mr-1" />
                    Phone No. :
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNo}
                    onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    <Mail className="inline w-4 h-4 mr-1" />
                    E-mail :
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                {/* Amount Approved */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Amount Approved :
                  </label>
                  <input
                    type="text"
                    value={formData.amountApproved}
                    onChange={(e) => handleInputChange('amountApproved', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter approved amount"
                  />
                </div>

                {/* Amount Applied */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Amount Applied :
                  </label>
                  <input
                    type="text"
                    value={formData.amountApplied}
                    onChange={(e) => handleInputChange('amountApplied', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                {/* Loan Term */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Loan Term :
                  </label>
                  <select
                    value={formData.loanTerm}
                    onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    <option value="">--Loan Term--</option>
                    {loanTerms.map(term => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                </div>

                {/* ROI */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    ROI :
                  </label>
                  <select
                    value={formData.roi}
                    onChange={(e) => handleInputChange('roi', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    {roiOptions.map(rate => (
                      <option key={rate} value={rate}>{rate}</option>
                    ))}
                  </select>
                </div>

                {/* Tenure */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Tenure :
                  </label>
                  <input
                    type="text"
                    value={formData.tenure}
                    onChange={(e) => handleInputChange('tenure', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;

import React, { useState } from 'react';
import { MapPin, Home, Building } from 'lucide-react';

const CurrentAddressDetails = ({ userData = {}, isDark = false, onDataChange }) => {
  const [formData, setFormData] = useState({
    currentHouseFlatBuilding: userData.currentHouseFlatBuilding || '',
    currentAddress: userData.currentAddress || '',
    currentState: userData.currentState || '',
    currentCity: userData.currentCity || '',
    currentPinCode: userData.currentPinCode || '',
    currentAddressType: userData.currentAddressType || '',
    currentAddressCode: userData.currentAddressCode || '0',
    currentStateCode: userData.currentStateCode || '0'
  });

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const addressTypes = [
    'Owned', 'Rented', 'Parental', 'Company Provided', 'Paying Guest', 'Other'
  ];

  return (
    <div className={`transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${
            isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
          } bg-clip-text text-transparent flex items-center gap-3`}>
            <MapPin className={`w-6 h-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            Current Address Details
          </h2>
        </div>

        {/* Form Container */}
        <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}>
          <div className="p-8">
            <div className="space-y-6">
              {/* Current Address Header */}
              <div className="pb-4 border-b border-emerald-200/30">
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Current Address :
                </h3>
              </div>

              {/* Current House/Flat/Building Number */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Building className="inline w-4 h-4 mr-1" />
                  Current House/Flat/Building No :
                </label>
                <textarea
                  value={formData.currentHouseFlatBuilding}
                  onChange={(e) => handleInputChange('currentHouseFlatBuilding', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter house/flat/building number and details"
                />
              </div>

              {/* Current Address */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Home className="inline w-4 h-4 mr-1" />
                  Current Address :
                </label>
                <textarea
                  value={formData.currentAddress}
                  onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter complete current address"
                />
              </div>

              {/* Two Column Layout for State and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current State */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Current State :
                  </label>
                  <select
                    value={formData.currentState}
                    onChange={(e) => handleInputChange('currentState', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    <option value="">--Select State--</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Current City */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Current City :
                  </label>
                  <input
                    type="text"
                    value={formData.currentCity}
                    onChange={(e) => handleInputChange('currentCity', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter current city"
                  />
                  {/* Validation Message */}
                  {!formData.currentCity && (
                    <div className="mt-2">
                      <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
                        Please fill out this field.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pin Code */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Current Pin Code :
                </label>
                <input
                  type="text"
                  value={formData.currentPinCode}
                  onChange={(e) => handleInputChange('currentPinCode', e.target.value)}
                  maxLength="6"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter 6-digit pin code"
                />
              </div>

              {/* Address Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Current Address Type :
                </label>
                <select
                  value={formData.currentAddressType}
                  onChange={(e) => handleInputChange('currentAddressType', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                >
                  <option value="">--Please Select Address Type--</option>
                  {addressTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Two Column Layout for Codes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Address Code */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Current Address Code :
                  </label>
                  <input
                    type="text"
                    value={formData.currentAddressCode}
                    onChange={(e) => handleInputChange('currentAddressCode', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter address code"
                  />
                </div>

                {/* Current State Code */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Current State Code :
                  </label>
                  <input
                    type="text"
                    value={formData.currentStateCode}
                    onChange={(e) => handleInputChange('currentStateCode', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter state code"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentAddressDetails;
import React, { useState } from 'react';
import { MapPin, Home, Building } from 'lucide-react';

const PermanentAddressDetails = ({ userData = {}, isDark = false, onDataChange }) => {
  const [formData, setFormData] = useState({
    permanentHouseFlatBuilding: userData.permanentHouseFlatBuilding || '',
    permanentAddress: userData.permanentAddress || '',
    permanentState: userData.permanentState || 'Karnataka',
    permanentCity: userData.permanentCity || 'Bellary',
    permanentAddressType: userData.permanentAddressType || '',
    permanentAddressCode: userData.permanentAddressCode || '0',
    permanentStateCode: userData.permanentStateCode || '0',
    permanentPinCode: userData.permanentPinCode || '0'
  });

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const karnatakaCities = [
    'Bangalore', 'Mysore', 'Hubli', 'Dharwad', 'Mangalore', 'Bellary', 'Gulbarga',
    'Davanagere', 'Belgaum', 'Shimoga', 'Tumkur', 'Raichur', 'Bijapur', 'Udupi',
    'Hassan', 'Chitradurga', 'Mandya', 'Chikmagalur', 'Bagalkot', 'Gadag'
  ];

  const addressTypes = [
    'Owned', 'Rented', 'Parental', 'Company Provided', 'Paying Guest', 'Other'
  ];

  return (
    <div className={`transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${
            isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
          } bg-clip-text text-transparent flex items-center gap-3`}>
            <MapPin className={`w-6 h-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            Permanent Address Details
          </h2>
        </div>

        {/* Form Container */}
        <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}>
          <div className="p-8">
            <div className="space-y-6">
              {/* Permanent Address Header */}
              <div className="pb-4 border-b border-emerald-200/30">
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Permanent Address :
                </h3>
              </div>

              {/* House/Flat/Building Number */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Building className="inline w-4 h-4 mr-1" />
                  House/Flat/Building No :
                </label>
                <textarea
                  value={formData.permanentHouseFlatBuilding}
                  onChange={(e) => handleInputChange('permanentHouseFlatBuilding', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter house/flat/building number and details"
                />
              </div>

              {/* Address */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Home className="inline w-4 h-4 mr-1" />
                  Address :
                </label>
                <textarea
                  value={formData.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter complete permanent address"
                />
              </div>

              {/* Two Column Layout for State and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    State :
                  </label>
                  <select
                    value={formData.permanentState}
                    onChange={(e) => handleInputChange('permanentState', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    City :
                  </label>
                  <select
                    value={formData.permanentCity}
                    onChange={(e) => handleInputChange('permanentCity', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    {formData.permanentState === 'Karnataka' ? (
                      karnatakaCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))
                    ) : (
                      <option value={formData.permanentCity}>{formData.permanentCity}</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Address Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Address Type :
                </label>
                <select
                  value={formData.permanentAddressType}
                  onChange={(e) => handleInputChange('permanentAddressType', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                >
                  <option value="">--Please Select Address Type--</option>
                  {addressTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Three Column Layout for Codes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Address Code */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Address Code :
                  </label>
                  <input
                    type="text"
                    value={formData.permanentAddressCode}
                    onChange={(e) => handleInputChange('permanentAddressCode', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter address code"
                  />
                </div>

                {/* State Code */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    State Code :
                  </label>
                  <input
                    type="text"
                    value={formData.permanentStateCode}
                    onChange={(e) => handleInputChange('permanentStateCode', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter state code"
                  />
                </div>

                {/* Pin Code */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Pin Code :
                  </label>
                  <input
                    type="text"
                    value={formData.permanentPinCode}
                    onChange={(e) => handleInputChange('permanentPinCode', e.target.value)}
                    maxLength="6"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter 6-digit pin code"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermanentAddressDetails;

import React, { useState } from 'react';
import { DollarSign, Calendar, TrendingUp, Clock, Percent, Gift } from 'lucide-react';

const LoanDetails = ({ userData = {}, isDark = false, onDataChange }) => {
  const [formData, setFormData] = useState({
    dlyWklyMnthlyOneTimeCollectionAmount: userData.dlyWklyMnthlyOneTimeCollectionAmount || '0',
    threeEmiCollectionAmount: userData.threeEmiCollectionAmount || '0',
    gracePeriod: userData.gracePeriod || '0',
    administrationFeePercentage: userData.administrationFeePercentage || '',
    administrationFeesInRs: userData.administrationFeesInRs || '0',
    gst: userData.gst || '',
    redeemPoints: userData.redeemPoints || '0'
  });

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const administrationFeeOptions = [
    { value: '', label: '--Please Select--' },
    { value: '1', label: '1%' },
    { value: '2', label: '2%' },
    { value: '3', label: '3%' },
    { value: '4', label: '4%' },
    { value: '5', label: '5%' },
    { value: '6', label: '6%' },
    { value: '7', label: '7%' },
    { value: '8', label: '8%' },
    { value: '9', label: '9%' },
    { value: '10', label: '10%' }
  ];

  return (
    <div className={`transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${
            isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
          } bg-clip-text text-transparent flex items-center gap-3`}>
            <DollarSign className={`w-6 h-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            Loan Details
          </h2>
        </div>

        {/* Form Container */}
        <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}>
          <div className="p-8">
            <div className="space-y-6">
              {/* Collection Amount */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Dly/Wkly/Mnthly/OneTime Collection Amount :
                </label>
                <input
                  type="text"
                  value={formData.dlyWklyMnthlyOneTimeCollectionAmount}
                  onChange={(e) => handleInputChange('dlyWklyMnthlyOneTimeCollectionAmount', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter collection amount"
                />
              </div>

              {/* 3 EMI Collection Amount */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <TrendingUp className="inline w-4 h-4 mr-1" />
                  3 EMI Collection Amount :
                </label>
                <input
                  type="text"
                  value={formData.threeEmiCollectionAmount}
                  onChange={(e) => handleInputChange('threeEmiCollectionAmount', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter 3 EMI collection amount"
                />
              </div>

              {/* Grace Period */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Clock className="inline w-4 h-4 mr-1" />
                  Grace Period :
                </label>
                <input
                  type="text"
                  value={formData.gracePeriod}
                  onChange={(e) => handleInputChange('gracePeriod', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter grace period"
                />
              </div>

              {/* Administration Fee Percentage */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Percent className="inline w-4 h-4 mr-1" />
                  Administration Fee (in %) :
                </label>
                <select
                  value={formData.administrationFeePercentage}
                  onChange={(e) => handleInputChange('administrationFeePercentage', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                >
                  {administrationFeeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Administration Fees in Rs */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Administration Fees (in Rs) :
                </label>
                <input
                  type="text"
                  value={formData.administrationFeesInRs}
                  onChange={(e) => handleInputChange('administrationFeesInRs', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter administration fees in rupees"
                />
              </div>

              {/* GST */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Percent className="inline w-4 h-4 mr-1" />
                  GST :
                </label>
                <input
                  type="text"
                  value={formData.gst}
                  onChange={(e) => handleInputChange('gst', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter GST amount"
                />
              </div>

              {/* Redeem Points */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Gift className="inline w-4 h-4 mr-1" />
                  Redeem Points :
                </label>
                <input
                  type="text"
                  value={formData.redeemPoints}
                  onChange={(e) => handleInputChange('redeemPoints', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter redeem points"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Optional: Display Form Data for Testing */}
        <div className="mt-6">
          <details className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
            <summary className="cursor-pointer font-medium">Debug: View Form Data</summary>
            <pre className={`mt-2 p-4 rounded-lg text-xs ${
              isDark ? "bg-gray-800" : "bg-gray-100"
            }`}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;

import React, { useState } from 'react';
import { CreditCard, Building2, Hash, Shield } from 'lucide-react';

const BankDetails = ({ userData = {}, isDark = false, onDataChange }) => {
  const [formData, setFormData] = useState({
    bankName: userData.bankName || '',
    branchName: userData.branchName || '',
    accountType: userData.accountType || '',
    accountNo: userData.accountNo || '',
    ifscCode: userData.ifscCode || '',
    panNo: userData.panNo || '',
    aadharNo: userData.aadharNo || '',
    crnNo: userData.crnNo || '',
    accountId: userData.accountId || '',
    approvalNote: userData.approvalNote || 'New Customer',
    eNachBank: userData.eNachBank || '',
    eNachMode: userData.eNachMode || '',
    eNachBankCode: userData.eNachBankCode || ''
  });

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const accountTypes = [
    'Savings Account',
    'Current Account',
    'Salary Account',
    'Fixed Deposit Account',
    'Recurring Deposit Account',
    'NRI Account'
  ];

  const approvalNotes = [
    'New Customer',
    'Existing Customer',
    'Premium Customer',
    'VIP Customer',
    'Corporate Customer'
  ];

  const eNachBanks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'IDFC First Bank',
    'Yes Bank',
    'IndusInd Bank'
  ];

  const eNachModes = [
    'NACH Debit',
    'Net Banking',
    'Debit Card',
    'UPI AutoPay',
    'Physical Mandate'
  ];

  const handleVerifyPAN = () => {
    // Placeholder for PAN verification logic
    alert('PAN verification feature would be implemented here');
  };

  const handleVerifyAadhar = () => {
    // Placeholder for Aadhar verification logic
    alert('Aadhar verification feature would be implemented here');
  };

  return (
    <div className={`transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${
            isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
          } bg-clip-text text-transparent flex items-center gap-3`}>
            <CreditCard className={`w-6 h-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            Bank Details
          </h2>
        </div>

        {/* Form Container */}
        <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}>
          <div className="p-8">
            <div className="space-y-6">
              {/* Bank Details Header */}
              <div className="pb-4 border-b border-emerald-200/30">
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Bank Details :
                </h3>
              </div>

              {/* Two Column Layout for Bank Name and Branch */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bank Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    <Building2 className="inline w-4 h-4 mr-1" />
                    Bank Name :
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter bank name"
                  />
                </div>

                {/* Branch Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Branch Name :
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => handleInputChange('branchName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter branch name"
                  />
                </div>
              </div>

              {/* Account Type and Account Number */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Type */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Account Type :
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    <option value="">--Select Account Type--</option>
                    {accountTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Account Number */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Account No :
                  </label>
                  <input
                    type="text"
                    value={formData.accountNo}
                    onChange={(e) => handleInputChange('accountNo', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter account number"
                  />
                </div>
              </div>

              {/* IFSC Code */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  <Hash className="inline w-4 h-4 mr-1" />
                  IFSC Code :
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter IFSC code"
                  maxLength="11"
                />
              </div>

              {/* PAN and Aadhar Numbers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PAN Number */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    <Shield className="inline w-4 h-4 mr-1" />
                    PAN No :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.panNo}
                      onChange={(e) => handleInputChange('panNo', e.target.value)}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                      placeholder="Enter PAN number"
                      maxLength="10"
                    />
                    <button
                      onClick={handleVerifyPAN}
                      className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isDark
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    >
                      Verify PAN
                    </button>
                  </div>
                </div>

                {/* Aadhar Number */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Aadhar No :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.aadharNo}
                      onChange={(e) => handleInputChange('aadharNo', e.target.value)}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                      placeholder="Enter Aadhar number"
                      maxLength="12"
                    />
                    <button
                      onClick={handleVerifyAadhar}
                      className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isDark
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    >
                      Verify Aadhar
                    </button>
                  </div>
                </div>
              </div>

              {/* CRN and Account ID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CRN Number */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    CRN No :
                  </label>
                  <input
                    type="text"
                    value={formData.crnNo}
                    onChange={(e) => handleInputChange('crnNo', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter CRN number"
                  />
                </div>

                {/* Account ID */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Account ID :
                  </label>
                  <input
                    type="text"
                    value={formData.accountId}
                    onChange={(e) => handleInputChange('accountId', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter account ID"
                  />
                </div>
              </div>

              {/* Approval Note */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Approval Note :
                </label>
                <select
                  value={formData.approvalNote}
                  onChange={(e) => handleInputChange('approvalNote', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                >
                  {approvalNotes.map(note => (
                    <option key={note} value={note}>{note}</option>
                  ))}
                </select>
              </div>

              {/* E-Nach Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* E-Nach Bank */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    E-Nach Bank :
                  </label>
                  <select
                    value={formData.eNachBank}
                    onChange={(e) => handleInputChange('eNachBank', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    <option value="">Select Bank</option>
                    {eNachBanks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>

                {/* E-Nach Mode */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    E-Nach Mode :
                  </label>
                  <select
                    value={formData.eNachMode}
                    onChange={(e) => handleInputChange('eNachMode', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    <option value="">Select Mode</option>
                    {eNachModes.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* E-Nach Bank Code */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  E-Nach Bank Code :
                </label>
                <input
                  type="text"
                  value={formData.eNachBankCode}
                  onChange={(e) => handleInputChange('eNachBankCode', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  placeholder="Enter E-Nach bank code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;