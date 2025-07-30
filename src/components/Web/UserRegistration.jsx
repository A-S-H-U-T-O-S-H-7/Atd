"use client";
import DocumentUpload from "@/components/Web/steps/DocumnetUpload";
import PersonalDetails from "@/components/Web/steps/PersonalDetails";
import References from "@/components/Web/steps/References";
import ServiceDetails from "@/components/Web/steps/ServiceDetails";
import BankLoanDetails from "./steps/BankLoanDetails";
import { useUser } from "@/lib/UserRegistrationContext";

// Import icons
import { 
  Gift, 
  User, 
  IndianRupee,
  Briefcase, 
  CreditCard, 
  FileText, 
  Users,
  Check,
  ChevronRight
} from "lucide-react";

const UserRegistration = () => {
    const { step } = useUser();

  // Updated step configuration with new order and icons
  const steps = [
  { id: 1, title: "Personal", icon: User },
  { id: 2, title: "Bank & Loan", icon: CreditCard }, 
  { id: 3, title: "Employment", icon: Briefcase },
  { id: 4, title: "Documents", icon: FileText },
  { id: 5, title: "References", icon: Users },
];

  if (step === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-slate-400 absolute top-0"></div>
        </div>
      </div>
    );
  }

  const currentStepInfo = steps.find(s => s.id === step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/40">
      {/* Modern Progress  Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          
          {/* Desktop Progress - Compact and Professional */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1 bg-gradient-to-r from-slate-50 to-blue-50/60 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-slate-200/60">
                {steps.map((stepItem, index) => {
                  const Icon = stepItem.icon;
                  const isActive = step === stepItem.id;
                  const isCompleted = step > stepItem.id;
                  const isLast = index === steps.length - 1;

                  return (
                    <div key={stepItem.id} className="flex items-center">
                      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-white/60">
                        <div
                          className={`
                            w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-sm
                            ${isCompleted 
                              ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white' 
                              : isActive 
                                ? 'bg-gradient-to-br from-slate-600 to-slate-700 text-white' 
                                : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 border border-gray-300/50'
                            }
                          `}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        
                        <span
                          className={`
                            text-xs font-medium transition-all duration-300
                            ${isCompleted 
                              ? 'text-emerald-700' 
                              : isActive 
                                ? 'text-slate-700 font-semibold' 
                                : 'text-gray-500'
                            }
                          `}
                        >
                          {stepItem.title}
                        </span>
                      </div>

                      {!isLast && (
                        <div className="mx-2">
                          <div 
                            className={`
                              w-6 h-0.5 transition-all duration-500 rounded-full
                              ${step > stepItem.id 
                                ? 'bg-gradient-to-r from-emerald-300 to-teal-400' 
                                : 'bg-gray-300'
                              }
                            `} 
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tablet Progress - Moderate Height */}
          <div className="hidden md:block lg:hidden">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm rounded-xl p-3 shadow-md border border-blue-200/40">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    {currentStepInfo && <currentStepInfo.icon className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-800">{currentStepInfo?.title}</h3>
                    <p className="text-xs text-gray-600">Step {step} of {steps.length}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round((step / steps.length) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Complete</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{ width: `${(step / steps.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Progress - Compact and Clean */}
          <div className="md:hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm rounded-lg p-3 shadow-md border border-blue-200/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    {currentStepInfo && <currentStepInfo.icon className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">{currentStepInfo?.title}</h3>
                    <p className="text-xs text-gray-600">Step {step} of {steps.length}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    {Math.round((step / steps.length) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{ width: `${(step / steps.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  {steps.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index < step ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div>
        <div>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/40 overflow-hidden">
            <div>
              {step === 1 && <PersonalDetails />}
              {step === 2 && <BankLoanDetails />}
              {step === 3 && <ServiceDetails />}
              {step === 4 && <DocumentUpload />}
              {step === 5 && <References />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;