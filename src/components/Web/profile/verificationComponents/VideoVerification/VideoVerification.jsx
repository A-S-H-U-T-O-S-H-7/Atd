import React, { useState, useRef, useEffect } from 'react';
import { FaUserCheck, FaCamera, FaImage, FaTimes } from 'react-icons/fa';
import { TokenManager } from '@/utils/tokenManager';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

const VideoVerification = ({ enabled, completed, VerificationIcon, VerificationButton, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordingModalRef = useRef(null);
  const confirmationModalRef = useRef(null);
  const videoRef = useRef(null);

  // Add CSS animations with responsive improvements
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
      
      /* Mobile optimizations - LARGER video preview */
      @media (max-width: 640px) {
        .custom-toast {
          left: 4px;
          right: 4px;
          top: 4px;
          width: calc(100% - 8px);
          max-width: none;
        }
        
        /* MUCH LARGER video on mobile - fill most of screen */
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
        
        /* Fix cancel button cropping */
        .recording-controls {
          padding: 12px !important;
          padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
        }
        
        .recording-controls button {
          font-size: 14px !important;
          padding: 10px !important;
        }
        
        .stop-button {
          padding: 12px !important;
          font-size: 16px !important;
        }
      }
      
      /* Mobile landscape */
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
      
      /* Tablet optimizations */
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
      
      /* Desktop optimizations */
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
      
      /* Extra large screens */
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
      
      /* Video modal styling */
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
      
      /* Safe area for mobile buttons */
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

  // Generate safe filename
  const generateFilename = (file, isRecorded = false, mimeType = '') => {
    // Clean user name (remove special characters, spaces)
    const cleanName = (user?.fname || 'User')
      .replace(/[^a-zA-Z0-9]/g, '') // Remove special chars
      .substring(0, 20); // Limit length
    
    const crnId = user?.crnno || 'NOCRN';
    const timestamp = Date.now();
    
    // Get extension
    let extension = 'webm'; // Default for recorded videos
    if (!isRecorded && file) {
      extension = file.name.split('.').pop().toLowerCase();
    } else if (isRecorded && mimeType) {
      extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
    }
    
    return `${cleanName}_${crnId}_${timestamp}.${extension}`;
  };

  const showToast = (message, type = 'info') => {
    // Remove existing toasts
    document.querySelectorAll('.custom-toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `custom-toast fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white z-[9999] text-sm md:text-base max-w-xs md:max-w-sm ${
      type === 'error' ? 'bg-red-500' : 
      type === 'success' ? 'bg-green-500' : 
      'bg-blue-500'
    }`;
    toast.textContent = message;
    toast.style.transform = 'translateY(-20px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
      toast.style.transform = 'translateY(-20px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  const handleVideoVerification = () => {
    if (!enabled) return;
    setShowOptions(true);
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
    cleanupStream();
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
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
      
      cleanupStream();

      // Optimized constraints for mobile face visibility
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
      createRecordingUI(stream);
      
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

  const createRecordingUI = (stream) => {
    if (recordingModalRef.current) {
      document.body.removeChild(recordingModalRef.current);
    }

    const modal = document.createElement('div');
    modal.className = 'video-modal fixed inset-0 bg-black flex flex-col z-[9998]';
    recordingModalRef.current = modal;

    // Header - Smaller on mobile
    const header = document.createElement('div');
    header.className = 'recording-header flex justify-between items-center p-3 md:p-4 bg-black/80 backdrop-blur-sm shrink-0';
    
    const title = document.createElement('div');
    title.className = 'flex items-center gap-2';
    title.innerHTML = `
      <div class="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
      <span class="text-white font-medium text-sm md:text-base">Recording</span>
      <span class="text-white/70 text-xs md:text-sm">(90s)</span>
    `;
    
    const timer = document.createElement('div');
    timer.className = 'bg-red-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-full font-mono text-sm md:text-lg';
    timer.textContent = '00:00';
    
    header.appendChild(title);
    header.appendChild(timer);

    // Video Container - MUCH LARGER for mobile
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    
    const video = document.createElement('video');
    video.className = 'w-full h-full object-cover';
    video.ref = videoRef;
    video.srcObject = stream;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.transform = 'scaleX(-1)'; // Mirror effect for selfie view
    
    videoContainer.appendChild(video);

    // Instructions - Minimal on mobile
    const instructions = document.createElement('div');
    instructions.className = 'px-3 py-2 text-center shrink-0 bg-black/40';
    instructions.innerHTML = `
      <p class="text-white/80 text-xs md:text-sm">Speak clearly, face well-lit</p>
      <p class="text-white/60 text-xs mt-1">Auto-stops at 90 seconds</p>
    `;

    // Controls - Fixed for mobile cropping
    const controls = document.createElement('div');
    controls.className = 'recording-controls p-3 md:p-4 bg-black/50 backdrop-blur-sm shrink-0';
    
    const controlsInner = document.createElement('div');
    controlsInner.className = 'flex flex-col items-center gap-3 max-w-md mx-auto';
    
    const stopButton = document.createElement('button');
    stopButton.className = 'stop-button w-full py-3 md:py-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-3';
    stopButton.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="2"></rect>
      </svg>
      <span>Stop Recording</span>
    `;
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-button py-2 md:py-3 px-4 md:px-6 text-white/80 hover:text-white font-medium transition-colors text-sm md:text-base';
    cancelButton.textContent = 'Cancel';
    
    controlsInner.appendChild(stopButton);
    controlsInner.appendChild(cancelButton);
    controls.appendChild(controlsInner);

    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(videoContainer);
    modal.appendChild(instructions);
    modal.appendChild(controls);
    document.body.appendChild(modal);

    // Handle video play
    video.play().catch(err => {
      console.error('Video play failed:', err);
      showToast('Could not start camera preview', 'error');
    });

    // Adjust video for optimal face visibility
    const adjustVideoForFace = () => {
      if (!video) return;
      
      // On mobile, use object-fit: cover for better face visibility
      if (window.innerWidth <= 640) {
        video.style.objectFit = 'cover';
        video.style.width = '100%';
        video.style.height = '100%';
      } else {
        video.style.objectFit = 'contain';
      }
    };

    // Initial adjustment
    setTimeout(adjustVideoForFace, 100);
    
    // Adjust on window resize
    const resizeObserver = new ResizeObserver(() => {
      adjustVideoForFace();
      // Ensure controls are visible
      controls.style.paddingBottom = 'max(12px, env(safe-area-inset-bottom))';
    });
    resizeObserver.observe(modal);

    // Recording logic
    let startTime;
    let timerInterval;
    const chunks = [];
    let isCancelled = false;
    let recordingMimeType = '';

    const startRecording = () => {
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
            recordingMimeType = mimeType;
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
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        clearInterval(timerInterval);
        if (resizeObserver) resizeObserver.disconnect();
        
        if (isCancelled) {
          cleanupAndRemoveModal();
          showToast('Recording cancelled', 'info');
          return;
        }
        
        if (chunks.length === 0) {
          cleanupAndRemoveModal();
          showToast('No video recorded', 'error');
          return;
        }

        // Check minimum duration (3 seconds)
        const duration = (Date.now() - startTime) / 1000;
        if (duration < 3) {
          cleanupAndRemoveModal();
          showToast('Video must be at least 3 seconds', 'error');
          return;
        }

        const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'video/webm' });
        const filename = generateFilename(null, true, recordingMimeType);
        
        cleanupAndRemoveModal();
        showUploadConfirmation(blob, filename);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        showToast('Recording error occurred', 'error');
        cleanupAndRemoveModal();
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      startTime = Date.now();

      // Update timer
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Auto-stop at 90 seconds
        if (elapsed >= 90) {
          stopButton.click();
          showToast('Recording stopped automatically after 90 seconds', 'info');
        }
      }, 1000);
      
      showToast('Recording started - 90 seconds maximum', 'success');
    };

    // Event listeners
    stopButton.onclick = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };

    cancelButton.onclick = () => {
      isCancelled = true;
      clearInterval(timerInterval);
      if (resizeObserver) resizeObserver.disconnect();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      } else {
        cleanupAndRemoveModal();
        showToast('Recording cancelled', 'info');
      }
    };

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Ensure safe area for iOS
    if (CSS.supports('padding: env(safe-area-inset-bottom)')) {
      controls.style.paddingBottom = 'max(12px, env(safe-area-inset-bottom))';
    }

    // Start recording with delay
    setTimeout(startRecording, 1000);
  };

  const showUploadConfirmation = (blob, filename) => {
    if (confirmationModalRef.current) {
      document.body.removeChild(confirmationModalRef.current);
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4';
    confirmationModalRef.current = modal;

    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn';
    
    dialog.innerHTML = `
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 md:p-6">
        <h3 class="text-xl md:text-2xl font-bold">Video Recorded</h3>
        <p class="text-blue-100 text-sm md:text-base mt-1">Ready to upload your verification video</p>
      </div>

      <div class="p-5 md:p-6 space-y-4 md:space-y-5">
        <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div class="flex items-start gap-3">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-700 text-sm md:text-base font-medium">Video recorded successfully</p>
              <p class="text-gray-600 text-xs md:text-sm mt-1">Ensure your face is clearly visible before uploading</p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button id="confirmUploadBtn" class="w-full py-3 md:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg transition-all active:scale-95">
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Upload Video</span>
            </div>
          </button>
          
          <button id="discardBtn" class="w-full py-3 md:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all">
            Discard & Record Again
          </button>
        </div>
        
        <div class="pt-3 border-t border-gray-200">
          <p class="text-gray-500 text-xs text-center">
            File: <span class="font-mono">${filename}</span>
          </p>
        </div>
      </div>
    `;

    modal.appendChild(dialog);
    document.body.appendChild(modal);

    const confirmBtn = dialog.querySelector('#confirmUploadBtn');
    const discardBtn = dialog.querySelector('#discardBtn');

    confirmBtn.onclick = async () => {
      document.body.removeChild(modal);
      confirmationModalRef.current = null;
      
      setIsLoading(true);
      showToast('Uploading video...');
      
      try {
        await processAndUploadVideo(blob, filename);
      } catch (error) {
        showToast(error.message || 'Failed to upload video', 'error');
        setIsLoading(false);
      }
    };

    discardBtn.onclick = () => {
      document.body.removeChild(modal);
      confirmationModalRef.current = null;
      showToast('Video discarded', 'info');
      
      // Re-open camera
      setTimeout(() => {
        handleCameraClick();
      }, 500);
    };

    // Handle outside click
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        confirmationModalRef.current = null;
        showToast('Upload cancelled', 'info');
      }
    };
  };

  const cleanupAndRemoveModal = () => {
    cleanupStream();
    
    if (recordingModalRef.current) {
      document.body.removeChild(recordingModalRef.current);
      recordingModalRef.current = null;
    }
    
    // Restore body scroll
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

    const filename = generateFilename(file, false);
    
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

  // ========== UPLOAD & API FUNCTIONS ==========

  const uploadToFirebase = async (file, filename) => {
    try {
      const storageRef = ref(storage, `verification-videos/${filename}`);
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

      {/* Options Modal - Mobile Optimized */}
      {showOptions && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 md:p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Video Verification</h2>
                  <p className="text-blue-100 text-sm md:text-base mt-0.5">Choose upload method</p>
                </div>
                <button 
                  onClick={handleCloseOptions}
                  className="p-2 hover:bg-blue-700 rounded-xl transition-all active:scale-95"
                  aria-label="Close"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            
            <div className="p-5 md:p-6">
              <div className="space-y-4 md:space-y-5">
                {/* Camera Option */}
                <button 
                  onClick={handleCameraClick}
                  className="w-full p-4 md:p-5 bg-gradient-to-r from-blue-50 to-white border-2 border-blue-200 hover:border-blue-400 hover:from-blue-100 hover:to-blue-50 rounded-xl flex items-center gap-4 transition-all active:scale-95"
                >
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow">
                    <FaCamera className="text-xl md:text-2xl" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-bold text-gray-800 block text-base md:text-lg">Record Video</span>
                    <span className="text-gray-600 text-sm md:text-base">Record new video (90 seconds max)</span>
                  </div>
                </button>
                
                {/* Gallery Option */}
                <button 
                  onClick={handleGalleryClick}
                  className="w-full p-4 md:p-5 bg-gradient-to-r from-purple-50 to-white border-2 border-purple-200 hover:border-purple-400 hover:from-purple-100 hover:to-purple-50 rounded-xl flex items-center gap-4 transition-all active:scale-95"
                >
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow">
                    <FaImage className="text-xl md:text-2xl" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-bold text-gray-800 block text-base md:text-lg">Upload from Gallery</span>
                    <span className="text-gray-600 text-sm md:text-base">Choose existing video file</span>
                  </div>
                </button>
              </div>
              
              <button 
                onClick={handleCloseOptions}
                className="w-full mt-6 py-3.5 md:py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all active:scale-95"
              >
                Cancel
              </button>
              
              <div className="mt-5 md:mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-600 text-xs md:text-sm">
                  <span className="font-semibold block mb-1">Supported Formats:</span>
                  MP4, WebM, MOV, AVI, OGG
                  <br/>
                  <span className="font-semibold">Maximum Size:</span> 100MB
                  <br/>
                  <span className="font-semibold">Recording Duration:</span> 90 seconds maximum
                  <br/>
                  <span className="font-semibold">Minimum Duration:</span> 3 seconds
                </p>
              </div>
            </div>
          </div>
        </div>
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