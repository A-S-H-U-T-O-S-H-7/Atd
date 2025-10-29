import React from 'react';
import { ArrowLeft, Upload, Info } from 'lucide-react';

const Header = ({ enquiry, onBack, hasFilesToUpload, submitting, isDark }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            type="button"
            onClick={onBack}
            className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
              isDark
                ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
          </button>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
              isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
            } bg-clip-text text-transparent`}>
              Replace KYC Documents
            </h1>
          </div>
        </div>
      </div>
      
      {/* Customer Info Card */}
      <div className={`p-4 rounded-xl border-2 mb-4 ${
        isDark 
          ? "bg-gray-800/50 border-emerald-600/30" 
          : "bg-emerald-50/50 border-emerald-200"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-medium mb-1 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Customer Details
            </p>
            <div className="flex items-center space-x-4">
              <div>
                <span className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>Name: </span>
                <span className={`text-base font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  {enquiry.name}
                </span>
              </div>
              <div className={`h-4 w-px ${
                isDark ? "bg-gray-600" : "bg-gray-300"
              }`} />
              <div>
                <span className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>CRN: </span>
                <span className={`text-base font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  {enquiry.crnNo}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info Message */}
      <div className={`flex items-start space-x-3 p-2 rounded-xl border ${
        isDark
          ? "bg-yellow-900/20 border-blue-600/30 text-yellow-300"
          : "bg-yellow-100 border-blue-200 text-yellow-900"
      }`}>
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">
          Please note that file uploads may take some time depending on the file size. 
          Larger files may require a few moments to process. Kindly be patient and avoid 
          refreshing the page during submission.
        </p>
      </div>
      <div className="fixed bottom-8 right-8 z-50">
        <button
          type="submit"
          disabled={!hasFilesToUpload || submitting}
          className={`px-6 py-3 rounded-xl  font-medium cursor-pointer transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl ${
            hasFilesToUpload && !submitting
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          <Upload className="w-5 h-5" />
          <span>{submitting ? 'Submitting...' : 'Submit'}</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
