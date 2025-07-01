import React from 'react';
import { MapPin } from 'lucide-react';

const AddressDetails = ({ formik, isDark }) => {
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

  const textareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Address Details
          </h3>
        </div>
        
        {/* Current Address */}
        <div className="mb-6">
          <h4 className={`text-sm font-medium mb-3 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}>
            Current Address
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>House/Building No.</label>
              <input
                type="text"
                name="currentHouseNo"
                value={formik.values.currentHouseNo}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter house/building number"
              />
            </div>

            <div>
              <label className={labelClassName}>Pin Code</label>
              <input
                type="text"
                name="currentPinCode"
                value={formik.values.currentPinCode}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter pin code"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>Address</label>
              <textarea
                rows="2"
                name="currentAddress"
                value={formik.values.currentAddress}
                onChange={formik.handleChange}
                className={textareaClassName}
                placeholder="Enter complete address"
              />
            </div>

            <div>
              <label className={labelClassName}>State</label>
              <select
                name="currentState"
                value={formik.values.currentState}
                onChange={formik.handleChange}
                className={selectClassName}
              >
                <option value="">Select State</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>City</label>
              <input
                type="text"
                name="currentCity"
                value={formik.values.currentCity}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className={labelClassName}>Address Type</label>
              <select
                name="currentAddressType"
                value={formik.values.currentAddressType}
                onChange={formik.handleChange}
                className={selectClassName}
              >
                <option value="">Select Address Type</option>
                <option value="Own">Own</option>
                <option value="Rented">Rented</option>
                <option value="Company Provided">Company Provided</option>
                <option value="Parental">Parental</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>Address Code</label>
              <input
                type="text"
                name="currentAddressCode"
                value={formik.values.currentAddressCode}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter address code"
              />
            </div>

            <div>
              <label className={labelClassName}>State Code</label>
              <input
                type="text"
                name="currentStateCode"
                value={formik.values.currentStateCode}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter state code"
              />
            </div>
          </div>
        </div>

        {/* Permanent Address */}
        <div>
          <h4 className={`text-sm font-medium mb-3 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}>
            Permanent Address
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>House/Building No.</label>
              <input
                type="text"
                name="permanentHouseNo"
                value={formik.values.permanentHouseNo}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter house/building number"
              />
            </div>

            <div>
              <label className={labelClassName}>Pin Code</label>
              <input
                type="text"
                name="permanentPinCode"
                value={formik.values.permanentPinCode}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter pin code"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>Address</label>
              <textarea
                rows="2"
                name="permanentAddress"
                value={formik.values.permanentAddress}
                onChange={formik.handleChange}
                className={textareaClassName}
                placeholder="Enter complete address"
              />
            </div>

            <div>
              <label className={labelClassName}>State</label>
              <select
                name="permanentState"
                value={formik.values.permanentState}
                onChange={formik.handleChange}
                className={selectClassName}
              >
                <option value="">Select State</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>City</label>
              <input
                type="text"
                name="permanentCity"
                value={formik.values.permanentCity}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className={labelClassName}>Address Type</label>
              <select
                name="permanentAddressType"
                value={formik.values.permanentAddressType}
                onChange={formik.handleChange}
                className={selectClassName}
              >
                <option value="">Select Address Type</option>
                <option value="Own">Own</option>
                <option value="Rented">Rented</option>
                <option value="Company Provided">Company Provided</option>
                <option value="Parental">Parental</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>Address Code</label>
              <input
                type="text"
                name="permanentAddressCode"
                value={formik.values.permanentAddressCode}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter address code"
              />
            </div>

            <div>
              <label className={labelClassName}>State Code</label>
              <input
                type="text"
                name="permanentStateCode"
                value={formik.values.permanentStateCode}
                onChange={formik.handleChange}
                className={inputClassName}
                placeholder="Enter state code"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;