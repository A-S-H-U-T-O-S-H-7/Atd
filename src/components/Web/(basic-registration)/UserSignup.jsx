"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { XCircle } from "lucide-react";
import SalariedCheck from "./SalaryVerificationForm";
import BasicRegistrationForm from "./BasicRegistrationForm";
import BasicOtpVerification from "./BasicOtpVerification";
import { useUser } from "@/lib/UserRegistrationContext"; 
import { useAuth } from "@/lib/AuthContext";


export default function UserSignupPage() {
  const [phase, setPhase] = useState("salaried"); 
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpLoader, setOtpLoader] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const router = useRouter();
  const { setToken, setUserId, setStep } = useUser();
  const { login } = useAuth();

  const handleNext = (nextPhase, data = {}) => {
    setUserData(prev => ({ ...prev, ...data }));
    setPhase(nextPhase);
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages
    
    // Don't start countdown here - wait for API success
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

// Handle OTP verification
const handleVerifyOTP = async (otpData) => {
  setOtpLoader(true);
  setError("");
  setSuccess("");
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/otp/verify`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(otpData)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      setToken(result.access_token);
      setUserId(result.user.id || result.user._id);
      setStep(result.user.step || 1);
      login(result.user, result.access_token);

      setSuccess("Registration completed successfully!");
      setTimeout(() => {router.push('/userProfile');}, 1500);
    } else {
      setError(result.message || "OTP verification failed. Please try again.");
      setOtpLoader(false);
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      setError("Network error. Please check your internet connection.");
    } else {
      setError("An error occurred during verification. Please try again.");
    }
    setOtpLoader(false);
  } 
};

  // Handle OTP resend
  const handleResendOTP = async () => {
  setError("");
  setSuccess("");
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/otp/resend`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobile: parseInt(userData.phoneNumber),
        provider: 1
      })
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      // Start countdown only after successful API call
      setCountdown(60);
      setCanResend(false);
      setTimeout(() => setCanResend(true), 60000);
      
      setSuccess("OTP sent successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to resend OTP. Please try again.");
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      setError("Network error. Please check your internet connection.");
    } else {
      setError("Failed to resend OTP. Please try again.");
    }
  }
};

  // Handle changing phone number (go back to form)
  const handleChangeNumber = () => {
    setPhase("form");
    setError("");
    setSuccess("");
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
        // Start countdown when entering OTP phase
        if (countdown === 0) {
          setCountdown(60);
          setCanResend(false);
          setTimeout(() => setCanResend(true), 60000);
        }
        
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

      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 flex-shrink-0 text-green-500">✓</div>
            <span className="text-sm">{success}</span>
            <button 
              onClick={() => setSuccess("")}
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