"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/UserRegistrationContext';
import AadharInput from './AadharInput';
import AadharOTPInput from './AadharOtpInput';

function AadharVerification() {
    const {
        aadharData,
        setAadharData,
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
            
        //     const response = await fetch(`${ENV.API_URL}/send-aadhar-otp`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Accept": "application/json"
        //         },
        //         body: JSON.stringify({ aadharNumber: values.aadharNumber }),
        //     });

        //     const result = await response.json();

        //     if (response.ok) {
        //         setAadharData({ ...aadharData, aadharNumber: values.aadharNumber });
        //         setOtpSent(true);
        //         setCountdown(60); 
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
        setAadharData({ ...aadharData, aadharNumber: values.aadharNumber });
                setOtpSent(true);
                setCountdown(60); 
                setCanResend(false);
                setLoader(false);
    };

    const handleVerifyOTP = async (values) => {
        // try {
        //     setLoader(true);
        //     setErrorMessage("");
            
        //     const response = await fetch(`${ENV.API_URL}/verify-aadhar-otp`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Accept": "application/json"
        //         },
        //         body: JSON.stringify({
        //             aadharNumber: aadharData.aadharNumber,
        //             otp: values.aadharOtp
        //         }),
        //     });

        //     const result = await response.json();

        //     if (response.ok) {
        //         setAadharData({ 
        //             ...aadharData, 
        //             isAadharVerified: true, 
        //             aadharOtp: values.aadharOtp 
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
            
            const response = await fetch(`${ENV.API_URL}/resend-aadhar-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ aadharNumber: aadharData.aadharNumber }),
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

    

    const handleChangeAadhar = () => {
        setOtpSent(false);
        setErrorMessage("");
        setCountdown(0);
        setCanResend(true);
    };


    return (
        <div className="bg-gradient-to-r from-[#e0f2fe] to-[#f3e5f5] min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {!otpSent ? (
                    <AadharInput
                        aadharData={aadharData}
                        onSendOTP={handleSendOTP}
                        loader={loader}
                        errorMessage={errorMessage}
                    />
                ) : (
                    <AadharOTPInput
                        aadharNumber={aadharData.aadharNumber}
                        onVerifyOTP={handleVerifyOTP}
                        onResendOTP={handleResendOTP}
                        onChangeAadhar={handleChangeAadhar}
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

export default AadharVerification;