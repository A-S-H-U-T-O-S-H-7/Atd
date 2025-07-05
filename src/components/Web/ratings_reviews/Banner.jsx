import React from 'react';

const ReviewsBanner = () => {
  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
      {/* Base Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Abstract Geometric Shapes */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Large floating orbs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Geometric triangles */}
        <div className="absolute top-16 left-16 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-white/10"></div>
        <div className="absolute bottom-20 right-20 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-white/15 rotate-180"></div>
        
        {/* Abstract lines and patterns */}
        <div className="absolute top-1/4 right-1/3 w-24 h-1 bg-white/20 rotate-45 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-32 h-1 bg-white/15 -rotate-12 rounded-full"></div>
        
        {/* Hexagonal shapes */}
        <div className="absolute top-1/2 left-10 w-8 h-8 bg-white/10 transform rotate-45"></div>
        <div className="absolute top-20 right-1/3 w-6 h-6 bg-white/15 transform rotate-12"></div>
        
        {/* Dotted pattern */}
        <div className="absolute top-1/3 left-1/2 grid grid-cols-3 gap-2">
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="w-2 h-2 bg-white/15 rounded-full"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="w-2 h-2 bg-white/15 rounded-full"></div>
          <div className="w-2 h-2 bg-white/25 rounded-full"></div>
          <div className="w-2 h-2 bg-white/15 rounded-full"></div>
        </div>
        
        {/* Curved abstract paths */}
        <svg className="absolute top-0 right-0 w-64 h-64 opacity-10" viewBox="0 0 200 200">
          <path
            d="M50,50 Q150,50 150,150 Q50,150 50,50"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <circle cx="100" cy="100" r="30" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
        </svg>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-bounce"></div>
          <div className="absolute top-32 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-24 left-1/5 w-1 h-1 bg-white/35 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        {/* Abstract grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
            Customer Reviews
          </h1>
          <p className="text-lg md:text-xl opacity-90 drop-shadow-md">
            What our customers say about us
          </p>
          
          {/* Star rating visual element */}
          <div className="flex justify-center mt-4 space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-yellow-400/80 rounded-sm transform rotate-45"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Wavy Edge */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-20"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120V73.71c47.79-22.2,103.59-32.17,158-28,70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27-18,138.3-24.88,209.4-13.08,36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,134.29,1200,67.53V120Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default ReviewsBanner;