import React from 'react';
import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import { locationAPI } from '@/lib/api';

const AddressDetails = ({ formik, isDark, errors = {} }) => {

  const [states, setStates] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);
  const [permanentCities, setPermanentCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await locationAPI.getStates();
        setStates(response.data.states);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when current state changes
  useEffect(() => {
    if (formik.values.currentState) {
      const fetchCurrentCities = async () => {
        try {
          const response = await locationAPI.getCities(formik.values.currentState);
          setCurrentCities(response.data.cities);
        } catch (error) {
          console.error('Error fetching current cities:', error);
        }
      };
      fetchCurrentCities();
    }
  }, [formik.values.currentState]);

  // Fetch cities when permanent state changes
  useEffect(() => {
    if (formik.values.permanentState) {
      const fetchPermanentCities = async () => {
        try {
          const response = await locationAPI.getCities(formik.values.permanentState);
          setPermanentCities(response.data.cities);
        } catch (error) {
          console.error('Error fetching permanent cities:', error);
        }
      };
      fetchPermanentCities();
    }
  }, [formik.values.permanentState]);

  const handleStateChange = (e, addressType) => {
    const stateName = e.target.value;
    const selectedState = states.find(state => state.state_name === stateName);
    
    formik.setFieldValue(`${addressType}State`, stateName);
    if (selectedState) {
      formik.setFieldValue(`${addressType}StateCode`, selectedState.state_code);
    }
  };


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

  const textareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const errorTextareaClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const errorTextClassName = `text-xs mt-1 flex items-center space-x-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  // Helper function to get field error
  const getFieldError = (fieldName) => {
    // Check multiple possible field name variations
    const possibleNames = [
      fieldName,
      fieldName.replace(/([A-Z])/g, '_$1').toLowerCase(),
      fieldName.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
    ];
    
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
              <label className={hasError('currentHouseNo') ? errorLabelClassName : labelClassName}>
                House/Building No.
              </label>
              <input
                type="text"
                name="currentHouseNo"
                value={formik.values.currentHouseNo}
                onChange={formik.handleChange}
                className={hasError('currentHouseNo') ? errorInputClassName : inputClassName}
                placeholder="Enter house/building number"
              />
              {hasError('currentHouseNo') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('currentHouseNo')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('currentPinCode') ? errorLabelClassName : labelClassName}>
                Pin Code
              </label>
              <input
                type="text"
                name="currentPinCode"
                value={formik.values.currentPinCode}
                onChange={formik.handleChange}
                className={hasError('currentPinCode') ? errorInputClassName : inputClassName}
                placeholder="Enter pin code"
              />
              {hasError('currentPinCode') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('currentPinCode')}</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className={hasError('currentAddress') ? errorLabelClassName : labelClassName}>
                Address
              </label>
              <textarea
                rows="2"
                name="currentAddress"
                value={formik.values.currentAddress}
                onChange={formik.handleChange}
                className={hasError('currentAddress') ? errorTextareaClassName : textareaClassName}
                placeholder="Enter complete address"
              />
              {hasError('currentAddress') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('currentAddress')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('currentState') ? errorLabelClassName : labelClassName}>
                State
              </label>
              <select
  name="currentState"
  value={formik.values.currentState}
  onChange={(e) => handleStateChange(e, 'current')}
  className={hasError('currentState') ? errorSelectClassName : selectClassName}
>
  <option value="">Select State</option>
  {states.map(state => (
    <option key={state.id} value={state.state_name}>
      {state.state_name}
    </option>
  ))}
</select>
              {hasError('currentState') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('currentState')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('currentCity') ? errorLabelClassName : labelClassName}>
                City
              </label>
              <select
  name="currentCity"
  value={formik.values.currentCity}
  onChange={formik.handleChange}
  className={hasError('currentCity') ? errorSelectClassName : selectClassName}
>
  <option value="">Select City</option>
  {currentCities.map(city => (
    <option key={city.id} value={city.city_name}>
      {city.city_name}
    </option>
  ))}
</select>
              {hasError('currentCity') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('currentCity')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('currentAddressType') ? errorLabelClassName : labelClassName}>
                Address Type
              </label>
              <select
                name="currentAddressType"
                value={formik.values.currentAddressType}
                onChange={formik.handleChange}
                className={hasError('currentAddressType') ? errorSelectClassName : selectClassName}
              >
                <option value="">Select Address Type</option>
                <option value="Own">Own</option>
                <option value="Rented">Rented</option>
                <option value="Company Provided">Company Provided</option>
                <option value="Parental">Parental</option>
              </select>
              {hasError('currentAddressType') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('currentAddressType')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('currentAddressCode') ? errorLabelClassName : labelClassName}>
                Address Code
              </label>
              <input
                type="text"
                name="currentAddressCode"
                value={formik.values.currentAddressCode}
                onChange={formik.handleChange}
                className={hasError('currentAddressCode') ? errorInputClassName : inputClassName}
                placeholder="Enter address code"
              />
              {hasError('currentAddressCode') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('currentAddressCode')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('currentStateCode') ? errorLabelClassName : labelClassName}>
                State Code
              </label>
              <input
                type="text"
                name="currentStateCode"
                value={formik.values.currentStateCode}
                onChange={formik.handleChange}
                className={hasError('currentStateCode') ? errorInputClassName : inputClassName}
                placeholder="Enter state code"
              />
              {hasError('currentStateCode') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('currentStateCode')}</span>
                </div>
              )}
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
              <label className={hasError('permanentHouseNo') ? errorLabelClassName : labelClassName}>
                House/Building No.
              </label>
              <input
                type="text"
                name="permanentHouseNo"
                value={formik.values.permanentHouseNo}
                onChange={formik.handleChange}
                className={hasError('permanentHouseNo') ? errorInputClassName : inputClassName}
                placeholder="Enter house/building number"
              />
              {hasError('permanentHouseNo') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('permanentHouseNo')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('permanentPinCode') ? errorLabelClassName : labelClassName}>
                Pin Code
              </label>
              <input
                type="text"
                name="permanentPinCode"
                value={formik.values.permanentPinCode}
                onChange={formik.handleChange}
                className={hasError('permanentPinCode') ? errorInputClassName : inputClassName}
                placeholder="Enter pin code"
              />
              {hasError('permanentPinCode') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('permanentPinCode')}</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className={hasError('permanentAddress') ? errorLabelClassName : labelClassName}>
                Address
              </label>
              <textarea
                rows="2"
                name="permanentAddress"
                value={formik.values.permanentAddress}
                onChange={formik.handleChange}
                className={hasError('permanentAddress') ? errorTextareaClassName : textareaClassName}
                placeholder="Enter complete address"
              />
              {hasError('permanentAddress') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('permanentAddress')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('permanentState') ? errorLabelClassName : labelClassName}>
                State
              </label>
              <select
  name="permanentState"
  value={formik.values.permanentState}
  onChange={(e) => handleStateChange(e, 'permanent')}
  className={hasError('permanentState') ? errorSelectClassName : selectClassName}
>
  <option value="">Select State</option>
  {states.map(state => (
    <option key={state.id} value={state.state_name}>
      {state.state_name}
    </option>
  ))}
</select>
              {hasError('permanentState') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('permanentState')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('permanentCity') ? errorLabelClassName : labelClassName}>
                City
              </label>
              <select
  name="permanentCity"
  value={formik.values.permanentCity}
  onChange={formik.handleChange}
  className={hasError('permanentCity') ? errorSelectClassName : selectClassName}
>
  <option value="">Select City</option>
  {permanentCities.map(city => (
    <option key={city.id} value={city.city_name}>
      {city.city_name}
    </option>
  ))}
</select>
              {hasError('permanentCity') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('permanentCity')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('permanentAddressType') ? errorLabelClassName : labelClassName}>
                Address Type
              </label>
              <select
                name="permanentAddressType"
                value={formik.values.permanentAddressType}
                onChange={formik.handleChange}
                className={hasError('permanentAddressType') ? errorSelectClassName : selectClassName}
              >
                <option value="">Select Address Type</option>
                <option value="Own">Own</option>
                <option value="Rented">Rented</option>
                <option value="Company Provided">Company Provided</option>
                <option value="Parental">Parental</option>
              </select>
              {hasError('permanentAddressType') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('permanentAddressType')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('permanentAddressCode') ? errorLabelClassName : labelClassName}>
                Address Code
              </label>
              <input
                type="text"
                name="permanentAddressCode"
                value={formik.values.permanentAddressCode}
                onChange={formik.handleChange}
                className={hasError('permanentAddressCode') ? errorInputClassName : inputClassName}
                placeholder="Enter address code"
              />
              {hasError('permanentAddressCode') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('permanentAddressCode')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('permanentStateCode') ? errorLabelClassName : labelClassName}>
                State Code
              </label>
              <input
                type="text"
                name="permanentStateCode"
                value={formik.values.permanentStateCode}
                onChange={formik.handleChange}
                className={hasError('permanentStateCode') ? errorInputClassName : inputClassName}
                placeholder="Enter state code"
              />
              {hasError('permanentStateCode') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('permanentStateCode')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;