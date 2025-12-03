"use client";
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { BankLoanDetailsSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import { Building2, ChevronLeft, ChevronRight, Eye, EyeOff, Shield, Calculator, Percent, Calendar, IndianRupee, Info, AlertCircle } from 'lucide-react';

function BankLoanDetails() {
    const {
        bankLoanData,
        setBankLoanData,
        step,
        setStep,
        phoneData,
        loader,
        setLoader,
        errorMessage,
        setErrorMessage,
        token
    } = useUser();

    const [ifscLoading, setIfscLoading] = useState(false);
    const [ifscError, setIfscError] = useState("");
    const [showAccountNumber, setShowAccountNumber] = useState(false);
    const [dailyInterest, setDailyInterest] = useState(0);
    const [totalRepayAmount, setTotalRepayAmount] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    // Fixed ROI of 0.067%
    const FIXED_ROI = 0.067;

    // Handle IFSC code validation and auto-populate bank details
    const handleIFSC = async (ifsc, setFieldValue) => {
        try {
            const upperIFSC = ifsc.toUpperCase();
            setFieldValue("ifscCode", upperIFSC);
            setIfscError(""); // Clear previous errors
            
            // Validate IFSC format before API call
            if (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(upperIFSC)) {
                setIfscLoading(true);
                
                try {
                    const response = await fetch(`https://ifsc.razorpay.com/${upperIFSC}`, {
                        method: "GET",
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        setFieldValue("bankName", data.BANK || "");
                        setFieldValue("bankBranch", data.BRANCH || "");
                        setIfscError("");
                    } else {
                        // IFSC not found
                        setFieldValue("bankName", "");
                        setFieldValue("bankBranch", "");
                        setIfscError("Invalid IFSC code. Please check and try again.");
                    }
                } catch (fetchError) {
                    // Network error
                    setFieldValue("bankName", "");
                    setFieldValue("bankBranch", "");
                    setIfscError("Unable to verify IFSC. Please enter bank details manually.");
                }
                
                setIfscLoading(false);
            } else {
                // Clear fields if format is invalid
                setFieldValue("bankName", "");
                setFieldValue("bankBranch", "");
                setIfscError("");
            }
        } catch (error) {
            console.error("IFSC lookup error:", error);
            setIfscLoading(false);
            setFieldValue("bankName", "");
            setFieldValue("bankBranch", "");
            setIfscError("Error checking IFSC code.");
        }
    };

    // Calculate loan details when amount and tenure changes
    const calculateLoanDetails = (amount, tenure) => {
        if (amount && tenure) {
            const principal = parseFloat(amount);
            const days = parseInt(tenure);
            const dailyInterestRate = FIXED_ROI / 100;
            
            // Calculate daily interest: 0.067% of principal
            const dailyInterestAmount = principal * dailyInterestRate;
            
            // Calculate total interest for the tenure
            const totalInterestAmount = dailyInterestAmount * days;
            
            // Calculate total repay amount
            const totalAmountToPay = principal + totalInterestAmount;
            
            setDailyInterest(dailyInterestAmount);
            setTotalInterest(totalInterestAmount);
            setTotalRepayAmount(totalAmountToPay);
        } else {
            setDailyInterest(0);
            setTotalInterest(0);
            setTotalRepayAmount(0);
        }
    };

    const handleBankLoanDetails = async (values) => {
        console.log("Form values received:", values);
        try {
            setBankLoanData({ ...values });
            setLoader(true);
            setErrorMessage("");
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/form`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    step: 3,
                    // Bank details
                    ifsccode: values.ifscCode,
                    bankname: values.bankName,
                    bankbranch: values.bankBranch,
                    accountno: values.accountNumber, 
                    accounttype: values.accountType,
                    // Loan details
                    amount: parseInt(values.amount.replace(/[^0-9]/g, '')),
                    tenure: parseInt(values.tenure),
                }),
            });
    
            const result = await response.json();
            console.log("API Response:", result);
    
            if (response.ok && result.success) {
                setErrorMessage(""); // Clear any previous errors
                setLoader(false);
                setStep(step + 1);
            } else {
                // Handle different error types
                let errorMsg = result?.message || "Something went wrong.";
                
                // If there are validation errors from server, show them
                if (result?.errors && typeof result.errors === 'object') {
                    const errorFields = Object.keys(result.errors);
                    if (errorFields.length > 0) {
                        errorMsg = Object.values(result.errors).flat().join(', ');
                    }
                }
                
                setErrorMessage(errorMsg);
                setLoader(false);
            }
        } catch (error) {
            console.error("Network/Submit error:", error);
            
            // Check if it's a network error
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                setErrorMessage("Network error. Please check your internet connection.");
            } else {
                setErrorMessage("Error submitting data: " + error.message);
            }
            setLoader(false);
        }
    };

    // Format account number display
    const formatAccountNumber = (value) => {
        return value.replace(/\d(?=\d{4})/g, "*");
    };

    const formatAmount = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        
        if (numericValue) {
            return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return numericValue;
    };

    const tenureOptions = [
        { value: '90', label: '90 Days' },
        { value: '120', label: '120 Days' },
        { value: '150', label: '150 Days' },
        { value: '180', label: '180 Days' },
        { value: '210', label: '210 Days' },
        { value: '240', label: '240 Days' },
        { value: '365', label: '365 Days' },
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Bank & Loan Details
                    </h1>
                    <p className="text-gray-600">
                        Please provide your banking and loan requirements
                    </p>
                </div>

                <Formik
                    initialValues={bankLoanData}
                    validationSchema={BankLoanDetailsSchema}
                    onSubmit={(values) => { handleBankLoanDetails(values); }}
                    enableReinitialize
                >
                    {({ isValid, touched, setFieldValue, values, errors }) => {
                        // Calculate loan details whenever values change
                        React.useEffect(() => {
                            calculateLoanDetails(values.amount, values.tenure);
                        }, [values.amount, values.tenure]);

                        return (
                            <Form className="space-y-8">
                                {errorMessage && (
                                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            <p className='text-red-600 font-medium'>{errorMessage}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Loan Information Section */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <IndianRupee className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Loan Requirements</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Loan Amount */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                <IndianRupee className="w-4 h-4" />
                                                Loan Amount (₹)<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field name="amount">
                                                {({ field, form }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Enter loan amount"
                                                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                        onChange={(e) => {
                                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                            if (rawValue.length <= 6) { 
                                                              form.setFieldValue(field.name, rawValue);
                                                                  }
                                                        }}
                                                        value={formatAmount(field.value)}
                                                    />
                                                )}
                                            </Field>
                                            <p className="text-xs text-gray-500">
                                                Minimum: ₹3,000 | Maximum: ₹50,000
                                            </p>
                                            <ErrorMessage name="amount" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Loan Tenure */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                <Calendar className="w-4 h-4" />
                                                Loan Tenure<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="tenure"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            >
                                                <option value="">Select tenure</option>
                                                {tenureOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="tenure" component="p" className="text-red-500 text-sm" />
                                        </div>
                                    </div>

                                    {/* Fixed Interest Rate Display */}
                                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 mt-6">
                                        <div className="flex items-center gap-2">
                                            <Percent className="w-5 h-5 text-teal-600" />
                                            <span className="text-xs md:text-sm font-medium text-gray-700">
                                                Fixed Interest Rate: {FIXED_ROI}% per day
                                            </span>
                                        </div>
                                    </div>

                                    {/* Loan Summary Display */}
                                    {totalRepayAmount > 0 && values.amount && values.tenure && (
                                        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-2 md:p-4 border border-teal-200 mt-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <Calculator className="w-5 h-5" />
                                                Loan Summary
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                                        <IndianRupee className="w-4 h-4" />
                                                        Amount
                                                    </p>
                                                    <p className="text-xl font-bold text-teal-600">
                                                        ₹{formatAmount(values.amount)}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Days
                                                    </p>
                                                    <p className="text-xl font-bold text-emerald-600">
                                                        {values.tenure}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                                        <Percent className="w-4 h-4" />
                                                        Interest
                                                    </p>
                                                    <p className="text-xl font-bold text-cyan-600">
                                                        ₹{Math.round(totalInterest)}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                                        <IndianRupee className="w-4 h-4" />
                                                        Repay Amount
                                                    </p>
                                                    <p className="text-xl font-bold text-purple-600">
                                                        ₹{Math.round(totalRepayAmount)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 text-center text-sm text-gray-600">
                                                <p>Daily Interest: ₹{dailyInterest.toFixed(2)} | Total Interest: ₹{Math.round(totalInterest)}</p>
                                            </div>
                                            
                                            {/* Processing Fee Notice */}
                                            <div className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-200 rounded-lg p-3">
                                                <div className="flex items-start gap-2">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <Info className="w-4 h-4 text-orange-500" />
                                                    </div>
                                                    <div className="text-xs text-orange-700">
                                                        <p className="font-medium text-orange-600">A processing fee & documentation charges will apply and may vary based on individual profiles.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Bank Information Section */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Bank Account Details</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* IFSC Code */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                IFSC Code<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    name="ifscCode"
                                                    type="text"
                                                    placeholder="e.g., SBIN0001234"
                                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 uppercase"
                                                    onChange={(e) => { handleIFSC(e.target.value, setFieldValue); }}
                                                    maxLength="11"
                                                />
                                                {ifscLoading && (
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        <BeatLoader size={8} color="#14B8A6" />
                                                    </div>
                                                )}
                                            </div>
                                            <ErrorMessage name="ifscCode" component="p" className="text-red-500 text-sm" />
                                            {ifscError && (
                                                <p className="text-orange-500 text-sm flex items-center gap-1">
                                                    <Info className="w-3 h-3" />
                                                    {ifscError}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                11-character bank identifier code
                                            </p>
                                        </div>

                                        {/* Bank Name */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Bank Name<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="bankName"
                                                type="text"
                                                placeholder="Bank name will auto-populate"
                                                className="w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent"
                                                readOnly
                                            />
                                            <ErrorMessage name="bankName" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Bank Branch */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Bank Branch<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="bankBranch"
                                                type="text"
                                                placeholder="Branch will auto-populate"
                                                className="w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent"
                                                readOnly
                                            />
                                            <ErrorMessage name="bankBranch" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Account Type */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Account Type<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="accountType"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            >
                                                <option value="" disabled>Select Account Type</option>
                                                <option value="SAVING">Savings Account</option>
                                            </Field>
                                            <ErrorMessage name="accountType" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Account Number */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Account Number<span className="text-red-600 ml-1">*</span>
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    name="accountNumber"
                                                    type={showAccountNumber ? "text" : "password"}
                                                    placeholder="Enter your bank account number"
                                                    className="w-full px-4 py-3 pr-12 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                    }}
                                                    maxLength="18"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600 transition-colors duration-200"
                                                    onClick={() => setShowAccountNumber(!showAccountNumber)}
                                                >
                                                    {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <ErrorMessage name="accountNumber" component="p" className="text-red-500 text-sm" />
                                            <p className="text-xs text-gray-500">
                                                9-18 digit account number
                                            </p>
                                        </div>

                                        {/* Confirm Account Number */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Confirm Account Number<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="confirmAccountNumber"
                                                type="text"
                                                placeholder="Re-enter your account number"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                }}
                                                maxLength="18"
                                            />
                                            <ErrorMessage name="confirmAccountNumber" component="p" className="text-red-500 text-sm" />
                                        </div>
                                    </div>
                                    
                                    {/* Account Number Match Indicator */}
                                    {values.accountNumber && values.confirmAccountNumber && (
                                        <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
                                            values.accountNumber === values.confirmAccountNumber 
                                                ? 'bg-green-50/80 text-green-700 border border-green-200' 
                                                : 'bg-red-50/80 text-red-700 border border-red-200'
                                        }`}>
                                            {values.accountNumber === values.confirmAccountNumber 
                                                ? '✅ Account numbers match' 
                                                : '❌ Account numbers do not match'
                                            }
                                        </div>
                                    )}
                                </div>

                                {/* Combined Details Summary */}
                                {values.bankName && values.accountNumber && values.amount && (
                                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            Application Summary
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                            <div className="p-3 bg-teal-50/50 rounded-lg">
                                                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Loan Amount</p>
                                                <p className="font-semibold text-gray-800 mt-1">₹{formatAmount(values.amount)}</p>
                                            </div>
                                            <div className="p-3 bg-emerald-50/50 rounded-lg">
                                                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Tenure</p>
                                                <p className="font-semibold text-gray-800 mt-1">{values.tenure} Days</p>
                                            </div>
                                            <div className="p-3 bg-cyan-50/50 rounded-lg">
                                                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Bank Name</p>
                                                <p className="font-semibold text-gray-800 mt-1">{values.bankName}</p>
                                            </div>
                                            <div className="p-3 bg-teal-50/50 rounded-lg">
                                                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Branch</p>
                                                <p className="font-semibold text-gray-800 mt-1">{values.bankBranch}</p>
                                            </div>
                                            <div className="p-3 bg-emerald-50/50 rounded-lg">
                                                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">IFSC Code</p>
                                                <p className="font-semibold text-gray-800 mt-1">{values.ifscCode}</p>
                                            </div>
                                            <div className="p-3 bg-cyan-50/50 rounded-lg">
                                                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Account Number</p>
                                                <p className="font-semibold text-gray-800 mt-1">
                                                    {values.accountNumber ? formatAccountNumber(values.accountNumber) : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Security Notice */}
                                <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-2xl p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                                <Shield className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                                                Security Notice
                                            </h3>
                                            <p className="text-sm text-yellow-700">
                                                Your bank details are encrypted and securely stored. We use industry-standard security measures to protect your financial information.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 order-2 sm:order-1"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                    
                                    <button 
                                        disabled={loader || !isValid || !values.amount || !values.tenure || !values.accountNumber || !values.confirmAccountNumber} 
                                        type='submit' 
                                         className="inline-flex items-center cursor-pointer justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                                                                            >
                                                                                {loader ? (
                                                                                    <BeatLoader color="#fff" size={8} />
                                                                                ) : (
                                                                                    <>
                                                                                        Next
                                                                                        <ChevronRight className="w-4 h-4" />
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
                                            );
}

export default BankLoanDetails;
                                                