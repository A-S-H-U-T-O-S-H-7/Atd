"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/UserRegistrationContext';
import MobileInputForm from './MobileInputForm';
import OtpVerificationForm from './MobileOtpVerification';

function MobileVerification() {
    const {
        phoneData,
        setPhoneData,
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

    // Animated content data for left section
    const contentData = [
        {
            title: "Experience the unity of ease and convenience!",
            subtitle: "Enjoy 100% digital application process."
        },
        {
            title: "Transform your financial journey today!",
            subtitle: "Access seamless solutions at your fingertips."
        },
        {
            title: "Unlock premium benefits instantly!",
            subtitle: "Join thousands of satisfied customers worldwide."
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [animate, setAnimate] = useState(true);

    // Content animation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimate(false);
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % contentData.length);
                setAnimate(true);
            }, 200);
        }, 3000);

        return () => clearInterval(interval);
    }, [contentData.length]);

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
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/otp/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ mobile: values.phoneNumber, provider: 1 }),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok &&  result.success) {
                setPhoneData({ ...phoneData, phoneNumber: values.phoneNumber });
                setOtpSent(true);
                setCountdown(60); 
                setCanResend(false);
                setLoader(false);
            } else {
                setErrorMessage(result?.errors?.mobile?.[0] || result?.message || "Failed to send OTP");
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
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/otp/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    mobile: phoneData.phoneNumber,
                    otp: values.phoneOtp,
                    provider:1, 

                }),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok && result.success) {
                setPhoneData({ 
                    ...phoneData, 
                    isPhoneVerified: true, 
                    phoneOtp: values.phoneOtp ,
                    userid: result.userid
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
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/otp/resend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ mobile: phoneData.phoneNumber, provider: 1 }),
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

    const handleChangeNumber = () => {
        setOtpSent(false);
        setErrorMessage("");
    };

    return (
        
        <div className="bg-gradient-to-r from-[#cef8f8] to-[#e1fefe] px-50 md:px-5 min-h-screen flex items-center justify-center">
            <div className=" py-8 flex flex-col lg:flex-row gap-15 items-center justify-between">
                {/* Left Section: Text and Image */}
                <div className="w-full order-2 lg:order-1 px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-10 justify-between">
                        {/* Image - Fixed dimensions */}
                        <div className="w-full flex justify-center lg:justify-end">
                            <div className="h-80 w-full max-w-md flex items-center justify-center">
                                <img
                                    src="/loginimage2.png"
                                    alt="Hero illustration"
                                    className="max-h-80 lg:max-h-130 w-auto object-contain"
                                />
                            </div>
                        </div>
                        {/* Text Content - Fixed height with scrolling if needed */}
                        <div className="w-full mx-auto">
                            <div className="w-80 mx-auto md:w-130 overflow-hidden">
                                <div
                                    className={`transition-all duration-500 ${animate
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-4"}`}
                                >
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left  text-purple-900 mb-3">
                                        {contentData[currentIndex].title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-center md:text-left  text-purple-700">
                                        {contentData[currentIndex].subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Form */}
                {!otpSent ? (
                    <MobileInputForm
                        phoneData={phoneData}
                        onSendOTP={handleSendOTP}
                        loader={loader}
                        errorMessage={errorMessage}
                       
                    />
                ) : (
                    <OtpVerificationForm
                        phoneNumber={phoneData.phoneNumber}
                        onVerifyOTP={handleVerifyOTP}
                        onResendOTP={handleResendOTP}
                        onChangeNumber={handleChangeNumber}
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

export default MobileVerification;
