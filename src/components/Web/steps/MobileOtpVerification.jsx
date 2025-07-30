// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { BeatLoader } from 'react-spinners';
// import { PhoneOtpSchema } from '../validations/UserRegistrationValidations';
// import { RiEdit2Fill } from 'react-icons/ri';
// import { Clock, RefreshCw } from 'lucide-react';

// function OtpVerificationForm({ 
//     phoneNumber, 
//     onVerifyOTP, 
//     onResendOTP, 
//     onChangeNumber, 
//     loader, 
//     errorMessage,
//     countdown,
//     canResend 
// }) {
//     const [otp, setOtp] = useState(Array(6).fill(''));
//     const inputRefs = useRef([]);

//     const formatOTP = (value) => {
//         // Remove all non-digits and limit to 6 digits
//         return value.replace(/\D/g, '').slice(0, 6);
//     };

//     // Handle OTP input change
//     const handleChange = (index, value, setFieldValue) => {
//         if (!/^\d?$/.test(value)) return;
        
//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);
        
//         // Update formik field
//         setFieldValue('phoneOtp', newOtp.join(''));

//         // Auto-focus to next input
//         if (value && index < 5) {
//             inputRefs.current[index + 1].focus();
//         }
//     };

//     // Handle backspace
//     const handleKeyDown = (e, index, setFieldValue) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             const newOtp = [...otp];
//             newOtp[index - 1] = '';
//             setOtp(newOtp);
//             setFieldValue('phoneOtp', newOtp.join(''));
//             inputRefs.current[index - 1].focus();
//         }
//     };

//     // Handle pasting OTP
//     const handlePaste = (e, index, setFieldValue) => {
//         e.preventDefault();
//         const pastedData = e.clipboardData.getData('text');
//         if (!/^\d+$/.test(pastedData)) return;
        
//         const otpDigits = pastedData.slice(0, 6 - index).split('');
//         const newOtp = [...otp];
        
//         otpDigits.forEach((digit, i) => {
//             if (index + i < 6) {
//                 newOtp[index + i] = digit;
//             }
//         });
        
//         setOtp(newOtp);
//         setFieldValue('phoneOtp', newOtp.join(''));
        
//         // Focus on appropriate field after paste
//         if (index + otpDigits.length < 6) {
//             inputRefs.current[index + otpDigits.length].focus();
//         }
//     };

//     return (
//         <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end">
//             <Formik
//                 initialValues={{ phoneOtp: '' }}
//                 validationSchema={PhoneOtpSchema}
//                 onSubmit={onVerifyOTP}
//             >
//                 {({ isValid, setFieldValue, values }) => (
//                     <Form className="bg-white backdrop-blur-lg w-full max-w-md flex flex-col gap-4 text-center rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        
//                         {/* Header */}
//                         <div className="bg-gradient-to-r from-green-400 to-teal-500 pt-14 pb-6 px-6 rounded-t-2xl relative flex flex-col justify-center items-center">
//                             <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
//                                 <img
//                                     src="/atdlogo.png"
//                                     alt="ATD Money logo"
//                                     className="w-15 h-15 object-contain bg-white p-1 rounded-full shadow-lg"
//                                 />
//                             </div>
//                             <h1 className="text-gray-800 font-bold text-2xl mt-4">Verify OTP</h1>
//                             <p className="text-gray-700 font-medium mt-2 text-sm">
//                                 OTP sent to <span className="font-bold">+91 {phoneNumber}</span><br />
                                
//                             </p>
//                             <div onClick={onChangeNumber}  className='flex cursor-pointer justify-center gap-3 items-center'>
//                             <span 
//                                     className="text-white cursor-pointer"
                                    
//                                 >
//                                     Change
//                                 </span>

//                             <RiEdit2Fill className='text-white' />
//                             </div>
//                         </div>

//                         {/* OTP Inputs */}
//                         <div className="p-6 text-gray-700">
//                             <p className="text-gray-600 mb-4 text-sm">
//                                 Enter the 6-digit OTP to verify your number
//                             </p>

//                             {errorMessage && <p className='text-red-600 font-thin text-center mb-4'>{errorMessage}</p>}

//                             <div className="flex justify-center gap-3 mb-4">
//                                 {otp.map((digit, i) => (
//                                     <input
//                                         key={i}
//                                         ref={(el) => (inputRefs.current[i] = el)}
//                                         type="text"
//                                         maxLength="1"
//                                         value={digit}
//                                         onChange={(e) => handleChange(i, e.target.value, setFieldValue)}
//                                         onKeyDown={(e) => handleKeyDown(e, i, setFieldValue)}
//                                         onPaste={(e) => handlePaste(e, i, setFieldValue)}
//                                         className="w-10 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
//                                     />
//                                 ))}
//                             </div>

//                             <ErrorMessage name="phoneOtp" component="p" className="text-red-500 text-sm text-center mb-4" />

//                             {/* Countdown and Resend */}
//                             <div className="text-center mb-4">
//                                 <p className="text-sm text-gray-600 mb-2">
//                                     Didn't receive the OTP?
//                                 </p>
//                                 {countdown > 0 ? (
//                                     <div className="flex items-center py-2 justify-center gap-2 text-gray-600">
//                                     <Clock className="w-4 h-4" />
//                                     <span>Resend code in <span className="font-semibold text-teal-600">{`0:${countdown < 10 ? `0${countdown}` : countdown}`}</span></span>
//                                     </div>
//                                 ) : (
//                                     <div className='flex justify-center items-center'>
//                                     <button 
//                                         type="button"
//                                         onClick={onResendOTP}
//                                         disabled={!canResend || loader}
//                                         className="text-teal-600 font-medium py-2 flex gap-2 text-sm cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                          <RefreshCw className="w-4 h-4" />
//                                         Resend code
                                       
//                                     </button>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Submit  Button */}
//                             <button
//                                 disabled={loader || !isValid || values.phoneOtp.length !== 6} 
//                                 type='submit' 
//                                 className={`w-full px-4 cursor-pointer py-4 rounded-xl font-bold text-base transition-all duration-300 ${
//                                     !loader && isValid && values.phoneOtp.length === 6
//                                         ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
//                                         : "bg-gray-300 text-gray-700"
//                                 }`}
//                             >
//                                 {loader ? (<BeatLoader color="#fff" size={8} />) : ("Next")}
//                             </button>

                            
//                         </div>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     );
// }

// export default OtpVerificationForm;