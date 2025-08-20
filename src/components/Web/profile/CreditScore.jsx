'use client';

import Image from 'next/image';

export default function CreditScoreSection({ creditScore = 750 }) {
  const handleGetReport = () => {
    console.log('Downloading CIBIL report...');
    // Future implementation: API call to download report
  };

  return (
    <div className="relative rounded-full w-full bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100  border border-rose-300 shadow-md px-1 md:px-6 py-2 flex flex-col  items-center justify-between gap-2 overflow-hidden">
      
    

      {/* Content - now with relative positioning to stay above background */}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative">
          <Image src="/creditscore.png" alt="Credit Score" width={150} height={250} className="rounded-xl " />
          {/* Subtle glow effect around image */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-xl blur-lg -z-10 scale-110"></div>
        </div>
      </div>

      {/* Text and Button */}
      <div className="relative z-10 flex flex-col  justify-between items-center w-full gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl font-bold text-pink-700 mb-2 drop-shadow-sm">Get Your CIBIL Report Now</h3>
          <p className="text-pink-600/80 text-xs font-medium">Instant access to your credit history</p>
        </div>

        <button
          onClick={handleGetReport}
          className="relative cursor-pointer bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden group"
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