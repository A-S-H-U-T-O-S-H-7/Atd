"use client"
import EmailVerification from "@/components/Web/login/EmailVerification";
import OTPVerification from "@/components/Web/login/EmailOtpVerification";
import { useState } from "react";

function page() {
  const [currentStep, setCurrentStep] = useState('email'); 
  const [userEmail, setUserEmail] = useState('');

  const handleEmailSubmit = (email) => {
    setUserEmail(email);
    setCurrentStep('otp');
  };

  const handleOtpSubmit = (otp) => {
    console.log('OTP verified:', otp);
    alert('Email verified successfully!');
    setCurrentStep('email');
    setUserEmail('');
  };

  const handleResend = () => {
    console.log('Resending OTP to:', userEmail);
  };

  return (
    <div>
      {currentStep === 'email' ? (
        <EmailVerification onEmailSubmit={handleEmailSubmit} />
      ) : (
        <OTPVerification 
          email={userEmail}
          onSubmitOtp={handleOtpSubmit}
          onResend={handleResend}
        />
      )}
    </div>
  );
}

export default page;