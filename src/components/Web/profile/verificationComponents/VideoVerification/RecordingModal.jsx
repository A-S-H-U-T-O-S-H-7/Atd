import React, { useEffect, useRef, useState } from 'react';
import { X, Square } from 'lucide-react';
import ContentCard from './ContentCard';

const RecordingModal = ({
  stream,
  onStopRecording,
  onCancelRecording,
  timer,
  userName
}) => {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let playPromise;

    // Detect iOS for specific fixes
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);

    const setupVideo = async () => {
      if (!videoRef.current || !stream || !isMounted) return;

      try {
        videoRef.current.srcObject = stream;
        
        playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (isMounted) {
                console.log('Video playback started successfully');
              }
            })
            .catch(error => {
              if (isMounted) {
                if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                  console.error('Video play failed:', error);
                }
              }
            });
        }
      } catch (err) {
        console.error('Video setup error:', err);
      }
    };

    setupVideo();

    // Handle mobile safe areas and ensure controls are visible
    const updateSafeArea = () => {
      if (!controlsRef.current) return;
      
      const isMobile = window.innerWidth <= 640;
      const isLandscape = window.innerWidth > window.innerHeight;
      
      // For iOS Safari, we need extra bottom padding
      if (isIOS && isMobile) {
        controlsRef.current.style.paddingBottom = 'calc(20px + env(safe-area-inset-bottom))';
      } else if (CSS.supports('padding: env(safe-area-inset-bottom)')) {
        controlsRef.current.style.paddingBottom = 'max(20px, env(safe-area-inset-bottom))';
      } else {
        controlsRef.current.style.paddingBottom = '20px';
      }

      controlsRef.current.style.zIndex = '10000';
      
      // On mobile, add extra margin when URL bar is visible (in portrait)
      if (isMobile && !isLandscape) {
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const windowHeight = window.innerHeight;
        const urlBarHeight = windowHeight - viewportHeight;
        
        if (urlBarHeight > 0) {
          controlsRef.current.style.marginBottom = `${urlBarHeight}px`;
        }
      }
    };

    updateSafeArea();
    
    // Update on resize and visual viewport changes (for mobile URL bar)
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateSafeArea);
    }

    // Handle scroll to prevent URL bar hiding on mobile
    const preventScroll = (e) => {
      if (window.innerWidth <= 640) {
        e.preventDefault();
        window.scrollTo(0, 0);
      }
    };

    // Lock scroll position on mobile
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    window.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    // Cleanup function
    return () => {
      isMounted = false;
      
      // Abort any pending play request
      if (playPromise) {
        playPromise.catch(() => {}); 
      }
      
      // Clean up video element
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
          videoRef.current.load();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      
      // Remove event listeners
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateSafeArea);
      }
      
      // Restore body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [stream, isIOS]);

  return (
    <div className="video-modal fixed inset-0 bg-black flex flex-col z-[9999]">
      {/* Header */}
      <div className="recording-header flex justify-between items-center p-4 bg-black/90 backdrop-blur-sm shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <div>
            <span className="text-white font-semibold text-sm md:text-base block">Recording Video</span>
            <span className="text-white/70 text-xs">Say "{userName}" clearly</span>
          </div>
        </div>
        
        {/* Removed timer from top-right */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Content Card */}
        <ContentCard userName={userName} />
        
        {/* Video Container */}
        <div className="video-container flex-1">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            autoPlay
            playsInline
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {/* Timer overlay on video with red dot */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="font-mono text-base md:text-lg font-bold">{timer}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-4 py-2 text-center shrink-0 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white/90 text-xs md:text-sm font-medium">
          Keep your face visible and speak clearly
        </p>
        <p className="text-white/60 text-xs mt-1">
          Minimum 3 seconds • Maximum 90 seconds
        </p>
      </div>

      {/* Controls - Fixed position to ensure visibility */}
      <div 
        ref={controlsRef} 
        className="recording-controls p-4 bg-gradient-to-t from-black via-black/95 to-black/90 backdrop-blur-sm shrink-0 fixed bottom-0 left-0 right-0 z-20"
      >
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {/* Removed timer from mobile quick reference */}
          
          <div className="flex justify-between gap-3">
            <button
              onClick={onStopRecording}
              className="stop-button w-full py-3 md:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-[0.98] text-white rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-3 text-base md:text-lg"
              aria-label="Stop recording"
            >
              <Square className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
              <span>Stop Recording</span>
            </button>
            
            <button
              onClick={onCancelRecording}
              className="cancel-button py-3 md:py-4 px-4 md:px-6 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-medium transition-all text-sm md:text-base flex items-center justify-center gap-2 rounded-xl"
              aria-label="Cancel recording"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingModal;