"use client";
import React, { useState, useEffect } from 'react';
import MobileLoginInput from './MobileInput';
import LoginOtpVerification from './OtpVerification';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

function MobileLogin() {
    const [phoneData, setPhoneData] = useState({
        phoneNumber: '',
        isPhoneVerified: false,
        phoneOtp: ''
    });
    
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const [showLoginAnyway, setShowLoginAnyway] = useState(false);

    const router = useRouter();
    const { login, isAuthenticated, user } = useAuth();

    // Modified redirect logic - show option instead of forcing redirect
    useEffect(() => {
        const requireOTP = localStorage.getItem("requireOTPLogin");
        
        // Only redirect if explicitly required, otherwise let user choose
        if (isAuthenticated() && requireOTP === "true") {
            router.push('/userProfile');
        }
        
        // Don't auto-redirect for normal cases - let user choose
    }, [isAuthenticated, router]);

    // Animated content data for left section
    const contentData = [
        {
            title: "Welcome back to your financial freedom!",
            subtitle: "Access your account in seconds with secure login."
        },
        {
            title: "Your trusted financial companion!",
            subtitle: "Manage your loans and payments seamlessly."
        },
        {
            title: "Quick access to your dashboard!",
            subtitle: "Continue your financial journey with ease."
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
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/login/otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ 
                    provider: 1,
                    mobile: parseInt(values.phoneNumber)
                }),
            });

            const result = await response.json();
            console.log('Send OTP Result:', result);

            if (result.success) {
                setPhoneData({ ...phoneData, phoneNumber: values.phoneNumber });
                setOtpSent(true);
                setCountdown(60); 
                setCanResend(false);
                setLoader(false);
            } else {
                setErrorMessage(result?.errors?.mobile  || "Failed to send OTP");
                setLoader(false);
            }
        } catch (error) {
            console.error('Send OTP Error:', error);
            setErrorMessage("Network error. Please try again.");
            setLoader(false);
        }
    };

    const handleVerifyOTP = async (values) => {
        try {
            setLoader(true);
            setErrorMessage("");
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/login/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    provider: 1,
                    mobile: parseInt(phoneData.phoneNumber),
                    otp: values.phoneOtp
                }),
            });

            const result = await response.json();
            console.log('Verify OTP Result:', result);

            if (result.success) {
                // Extract user data and token from response
                const userData = result.user || result.data || result;
                const token = result.token || result.access_token;

                if (token && userData) {
                    // Use AuthContext login function
                    const loginSuccess = await login(userData, token);
                    
                    if (loginSuccess) {
                        setPhoneData({ 
                            ...phoneData, 
                            isPhoneVerified: true, 
                            phoneOtp: values.phoneOtp 
                        });
                        
                        router.push('/userProfile');
                    } else {
                        setErrorMessage("Login failed. Please try again.");
                        setLoader(false);
                    }
                } else {
                    setErrorMessage("Invalid response from server. Please try again.");
                    setLoader(false);
                }
            } else {
                setErrorMessage(result?.message || "Invalid OTP");
                setLoader(false);
            }
        } catch (error) {
            console.error('Verify OTP Error:', error);
            setErrorMessage("Network error. Please try again.");
            setLoader(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;
        
        try {
            setLoader(true);
            setErrorMessage("");
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/login/otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ 
                    provider: 1,
                    mobile: parseInt(phoneData.phoneNumber)
                }),
            });

            const result = await response.json();

            if (result.success) {
                setCountdown(60);
                setCanResend(false);
                setLoader(false);
            } else {
                setErrorMessage(result?.message || "Failed to resend OTP");
                setLoader(false);
            }
        } catch (error) {
            console.error('Resend OTP Error:', error);
            setErrorMessage("Network error. Please try again.");
            setLoader(false);
        }
    };

    const handleChangeNumber = () => {
        setOtpSent(false);
        setErrorMessage("");
        setPhoneData({ ...phoneData, phoneNumber: '' });
    };

    const handleContinueToProfile = () => {
        router.push('/userProfile');
    };

    const handleLoginAnyway = () => {
        setShowLoginAnyway(true);
    };

    // Show "already logged in" message if user is authenticated and hasn't chosen to login anyway
    if (isAuthenticated() && !showLoginAnyway && !otpSent) {
        return (
            <div className="bg-gradient-to-r from-[#e0f2fe] to-[#f3e5f5] px-4 md:px-20 min-h-screen flex items-center justify-center">
                <div className="py-8 flex flex-col items-center justify-center w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Logged In</h2>
                            <p className="text-gray-600 mb-6">
                                You're already logged in as <span className="font-semibold">{user?.fname || 'User'}</span>. 
                                What would you like to do?
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <button
                                onClick={handleContinueToProfile}
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Continue to Profile
                            </button>
                            
                            <button
                                onClick={handleLoginAnyway}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Login with Different Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-[#e0f2fe] to-[#f3e5f5] px-4 md:px-20 min-h-screen flex items-center justify-center">
            <div className="py-8 flex flex-col lg:flex-row gap-15 items-center justify-between w-full max-w-7xl">
                {/* Left Section: Text and Image */}
                <div className="w-full order-2 lg:order-1 px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        {/* Image - Fixed dimensions */}
                        <div className="w-full flex justify-center lg:justify-end">
                            <div className="h-80 w-full max-w-md flex items-center justify-center">
                                <img
                                    src="/loginimage2.png"
                                    alt="Login illustration"
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
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-900 mb-3">
                                        {contentData[currentIndex].title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-indigo-700">
                                        {contentData[currentIndex].subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Form */}
                {!otpSent ? (
                    <MobileLoginInput
                        phoneData={phoneData}
                        onSendOTP={handleSendOTP}
                        loader={loader}
                        errorMessage={errorMessage}
                    />
                ) : (
                    <LoginOtpVerification
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

export default MobileLogin;