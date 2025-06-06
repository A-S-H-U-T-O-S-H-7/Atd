import React from "react";
import { FaUserCheck, FaVideo, FaSignature } from "react-icons/fa";

const VerificationComponent = () => {
  return (
    <div className=" mx-auto mt-10">
      <div className="border-2 border-blue-300 p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-lg gap-4 sm:gap-6 lg:gap-4">
        {/* Video Verification */}
        <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
          <div className="rounded-full font-semibold border-2 border-blue-300 bg-blue-100 flex flex-col justify-center items-center text-center w-20 h-20 md:w-24 md:h-24 shadow-md">
            <FaUserCheck className="text-base md:text-2xl text-blue-600" />

            <p className="text-blue-800 text-xs md:text-sm font-semibold md:font-bold">
              Video Verification
            </p>
          </div>
          <button className='border-2 text-xs sm:text-sm md:text-base cursor-pointer border-blue-400 bg-blue-500 hover:bg-blue-600 text-white font-medium md:font-semibold rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto'>            Capture Video
          </button>
        </div>

        {/* E-Mandate */}
        <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
          <div className="rounded-full font-semibold border-2 border-green-300 bg-green-100 flex flex-col justify-center items-center text-center w-20 h-20 md:w-24 md:h-24 shadow-md">
            <FaVideo className="text-base md:text-2xl text-green-600" />
            <p className="text-green-800 text-xs md:text-sm font-bold">
              E-Mandate
            </p>
          </div>
          <button className='border-2 text-xs sm:text-sm md:text-base cursor-pointer border-green-400 bg-green-500 hover:bg-green-600 text-white font-medium md:font-semibold rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto'>            Subscribe
          </button>
        </div>

        {/* E-sign Agreement */}
        <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
          <div className="rounded-full font-semibold border-2 border-purple-300 bg-purple-100 flex flex-col justify-center items-center text-center w-20 h-20 md:w-24 md:h-24 shadow-md">
            <FaSignature className="text-base md:text-2xl text-purple-600" />
            <p className="text-purple-800 text-xs md:text-sm font-semibold md:font-bold">
              E-sign Agreement
            </p>
          </div>
          <button className="border-2 text-xs sm:text-sm md:text-base cursor-pointer border-purple-400 bg-purple-500 hover:bg-purple-600 text-white font-medium md:font-semibold rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
            {" "}E-sign Agreement
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationComponent;
