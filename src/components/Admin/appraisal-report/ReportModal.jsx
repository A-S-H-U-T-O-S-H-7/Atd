import React from 'react';
import { Loader2, CheckCircle, XCircle, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const DocumentReportModal = ({ 
  isOpen, 
  onClose, 
  reportType, 
  reportData, 
  loadingReport, 
  isDark,
  documentNumber
}) => {
  if (!isOpen) return null;

  // Styling classes
  const modalClassName = "fixed bg-black/20 backdrop-blur-sm inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
  const contentClassName = `rounded-xl border-2 max-w-md w-full ${
    isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
  }`;

  const titleClassName = `text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`;
  const labelClassName = `text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`;
  const valueClassName = `text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`;

  const renderPanComparison = () => {
    if (!reportData?.data) return null;

    const { data } = reportData;
    const apiDetails = data.api_details || {};

    const comparisonData = [
      {
        label: "PAN Number",
        apiData: apiDetails.pan_number || 'N/A',
        crmData: data.pan_number || 'N/A'
      },
      {
        label: "Pan Holder Name", 
        apiData: apiDetails.name || 'N/A',
        crmData: data.customer_name || 'N/A'
      },
      {
        label: "Father Name",
        apiData: apiDetails.father_name || 'N/A',
        crmData: data.father_name || 'N/A'
      }
    ];

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold border-b pb-2">
          <div></div>
          <div className={isDark ? "text-blue-400" : "text-blue-600"}>API Data</div>
          <div className={isDark ? "text-green-400" : "text-green-600"}>CRM Data</div>
        </div>
        
        {comparisonData.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-2">
            <div className={labelClassName}>{row.label}</div>
            <div className={`${valueClassName} font-mono`}>{row.apiData}</div>
            <div className={valueClassName}>{row.crmData}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderAadharComparison = () => {
    if (!reportData?.data) return null;

    const { data } = reportData;
    const apiDetails = data.api_details || {};

    const comparisonData = [
      {
        label: "Aadhar Number",
        apiData: apiDetails.aadhaar_number || 'N/A',
        crmData: data.aadhaar_number || 'N/A'
      },
      {
        label: "State",
        apiData: apiDetails.state || 'N/A',
        crmData: data.state || 'N/A'
      },
      {
        label: "Gender",
        apiData: apiDetails.gender || 'N/A',
        crmData: data.gender || 'N/A'
      },
      {
        label: "Mobile Last Digit",
        apiData: apiDetails.phone || 'N/A',
        crmData: data.phone ? data.phone.slice(-3) : 'N/A'
      },
      {
        label: "Age Range/DOB",
        apiData: apiDetails.dob || 'N/A',
        crmData: data.dob || 'N/A'
      }
    ];

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold border-b pb-2">
          <div></div>
          <div className={isDark ? "text-blue-400" : "text-blue-600"}>API Data</div>
          <div className={isDark ? "text-green-400" : "text-green-600"}>CRM Data</div>
        </div>
        
        {comparisonData.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-2">
            <div className={labelClassName}>{row.label}</div>
            <div className={`${valueClassName} font-mono`}>{row.apiData}</div>
            <div className={valueClassName}>{row.crmData}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className={`p-4 rounded-lg text-center ${
        isDark ? "bg-red-900/20 border border-red-800" : "bg-red-50 border border-red-200"
      }`}>
        <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className={`font-medium ${isDark ? "text-red-400" : "text-red-700"}`}>
          {reportData?.message || 'Verification Failed'}
        </p>
        {reportData?.errorDetails?.message && (
          <p className={`text-sm mt-1 ${isDark ? "text-red-300" : "text-red-600"}`}>
            {reportData.errorDetails.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={modalClassName}>
      <div className={contentClassName}>
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              <h3 className={titleClassName}>
                {reportType === 'pan' ? 'PAN' : 'Aadhar'} Verification
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded ${
                isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Document Number */}
          <div className={`text-xs mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Document: <span className="font-mono">{documentNumber}</span>
          </div>

          {/* Status Badge */}
          {reportData && (
            <div className={`flex items-center gap-2 mb-4 p-2 rounded text-sm font-medium ${
              reportData.success 
                ? (isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800")
                : (isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800")
            }`}>
              {reportData.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {reportData.success ? 'Verified' : 'Failed'}
            </div>
          )}

          {/* Loading State */}
          {loadingReport && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className={`ml-2 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Verifying...
              </span>
            </div>
          )}

          {/* Content */}
          {!loadingReport && reportData && (
            <div className="space-y-4">
              {reportData.success ? (
                reportType === 'pan' ? renderPanComparison() : renderAadharComparison()
              ) : (
                renderError()
              )}
            </div>
          )}

          {/* No Data State */}
          {!loadingReport && !reportData && (
            <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              <p className="text-sm">No verification data available</p>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-600">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded text-sm font-medium ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-gray-800"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReportModal;