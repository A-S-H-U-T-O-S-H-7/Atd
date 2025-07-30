"use client";
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { LoanDetailsSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import {  ChevronLeft, ChevronRight, AlertCircle, Calculator, Percent, Calendar, IndianRupee, Info  } from 'lucide-react';

function LoanDetails() {
    const {
        loanData,
        setLoanData,
        step,
        setStep,
        loader,
        setLoader,
        phoneData,
        errorMessage,
        setErrorMessage,
        token
    } = useUser();

    const [dailyInterest, setDailyInterest] = useState(0);
    const [totalRepayAmount, setTotalRepayAmount] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    // Fixed ROI of 0.067%
    const FIXED_ROI = 0.067;

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

    const handleLoanDetails = async (values) => {
        try {
            
            setErrorMessage("");
            setLoader(true);
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    step: 4,
                    // userid: phoneData?.userid, 
                    // provider: 1,
                    amount: values.amount,
                    tenure: values.tenure,
                }),
            });
    
            const result = await response.json();
            console.log(result);
    
              if (response.ok && result.success) {
                setLoanData({ ...values });
                setStep(step + 1);
                setLoader(false);
            } else {
                setErrorMessage(result?.message || "Failed to save loan details");
                setLoader(false);
            }
        } catch (error) {
            console.error("Error submitting loan details:", error);
            setErrorMessage("Error submitting data: " + error.message);
            setLoader(false);
        }
    };

    const formatAmount = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        
        if (numericValue) {
            return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return numericValue;
    };

    // Fixed the duplicate key issue by ensuring unique values
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
                        <IndianRupee className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Loan Details
                    </h1>
                    <p className="text-gray-600">
                        Please provide your loan requirements
                    </p>
                </div>

                <Formik
                    initialValues={{
                        ...loanData,
                    }}
                    validationSchema={LoanDetailsSchema}
                    onSubmit={(values) => { handleLoanDetails(values); }}
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
                                
                                {/* Complete Loan Application Form */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8 space-y-8">
                                    
                                   
                                    {/* Loan Information Section */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                                <Calculator className="w-4 h-4 text-white" />
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800">Loan Information</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                                                                form.setFieldValue(field.name, rawValue);
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
                                        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Percent className="w-5 h-5 text-teal-600" />
                                                <span className="text-xs md:text-sm font-medium text-gray-700">
                                                    Fixed Interest Rate: {FIXED_ROI}% per day
                                                </span>
                                            </div>
                                        </div>

                                        {/* Updated Loan Summary Display - Only showing Amount, Days, Interest, and Repay Amount */}
                                        {totalRepayAmount > 0 && values.amount && values.tenure && (
                                            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-2 md:p-4 border border-teal-200">
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
                                                  {/* Enhanced Processing Fee Notice */}
        <div className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-xs text-orange-700">
                    <p className="font-medium  text-orange-600">A processing Fee & documentation charges will apply and can varies based on individual profiles.</p>
                </div>
            </div>
        </div>

                                            </div>
                                        )}
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
                                       disabled={loader || !isValid || !values.amount || !values.tenure }
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
    )
}

export default LoanDetails;