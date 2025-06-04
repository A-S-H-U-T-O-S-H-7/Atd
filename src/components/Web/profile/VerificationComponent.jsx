    import React from 'react';
    import { FaUserCheck, FaVideo, FaSignature } from 'react-icons/fa';

    const VerificationComponent = () => {
    return (
        <div className=" mx-auto mt-10">
        <div className='border-2 border-blue-300 p-4 flex flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-lg gap-8 lg:gap-4'>
            
            {/* Video Verification */}
            <div className='flex flex-col items-center gap-4 flex-1'>
            <div className='rounded-full gap-4 font-semibold border-2 border-blue-300 bg-blue-100 flex flex-col justify-center items-center text-center px-4 w-23 h-23 md:w-30 md:h-30 shadow-md '>
                <FaUserCheck className="text-base md:text-2xl text-blue-600" />
                <p className="text-blue-800 text-xs md:text-sm font-semibold md:font-bold">Video Verification</p>
            </div>
            <button className='border-2 text-sm md:text-base cursor-pointer border-blue-400 bg-blue-500 hover:bg-blue-600 text-white font-medium md:font-semibold rounded-lg px-2 py-1 md:px-4 md:py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 '>
                Capture Video
            </button>
            </div>

            {/* E-Mandate */}
            <div className='flex flex-col items-center gap-4 flex-1'>
            <div className='rounded-full gap-4 font-semibold border-2 border-green-300 bg-green-100 flex flex-col justify-center items-center text-center px-4 w-23 h-23 md:w-30 md:h-30 shadow-md'>
                <FaVideo className="text-base md:text-2xl text-green-600" />
                <p className="text-green-800 text-xs md:text-sm font-bold">E-Mandate</p>
            </div>
            <button className='border-2 text-sm md:text-base cursor-pointer border-green-400 bg-green-500 hover:bg-green-600 text-white font-medium md:font-semibold rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 '>
                Subscribe
            </button>
            </div>

            {/* E-sign Agreement */}
            <div className='flex flex-col items-center gap-3 flex-1'>
            <div className='rounded-full gap-4 font-semibold border-2 border-purple-300 bg-purple-100 flex flex-col justify-center items-center text-center p-4 w-23 h-23 md:w-30 md:h-30 shadow-md '>
                <FaSignature className="text-base md:text-2xl text-purple-600" />
                <p className="text-purple-800 text-xs md:text-sm font-semibold md:font-bold">E-sign Agreement</p>
            </div>
            <button className='border-2 text-sm md:text-base cursor-pointer border-purple-400 bg-purple-500 hover:bg-purple-600 text-white font-medium md:font-semibold rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 '>
                E-sign Agreement
            </button>
            </div>

        </div>
        </div>
    );
    };

    export default VerificationComponent;