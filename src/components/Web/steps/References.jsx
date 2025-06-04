    "use client";
    import React from 'react'
    import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
    import { BeatLoader } from 'react-spinners';
    import { ReferencesSchema } from '../validations/UserRegistrationValidations';
    import { useUser } from '@/lib/UserRegistrationContext';
    import { Users, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
    import { useRouter } from 'next/navigation';
    import confetti from 'canvas-confetti';
    import { useAuth } from '@/lib/AuthContext';


    function References() {
        const router = useRouter();
        const { completeRegistration } = useAuth();

        const {
            referenceData,
            setReferenceData,
            step,
            setStep,
            loader,
            setLoader,
            errorMessage,
            setErrorMessage,
            phoneData,
        } = useUser();

        // Transform form data to match API format
        const transformToApiFormat = (formData) => {
            const apiData = {
                step: 11,
                provider: 1,
                userid: phoneData.userid,
            };

            // Transform references array to individual fields
            if (Array.isArray(formData.references)) {
                formData.references.forEach((reference, index) => {
                    const refNumber = index + 1;
                    apiData[`refname_${refNumber}`] = reference.name || "";
                    apiData[`refphone_${refNumber}`] = parseInt(reference.phone) || "";
                    apiData[`refemail_${refNumber}`] = reference.email || "";
                });
            }

            return apiData;
        };

        const handleReferences = async (values) => {
            try {
                setReferenceData({ ...values });
                setLoader(true);
                setErrorMessage("");
                
                const apiPayload = transformToApiFormat(values);
                console.log('API Payload:', apiPayload);
        
                const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(apiPayload),
                });
        
                const result = await response.json();
                console.log("Registration result:", result);
        
                if (response.ok && result.access_token) {
                    // try {
                    //     // Store everything needed
                    //     localStorage.setItem('token', result.access_token);
                    //     localStorage.setItem('showCongratulations', 'true');
                    //     localStorage.setItem('justRegistered', 'true');
                    //     // Store user data temporarily so AuthContext can use it
                    //     if (result.user) {
                    //         localStorage.setItem('tempUserData', JSON.stringify(result.user));
                    //     }
                    // } catch (error) {
                    //     console.warn('Could not access localStorage:', error);
                    // }
        
                //     setLoader(false);
                //     await completeRegistration(result.access_token, result.user);
                //     router.push('/userProfile');
                // } else {
                //     setErrorMessage(
                //         result?.message || 
                //         result?.error || 
                //         `API Error: ${response.status} ${response.statusText}`
                //     );
                //     setLoader(false);
                // }
                const success = await completeRegistration(result.access_token, result.user);
    if (success) {
        localStorage.setItem('showCongratulations', 'true');
        setLoader(false);
        router.push('/userProfile');
    } else {
        setErrorMessage("Registration completion failed");
        setLoader(false);
    }
}else {
    setErrorMessage(
        result?.message || 
        result?.error || 
        `API Error: ${response.status} ${response.statusText}`
    );
    setLoader(false);
}
                
            } catch (error) {
                console.error('API Error:', error);
                setErrorMessage("Network error: " + (error?.message || "Unable to connect to server"));
                setLoader(false);
            }
        }
        const formatPhoneNumber = (value) => {
            if (typeof value !== 'string') return '';
            const numericValue = value.replace(/[^0-9]/g, '');
            return numericValue.slice(0, 10);
        };

        // Helper function to safely count completed references
        const getCompletedReferencesCount = (references) => {
            if (!Array.isArray(references)) return 0;
            return references.filter(ref => 
                ref && 
                typeof ref === 'object' && 
                typeof ref.name === 'string' && ref.name.trim() !== '' &&
                typeof ref.phone === 'string' && ref.phone.trim() !== '' &&
                typeof ref.email === 'string' && ref.email.trim() !== ''
            ).length;
        };

        // Helper function to check for duplicate phone numbers
        const getDuplicatePhones = (references, currentIndex) => {
            if (!Array.isArray(references)) return [];
            const currentPhone = references[currentIndex]?.phone?.trim();
            if (!currentPhone) return [];
            
            return references
                .map((ref, index) => ({ phone: ref?.phone?.trim(), index }))
                .filter(({ phone, index }) => phone === currentPhone && index !== currentIndex)
                .map(({ index }) => index);
        };

        // Helper function to check for duplicate emails
        const getDuplicateEmails = (references, currentIndex) => {
            if (!Array.isArray(references)) return [];
            const currentEmail = references[currentIndex]?.email?.trim().toLowerCase();
            if (!currentEmail) return [];
            
            return references
                .map((ref, index) => ({ email: ref?.email?.trim().toLowerCase(), index }))
                .filter(({ email, index }) => email === currentEmail && index !== currentIndex)
                .map(({ index }) => index);
        };

        return (
            <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Personal References
                        </h1>
                        <p className="text-gray-600">
                            Please provide 5 personal references who can vouch for your character and reliability
                        </p>
                    </div>

                    <Formik
                        initialValues={referenceData}
                        validationSchema={ReferencesSchema}
                        onSubmit={(values) => { handleReferences(values); }}
                        enableReinitialize
                    >
                        {({ isValid, touched, setFieldValue, values, errors }) => {
                            // Ensure values.references is always an array
                            const references = Array.isArray(values?.references) ? values.references : [
                                { name: "", phone: "", email: "" },
                                { name: "", phone: "", email: "" },
                                { name: "", phone: "", email: "" },
                                { name: "", phone: "", email: "" },
                                { name: "", phone: "", email: "" },
                            ];

                            const completedCount = getCompletedReferencesCount(references);

                            return (
                                <Form className="space-y-8">
                                    {errorMessage && (
                                        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                                            <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
                                        </div>
                                    )}

                                    {/* Debug info - remove in production */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4">
                                            <p className="text-blue-700 text-sm">
                                                Debug: User ID: {phoneData.userid || 'Not set'}, Provider: 1
                                            </p>
                                        </div>
                                    )}

                                    {/* References Section */}
                                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                                <Users className="w-4 h-4 text-white" />
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800">Reference Information</h2>
                                        </div>

                                        <FieldArray name="references">
                                            {() => (
                                                <div className="space-y-8">
                                                    {references.map((reference, index) => {
                                                        const duplicatePhones = getDuplicatePhones(references, index);
                                                        const duplicateEmails = getDuplicateEmails(references, index);
                                                        const hasPhoneDuplicate = duplicatePhones.length > 0;
                                                        const hasEmailDuplicate = duplicateEmails.length > 0;

                                                        return (
                                                            <div key={`reference-${index}`} className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                                                                <div className="flex items-center gap-3 mb-6">
                                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold ${
                                                                        reference.name && reference.phone && reference.email 
                                                                            ? 'bg-gradient-to-r from-teal-500 to-emerald-500' 
                                                                            : 'bg-gray-400'
                                                                    }`}>
                                                                        {index + 1}
                                                                    </div>
                                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                                        Reference {index + 1}
                                                                    </h3>
                                                                    {reference.name && reference.phone && reference.email && !hasPhoneDuplicate && !hasEmailDuplicate && (
                                                                        <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                                                                    )}
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                    {/* Reference Name */}
                                                                    <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Full Name<span className="text-red-500 ml-1">*</span>
                                                                        </label>
                                                                        <Field
                                                                            name={`references.${index}.name`}
                                                                            type="text"
                                                                            placeholder="Enter full name"
                                                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                                        />
                                                                        <ErrorMessage 
                                                                            name={`references.${index}.name`} 
                                                                            component="p" 
                                                                            className="text-red-500 text-sm" 
                                                                        />
                                                                    </div>

                                                                    {/* Phone Number */}
                                                                    <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Phone Number<span className="text-red-500 ml-1">*</span>
                                                                        </label>
                                                                        <Field name={`references.${index}.phone`}>
                                                                            {({ field, form }) => (
                                                                                <input
                                                                                    {...field}
                                                                                    type="tel"
                                                                                    placeholder="Enter 10-digit number"
                                                                                    className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 ${
                                                                                        hasPhoneDuplicate ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                                                                    }`}
                                                                                    onChange={(e) => {
                                                                                        const formattedValue = formatPhoneNumber(e.target.value);
                                                                                        form.setFieldValue(field.name, formattedValue);
                                                                                    }}
                                                                                    maxLength="10"
                                                                                    value={field.value || ''}
                                                                                />
                                                                            )}
                                                                        </Field>
                                                                        <ErrorMessage 
                                                                            name={`references.${index}.phone`} 
                                                                            component="p" 
                                                                            className="text-red-500 text-sm" 
                                                                        />
                                                                        {hasPhoneDuplicate && (
                                                                            <p className="text-red-500 text-sm">
                                                                                This phone number is already used in Reference {duplicatePhones.map(i => i + 1).join(', ')}
                                                                            </p>
                                                                        )}
                                                                        <p className="text-xs text-gray-500">
                                                                            10-digit mobile number (must be unique)
                                                                        </p>
                                                                    </div>

                                                                    {/* Email */}
                                                                    <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Email Address<span className="text-red-500 ml-1">*</span>
                                                                        </label>
                                                                        <Field
                                                                            name={`references.${index}.email`}
                                                                            type="email"
                                                                            placeholder="Enter email address"
                                                                            className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 ${
                                                                                hasEmailDuplicate ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                                                            }`}
                                                                        />
                                                                        <ErrorMessage 
                                                                            name={`references.${index}.email`} 
                                                                            component="p" 
                                                                            className="text-red-500 text-sm" 
                                                                        />
                                                                        {hasEmailDuplicate && (
                                                                            <p className="text-red-500 text-sm">
                                                                                This email is already used in Reference {duplicateEmails.map(i => i + 1).join(', ')}
                                                                            </p>
                                                                        )}
                                                                        {!hasEmailDuplicate && (
                                                                            <p className="text-xs text-gray-500">
                                                                                Email must be unique across all references
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>

                                    {/* Important Note */}
                                    <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <AlertCircle className="w-6 h-6 text-amber-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                                                    Important Guidelines
                                                </h3>
                                                <ul className="text-sm text-amber-700 space-y-1">
                                                    <li>• Please ensure all contact information is accurate and up-to-date</li>
                                                    <li>• References should be people who know you personally or professionally</li>
                                                    <li>• Each phone number and email must be unique across all references</li>
                                                    <li>• We may contact these references during the verification process</li>
                                                </ul>
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
                                            disabled={loader || completedCount < 5 || references.some((_, index) => 
                                                getDuplicatePhones(references, index).length > 0 || 
                                                getDuplicateEmails(references, index).length > 0
                                            )} 
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

    export default References;