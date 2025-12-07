import React from 'react';
import { ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const NavigationButtons = ({ 
  step, 
  setStep, 
  loader, 
  completedCount, 
  hasDuplicates, 
  hasUserPhoneMatches,
  hasRestrictedPhoneMatches,
  hasRestrictedEmailMatches,
  isSubmitting,
  values,
  isFormValid 
}) => {
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Progress Summary</h3>
          <div className="flex items-center gap-2">
            {isFormValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
            <span className={`font-medium ${isFormValid ? 'text-green-600' : 'text-amber-600'}`}>
              {completedCount}/5 References Complete
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / 5) * 100}%` }}
          ></div>
        </div>

        <div className="space-y-2">
          {completedCount < 5 && (
            <p className="text-amber-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Complete {5 - completedCount} remaining reference(s)
            </p>
          )}
          
          {hasDuplicates && (
            <p className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Resolve duplicate phone numbers or emails within references
            </p>
          )}
          
          {hasUserPhoneMatches && (
            <p className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Reference phones cannot match your phone numbers
            </p>
          )}
          
          {hasRestrictedPhoneMatches && (
            <p className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Reference phones cannot match existing phone numbers
            </p>
          )}
          
          {hasRestrictedEmailMatches && (
            <p className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Reference emails cannot match existing emails
            </p>
          )}
          
          {!values.consentToContact && completedCount === 5 && 
           !hasDuplicates && !hasUserPhoneMatches && 
           !hasRestrictedPhoneMatches && !hasRestrictedEmailMatches && (
            <p className="text-amber-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Provide consent to contact references
            </p>
          )}
          
          {isFormValid && (
            <p className="text-green-600 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Ready to submit
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={loader}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isFormValid && !isSubmitting
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </div>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>
    </div>
  );
};

export default NavigationButtons;