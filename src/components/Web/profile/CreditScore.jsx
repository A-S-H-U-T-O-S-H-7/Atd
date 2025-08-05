'use client';

import Image from 'next/image';

export default function CreditScoreSection({ creditScore = 750 }) {
  const handleGetReport = () => {
    console.log('Downloading CIBIL report...');
    // Future implementation: API call to download report
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-2xl border border-slate-200 shadow-md px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating circles */}
        {/* <div className="absolute top-4 right-8 w-20 h-20 bg-pink-200/30 rounded-full blur-sm"></div>
        <div className="absolute bottom-6 left-12 w-16 h-16 bg-purple-200/40 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-yellow-200/50 rounded-full blur-sm"></div> */}
        
        {/* Geometric shapes */}
        {/* <div className="absolute top-8 left-1/3 w-8 h-8 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rotate-45 rounded-sm blur-sm"></div>
        <div className="absolute bottom-8 right-1/3 w-6 h-6 bg-gradient-to-br from-yellow-300/30 to-pink-300/30 rotate-12 rounded-sm blur-sm"></div> */}
        
        {/* Wave-like patterns */}
        {/* <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full opacity-10" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 Q100,50 200,100 T400,100 V200 H0 Z" fill="url(#gradient1)" />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div> */}

      </div>

      {/* Content - now with relative positioning to stay above background */}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative">
          <Image src="/creditscore.png" alt="Credit Score" width={150} height={250} className="rounded-xl " />
          {/* Subtle glow effect around image */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-xl blur-lg -z-10 scale-110"></div>
        </div>
      </div>

      {/* Text and Button */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-pink-700 mb-2 drop-shadow-sm">Get Your CIBIL Report Now</h3>
          <p className="text-pink-600/80 text-sm font-medium">Instant access to your credit history</p>
        </div>

        <button
          onClick={handleGetReport}
          className="relative cursor-pointer bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden group"
        >
          {/* Button shine effect */}
          <div className="absolute  inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative z-10">Get It Now</span>
        </button>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-200/30 to-transparent rounded-br-2xl"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-yellow-200/30 to-transparent rounded-tl-2xl"></div>
    </div>
  );
}