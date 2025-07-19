"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { XCircle } from "lucide-react";
import SalariedCheck from "./SalaryVerificationForm";
import BasicRegistrationForm from "./BasicRegistrationForm";
import DualOtpVerification from "./BasicOtpVerification";

export default function UserSignupPage() {
  const [phase, setPhase] = useState("salaried"); 
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNext = (nextPhase, data = {}) => {
    setUserData(prev => ({ ...prev, ...data }));
    setPhase(nextPhase);
    setError(""); // Clear any previous errors
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const renderCurrentPhase = () => {
    switch (phase) {
      case "salaried":
        return (
          <SalariedCheck 
            onNext={handleNext} 
            onError={handleError} 
          />
        );
      case "form":
        return (
          <BasicRegistrationForm 
            onNext={handleNext} 
            onError={handleError} 
            userData={userData}
            onBack={() => setPhase("salaried")}
          />
        );
      case "otp":
        return (
          <DualOtpVerification
  email="user@example.com"
  phoneNumber="9876543210"
  onVerifyBothOTP={(values) => {
    // Handle verification - values contains both emailOtp and phoneOtp
    console.log('Email OTP:', values.emailOtp);
    console.log('Phone OTP:', values.phoneOtp);
    // Redirect to basic-profile page
    router.push('/basic-profile');
  }}
  onResendEmailOTP={() => {
    // Handle email OTP resend
  }}
  onResendPhoneOTP={() => {
    // Handle phone OTP resend
  }}
  onChangeEmail={() => {
    // Handle email change
  }}
  onChangePhone={() => {
    // Handle phone change
  }}
  onBack={() => {
    // Handle back navigation
  }}
  loader={false}
  errorMessage=""
  emailCountdown={60}
  phoneCountdown={45}
  canResendEmail={true}
  canResendPhone={true}
/>
        );
      default:
        return (
          <SalariedCheck 
            onNext={handleNext} 
            onError={handleError} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => setError("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      

      {/* Main Content */}
      <div>
        {renderCurrentPhase()}
      </div>
    </div>
  );
}