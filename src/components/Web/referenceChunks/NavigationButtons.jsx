import React from 'react';
import { BeatLoader } from 'react-spinners';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

const NavigationButtons = ({ 
  step, 
  setStep, 
  loader, 
  completedCount, 
  hasDuplicates,
  isSubmitting 
}) => {
  const isFormComplete = completedCount >= 5 && !hasDuplicates;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
      <button 
        type="button"
        onClick={() => setStep(step - 1)}
        disabled={isSubmitting}
        className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      
      <button 
        disabled={loader || !isFormComplete || isSubmitting} 
        type='submit' 
        className="inline-flex items-center cursor-pointer justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
      >
        {loader || isSubmitting ? (
          <BeatLoader color="#fff" size={8} />
        ) : (
          <>
            {isFormComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Complete Registration
              </>
            ) : (
              `Complete All References (${completedCount}/5)`
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default NavigationButtons;
