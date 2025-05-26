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
        // try {
        //     setLoader(true);
        //     setErrorMessage("");
            
        //     const response = await fetch(`${ENV.API_URL}/send-email-otp`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Accept": "application/json"
        //         },
        //         body: JSON.stringify({ email: values.email }),
        //     });

        //     const result = await response.json();

        //     if (response.ok) {
        //         setEmailData({ ...emailData, email: values.email });
        //         setOtpSent(true);
        //         setCountdown(60); // 60 seconds countdown
        //         setCanResend(false);
        //         setLoader(false);
        //     } else {
        //         setErrorMessage(result?.message || "Failed to send OTP");
        //         setLoader(false);
        //     }
        // } catch (error) {
        //     setErrorMessage("Error sending OTP: " + error.message);
        //     setLoader(false);
        // }
        setEmailData({ ...emailData, email: values.email });
        setOtpSent(true);
        setCountdown(60); 
        setCanResend(false);
        setLoader(false);
    };

    const handleVerifyOTP = async (values) => {
        // try {
        //     setLoader(true);
        //     setErrorMessage("");
            
        //     const response = await fetch(`${ENV.API_URL}/verify-email-otp`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Accept": "application/json"
        //         },
        //         body: JSON.stringify({
        //             email: emailData.email,
        //             otp: values.emailOtp
        //         }),
        //     });

        //     const result = await response.json();

        //     if (response.ok) {
        //         setEmailData({ 
        //             ...emailData, 
        //             isEmailVerified: true, 
        //             emailOtp: values.emailOtp 
        //         });
        //         setLoader(false);
        //         setStep(step + 1);
        //     } else {
        //         setErrorMessage(result?.message || "Invalid OTP");
        //         setLoader(false);
        //     }
        // } catch (error) {
        //     setErrorMessage("Error verifying OTP: " + error.message);
        //     setLoader(false);
        // }
        setStep(step + 1);
    };

    const handleResendOTP = async () => {
        if (!canResend) return;
        
        try {
            setLoader(true);
            setErrorMessage("");
            
            const response = await fetch(`${ENV.API_URL}/resend-email-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email: emailData.email }),
            });

            const result = await response.json();

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
            console.log('Google sign-in started...'); // Debug log
            setLoader(true);
            setErrorMessage("");
            
            // Create Google provider instance locally
            const googleProvider = new GoogleAuthProvider();
            googleProvider.setCustomParameters({
                prompt: 'select_account'
            });
            
            console.log('About to call signInWithPopup...'); // Debug log
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google sign-in result:', result); // Debug log
            
            const user = result.user;
            console.log('User data:', user); // Debug log
            
            // Store user data in context
            setEmailData({ 
                ...emailData, 
                email: user.email,
                isEmailVerified: true,
                googleUser: {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified
                }
            });
            
            setLoader(false);
            console.log('Moving to next step...'); // Debug log
            // Move to next step since Google auth is complete
            setStep(step + 1);
            
        } catch (error) {
            console.error('Google sign-in error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            setErrorMessage(error.message || "Failed to sign in with Google");
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