"use client";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import OtpVerification from "./OtpVerification";

function Signup2() {
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showError, setShowError] = useState(false);
  // Add state to control whether to show the OTP verification screen
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  useEffect(
    () => {
      const interval = setInterval(() => {
        setAnimate(false);

        setTimeout(() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % contentData.length);
          setAnimate(true);
        }, 200);
      }, 3000);

      return () => clearInterval(interval);
    },
    [contentData.length]
  );

  useEffect(
    () => {
      // Validate phone number (exactly 10 digits)
      setIsValid(phoneNumber.length === 10 && /^\d+$/.test(phoneNumber));

      // Hide error message when user starts typing again
      if (showError && phoneNumber.length > 0) {
        setShowError(false);
      }
    },
    [phoneNumber, showError]
  );

  const handlePhoneChange = e => {
    const value = e.target.value;
    // Only allow numeric input and limit to 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleSubmit = () => {
    if (!isValid) {
      setShowError(true);
      return;
    }
    if (!agreeTerms) {
      alert("Please agree to our terms and conditions");
      return;
    }

    // Show OTP verification screen instead of alert
    setShowOtpVerification(true);
  };

  // Function to handle returning to the phone input screen
  const handleChangePhoneNumber = () => {
    setShowOtpVerification(false);
  };

  // Function to handle OTP submission
  const handleSubmitOtp = enteredOtp => {
    // Here you would typically verify the OTP with your backend
    console.log("OTP submitted:", enteredOtp);
    alert(`OTP ${enteredOtp} verified successfully!`);
    // Proceed to next step or redirect user
  };

  return (
    <div className="bg-gradient-to-r from-[#cef8f8] to-[#e1fefe] min-h-screen flex items-center justify-center">
      <div className="px-4 py-8 flex flex-col lg:flex-row gap-15 items-center justify-between">
        {/* Left Section: Text and Image */}
        <div className="w-full order-2 lg:order-1 px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Image - Fixed dimensions */}
            <div className="w-full flex justify-center lg:justify-end">
              <div className="h-80 w-full max-w-md flex items-center justify-center">
                <img
                  src="/loginimage.png"
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
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-900 mb-3">
                    {contentData[currentIndex].title}
                  </h2>
                  <p className="text-lg md:text-xl text-purple-700">
                    {contentData[currentIndex].subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Form or OTP Verification */}
        {showOtpVerification
          ? <OtpVerification
              phoneNumber={`+91 ${phoneNumber}`}
              onSubmitOtp={handleSubmitOtp}
              onChangeNumber={handleChangePhoneNumber}
            />
          : <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="bg-white backdrop-blur-lg w-full max-w-md flex flex-col gap-4 text-center rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-green-400 to-teal-500 pt-14 pb-6 px-6 rounded-t-2xl relative flex flex-col justify-center items-center">
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                    <div>
                      <img
                        src="/atdlogo.png"
                        alt="ATD Money logo"
                        className="w-15 h-15 object-contain bg-white p-1 rounded-full shadow-lg"
                      />
                    </div>
                  </div>

                  <h1 className="text-gray-800 font-bold text-2xl mt-4">
                    Welcome to ATD Money
                  </h1>
                  <p className="text-gray-700 font-medium mt-2 text-base">
                    Get Instant Loan <br />
                    <span className="font-bold">From ₹3,000 to ₹50,000</span>
                  </p>
                </div>

                <div className="p-6 text-gray-700">
                  <h2 className="font-bold text-lg mb-2">
                    SignUp with Mobile Number
                  </h2>

                  <p className="text-gray-400 text-sm mb-4">
                    An OTP will be sent for verification
                  </p>

                  <div className="relative mb-5">
                    <div
                      className={`flex rounded-xl overflow-hidden border ${isValid
                        ? "border-teal-400"
                        : "border-gray-300"} transition-all duration-300 bg-white/5 backdrop-blur-sm`}
                    >
                      <div className="flex items-center justify-center bg-indigo-900/50 px-4">
                        <img
                          src="/flag.png"
                          alt="Indian flag"
                          className="w-10 h-10 object-contain p-1"
                        />
                      </div>

                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Enter your 10-digit number"
                        className="px-4 w-full py-4 focus:outline-none text-base bg-transparent placeholder-gray-400"
                      />

                      {phoneNumber.length > 0 &&
                        <div className="flex items-center justify-center px-4">
                          {isValid
                            ? <Check className="w-5 h-5 text-teal-400" />
                            : <X className="w-5 h-5 text-red-400" />}
                        </div>}
                    </div>

                    {showError &&
                      !isValid &&
                      <p className="text-red-500 text-xs mt-1">
                        Please enter a valid 10-digit phone number
                      </p>}
                  </div>

                  <div className="flex gap-3 mb-6 items-start">
                    <div
                      onClick={() => setAgreeTerms(!agreeTerms)}
                      className="cursor-pointer flex items-center justify-center mt-1"
                    >
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded-md border-2 ${agreeTerms
                          ? "bg-teal-500 border-teal-600"
                          : "bg-white/10 border-gray-600"} transition-all duration-300`}
                      >
                        {agreeTerms && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 text-left">
                      By continuing, you agree to our{" "}
                      <span className="text-teal-600 underline cursor-pointer">
                        privacy policies
                      </span>{" "}
                      and{" "}
                      <span className="text-teal-600 underline cursor-pointer">
                        T&C
                      </span>. You authorize us to communicate with you via
                      phone, e-mails, WhatsApp, etc.
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className={`w-full px-4 py-4 rounded-xl font-bold text-base transition-all duration-300 ${agreeTerms &&
                    isValid
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                      : "bg-gray-300 text-gray-700"}`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>}
      </div>
    </div>
  );
}

export default Signup2;
