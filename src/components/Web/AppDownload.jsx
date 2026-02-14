import Image from "next/image";
import React from "react";

function AppDownload() {
  return (
    <div className="relative flex flex-col md:flex-row justify-evenly items-center py-6 md:py-10 px-4 md:px-10 bg-[#F4FAFF] overflow-hidden">
      {/* Enhanced Decorative Bubble Elements */}
      {/* Large gradient bubble in top right */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-bl from-purple-400 via-blue-300 to-pink-200  transform translate-x-20 -translate-y-20"></div>
      
      {/* Medium bubble in bottom left */}
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-gradient-to-tr from-pink-300 via-orange-200 to-yellow-100  transform -translate-x-20 translate-y-10"></div>
      
      {/* Small floating bubbles */}
      <div className="absolute top-1/4 left-10 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-200 to-blue-300 md:z-30  animate-pulse"></div>
      <div className="absolute bottom-5 right-1/3 w-20 h-20 rounded-full bg-gradient-to-r from-purple-200 to-pink-300 md:z-30 animate-pulse"></div>
      <div className="absolute top-2/3 right-1/4 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-200 to-orange-300  animate-pulse"></div>
      
      {/* Glass effect bubble */}
      <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white  transform -translate-x-1/2 -translate-y-1/2"></div>
      
      <section className="mb-6 md:mb-0 relative z-10">
        <Image
          src="/ads.png"
          alt="Person with financial icons"
          width={400}
          height={400}
          className="object-contain"
          priority
        />
      </section>
      
      <section className="flex flex-col gap-8 md:gap-10 relative z-10">
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Finance, Unlocked. Freedom in Your Pocket
          </h2>
          <p className="text-base text-gray-700 md:text-lg">
            Download the ATD Money App and access instant cash—anytime, anywhere
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
          <Image
            src="/qr.svg"
            alt="QR code to download app"
            width={240}
            height={240}
            className="object-contain bg-[#e1effa] rounded-md hidden md:block"
            priority
          />
          
          <div className="flex flex-col items-center w-full md:w-auto gap-4 md:gap-8 justify-center">
            {/* <div className="flex items-center justify-center w-full md:w-auto border rounded-md text-white hover:text-black font-semibold hover:bg-white cursor-pointer bg-black px-4 py-3 gap-4">
              <Image
                src="/apple.png"
                alt="App Store"
                width={30}
                height={30}
                className="object-contain"
                priority
              />
              <span>Download on App Store</span>
            </div> */}
            
            <div className="flex items-center justify-center w-full md:w-auto border rounded-md text-white hover:text-black font-semibold hover:bg-white cursor-pointer bg-black px-4 py-3 gap-4">
              <Image
                src="/playstore.png"
                alt="Play Store"
                width={30}
                height={30}
                className="object-contain"
                priority
              />
              <span>Download on Play Store</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AppDownload;