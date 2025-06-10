"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/UserRegistrationContext';
import AadharInput from './AadharInput';
import AadharOTPInput from './AadharOtpInput';

function AadharVerification() {
    const {
        aadharData,
        setAadharData,
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
                body: JSON.stringify({ aadharno: values.aadharNumber,
                    provider:1,
                    userid:phoneData.userid,
                    step:3}),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok) {
                setAadharData({ ...aadharData, aadharNumber: values.aadharNumber });
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
                   provider:1,
                   userid:phoneData.userid,
                   step:4,
                   aadharno_otp: values.aadharOtp
                }),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok) {
                setAadharData({ 
                    ...aadharData, 
                    isAadharVerified: true, 
                    aadharOtp: values.aadharOtp,

                    fullName: result.data.full_name,
                    dob: result.data.dob,
                    gender: result.data.gender,
                    careOf: result.data.care_of,
                     address: {
                        country: result.data.address.country,
                        state: result.data.address.state,
                        dist: result.data.address.dist,
                        subdist: result.data.address.subdist,
                        vtc: result.data.address.vtc,
                        po: result.data.address.po,
                        loc: result.data.address.loc,
                        street: result.data.address.street,
                        house: result.data.address.house,
                        landmark: result.data.address.landmark
                    },
                    zip: result.data.zip
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
                body: JSON.stringify({ aadharno: aadharData.aadharNumber,
                    provider:1,
                    userid:phoneData.userid,
                    step:3
                 }),
            });
            console.log(aadharData.aadharNumber)

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