"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from "react-spinners";
import {
  Check, X, User, Mail, Phone, CreditCard,
  Building, Calendar, IndianRupee, FileText, ChevronLeft
} from "lucide-react";
import Link from "next/link";
import * as Yup from "yup";

const RegistrationValidationSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Minimum 2 characters').max(50, 'Maximum 50 characters').required('First name is required'),
  lastName: Yup.string().min(2, 'Minimum 2 characters').max(50, 'Maximum 50 characters').required('Last name is required'),
  phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  panNumber: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)').required('PAN number is required'),
  aadharNumber: Yup.string().matches(/^[0-9]{12}$/, 'Aadhar number must be 12 digits').required('Aadhar number is required'),
  companyName: Yup.string().min(2, 'Minimum 2 characters').required('Company name is required'),
  netSalary: Yup.number().positive('Salary must be positive').min(1000, 'Minimum salary is ₹1000').required('Net salary is required'),
  dob: Yup.date().max(new Date(), 'Date cannot be in future').required('Date of birth is required'),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to terms and conditions')
});

function BasicRegistrationForm({ onNext, onError, userData, onBack }) {
  const [loading, setLoading] = useState(false);

  const formatMobileNumber = (value) => value.replace(/\D/g, "").slice(0, 10);
  const formatAadharNumber = (value) => value.replace(/\D/g, "").slice(0, 12);
  const formatPanNumber = (value) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

  const onSubmit = async (values) => {
    setLoading(true);
    onError(""); // Clear any previous errors
    
    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate API response (85% success rate for demo)
      const success = Math.random() > 0.15;
      
      if (success) {
        // Success - move to OTP verification
        onNext("otp", { ...values, userId: "user_" + Date.now() });
      } else {
        // API error
        onError("Registration failed. Please check your details and try again.");
      }
    } catch (error) {
      onError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, placeholder, icon: Icon, type = "text", formatFunction, maxLength }) => (
    <Field name={name}>
      {({ field, form, meta }) => (
        <div className="mb-4 relative group">
          <div className={`flex items-center p-3 rounded-2xl bg-white/60 backdrop-blur-xl border shadow-md transition focus-within:ring-2 ${
            meta.touched ? 
              meta.error ? "border-red-400 ring-red-200" : "border-emerald-400 ring-emerald-200" 
              : "border-gray-300 ring-transparent"
          }`}>
            <Icon className="w-5 h-5 text-gray-500 mr-3 group-focus-within:text-indigo-500" />
            <input
              {...field}
              type={type}
              maxLength={maxLength}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              onChange={e => {
                let value = e.target.value;
                if (formatFunction) value = formatFunction(value);
                form.setFieldValue(name, value);
              }}
            />
            {meta.touched && field.value && (
              meta.error
                ? <X className="w-5 h-5 text-red-400" />
                : <Check className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <ErrorMessage name={name} component="p" className="text-red-500 text-xs mt-1 ml-1" />
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

      <div className="relative z-10 flex justify-center items-center min-h-screen px-3 md:px-4 py-12">
        <div className="w-full max-w-3xl">
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
            {({ isValid, values, errors, touched }) => (
              <Form className="p-4 md:p-10 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl">
                <div className="text-center mb-8">
                  <img src="/atdlogo.png" alt="Logo" className="mx-auto w-16 h-16 mb-3 shadow rounded-xl bg-white p-2" />
                  <h1 className="text-2xl font-bold text-gray-800">Welcome to ATD Money</h1>
                  <p className="text-sm text-gray-600">Instant Loan from ₹3,000 to ₹50,000</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField name="firstName" placeholder="First Name" icon={User} maxLength={50} />
                  <InputField name="lastName" placeholder="Last Name" icon={User} maxLength={50} />
                  <InputField name="phoneNumber" placeholder="Mobile Number" icon={Phone} formatFunction={formatMobileNumber} maxLength={10} />
                  <InputField name="dob" placeholder="Date of Birth" icon={Calendar} type="date" />
                  <InputField name="panNumber" placeholder="PAN Number" icon={CreditCard} formatFunction={formatPanNumber} maxLength={10} />
                  <InputField name="aadharNumber" placeholder="Aadhar Number" icon={FileText} formatFunction={formatAadharNumber} maxLength={12} />
                  <InputField name="companyName" placeholder="Company Name" icon={Building} />
                  <InputField name="netSalary" placeholder="Net Monthly Salary (₹)" icon={IndianRupee} type="number" />
                </div>
                
                <div className="mt-5">
                  <InputField name="email" placeholder="Email Address" icon={Mail} type="email" />
                </div>

                <Field name="agreeToTerms">
                  {({ field, form }) => (
                    <div className="flex items-start space-x-2 mt-5">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={e => form.setFieldValue("agreeToTerms", e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded mt-1"
                      />
                      <label className="text-sm text-gray-600">
                        By continuing, you agree to our {" "}
                        <Link href="/privacypolicy" className="text-blue-600 hover:underline font-medium">privacy policy</Link>{" "}
                        and {" "}
                        <Link href="/terms&condition" className="text-blue-600 hover:underline font-medium">T&C</Link>.
                      </label>
                    </div>
                  )}
                </Field>
                <ErrorMessage name="agreeToTerms" component="p" className="text-red-500 text-xs mt-1 ml-1" />

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || !isValid || !values.agreeToTerms}
                    className={`flex-1 py-3 cursor-pointer rounded-xl font-semibold transition-all duration-300 text-lg ${
                      loading || !isValid || !values.agreeToTerms 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                  >
                    {loading ? <BeatLoader color="#fff" size={8}/> : "Register & Send OTP"}
                  </button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account? {" "}
                  <Link href="/userlogin" className="text-blue-600 font-medium hover:underline">Login here</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default BasicRegistrationForm;