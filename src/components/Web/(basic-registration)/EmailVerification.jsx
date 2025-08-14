import React from "react";
import { AlertCircle, Check } from "lucide-react";
import Image from "next/image";
import { BeatLoader } from "react-spinners";

export const EmailVerification = ({ 
  isEmailVerified, 
  verifiedEmail, 
  googleLoading, 
  handleGoogleVerify 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Verification <span className="text-red-500">*</span>
      </label>
      
      {!isEmailVerified ? (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-red-600 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-orange-800 text-sm">Email Not Verified</p>
              <p className="text-xs text-orange-700">Click to verify your email with Google</p>
            </div>
            <button
              type="button"
              onClick={handleGoogleVerify}
              disabled={googleLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-lg hover:border-orange-400 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {googleLoading ? (
                <BeatLoader color="#EA580C" size={4} />
              ) : (
                <>
                  <Image src="/google-logo.png" alt='google' width={16} height={16} className='w-4 h-4'/>
                  <span className="font-medium text-gray-800">Verify</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-emerald-800 text-sm">Email Verified</p>
              <p className="text-xs text-emerald-700 truncate">{verifiedEmail}</p>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium whitespace-nowrap">
              ✓ Verified
            </span>
          </div>
        </div>
      )}
    </div>
  );
};