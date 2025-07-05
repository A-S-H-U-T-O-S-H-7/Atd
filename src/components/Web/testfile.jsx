// // Helper function to extract YouTube ID from URL
// const extractYoutubeId = (url) => {
//     const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

  
//   src={`https://www.youtube.com/embed/${currentVideo.youtubeId || extractYoutubeId(currentVideo.videoUrl)}`}


//   // try {
//           //     setLoanData({ ...values });
//           //     setLoader(true);
//           //     setErrorMessage("");
              
//           //     const response = await fetch(`${ENV.API_URL}/finance-loan-details`, {
//           //         method: "POST",
//           //         headers: {
//           //             "Content-Type": "application/json",
//           //             "Accept": "application/json"
//           //         },
//           //         body: JSON.stringify(values),
//           //     });
  
//           //     const result = await response.json();
  
//           //     if (response.ok) {
//           //         setLoader(false);
//           //         setStep(step + 1);
//           //     } else {
//           //         setErrorMessage(result?.message);
//           //         setLoader(false);
//           //     }
//           // } catch (error) {
//           //     setErrorMessage("Error submitting data: " + error.message);
//           //     setLoader(false);
//           // }

// "use client";
// import React, { useEffect } from 'react'
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { BeatLoader } from 'react-spinners';
// import { KycDetailsSchema } from '../validations/UserRegistrationValidations';
// import { useUser } from '@/lib/UserRegistrationContext';
// import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

// function KYCDetails() {
//     const {
//         kycData,
//         setKycData,
//         step,
//         setStep,
//         phoneData,
//         personalData, 
//         loader,
//         setLoader,
//         errorMessage,
//         setErrorMessage
//     } = useUser();

//     // Function to generate CRN number
//     const generateCrnNumber = (firstName, dob, panNumber, phoneNumber) => {
//         if (!firstName || !dob || !panNumber || !phoneNumber) return '';
        
//         const firstLetter = firstName.charAt(0).toUpperCase();
//         const dobDate = new Date(dob);
//         const day = dobDate.getDate().toString().padStart(2, '0');
//         const panFirst2 = panNumber.substring(0, 2).toUpperCase();
//         const phoneLast3 = phoneNumber.slice(-3);
        
//         return `${firstLetter}${day}${panFirst2}${phoneLast3}`;
//     };

//     // Function to generate Account ID
//     const generateAccountId = (crnNumber) => {
//         if (!crnNumber) return '';
        
//         const currentDate = new Date();
//         const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();
//         const currentYear = currentDate.getFullYear();
        
//         return `ATDFSL${crnNumber}${currentMonth}${currentYear}`;
//     };

//     const handleKycDetails = async (values) => {
//         try {
//             setLoader(true);
//             setErrorMessage("");
            
//             const generatedCrn = generateCrnNumber(
//                 personalData?.firstName,
//                 personalData?.dob,
//                 values.panNumber,
//                 phoneData?.phoneNumber
//             );

//             const generatedAccountId = generateAccountId(generatedCrn);

//             setKycData({ ...values,
//                 crnNumber: generatedCrn,      
//                 accountId: generatedAccountId });
              
            
//             const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json"
//                 },
//                 body: JSON.stringify({
//                     step: 6,
//                     userid: phoneData.userid, 
//                     provider: 1,
//                     panno: values.panNumber,
//                     crnno: generatedCrn,
//                     accountId: generatedAccountId
//                 }),
//             });

//             const result = await response.json();
//             console.log(result)

//             if (response.ok) {
//                 setLoader(false);
//                 setStep(step + 1);
//             } else {
//                 setErrorMessage(result?.message);
//                 setLoader(false);
//             }
//         } catch (error) {
//             setErrorMessage("Error submitting data: " + error.message);
//             setLoader(false);
//         }
//     }

//     const formatPanInput = (value) => {
//         // Remove any non-alphanumeric characters and convert to uppercase
//         return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
//     };

//     return (
//         <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
//                         <FileText className="w-8 h-8 text-white" />
//                     </div>
//                     <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                         KYC Details
//                     </h1>
//                     <p className="text-gray-600">
//                         Please provide your KYC information to verify your identity
//                     </p>
//                 </div>

//                 <Formik
//                     initialValues={kycData}
//                     validationSchema={KycDetailsSchema}
//                     onSubmit={(values) => { handleKycDetails(values); }}
//                     enableReinitialize
//                 >
//                     {({ isValid, touched, setFieldValue, values }) => {
//                         // Auto-generate CRN and Account ID when PAN is entered
//                         const generatedCrn = generateCrnNumber(
//                             personalData?.firstName,
//                             personalData?.dob,
//                             values.panNumber,
//                             phoneData?.phoneNumber
//                         );
                        
//                         const generatedAccountId = generateAccountId(generatedCrn);

//                         return (
//                             <Form className="space-y-8">
//                                 {errorMessage && (
//                                     <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
//                                         <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
//                                     </div>
//                                 )}
                                
//                                 {/* KYC Information Section */}
//                                 <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
//                                     <div className="flex items-center gap-3 mb-6">
//                                         <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                                             <FileText className="w-4 h-4 text-white" />
//                                         </div>
//                                         <h2 className="text-xl font-semibold text-gray-800">Identity Verification</h2>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         {/* PAN Number */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-medium text-gray-700">
//                                                 PAN Number<span className="text-red-500 ml-1">*</span>
//                                             </label>
//                                             <Field name="panNumber">
//                                                 {({ field, form }) => (
//                                                     <input
//                                                         {...field}
//                                                         type="text"
//                                                         maxLength="10"
//                                                         placeholder="Enter PAN number (e.g., ABCDE1234F)"
//                                                         className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 uppercase"
//                                                         onChange={(e) => {
//                                                             const formattedValue = formatPanInput(e.target.value);
//                                                             form.setFieldValue(field.name, formattedValue);
//                                                         }}
//                                                         value={field.value}
//                                                     />
//                                                 )}
//                                             </Field>
//                                             <ErrorMessage name="panNumber" component="p" className="text-red-500 text-sm" />
//                                             <p className="text-xs text-gray-500">
//                                                 Format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
//                                             </p>
//                                         </div>

//                                         {/* CRN Number (Auto-generated) */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-medium text-gray-700">
//                                                 CRN Number (Auto-generated)
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={generatedCrn}
//                                                 disabled
//                                                 className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600  cursor-not-allowed"
//                                                 placeholder="Will be generated automatically"
//                                             />
                                           
//                                         </div>

//                                         {/* Account ID (Auto-generated) */}
//                                         <div className="space-y-2 md:col-span-2">
//                                             <label className="block text-sm font-medium text-gray-700">
//                                                 Account ID (Auto-generated)
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={generatedAccountId}
//                                                 disabled
//                                                 className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600  cursor-not-allowed"
//                                                 placeholder="Will be generated automatically"
//                                             />
                                           
//                                         </div>
//                                     </div>

                                    
//                                 </div>

//                                 {/* Navigation Buttons */}
//                                 <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
//                                     <button 
//                                         type="button"
//                                         onClick={() => setStep(step - 1)}
//                                         className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 order-2 sm:order-1"
//                                     >
//                                         <ChevronLeft className="w-4 h-4" />
//                                         Previous
//                                     </button>
                                    
//                                     <button 
//                                         disabled={loader || !values.panNumber || !generatedCrn} 
//                                         type='submit' 
//                                         className="inline-flex items-center cursor-pointer justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
//                                     >
//                                         {loader ? (
//                                             <BeatLoader color="#fff" size={8} />
//                                         ) : (
//                                             <>
//                                                 Next
//                                                 <ChevronRight className="w-4 h-4" />
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             </Form>
//                         );
//                     }}
//                 </Formik>
//             </div>
//         </div>
//     )
// }

// export default KYCDetails;

// // service details
// "use client";
// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { BeatLoader } from "react-spinners";
// import { ServiceDetailsSchema } from "../validations/UserRegistrationValidations";
// import { useUser } from "@/lib/UserRegistrationContext";
// import { Building2, Users, Briefcase, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

// function ServiceDetails() {
//   const {
//     serviceData,
//     setServiceData,
//     step,
//     setStep,
//     phoneData,
//     loader,
//     setLoader,
//     errorMessage,
//     setErrorMessage
//   } = useUser();

//   const [availableIncome, setAvailableIncome] = useState(0);

//   const handleServiceDetails = async values => {
//     try {
//         setServiceData({ ...values });
//         setLoader(true);
//         setErrorMessage("");

//         const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             },
//             body: JSON.stringify({
//               step: 8,
//               userid: phoneData.userid,
//               provider: 1,
//               organizationname: values.organizationName,
//               organisationaddress: values.organizationAddress,
//               officephone: values.officePhone,
//               hrname: values.hrName,
//               hrphone: parseInt(values.hrPhone, 10), 
//               website: values.website,
//               hremail: values.hrEmail,
//               designation: values.designation,
//               worksince_mm: values.workingSince.month,
//               worksince_yy: values.workingSince.year,
//               grossalary: parseInt(values.monthlySalary, 10), 
//               netsalary: parseInt(values.netMonthlySalary, 10),
//               nethouseholdincome: parseInt(values.familyIncome, 10),
//               officialemail: values.officialEmail,
//               existingemi: parseInt(values.existingEmi, 10)
//           }),
//         });

//         const result = await response.json();
//         console.log(result)

//         if (response.ok) {
//             setLoader(false);
//             setStep(step + 1);
//         } else {
//             setErrorMessage(result?.message);
//             setLoader(false);
//         }
//     } catch (error) {
//         setErrorMessage("Error submitting data: " + error.message);
//         setLoader(false);
//     }
// // setStep(step + 1);
   
//   };

//   const formatAmount = value => {
//     // Remove non-numeric characters except decimal point
//     const numericValue = value.replace(/[^0-9.]/g, "");

//     // Format with commas for thousands
//     if (numericValue) {
//       const parts = numericValue.split(".");
//       parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//       return parts.join(".");
//     }
//     return numericValue;
//   };

//   const calculateWorkingYears = (startMonth, startYear) => {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth() + 1; 
    
//     const startDate = new Date(startYear, startMonth - 1); 
//     const diffInMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth);
    
//     return diffInMonths / 12;
//   };

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
//             <Briefcase className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Organization Details
//           </h1>
//           <p className="text-gray-600">
//             Please provide your employment and financial information
//           </p>
//         </div>

//         <Formik
//           initialValues={serviceData}
//           validationSchema={ServiceDetailsSchema}
//           onSubmit={values => {
//             handleServiceDetails(values);
//           }}
//           enableReinitialize
//         >
//           {({ isValid, touched, setFieldValue, values }) => {
//             // Calculate available income for loan eligibility
//             React.useEffect(
//               () => {
//                 const netSalary = parseFloat(values.netMonthlySalary) || 0;
//                 const existingEmi = parseFloat(values.existingEmi) || 0;
//                 const available = netSalary - existingEmi;
//                 setAvailableIncome(Math.max(0, available));
//               },
//               [values.netMonthlySalary, values.existingEmi]
//             );

//             return (
//               <Form className="space-y-8">
//                 {errorMessage && (
//                   <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
//                     <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
//                   </div>
//                 )}

//                 {/* Organization Information Section */}
//                 <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                       <Building2 className="w-4 h-4 text-white" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-800">Organization Information</h2>
//                   </div>

//                   <div className="space-y-6">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Organization Name<span className="text-red-500 ml-1">*</span>
//                       </label>
//                       <Field
//                         name="organizationName"
//                         type="text"
//                         placeholder="Enter organization name"
//                         className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                       />
//                       <ErrorMessage
//                         name="organizationName"
//                         component="p"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Organization Address<span className="text-red-500 ml-1">*</span>
//                       </label>
//                       <Field
//                         name="organizationAddress"
//                         as="textarea"
//                         rows="3"
//                         placeholder="Enter complete organization address"
//                         className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
//                       />
//                       <ErrorMessage
//                         name="organizationAddress"
//                         component="p"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Office Phone<span className="text-red-500 ml-1">*</span>
//                         </label>
//                         <Field
//                           name="officePhone"
//                           type="text"
//                           maxLength="11"
//                           placeholder="Enter office phone number"
//                           className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                         />
//                         <p className="text-xs text-gray-500">10-11 digits</p>
//                         <ErrorMessage
//                           name="officePhone"
//                           component="p"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Website
//                         </label>
//                         <Field
//                           name="website"
//                           type="text"
//                           placeholder="Enter organization website (optional)"
//                           className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                         />
//                         <p className="text-sm text-gray-500">e.g.: https://www.example.com</p>
//                         <ErrorMessage
//                           name="website"
//                           component="p"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* HR Contact Details Section */}
//                 <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                       <Users className="w-4 h-4 text-white" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-800">HR Contact Details</h2>
//                   </div>

//                   <div className="space-y-6">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         HR Name<span className="text-red-500 ml-1">*</span>
//                       </label>
//                       <Field
//                         name="hrName"
//                         type="text"
//                         placeholder="Enter HR name"
//                         className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                       />
//                       <ErrorMessage
//                         name="hrName"
//                         component="p"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           HR Phone<span className="text-red-500 ml-1">*</span>
//                         </label>
//                         <Field
//                           name="hrPhone"
//                           type="text"
//                           maxLength="10"
//                           placeholder="Enter HR phone number"
//                           className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                         />
//                         <p className="text-xs text-gray-500">10 digits</p>
//                         <ErrorMessage
//                           name="hrPhone"
//                           component="p"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           HR Email<span className="text-red-500 ml-1">*</span>
//                         </label>
//                         <Field
//                           name="hrEmail"
//                           type="email"
//                           placeholder="Enter HR email"
//                           className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                         />
//                         <ErrorMessage
//                           name="hrEmail"
//                           component="p"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Employment Details Section */}
//                 <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                       <Briefcase className="w-4 h-4 text-white" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-800">Employment Details</h2>
//                   </div>

//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Designation<span className="text-red-500 ml-1">*</span>
//                         </label>
//                         <Field
//                           name="designation"
//                           type="text"
//                           placeholder="Enter your designation"
//                           className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                         />
//                         <ErrorMessage
//                           name="designation"
//                           component="p"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Official Email<span className="text-red-500 ml-1">*</span>
//                         </label>
//                         <Field
//                           name="officialEmail"
//                           type="email"
//                           placeholder="Enter your official email"
//                           className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                         />
//                         <ErrorMessage
//                           name="officialEmail"
//                           component="p"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//   {/* Section Title */}
//   <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
  
//   {/* Working Period */}
//   <div className="grid grid-cols-2 gap-4">
//     <div className="space-y-2">
//       <label className="block text-xs font-medium text-gray-600">Month</label>
//       <Field
//         name="workingSince.month"
//         as="select"
//         className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//       >
//         <option value="">Select Month</option>
//         <option value="1">January</option>
//         <option value="2">February</option>
//         <option value="3">March</option>
//         <option value="4">April</option>
//         <option value="5">May</option>
//         <option value="6">June</option>
//         <option value="7">July</option>
//         <option value="8">August</option>
//         <option value="9">September</option>
//         <option value="10">October</option>
//         <option value="11">November</option>
//         <option value="12">December</option>
//       </Field>
//       <ErrorMessage
//         name="workingSince.month"
//         component="p"
//         className="text-red-500 text-sm"
//       />
//     </div>

//     <div className="space-y-2">
//       <label className="block text-xs font-medium text-gray-600">Year</label>
//       <Field
//         name="workingSince.year"
//         as="select"
//         className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//       >
//         <option value="">Select Year</option>
//         {Array.from({ length: 50 }, (_, i) => {
//           const year = new Date().getFullYear() - i;
//           return (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           );
//         })}
//       </Field>
//       <ErrorMessage
//         name="workingSince.year"
//         component="p"
//         className="text-red-500 text-sm"
//       />
//     </div>
//   </div>

//   {/* Experience Indicator */}
//   {values.workingSince.month && values.workingSince.year && (
//     <div className="bg-teal-50/80 backdrop-blur-sm border border-teal-200 rounded-xl p-4">
//       <p className="text-teal-700 text-sm">
//         <strong>Work Experience:</strong>{" "}
        
//         {calculateWorkingYears(values.workingSince.month, values.workingSince.year).toFixed(1)}{" "}
//         years
//       </p>
//     </div>
//   )}
// </div>

//                   </div>
//                 </div>

//                 {/* Salary Details Section */}
//                 <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                       <DollarSign className="w-4 h-4 text-white" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-800">Salary Details</h2>
//                   </div>

//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Monthly Salary (₹)<span className="text-red-500 ml-1">*</span>
//                         </label>
//                         <Field name="monthlySalary">
//                           {({ field, form }) => (
//                             <input
//                               {...field}
//                               type="text"
//                               placeholder="Enter gross monthly salary"
//                               className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                               onChange={e => {
//                                 const rawValue = e.target.value.replace(/[^0-9]/g, "");
//                                 const formattedValue = formatAmount(rawValue);
//                                 form.setFieldValue(field.name, rawValue);
//                                 e.target.value = formattedValue;
//                               }}
//                               value={formatAmount(field.value)}
//                             />
//                           )}
//                         </Field>
//                         <p className="text-xs text-gray-500">
//                           Gross salary before deductions
//                         </p>
//                         <ErrorMessage
//                           name="monthlySalary"
//                           component="p"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Net Monthly Salary (₹)<span className="text-red-500 ml-1">*</span>
//                         </label>
//                         <Field name="netMonthlySalary">
//                           {({ field, form }) => (
//                             <input
//                               {...field}
//                               type="text"
//                               placeholder="Enter net monthly salary"
//                               className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                               onChange={e => {
//                                 const rawValue = e.target.value.replace(/[^0-9]/g, "");
//                                 const formattedValue = formatAmount(rawValue);
//                                 form.setFieldValue(field.name, rawValue);
//                                 e.target.value = formattedValue;
//                               }}
//                               value={formatAmount(field.value)}
//                             />
//                           )}
//                         </Field>
//                         <p className="text-xs text-gray-500">
//                           Salary after all deductions
//                         </p>
//                         <ErrorMessage
//                           name="netMonthlySalary"
//                           component="p"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Existing EMI (₹)<span className="text-red-500 ml-1">*</span>
//                       </label>
//                       <Field name="existingEmi">
//                         {({ field, form }) => (
//                           <input
//                             {...field}
//                             type="text"
//                             placeholder="Enter existing EMI amount (0 if none)"
//                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                             onChange={e => {
//                               const rawValue = e.target.value.replace(/[^0-9]/g, "");
//                               const formattedValue = formatAmount(rawValue);
//                               form.setFieldValue(field.name, rawValue);
//                               e.target.value = formattedValue;
//                             }}
//                             value={formatAmount(field.value)}
//                           />
//                         )}
//                       </Field>
//                       <p className="text-xs text-gray-500">
//                         Total monthly EMI for all existing loans
//                       </p>
//                       <ErrorMessage
//                         name="existingEmi"
//                         component="p"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Family Income (₹)<span className="text-red-500 ml-1">*</span>
//                       </label>
//                       <Field name="familyIncome">
//                         {({ field, form }) => (
//                           <input
//                             {...field}
//                             type="text"
//                             placeholder="Enter total family income"
//                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                             onChange={e => {
//                               const rawValue = e.target.value.replace(/[^0-9]/g, "");
//                               const formattedValue = formatAmount(rawValue);
//                               form.setFieldValue(field.name, rawValue);
//                               e.target.value = formattedValue;
//                             }}
//                             value={formatAmount(field.value)}
//                           />
//                         )}
//                       </Field>
//                       <p className="text-xs text-gray-500">
//                         Total monthly income of all family members
//                       </p>
//                       <ErrorMessage
//                         name="familyIncome"
//                         component="p"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>

//                     {/* Financial Summary */}
//                     {values.netMonthlySalary && (
//                       <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 backdrop-blur-sm border border-teal-200 rounded-xl p-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                           Financial Summary
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div className="text-center">
//                             <p className="text-sm text-gray-600">Net Salary</p>
//                             <p className="text-xl font-bold text-teal-600">
//                               ₹{formatAmount(values.netMonthlySalary)}
//                             </p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-sm text-gray-600">Existing EMI</p>
//                             <p className="text-xl font-bold text-red-600">
//                               ₹{formatAmount(values.existingEmi || "0")}
//                             </p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-sm text-gray-600">Available Income</p>
//                             <p className="text-xl font-bold text-emerald-600">
//                               ₹{formatAmount(availableIncome.toString())}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="mt-4 text-center">
//                           <p className="text-sm text-gray-600">
//                             Recommended EMI Limit:{" "}
//                             <span className="font-semibold text-teal-600">
//                               ₹{formatAmount((availableIncome * 0.6).toFixed(0))}
//                             </span>
//                             <span className="text-xs ml-1">
//                               (60% of available income)
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Navigation Buttons */}
//                 <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setStep(step - 1)}
//                     className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 order-2 sm:order-1"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                     Previous
//                   </button>

//                   <button
//                     disabled={loader}
//                     type="submit"
//                     className="inline-flex items-center cursor-pointer justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
//                   >
//                     {loader ? (
//                       <BeatLoader color="#fff" size={8} />
//                     ) : (
//                       <>
//                         Next
//                         <ChevronRight className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </Form>
//             );
//           }}
//         </Formik>
//       </div>
//     </div>
//   );
// }

// export default ServiceDetails;

// "use client";
// import React, { useState, useEffect } from 'react'
// import { Formik, Form, ErrorMessage } from "formik";
// import { BeatLoader } from 'react-spinners';
// import { DocumentUploadSchema } from '../validations/UserRegistrationValidations';
// import { useUser } from '@/lib/UserRegistrationContext';
// import { Upload, FileText, ChevronLeft, ChevronRight, CheckCircle, X, AlertCircle } from 'lucide-react';

// function DocumentUpload() {
//     const {
//         documentData,
//         setDocumentData,
//         step,
//         setStep,
//         phoneData,
//         loader,
//         setLoader,
//         errorMessage,
//         setErrorMessage
//     } = useUser();

//     const [uploadStatus, setUploadStatus] = useState({});
//     const [uploadingFiles, setUploadingFiles] = useState(new Set());
//     // NEW: Track uploaded files with their hash/name and field mapping
//     const [uploadedFiles, setUploadedFiles] = useState(new Map());

//     // Document configuration mapping
//     const documentConfig = {
//         photo: { label: 'Passport Photo', accept: 'image/*', maxSize: 1, apiValue: 'selfie' },
//         aadharFront: { label: 'Aadhar Card (Front)', accept: 'image/*,.pdf', maxSize: 2, apiValue: 'idproof' },
//         aadharBack: { label: 'Aadhar Card (Back)', accept: 'image/*,.pdf', maxSize: 2, apiValue: 'addressproof' },
//         panCard: { label: 'PAN Card', accept: 'image/*,.pdf', maxSize: 2, apiValue: 'pancard' },
//         salarySlip1: { label: 'Latest Salary Slip', accept: '.pdf', maxSize: 2, apiValue: 'firstsalaryslip' },
//         salarySlip2: { label: '2nd Month Salary Slip', accept: '.pdf', maxSize: 2, apiValue: 'secondsalaryslip' },
//         salarySlip3: { label: '3rd Month Salary Slip', accept: '.pdf', maxSize: 2, apiValue: 'thirdsalaryslip' },
//         bankStatement: { label: '6 Month Bank Statement', accept: '.pdf', maxSize: 5, apiValue: 'statement' }
//     };

//     // NEW: Generate file hash for duplicate detection
//     const generateFileHash = async (file) => {
//         // Simple approach: use file name, size, and lastModified as identifier
//         const identifier = `${file.name}_${file.size}_${file.lastModified}`;
//         return identifier;
//     };

//     // NEW: Check if file is already uploaded in another field
//     const checkForDuplicateFile = async (file, currentFieldName) => {
//         const fileHash = await generateFileHash(file);
        
//         // Check if this file hash exists in uploaded files
//         if (uploadedFiles.has(fileHash)) {
//             const existingField = uploadedFiles.get(fileHash);
//             if (existingField !== currentFieldName) {
//                 return {
//                     isDuplicate: true,
//                     existingField: existingField,
//                     existingFieldLabel: documentConfig[existingField]?.label
//                 };
//             }
//         }
        
//         return { isDuplicate: false };
//     };

//     // NEW: Add file to uploaded files tracking
//     const addToUploadedFiles = async (file, fieldName) => {
//         const fileHash = await generateFileHash(file);
//         setUploadedFiles(prev => new Map(prev.set(fileHash, fieldName)));
//     };

//     // NEW: Remove file from uploaded files tracking
//     const removeFromUploadedFiles = async (file) => {
//         if (file) {
//             const fileHash = await generateFileHash(file);
//             setUploadedFiles(prev => {
//                 const newMap = new Map(prev);
//                 newMap.delete(fileHash);
//                 return newMap;
//             });
//         }
//     };

//     // Generate unique filename
//     const generateUniqueFilename = (originalName, fieldName) => {
//         const timestamp = Date.now();
//         const extension = originalName.split('.').pop();
//         return `${fieldName}_${phoneData?.userid || 'user'}_${timestamp}.${extension}`;
//     };

//     // Upload file to API
//     const uploadFileToAPI = async (file, fieldName) => {
//         const config = documentConfig[fieldName];
//         const uniqueFilename = generateUniqueFilename(file.name, fieldName);
        
//         setUploadingFiles(prev => new Set([...prev, fieldName]));
        
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json"
//                 },
//                 body: JSON.stringify({
//                     step: 10,
//                     provider: 1,
//                     userid: phoneData?.userid,
//                     upload: config.apiValue,
//                     filename: uniqueFilename
//                 }),
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 setUploadStatus(prev => ({
//                     ...prev,
//                     [fieldName]: { status: 'success', filename: uniqueFilename }
//                 }));
//                 // NEW: Add to uploaded files tracking
//                 await addToUploadedFiles(file, fieldName);
//                 return { success: true, filename: uniqueFilename };
//             } else {
//                 setUploadStatus(prev => ({
//                     ...prev,
//                     [fieldName]: { status: 'error', error: result.message || 'Upload failed' }
//                 }));
//                 return { success: false, error: result.message || 'Upload failed' };
//             }
//         } catch (error) {
//             setUploadStatus(prev => ({
//                 ...prev,
//                 [fieldName]: { status: 'error', error: error.message }
//             }));
//             return { success: false, error: error.message };
//         } finally {
//             setUploadingFiles(prev => {
//                 const newSet = new Set(prev);
//                 newSet.delete(fieldName);
//                 return newSet;
//             });
//         }
//     };

//     // MODIFIED: Handle file selection with duplicate check
//     const handleFileChange = async (file, fieldName, setFieldValue, currentFile = null) => {
//         if (!file) return;

//         const config = documentConfig[fieldName];
        
//         // NEW: Check for duplicate file
//         const duplicateCheck = await checkForDuplicateFile(file, fieldName);
//         if (duplicateCheck.isDuplicate) {
//             setErrorMessage(
//                 `This file "${file.name}" is already uploaded for ${duplicateCheck.existingFieldLabel}. Please select a different file for ${config.label}.`
//             );
//             setTimeout(() => setErrorMessage(''), 5000);
//             return;
//         }

//         // Validate file type
//         const allowedTypes = config.accept === 'image/*' 
//             ? ['image/jpeg', 'image/jpg', 'image/png']
//             : config.accept === '.pdf'
//             ? ['application/pdf']
//             : ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

//         if (!allowedTypes.includes(file.type)) {
//             setErrorMessage(`Invalid file type for ${config.label}. Please select a valid file.`);
//             setTimeout(() => setErrorMessage(''), 3000);
//             return;
//         }

//         // Validate file size
//         const maxSizeBytes = config.maxSize * 1024 * 1024;
//         if (file.size > maxSizeBytes) {
//             setErrorMessage(`File size exceeds ${config.maxSize}MB for ${config.label}`);
//             setTimeout(() => setErrorMessage(''), 3000);
//             return;
//         }

//         // NEW: If replacing a file, remove the old one from tracking
//         if (currentFile) {
//             await removeFromUploadedFiles(currentFile);
//         }

//         // Set file in form and upload
//         setFieldValue(fieldName, file);
//         const uploadResult = await uploadFileToAPI(file, fieldName);
        
//         if (!uploadResult.success) {
//             setErrorMessage(`Failed to upload ${config.label}: ${uploadResult.error}`);
//             setTimeout(() => setErrorMessage(''), 5000);
//             // NEW: If upload failed, don't keep it in tracking
//             await removeFromUploadedFiles(file);
//         }
//     };

//     // Format file size
//     const formatFileSize = (bytes) => {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//     };

//     // Handle form submission
//     const handleSubmit = async (values) => {
//         setLoader(true);
//         setErrorMessage("");
        
//         // Check if all files are uploaded successfully
//         const requiredFields = Object.keys(documentConfig);
//         const allUploaded = requiredFields.every(field => 
//             values[field] && uploadStatus[field]?.status === 'success'
//         );
        
//         if (!allUploaded) {
//             setErrorMessage("Please ensure all documents are uploaded successfully before proceeding.");
//             setLoader(false);
//             return;
//         }
        
//         setDocumentData({ ...values });
//         setLoader(false);
//         setStep(step + 1);
//     };

//     // File upload component
//     const FileUploadField = ({ fieldName, setFieldValue, values }) => {
//         const config = documentConfig[fieldName];
//         const file = values[fieldName];
//         const status = uploadStatus[fieldName];
//         const isUploading = uploadingFiles.has(fieldName);

//         return (
//             <div className="space-y-3">
//                 <label className="block text-sm font-medium text-gray-700">
//                     {config.label}
//                     <span className="text-red-500 ml-1">*</span>
//                 </label>
                
//                 {!file ? (
//                     <div className="relative">
//                         <input
//                             type="file"
//                             id={fieldName}
//                             accept={config.accept}
//                             onChange={(e) => {
//                                 const selectedFile = e.target.files[0];
//                                 if (selectedFile) {
//                                     handleFileChange(selectedFile, fieldName, setFieldValue);
//                                 }
//                             }}
//                             className="hidden"
//                         />
//                         <label
//                             htmlFor={fieldName}
//                             className="flex flex-col items-center justify-center w-full h-32 bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/30 cursor-pointer group"
//                         >
//                             <Upload className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mb-2" />
//                             <span className="text-sm text-gray-600 group-hover:text-teal-600 font-medium">
//                                 Choose {config.label}
//                             </span>
//                             <span className="text-xs text-gray-500 mt-1">
//                                 Max {config.maxSize}MB
//                             </span>
//                         </label>
//                     </div>
//                 ) : (
//                     <div className="flex items-center justify-between w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl">
//                         <div className="flex items-center space-x-3 flex-1 min-w-0">
//                             {isUploading ? (
//                                 <div className="w-5 h-5 flex items-center justify-center">
//                                     <BeatLoader color="#14b8a6" size={4} />
//                                 </div>
//                             ) : status?.status === 'success' ? (
//                                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                             ) : status?.status === 'error' ? (
//                                 <X className="w-5 h-5 text-red-500 flex-shrink-0" />
//                             ) : (
//                                 <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
//                             )}
                            
//                             <div className="flex-1 min-w-0">
//                                 <p className="text-sm font-medium text-gray-800 truncate">
//                                     {file.name}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                     {formatFileSize(file.size)}
//                                     {status?.status === 'success' && (
//                                         <span className="text-green-600 ml-2">✓ Uploaded</span>
//                                     )}
//                                     {status?.status === 'error' && (
//                                         <span className="text-red-600 ml-2">✗ Failed</span>
//                                     )}
//                                 </p>
//                             </div>
//                         </div>
                        
//                         <div className="flex items-center space-x-2">
//                             <input
//                                 type="file"
//                                 id={`${fieldName}_replace`}
//                                 accept={config.accept}
//                                 onChange={(e) => {
//                                     const selectedFile = e.target.files[0];
//                                     if (selectedFile) {
//                                         // MODIFIED: Pass current file for replacement tracking
//                                         handleFileChange(selectedFile, fieldName, setFieldValue, file);
//                                     }
//                                 }}
//                                 className="hidden"
//                             />
//                             <label
//                                 htmlFor={`${fieldName}_replace`}
//                                 className="px-3 py-1 text-xs bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 cursor-pointer transition-colors"
//                             >
//                                 Replace
//                             </label>
//                         </div>
//                     </div>
//                 )}
                
//                 <ErrorMessage name={fieldName} component="p" className="text-red-500 text-sm" />
                
//                 {status?.status === 'error' && (
//                     <p className="text-red-500 text-xs flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" />
//                         {status.error}
//                     </p>
//                 )}
//             </div>
//         );
//     };

//     // Document sections
//     const documentSections = [
//         {
//             title: "Identity Documents",
//             fields: ['photo', 'aadharFront', 'aadharBack', 'panCard']
//         },
//         {
//             title: "Financial Documents",
//             fields: ['salarySlip1', 'salarySlip2', 'salarySlip3', 'bankStatement']
//         }
//     ];

//     return (
//         <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
//                         <Upload className="w-8 h-8 text-white" />
//                     </div>
//                     <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                         Document Upload
//                     </h1>
//                     <p className="text-gray-600">
//                         Upload your documents to complete the verification process
//                     </p>
//                 </div>

//                 <Formik
//                     initialValues={documentData}
//                     validationSchema={DocumentUploadSchema}
//                     onSubmit={handleSubmit}
//                     enableReinitialize
//                 >
//                     {({ isValid, setFieldValue, values }) => (
//                         <Form className="space-y-6">
//                             {errorMessage && (
//                                 <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4">
//                                     <div className="flex items-center gap-2">
//                                         <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                                         <p className='text-red-600 font-medium'>{errorMessage}</p>
//                                     </div>
//                                 </div>
//                             )}
                            
//                             {documentSections.map((section, index) => (
//                                 <div key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6">
//                                     <div className="flex items-center gap-3 mb-6">
//                                         <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                                             {index === 0 ? (
//                                                 <FileText className="w-4 h-4 text-white" />
//                                             ) : (
//                                                 <Upload className="w-4 h-4 text-white" />
//                                             )}
//                                         </div>
//                                         <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         {section.fields.map((fieldName) => (
//                                             <FileUploadField
//                                                 key={fieldName}
//                                                 fieldName={fieldName}
//                                                 setFieldValue={setFieldValue}
//                                                 values={values}
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}

//                             {/* Guidelines */}
//                             <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6">
//                                 <div className="flex items-start gap-3">
//                                     <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                                         <span className="text-blue-600 text-sm font-bold">i</span>
//                                     </div>
//                                     <div>
//                                         <h3 className="text-sm font-semibold text-blue-800 mb-2">
//                                             Important Guidelines
//                                         </h3>
//                                         <ul className="text-sm text-blue-700 space-y-1">
//                                             <li>• Documents should be clear and readable</li>
//                                             <li>• Salary slips must be from the last 3 consecutive months</li>
//                                             <li>• Bank statement should cover the last 6 months</li>
//                                             <li>• Files are uploaded automatically when selected</li>
//                                             <li>• Each document must be unique - same file cannot be used for multiple fields</li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Navigation */}
//                             <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
//                                 <button 
//                                     type="button"
//                                     onClick={() => setStep(step - 1)}
//                                     className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
//                                 >
//                                     <ChevronLeft className="w-4 h-4" />
//                                     Previous
//                                 </button>
                                
//                                 <button 
//                                     disabled={loader || !isValid} 
//                                     type='submit' 
//                                     className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {loader ? (
//                                         <BeatLoader color="#fff" size={6} />
//                                     ) : (
//                                         <>
//                                             Next
//                                             <ChevronRight className="w-4 h-4" />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </div>
//     );
// }

// export default DocumentUpload;


// "use client";
// import React, { useState } from 'react'
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { BeatLoader } from 'react-spinners';
// import { PersonalDetailsSchema } from '../validations/UserRegistrationValidations';
// import { useUser } from '@/lib/UserRegistrationContext';
// import { User, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
// import References from './References';

// function PersonalDetails() {
//     const {
//         personalData,
//         setPersonalData,
//         step,
//         setStep,
//         phoneData,
//         aadharData,
//         emailData,
//         loader,
//         setLoader,
//         errorMessage,
//         setErrorMessage,
//         updateAddress,
//         copyCurrentToPermanent
//     } = useUser();

//     const [sameAddress, setSameAddress] = useState(personalData.permanentAddress.isSameAsCurrent || false);

//     const formatDateForAPI = (dateString) => {
//         if (!dateString) return "";
//         const date = new Date(dateString);
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };

//     const isCurrentAddressComplete = (values) => {
//         return values.currentAddress.street && 
//                values.currentAddress.city && 
//                values.currentAddress.state && 
//                values.currentAddress.pincode;
//     };
    
    
//     const handlePersonalDetails = async (values) => {
//         try {
//             setPersonalData({ ...values });
//             setLoader(true);
//             setErrorMessage("");
            
//             const apiData = {
//                 step: 5,
//                 userid: phoneData.userid, 
//                 provider: 1, 
//                 fname: values.firstName,
//                 lname: values.lastName,
//                 gender: values.gender,
//                 dob: values.dob,
//                 alt_email: values.alternativeEmail,  
//                 fathername: values.fatherName,
//                 curr_houseno: "555", 
//                 curr_address: values.currentAddress.street,
//                 curr_state: values.currentAddress.state,
//                 curr_city: values.currentAddress.city,
//                 curr_pincode: parseInt(values.currentAddress.pincode),
//                 per_houseno: "555",
//                 per_address: values.permanentAddress.isSameAsCurrent ? values.currentAddress.street : values.permanentAddress.street,
//                 per_state: values.permanentAddress.isSameAsCurrent ? values.currentAddress.state : values.permanentAddress.state,
//                 per_city: values.permanentAddress.isSameAsCurrent ? values.currentAddress.city : values.permanentAddress.city,
//                 per_pincode: values.permanentAddress.isSameAsCurrent ? parseInt(values.currentAddress.pincode) : parseInt(values.permanentAddress.pincode),
//                 ref_name: values.familyReference.name,
//                 ref_address: values.familyReference.address,
//                 ref_mobile: parseInt(values.familyReference.mobileNumber),
//                 ref_email: values.familyReference.email,
//                 ref_relation: values.familyReference.relation,
//             };
//             console.log('API Data being sent:', JSON.stringify(apiData, null, 2));
            
//             const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json"
//                 },
//                 body: JSON.stringify(apiData),
//             });
    
//             const result = await response.json();
//             console.log(result)
    
//             if (response.ok && result.success) {
//                 setLoader(false);
//                 setStep(step + 1);
//             } else {
                
//                 setErrorMessage(result?.message || "Something went wrong");
//                 setLoader(false);
//             }
//         } catch (error) {
//             const errorText = await response.text();
// console.log('Error response:', errorText);
//             setErrorMessage("Error submitting data: " + error.message);
//             setLoader(false);
//         }
// // setStep(step + 1);
//     }

//     const handleSameAddressChange = (e, setFieldValue, values) => {
//         const isChecked = e.target.checked;
        
//         // Check if current address is complete before allowing checkbox to be checked
//         if (isChecked && !isCurrentAddressComplete(values)) {
//             // Optionally show an error message
//             setErrorMessage("Please fill in all current address fields first");
//             return; // Don't proceed with checking the checkbox
//         }
        
//         setSameAddress(isChecked);
        
//         if (isChecked) {
//             setFieldValue('permanentAddress.street', values.currentAddress.street);
//             setFieldValue('permanentAddress.city', values.currentAddress.city);
//             setFieldValue('permanentAddress.state', values.currentAddress.state);
//             setFieldValue('permanentAddress.pincode', values.currentAddress.pincode);
//             setFieldValue('permanentAddress.isSameAsCurrent', true);
//         } else {
//             setFieldValue('permanentAddress.isSameAsCurrent', false);
//         }
//     };

//     const getFullAddressFromAadhar = () => {
//         if (!aadharData?.address) return '';
//         const addr = aadharData.address;
//         const addressParts = [
//             addr.house,
//             addr.street, 
//             addr.loc,
//             addr.landmark,
//             addr.po,
//             addr.vtc
//         ].filter(part => part && part.trim() !== ''); 
        
//         return addressParts.join(', ');
//     };

//     const mapGenderFromAadhar = (aadharGender) => {
//         if (!aadharGender) return '';
//         switch(aadharGender.toUpperCase()) {
//             case 'M': return 'Male';
//             case 'F': return 'Female';
//             default: return 'Other';
//         }
//     };
    

//     return (
//         <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
//                         <User className="w-8 h-8 text-white" />
//                     </div>
//                     <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                         Personal Details
//                     </h1>
//                     <p className="text-gray-600">
//                         Please fill in your personal information to continue
//                     </p>
//                 </div>

//                 <Formik
//                     initialValues={{
//                         ...personalData,
//                         firstName: personalData.firstName || aadharData?.fullName?.split(' ')[0] || '',
//                         lastName: personalData.lastName || aadharData?.fullName?.split(' ').slice(1).join(' ') || '',
//                         gender: personalData.gender || mapGenderFromAadhar(aadharData?.gender) || '',
//                         dob: personalData.dob || aadharData?.dob || '',
//                         fatherName: personalData.fatherName || aadharData?.careOf || '',
//                         currentAddress: {
//                             ...personalData.currentAddress,
//                             street: personalData.currentAddress?.street || getFullAddressFromAadhar() || '',
//                             city: personalData.currentAddress?.city || aadharData?.address?.subdist || '',
//                             state: personalData.currentAddress?.state || aadharData?.address?.state || '',
//                             pincode: personalData.currentAddress?.pincode || aadharData?.zip || ''
//                         }
//                     }}
//                     validationSchema={PersonalDetailsSchema}
//                     context={{
//                         phoneNumber: phoneData?.phoneNumber || phoneData?.phone || '', 
//                         userEmail: emailData?.email || ''
//                     }}
//                     onSubmit={(values) => { handlePersonalDetails(values); }}
//                     enableReinitialize
//                 >
//                     {({ isValid, touched, setFieldValue, values }) => (
//                         <Form className="space-y-8">
//                             {errorMessage && (
//                                 <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
//                                     <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
//                                 </div>
//                             )}
                            
//                             {/* Personal Information Section */}
//                             <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
//                                 <div className="flex items-center gap-3 mb-6">
//                                     <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                                         <User className="w-4 h-4 text-white" />
//                                     </div>
//                                     <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             First Name<span className="text-red-500 ml-1">*</span>
//                                         </label>
//                                         <Field
//                                             name="firstName"
//                                             type="text"
//                                             placeholder="Enter your first name"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                         />
//                                         <ErrorMessage name="firstName" component="p" className="text-red-500 text-sm" />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Last Name<span className="text-red-500 ml-1">*</span>
//                                         </label>
//                                         <Field
//                                             name="lastName"
//                                             type="text"
//                                             placeholder="Enter your last name"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                         />
//                                         <ErrorMessage name="lastName" component="p" className="text-red-500 text-sm" />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Gender<span className="text-red-500 ml-1">*</span>
//                                         </label>
//                                         <Field
//                                             as="select"
//                                             name="gender"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                         >
//                                             <option value="">Select Gender</option>
//                                             <option value="Male">Male</option>
//                                             <option value="Female">Female</option>
//                                             <option value="Other">Other</option>
//                                         </Field>
//                                         <ErrorMessage name="gender" component="p" className="text-red-500 text-sm" />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Date of Birth<span className="text-red-500 ml-1">*</span>
//                                         </label>
//                                         <Field
//                                             name="dob"
//                                             type="date"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                         />
//                                         <ErrorMessage name="dob" component="p" className="text-red-500 text-sm" />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Alternative Email
//                                         </label>
//                                         <Field
//                                             name="alternativeEmail"
//                                             type="email"
//                                             placeholder="Enter alternative email"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                         />
//                                         <ErrorMessage name="alternativeEmail" component="p" className="text-red-500 text-sm" />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Father's Name<span className="text-red-500 ml-1">*</span>
//                                         </label>
//                                         <Field
//                                             name="fatherName"
//                                             type="text"
//                                             placeholder="Enter father's name"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                         />
//                                         <ErrorMessage name="fatherName" component="p" className="text-red-500 text-sm" />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Current Address Section */}
//                             <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
//                                 <div className="flex items-center gap-3 mb-6">
//                                     <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                                         <MapPin className="w-4 h-4 text-white" />
//                                     </div>
//                                     <h2 className="text-xl font-semibold text-gray-800">Current Address</h2>
//                                 </div>
                                
//                                 <div className="space-y-6">
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Complete Address<span className="text-red-500 ml-1">*</span>
//                                         </label>
//                                         <Field
//                                             name="currentAddress.street"
//                                             as="textarea"
//                                             rows="3"
//                                             placeholder="Enter complete current address"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
//                                         />
//                                         <ErrorMessage name="currentAddress.street" component="p" className="text-red-500 text-sm" />
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-medium text-gray-700">
//                                                 City<span className="text-red-500 ml-1">*</span>
//                                             </label>
//                                             <Field
//                                                 name="currentAddress.city"
//                                                 type="text"
//                                                 placeholder="Enter city"
//                                                 className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                             />
//                                             <ErrorMessage name="currentAddress.city" component="p" className="text-red-500 text-sm" />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-medium text-gray-700">
//                                                 State<span className="text-red-500 ml-1">*</span>
//                                             </label>
//                                             <Field
//                                                 name="currentAddress.state"
//                                                 type="text"
//                                                 placeholder="Enter state"
//                                                 className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                             />
//                                             <ErrorMessage name="currentAddress.state" component="p" className="text-red-500 text-sm" />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-medium text-gray-700">
//                                                 Pincode<span className="text-red-500 ml-1">*</span>
//                                             </label>
//                                             <Field
//                                                 name="currentAddress.pincode"
//                                                 type="text"
//                                                 maxLength="6"
//                                                 placeholder="Enter pincode"
//                                                 className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                             />
//                                             <ErrorMessage name="currentAddress.pincode" component="p" className="text-red-500 text-sm" />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Permanent Address Section */}
//                             <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
//                                 <div className="flex items-center gap-3 mb-6">
//                                     <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                                         <MapPin className="w-4 h-4 text-white" />
//                                     </div>
//                                     <h2 className="text-xl font-semibold text-gray-800">Permanent Address</h2>
//                                 </div>

//                                 <div className="mb-6">
//                                 <label className={`flex items-center gap-3 cursor-pointer group ${!isCurrentAddressComplete(values) ? 'opacity-50 cursor-not-allowed' : ''}`}>
// <div className="relative">
//     <input
//         type="checkbox"
//         checked={sameAddress}
//         disabled={!isCurrentAddressComplete(values)}
//         onChange={(e) => handleSameAddressChange(e, setFieldValue, values)}
//         className="sr-only"
//     />
//     <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
//         sameAddress ? 'bg-gradient-to-r from-teal-500 to-emerald-500 border-teal-500' : 
//         !isCurrentAddressComplete(values) ? 'border-gray-200 bg-gray-100' : 
//         'border-gray-300 group-hover:border-teal-300'
//     }`}>
//         {sameAddress && (
//             <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//             </svg>
//         )}
//     </div>
// </div>
// <span className={`text-sm font-medium transition-colors duration-200 ${
//     !isCurrentAddressComplete(values) ? 'text-gray-400' : 
//     'text-gray-700 group-hover:text-teal-600'
// }`}>
//     Permanent address is same as current address
// </span>
// </label>
//                                 </div>

//                                 {(
//                                     <div className="space-y-6">
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-medium text-gray-700">
//                                                 Complete Address<span className="text-red-500 ml-1">*</span>
//                                             </label>
//                                             <Field
//                                                 name="permanentAddress.street"
//                                                 as="textarea"
//                                                 rows="3"
//                                                 placeholder="Enter complete permanent address"
//                                                 className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
//                                             />
//                                             <ErrorMessage name="permanentAddress.street" component="p" className="text-red-500 text-sm" />
//                                         </div>

//                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                             <div className="space-y-2">
//                                                 <label className="block text-sm font-medium text-gray-700">
//                                                     City<span className="text-red-500 ml-1">*</span>
//                                                 </label>
//                                                 <Field
//                                                     name="permanentAddress.city"
//                                                     type="text"
//                                                     placeholder="Enter city"
//                                                     className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                                 />
//                                                 <ErrorMessage name="permanentAddress.city" component="p" className="text-red-500 text-sm" />
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <label className="block text-sm font-medium text-gray-700">
//                                                     State<span className="text-red-500 ml-1">*</span>
//                                                 </label>
//                                                 <Field
//                                                     name="permanentAddress.state"
//                                                     type="text"
//                                                     placeholder="Enter state"
//                                                     className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                                 />
//                                                 <ErrorMessage name="permanentAddress.state" component="p" className="text-red-500 text-sm" />
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <label className="block text-sm font-medium text-gray-700">
//                                                     Pincode<span className="text-red-500 ml-1">*</span>
//                                                 </label>
//                                                 <Field
//                                                     name="permanentAddress.pincode"
//                                                     type="text"
//                                                     maxLength="6"
//                                                     placeholder="Enter pincode"
//                                                     className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                                 />
//                                                 <ErrorMessage name="permanentAddress.pincode" component="p" className="text-red-500 text-sm" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Family Reference Section */}
//                             <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
//                                 <div className="flex items-center gap-3 mb-6">
//                                     <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
//                                         <Users className="w-4 h-4 text-white" />
//                                     </div>
//                                     <h2 className="text-xl font-semibold text-gray-800">Family Reference</h2>
//                                 </div>
                                
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Reference Name<span className="text-red-500 ml-1">*</span>
//                                         </label>
//                                         <Field
//                                             name="familyReference.name"
//                                             type="text"
//                                             placeholder="Enter reference name"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                         />
//                                         <ErrorMessage name="familyReference.name" component="p" className="text-red-500 text-sm" />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Mobile Number<span className="text-red-500 ml-1">*</span>
//                                         </label>
//                                         <Field
//                                             name="familyReference.mobileNumber"
//                                             type="text"
//                                             maxLength="10"
//                                             placeholder="Enter mobile number"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                         />
//                                         <ErrorMessage name="familyReference.mobileNumber" component="p" className="text-red-500 text-sm" />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Email<span className="text-red-500 ml-1">*</span>
//                                         </label>
//                                         <Field
//                                             name="familyReference.email"
//                                             type="email"
//                                             placeholder="Enter email"
//                                             className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//                                         />
//                                         <ErrorMessage name="familyReference.email" component="p" className="text-red-500 text-sm" />
//                                     </div>

//                                     <div className="space-y-2">
//     <label className="block text-sm font-medium text-gray-700">
//         Reference Relation<span className="text-red-500 ml-1">*</span>
//     </label>
//     <Field
//         as="select"
//         name="familyReference.relation"
//         className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
//     >
//         <option value="">Select relationship</option>
//         <option value="Father">Father</option>
//         <option value="Mother">Mother</option>
//         <option value="Brother">Brother</option>
//         <option value="Sister">Sister</option>
//         <option value="Husband">Husband</option>
//         <option value="Spouse">Spouse</option>
//     </Field>
//     <ErrorMessage name="familyReference.relation" component="p" className="text-red-500 text-sm" />
// </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <label className="block text-sm font-medium text-gray-700">
//                                         Address<span className="text-red-500 ml-1">*</span>
//                                     </label>
//                                     <Field
//                                         name="familyReference.address"
//                                         as="textarea"
//                                         rows="3"
//                                         placeholder="Enter complete address"
//                                         className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
//                                     />
//                                     <ErrorMessage name="familyReference.address" component="p" className="text-red-500 text-sm" />
//                                 </div>
//                             </div>

//                             {/* Navigation Buttons */}
//                             <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                                
//                                 <button 
//                                     disabled={loader} 
//                                     type='submit' 
//                                     className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
//                                 >
//                                     {loader ? (
//                                         <BeatLoader color="#fff" size={8} />
//                                     ) : (
//                                         <>
//                                             Next
//                                             <ChevronRight className="w-4 h-4" />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//         </div>
        
//         </div>
//     )
// }

// export default PersonalDetails;

// "use client"
// import { useAuth } from '@/lib/AuthContext';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState, useCallback } from 'react';
// import { 
//   User, Mail, Phone, Calendar, MapPin, FileText, Users, Shield, 
//   Camera, Star, Award, Verified, Edit3, Bell, Settings, ChevronDown,
//   History, LogOut, Download, CreditCard, PlusCircle, Smartphone,
//   ExternalLink, Hash
// } from 'lucide-react';
// import confetti from 'canvas-confetti';


// import ReviewSection from '@/components/Web/profile/ReviewSection';
// import AppDownloadSection from '@/components/Web/profile/AppDownloadSection';
// import ProtectedRoute from '@/components/Web/profile/ProtectRoute';
// import UserFooter from '@/components/Web/profile/UserFooter';
// import VerificationComponent from '@/components/Web/profile/VerificationComponent';

// // Token refresh utility function
// const refreshAccessToken = async () => {
//   try {
//     const currentToken = localStorage.getItem('token');
//     if (!currentToken) {
//       throw new Error('No token available');
//     }

//     const response = await fetch('https://api.atdmoney.in/api/user/refresh', {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${currentToken}`
//       }
//     });

//     if (!response.ok) {
//       throw new Error('Token refresh failed');
//     }

//     const data = await response.json();
    
//     // Store new token
//     localStorage.setItem('token', data.access_token);
//     console.log('Token refreshed successfully');
    
//     return data.access_token;
//   } catch (error) {
//     console.error('Token refresh error:', error);
//     // Clear invalid token and redirect to login
//     localStorage.removeItem('token');
//     window.location.href = '/userlogin';
//     throw error;
//   }
// };

// export default function Profile() {
//   const router = useRouter();
//   const { user, loading, fetchUserData } = useAuth();
//   const [imageError, setImageError] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [registrationStep, setRegistrationStep] = useState(1);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);


//   // Token refresh handler
//   const handleTokenRefresh = useCallback(async () => {
//     if (isRefreshing) return;
    
//     setIsRefreshing(true);
//     try {
//       const newToken = await refreshAccessToken();
      
//       // Optionally refetch user data with new token
//       if (fetchUserData) {
//         await fetchUserData();
//       }
      
//       return newToken;
//     } catch (error) {
//       console.error('Failed to refresh token:', error);
//       // User will be redirected to login by refreshAccessToken function
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, [fetchUserData, isRefreshing]);

//   // Enhanced API call wrapper with automatic retry on 401
//   const apiCallWithRefresh = useCallback(async (apiCall) => {
//     try {
//       return await apiCall();
//     } catch (error) {
//       // If we get 401 (unauthorized), try refreshing token once
//       if (error.response?.status === 401 || error.status === 401) {
//         console.log('Token expired, attempting refresh...');
//         try {
//           await handleTokenRefresh();
//           // Retry the original API call with new token
//           return await apiCall();
//         } catch (refreshError) {
//           console.error('Token refresh failed, redirecting to login');
//           throw refreshError;
//         }
//       }
//       throw error;
//     }
//   }, [handleTokenRefresh]);

//   // Initial token check and setup automatic refresh
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/signup');
//       return;
//     }

//     // Set up interval to refresh token every 18 minutes (before 20-minute expiry)
//     const refreshInterval = setInterval(() => {
//       handleTokenRefresh();
//     }, 18 * 60 * 1000); // 18 minutes in milliseconds

//     // Initial refresh if token is close to expiry
//     const lastRefresh = localStorage.getItem('lastTokenRefresh');
//     const now = Date.now();
    
//     if (!lastRefresh || (now - parseInt(lastRefresh)) > 15 * 60 * 1000) {
//       handleTokenRefresh().then(() => {
//         localStorage.setItem('lastTokenRefresh', now.toString());
//       });
//     }

//     // Cleanup interval on component unmount
//     return () => clearInterval(refreshInterval);
//   }, [router, handleTokenRefresh]);

//   // Enhanced user data fetch with token refresh
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token && !loading && !user) {
//       console.log('User data missing, retrying...');
      
//       apiCallWithRefresh(async () => {
//         return await fetchUserData();
//       }).catch(error => {
//         console.error('Failed to fetch user data:', error);
//       });
//     }
//   }, [user, loading, fetchUserData, apiCallWithRefresh]);

//   // Registration step fetch with error handling
//   useEffect(() => {
//     const fetchRegistrationStep = async () => {
//       try {
//         await apiCallWithRefresh(async () => {
//           // Your registration step API call here
//           setRegistrationStep(11);
//           return Promise.resolve();
//         });
//       } catch (error) {
//         console.error('Error fetching registration step:', error);
//       }
//     };
    
//     if (user) {
//       fetchRegistrationStep();
//     }
//   }, [user, apiCallWithRefresh]);

//   // Add token refresh on user activity (optional - for better UX)
//   useEffect(() => {
//     const handleUserActivity = () => {
//       const token = localStorage.getItem('token');
//       if (token && !isRefreshing) {
//         const lastRefresh = localStorage.getItem('lastTokenRefresh');
//         const now = Date.now();
        
//         // Refresh if last refresh was more than 15 minutes ago
//         if (!lastRefresh || (now - parseInt(lastRefresh)) > 15 * 60 * 1000) {
//           handleTokenRefresh().then(() => {
//             localStorage.setItem('lastTokenRefresh', now.toString());
//           });
//         }
//       }
//     };

//     // Listen for user activities
//     const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
//     events.forEach(event => {
//       document.addEventListener(event, handleUserActivity, { passive: true });
//     });

//     // Cleanup event listeners
//     return () => {
//       events.forEach(event => {
//         document.removeEventListener(event, handleUserActivity);
//       });
//     };
//   }, [handleTokenRefresh, isRefreshing]);

// // Confetti effect for successful registration
// useEffect(() => {
//   const showCongratulations = localStorage.getItem('showCongratulations');
//   if (showCongratulations === 'true' && user) {
//       // Remove the flag immediately
//       localStorage.removeItem('showCongratulations');
      
//       // Show modal and trigger confetti after a short delay
//       setTimeout(() => {
//           setShowCongratulationsModal(true);
          
//           // Confetti burst
//           confetti({
//               particleCount: 100,
//               spread: 70,
//               origin: { y: 0.6 }
//           });
          
//           // Multiple bursts for better effect
//           setTimeout(() => {
//               confetti({
//                   particleCount: 50,
//                   angle: 60,
//                   spread: 55,
//                   origin: { x: 0, y: 0.6 }
//               });
//           }, 250);
          
//           setTimeout(() => {
//               confetti({
//                   particleCount: 50,
//                   angle: 120,
//                   spread: 55,
//                   origin: { x: 1, y: 0.6 }
//               });
//           }, 400);
          
//       }, 500);
//   }
// }, [user]);

//   const calculateProgress = () => {
//     return Math.round((user.step / 11) * 100);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('lastTokenRefresh');
//     router.push('/userlogin');
//   };

//   const handleClientHistory = () => {
//     router.push('/client-history');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-slate-600 font-medium">
//             {isRefreshing ? 'Refreshing session...' : 'Loading your profile...'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-dashed border-slate-200">
//           <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="w-8 h-8 text-red-400" />
//           </div>
//           <p className="text-slate-700 mb-6">No profile data found</p>
//           <button 
//             onClick={() => {
//               apiCallWithRefresh(async () => {
//                 return await fetchUserData();
//               });
//             }}
//             className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
//             disabled={isRefreshing}
//           >
//             {isRefreshing ? 'Refreshing...' : 'Retry Loading'}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ProtectedRoute>
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
//       {/* Background Illustration */}
//       <div className="absolute inset-0 opacity-5 pointer-events-none">
//         <svg width="100%" height="100%" viewBox="0 0 1200 800" className="w-full h-full">
//           <defs>
//             <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
//               <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#grid)" />
//           <circle cx="200" cy="150" r="80" fill="currentColor" opacity="0.3"/>
//           <circle cx="1000" cy="200" r="120" fill="currentColor" opacity="0.2"/>
//           <circle cx="300" cy="600" r="60" fill="currentColor" opacity="0.4"/>
//           <circle cx="900" cy="650" r="90" fill="currentColor" opacity="0.3"/>
//           <polygon points="500,100 550,180 450,180" fill="currentColor" opacity="0.2"/>
//           <polygon points="700,500 780,580 620,580" fill="currentColor" opacity="0.3"/>
//         </svg>
//       </div>

//       {/* Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-lg">
//         {/* Enhanced Abstract Background */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {/* Animated Background Orbs */}
//           <div className="absolute inset-0">
//             <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/15 to-pink-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//             <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-teal-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
//           </div>

//           {/* Primary Wave Layer */}
//           <svg
//             className="absolute top-0 left-0 w-full h-full opacity-15"
//             viewBox="0 0 1200 120"
//             preserveAspectRatio="none"
//           >
//             <defs>
//               <linearGradient id="primaryWave" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#3b82f6" />
//                 <stop offset="20%" stopColor="#06b6d4" />
//                 <stop offset="40%" stopColor="#10b981" />
//                 <stop offset="60%" stopColor="#8b5cf6" />
//                 <stop offset="80%" stopColor="#ec4899" />
//                 <stop offset="100%" stopColor="#f59e0b" />
//               </linearGradient>
//               <filter id="glow">
//                 <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
//                 <feMerge> 
//                   <feMergeNode in="coloredBlur"/>
//                   <feMergeNode in="SourceGraphic"/>
//                 </feMerge>
//               </filter>
//             </defs>
//             <path
//               fill="url(#primaryWave)"
//               filter="url(#glow)"
//               d="M0,30 C200,80 400,10 600,50 C800,90 1000,20 1200,60 L1200,0 L0,0 Z"
//             />
//           </svg>

//           {/* Secondary Wave Layer */}
//           <svg
//             className="absolute top-0 left-0 w-full h-full opacity-10"
//             viewBox="0 0 1200 120"
//             preserveAspectRatio="none"
//           >
//             <defs>
//               <linearGradient id="secondaryWave" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#06b6d4" />
//                 <stop offset="30%" stopColor="#3b82f6" />
//                 <stop offset="70%" stopColor="#8b5cf6" />
//                 <stop offset="100%" stopColor="#ec4899" />
//               </linearGradient>
//             </defs>
//             <path
//               fill="url(#secondaryWave)"
//               d="M0,60 C300,20 500,80 800,40 C1000,10 1100,70 1200,30 L1200,0 L0,0 Z"
//             />
//           </svg>

//           {/* Floating Geometric Elements */}
//           <div className="absolute top-4 right-4 hidden lg:block">
//             <div className="relative">
//               <div className="w-16 h-16 border-2 border-blue-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
//               <div className="absolute top-2 left-2 w-12 h-12 border-2 border-cyan-400/40 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
//               <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-purple-400/50 to-pink-400/50 rounded-full animate-pulse"></div>
//             </div>
//           </div>

//           {/* Simplified Left Side Decorative Elements */}
//           <div className="absolute top-8 left-4 hidden md:block">
//             <div className="space-y-2">
//               <div className="w-3 h-3 bg-blue-400/40 rounded-full animate-pulse"></div>
//               <div className="w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
//               <div className="w-4 h-4 bg-teal-400/35 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
//             </div>
//           </div>

//           {/* Corner Accents */}
//           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400/20 via-pink-300/15 to-transparent rounded-full blur-2xl"></div>
//           <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-teal-400/20 via-blue-300/15 to-transparent rounded-full blur-2xl"></div>
//         </div>

//         <div className="relative px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-3 md:space-x-4">
//             {/* Logo */}
//             <div className="flex-shrink-0">
//               <img 
//                 src="/atdlogo.png" 
//                 alt="ATD Finance Logo" 
//                 className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
//               />
//             </div>
            
//             {/* Brand Text */}
//             <div className="flex flex-col">
//               <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 drop-shadow-sm">
//                 ATD MONEY
//               </h1>
//               <p className="text-sm text-slate-600/80 hidden sm:block font-medium">
//                 Welcome back, {user.fname}
//                 {isRefreshing && <span className="ml-2 text-blue-500">(Refreshing...)</span>}
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-3 md:space-x-4">
//             {/* Profile Dropdown */}
//             <div 
//               className="relative group"
//               onMouseEnter={() => setShowProfileMenu(true)}
//               onMouseLeave={() => setShowProfileMenu(false)}
//             >
//               <button className="flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 rounded-xl px-3 md:px-4 py-2 transition-all duration-300 hover:shadow-md border border-slate-200/50">
//                 <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 rounded-full flex items-center justify-center shadow-md">
//                   <span className="text-white font-semibold text-sm">{user.fname?.[0]}</span>
//                 </div>
//                 <span className="text-slate-700 font-medium hidden sm:block">{user.fname}</span>
//                 <ChevronDown className={`w-4 h-4 text-slate-500 transition-all duration-300 ${showProfileMenu ? 'rotate-180 text-blue-500' : ''}`} />
//               </button>
              
//               {/* Dropdown Menu */}
//               <div className={`absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 py-2 transition-all duration-300 ${
//                 showProfileMenu 
//                   ? 'opacity-100 translate-y-0 pointer-events-auto' 
//                   : 'opacity-0 -translate-y-2 pointer-events-none'
//               }`}>
//                 <button 
//                   onClick={handleClientHistory}
//                   className="w-full px-4 py-3 text-left hover:bg-blue-50/50 flex items-center space-x-3 transition-all duration-200 group/item"
//                 >
//                   <History className="w-4 h-4 text-slate-500 group-hover/item:text-blue-500 transition-colors" />
//                   <span className="text-slate-700 group-hover/item:text-blue-600 font-medium">Client History</span>
//                 </button>
//                 <div className="h-px bg-slate-200/50 mx-2 my-1"></div>
//                 <button 
//                   onClick={handleLogout}
//                   className="w-full px-4 py-3 text-left hover:bg-red-50/50 flex items-center space-x-3 transition-all duration-200 text-red-600 group/item"
//                 >
//                   <LogOut className="w-4 h-4 group-hover/item:text-red-700 transition-colors" />
//                   <span className="group-hover/item:text-red-700 font-medium">Logout</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content - Fixed spacing to account for fixed header */}
//       <div className="pt-28 px-4 md:px-8 lg:px-12 py-6 relative z-10">
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Left Column - Profile Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg border border-dashed border-purple-300 p-6 text-center">
//               <div className="relative inline-block mb-6">
//                 <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
//                   {user.selfie && !imageError ? (
//                     <img 
//                       src={`/${user.selfie}`} 
//                       alt="Profile"
//                       className="w-full h-full object-cover"
//                       onError={() => setImageError(true)}
//                     />
//                   ) : (
//                     <User className="w-12 h-12 text-blue-400" />
//                   )}
//                 </div>
//                 <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full border-2 border-white flex items-center justify-center transition-colors">
//                   <Camera className="w-4 h-4 text-white" />
//                 </button>
//               </div>
              
//               <h2 className="text-xl font-bold text-slate-800 mb-1">{user.fname} {user.lname}</h2>
//               <p className="text-slate-500 mb-4">ID: {user.accountId}</p>
              
//               {/* Contact Information */}
//               <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-center space-x-2 text-sm">
//                     <Phone className="w-4 h-4 text-blue-500" />
//                     <span className="font-medium text-slate-700">{user.phone || 'Not provided'}</span>
//                     {user.phone_verified === 1 && <Verified className="w-4 h-4 text-green-500" />}
//                   </div>
//                   <div className="flex items-center justify-center space-x-2 text-sm">
//                     <Mail className="w-4 h-4 text-purple-500" />
//                     <span className="font-medium text-slate-700">{user.email || 'Not provided'}</span>
//                     {user.email_verified === 1 && <Verified className="w-4 h-4 text-green-500" />}
//                   </div>
//                 </div>
//               </div>

//               {/* Registration Progress */}
//               <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 mb-6">
//                 <div className="flex items-center justify-center space-x-2 mb-3">
//                   <Star className="w-5 h-5 text-blue-500" />
//                   <span className="font-semibold text-slate-700">Registration Progress</span>
//                 </div>
//                 <div className="text-2xl font-bold text-blue-600 mb-2">{calculateProgress()}%</div>
//                 <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
//                   <div 
//                     className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
//                     style={{ width: `${calculateProgress()}%` }}
//                   ></div>
//                 </div>
//               </div>

//               {calculateProgress() < 100 && (
//                 <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl mb-6">
//                   <Edit3 className="w-4 h-4" />
//                   <span>Complete Profile</span>
//                 </button>
//               )}

//               {/* Action Buttons - Fixed positioning */}
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-out hover:from-emerald-600 hover:to-teal-700 border border-emerald-400/20">
//                   Pay Now
//                 </button> 
                
//                 <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-out hover:from-blue-600 hover:to-purple-700 border border-blue-400/20">
//                   Apply For New Loan
//                 </button> 
//               </div>
//             </div>

           
//             <VerificationComponent/>
//           </div>

//           {/* Right Column - Information Cards */}
//           <div className="lg:col-span-2">
//             <div className="space-y-6">
//               {/* Information Cards Row */}
//               <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//                 {/* Personal Information */}
//                 <div className="bg-white rounded-2xl shadow-md border border-dashed border-blue-300 overflow-hidden">
//                   <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-slate-200">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                         <User className="w-6 h-6 text-white" />
//                       </div>
//                       <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <div className="space-y-4">
//                       <InfoItem label="Full Name" value={`${user.fname} ${user.lname}`} icon={User} />
//                       <InfoItem label="Date of Birth" value={user.dob} icon={Calendar} />
//                       <InfoItem label="Gender" value={user.gender} icon={User} />
//                       <InfoItem label="Father's Name" value={user.fathername} icon={User} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Account Details */}
//                 <div className="bg-white rounded-2xl shadow-md border border-dashed border-green-300 overflow-hidden">
//                   <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-slate-200">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
//                         <FileText className="w-6 h-6 text-white" />
//                       </div>
//                       <h3 className="text-lg font-bold text-slate-800">Account Details</h3>
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <div className="space-y-4">
//                       <InfoItem label="CRN Number" value={user.crnno || 'Not provided'} icon={Hash} />
//                       <InfoItem label="Account Number" value={user.accountId || 'Not provided'} icon={CreditCard} />
//                       <InfoItem label="Aadhar Number" value={user.aadhar_no || 'Not provided'} icon={CreditCard} />
//                       <InfoItem label="PAN Number" value={user.pan_no || 'Not provided'} icon={FileText} />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <ReviewSection/>

//               <AppDownloadSection/>
//             </div>
//           </div>
//         </div>
//       </div>
//       <UserFooter/>
//     </div>
//     {/* Congratulations Modal */}
// {showCongratulationsModal && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//     {/* Backdrop */}
//     <div 
//       className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//       onClick={() => setShowCongratulationsModal(false)}
//     ></div>
    
//     {/* Modal */}
//     <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-bounce">
//       {/* Close Button */}
//       <button
//         onClick={() => setShowCongratulationsModal(false)}
//         className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
//       >
//         <span className="text-gray-500 text-xl leading-none">&times;</span>
//       </button>
      
//       {/* Modal Content */}
//       <div className="p-8 text-center">
//         {/* Celebration Icon */}
//         <div className="mb-6">
//           <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
//             <span className="text-4xl">🎉</span>
//           </div>
//           <div className="flex justify-center space-x-2">
//             <span className="text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🎊</span>
//             <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
//             <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎈</span>
//           </div>
//         </div>
        
//         {/* Congratulations Text */}
//         <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//           Congratulations!
//         </h2>
//         <p className="text-xl text-gray-700 font-semibold mb-4">
//           {user.fname} 🎊
//         </p>
//         <p className="text-gray-600 mb-6 leading-relaxed">
//           Your registration has been completed successfully! 
//           Welcome to ATD Money family.
//         </p>
        
//         {/* Success Badge */}
//         <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 mb-6">
//           <span className="text-green-500">✅</span>
//           <span className="font-medium">Registration Complete</span>
//         </div>
        
//         {/* Close Button */}
//         <button
//           onClick={() => setShowCongratulationsModal(false)}
//           className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
//         >
//           Get Started! 🚀
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </ProtectedRoute>
//   );
// }

// const InfoItem = ({ label, value, icon: Icon }) => (
//   <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-200">
//     <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm">
//       <Icon className="w-5 h-5 text-slate-500" />
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="text-sm font-semibold text-slate-600 mb-1">{label}</p>
//       <p className="text-slate-800 font-medium break-words">{value || 'Not provided'}</p>
//     </div>
//   </div>
// );


