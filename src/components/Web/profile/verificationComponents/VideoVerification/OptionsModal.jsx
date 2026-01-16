import React from 'react';
import { X, Camera, Video } from 'lucide-react';

const OptionsModal = ({ onCameraClick, onGalleryClick, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 md:p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg md:text-xl font-bold">Video Verification</h2>
              <p className="text-blue-100 text-xs md:text-sm mt-0.5">Choose upload method</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-blue-700 rounded-lg transition-all active:scale-95"
              aria-label="Close"
            >
              <X className="text-lg" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-3 md:space-y-4">
            {/* Camera Option */}
            <button 
              onClick={onCameraClick}
              className="w-full p-3 bg-gradient-to-r from-blue-50 to-white border border-blue-200 hover:border-blue-400 hover:from-blue-100 hover:to-blue-50 rounded-xl flex items-center gap-3 transition-all active:scale-95"
            >
              <div className="bg-gradient-to-br p-2 from-blue-500 to-blue-600 text-white rounded-full shadow">
                <Camera className="text-xl" />
              </div>
              <div className="text-left flex-1">
                <span className="font-bold text-gray-800 block">Record Video</span>
                <span className="text-gray-600 text-sm">Use camera to record</span>
              </div>
            </button>
            
            {/* Gallery Option */}
            <button 
              onClick={onGalleryClick}
              className="w-full p-3 bg-gradient-to-r from-purple-50 to-white border border-purple-200 hover:border-purple-400 hover:from-purple-100 hover:to-purple-50 rounded-xl flex items-center gap-3 transition-all active:scale-95"
            >
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full shadow">
                <Video className="text-xl" />
              </div>
              <div className="text-left flex-1">
                <span className="font-bold text-gray-800 block">Upload from Gallery</span>
                <span className="text-gray-600 text-sm">Choose video file</span>
              </div>
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-4 md:mt-5 py-2.5 md:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;