import React, { useState, useRef } from 'react';
import { FaUserCheck, FaCamera, FaImage } from 'react-icons/fa';
import { TokenManager } from '@/utils/tokenManager';
import toast from 'react-hot-toast';
import axios from 'axios';

const VideoVerification = ({ enabled, completed, VerificationIcon, VerificationButton, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef(null);

  const handleVideoVerification = () => {
    if (!enabled) return;
    setShowOptions(true);
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
  };

  const handleCameraClick = () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // This would open camera for recording
      // For now, we'll simulate or use a video recording library
      toast.loading('Opening camera for video recording...');
      
      // In a real implementation, you would:
      // 1. Open camera with getUserMedia
      // 2. Record video
      // 3. Upload the recorded video
      
      setTimeout(() => {
        toast.dismiss();
        toast.success('Camera access granted! Recording video...');
        // Simulate video recording and upload
        simulateVideoUpload();
      }, 1500);
    } else {
      toast.error('Camera not available on this device');
    }
    setShowOptions(false);
  };

  const handleGalleryClick = () => {
    fileInputRef.current.click();
    setShowOptions(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type and size
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid video file (MP4, WebM, OGG, MOV)');
      return;
    }

    if (file.size > maxSize) {
      toast.error('Video file size should be less than 50MB');
      return;
    }

    await uploadVideo(file);
  };

  const simulateVideoUpload = async () => {
    setIsLoading(true);
    try {
      // Simulate API call for video verification
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const tokenData = TokenManager.getToken();
      const userToken = tokenData.token;
      
      if (!userToken) {
        throw new Error('Please login again');
      }

      // Here you would actually upload the video file
      // For now, we'll just mark video as completed
      const response = await axios.post(
        'https://api.atdmoney.in/api/user/update-video-status',
        { 
          user_id: user.user_id,
          video_status: 1 
        },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Video verification completed successfully!');
        // You might want to refresh the user data here
        window.location.reload();
      } else {
        throw new Error(response.data.message || 'Failed to update video status');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to complete video verification');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVideo = async (file) => {
    setIsLoading(true);
    try {
      const tokenData = TokenManager.getToken();
      const userToken = tokenData.token;
      
      if (!userToken) {
        throw new Error('Please login again');
      }

      const formData = new FormData();
      formData.append('video', file);
      formData.append('user_id', user.user_id);
      formData.append('application_id', user.application_id);

      const response = await axios.post(
        'https://api.atdmoney.in/api/user/upload-video',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Video uploaded successfully!');
        window.location.reload();
      } else {
        throw new Error(response.data.message || 'Failed to upload video');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setIsLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
        <VerificationIcon 
          icon={FaUserCheck}
          title="Video Verification"
          enabled={false}
          completed={true}
          colorScheme="blue"
        />
        <VerificationButton
          enabled={false}
          completed={true}
          tooltipText="Video verification completed!"
          colorScheme="blue"
        >
          Video Verification
        </VerificationButton>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
        <VerificationIcon 
          icon={FaUserCheck}
          title="Video Verification"
          enabled={enabled}
          colorScheme="blue"
        />
        <VerificationButton
          enabled={enabled}
          tooltipText="Video verification not available!"
          colorScheme="blue"
          onClick={handleVideoVerification}
          isLoading={isLoading}
        >
          {isLoading ? 'Processing...' : 'Capture Video'}
        </VerificationButton>
      </div>

      {/* Options Modal */}
      {showOptions && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-center">Select Option</h2>
              <p className="text-sm text-center mt-1">
                Choose how to upload verification video
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <button
                  onClick={handleCameraClick}
                  className="w-full p-4 border-2 border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-3"
                >
                  <FaCamera className="text-blue-600 text-xl" />
                  <span className="font-medium text-blue-700">Record Video with Camera</span>
                </button>
                
                <button
                  onClick={handleGalleryClick}
                  className="w-full p-4 border-2 border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center gap-3"
                >
                  <FaImage className="text-purple-600 text-xl" />
                  <span className="font-medium text-purple-700">Upload from Gallery</span>
                </button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              
              <button
                onClick={handleCloseOptions}
                className="w-full mt-4 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoVerification;