"use client";
import React, { useState, useCallback, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { BeatLoader } from "react-spinners";
import { ChevronLeft, Mail ,Check, X} from "lucide-react";
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "@/lib/firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Components
import InputField from "./InputField";
import { EmailVerification } from "./EmailVerification";
import { TermsAndConditions } from "./TermsAndConditions";
import { ErrorToast } from "./ErrorToast";
import { FormLayout } from "./FormLayout";
import { RegistrationValidationSchema, formatPanNumber, formatAadharNumber, formatMobileNumber } from "./ValidationSchema";

// Custom DatePicker Component with portal for proper z-index
const DOBDatePicker = ({ field, form, ...props }) => {
  const handleChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      form.setFieldValue(field.name, `${year}-${month}-${day}`);
    } else {
      form.setFieldValue(field.name, '');
    }
  };

  const hasError = form.errors[field.name] && form.touched[field.name];
  const hasSuccess = form.touched[field.name] && field.value && !form.errors[field.name];

  return (
    <div className="mb-3 relative group z-10">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {props.label} <span className="text-red-500">*</span>
      </label>
      <div className={`relative flex items-center px-4 rounded-xl bg-white/70 backdrop-blur-sm border shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-1 ${
        hasError ? 
          "border-red-400 ring-red-200 focus-within:ring-red-200" : 
          hasSuccess ? 
            "border-emerald-400 ring-emerald-200 focus-within:ring-emerald-200" : 
            "border-gray-300 ring-transparent focus-within:ring-blue-200 focus-within:border-blue-400"
      }`}>
        <DatePicker
          selected={field.value ? new Date(field.value) : null}
          onChange={handleChange}
          maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
          minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          yearDropdownItemNumber={100}
          scrollableYearDropdown
          dateFormat="dd/MM/yyyy"
          className="w-full bg-transparent h-12 outline-none text-gray-700 placeholder-gray-400 text-sm cursor-pointer"
          placeholderText="Select your date of birth"
          name={field.name}
          withPortal
          portalId="root-portal"
          wrapperClassName="w-full"
          popperClassName="z-[9999]"
          popperPlacement="bottom-start"
        />
        {form.touched[field.name] && field.value && (
          hasError ? 
            <X className="w-5 h-5 text-red-400 flex-shrink-0" /> : 
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        )}
      </div>
      {hasError && (
        <p className="text-red-500 text-xs mt-1 ml-1">{form.errors[field.name]}</p>
      )}
    </div>
  );
};

// Custom Debounce Hook
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

const BasicRegistrationForm = ({ onNext, onError, userData, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileCheckStatus, setMobileCheckStatus] = useState({ checking: false, exists: false, checked: false });
  const [panCheckStatus, setPanCheckStatus] = useState({ checking: false, exists: false, checked: false });
  const router = useRouter();

  // API check functions
  const checkMobileExists = async (mobile) => {
    if (mobile.length !== 10) {
      setMobileCheckStatus({ checking: false, exists: false, checked: false });
      return;
    }
    
    setMobileCheckStatus({ checking: true, exists: false, checked: false });
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/check-mobile`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobile: parseInt(mobile) })
      });
      
      const result = await response.json();
      const exists = !result.success;
      
      setMobileCheckStatus({
        checking: false,
        exists: exists,
        checked: true
      });

      if (exists) {
        setError("This mobile number is already registered with us.");
      }
    } catch (error) {
      console.error('Mobile check error:', error);
      setMobileCheckStatus({ checking: false, exists: false, checked: false });
    }
  };

  const checkPanExists = async (panno) => {
    if (panno.length !== 10) {
      setPanCheckStatus({ checking: false, exists: false, checked: false });
      return;
    }
    
    setPanCheckStatus({ checking: true, exists: false, checked: false });
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/check-pan`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ panno: panno })
      });
      
      const result = await response.json();
      const exists = !result.success;
      
      setPanCheckStatus({
        checking: false,
        exists: exists,
        checked: true
      });

      if (exists) {
        setError("This PAN number is already registered with us.");
      }
    } catch (error) {
      console.error('PAN check error:', error);
      setPanCheckStatus({ checking: false, exists: false, checked: false });
    }
  };

  // Debounced API calls
  const debouncedMobileCheck = useDebounce(checkMobileExists, 500);
  const debouncedPanCheck = useDebounce(checkPanExists, 500);

  const isExistingUserError = (errorMessage) => {
    const existingUserKeywords = [
      'already been taken',
      'mobile has already been taken',
      'panno has already been taken', 
      'email has already been taken',
      'mobile number is already registered',
      'PAN number is already registered'
    ];
    return existingUserKeywords.some(keyword => 
      errorMessage.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const formatErrorMessage = (errorMessage) => {
    if (!isExistingUserError(errorMessage)) return errorMessage;
    
    const fields = [];
    if (errorMessage.includes('mobile has already been taken') || errorMessage.includes('mobile number is already registered')) fields.push('mobile');
    if (errorMessage.includes('panno has already been taken') || errorMessage.includes('PAN number is already registered')) fields.push('PAN');
    if (errorMessage.includes('email has already been taken')) fields.push('email');
    
    if (fields.length > 0) {
      return `Sorry!! The ${fields.join(', ')} ${fields.length > 1 ? 'have' : 'has'} already been taken.`;
    }
    return errorMessage;
  };

  const handleGoogleVerify = async (setFieldValue) => {
    try {
      setGoogleLoading(true);
      setError("");
      
      const googleProvider = new GoogleAuthProvider();
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (!user) throw new Error('No user data received from Google');
      
      const userEmail = user.email || (user.providerData && user.providerData[0]?.email);
      if (!userEmail) throw new Error('No email found in Google account');
      
      setVerifiedEmail(userEmail);
      setIsEmailVerified(true);
      setFieldValue('email', userEmail);
      
    } catch (error) {
      let userMessage = '';
      
      if (error.code) {
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
    setError("");
    
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

  return (
    <FormLayout>
      <ErrorToast 
        error={error} 
        setError={setError} 
        isExistingUserError={isExistingUserError} 
        formatErrorMessage={formatErrorMessage} 
      />
      
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
        {({ isValid, values, setFieldValue }) => {
          const requiredFields = [
            values.firstName, values.lastName, values.phoneNumber, values.email,
            values.panNumber, values.aadharNumber, values.companyName, values.netSalary, values.dob
          ];
          const allFieldsFilled = requiredFields.every(field => field !== "" && field !== null && field !== undefined);
          const hasApiErrors = mobileCheckStatus.exists || panCheckStatus.exists;
          const isFormReady = isValid && values.agreeToTerms && isEmailVerified && allFieldsFilled && !hasApiErrors;
          
          return (
            <Form className="py-5 px-3 md:p-8 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-emerald-300/20 rounded-3xl">
              <div className="text-center mb-6">
                <img src="/atdlogo.png" alt="Logo" className="mx-auto w-16 h-16 mb-3 shadow-md rounded-xl bg-white p-2" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to ATD Money</h1>
                <p className="text-gray-600">Instant Loan from ₹3,000 to ₹50,000</p>
                <p className="text-blue-600 font-medium mt-2">Create your account to get started</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InputField 
                  name="firstName" 
                  label="First Name"
                  placeholder="Enter your first name" 
                  maxLength={50}
                  mobileCheckStatus={mobileCheckStatus}
                  panCheckStatus={panCheckStatus}
                  setMobileCheckStatus={setMobileCheckStatus}
                  setPanCheckStatus={setPanCheckStatus}
                  setError={setError}
                  debouncedMobileCheck={debouncedMobileCheck}
                  debouncedPanCheck={debouncedPanCheck}
                />
                <InputField 
                  name="lastName" 
                  label="Last Name"
                  placeholder="Enter your last name" 
                  maxLength={50}
                  mobileCheckStatus={mobileCheckStatus}
                  panCheckStatus={panCheckStatus}
                  setMobileCheckStatus={setMobileCheckStatus}
                  setPanCheckStatus={setPanCheckStatus}
                  setError={setError}
                  debouncedMobileCheck={debouncedMobileCheck}
                  debouncedPanCheck={debouncedPanCheck}
                />
                <InputField 
                  name="phoneNumber" 
                  label="Mobile Number"
                  placeholder="Enter 10-digit mobile number" 
                  formatFunction={formatMobileNumber} 
                  maxLength={10}
                  showMobileWarning={true}
                  mobileCheckStatus={mobileCheckStatus}
                  panCheckStatus={panCheckStatus}
                  setMobileCheckStatus={setMobileCheckStatus}
                  setPanCheckStatus={setPanCheckStatus}
                  setError={setError}
                  debouncedMobileCheck={debouncedMobileCheck}
                  debouncedPanCheck={debouncedPanCheck}
                />
                <InputField 
                  name="panNumber" 
                  label="PAN Number"
                  placeholder="ABCDE1234F" 
                  formatFunction={formatPanNumber} 
                  maxLength={10}
                  mobileCheckStatus={mobileCheckStatus}
                  panCheckStatus={panCheckStatus}
                  setMobileCheckStatus={setMobileCheckStatus}
                  setPanCheckStatus={setPanCheckStatus}
                  setError={setError}
                  debouncedMobileCheck={debouncedMobileCheck}
                  debouncedPanCheck={debouncedPanCheck}
                />
                <InputField 
                  name="aadharNumber" 
                  label="Aadhar Number"
                  placeholder="Enter 12-digit Aadhar number" 
                  formatFunction={formatAadharNumber} 
                  maxLength={12}
                  mobileCheckStatus={mobileCheckStatus}
                  panCheckStatus={panCheckStatus}
                  setMobileCheckStatus={setMobileCheckStatus}
                  setPanCheckStatus={setPanCheckStatus}
                  setError={setError}
                  debouncedMobileCheck={debouncedMobileCheck}
                  debouncedPanCheck={debouncedPanCheck}
                />
                
                {/* Enhanced Date of Birth Field with React DatePicker */}
                <Field 
                  name="dob" 
                  label="Date of Birth"
                  component={DOBDatePicker}
                />
                
                <InputField 
                  name="companyName" 
                  label="Company Name"
                  placeholder="Enter your company name"
                  mobileCheckStatus={mobileCheckStatus}
                  panCheckStatus={panCheckStatus}
                  setMobileCheckStatus={setMobileCheckStatus}
                  setPanCheckStatus={setPanCheckStatus}
                  setError={setError}
                  debouncedMobileCheck={debouncedMobileCheck}
                  debouncedPanCheck={debouncedPanCheck}
                />
                <InputField 
                  name="netSalary" 
                  label="Net Monthly Salary"
                  placeholder="Enter amount in rupees" 
                  type="number"
                  mobileCheckStatus={mobileCheckStatus}
                  panCheckStatus={panCheckStatus}
                  setMobileCheckStatus={setMobileCheckStatus}
                  setPanCheckStatus={setPanCheckStatus}
                  setError={setError}
                  debouncedMobileCheck={debouncedMobileCheck}
                  debouncedPanCheck={debouncedPanCheck}
                />
              </div>

              <TermsAndConditions />
              
              <EmailVerification 
                isEmailVerified={isEmailVerified} 
                verifiedEmail={verifiedEmail} 
                googleLoading={googleLoading} 
                handleGoogleVerify={() => handleGoogleVerify(setFieldValue)} 
              />

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
                      <span>Sign Up Now</span>
                      <Mail className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </FormLayout>
  );
};

export default BasicRegistrationForm;