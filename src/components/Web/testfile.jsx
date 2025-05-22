// Helper function to extract YouTube ID from URL
const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  
  src={`https://www.youtube.com/embed/${currentVideo.youtubeId || extractYoutubeId(currentVideo.videoUrl)}`}


  