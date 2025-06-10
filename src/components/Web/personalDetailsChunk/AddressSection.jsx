import React from "react";
import { MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";

const AddressSection = ({
  title,
  addressPrefix,
  showSameAddressOption = false,
  sameAddress = false,
  onSameAddressChange,
  isCurrentAddressComplete,
  values,
  setFieldValue
}) => {
  const addressTypeOptions = [
    { value: "4", label: "Owned" },
    { value: "2", label: "Rented" }
  ];
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
      <SectionHeader icon={MapPin} title={title} />

      {showSameAddressOption &&
        <div className="mb-6">
          <label
            className={`flex items-center gap-3 cursor-pointer group ${!isCurrentAddressComplete
              ? "opacity-50 cursor-not-allowed"
              : ""}`}
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={sameAddress}
                disabled={!isCurrentAddressComplete}
                onChange={e => onSameAddressChange(e, setFieldValue, values)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 transition-all duration-200 ${sameAddress
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 border-teal-500"
                  : !isCurrentAddressComplete
                    ? "border-gray-200 bg-gray-100"
                    : "border-gray-300 group-hover:border-teal-300"}`}
              >
                {sameAddress &&
                  <svg
                    className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>}
              </div>
            </div>
            <span
              className={`text-sm font-medium transition-colors duration-200 ${!isCurrentAddressComplete
                ? "text-gray-400"
                : "text-gray-700 group-hover:text-teal-600"}`}
            >
              Permanent address is same as current address
            </span>
          </label>
        </div>}

      <div className="space-y-6">
        <FormField
          name={`${addressPrefix}.street`}
          label="Complete Address"
          as="textarea"
          rows={3}
          placeholder={`Enter complete ${title.toLowerCase()}`}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            name={`${addressPrefix}.city`}
            label="City"
            placeholder="Enter city"
            required
          />

          <FormField
            name={`${addressPrefix}.state`}
            label="State"
            placeholder="Enter state"
            required
          />

          <FormField
            name={`${addressPrefix}.pincode`}
            label="Pincode"
            placeholder="Enter pincode"
            maxLength="6"
            required
          />
          <FormField
            name={`${addressPrefix}.addressType`}
            label="Address Type"
            as="select"
            placeholder="Select Address Type"
            options={addressTypeOptions}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
