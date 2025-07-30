"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { Gift } from 'lucide-react';
import { BsInfoCircle } from "react-icons/bs";
import { useUser } from '@/lib/UserRegistrationContext';
import { ReferralValidationSchema } from '../validations/UserRegistrationValidations';



function ReferralCode() {
    const {
        referralData,
        setReferralData,
        phoneData,
        step,
        setStep,
        loader,
        setLoader,
        errorMessage,
        setErrorMessage,
        token
    } = useUser();

    const [successMessage, setSuccessMessage] = useState("");

    const formatReferralCode = (value) => {
        return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    };

    const handleVerifyReferral = async (values) => {
        try {
            setLoader(true);
            setErrorMessage("");
            setSuccessMessage("");
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/refferal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    // provider: 1,
                    // userid: phoneData.userid,
                    step: 2,
                    referral_code: values.referralCode
                }),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok && result.success) {
                setReferralData({ 
                    ...referralData, 
                    referralCode: values.referralCode,
                    referrerId: result.referrer_id,
                    referrerName: result.referrer_name,
                    isVerified: true
                });
                setSuccessMessage(`Referral code verified! Referred by: ${result.referrer_name}`);
                setLoader(false);
                
                setTimeout(() => {
                    setStep(step + 1);
                }, 2000);
            } else {
                setErrorMessage(result?.errors?.referral_code || "Invalid referral code");
                setLoader(false);
            }
        } catch (error) {
            setErrorMessage("Error verifying referral code: " + error.message);
            setLoader(false);
        }
    };

    const handleSkip = () => {
        setStep(step + 1);
    };

    return (
        <div className="bg-gradient-to-r from-[#e0f2fe] to-[#f3e5f5] min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                        <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Referral Code
                    </h1>
                    <p className="text-gray-600">
                        Enter your referral code to get rewards
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
                    {errorMessage && (
                        <p className='text-red-600 font-medium text-center mb-4'>
                            {errorMessage}
                        </p>
                    )}

                    {successMessage && (
                        <div className='px-4 py-3 flex gap-3 items-center rounded-xl border border-dashed border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm mb-4'>
                            <BsInfoCircle className='text-green-600 text-lg flex-shrink-0' />
                            <p className='text-sm font-medium text-green-800'>
                                {successMessage}
                            </p>
                        </div>
                    )}

                    <Formik
                        initialValues={{ referralCode: referralData?.referralCode || '' }}
                        validationSchema={ReferralValidationSchema}
                        onSubmit={handleVerifyReferral}
                        enableReinitialize
                    >
                        {({ isValid, touched, values, setFieldValue }) => (
                            <Form className="space-y-6">
                                <div>
                                    <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                                        Referral Code
                                    </label>
                                    <div className='h-18'>
                                        <div className="relative">
                                            <Field name="referralCode">
                                                {({ field }) => (
                                                    <input
                                                        {...field}
                                                        id="referralCode"
                                                        type="text"
                                                        placeholder="Enter referral code"
                                                        value={formatReferralCode(field.value)}
                                                        onChange={(e) => {
                                                            const value = formatReferralCode(e.target.value);
                                                            if (value.length <= 12) {
                                                                setFieldValue('referralCode', value);
                                                            }
                                                        }}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-1 focus:border-transparent hover:border-purple-300"
                                                    />
                                                )}
                                            </Field>
                                            <Gift className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                        <ErrorMessage name="referralCode" component="p" className="mt-2 text-sm text-red-600" />
                                    </div>
                                </div>

                                <button 
                                    disabled={loader || !isValid || values.referralCode.length < 6} 
                                    type='submit' 
                                    className="px-6 w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 cursor-pointer text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-700 disabled:from-gray-300 disabled:to-gray-300"
                                >
                                    {loader ? (<BeatLoader color="#fff" size={8} />) : ("Verify Referral Code")}
                                </button>

                                <div className='px-4 py-3 flex gap-3 items-center rounded-xl border border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm'>
                                    <BsInfoCircle className='text-blue-600 text-lg flex-shrink-0' />
                                    <p className='text-sm font-medium text-blue-800'>
                                        Referral code is optional but helps you earn rewards
                                    </p>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <div className="text-center mt-6">
                        <button 
                            onClick={handleSkip}
                            className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                            disabled={loader}
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReferralCode;