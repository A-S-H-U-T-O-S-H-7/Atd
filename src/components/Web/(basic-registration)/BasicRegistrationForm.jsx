"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from "react-spinners";
import {
  Check, X, User, Mail, Phone, CreditCard,
  Building, Calendar, IndianRupee, FileText, ChevronLeft, Shield, AlertCircle, Info, LogIn
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import * as Yup from "yup";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "@/lib/firebase";

const RegistrationValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed')
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed')
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters')
    .required('Last name is required'),
  phoneNumber: Yup.string()
    .matches(/^[6-9][0-9]{9}$/, 'Phone number must be 10 digits starting with 6-9')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  panNumber: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)')
    .required('PAN number is required'),
  aadharNumber: Yup.string()
    .matches(/^[2-9][0-9]{11}$/, 'Aadhar number must be 12 digits starting with 2-9')
    .required('Aadhar number is required'),
  companyName: Yup.string()
    .min(2, 'Minimum 2 characters')
    .max(255, 'Maximum 255 characters')
    .required('Company name is required'),
  netSalary: Yup.number()
    .min(18000, 'Minimum salary is ₹18,000')
    .required('Net salary is required'),
  dob: Yup.date()
    .max(new Date(), 'Date cannot be in future')
    .test('age', 'You must be at least 18 years old', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    })
    .required('Date of birth is required'),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to terms and conditions')
});

function BasicRegistrationForm({ onNext, onError, userData, onBack }) {
  const [loading, setLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const formatMobileNumber = (value) => value.replace(/\D/g, "").slice(0, 10);
  const formatAadharNumber = (value) => value.replace(/\D/g, "").slice(0, 12);
  const formatPanNumber = (value) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

  // Helper function to check if error indicates existing user
  const isExistingUserError = (errorMessage) => {
    const existingUserKeywords = [
      'already been taken',
      'mobile has already been taken',
      'panno has already been taken', 
      'email has already been taken'
    ];
    return existingUserKeywords.some(keyword => 
      errorMessage.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Helper function to format error message in one line
  const formatErrorMessage = (errorMessage) => {
    if (!isExistingUserError(errorMessage)) return errorMessage;
    
    const fields = [];
    if (errorMessage.includes('mobile has already been taken')) fields.push('mobile');
    if (errorMessage.includes('panno has already been taken')) fields.push('PAN');
    if (errorMessage.includes('email has already been taken')) fields.push('email');
    
    if (fields.length > 0) {
      return `Sorry!! The ${fields.join(', ')} have already been taken.`;
    }
    return errorMessage;
  };

  const handleGoogleVerify = async (setFieldValue) => {
    try {
      setGoogleLoading(true);
      setError(""); // Clear any previous errors
      
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
      
      // Set verified email, mark as verified, AND update Formik field
      setVerifiedEmail(userEmail);
      setIsEmailVerified(true);
      setFieldValue('email', userEmail);
      
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
        userMessage = `Failed to verify email: ${error.message}`;
      }
      
      setError(userMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setError(""); // Clear any previous errors
    
    try {
      const requestData = {
        is_salaried: 1,
        fname: values.firstName,
        lname: values.lastName,
        dob: values.dob,
        mobile: parseInt(values.phoneNumber),
        panno: values.panNumber,
        aadharno: parseInt(values.aadharNumber),
        companyname: values.companyName,
        netsalary: parseInt(values.netSalary),
        email: verifiedEmail || values.email,
        provider: 1
      };

      // Direct API call instead of registrationAPI.sendOTP
      const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/otp/send`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        onNext("otp", { 
          ...values, 
          email: verifiedEmail || values.email,
          phoneNumber: values.phoneNumber 
        });
      } else {
        if (result.errors) {
          const errorMessages = Object.entries(result.errors)
            .map(([ field, messages]) => `${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          setError(`Sorry!!\n${errorMessages}`);
        } else {
          setError(result.message || `Registration failed (${response.status}). Please check your details and try again.`);
        }
      }

    } catch (error) {
      console.error('Registration error:', error);
      setError("An error occurred during registration. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, label, placeholder, type = "text", formatFunction, maxLength, showMobileWarning = false }) => (
    <Field name={name}>
      {({ field, form, meta }) => (
        <div className="mb-3 relative group">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label} <span className="text-red-500">*</span>
          </label>
          <div className={`flex items-center px-4 rounded-xl bg-white/70 backdrop-blur-sm border shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-1 ${
            meta.touched ? 
              meta.error ? "border-red-400 ring-red-200 focus-within:ring-red-200" : "border-emerald-400 ring-emerald-200 focus-within:ring-emerald-200" 
              : "border-gray-300 ring-transparent focus-within:ring-blue-200 focus-within:border-blue-400"
          }`}>
            <input
              {...field}
              type={type}
              maxLength={maxLength}
              placeholder={placeholder}
              className="flex-1 bg-transparent h-12 outline-none text-gray-700 placeholder-gray-400 text-sm"
              onChange={e => {
                let value = e.target.value;
                if (formatFunction) value = formatFunction(value);
                form.setFieldValue(name, value);
              }}
            />
            {meta.touched && field.value && (
              meta.error
                ? <X className="w-5 h-5 text-red-400" />
                : <Check className="w-5 h-5 text-emerald-500" />
            )}
          </div>
          <ErrorMessage name={name} component="p" className="text-red-500 text-xs mt-1 ml-1" />
          
          {/* Mobile Warning Info */}
          {showMobileWarning && (
            <div className="flex items-center gap-2 mt-3">
              <Info className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <p className="text-xs text-orange-700 font-medium">
                Only provide Aadhar registered mobile number
              </p>
            </div>
          )}
        </div>
      )}
    </Field>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-emerald-100 relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-5%] left-[-10%] w-[250px] h-[250px] bg-blue-200 rounded-full animate-pulse" />
        <div className="absolute top-[40%] left-[60%] w-[350px] h-[350px] bg-pink-100 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-indigo-100 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-emerald-100 rounded-full rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      {/* Modern Error Toast - Replace the existing error toast section */}
{error && !error.includes("successfully") && (
  <div className="fixed top-4 right-4 z-50 max-w-sm">
    <div className="bg-white/95 backdrop-blur-lg border border-red-100 rounded-2xl shadow-2xl shadow-red-500/20 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 border-b border-red-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-800">Registration Issue</h4>
          </div>
          <button 
            onClick={() => setError("")}
            className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
          >
            <X className="w-3 h-3 text-red-600 group-hover:text-red-700" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {formatErrorMessage(error)}
        </p>
        
        {isExistingUserError(error) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Already have an account?</span>
              <button
                type="button"
                onClick={() => router.push('/userlogin')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-xs font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105"
              >
                <LogIn className="w-3 h-3" />
                Login Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      <div className="relative z-10 flex justify-center items-center min-h-screen px-3 md:px-4 py-6">
        <div className="w-full max-w-4xl">
          <Formik
            initialValues={{
              firstName: userData?.firstName || "",
              lastName: userData?.lastName || "",
              phoneNumber: userData?.phoneNumber || "",
              email: userData?.email || "",
              panNumber: userData?.panNumber || "",
              aadharNumber: userData?.aadharNumber || "",
              companyName: userData?.companyName || "",
              netSalary: userData?.netSalary || "",
              dob: userData?.dob || "",
              agreeToTerms: userData?.agreeToTerms || false
            }}
            validationSchema={RegistrationValidationSchema}
            onSubmit={onSubmit}
          >
            {({ isValid, values, errors, touched, setFieldValue }) => {
              // Check if all required fields are filled and valid, terms agreed, and email verified
              const requiredFields = [
                values.firstName, values.lastName, values.phoneNumber, values.email,
                values.panNumber, values.aadharNumber, values.companyName, values.netSalary, values.dob
              ];
              const allFieldsFilled = requiredFields.every(field => field !== "" && field !== null && field !== undefined);
              const isFormReady = isValid && values.agreeToTerms && isEmailVerified && allFieldsFilled;
              
              return (
                <Form className="p-6 md:p-8 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-emerald-300/20 rounded-3xl">
                  <div className="text-center mb-6">
                    <img src="/atdlogo.png" alt="Logo" className="mx-auto w-16 h-16 mb-3 shadow-md rounded-xl bg-white p-2" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to ATD Money</h1>
                    <p className="text-gray-600">Instant Loan from ₹3,000 to ₹50,000</p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField 
                      name="firstName" 
                      label="First Name"
                      placeholder="Enter your first name" 
                      maxLength={50} 
                    />
                    <InputField 
                      name="lastName" 
                      label="Last Name"
                      placeholder="Enter your last name" 
                      maxLength={50} 
                    />
                    <InputField 
                      name="phoneNumber" 
                      label="Mobile Number"
                      placeholder="Enter 10-digit mobile number" 
                      formatFunction={formatMobileNumber} 
                      maxLength={10}
                      showMobileWarning={true}
                    />
                    <InputField 
                      name="dob" 
                      label="Date of Birth"
                      placeholder="Select your date of birth" 
                      type="date" 
                    />
                    <InputField 
                      name="panNumber" 
                      label="PAN Number"
                      placeholder="ABCDE1234F" 
                      formatFunction={formatPanNumber} 
                      maxLength={10} 
                    />
                    <InputField 
                      name="aadharNumber" 
                      label="Aadhar Number"
                      placeholder="Enter 12-digit Aadhar number" 
                      formatFunction={formatAadharNumber} 
                      maxLength={12} 
                    />
                    <InputField 
                      name="companyName" 
                      label="Company Name"
                      placeholder="Enter your company name" 
                    />
                    <InputField 
                      name="netSalary" 
                      label="Net Monthly Salary"
                      placeholder="Enter amount in rupees" 
                      type="number" 
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <Field name="agreeToTerms">
                    {({ field, form }) => (
                      <div className="mb-6">
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={e => form.setFieldValue("agreeToTerms", e.target.checked)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-0.5"
                          />
                          <label className="text-sm text-gray-700 leading-relaxed">
                            I agree to ATD Money's{" "}
                            <Link href="/privacypolicy" className="text-blue-600 hover:underline font-medium">
                              Privacy Policy
                            </Link>
                            {" "}and{" "}
                            <Link href="/terms&condition" className="text-blue-600 hover:underline font-medium">
                              Terms & Conditions
                            </Link>
                            . I consent to receive communications and marketing materials.
                          </label>
                        </div>
                        <ErrorMessage name="agreeToTerms" component="p" className="text-red-500 text-xs mt-2 ml-1" />
                      </div>
                    )}
                  </Field>

                  {/* Email Verification Section */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Verification <span className="text-red-500">*</span>
                    </label>
                    
                    {!isEmailVerified ? (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-red-600 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-orange-800 text-sm">Email Not Verified</p>
                            <p className="text-xs text-orange-700">Click to verify your email with Google</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleGoogleVerify(setFieldValue)}
                            disabled={googleLoading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-lg hover:border-orange-400 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {googleLoading ? (
                              <BeatLoader color="#EA580C" size={4} />
                            ) : (
                              <>
                                <Image src="/google-logo.png" alt='google' width={16} height={16} className='w-4 h-4'/>
                                <span className="font-medium text-gray-800">Verify</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-emerald-800 text-sm">Email Verified</p>
                            <p className="text-xs text-emerald-700 truncate">{verifiedEmail}</p>
                          </div>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium whitespace-nowrap">
                            ✓ Verified
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={onBack}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 border border-gray-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading || !isFormReady}
                      className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-300 text-base flex items-center justify-center gap-2 ${
                        loading || !isFormReady
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300" 
                          : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl cursor-pointer hover:from-emerald-600 hover:to-teal-700 border border-emerald-500"
                      }`}
                    >
                      {loading ? (
                        <>
                          <BeatLoader color="#fff" size={8}/>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Register & Send OTP</span>
                          <Mail className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default BasicRegistrationForm;