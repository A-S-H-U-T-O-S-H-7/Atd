import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error('Video play failed:', err);
      });
    }

    // Handle mobile safe areas
    const updateSafeArea = () => {
      if (controlsRef.current && CSS.supports('padding: env(safe-area-inset-bottom)')) {
        controlsRef.current.style.paddingBottom = 'max(12px, env(safe-area-inset-bottom))';
      }
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
    };
  }, [stream]);

  return (
    <div className="video-modal fixed inset-0 bg-black flex flex-col z-[9998]">
      {/* Header */}
      <div className="recording-header flex justify-between items-center p-3 md:p-4 bg-black/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium text-sm md:text-base">Recording Video</span>
        </div>
        <div className="bg-red-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-full font-mono text-sm md:text-lg">
          {timer}
        </div>
      </div>

      {/* Video Container with ContentCard */}
      <div className="flex-1 flex flex-col overflow-auto">
        <ContentCard userName={userName} />
        
        <div className="video-container flex-1">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            autoPlay
            playsInline
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="px-3 py-2 text-center shrink-0 bg-black/40">
        <p className="text-white/80 text-xs md:text-sm">Make sure your face is clearly visible</p>
      </div>

      {/* Controls */}
      <div ref={controlsRef} className="recording-controls p-3 md:p-4 bg-black/50 backdrop-blur-sm shrink-0">
        <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
          <button
            onClick={onStopRecording}
            className="stop-button w-full py-3 md:py-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <Square className="w-5 h-5" fill="currentColor" />
            <span>Stop Recording</span>
          </button>
          
          <button
            onClick={onCancelRecording}
            className="cancel-button py-2 md:py-3 px-4 md:px-6 text-white/80 hover:text-white font-medium transition-colors text-sm md:text-base flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordingModal;