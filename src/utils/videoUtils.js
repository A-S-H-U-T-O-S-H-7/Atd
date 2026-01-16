export const generateFilename = (file, user, isRecorded = false, mimeType = '') => {
  const cleanName = (user?.fname || 'User')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 20); 
  
  const crnId = user?.crnno || 'NOCRN';
  const timestamp = Date.now();
  
  // Get extension
  let extension = 'webm'; 
  if (!isRecorded && file) {
    extension = file.name.split('.').pop().toLowerCase();
  } else if (isRecorded && mimeType) {
    extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
  }
  
  return `${cleanName}_${crnId}_${timestamp}.${extension}`;
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
  // Remove existing toasts
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
  }
};