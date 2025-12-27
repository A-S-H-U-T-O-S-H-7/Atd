'use client';

import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getCibilReportUrl } from '@/utils/userFileService';
import { FaCheckCircle, FaClock, FaDownload, FaSpinner } from 'react-icons/fa';
import { TbReport } from 'react-icons/tb';

export default function CreditScoreSection({ 
  creditScore = null, // Changed default to null
  imageWidth = 280, 
  imageHeight = 380,
  cibilScoreReport = null 
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Check if credit score is available
  const hasCreditScore = creditScore !== null && creditScore !== undefined;
  
  const handleGetReport = async () => {
    if (cibilScoreReport) {
      setIsDownloading(true);
      
      try {
        const downloadUrl = getCibilReportUrl(cibilScoreReport);
        window.open(downloadUrl, '_blank');
        toast.success('Opening CIBIL report...');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to open report');
      } finally {
        setIsDownloading(false);
      }
    } else {
      // Get button position for tooltip placement
      const button = document.getElementById('cibil-report-button');
      if (button) {
        const rect = button.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      }
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      toast.error('CIBIL report not available yet');
    }
  };

  return (
    <div className="relative rounded-2xl w-full bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 border border-rose-300 shadow-md px-1 md:px-6 py-2 flex flex-col items-center justify-between gap-1 overflow-hidden">    
      <div className="relative z-10 flex-shrink-0">
        <div className="relative">
          <Image 
            src="/creditscore.png" 
            alt="Credit Score" 
            width={imageWidth} 
            height={imageHeight} 
            className="rounded-xl" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-xl blur-lg -z-10 scale-110"></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-between items-center w-full gap-2">
        <div className="text-center">
          {/* Conditionally render title based on credit score availability */}
          {hasCreditScore ? (
            <>
              <h3 className="text-lg md:text-xl font-bold text-pink-700 mb-2 drop-shadow-sm">
                Your CIBIL Score
              </h3>
              
              <div className="mb-2">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-lg md:text-xl font-bold text-pink-600">
                    {creditScore}
                  </span>
                  <span className="text-sm text-pink-500 font-medium">
                    / 900
                  </span>
                </div>
              </div>
            </>
          ) : (
            <h3 className="text-lg md:text-xl font-bold text-pink-700 mb-4 drop-shadow-sm">
              Get Your CIBIL Score
            </h3>
          )}
          
          {/* Status message with React Icons */}
          <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold  ${
            cibilScoreReport 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 shadow-sm' 
              : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-700 shadow-sm'
          }`}>
            {cibilScoreReport 
              ? <><FaCheckCircle className="text-green-600" /> Your CIBIL report is ready to download</> 
              : <><FaClock className="text-amber-600" /> Report will be available after sanction</>
            }
          </div>
        </div>

        <div className="relative">
          <button
            id="cibil-report-button"
            onClick={handleGetReport}
            disabled={!cibilScoreReport || isDownloading}
            className={`relative font-semibold px-5 py-2.5 rounded-full shadow-lg transition-all duration-300 transform overflow-hidden group ${
              cibilScoreReport 
                ? 'cursor-pointer bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white hover:scale-105 hover:shadow-xl' 
                : 'cursor-not-allowed bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500'
            } ${isDownloading ? 'opacity-75 cursor-wait' : ''}`}
          >
            {cibilScoreReport && !isDownloading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            )}
            
            <span className="relative z-10 flex items-center gap-1">
              {isDownloading ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4" />
                  Opening...
                </>
              ) : cibilScoreReport ? (
                <>
                  <FaDownload className="h-4 w-4" />
                  Get Report Now
                </>
              ) : (
                <>
                  <TbReport className="h-4 w-4" />
                  Report Not Available
                </>
              )}
            </span>
          </button>

          {/* Fixed Tooltip */}
          {showTooltip && !cibilScoreReport && (
            <div 
              className="fixed bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50 animate-fadeIn"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y - 10}px`,
                transform: 'translateX(-50%) translateY(-100%)'
              }}
            >
              <div className="relative">
                <span>This will be enabled when your application is sanctioned</span>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status indicator dots with React Icons */}
      {cibilScoreReport ? (
        <div className="absolute top-2 right-2">
          <FaCheckCircle className="w-4 h-4 text-green-500 drop-shadow-sm" />
        </div>
      ) : (
        <div className="absolute top-2 right-2">
          <FaClock className="w-4 h-4 text-yellow-500 drop-shadow-sm" />
        </div>
      )}

      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-200/30 to-transparent rounded-br-2xl"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-yellow-200/30 to-transparent rounded-tl-2xl"></div>
    </div>
  );
}