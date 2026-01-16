import React, { useState, useRef, useEffect } from 'react';
import { FaUserCheck } from 'react-icons/fa';
import { TokenManager } from '@/utils/tokenManager';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import RecordingModal from './RecordingModal';
import ConfirmationModal from './ConfirmationModal';
import OptionsModal from './OptionsModal';
import { showToast, cleanupStream, generateFilename } from '@/utils/videoUtils';

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
  const recordingMimeTypeRef = useRef('');

  // Add CSS animations (same as your original useEffect)
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'video-verification-styles';
    style.textContent = `
      /* Your existing CSS styles here */
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
      
      // Start recording process
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

    // Try supported mime types
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2'
    ];

    let mediaRecorder;
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        try {
          mediaRecorder = new MediaRecorder(stream, { 
            mimeType,
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000
          });
          recordingMimeTypeRef.current = mimeType;
          break;
        } catch (e) {
          continue;
        }
      }
    }

    if (!mediaRecorder) {
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
        type: mediaRecorder.mimeType || 'video/webm' 
      });
      
      const filename = generateFilename(null, user, true, recordingMimeTypeRef.current);
      
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

    // Start recording
    mediaRecorder.start(1000);
    showToast('Recording started', 'success');

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

      // Auto-stop at 90 seconds
      if (elapsed >= 90) {
        mediaRecorder.stop();
        showToast('Recording stopped automatically', 'info');
      }
    }, 1000);
    
    // Prevent body scroll
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
    cleanupStream(streamRef);
    setIsRecording(false);
    document.body.style.overflow = '';
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

    // Validate file
    const validTypes = [
      'video/mp4', 
      'video/webm', 
      'video/ogg', 
      'video/quicktime',
      'video/x-matroska',
      'video/avi'
    ];
    
    const maxSize = 100 * 1024 * 1024; // 100MB

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
    
    // Re-open camera
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
      console.error('API update error:', error);
      throw new Error('Failed to update video record');
    }
  };

  const processAndUploadVideo = async (file, filename) => {
    try {
      // Upload to Firebase
      const uploadResult = await uploadToFirebase(file, filename);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }
      
      // Update database
      await updateVideoInAPI(filename);
      
      showToast('✅ Video verification completed successfully!', 'success');
      
      // Refresh after delay
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

      {/* Options Modal */}
      {showOptions && (
        <OptionsModal
          onCameraClick={handleCameraClick}
          onGalleryClick={handleGalleryClick}
          onClose={handleCloseOptions}
        />
      )}

      {/* Recording Modal */}
      {isRecording && streamRef.current && (
        <RecordingModal
          stream={streamRef.current}
          onStopRecording={handleStopRecording}
          onCancelRecording={handleCancelRecording}
          timer={timer}
          userName={user?.fname || 'your name'}
        />
      )}

      {/* Confirmation Modal */}
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