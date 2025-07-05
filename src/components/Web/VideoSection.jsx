"use client"
import React, { useState } from "react";
import { Play, X } from "lucide-react";

const videos = [
  {
    title: "Introduction to ATD Money",
    videoUrl: "https://youtu.be/VrMq8Rmt0T8?si=a4HGQ5l6k_ux07Nm",
    thumbnail: "/Aboutthumbnail.png",
    youtubeId: "VrMq8Rmt0T8"
  },
  {
    title: "Refer & Earn Reward Points",
    videoUrl: "https://youtu.be/6SEvHhA2yDQ?si=yEKpRD91TM8ioek-",
    thumbnail: "/refer&earn.png",
    youtubeId: "6SEvHhA2yDQ" 
  },
  {
    title: "How to Register with ATD Money",
    videoUrl: "https://youtu.be/ENKNM-sfvB0?si=WO38nh5KMcAOYfBY",
    thumbnail: "/registration.png",
    youtubeId: "ENKNM-sfvB0" 
  },
  {
    title: "Central KYC Records Registry",
    videoUrl: "https://youtu.be/G34EE3zj9xM",
    thumbnail: "/kyc.png",
    youtubeId: "G34EE3zj9xM" 
  }
];

const VideoSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const openModal = (video) => {
    setCurrentVideo(video);
    setIsModalOpen(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVideo(null);
    // Re-enable scrolling
    document.body.style.overflow = "auto";
  };

  return (
    <div className="py-8 bg-gray-100">
      <div className="px-4 md:px-10 pb-10">
        <div className="flex flex-col items-center justify-center">
      <h2 className=" text-2xl md:text-3xl text-center font-semibold  mb-2">
          Explore ATD Money in Motion
        </h2>
        <p className="text-gray-700 text-base text-center md:text-lg mb-10">
          Learn everything from registration to earning with our quick video guides.
        </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <VideoCard 
              key={index} 
              {...video} 
              onClick={() => openModal(video)}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && currentVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur effect */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg z-10">
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute -top-10 right-0 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <X size={24} className="text-gray-800" />
            </button>
            
            {/* YouTube Embed */}
            <div className="w-full aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1`}
                title={currentVideo.title}
                className="w-full h-full rounded-lg"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{currentVideo.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const VideoCard = ({ title, videoUrl, thumbnail, youtubeId, onClick }) => {
  return (
    <div 
      className="rounded-2xl overflow-hidden shadow-md bg-cyan-50 relative h-64 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {/* Image covers the entire card */}
      <img
        src={thumbnail}
        alt="Video preview"
        className="w-full h-full object-cover absolute inset-0"
      />
      
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors">
          <Play size={32} className="text-gray-800 ml-1" />
        </div>
      </div>
      
      {/* Title and CTA */}
      <div className="absolute flex items-center justify-between gap-1 bottom-0 left-0 p-4 w-full">
        <p className="text-white text-base font-medium">{title}</p>
        
        <button
          className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium shadow-sm whitespace-nowrap"
        >
          Watch now
        </button>
      </div>
    </div>
  );
};

export default VideoSection;