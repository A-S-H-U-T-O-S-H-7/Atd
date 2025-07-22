"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { XCircle } from "lucide-react";
import SalariedCheck from "./SalaryVerificationForm";
import BasicRegistrationForm from "./BasicRegistrationForm";
import BasicOtpVerification from "./BasicOtpVerification";
import { registrationAPI } from "@/lib/api";

export default function UserSignupPage() {
  const [phase, setPhase] = useState("salaried"); 
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");
  const [otpLoader, setOtpLoader] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const router = useRouter();

  const handleNext = (nextPhase, data = {}) => {
    setUserData(prev => ({ ...prev, ...data }));
    setPhase(nextPhase);
    setError(""); // Clear any previous errors
    
    // If moving to OTP phase, start countdown
    if (nextPhase === "otp") {
      setCountdown(60);
      setCanResend(false);
      setTimeout(() => setCanResend(true), 60000);
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  // Handle OTP verification
  const handleVerifyOTP = async (otpData) => {
    setOtpLoader(true);
    setError("");
    
    try {
      const response = await registrationAPI.verifyOTP(otpData);
      
      if (response.data.success) {
        localStorage.setItem('userId', response.data.userid);
        
        router.push('/basic-profile');
      } else {
        setError(response.data.message || "OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError("An error occurred during verification. Please try again.");
      }
    } finally {
      setOtpLoader(false);
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    setError("");
    
    try {
      const response = await registrationAPI.resendOTP({
        mobile: parseInt(userData.phoneNumber),
        provider: 1
      });
      
      if (response.data.success) {
        setCountdown(60);
        setCanResend(false);
        setTimeout(() => setCanResend(true), 60000);
        // Show success message briefly
        setError("OTP sent successfully!");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(response.data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    }
  };

  // Handle changing phone number (go back to form)
  const handleChangeNumber = () => {
    setPhase("form");
    setError("");
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
          <BasicOtpVerification
            phoneNumber={userData.phoneNumber}
            onVerifyOTP={handleVerifyOTP}
            onResendOTP={handleResendOTP}
            onChangeNumber={handleChangeNumber}
            onBack={() => setPhase("form")}
            loader={otpLoader}
            errorMessage={error}
            countdown={countdown}
            canResend={canResend}
            userData={{
              fname: userData.firstName,
              lname: userData.lastName,
              dob: userData.dob,
              mobile: parseInt(userData.phoneNumber),
              panno: userData.panNumber,
              aadharno: parseInt(userData.aadharNumber),
              companyname: userData.companyName,
              netsalary: parseInt(userData.netSalary),
              email: userData.email,
              provider: 1
            }}
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
      {/* Error Toast - Only show for actual errors, not success messages */}
      {error && !error.includes("successfully") && (
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

      {/* Success Toast */}
      {error && error.includes("successfully") && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 flex-shrink-0 text-green-500">✓</div>
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => setError("")}
              className="ml-2 text-green-500 hover:text-green-700"
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