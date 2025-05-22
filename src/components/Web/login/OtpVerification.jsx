'use client';
import { useState, useEffect, useRef } from 'react';

const OtpVerification = ({ phoneNumber = '+91 XXXXXXXXXX', onSubmitOtp, onChangeNumber }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle pasting OTP
  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return;
    
    const otpDigits = pastedData.slice(0, 6 - index).split('');
    const newOtp = [...otp];
    
    otpDigits.forEach((digit, i) => {
      if (index + i < 6) {
        newOtp[index + i] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus on appropriate field after paste
    if (index + otpDigits.length < 6) {
      inputRefs.current[index + otpDigits.length].focus();
    }
  };

  // Resend OTP
  const resendOtp = () => {
    if (timer === 0) {
      setTimer(60);
      setOtp(Array(6).fill(''));
      // Optionally trigger resend API here
    }
  };

  // Submit OTP
  const handleSubmit = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      onSubmitOtp?.(enteredOtp);
    } else {
      alert('Please enter complete 6-digit OTP');
    }
  };

  return (
    <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end">
      <div className="bg-white backdrop-blur-lg w-full max-w-md flex flex-col gap-4 text-center rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 to-teal-500 pt-14 pb-6 px-6 rounded-t-2xl relative flex flex-col justify-center items-center">
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
            <img
              src="/atdlogo.png"
              alt="ATD Money logo"
              className="w-15 h-15 object-contain bg-white p-1 rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-gray-800 font-bold text-2xl mt-4">Verify OTP</h1>
          <p className="text-gray-700 font-medium mt-2 text-sm">
            OTP sent to <span className="font-bold">{phoneNumber}</span><br />
            <span 
              className="text-teal-700 underline cursor-pointer"
              onClick={onChangeNumber}
            >
              Change
            </span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="p-6 text-gray-700">
          <p className="text-gray-600 mb-4 text-sm">
            Enter the 6-digit OTP to verify your number
          </p>

          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={(e) => handlePaste(e, i)}
                className="w-10 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            ))}
          </div>

          {/* Countdown and Resend */}
          {timer > 0 ? (
            <p className="text-gray-500 text-sm mb-4">Resend in <span className="font-semibold text-teal-600">{`0:${timer < 10 ? `0${timer}` : timer}`}</span></p>
          ) : (
            <p className="text-teal-600 text-sm mb-4 cursor-pointer underline" onClick={resendOtp}>
              Resend OTP
            </p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg transition-all duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;