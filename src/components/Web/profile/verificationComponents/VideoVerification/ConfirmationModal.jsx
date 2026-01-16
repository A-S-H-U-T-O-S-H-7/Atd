import React from 'react';
import { CheckCircle, Upload, RefreshCw } from 'lucide-react';

const ConfirmationModal = ({ filename, onConfirmUpload, onDiscard, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 md:p-6">
          <h3 className="text-xl md:text-2xl font-bold">Video Recorded</h3>
          <p className="text-blue-100 text-sm md:text-base mt-1">Ready to upload your verification video</p>
        </div>

        <div className="p-5 md:p-6 space-y-4 md:space-y-5">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-700 text-sm md:text-base font-medium">Video recorded successfully</p>
                <p className="text-gray-600 text-xs md:text-sm mt-1">Ensure your face is clearly visible before uploading</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onConfirmUpload}
              className="w-full py-3 md:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Video</span>
            </button>
            
            <button
              onClick={onDiscard}
              className="w-full py-3 md:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Discard & Record Again
            </button>
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <p className="text-gray-500 text-xs text-center">
              File: <span className="font-mono">{filename}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;