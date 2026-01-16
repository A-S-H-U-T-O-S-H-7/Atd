import React from 'react';
import { AlertCircle, Mic } from 'lucide-react';

const ContentCard = ({ userName = "your name" }) => {
  return (
    <div className="content-card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-1 md:p-5 mb-1 md:mb-4 mx-3 md:mx-4 mt-2">
      <div className="flex items-start gap-3">
        
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 pt-4 mb-2">
            Important Instructions
          </h3>
          <div className="space-y-2 text-xs md:text-base">
            <p className="text-gray-700">
              <span className="font-medium text-red-600">Note:</span> Please show your original PAN Card and Aadhaar Card at the time of video recording (front & back both) and read the below mentioned content:
            </p>
            <div className="bg-white p-1 md:p-2 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <Mic className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-gray-800 text-sm font-medium italic">
                  "I am <span className="text-blue-600 font-bold">{userName}</span> I have applied for a loan from ATD Money. I read and agreed with the terms and conditions. Requesting you to process further."
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;