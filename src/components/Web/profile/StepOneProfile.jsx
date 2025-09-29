'use client';

import { User, Phone, Mail, CreditCard, Building2, IndianRupee, Users, CheckCircle, Zap, Clock, FileText, Copy, Gift, Banknote } from 'lucide-react';
import Header from './Header';
import UserFooter from './UserFooter';
import CreditScoreSection from './CreditScore';

export default function StepOneProfile({ user, router, logout }) {
  const handleApplyForLoan = () => {
    router?.push('/loan-registration');
  };

  const handleClientHistory = () => router.push('/client-history');
  
  const handleLogout = async () => {
    await logout();
    router.push('/userlogin');
  };

  

  const userData = user ;

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
    <div>
        <Header  user={user} onLogout={handleLogout} onClientHistory={handleClientHistory} />
        
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
              Welcome, {userData?.fname || 'User'}!😊
            </h1>
<p className="text-slate-600 text-sm lg:text-lg font-medium mb-2">
    🎉 You've successfully signed up!
  </p>
  <p className="text-base lg:text-xl font-semibold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
    ✨ Complete your loan application to get instant funding! 💰
  </p>          </div>

          {/* Personal Loan Card - Responsive */}
          <div className="max-w-md lg:max-w-2xl mx-auto mb-8 lg:mb-12">
            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl lg:rounded-3xl p-5 lg:p-8 text-white shadow-xl shadow-orange-200 overflow-hidden">
              {/* Abstract elements */}
              <div className="absolute -top-4 -right-4 lg:-top-8 lg:-right-8 w-20 h-20 lg:w-32 lg:h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full"></div>
              <div className="absolute top-2 right-8 lg:top-4 lg:right-16 w-8 h-8 lg:w-12 lg:h-12 border border-white/20 rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div className="relative flex items-center gap-2 lg:gap-3">
                    {/* Decorative background for Personal Loan text */}
                    <div className="absolute -left-2 -top-1 bg-white/20 px-3 py-1 rounded-r-full transform -skew-x-12 w-40 lg:w-48"></div>
                    <Banknote className="w-5 h-5 lg:w-7 lg:h-7 relative z-10" />
                    <h3 className="text-lg lg:text-2xl font-bold relative z-10">Personal Loan</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 lg:px-3 lg:py-2 rounded-full text-xs lg:text-sm">
                    <Zap className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Instant</span>
                  </div>
                </div>
                
                <div className="mb-4 lg:mb-6">
                  <div className="text-sm lg:text-base opacity-90 mb-1 lg:mb-2 font-medium">You are eligible for</div>
                  <div className="text-3xl lg:text-5xl font-bold">₹50,000</div>
                  <div className="text-xs lg:text-sm opacity-80 mt-1">*subject to appraisal</div>
                </div>
                
                <div className="flex items-center justify-between text-xs lg:text-sm mb-4 lg:mb-8 opacity-90">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>No collateral</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>5-10 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Paperless</span>
                  </div>
                </div>
                
                
                <button
                  onClick={handleApplyForLoan}
                  className="w-full cursor-pointer bg-white text-orange-600 py-3 px-4 lg:py-4 lg:px-6 rounded-xl lg:rounded-2xl font-semibold lg:text-lg
                           hover:bg-gray-50 transform transition-all duration-300 
                           shadow-lg flex items-center justify-center gap-2 relative overflow-hidden
                           animate-pulse hover:animate-none
                           before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                           before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                >
                  
                  <span className="relative z-10 flex items-center gap-2">
                    Apply Now for Instant Loan
                    <Zap className="w-4 h-4 lg:w-5 lg:h-5 animate-bounce" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          
          {/* Profile Cards Grid - Responsive */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-6 lg:mb-10">
            
            {/* Personal Info */}
            <div className="bg-white/70  backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-md border border-dashed border-cyan-400 p-4 lg:p-6">
              <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                <h3 className="font-semibold lg:text-lg text-slate-800">Personal Details</h3>
              </div>
              
              <div className="space-y-2 lg:space-y-3  text-sm lg:text-base">
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
            <div className="bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl border-dashed border-emerald-400 shadow-md border  p-4 lg:p-6">
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
                    Salary
                  </span>
                  <span className="font-medium">{userData?.netsalary ? formatCurrency(userData.netsalary) : 'N/A'}</span>
                </div>
              </div>
            </div>

            <CreditScoreSection/>
          </div>

<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Referral Program - Enhanced Design */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg relative overflow-hidden md:col-span-2 order-2 md:order-1 lg:col-span-1">
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

          {/* Company Info - Single Row */}
          <div className="bg-gradient-to-br from-cyan-200 to-violet-200 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-md border border-dashed border-violet-500 p-4 lg:p-6  order-1 md:order-2 ">
            <div className="flex flex-col items-center justify-between">
                <div className="text-4xl mb-4">💼</div>

              <div className="flex justify-center items-center gap-2 lg:gap-3">
                <span className="font-semibold mb-4 lg:text-lg text-slate-800"> Company Name</span>
              </div>
              <span className="text-sm lg:text-lg font-medium text-slate-700">{userData?.company || 'N/A'}</span>
            </div>
          </div>

          </div>

         
        </div>
      </div>
    </div>
    <UserFooter />
    </div>
  );
}