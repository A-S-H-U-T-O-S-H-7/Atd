import React, { useState, useRef } from 'react';
import { FaUserCheck, FaCamera, FaImage, FaStopCircle } from 'react-icons/fa';
import { TokenManager } from '@/utils/tokenManager';
import toast from 'react-hot-toast';
import axios from 'axios';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const VideoVerification = ({ enabled, completed, VerificationIcon, VerificationButton, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showRecordingUI, setShowRecordingUI] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const handleVideoVerification = () => {
    if (!enabled) return;
    setShowOptions(true);
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleCameraClick = () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      startCameraRecording();
    } else {
      toast.error('Camera not available');
    }
    setShowOptions(false);
  };

  const startCameraRecording = async () => {
    try {
      toast.loading('Starting camera...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, 
        audio: true 
      });
      
      streamRef.current = stream;
      setShowRecordingUI(true);
      setRecordingTime(0);
      recordedChunksRef.current = [];
      
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.muted = true;
        videoPreviewRef.current.playsInline = true;
        videoPreviewRef.current.play();
      }
      
      startMediaRecording(stream);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      if (error.name === 'NotAllowedError') {
        toast.error('Camera access was denied');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found');
      } else {
        toast.error('Failed to access camera');
      }
    }
  };

  const startMediaRecording = (stream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        clearInterval(timerRef.current);
        
        if (recordedChunksRef.current.length === 0) {
          toast.error('No video recorded');
          setShowRecordingUI(false);
          stopCamera();
          return;
        }
        
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const filename = `video_${user.user_id}_${Date.now()}.webm`;
        
        setIsLoading(true);
        await processAndUploadVideo(blob, filename);
        
        setShowRecordingUI(false);
        stopCamera();
      };
      
      mediaRecorder.start();
      
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
        
        if (seconds >= 60) {
          stopRecording();
        }
      }, 1000);
      
      toast.success('Recording started!');
      
    } catch (error) {
      toast.error('Failed to start recording');
      setShowRecordingUI(false);
      stopCamera();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      toast.loading('Processing video...');
    }
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setShowRecordingUI(false);
    stopCamera();
    recordedChunksRef.current = [];
    toast.info('Recording cancelled');
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current.click();
    setShowOptions(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska'];
    const maxSize = 100 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid video file');
      return;
    }

    if (file.size > maxSize) {
      toast.error('Video file too large (max 100MB)');
      return;
    }

    const fileExtension = file.name.split('.').pop();
    const filename = `video_${user.user_id}_${Date.now()}.${fileExtension}`;
    
    setIsLoading(true);
    await processAndUploadVideo(file, filename);
    
    event.target.value = '';
  };

  const uploadToFirebase = async (file, filename) => {
    try {
      toast.loading('Uploading video...');
      
      const storageRef = ref(storage, `verification-videos/${filename}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      toast.dismiss();
      
      return {
        success: true,
        filename: filename,
        downloadURL: downloadURL
      };
      
    } catch (error) {
      toast.dismiss();
      throw new Error('Failed to upload video to storage');
    }
  };

  const updateVideoInAPI = async (filename) => {
    try {
      const tokenData = TokenManager.getToken();
      const userToken = tokenData.token;
      
      if (!userToken) {
        throw new Error('Please login again');
      }

      const response = await axios.put(
        `https://api.atdmoney.in/api/user/video/${user.application_id}`,
        { 
          video: filename,
          video_status: 1
        },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Failed to update video');
      }
    } catch (error) {
      throw new Error('Failed to update video record');
    }
  };

  const processAndUploadVideo = async (file, filename) => {
    try {
      const uploadResult = await uploadToFirebase(file, filename);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }
      
      await updateVideoInAPI(filename);
      
      toast.success('✅ Video verification completed!');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      toast.error(error.message || 'Failed to complete verification');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        <VerificationButton enabled={false} completed={true} tooltipText="Completed" colorScheme="blue">
          Video Verification
        </VerificationButton>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
        <VerificationIcon icon={FaUserCheck} title="Video Verification" enabled={enabled} colorScheme="blue"/>
        <VerificationButton enabled={enabled} tooltipText="Upload video" colorScheme="blue" onClick={handleVideoVerification} isLoading={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Video'}
        </VerificationButton>
      </div>

      {showOptions && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-center">Video Verification</h2>
              <p className="text-sm text-center mt-1 opacity-90">Choose upload method</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <button onClick={handleCameraClick} className="w-full p-4 border-2 border-blue-200 bg-blue-50 rounded-xl hover:bg-blue-100 flex items-center gap-3 group">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                    <FaCamera className="text-blue-600 text-xl"/>
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-blue-700 block">Record Video</span>
                    <span className="text-sm text-blue-600 opacity-80">Use camera to record</span>
                  </div>
                </button>
                
                <button onClick={handleGalleryClick} className="w-full p-4 border-2 border-purple-200 bg-purple-50 rounded-xl hover:bg-purple-100 flex items-center gap-3 group">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                    <FaImage className="text-purple-600 text-xl"/>
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-purple-700 block">Upload from Gallery</span>
                    <span className="text-sm text-purple-600 opacity-80">Select existing video</span>
                  </div>
                </button>
                
                <input type="file" ref={fileInputRef} accept="video/*" onChange={handleFileChange} className="hidden"/>
              </div>
              
              <button onClick={handleCloseOptions} className="w-full mt-6 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                Cancel
              </button>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Max 100MB • MP4, WebM, OGG, MOV</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRecordingUI && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center">
            <video ref={videoPreviewRef} className="w-full h-full object-contain bg-black" autoPlay muted playsInline/>
            
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-3 shadow-lg">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold text-xl">{formatTime(recordingTime)}</span>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <button onClick={stopRecording} className="px-8 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center gap-3 font-bold text-lg shadow-xl animate-pulse">
              <FaStopCircle className="text-2xl"/>
              STOP RECORDING
            </button>
            
            <button onClick={cancelRecording} className="mt-4 text-white text-sm hover:text-gray-300 block mx-auto">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoVerification;