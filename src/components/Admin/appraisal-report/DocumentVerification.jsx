import React from 'react';
import { Shield, Phone, IdCard, CreditCard, ExternalLink, Check, X } from 'lucide-react';

const DocumentVerification = ({ formik, isDark }) => {
  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-semibold mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const valueClassName = `text-sm font-mono p-2 rounded border ${
    isDark ? "bg-gray-700 border-gray-600 text-emerald-400" : "bg-gray-50 border-gray-200 text-emerald-600"
  }`;

  const statusBadgeClassName = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'Positive' || status === 'Yes') {
      return isDark 
        ? `${base} bg-green-900/50 text-green-400 border border-green-800`
        : `${base} bg-green-100 text-green-800 border border-green-200`;
    } else {
      return isDark
        ? `${base} bg-red-900/50 text-red-400 border border-red-800`
        : `${base} bg-red-100 text-red-800 border border-red-200`;
    }
  };

  const DocumentSection = ({ title, icon: Icon, verified, status, onVerifiedChange, onStatusChange, value }) => (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h4 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {title}
          </h4>
        </div>
        <div className={statusBadgeClassName(status)}>
          {status || 'Pending'}
        </div>
      </div>
      
      {value && (
        <div className="mb-3">
          <div className={valueClassName}>{value}</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClassName}>Verified</label>
          <select
            value={verified ? "Yes" : "No"}
            onChange={(e) => onVerifiedChange(e.target.value === "Yes")}
            className={selectClassName}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label className={labelClassName}>Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={selectClassName}
          >
            <option value="">Select Status</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/30 shadow-emerald-900/10 hover:shadow-emerald-900/20"
        : "bg-white border-emerald-200 shadow-emerald-500/5 hover:shadow-emerald-500/10"
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? "border-gray-700 bg-gray-800/80" : "border-gray-100 bg-emerald-50/50"
      }`}>
        <div className="flex items-center space-x-2">
          <Shield className={`w-5 h-5 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Document Verification
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Phone Verification */}
          <DocumentSection
            title="Phone Verification"
            icon={Phone}
            verified={formik.values.phoneNoVerified}
            status={formik.values.phoneNoStatus}
            onVerifiedChange={(value) => formik.setFieldValue('phoneNoVerified', value)}
            onStatusChange={(value) => formik.setFieldValue('phoneNoStatus', value)}
            value={formik.values.phoneNo}
          />

          {/* Aadhar Verification */}
          <DocumentSection
            title="Aadhar Card"
            icon={IdCard}
            verified={formik.values.aadharCardVerified}
            status={formik.values.aadharCardStatus}
            onVerifiedChange={(value) => formik.setFieldValue('aadharCardVerified', value)}
            onStatusChange={(value) => formik.setFieldValue('aadharCardStatus', value)}
            value={formik.values.aadharNo}
          />

          {/* PAN Verification */}
          <DocumentSection
            title="PAN Card"
            icon={CreditCard}
            verified={formik.values.panCardVerified}
            status={formik.values.panCardStatus}
            onVerifiedChange={(value) => formik.setFieldValue('panCardVerified', value)}
            onStatusChange={(value) => formik.setFieldValue('panCardStatus', value)}
            value={formik.values.panNo}
          />

          {/* Final Report */}
          <div className={`p-4 rounded-lg border ${
            isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
          } lg:col-span-2`}>
            <h4 className={`font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Final Document Report
            </h4>
            <select
              value={formik.values.finalReport}
              onChange={(e) => formik.setFieldValue('finalReport', e.target.value)}
              className={`${selectClassName} max-w-xs`}
            >
              <option value="">Select Final Status</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
              <option value="Pending">Pending Review</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;