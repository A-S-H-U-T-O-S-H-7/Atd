// components/Web/profile/steps/StepInProgressProfile.jsx
'use client';

import { User, Phone, Mail, CreditCard, Building2, IndianRupee, Users, CheckCircle, Zap, Clock, FileText, Copy, Gift, TrendingUp, Target, Award, UserCheck, Briefcase, FileCheck, Landmark, Upload, UserPlus, Shield } from 'lucide-react';
import Header from './Header';
import ProtectedRoute from './ProtectRoute';
import UserFooter from './UserFooter';

export default function StepInProgressProfile({ user, router, userStep, logout }) {
  const totalSteps = 5;
  const progress = Math.round(((userStep-1) / totalSteps) * 100);
  
  const handleClientHistory = () => router.push('/client-history');
  
  const handleLogout = async () => {
    await logout();
    router.push('/userlogin');
  };

  const handleContinueRegistration = () => {
    router.push('/loan-registration');
  };

  // Step descriptions and icons for better UX
  const getStepInfo = (step) => {
    const stepInfo = {
      1: { title: "Personal Details", icon: UserCheck, color: "text-blue-600", bgColor: "bg-blue-100" },
      2: { title: "Bank & Loan Details", icon: CreditCard, color: "text-green-600", bgColor: "bg-green-100" },
      3: { title: "Organization Details", icon: Briefcase, color: "text-purple-600", bgColor: "bg-purple-100" },
      4: { title: "Document Upload", icon: Upload, color: "text-orange-600", bgColor: "bg-orange-100" },
      5: { title: "Reference Details", icon: UserPlus, color: "text-teal-600", bgColor: "bg-teal-100" },

    };
    return stepInfo[step] || { title: "Processing...", icon: Clock, color: "text-gray-600", bgColor: "bg-gray-100" };
  };

  const getStepMessage = (step) => {
    if (step <= 2) return "You're making great progress!";
    if (step <= 4) return "Almost halfway there!";
    return "You're almost done!";
  };

  // Mock user data for demonstration - replace with actual API data
  const mockUser = {
    phone: 9569584126,
    crnno: "S01AM126",
    accountId: "ATDFSLS01AM126JULY2025",
    fname: "Satyendra",
    lname: "Sharma",
    dob: "1988-08-01",
    phone_verified: true,
    email: "satyendra.alltimedata@gmail.com",
    email_verified: true,
    pan_no: "AMLPV5184B",
    aadhar_no: 689568965896,
    company: "ATD Financial Services Private Limited",
    netsalary: 55000,
    referral_code: "HLT9BT3G"
  };

  const userData = user || mockUser;

  const VerifiedBadge = () => (
    <CheckCircle className="w-4 h-4 text-emerald-500 ml-1" />
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <ProtectedRoute>
      <div>
        <Header 
          user={user} 
          onLogout={handleLogout} 
          onClientHistory={handleClientHistory} 
        />
        
        <div className="min-h-screen mt-15 md:mt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
          {/* Abstract Background Shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating geometric shapes */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rotate-45"></div>
            <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-pink-200/25 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-indigo-200/20 rotate-12"></div>
            <div className="absolute bottom-20 right-10 w-28 h-28 bg-cyan-200/25 rounded-full"></div>
            
            {/* Curved lines */}
            <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,100 Q150,50 300,100 T600,100" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="2" fill="none"/>
              <path d="M100,200 Q250,150 400,200 T700,200" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          <div className="relative pt-8 px-4 lg:px-20 pb-8">
            <div className="w-full mx-auto">
              
              {/* Welcome Section - Responsive */}
              <div className="text-center mb-6 lg:mb-10">
                <h1 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-1 lg:mb-2">
                  Welcome back, {userData?.fname || 'User'}! 🚀
                </h1>
                <p className="text-slate-600 text-sm lg:text-lg">Let's complete your loan application</p>
              </div>

              {/* Progress Section - Two Column Layout */}
              <div className="max-w-8xl mx-auto mb-8 lg:mb-12">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                  
                  {/* Progress Card - Left Column */}
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl lg:rounded-3xl p-5 lg:p-8 text-white shadow-xl shadow-blue-200 overflow-hidden">
                    {/* Abstract elements */}
                    <div className="absolute -top-4 -right-4 lg:-top-8 lg:-right-8 w-20 h-20 lg:w-32 lg:h-32 bg-white/10 rounded-full"></div>
                    <div className="absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute top-2 right-8 lg:top-4 lg:right-16 w-8 h-8 lg:w-12 lg:h-12 border border-white/20 rounded-full"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4 lg:mb-6">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <Target className="w-5 h-5 lg:w-7 lg:h-7" />
                          <h3 className="text-lg lg:text-2xl font-bold">Application Progress</h3>
                        </div>
                        <div className="flex items-center gap-1 bg-white/20 px-2 py-1 lg:px-3 lg:py-2 rounded-full text-xs lg:text-sm">
                          <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span>{progress}%</span>
                        </div>
                      </div>
                      
                      <div className="mb-4 lg:mb-6">
                        <div className="text-xs lg:text-sm opacity-90 mb-1 lg:mb-2">Step {userStep-1}: {getStepInfo(userStep-1).title}</div>                        
                        <div className="text-2xl lg:text-4xl font-bold">{getStepMessage(userStep)}</div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4 lg:mb-6">
                        <div className="w-full bg-white/20 rounded-full h-2 lg:h-3 mb-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 lg:h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs lg:text-sm opacity-90">
                          <span>Step {userStep-1} of {totalSteps}</span>
                          <span>{totalSteps - (userStep-1)} steps remaining</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs lg:text-sm mb-4 lg:mb-8 opacity-90">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span>Secure process</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span>3-7 min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span>Almost there</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleContinueRegistration}
                        className="w-full cursor-pointer bg-white text-blue-600 py-3 px-4 lg:py-4 lg:px-6 rounded-xl lg:rounded-2xl font-semibold lg:text-lg
                                 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 
                                 shadow-lg flex items-center justify-center gap-2"
                      >
                        Continue Loan Application
                        <Zap className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Step Status Tracker - Right Column */}
<div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-5 lg:p-6 shadow-lg border border-white/50">
  <div className="flex items-center gap-3 mb-4 lg:mb-6">
    <FileCheck className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
    <h3 className="text-lg lg:text-xl font-bold text-slate-800">Application Steps</h3>
  </div>
  
  {/* Compact Step Grid */}
  <div className="grid grid-cols-2 gap-3 mb-4">
    {Array.from({ length: totalSteps }, (_, index) => {
      const stepNumber = index + 1;
      const stepInfo = getStepInfo(stepNumber);
      const isCompleted = stepNumber < userStep;
      const isCurrent = stepNumber === userStep;
      
      // Shorter step names for compact display
      const shortNames = {
       
        1: "Personal Details", 
        2: "Bank & Loan Details",
        3: "Organization Details",
        4: "Document Upload",
        5: "References",
      };
      
      return (
        <div
          key={stepNumber}
          className={`relative flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
            isCompleted 
              ? 'bg-green-50 border border-green-200' 
              : isCurrent 
                ? 'bg-blue-50 border-2 border-blue-300 shadow-md' 
                : 'bg-gray-50 border border-gray-200'
          }`}
        >
          {/* Step Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isCompleted 
              ? 'bg-green-500 text-white' 
              : isCurrent 
                ? `${stepInfo.bgColor} ${stepInfo.color}` 
                : 'bg-gray-300 text-gray-600'
          }`}>
            {isCompleted ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <stepInfo.icon className="w-4 h-4" />
            )}
          </div>
          
          {/* Step Name */}
          <div className="flex-grow min-w-0">
            <h4 className={`font-semibold text-sm truncate ${
              isCompleted 
                ? 'text-green-700' 
                : isCurrent 
                  ? 'text-blue-700' 
                  : 'text-gray-600'
            }`}>
              {shortNames[stepNumber]}
            </h4>
          </div>
          
          {/* Current Step Badge */}
          {isCurrent && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </div>
      );
    })}
  </div>
  
  {/* Progress Summary */}
  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircle className="w-4 h-4" />
      <span className="font-medium text-sm">{userStep - 1} Done</span>
    </div>
    <div className="flex items-center gap-2 text-blue-600">
      <Target className="w-4 h-4" />
      <span className="font-medium text-sm">{totalSteps - userStep + 1} Left</span>
    </div>
  </div>
</div>
                </div>
              </div>

              {/* Profile Cards Grid - Responsive */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-6 lg:mb-10">
                
                {/* Personal Info */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-md border border-dashed border-cyan-400 p-4 lg:p-6">
                  <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                    <h3 className="font-semibold lg:text-lg text-slate-800">Personal Details</h3>
                  </div>
                  
                  <div className="space-y-2 lg:space-y-3 text-sm lg:text-base">
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-blue-100/50 rounded-lg">
                      <span className="text-slate-600">Name</span>
                      <span className="font-medium">{userData?.fname || 'N/A'} {userData?.lname || ''}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-green-100/50 rounded-lg">
                      <span className="text-slate-600">DOB</span>
                      <span className="font-medium">{userData?.dob ? formatDate(userData.dob) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-purple-100/50 rounded-lg">
                      <span className="text-slate-600 flex items-center">
                        Phone
                      </span>
                      <div className="flex items-center font-medium">
                        +91 {userData?.phone || 'N/A'}
                        {userData?.phone_verified && <VerifiedBadge />}
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-cyan-100/50 rounded-lg">
                      <span className="text-slate-600 flex items-center">
                        Email
                      </span>
                      <div className="flex items-center font-medium text-xs lg:text-sm">
                        {userData?.email?.split('@')[0] || 'N/A'}@...
                        {userData?.email_verified && <VerifiedBadge />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account & Documents */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl border-dashed border-emerald-400 shadow-md border p-4 lg:p-6">
                  <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                    <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
                    <h3 className="font-semibold lg:text-lg text-slate-800">Account & Documents</h3>
                  </div>
                  
                  <div className="space-y-2 lg:space-y-3 text-sm lg:text-base">
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-indigo-100/50 rounded-lg">
                      <span className="text-slate-600">CRN</span>
                      <span className="font-medium font-mono">{userData?.crnno || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-yellow-100/50 rounded-lg">
                      <span className="text-slate-600 flex items-center">
                        PAN No.
                      </span>
                      <span className="font-medium font-mono">{userData?.pan_no || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-red-100/50 rounded-lg">
                      <span className="text-slate-600">Aadhar No.</span>
                      <span className="font-medium font-mono">{userData?.aadhar_no || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-emerald-100/50 rounded-lg">
                      <span className="text-slate-600 flex items-center">
                        Net Salary
                      </span>
                      <span className="font-medium">{userData?.net_monthly_salary ? formatCurrency(userData.net_monthly_salary) : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Referral Program - Enhanced Design */}
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg relative overflow-hidden md:col-span-2 lg:col-span-1">
                  {/* Abstract background */}
                  <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-16 h-16 lg:w-20 lg:h-20 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 lg:-bottom-2 lg:-left-2 w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-full"></div>
                  <div className="absolute top-1/2 right-1/4 w-6 h-6 lg:w-8 lg:h-8 bg-white/10 rotate-45"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <Gift className="w-5 h-5 lg:w-6 lg:h-6" />
                        <h3 className="font-bold lg:text-lg">Referral Program</h3>
                      </div>
                      <div className="text-xs lg:text-sm bg-yellow-400/30 px-2 py-1 rounded-full">
                        Earn ₹100
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                      <div>
                        <div className="text-xs lg:text-sm opacity-90 mb-1">Your referral code</div>
                        <div className="text-xl lg:text-2xl font-bold tracking-widest">
                          {userData?.referral_code || 'N/A'}
                        </div>
                      </div>
                      <button className="bg-white/20 hover:bg-white/30 transition-colors p-2 lg:p-3 rounded-lg">
                        <Copy className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                    
                    <div className="text-xs lg:text-sm opacity-90">
                      Share with friends and earn rewards instantly
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info - Single Row */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-md border border-white/50 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-teal-600" />
                    <span className="font-semibold lg:text-lg text-slate-800">Company</span>
                  </div>
                  <span className="text-sm lg:text-base font-medium text-slate-700">{userData?.organisation_name || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <UserFooter />
      </div>
    </ProtectedRoute>
  );
}