import React from 'react';
import { Shield, ExternalLink } from "lucide-react";

const DocumentVerification = ({ formik, onSectionSave, isDark }) => {
  const inputClassName = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const readOnlyInputClassName = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed ${
    isDark ? "bg-gray-50 border-gray-500 text-gray-300" : ""
  }`;

  const selectClassName = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-sm font-medium mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;
  const valueClassName = `text-sm font-medium ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  const linkClassName = `text-blue-500 hover:text-blue-600 text-sm flex items-center space-x-1 mt-2`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className={`w-6 h-6 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <h3 className={`text-xl font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Document Verification
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Phone Verification */}
            <div>
              <label className={labelClassName}>Phone No. Verified:</label>
              <div className={valueClassName}>{formik.values?.phoneNo || 'N/A'}</div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <select
                  value={formik.values.phoneNoVerified ? "Yes" : "No"}
                  onChange={(e) => formik.setFieldValue('phoneNoVerified', e.target.value === "Yes")}
                  className={selectClassName}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <select
                  value={formik.values.phoneNoStatus || 'Positive'}
                  onChange={(e) => formik.setFieldValue('phoneNoStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select Status</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
            </div>

            {/* Aadhar Verification */}
            <div>
              <label className={labelClassName}>
                Aadhar Card Verified: 
                <a href="#" className="text-blue-500 hover:text-blue-600 ml-1">Report</a>
              </label>
              <input
                type="text"
                value={formik.values.aadharNo || '982170269751'}
                readOnly
                className={readOnlyInputClassName}
                placeholder="Enter Aadhar number"
              />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <select
                  value={formik.values.aadharCardVerified ? "Yes" : "No"}
                  onChange={(e) => formik.setFieldValue('aadharCardVerified', e.target.value === "Yes")}
                  className={selectClassName}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <select
                  value={formik.values.aadharCardStatus || 'Positive'}
                  onChange={(e) => formik.setFieldValue('aadharCardStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select Status</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
              <a
                href={formik.values.aadharVerificationLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                <ExternalLink size={14} />
                <span>Verification Link</span>
              </a>
              <div className="mt-3">
                <a href="#" className="text-blue-500 hover:text-blue-600 text-sm">Aadhar Pan Link Status</a>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* PAN Verification */}
            <div>
              <label className={labelClassName}>
                PAN Card Verified: 
                <a href="#" className="text-blue-500 hover:text-blue-600 ml-1">Report</a>
              </label>
              <input
                type="text"
                value={formik.values.panNo || 'ARSPA5791K'}
                readOnly
                className={readOnlyInputClassName}
                placeholder="Enter PAN number"
              />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <select
                  value={formik.values.panCardVerified ? "Yes" : "No"}
                  onChange={(e) => formik.setFieldValue('panCardVerified', e.target.value === "Yes")}
                  className={selectClassName}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <select
                  value={formik.values.panCardStatus || 'Positive'}
                  onChange={(e) => formik.setFieldValue('panCardStatus', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select Status</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
              <a
                href={formik.values.panVerificationLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                <ExternalLink size={14} />
                <span>Verification Link</span>
              </a>
            </div>

            {/* Reference Information */}
            <div>
              <label className={labelClassName}>Ref Name:</label>
              <input
                type="text"
                value={formik.values.refName || 'rajanikanth'}
                readOnly
                className={readOnlyInputClassName}
                placeholder="Reference name"
              />
              <select
                value={formik.values.refRelationVerified ? "Yes" : "No"}
                onChange={(e) => formik.setFieldValue('refRelationVerified', e.target.value === "Yes")}
                className={`${selectClassName} mt-3`}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Row - Reference Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div>
            <label className={labelClassName}>Ref Mobile:</label>
            <input
              type="text"
              value={formik.values.refMobile || '8722588551'}
              readOnly
              className={readOnlyInputClassName}
              placeholder="Reference mobile"
            />
            <select
              value={formik.values.refMobileVerified ? "Yes" : "No"}
              onChange={(e) => formik.setFieldValue('refMobileVerified', e.target.value === "Yes")}
              className={`${selectClassName} mt-3`}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className={labelClassName}>Ref Email:</label>
            <input
              type="email"
              value={formik.values.refEmail || 'ranju.kanth@gmail.com'}
              readOnly
              className={readOnlyInputClassName}
              placeholder="Reference email"
            />
            <select
              value={formik.values.refEmailVerified ? "Yes" : "No"}
              onChange={(e) => formik.setFieldValue('refEmailVerified', e.target.value === "Yes")}
              className={`${selectClassName} mt-3`}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className={labelClassName}>Ref Relation:</label>
            <input
              type="text"
              value={formik.values.refRelation || 'friend'}
              readOnly
              className={readOnlyInputClassName}
              placeholder="Relation type"
            />
            <select
              value={formik.values.refRelationVerified ? "Yes" : "No"}
              onChange={(e) => formik.setFieldValue('refRelationVerified', e.target.value === "Yes")}
              className={`${selectClassName} mt-3`}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        {/* Final Report */}
        <div className="mt-8">
          <label className={labelClassName}>Final Report:</label>
          <select
            value={formik.values.finalReport || 'Positive'}
            onChange={(e) => formik.setFieldValue('finalReport', e.target.value)}
            className={`${selectClassName} max-w-xs`}
          >
            <option value="">Select Report Status</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className={`m-6 pt-6 flex justify-end border-t ${
        isDark ? "border-gray-600" : "border-gray-200"
      }`}>
        <button
          type="button"
          onClick={onSectionSave}
          className="px-8 py-3 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm"
        >
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentVerification;