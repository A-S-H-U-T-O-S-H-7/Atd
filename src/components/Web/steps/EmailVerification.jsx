"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/UserRegistrationContext';
import EmailInput from './EmailInput';
import OTPInput from './OTPInput';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';



function EmailVerification() {
    const {
        emailData,
        setEmailData,
        phoneData,
        step,
        setStep,
        loader,
        setLoader,
        errorMessage,
        setErrorMessage
    } = useUser();

    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);

    // Countdown timer for resend OTP
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0 && otpSent) {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [countdown, otpSent]);

    const handleSendOTP = async (values) => {
        try {
            setLoader(true);
            setErrorMessage("");
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    step: 2,
                    provider: 1,
                    userid: phoneData.userid,
                    email: values.email,
                    verification_type: "manual",
                    need: "send"
                }),
            });
    
            const result = await response.json();
            console.log(result)
    
            if (response.ok) {
                setEmailData({ ...emailData, email: values.email });
                setOtpSent(true);
                setCountdown(60); 
                setCanResend(false);
                setLoader(false);
            } else {
                setErrorMessage(result?.message || "Failed to send OTP");
                setLoader(false);
            }
        } catch (error) {
            setErrorMessage("Error sending OTP: " + error.message);
            setLoader(false);
        }
       
    };

    const handleVerifyOTP = async (values) => {
        try {
            setLoader(true);
            setErrorMessage("");
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
                 method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: emailData.email,
                    otp: values.emailOtp,
                    step:2,
                     provider:1,
                     userid:phoneData.userid,
                     verification_type:"manual",
                     need:"verify",
                }),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok) {
                setEmailData({ 
                    ...emailData, 
                    isEmailVerified: true, 
                    emailOtp: values.emailOtp 
                });
                setLoader(false);
                setStep(step + 1);
            } else {
                setErrorMessage(result?.message || "Invalid OTP");
                setLoader(false);
            }
        } catch (error) {
            setErrorMessage("Error verifying OTP: " + error.message);
            setLoader(false);
        }
        
    };

    const handleResendOTP = async () => {
        if (!canResend) return;
        
        try {
            setLoader(true);
            setErrorMessage("");
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email: emailData.email,
                    provider:1,
                    userid:phoneData.userid,
                    step:2,
                    verification_type:"manual",
                     need:"send"

                 }),
            });

            const result = await response.json();
            console.log(result)


            if (response.ok) {
                setCountdown(60);
                setCanResend(false);
                setLoader(false);
            } else {
                setErrorMessage(result?.message || "Failed to resend OTP");
                setLoader(false);
            }
        } catch (error) {
            setErrorMessage("Error resending OTP: " + error.message);
            setLoader(false);
        }
    };

    const handleGoogleVerify = async () => {
        try {
            setLoader(true);
            setErrorMessage("");
            
            const googleProvider = new GoogleAuthProvider();
            googleProvider.addScope('email');
            googleProvider.addScope('profile');
            googleProvider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            if (!user) {
                throw new Error('No user data received from Google');
            }
            
            const userEmail = user.email || (user.providerData && user.providerData[0]?.email);
            
            if (!userEmail) {
                throw new Error('No email found in Google account');
            }
            
            if (!phoneData || !phoneData.userid) {
                throw new Error('Phone data or userid is missing');
            }
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    step: 2,
                    provider: 1,
                    userid: phoneData.userid,
                    email: userEmail,
                    verification_type: "direct"
                })
            });
            
            const apiData = await response.json();
            console.log(apiData)

            
            if (response.ok && apiData.success === true) {
                const updatedEmailData = { 
                    ...emailData, 
                    email: userEmail,
                    isEmailVerified: user.emailVerified || true, 
                    googleUid: user.uid 
                };
                
                setEmailData(updatedEmailData);
                setLoader(false);
                setStep(step + 1);
            } else {
                throw new Error(apiData.message || 'Failed to store email in database');
            }
            
        } catch (error) {
            let userMessage = '';
            
            if (error.code) {
                // Firebase Auth errors
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        userMessage = 'Sign-in was cancelled. Please try again.';
                        break;
                    case 'auth/popup-blocked':
                        userMessage = 'Popup was blocked. Please allow popups and try again.';
                        break;
                    case 'auth/network-request-failed':
                        userMessage = 'Network error. Please check your connection and try again.';
                        break;
                    default:
                        userMessage = `Authentication failed: ${error.message}`;
                }
            } else {
                userMessage = `Failed to complete registration: ${error.message}`;
            }
            
            setErrorMessage(userMessage);
            setLoader(false);
        }
    };


    

    const handleChangeEmail = () => {
        setOtpSent(false);
        setErrorMessage("");
        setCountdown(0);
        setCanResend(true);
    };

    
    return (
        <div className="bg-gradient-to-r from-[#cef8f8] to-[#e1fefe] min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                {!otpSent ? (
                    <EmailInput
                        emailData={emailData}
                        onSendOTP={handleSendOTP}
                        onGoogleVerify={handleGoogleVerify}
                         loader={loader}
                        errorMessage={errorMessage}
                    />
                ) : (
                    <OTPInput
                        email={emailData.email}
                        onVerifyOTP={handleVerifyOTP}
                        onResendOTP={handleResendOTP}
                        onChangeEmail={handleChangeEmail}
                        loader={loader}
                        errorMessage={errorMessage}
                        countdown={countdown}
                        canResend={canResend}
                    />
                )}
            </div>
        </div>
    );
}

export default EmailVerification;