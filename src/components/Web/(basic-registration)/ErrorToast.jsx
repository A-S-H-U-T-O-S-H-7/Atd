import React from "react";
import { AlertCircle, X, LogIn } from "lucide-react";
import { useRouter } from 'next/navigation';

export const ErrorToast = ({ error, setError, isExistingUserError, formatErrorMessage }) => {
  const router = useRouter();
  
  if (!error || error.includes("successfully")) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white/95 backdrop-blur-lg border border-red-100 rounded-2xl shadow-2xl shadow-red-500/20 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800">Signup Issue</h4>
            </div>
            <button 
              onClick={() => setError("")}
              className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
            >
              <X className="w-3 h-3 text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {formatErrorMessage(error)}
          </p>
          
          {isExistingUserError(error) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Already have an account?</span>
                <button
                  type="button"
                  onClick={() => router.push('/userlogin')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-xs font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105"
                >
                  <LogIn className="w-3 h-3" />
                  Login Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};