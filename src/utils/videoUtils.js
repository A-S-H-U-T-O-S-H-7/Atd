export const generateFilename = (file, user, isRecorded = false, mimeType = '') => {
  const cleanName = (user?.fname || 'User').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  const crnId = user?.crnno || 'NOCRN';
  const timestamp = Date.now();
  
  let extension = 'mp4';
  
  if (!isRecorded && file) {
    extension = file.name.split('.').pop().toLowerCase();
    if (!['mp4', 'webm', 'mov', 'avi', 'ogg', 'mkv', 'm4v'].includes(extension)) {
      extension = 'mp4';
    }
  } else if (isRecorded && mimeType) {
    if (mimeType.includes('mp4')) extension = 'mp4';
    else if (mimeType.includes('webm')) extension = 'webm';
    else if (mimeType.includes('ogg')) extension = 'ogg';
    else if (mimeType.includes('quicktime')) extension = 'mov';
    else if (mimeType.includes('x-matroska')) extension = 'mkv';
  }
  
  return `${cleanName}_${crnId}_${timestamp}.${extension}`;
};

export const getSupportedMimeType = () => {
  const mimeTypes = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/mp4',
    'video/webm',
    'video/ogg;codecs=theora,vorbis'
  ];

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);
  
  let preferredTypes = [...mimeTypes];
  
  if (isIOS) {
    preferredTypes = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', ...mimeTypes.filter(m => !m.includes('mp4'))];
  } else if (isAndroid) {
    preferredTypes = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', ...mimeTypes];
  }

  for (const mimeType of preferredTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      console.log('Selected MIME type:', mimeType);
      return mimeType;
    }
  }

  return undefined;
};

export const cleanupStream = (streamRef) => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => {
      track.stop();
      track.enabled = false;
    });
    streamRef.current = null;
  }
};

export const showToast = (message, type = 'info') => {
  if (typeof document !== 'undefined') {
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
  }
};