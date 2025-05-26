    "use client";
    import React, { useState } from 'react'
    import { Formik, Form, Field, ErrorMessage } from "formik";
    import { BeatLoader } from 'react-spinners';
    import { PersonalDetailsSchema } from '../validations/UserRegistrationValidations';
    import { useUser } from '@/lib/UserRegistrationContext';
    import { User, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

    function PersonalDetails() {
        const {
            personalData,
            setPersonalData,
            step,
            setStep,
            loader,
            setLoader,
            errorMessage,
            setErrorMessage,
            updateAddress,
            copyCurrentToPermanent
        } = useUser();

        const [sameAddress, setSameAddress] = useState(personalData.permanentAddress.isSameAsCurrent || false);

        const handlePersonalDetails = async (values) => {
            // try {
            //     setPersonalData({ ...values });
            //     setLoader(true);
            //     setErrorMessage("");
                
            //     const response = await fetch(`${ENV.API_URL}/finance-personal-details`, {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //             "Accept": "application/json"
            //         },
            //         body: JSON.stringify(values),
            //     });

            //     const result = await response.json();

            //     if (response.ok) {
            //         setLoader(false);
            //         setStep(step + 1);
            //     } else {
            //         setErrorMessage(result?.message);
            //         setLoader(false);
            //     }
            // } catch (error) {
            //     setErrorMessage("Error submitting data: " + error.message);
            //     setLoader(false);
            // }
            setStep(step + 1);
        }

        const handleSameAddressChange = (e, setFieldValue) => {
            const isChecked = e.target.checked;
            setSameAddress(isChecked);
            
            if (isChecked) {
                // Copy current address to permanent address
                const currentAddr = personalData.currentAddress;
                setFieldValue('permanentAddress.street', currentAddr.street);
                setFieldValue('permanentAddress.city', currentAddr.city);
                setFieldValue('permanentAddress.state', currentAddr.state);
                setFieldValue('permanentAddress.pincode', currentAddr.pincode);
                setFieldValue('permanentAddress.isSameAsCurrent', true);
            } else {
                // Clear permanent address
                setFieldValue('permanentAddress.street', '');
                setFieldValue('permanentAddress.city', '');
                setFieldValue('permanentAddress.state', '');
                setFieldValue('permanentAddress.pincode', '');
                setFieldValue('permanentAddress.isSameAsCurrent', false);
            }
        };

        return (
            <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Personal Details
                        </h1>
                        <p className="text-gray-600">
                            Please fill in your personal information to continue
                        </p>
                    </div>

                    <Formik
                        initialValues={personalData}
                        validationSchema={PersonalDetailsSchema}
                        onSubmit={(values) => { handlePersonalDetails(values); }}
                        enableReinitialize
                    >
                        {({ isValid, touched, setFieldValue, values }) => (
                            <Form className="space-y-8">
                                {errorMessage && (
                                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                                        <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
                                    </div>
                                )}
                                
                                {/* Personal Information Section */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                First Name<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="firstName"
                                                type="text"
                                                placeholder="Enter your first name"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="firstName" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Last Name<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="lastName"
                                                type="text"
                                                placeholder="Enter your last name"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="lastName" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Gender<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="gender"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </Field>
                                            <ErrorMessage name="gender" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Date of Birth<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="dob"
                                                type="date"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="dob" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Mobile Number<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="mobile"
                                                type="text"
                                                maxLength="10"
                                                placeholder="Enter your mobile number"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="mobile" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Alternative Email
                                            </label>
                                            <Field
                                                name="alternativeEmail"
                                                type="email"
                                                placeholder="Enter alternative email"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="alternativeEmail" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Father's Name<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="fatherName"
                                                type="text"
                                                placeholder="Enter father's name"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="fatherName" component="p" className="text-red-500 text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Current Address Section */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Current Address</h2>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Complete Address<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="currentAddress.street"
                                                as="textarea"
                                                rows="3"
                                                placeholder="Enter complete current address"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
                                            />
                                            <ErrorMessage name="currentAddress.street" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    City<span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Field
                                                    name="currentAddress.city"
                                                    type="text"
                                                    placeholder="Enter city"
                                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                />
                                                <ErrorMessage name="currentAddress.city" component="p" className="text-red-500 text-sm" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    State<span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Field
                                                    name="currentAddress.state"
                                                    type="text"
                                                    placeholder="Enter state"
                                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                />
                                                <ErrorMessage name="currentAddress.state" component="p" className="text-red-500 text-sm" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Pincode<span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Field
                                                    name="currentAddress.pincode"
                                                    type="text"
                                                    maxLength="6"
                                                    placeholder="Enter pincode"
                                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                />
                                                <ErrorMessage name="currentAddress.pincode" component="p" className="text-red-500 text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Permanent Address Section */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Permanent Address</h2>
                                    </div>

                                    <div className="mb-6">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={sameAddress}
                                                    onChange={(e) => handleSameAddressChange(e, setFieldValue)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${sameAddress ? 'bg-gradient-to-r from-teal-500 to-emerald-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-300'}`}>
                                                    {sameAddress && (
                                                        <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors duration-200">
                                                Permanent address is same as current address
                                            </span>
                                        </label>
                                    </div>

                                    {!sameAddress && (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Complete Address<span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Field
                                                    name="permanentAddress.street"
                                                    as="textarea"
                                                    rows="3"
                                                    placeholder="Enter complete permanent address"
                                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
                                                />
                                                <ErrorMessage name="permanentAddress.street" component="p" className="text-red-500 text-sm" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        City<span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <Field
                                                        name="permanentAddress.city"
                                                        type="text"
                                                        placeholder="Enter city"
                                                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                    />
                                                    <ErrorMessage name="permanentAddress.city" component="p" className="text-red-500 text-sm" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        State<span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <Field
                                                        name="permanentAddress.state"
                                                        type="text"
                                                        placeholder="Enter state"
                                                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                    />
                                                    <ErrorMessage name="permanentAddress.state" component="p" className="text-red-500 text-sm" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Pincode<span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <Field
                                                        name="permanentAddress.pincode"
                                                        type="text"
                                                        maxLength="6"
                                                        placeholder="Enter pincode"
                                                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                                    />
                                                    <ErrorMessage name="permanentAddress.pincode" component="p" className="text-red-500 text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Family Reference Section */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <Users className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Family Reference</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Reference Name<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="familyReference.name"
                                                type="text"
                                                placeholder="Enter reference name"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="familyReference.name" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Mobile Number<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="familyReference.mobileNumber"
                                                type="text"
                                                maxLength="10"
                                                placeholder="Enter mobile number"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="familyReference.mobileNumber" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email<span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Field
                                                name="familyReference.email"
                                                type="email"
                                                placeholder="Enter email"
                                                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                                            />
                                            <ErrorMessage name="familyReference.email" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
            Reference Relation<span className="text-red-500 ml-1">*</span>
        </label>
        <Field
            as="select"
            name="familyReference.relation"
            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
        >
            <option value="">Select relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Husband">Husband</option>
            <option value="Spouse">Spouse</option>
        </Field>
        <ErrorMessage name="familyReference.relation" component="p" className="text-red-500 text-sm" />
    </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address<span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            name="familyReference.address"
                                            as="textarea"
                                            rows="3"
                                            placeholder="Enter complete address"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
                                        />
                                        <ErrorMessage name="familyReference.address" component="p" className="text-red-500 text-sm" />
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                                    
                                    <button 
                                        disabled={loader} 
                                        type='submit' 
                                        className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
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
                        )}
                    </Formik>
            </div>
            </div>
        )
    }

    export default PersonalDetails;