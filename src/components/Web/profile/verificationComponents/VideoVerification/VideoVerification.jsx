import React, { useState, useRef, useEffect } from 'react';
import { FaUserCheck } from 'react-icons/fa';
import { TokenManager } from '@/utils/tokenManager';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import RecordingModal from './RecordingModal';
import ConfirmationModal from './ConfirmationModal';
import OptionsModal from './OptionsModal';
import { showToast, cleanupStream, generateFilename, getSupportedMimeType } from '@/utils/videoUtils';

const VideoVerification = ({ enabled, completed, VerificationIcon, VerificationButton, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [timer, setTimer] = useState('00:00');
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordedFilename, setRecordedFilename] = useState('');
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'video-verification-styles';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      
      .animate-scaleIn {
        animation: scaleIn 0.3s ease-out;
      }
      
      @media (max-width: 640px) {
        .custom-toast {
          left: 4px;
          right: 4px;
          top: 4px;
          width: calc(100% - 8px);
          max-width: none;
        }
        
        .video-modal video {
          height: 75vh !important;
          width: 100vw !important;
          max-height: 75vh !important;
          max-width: 100vw !important;
          object-fit: cover !important;
        }
        
        .video-container {
          height: 75vh !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .recording-controls {
          padding: 12px !important;
          padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
          min-height: auto !important;
        }
        
        .recording-controls button {
          min-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .stop-button {
          padding: 14px !important;
          font-size: 16px !important;
          height: auto !important;
          line-height: 1.2 !important;
        }
        
        .cancel-button {
          font-size: 14px !important;
          padding: 10px !important;
          height: auto !important;
        }
        
        .options-modal {
          max-height: 85vh !important;
          overflow-y: auto !important;
        }
        
        .options-content {
          padding: 16px !important;
        }
      }
      
      @media (max-width: 640px) and (orientation: landscape) {
        .video-modal video {
          height: 85vh !important;
          width: 100vw !important;
        }
        
        .video-container {
          height: 85vh !important;
        }
        
        .recording-header {
          padding: 8px !important;
        }
        
        .recording-controls {
          padding: 8px !important;
          padding-bottom: max(8px, env(safe-area-inset-bottom)) !important;
        }
      }
      
      @media (min-width: 641px) and (max-width: 1024px) {
        .video-modal video {
          height: 70vh !important;
          width: 90vw !important;
          max-height: 70vh !important;
          max-width: 90vw !important;
        }
        
        .video-container {
          height: 70vh !important;
          max-width: 90vw !important;
          margin: 0 auto !important;
        }
      }
      
      @media (min-width: 1025px) {
        .video-modal video {
          height: 65vh !important;
          width: 70vw !important;
          max-height: 65vh !important;
          max-width: 70vw !important;
        }
        
        .video-container {
          height: 65vh !important;
          max-width: 70vw !important;
          margin: 0 auto !important;
        }
      }
      
      @media (min-width: 1440px) {
        .video-modal video {
          height: 60vh !important;
          width: 60vw !important;
        }
        
        .video-container {
          height: 60vh !important;
          max-width: 60vw !important;
        }
      }
      
      .video-modal {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
        background: #000;
      }
      
      .video-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #000;
        position: relative;
        overflow: hidden;
      }
      
      @supports (padding: max(0px)) {
        .recording-controls {
          padding-bottom: max(16px, env(safe-area-inset-bottom)) !important;
        }
      }
    `;
    
    if (typeof document !== 'undefined' && !document.getElementById('video-verification-styles')) {
      document.head.appendChild(style);
    }
    
    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, []);

  const handleVideoVerification = () => {
    if (!enabled) return;
    setShowOptions(true);
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
    cleanupStream(streamRef);
  };

  const handleCameraClick = async () => {
    setShowOptions(false);
    
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      await startCameraRecording();
    } else {
      showToast('Camera not available on this device', 'error');
    }
  };

  const startCameraRecording = async () => {
    try {
      showToast('Opening camera...');
      
      cleanupStream(streamRef);

      const constraints = {
        video: {
          width: { ideal: 1920, max: 2560 },
          height: { ideal: 1080, max: 1440 },
          aspectRatio: { ideal: 16/9 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      startRecordingProcess(stream);
      
    } catch (error) {
      console.error('Camera error:', error);
      if (error.name === 'NotAllowedError') {
        showToast('Camera access denied. Please allow permissions in browser settings.', 'error');
      } else if (error.name === 'NotFoundError') {
        showToast('No camera found on this device.', 'error');
      } else if (error.name === 'NotReadableError') {
        showToast('Camera is in use by another application.', 'error');
      } else {
        showToast('Failed to access camera. Please try again.', 'error');
      }
    }
  };

  const startRecordingProcess = (stream) => {
    setIsRecording(true);
    setTimer('00:00');
    chunksRef.current = [];
    startTimeRef.current = Date.now();

    // Get best MIME type for current device
    const mimeType = getSupportedMimeType();

    let mediaRecorder;
    
    try {
      if (mimeType) {
        mediaRecorder = new MediaRecorder(stream, { 
          mimeType,
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000
        });
      } else {
        mediaRecorder = new MediaRecorder(stream, {
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000
        });
      }
    } catch (error) {
      console.log('Error with MIME type, using default:', error);
      mediaRecorder = new MediaRecorder(stream);
    }

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      clearInterval(timerIntervalRef.current);
      
      const duration = (Date.now() - startTimeRef.current) / 1000;
      if (duration < 3) {
        showToast('Video must be at least 3 seconds', 'error');
        cleanupRecording();
        return;
      }

      const blob = new Blob(chunksRef.current, { 
        type: mediaRecorder.mimeType || 'video/mp4'
      });
      
      const filename = generateFilename(null, user, true, mediaRecorder.mimeType);
      
      console.log('Recorded video:', {
        filename,
        mimeType: mediaRecorder.mimeType,
        size: blob.size,
        duration: `${duration}s`
      });
      
      setRecordedVideo(blob);
      setRecordedFilename(filename);
      setIsRecording(false);
      setShowConfirmation(true);
      
      cleanupStream(streamRef);
      document.body.style.overflow = '';
    };

    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event.error);
      showToast('Recording error occurred', 'error');
      cleanupRecording();
    };

    mediaRecorder.start(1000);
    showToast('Recording started', 'success');

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

      if (elapsed >= 90) {
        mediaRecorder.stop();
        showToast('Recording stopped automatically (90 sec limit)', 'info');
      }
    }, 1000);
    
    document.body.style.overflow = 'hidden';
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleCancelRecording = () => {
    clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      cleanupRecording();
    }
    showToast('Recording cancelled', 'info');
  };

  const cleanupRecording = () => {
    clearInterval(timerIntervalRef.current);
    cleanupStream(streamRef);
    setIsRecording(false);
    document.body.style.overflow = '';
    
    // Clean up media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
  };

  const handleGalleryClick = () => {
    setShowOptions(false);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 100);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska', 'video/avi'];
    const maxSize = 100 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      showToast('Please select MP4, WebM, MOV, AVI, or OGG video file', 'error');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      showToast('Video file too large (max 100MB)', 'error');
      event.target.value = '';
      return;
    }

    const filename = generateFilename(file, user, false);
    
    setIsLoading(true);
    showToast('Uploading video...');
    
    try {
      await processAndUploadVideo(file, filename);
    } catch (error) {
      showToast(error.message || 'Failed to upload video', 'error');
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  const handleConfirmUpload = async () => {
    setShowConfirmation(false);
    
    setIsLoading(true);
    showToast('Uploading video...');
    
    try {
      await processAndUploadVideo(recordedVideo, recordedFilename);
    } catch (error) {
      showToast(error.message || 'Failed to upload video', 'error');
      setIsLoading(false);
    }
  };

  const handleDiscardVideo = () => {
    setShowConfirmation(false);
    showToast('Video discarded', 'info');
    
    setTimeout(() => {
      handleCameraClick();
    }, 500);
  };

  const uploadToFirebase = async (file, filename) => {
    try {
      const storageRef = ref(storage, `video-kyc/${filename}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        filename: filename,
        downloadURL: downloadURL
      };
      
    } catch (error) {
      console.error('Firebase upload error:', error);
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
        `https://live.atdmoney.com/api/user/video/${user.application_id}`,
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
      console.error('API update error:', error);
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
      
      showToast('✅ Video verification completed successfully!', 'success');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Upload process error:', error);
      throw error;
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
        <OptionsModal
          onCameraClick={handleCameraClick}
          onGalleryClick={handleGalleryClick}
          onClose={handleCloseOptions}
        />
      )}

      {isRecording && streamRef.current && (
        <RecordingModal
          stream={streamRef.current}
          onStopRecording={handleStopRecording}
          onCancelRecording={handleCancelRecording}
          timer={timer}
          userName={`${user?.fname || ''} ${user?.lname || ''}`.trim() || 'your name'}
        />
      )}

      {showConfirmation && (
        <ConfirmationModal
          filename={recordedFilename}
          onConfirmUpload={handleConfirmUpload}
          onDiscard={handleDiscardVideo}
          onClose={() => setShowConfirmation(false)}
        />
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".mp4,.webm,.mov,.avi,.ogg,.mkv" 
        onChange={handleFileChange} 
        className="hidden"
        capture="environment"
      />
    </>
  );
};

export default VideoVerification;